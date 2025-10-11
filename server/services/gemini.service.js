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

RULES:
1. Start each bullet with strong action verbs (Led, Developed, Implemented, Achieved, etc.)
2. Quantify achievements with numbers, percentages, or metrics whenever possible
3. Use industry-standard keywords relevant to the role
4. Keep bullets concise (1-2 lines max)
5. Focus on impact and results, not just responsibilities
6. Remove personal pronouns (I, my, we)
7. Use past tense for previous roles, present tense for current roles
8. Ensure technical terms are spelled correctly

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
  sectionType = "experience"
) {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    // Format content for the prompt
    let contentStr = content;
    if (typeof content !== "string") {
      contentStr = JSON.stringify(content, null, 2);
    }

    const prompt = ENHANCE_CONTENT_PROMPT.replace(
      "{sectionType}",
      sectionType
    ).replace("{content}", contentStr);

    console.log(`🤖 Calling Gemini API to enhance ${sectionType}...`);
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

export default {
  parseResumeWithAI,
  enhanceContentWithAI,
  generateSummaryWithAI,
};
