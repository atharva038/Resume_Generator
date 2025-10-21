import {GoogleGenerativeAI} from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Prompt template for parsing raw resume text into structured JSON
 */
const PARSE_RESUME_PROMPT = `You are an expert resume parser. Extract and structure the following resume text into a JSON format.

IMPORTANT RULES:
1. Extract ALL information accurately from the resume
2. For dates, use format "Month YYYY" (e.g., "Jan 2024")
3. Parse bullet points carefully, keeping all details
4. If information is missing, use empty strings or empty arrays
5. Preserve all contact information found

Required JSON structure:
{
  "name": "Full Name",
  "contact": {
    "email": "email@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "portfolio": "website.com",
    "location": "City, State/Country"
  },
  "summary": "Professional summary or objective",
  "skills": [
    {
      "category": "Technical Skills",
      "items": ["skill1", "skill2", "skill3"]
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "location": "City, State",
      "startDate": "Month YYYY",
      "endDate": "Month YYYY or Present",
      "current": false,
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "location": "City, State",
      "startDate": "Month YYYY",
      "endDate": "Month YYYY",
      "gpa": "3.8/4.0",
      "bullets": ["Relevant coursework", "Honors"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["tech1", "tech2"],
      "link": "github.com/project",
      "bullets": ["Key feature 1", "Key feature 2"]
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Month YYYY",
      "credentialId": "ID123456",
      "link": "credential-url"
    }
  ]
}

Resume Text:
${"{resumeText}"}

Return ONLY valid JSON with no additional text or markdown formatting.`;

/**
 * Prompt template for enhancing resume section content to be ATS-friendly
 */
const ENHANCE_CONTENT_PROMPT = `You are an expert resume writer specializing in ATS (Applicant Tracking System) optimization.

TASK: Rewrite the following resume content to be more ATS-friendly and impactful.

CRITICAL RULES:
1. **ANALYZE EXPERIENCE LEVEL FIRST**: Based on the full resume context, determine if this is a fresher, junior (1-2 years), or senior (3+ years) professional
2. **MAINTAIN EXPERIENCE LEVEL**: DO NOT add fake experience, projects, or achievements. Only enhance what already exists
3. **STRICT LENGTH LIMITS**:
   - Summary: Maximum 50 words (3-4 lines)
   - Each bullet point: Maximum 15 words (1 line)
   - Project descriptions: Maximum 30 words (2 lines)
4. **ATS OPTIMIZATION**:
   - Start each bullet with strong action verbs (Led, Developed, Implemented, Achieved, etc.)
   - Quantify achievements with numbers, percentages, or metrics when possible
   - Use industry-standard keywords relevant to the role
   - Focus on impact and results, not just responsibilities
5. **FORMATTING**:
   - Remove personal pronouns (I, my, we)
   - Use past tense for previous roles, present tense for current roles
   - Ensure technical terms are spelled correctly
6. **CONTENT INTEGRITY**:
   - Keep content concise to maintain 1-page resume length
   - Don't invent metrics or achievements
   - Preserve the user's actual work history and skill level

Full Resume Context:
{resumeContext}

Section Type: {sectionType}
Content to enhance:
{content}

Return enhanced content in the same structure (array of strings for bullets, single string for summary).
Return ONLY the enhanced content without explanations or additional formatting.`;

/**
 * Parse raw resume text into structured JSON using Gemini
 * @param {string} resumeText - Raw extracted text from resume
 * @returns {Promise<Object>} - Structured resume data
 */
export async function parseResumeWithAI(resumeText) {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    const prompt = PARSE_RESUME_PROMPT.replace("{resumeText}", resumeText);

    console.log("🤖 Calling Gemini API to parse resume...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Parse JSON
    const parsedData = JSON.parse(cleanedText);

    console.log("✅ Resume parsed successfully by AI");
    return parsedData;
  } catch (error) {
    console.error("❌ Gemini parsing error:", error.message);
    throw new Error(`Failed to parse resume with AI: ${error.message}`);
  }
}

/**
 * Enhance resume content using Gemini to make it more ATS-friendly
 * @param {string} content - Content to enhance (string or JSON string of array)
 * @param {string} sectionType - Type of section (experience, education, summary, etc.)
 * @returns {Promise<string|Array>} - Enhanced content
 */
export async function enhanceContentWithAI(
  content,
  sectionType = "experience",
  resumeData = null,
  customPrompt = ""
) {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    // Format content for the prompt
    let contentStr = content;
    if (typeof content !== "string") {
      contentStr = JSON.stringify(content, null, 2);
    }

    // Prepare resume context for experience level detection
    let resumeContext = "No full resume context provided";
    if (resumeData) {
      // Extract key info for context: experience level, skills, education
      const experienceCount = resumeData.experience?.length || 0;
      const hasProjects = resumeData.projects && resumeData.projects.length > 0;
      const yearsOfExperience =
        resumeData.experience?.reduce((total, exp) => {
          // Rough calculation of years from dates
          if (exp.startDate && exp.endDate) {
            const start = new Date(exp.startDate);
            const end = exp.current ? new Date() : new Date(exp.endDate);
            const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
            return total + years;
          }
          return total;
        }, 0) || 0;

      const level =
        experienceCount === 0
          ? "FRESHER"
          : yearsOfExperience < 2
          ? "JUNIOR (1-2 years)"
          : "SENIOR (3+ years)";

      resumeContext = `
Experience Level: ${level}
Number of work experiences: ${experienceCount}
Total years of experience: ${Math.round(yearsOfExperience)} years
Has projects: ${hasProjects}
Education: ${
        resumeData.education?.map((e) => e.degree).join(", ") || "Not specified"
      }
Skills count: ${
        resumeData.skills?.reduce(
          (sum, cat) => sum + (cat.items?.length || 0),
          0
        ) || 0
      }

IMPORTANT: This is a ${level} resume. Do not add or invent any experience or achievements that don't exist.
`;
    }

    // Add custom prompt if provided
    let customInstructions = "";
    if (customPrompt && customPrompt.trim()) {
      customInstructions = `

ADDITIONAL CUSTOM INSTRUCTIONS FROM USER:
${customPrompt.trim()}

YOU MUST follow these custom instructions while maintaining all the critical rules above.
`;
    }

    const prompt =
      ENHANCE_CONTENT_PROMPT.replace("{resumeContext}", resumeContext)
        .replace("{sectionType}", sectionType)
        .replace("{content}", contentStr) + customInstructions;

    console.log(`🤖 Calling Gemini API to enhance ${sectionType}...`);
    if (customPrompt) {
      console.log(`📝 Custom instructions: ${customPrompt}`);
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean response
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Try to parse as JSON array if it looks like JSON
    if (text.startsWith("[") || text.startsWith("{")) {
      try {
        return JSON.parse(text);
      } catch {
        // If parsing fails, return as string
        return text;
      }
    }

    console.log(`✅ Content enhanced successfully for ${sectionType}`);
    return text;
  } catch (error) {
    console.error("❌ Gemini enhancement error:", error.message);
    throw new Error(`Failed to enhance content with AI: ${error.message}`);
  }
}

/**
 * Generate a professional summary using Gemini based on resume data
 * @param {Object} resumeData - Structured resume data
 * @returns {Promise<string>} - Generated professional summary
 */
export async function generateSummaryWithAI(resumeData) {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    const prompt = `Generate a concise, impactful professional summary (3-4 lines) for this resume. Focus on key skills, experience, and value proposition. Use third person and avoid personal pronouns.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return only the summary text without any additional formatting or explanations.`;

    console.log("🤖 Calling Gemini API to generate summary...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    console.log("✅ Summary generated successfully");
    return text;
  } catch (error) {
    console.error("❌ Gemini summary generation error:", error.message);
    throw new Error(`Failed to generate summary with AI: ${error.message}`);
  }
}

/**
 * Categorize skills using AI into relevant categories
 * @param {string} skillsText - Comma-separated or line-separated skills
 * @returns {Promise<Array>} - Categorized skills array
 */
export async function categorizeSkillsWithAI(skillsText) {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    const prompt = `You are an expert technical recruiter. Categorize the following skills into relevant categories.

RULES:
1. Common categories: Programming Languages, Frameworks & Libraries, Databases, Cloud & DevOps, Tools & Technologies, Soft Skills, etc.
2. Create categories that make sense for the skills provided
3. Each skill should appear in only ONE category
4. Use clear, professional category names
5. If a skill is vague or unclear, place it in the most appropriate category
6. Remove duplicates and normalize skill names (e.g., "React.js" → "React", "nodejs" → "Node.js")

Skills to categorize:
${skillsText}

Return ONLY a valid JSON array in this exact format:
[
  {
    "category": "Programming Languages",
    "items": ["JavaScript", "Python", "Java"]
  },
  {
    "category": "Frameworks & Libraries", 
    "items": ["React", "Node.js", "Express"]
  }
]

Return ONLY valid JSON with no additional text, explanations, or markdown formatting.`;

    console.log("🤖 Calling Gemini API to categorize skills...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean response - remove markdown code blocks if present
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Parse JSON
    const categorizedSkills = JSON.parse(text);

    // Validate structure
    if (!Array.isArray(categorizedSkills)) {
      throw new Error("Invalid response format from AI");
    }

    console.log(
      "✅ Skills categorized successfully:",
      categorizedSkills.length,
      "categories"
    );
    return categorizedSkills;
  } catch (error) {
    console.error("❌ Gemini skill categorization error:", error.message);
    throw new Error(`Failed to categorize skills with AI: ${error.message}`);
  }
}

/**
 * Segregate achievements from paragraph format into bullet points
 * @param {string} achievementsText - Paragraph or mixed format achievements
 * @returns {Promise<Array>} - Array of achievement bullet points
 */
export async function segregateAchievementsWithAI(achievementsText) {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    const prompt = `You are an expert resume writer. Convert the following achievements text into clear, impactful bullet points.

RULES:
1. Each achievement should be a separate bullet point
2. Start each bullet with a strong action verb (Led, Achieved, Developed, Increased, etc.)
3. Quantify achievements with numbers, percentages, or metrics when possible
4. Keep each bullet concise (1-2 lines maximum)
5. Remove redundant information
6. Focus on impact and results
7. Use past tense for completed achievements
8. Remove personal pronouns (I, my, we)
9. If text is already in bullet format, improve and optimize it

Achievements text:
${achievementsText}

Return ONLY a valid JSON array of achievement strings:
["Achievement 1", "Achievement 2", "Achievement 3"]

Return ONLY valid JSON with no additional text, explanations, or markdown formatting.`;

    console.log("🤖 Calling Gemini API to segregate achievements...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean response - remove markdown code blocks if present
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Parse JSON
    const achievements = JSON.parse(text);

    // Validate structure
    if (!Array.isArray(achievements)) {
      throw new Error("Invalid response format from AI");
    }

    console.log(
      "✅ Achievements segregated successfully:",
      achievements.length,
      "items"
    );
    return achievements;
  } catch (error) {
    console.error("❌ Gemini achievement segregation error:", error.message);
    throw new Error(
      `Failed to segregate achievements with AI: ${error.message}`
    );
  }
}

/**
 * Process custom section content with AI
 * @param {string} content - Custom section content (paragraph or mixed format)
 * @param {string} sectionTitle - Title of the custom section for context
 * @returns {Promise<Array>} - Array of formatted bullet points
 */
export async function processCustomSectionWithAI(
  content,
  sectionTitle = "Custom Section"
) {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    const prompt = `You are an expert resume writer. Format the following content from a resume section titled "${sectionTitle}" into clear, professional bullet points.

RULES:
1. Convert content into clear, concise bullet points
2. Start each bullet with a strong action verb when appropriate
3. Quantify with numbers, percentages, or metrics when available
4. Keep each bullet concise (1-2 lines maximum)
5. Remove redundant or vague information
6. Focus on specific details and achievements
7. Use professional language appropriate for a resume
8. Remove personal pronouns (I, my, we)
9. If already in bullet format, improve and optimize it

Section: ${sectionTitle}
Content:
${content}

Return ONLY a valid JSON array of formatted strings:
["Point 1", "Point 2", "Point 3"]

Return ONLY valid JSON with no additional text, explanations, or markdown formatting.`;

    console.log(
      `🤖 Calling Gemini API to process custom section: ${sectionTitle}...`
    );
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean response - remove markdown code blocks if present
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Parse JSON
    const formattedContent = JSON.parse(text);

    // Validate structure
    if (!Array.isArray(formattedContent)) {
      throw new Error("Invalid response format from AI");
    }

    console.log(
      `✅ Custom section processed successfully: ${formattedContent.length} items`
    );
    return formattedContent;
  } catch (error) {
    console.error("❌ Gemini custom section processing error:", error.message);
    throw new Error(
      `Failed to process custom section with AI: ${error.message}`
    );
  }
}

/**
 * Analyze resume against job description for ATS match scoring
 * @param {string} resumeText - Full resume text
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Object>} - Analysis result with match score, keywords, strengths, improvements
 */
export async function analyzeResumeJobMatch(resumeText, jobDescription) {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach.

TASK: Analyze how well a resume matches a job description and provide detailed insights.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

ANALYSIS REQUIREMENTS:
1. **Match Score (0-100)**: Calculate overall compatibility based on:
   - Keyword overlap (40%)
   - Skills alignment (30%)
   - Experience relevance (20%)
   - Education match (10%)

2. **Keyword Analysis**:
   - Extract top 10 important keywords from job description
   - Identify which keywords are MISSING from the resume
   - Identify which keywords are PRESENT in the resume

3. **Strengths**: List 3-5 strong points that make this candidate suitable
   (e.g., "Has 5 years of Python experience as required", "Leadership experience matches job needs")

4. **Improvement Tips**: Provide 3-5 specific, actionable suggestions
   (e.g., "Add metrics to project descriptions", "Include missing keyword: Docker")

5. **Eligibility**: Determine if candidate is likely to pass ATS screening (true/false)
   - True if match_score >= 60
   - False if match_score < 60

CRITICAL RULES:
- Be honest and realistic with scoring
- Focus on hard skills and keywords for ATS compatibility
- Provide specific, actionable improvements
- Missing keywords should be relevant and important (not filler words)

Return ONLY a valid JSON object in this exact format:
{
  "match_score": 85,
  "eligible": true,
  "missing_keywords": ["Docker", "Kubernetes", "CI/CD"],
  "present_keywords": ["Python", "React", "Node.js", "AWS"],
  "strengths": [
    "Has 5+ years of full-stack development experience",
    "Strong leadership and team management background",
    "Relevant project experience with similar tech stack"
  ],
  "improvements": [
    "Add quantifiable metrics to project descriptions (e.g., 'Increased performance by 40%')",
    "Include missing keywords: Docker, Kubernetes in skills or projects",
    "Add more detail about cloud infrastructure experience",
    "Mention specific testing frameworks used"
  ]
}

Return ONLY valid JSON with no additional text, explanations, or markdown formatting.`;

    console.log("🤖 Calling Gemini API for resume-job match analysis...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean response - remove markdown code blocks if present
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Parse JSON
    const analysis = JSON.parse(text);

    // Validate structure
    if (
      typeof analysis.match_score !== "number" ||
      typeof analysis.eligible !== "boolean" ||
      !Array.isArray(analysis.missing_keywords) ||
      !Array.isArray(analysis.strengths) ||
      !Array.isArray(analysis.improvements)
    ) {
      throw new Error("Invalid response format from AI");
    }

    console.log(`✅ Resume-job match analyzed: ${analysis.match_score}% match`);
    return analysis;
  } catch (error) {
    console.error("❌ Gemini resume-job match analysis error:", error.message);
    throw new Error(
      `Failed to analyze resume-job match with AI: ${error.message}`
    );
  }
}

export default {
  parseResumeWithAI,
  enhanceContentWithAI,
  generateSummaryWithAI,
  categorizeSkillsWithAI,
  segregateAchievementsWithAI,
  processCustomSectionWithAI,
  analyzeResumeJobMatch,
};
