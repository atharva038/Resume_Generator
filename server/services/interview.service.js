import * as geminiService from "./gemini.service.js";
import * as openaiService from "./openai.service.js";
import AIUsage from "../models/AIUsage.model.js";

/**
 * AI Interview Service
 * Handles AI-powered interview question generation, answer evaluation, and report generation
 */

// Interview prompts configuration
const INTERVIEW_CONFIG = {
  maxQuestionsPerSession: 15,
  minQuestionsPerSession: 5,
  defaultQuestionCount: 10,
  followUpProbability: 0.3, // 30% chance of follow-up questions
  difficultyAdjustment: {
    threshold: 70, // Score threshold for increasing difficulty
    increaseAfter: 2, // Increase after 2 consecutive high scores
    decreaseAfter: 2, // Decrease after 2 consecutive low scores
  },
};

// Role-specific technical topics
const ROLE_TOPICS = {
  frontend: [
    "JavaScript",
    "React",
    "Vue",
    "Angular",
    "CSS",
    "HTML5",
    "TypeScript",
    "Web Performance",
    "Accessibility",
    "Testing",
  ],
  backend: [
    "Node.js",
    "Python",
    "Java",
    "Database Design",
    "REST APIs",
    "GraphQL",
    "Microservices",
    "Security",
    "Caching",
    "Message Queues",
  ],
  fullstack: [
    "JavaScript",
    "Node.js",
    "React",
    "Database",
    "API Design",
    "DevOps",
    "System Design",
    "Security",
    "Testing",
    "Performance",
  ],
  devops: [
    "CI/CD",
    "Docker",
    "Kubernetes",
    "Cloud Services",
    "Infrastructure as Code",
    "Monitoring",
    "Security",
    "Networking",
    "Linux",
    "Automation",
  ],
  "data-engineer": [
    "SQL",
    "ETL",
    "Data Warehousing",
    "Python",
    "Spark",
    "Airflow",
    "Data Modeling",
    "Big Data",
    "Cloud Data Services",
    "Data Quality",
  ],
  mobile: [
    "React Native",
    "Flutter",
    "iOS",
    "Android",
    "Mobile UI/UX",
    "App Performance",
    "Push Notifications",
    "Mobile Security",
    "Offline Storage",
    "Testing",
  ],
};

// Experience level question complexity
const EXPERIENCE_COMPLEXITY = {
  fresher: {
    depth: "basic concepts and fundamentals",
    complexity: "straightforward",
    expectation: "theoretical understanding with simple examples",
  },
  junior: {
    depth: "practical implementation",
    complexity: "moderate",
    expectation: "hands-on experience with common scenarios",
  },
  mid: {
    depth: "architecture and design decisions",
    complexity: "intermediate",
    expectation: "problem-solving with real-world trade-offs",
  },
  senior: {
    depth: "system design and leadership",
    complexity: "advanced",
    expectation: "strategic thinking and mentorship experience",
  },
  lead: {
    depth: "organizational impact and vision",
    complexity: "expert",
    expectation: "cross-team collaboration and technical strategy",
  },
};

/**
 * Generate the system prompt for the AI interviewer
 */
function buildInterviewerSystemPrompt(config) {
  const {interviewType, role, experienceLevel, targetSkills} = config;
  const complexity =
    EXPERIENCE_COMPLEXITY[experienceLevel] || EXPERIENCE_COMPLEXITY.mid;

  return `You are an experienced technical interviewer conducting a ${interviewType} interview for a ${role} position.

INTERVIEWER PERSONA:
- You are professional, friendly, and encouraging
- You ask clear, specific questions that test real-world skills
- You never reveal that you are an AI or discuss your internal workings
- You avoid generic textbook questions - focus on practical scenarios
- You adapt your language to be conversational but professional

INTERVIEW CONTEXT:
- Role: ${role}
- Experience Level: ${experienceLevel} (${complexity.depth})
- Question Complexity: ${complexity.complexity}
- Expected Answer Depth: ${complexity.expectation}
${targetSkills?.length ? `- Focus Skills: ${targetSkills.join(", ")}` : ""}

QUESTION GUIDELINES:
1. Ask ONE question at a time
2. Questions should test ${complexity.depth}
3. For technical roles, include scenario-based questions
4. For behavioral questions, use STAR format expectations
5. Never provide hints or answers within the question
6. Make questions specific and actionable

RESPONSE FORMAT:
Always respond with valid JSON in this exact format:
{
  "question": "Your interview question here",
  "questionType": "technical|behavioral|situational|resume-based",
  "category": "The skill/topic being tested",
  "difficulty": "easy|medium|hard",
  "expectedKeywords": ["keyword1", "keyword2"],
  "idealAnswerPoints": ["point1", "point2", "point3"]
}`;
}

/**
 * Generate the system prompt for the answer evaluator
 */
function buildEvaluatorSystemPrompt(config) {
  const {role, experienceLevel, questionContext} = config;
  const complexity =
    EXPERIENCE_COMPLEXITY[experienceLevel] || EXPERIENCE_COMPLEXITY.mid;

  return `You are an expert interview evaluator assessing candidate responses for a ${role} position (${experienceLevel} level).

EVALUATION CRITERIA:
1. Relevance (0-100): How directly the answer addresses the question
2. Technical Accuracy (0-100): Correctness of technical concepts mentioned
3. Clarity (0-100): How well-structured and clear the explanation is
4. Confidence (0-100): Language cues indicating confidence and expertise
5. Role Fit (0-100): How well the answer demonstrates fit for the ${role} role

EVALUATION CONTEXT:
- Expected depth: ${complexity.depth}
- Complexity level: ${complexity.complexity}
- Expected demonstration: ${complexity.expectation}

QUESTION CONTEXT:
${questionContext || "General interview question"}

EVALUATION GUIDELINES:
1. Be fair but thorough in assessment
2. Identify specific strengths - be specific, not generic
3. Point out areas for improvement constructively
4. Suggest keywords/concepts that should have been mentioned
5. Provide a better answer example for learning
6. Give actionable improvement tips

RESPONSE FORMAT:
Always respond with valid JSON in this exact format:
{
  "score": 75,
  "relevance": 80,
  "technicalAccuracy": 70,
  "clarity": 75,
  "confidence": 72,
  "roleFit": 78,
  "strengths": ["Specific strength 1", "Specific strength 2"],
  "weaknesses": ["Area for improvement 1", "Area for improvement 2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestedAnswer": "A more complete answer would be...",
  "improvementTips": ["Tip 1", "Tip 2"],
  "feedback": "Brief overall feedback paragraph",
  "shouldAskFollowUp": true,
  "followUpReason": "The candidate mentioned X but didn't elaborate on Y"
}`;
}

/**
 * Generate the system prompt for final report generation
 */
function buildReportGeneratorPrompt(config) {
  const {role, experienceLevel, interviewType, questionCount} = config;

  return `You are an interview assessment expert generating a comprehensive interview performance report.

REPORT CONTEXT:
- Role: ${role}
- Experience Level: ${experienceLevel}
- Interview Type: ${interviewType}
- Questions Answered: ${questionCount}

REPORT REQUIREMENTS:
1. Provide an honest overall assessment
2. Break down performance by skill area
3. Identify clear patterns in strengths and weaknesses
4. Provide actionable recommendations
5. Suggest specific areas for practice
6. Give resume improvement suggestions based on demonstrated gaps

RESPONSE FORMAT:
Respond with valid JSON in this exact format:
{
  "overallScore": 75,
  "skillBreakdown": {
    "communication": { "score": 80, "feedback": "Clear and articulate responses" },
    "technicalKnowledge": { "score": 70, "feedback": "Solid fundamentals, gaps in advanced topics" },
    "problemSolving": { "score": 75, "feedback": "Good approach to breaking down problems" },
    "situationalAwareness": { "score": 72, "feedback": "Reasonable judgment in scenarios" },
    "culturalFit": { "score": 78, "feedback": "Collaborative mindset evident" }
  },
  "topicBreakdown": [
    { "skillName": "JavaScript", "score": 80, "questionsAsked": 3, "feedback": "Strong fundamentals" }
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "missedKeywords": ["keyword1", "keyword2"],
  "resumeImprovements": ["Add more specific project outcomes", "Highlight leadership experience"],
  "practiceAreas": ["System Design", "Advanced JavaScript patterns"],
  "summary": "Overall performance summary paragraph...",
  "detailedFeedback": "Detailed paragraph about the interview performance...",
  "hiringRecommendation": {
    "recommendation": "hire|maybe|no-hire",
    "confidence": 75,
    "reasoning": "Explanation of the recommendation"
  }
}`;
}

/**
 * Build question generation prompt based on interview type
 */
function buildQuestionPrompt(config) {
  const {
    interviewType,
    role,
    resumeText,
    jobDescription,
    previousQuestions,
    previousAnswers,
    currentDifficulty,
    questionNumber,
    targetSkills,
  } = config;

  let contextPrompt = "";

  switch (interviewType) {
    case "resume-based":
      contextPrompt = `
RESUME CONTENT:
${resumeText?.substring(0, 3000) || "No resume provided"}

Ask a question that explores the candidate's experience mentioned in their resume.
Focus on specific projects, skills, or achievements they've listed.`;
      break;

    case "job-description":
      contextPrompt = `
JOB DESCRIPTION:
${jobDescription?.substring(0, 2000) || "No job description provided"}

Ask a question that tests skills and requirements mentioned in this job description.
Focus on practical scenarios the candidate might face in this role.`;
      break;

    case "technical":
      const topics =
        ROLE_TOPICS[role.toLowerCase().replace(/\s+/g, "")] ||
        ROLE_TOPICS.fullstack;
      contextPrompt = `
TECHNICAL TOPICS TO COVER: ${topics.join(", ")}
${targetSkills?.length ? `PRIORITY SKILLS: ${targetSkills.join(", ")}` : ""}

Ask a practical technical question that tests real-world problem-solving.
Avoid purely theoretical questions - prefer scenario-based ones.`;
      break;

    case "behavioral":
      contextPrompt = `
BEHAVIORAL COMPETENCIES TO ASSESS:
- Leadership and initiative
- Teamwork and collaboration
- Problem-solving under pressure
- Communication and conflict resolution
- Adaptability and learning

Ask a behavioral question using the STAR format expectation.
Start with phrases like "Tell me about a time when..." or "Describe a situation where..."`;
      break;

    case "mixed":
      contextPrompt = `
This is a mixed interview covering both technical and behavioral aspects.
${
  resumeText
    ? `Consider the candidate's resume: ${resumeText.substring(0, 1500)}`
    : ""
}
${
  jobDescription
    ? `And the job requirements: ${jobDescription.substring(0, 1000)}`
    : ""
}

Alternate between technical and behavioral questions for a balanced assessment.`;
      break;
  }

  // Add previous context for adaptive questioning - include ALL previous questions to avoid repetition
  let previousContext = "";
  if (previousQuestions?.length > 0) {
    // List ALL previous questions to ensure no repetition
    const allPreviousQuestions = previousQuestions
      .map((q, i) => `${i + 1}. ${q}`)
      .join("\n");

    // Only include recent Q&A for context (last 2)
    const recentQA = previousQuestions
      .slice(-2)
      .map((q, i) => {
        const answer =
          previousAnswers?.[previousQuestions.length - 2 + i] || "No answer";
        return `Q: ${q}\nA: ${answer.substring(0, 300)}`;
      })
      .join("\n\n");

    previousContext = `
IMPORTANT - DO NOT REPEAT THESE QUESTIONS (already asked):
${allPreviousQuestions}

RECENT Q&A (for context to build upon):
${recentQA}

Generate a COMPLETELY DIFFERENT question that has not been asked yet. Explore new topics or go deeper into areas not yet covered.`;
  }

  return `${contextPrompt}

CURRENT STATUS:
- Question Number: ${questionNumber}
- Current Difficulty: ${currentDifficulty}
${previousContext}

Generate the next interview question. Make it specific and practical.`;
}

/**
 * Parse AI response safely
 */
function parseAIResponse(responseText, fallbackStructure = {}) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If no JSON found, try parsing the whole response
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse AI response:", error.message);
    console.error("Raw response:", responseText.substring(0, 500));
    return fallbackStructure;
  }
}

/**
 * Select AI service based on user tier
 */
function selectAIService(user) {
  // Always use OpenAI for faster and better interview responses
  return "gpt4o";
}

/**
 * Generate an interview question
 * @param {Object} config - Interview configuration
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Generated question with metadata
 */
export async function generateQuestion(config, user) {
  const aiService = selectAIService(user);
  const startTime = Date.now();

  try {
    const systemPrompt = buildInterviewerSystemPrompt(config);
    const userPrompt = buildQuestionPrompt(config);

    let response;
    if (aiService === "gpt4o") {
      response = await openaiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.7,
        maxTokens: 800,
      });
    } else {
      response = await geminiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.7,
        maxOutputTokens: 800,
      });
    }

    const responseTime = Date.now() - startTime;

    // Parse the response
    const questionData = parseAIResponse(response.text, {
      question:
        "Tell me about your experience with the technologies mentioned in your resume.",
      questionType: "resume-based",
      category: "General",
      difficulty: "medium",
      expectedKeywords: [],
      idealAnswerPoints: [],
    });

    // Log usage
    await logInterviewUsage(
      user._id,
      "interview_question",
      aiService,
      response.tokenUsage,
      responseTime,
      true
    );

    return {
      ...questionData,
      aiModel: aiService,
      generatedAt: new Date(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logInterviewUsage(
      user._id,
      "interview_question",
      aiService,
      {},
      responseTime,
      false,
      error.message
    );
    throw error;
  }
}

/**
 * Evaluate a candidate's answer
 * @param {Object} config - Evaluation configuration
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Evaluation results
 */
export async function evaluateAnswer(config, user) {
  const {
    question,
    answer,
    questionType,
    category,
    expectedKeywords,
    role,
    experienceLevel,
  } = config;
  const aiService = selectAIService(user);
  const startTime = Date.now();

  try {
    const systemPrompt = buildEvaluatorSystemPrompt({
      role,
      experienceLevel,
      questionContext: `Question Type: ${questionType}\nCategory: ${category}\nExpected Keywords: ${
        expectedKeywords?.join(", ") || "None specified"
      }`,
    });

    const userPrompt = `
INTERVIEW QUESTION:
${question}

CANDIDATE'S ANSWER:
${answer}

Evaluate this response thoroughly and provide structured feedback.`;

    let response;
    if (aiService === "gpt4o") {
      response = await openaiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.3, // Lower temperature for more consistent evaluation
        maxTokens: 1200,
      });
    } else {
      response = await geminiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.3,
        maxOutputTokens: 1200,
      });
    }

    const responseTime = Date.now() - startTime;

    // Parse the evaluation
    const evaluation = parseAIResponse(response.text, {
      score: 50,
      relevance: 50,
      technicalAccuracy: 50,
      clarity: 50,
      confidence: 50,
      roleFit: 50,
      strengths: [],
      weaknesses: [],
      missingKeywords: [],
      suggestedAnswer: "",
      improvementTips: [],
      feedback: "Unable to fully evaluate the response.",
      shouldAskFollowUp: false,
    });

    // Log usage
    await logInterviewUsage(
      user._id,
      "interview_evaluation",
      aiService,
      response.tokenUsage,
      responseTime,
      true
    );

    return {
      ...evaluation,
      aiModel: aiService,
      evaluatedAt: new Date(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logInterviewUsage(
      user._id,
      "interview_evaluation",
      aiService,
      {},
      responseTime,
      false,
      error.message
    );
    throw error;
  }
}

/**
 * Generate a follow-up question based on the previous answer
 * @param {Object} config - Configuration including previous Q&A
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Follow-up question
 */
export async function generateFollowUp(config, user) {
  const {
    previousQuestion,
    previousAnswer,
    followUpReason,
    role,
    experienceLevel,
  } = config;
  const aiService = selectAIService(user);
  const startTime = Date.now();

  try {
    const systemPrompt = buildInterviewerSystemPrompt({
      interviewType: "follow-up",
      role,
      experienceLevel,
    });

    const userPrompt = `
PREVIOUS QUESTION:
${previousQuestion}

CANDIDATE'S ANSWER:
${previousAnswer}

REASON FOR FOLLOW-UP:
${followUpReason || "The answer needs more depth or clarification."}

Generate a natural follow-up question that digs deeper into what the candidate mentioned.
Make it conversational, like a real interviewer probing for more details.`;

    let response;
    if (aiService === "gpt4o") {
      response = await openaiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.7,
        maxTokens: 600,
      });
    } else {
      response = await geminiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.7,
        maxOutputTokens: 600,
      });
    }

    const responseTime = Date.now() - startTime;

    const questionData = parseAIResponse(response.text, {
      question: "Can you elaborate more on that?",
      questionType: "follow-up",
      category: "Clarification",
      difficulty: "medium",
    });

    await logInterviewUsage(
      user._id,
      "interview_followup",
      aiService,
      response.tokenUsage,
      responseTime,
      true
    );

    return {
      ...questionData,
      isFollowUp: true,
      aiModel: aiService,
      generatedAt: new Date(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logInterviewUsage(
      user._id,
      "interview_followup",
      aiService,
      {},
      responseTime,
      false,
      error.message
    );
    throw error;
  }
}

/**
 * Generate the final interview report
 * @param {Object} session - Complete interview session with all Q&A
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Comprehensive interview report
 */
export async function generateReport(session, user) {
  const aiService = selectAIService(user);
  const startTime = Date.now();

  try {
    // Prepare Q&A summary for the report
    const qaData = session.questions.map((q) => ({
      question: q.questionText,
      answer: q.userAnswer || "(Skipped)",
      type: q.questionType,
      category: q.category,
      score: q.evaluation?.score || 0,
      strengths: q.evaluation?.strengths || [],
      weaknesses: q.evaluation?.weaknesses || [],
    }));

    const systemPrompt = buildReportGeneratorPrompt({
      role: session.role,
      experienceLevel: session.experienceLevel,
      interviewType: session.interviewType,
      questionCount: session.questions.length,
    });

    const userPrompt = `
INTERVIEW DATA:
${JSON.stringify(qaData, null, 2)}

INTERVIEW DURATION: ${session.totalDurationSeconds} seconds
QUESTIONS ANSWERED: ${session.questions.filter((q) => q.userAnswer).length}/${
      session.questions.length
    }

Generate a comprehensive interview performance report with actionable feedback.`;

    let response;
    if (aiService === "gpt4o") {
      response = await openaiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.4,
        maxTokens: 2000,
      });
    } else {
      response = await geminiService.chatCompletion(systemPrompt, userPrompt, {
        temperature: 0.4,
        maxOutputTokens: 2000,
      });
    }

    const responseTime = Date.now() - startTime;

    const report = parseAIResponse(response.text, {
      overallScore: 50,
      skillBreakdown: {},
      topicBreakdown: [],
      strengths: [],
      weaknesses: [],
      missedKeywords: [],
      resumeImprovements: [],
      practiceAreas: [],
      summary:
        "Interview completed. Review individual question feedback for details.",
      hiringRecommendation: {recommendation: "maybe", confidence: 50},
    });

    await logInterviewUsage(
      user._id,
      "interview_report",
      aiService,
      response.tokenUsage,
      responseTime,
      true
    );

    return {
      ...report,
      aiModel: aiService,
      generatedAt: new Date(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logInterviewUsage(
      user._id,
      "interview_report",
      aiService,
      {},
      responseTime,
      false,
      error.message
    );
    throw error;
  }
}

/**
 * Log interview-related AI usage
 */
async function logInterviewUsage(
  userId,
  action,
  aiModel,
  tokenUsage = {},
  responseTime = 0,
  success = true,
  errorMessage = null
) {
  try {
    await AIUsage.create({
      userId,
      aiProvider: aiModel === "gpt4o" ? "openai" : "gemini",
      aiModel,
      feature: "ai_interview",
      tokensUsed: tokenUsage?.totalTokens || 0,
      cost: calculateCost(tokenUsage, aiModel),
      responseTime,
      status: success ? "success" : "error",
      errorMessage,
      metadata: {action},
    });
  } catch (error) {
    console.error("Failed to log interview usage:", error.message);
  }
}

/**
 * Calculate cost based on token usage
 */
function calculateCost(tokenUsage, aiModel) {
  if (!tokenUsage?.totalTokens) return 0;

  // Approximate costs per 1000 tokens
  const rates = {
    gpt4o: {input: 0.005, output: 0.015},
    gemini: {input: 0.00025, output: 0.0005},
  };

  const rate = rates[aiModel] || rates.gemini;
  const inputCost = ((tokenUsage.promptTokens || 0) / 1000) * rate.input;
  const outputCost = ((tokenUsage.candidatesTokens || 0) / 1000) * rate.output;

  return inputCost + outputCost;
}

/**
 * Get interview configuration limits
 */
export function getInterviewLimits() {
  return {...INTERVIEW_CONFIG};
}

/**
 * Get available roles for interview
 */
export function getAvailableRoles() {
  return Object.keys(ROLE_TOPICS).map((key) => ({
    id: key,
    name: key
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    topics: ROLE_TOPICS[key],
  }));
}

/**
 * Get experience levels
 */
export function getExperienceLevels() {
  return Object.keys(EXPERIENCE_COMPLEXITY).map((key) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    ...EXPERIENCE_COMPLEXITY[key],
  }));
}

export default {
  generateQuestion,
  evaluateAnswer,
  generateFollowUp,
  generateReport,
  getInterviewLimits,
  getAvailableRoles,
  getExperienceLevels,
};
