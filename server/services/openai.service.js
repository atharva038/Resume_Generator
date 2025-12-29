import OpenAI from "openai";

// Initialize OpenAI client (with fallback for missing API key)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Model configuration
const MODEL = "gpt-4o"; // GPT-4o for premium users
const MAX_TOKENS = 4096;

// ============================================
// RETRY CONFIGURATION
// ============================================

const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  retryableErrors: [
    429, // Rate limit exceeded
    500, // Internal server error
    502, // Bad gateway
    503, // Service unavailable
    504, // Gateway timeout
  ],
};

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay with jitter
 * @param {number} attempt - Current retry attempt number (0-based)
 * @returns {number} Delay in milliseconds
 */
function calculateBackoff(attempt) {
  const exponentialDelay = Math.min(
    RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
    RETRY_CONFIG.maxDelay
  );
  // Add jitter (±25%) to prevent thundering herd
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.floor(exponentialDelay + jitter);
}

/**
 * Check if error is retryable
 * @param {Error} error - Error object
 * @returns {boolean} Whether error should be retried
 */
function isRetryableError(error) {
  // Check HTTP status codes
  if (error.status && RETRY_CONFIG.retryableErrors.includes(error.status)) {
    return true;
  }

  // Check error messages for OpenAI-specific errors
  const errorMsg = error.message?.toLowerCase() || "";
  const retryableMessages = [
    "rate limit",
    "too many requests",
    "service unavailable",
    "timeout",
    "temporarily unavailable",
    "overloaded",
    "503",
    "502",
    "504",
  ];

  return retryableMessages.some((msg) => errorMsg.includes(msg));
}

/**
 * Retry wrapper with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {string} operationName - Name for logging
 * @returns {Promise<any>} Result from function
 */
async function retryWithBackoff(fn, operationName = "OpenAI API call") {
  let lastError;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        console.error(
          `❌ ${operationName} failed with non-retryable error:`,
          error.message
        );
        throw error;
      }

      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const delay = calculateBackoff(attempt);
        console.warn(
          `⚠️ ${operationName} failed (attempt ${attempt + 1}/${
            RETRY_CONFIG.maxRetries
          }): ${error.message}`
        );
        console.log(`⏳ Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  console.error(
    `❌ ${operationName} failed after ${RETRY_CONFIG.maxRetries} attempts:`,
    lastError.message
  );
  throw lastError;
}

/**
 * Extract token usage from OpenAI API response
 * @param {Object} response - OpenAI API response object
 * @returns {Object} Token usage information
 */
function extractTokenUsage(response) {
  try {
    const usage = response.usage;
    if (usage) {
      return {
        promptTokens: usage.prompt_tokens || 0,
        candidatesTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
      };
    }
  } catch (error) {
    console.warn("Could not extract token usage:", error.message);
  }
  return {
    promptTokens: 0,
    candidatesTokens: 0,
    totalTokens: 0,
  };
}

/**
 * Calculate cost for OpenAI API call
 * GPT-4o pricing: $2.50/1M input tokens, $10/1M output tokens
 * @param {Object} tokenUsage - Token usage object
 * @returns {Object} Cost in USD and INR
 */
function calculateCost(tokenUsage) {
  const inputCost = (tokenUsage.promptTokens / 1_000_000) * 2.5; // $2.50 per 1M tokens
  const outputCost = (tokenUsage.candidatesTokens / 1_000_000) * 10.0; // $10.00 per 1M tokens
  const totalCostUSD = inputCost + outputCost;
  const totalCostINR = totalCostUSD * 84; // Approximate conversion rate

  return {
    amount: totalCostUSD,
    amountINR: totalCostINR,
    currency: "USD",
  };
}

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
{resumeText}

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
 * Parse raw resume text into structured JSON using GPT-4o
 * @param {string} resumeText - Raw extracted text from resume
 * @returns {Promise<Object>} - Structured resume data
 */
export async function parseResumeWithAI(resumeText) {
  return retryWithBackoff(async () => {
    try {
      if (!openai) {
        throw new Error("OpenAI API key not configured");
      }

      const prompt = PARSE_RESUME_PROMPT.replace("{resumeText}", resumeText);

      console.log("🤖 Calling OpenAI GPT-4o to parse resume...");
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume parser. Return only valid JSON without markdown formatting.",
          },
          {role: "user", content: prompt},
        ],
        temperature: 0.3,
        max_tokens: MAX_TOKENS,
        response_format: {type: "json_object"},
      });

      const response = completion.choices[0];
      const text = response.message.content;

      // Extract token usage and calculate cost
      const tokenUsage = extractTokenUsage(completion);
      const cost = calculateCost(tokenUsage);

      // Parse JSON
      const parsedData = JSON.parse(text);

      console.log(
        `✅ Resume parsed with GPT-4o (Tokens: ${
          tokenUsage.totalTokens
        }, Cost: ₹${cost.amountINR.toFixed(2)})`
      );
      return {data: parsedData, tokenUsage, cost};
    } catch (error) {
      console.error("❌ OpenAI parsing error:", error.message);
      throw new Error(`Failed to parse resume with GPT-4o: ${error.message}`);
    }
  }, "OpenAI Resume Parsing");
}

/**
 * Enhance resume content using GPT-4o to make it more ATS-friendly
 * @param {string} content - Content to enhance (string or JSON string of array)
 * @param {string} sectionType - Type of section (experience, education, summary, etc.)
 * @param {Object} resumeData - Full resume context for better enhancement
 * @param {string} customPrompt - Optional custom prompt override
 * @returns {Promise<Object>} - Enhanced content with usage stats
 */
export async function enhanceContentWithAI(
  content,
  sectionType = "experience",
  resumeData = null,
  customPrompt = ""
) {
  try {
    const resumeContext = resumeData
      ? JSON.stringify(resumeData, null, 2)
      : "No additional context provided";

    const contentStr =
      typeof content === "string" ? content : JSON.stringify(content);

    let prompt = customPrompt;
    if (!customPrompt) {
      prompt = ENHANCE_CONTENT_PROMPT.replace("{resumeContext}", resumeContext)
        .replace("{sectionType}", sectionType)
        .replace("{content}", contentStr);
    }

    console.log(`🤖 Enhancing ${sectionType} content with GPT-4o...`);
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS-optimized resume writer. Be concise and impactful.",
        },
        {role: "user", content: prompt},
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = completion.choices[0];
    let enhancedContent = response.message.content.trim();

    // Extract token usage and calculate cost
    const tokenUsage = extractTokenUsage(completion);
    const cost = calculateCost(tokenUsage);

    // Clean markdown formatting if present
    if (enhancedContent.startsWith("```")) {
      enhancedContent = enhancedContent
        .replace(/^```json?\n?/, "")
        .replace(/\n?```$/, "");
    }

    // Try to parse as JSON if it looks like JSON
    try {
      if (enhancedContent.startsWith("[") || enhancedContent.startsWith("{")) {
        const parsed = JSON.parse(enhancedContent);

        // If parsed result is an array of objects (like projects), extract text only
        if (Array.isArray(parsed)) {
          enhancedContent = parsed.map((item) => {
            if (typeof item === "string") {
              return item;
            } else if (typeof item === "object" && item !== null) {
              // Extract meaningful text from object (e.g., project description)
              return (
                item.description ||
                item.text ||
                item.content ||
                item.name ||
                JSON.stringify(item)
              );
            }
            return String(item);
          });
        } else {
          enhancedContent = parsed;
        }
      }
    } catch (e) {
      // Keep as string if not valid JSON
      console.log("Content is not JSON, keeping as string");
    }

    console.log(
      `✅ Content enhanced with GPT-4o (Tokens: ${
        tokenUsage.totalTokens
      }, Cost: ₹${cost.amountINR.toFixed(2)})`
    );
    return {data: enhancedContent, tokenUsage, cost};
  } catch (error) {
    console.error("❌ OpenAI enhancement error:", error.message);
    throw new Error(`Failed to enhance content with GPT-4o: ${error.message}`);
  }
}

/**
 * Generate a professional summary using GPT-4o
 * @param {Object} resumeData - Complete resume data
 * @returns {Promise<Object>} - Generated summary with usage stats
 */
export async function generateSummaryWithAI(resumeData) {
  try {
    const prompt = `Generate a concise, ATS-optimized professional summary (maximum 50 words) based on this resume data:

${JSON.stringify(resumeData, null, 2)}

Return ONLY the summary text, no additional formatting or explanations.`;

    console.log("🤖 Generating professional summary with GPT-4o...");
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer. Create concise, impactful summaries.",
        },
        {role: "user", content: prompt},
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    const response = completion.choices[0];
    const summary = response.message.content.trim();

    // Extract token usage and calculate cost
    const tokenUsage = extractTokenUsage(completion);
    const cost = calculateCost(tokenUsage);

    console.log(
      `✅ Summary generated with GPT-4o (Tokens: ${
        tokenUsage.totalTokens
      }, Cost: ₹${cost.amountINR.toFixed(2)})`
    );
    return {data: summary, tokenUsage, cost};
  } catch (error) {
    console.error("❌ OpenAI summary generation error:", error.message);
    throw new Error(`Failed to generate summary with GPT-4o: ${error.message}`);
  }
}

/**
 * Categorize skills into logical groups using GPT-4o
 * @param {string} skillsText - Raw skills text or array
 * @returns {Promise<Object>} - Categorized skills with usage stats
 */
export async function categorizeSkillsWithAI(skillsText) {
  try {
    const prompt = `Categorize the following skills into logical groups (e.g., Programming Languages, Frameworks, Tools, etc.):

${skillsText}

Return as JSON array:
[
  {
    "category": "Category Name",
    "items": ["skill1", "skill2"]
  }
]`;

    console.log("🤖 Categorizing skills with GPT-4o...");
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a resume expert. Categorize skills logically. Return only valid JSON.",
        },
        {role: "user", content: prompt},
      ],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: {type: "json_object"},
    });

    const response = completion.choices[0];
    const text = response.message.content.trim();
    const categorizedSkills = JSON.parse(text);

    // Extract token usage and calculate cost
    const tokenUsage = extractTokenUsage(completion);
    const cost = calculateCost(tokenUsage);

    console.log(
      `✅ Skills categorized with GPT-4o (Tokens: ${
        tokenUsage.totalTokens
      }, Cost: ₹${cost.amountINR.toFixed(2)})`
    );
    return {data: categorizedSkills, tokenUsage, cost};
  } catch (error) {
    console.error("❌ OpenAI skills categorization error:", error.message);
    throw new Error(
      `Failed to categorize skills with GPT-4o: ${error.message}`
    );
  }
}

/**
 * Segregate achievements from experience bullets using GPT-4o
 * @param {string} achievementsText - Raw achievements text
 * @returns {Promise<Object>} - Segregated achievements with usage stats
 */
export async function segregateAchievementsWithAI(achievementsText) {
  try {
    const prompt = `Extract and organize achievements from the following text. Categorize them into:
- Technical Achievements
- Leadership & Management
- Business Impact
- Awards & Recognition

Input:
${achievementsText}

Return as JSON object with categories as keys and arrays of achievements as values.`;

    console.log("🤖 Segregating achievements with GPT-4o...");
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert at organizing professional achievements. Return only valid JSON.",
        },
        {role: "user", content: prompt},
      ],
      temperature: 0.4,
      max_tokens: 1024,
      response_format: {type: "json_object"},
    });

    const response = completion.choices[0];
    const text = response.message.content.trim();
    const segregatedAchievements = JSON.parse(text);

    // Extract token usage and calculate cost
    const tokenUsage = extractTokenUsage(completion);
    const cost = calculateCost(tokenUsage);

    console.log(
      `✅ Achievements segregated with GPT-4o (Tokens: ${
        tokenUsage.totalTokens
      }, Cost: ₹${cost.amountINR.toFixed(2)})`
    );
    return {data: segregatedAchievements, tokenUsage, cost};
  } catch (error) {
    console.error("❌ OpenAI achievement segregation error:", error.message);
    throw new Error(
      `Failed to segregate achievements with GPT-4o: ${error.message}`
    );
  }
}

/**
 * Process custom section content using GPT-4o
 * @param {string} sectionName - Name of custom section
 * @param {string} content - Content to process
 * @param {string} instructions - Processing instructions
 * @returns {Promise<Object>} - Processed content with usage stats
 */
export async function processCustomSectionWithAI(
  sectionName,
  content,
  instructions = "Enhance and format this content professionally"
) {
  try {
    const prompt = `Section: ${sectionName}

Instructions: ${instructions}

Content:
${content}

Return the processed content.`;

    console.log(`🤖 Processing custom section "${sectionName}" with GPT-4o...`);
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer. Process content according to instructions.",
        },
        {role: "user", content: prompt},
      ],
      temperature: 0.6,
      max_tokens: 1024,
    });

    const response = completion.choices[0];
    const processedContent = response.message.content.trim();

    // Extract token usage and calculate cost
    const tokenUsage = extractTokenUsage(completion);
    const cost = calculateCost(tokenUsage);

    console.log(
      `✅ Custom section processed with GPT-4o (Tokens: ${
        tokenUsage.totalTokens
      }, Cost: ₹${cost.amountINR.toFixed(2)})`
    );
    return {data: processedContent, tokenUsage, cost};
  } catch (error) {
    console.error("❌ OpenAI custom section processing error:", error.message);
    throw new Error(
      `Failed to process custom section with GPT-4o: ${error.message}`
    );
  }
}

/**
 * Analyze resume-job match and provide ATS score using GPT-4o
 * @param {string} resumeText - Resume content as text
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Object>} - Match analysis with score and recommendations
 */
export async function analyzeResumeJobMatch(resumeText, jobDescription) {
  try {
    if (!openai) {
      throw new Error("OpenAI API key not configured");
    }

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

    console.log("🤖 Analyzing resume-job match with GPT-4o...");
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS analyzer. Analyze resume-job matches with precision. Return only valid JSON in the exact format specified.",
        },
        {role: "user", content: prompt},
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: {type: "json_object"},
    });

    const response = completion.choices[0];
    const text = response.message.content.trim();
    const analysis = JSON.parse(text);

    // Extract token usage and calculate cost
    const tokenUsage = extractTokenUsage(completion);
    const cost = calculateCost(tokenUsage);

    console.log(
      `✅ Resume-job match analyzed with GPT-4o (Score: ${
        analysis.match_score
      }%, Tokens: ${tokenUsage.totalTokens}, Cost: ₹${cost.amountINR.toFixed(
        2
      )})`
    );
    return {data: analysis, tokenUsage, cost};
  } catch (error) {
    console.error("❌ OpenAI job match analysis error:", error.message);
    throw new Error(
      `Failed to analyze resume-job match with GPT-4o: ${error.message}`
    );
  }
}

/**
 * Generate a cover letter based on resume and job description using GPT-4o
 * @param {Object} resumeData - Structured resume data
 * @param {string} jobDescription - Job description text
 * @param {string} companyName - Company name
 * @returns {Promise<Object>} - Generated cover letter with usage stats
 */
export async function generateCoverLetter(
  resumeData,
  jobDescription,
  companyName = "the company"
) {
  try {
    const prompt = `Generate a professional cover letter for this candidate applying to ${companyName}.

Resume Summary:
Name: ${resumeData.name || "Candidate"}
Experience: ${resumeData.experience?.length || 0} positions
Skills: ${
      resumeData.skills?.map((s) => s.items?.join(", ")).join(", ") ||
      "Various skills"
    }

Job Description:
${jobDescription}

Create a compelling, personalized cover letter (250-300 words) that:
1. Highlights relevant experience and skills
2. Shows enthusiasm for the role
3. Demonstrates understanding of the company/role
4. Uses a professional but warm tone
5. Includes a strong opening and closing

Return ONLY the cover letter text.`;

    console.log("🤖 Generating cover letter with GPT-4o...");
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert cover letter writer. Create personalized, compelling cover letters.",
        },
        {role: "user", content: prompt},
      ],
      temperature: 0.8,
      max_tokens: 1536,
    });

    const response = completion.choices[0];
    const coverLetter = response.message.content.trim();

    // Extract token usage and calculate cost
    const tokenUsage = extractTokenUsage(completion);
    const cost = calculateCost(tokenUsage);

    console.log(
      `✅ Cover letter generated with GPT-4o (Tokens: ${
        tokenUsage.totalTokens
      }, Cost: ₹${cost.amountINR.toFixed(2)})`
    );
    return {data: coverLetter, tokenUsage, cost};
  } catch (error) {
    console.error("❌ OpenAI cover letter generation error:", error.message);
    throw new Error(
      `Failed to generate cover letter with GPT-4o: ${error.message}`
    );
  }
}

/**
 * Generic chat completion for custom prompts (used by interview service)
 * @param {string} systemPrompt - System instructions
 * @param {string} userPrompt - User message
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Response with text and token usage
 */
export async function chatCompletion(systemPrompt, userPrompt, options = {}) {
  return retryWithBackoff(async () => {
    if (!openai) {
      throw new Error("OpenAI API key not configured");
    }

    const {temperature = 0.7, maxTokens = 1000} = options;

    console.log("🤖 Calling OpenAI GPT-4o for chat completion...");
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: userPrompt},
      ],
      temperature,
      max_tokens: maxTokens,
    });

    const response = completion.choices[0];
    const text = response.message.content;
    const tokenUsage = extractTokenUsage(completion);
    const cost = calculateCost(tokenUsage);

    console.log(
      `✅ GPT-4o chat completion successful (Tokens: ${
        tokenUsage.totalTokens
      }, Cost: ₹${cost.amountINR.toFixed(2)})`
    );

    return {
      text,
      tokenUsage,
      cost,
    };
  }, "OpenAI chat completion");
}

export default {
  parseResumeWithAI,
  enhanceContentWithAI,
  generateSummaryWithAI,
  categorizeSkillsWithAI,
  segregateAchievementsWithAI,
  processCustomSectionWithAI,
  analyzeResumeJobMatch,
  generateCoverLetter,
  chatCompletion,
};
