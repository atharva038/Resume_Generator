  import InterviewSession from "../models/InterviewSession.model.js";
import InterviewResult from "../models/InterviewResult.model.js";
import Resume from "../models/Resume.model.js";
import * as interviewService from "../services/interview.service.js";
import * as elevenlabsService from "../services/elevenlabs.service.js";
import axios from "axios";
import FormData from "form-data";

/**
 * Interview Controller
 * Handles all interview-related API endpoints
 */

/**
 * Helper function to generate audio for question text
 * @param {string} text - Question text
 * @param {boolean} liveMode - Whether live mode is enabled
 * @returns {Promise<Object|null>} Audio data or null
 */
const generateQuestionAudio = async (text, liveMode = false) => {
  if (!liveMode || !elevenlabsService.isConfigured()) {
    return null;
  }

  try {
    const audioData = await elevenlabsService.textToSpeechBase64(text);
    return audioData;
  } catch (error) {
    console.error("Failed to generate question audio:", error);
    return null;
  }
};

/**
 * Get interview configuration options
 * GET /api/interview/config
 */
export const getInterviewConfig = async (req, res) => {
  try {
    const config = {
      interviewTypes: [
        {
          id: "resume-based",
          name: "Resume-Based Interview",
          description: "Questions derived from your resume",
        },
        {
          id: "job-description",
          name: "Job Description Interview",
          description: "Questions based on a job posting",
        },
        {
          id: "technical",
          name: "Technical Interview",
          description: "Role-specific technical questions",
        },
        {
          id: "behavioral",
          name: "Behavioral Interview",
          description: "STAR-based situational questions",
        },
        {
          id: "mixed",
          name: "Mixed Interview",
          description: "Combination of technical and behavioral",
        },
      ],
      roles: interviewService.getAvailableRoles(),
      experienceLevels: interviewService.getExperienceLevels(),
      limits: interviewService.getInterviewLimits(),
      modes: [
        {id: "text", name: "Text Mode", description: "Type your answers"},
        {
          id: "voice",
          name: "Voice Mode",
          description: "Speak your answers (requires microphone)",
        },
        {
          id: "live",
          name: "Live Interview",
          description:
            "Real-time conversation with AI interviewer (voice-to-voice)",
          requiresTTS: true,
        },
      ],
      ttsAvailable: elevenlabsService.isConfigured(),
    };

    res.json({success: true, data: config});
  } catch (error) {
    console.error("❌ Get interview config error:", error);
    res
      .status(500)
      .json({success: false, error: "Failed to get interview configuration"});
  }
};

/**
 * Create a new interview session
 * POST /api/interview/sessions
 */
export const createSession = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const {
      interviewType,
      role,
      experienceLevel = "mid",
      mode = "text",
      resumeId,
      jobDescription,
      targetSkills = [],
      totalQuestions = 10,
    } = req.body;

    // Validate required fields
    if (!interviewType || !role) {
      return res.status(400).json({
        success: false,
        error: "Interview type and role are required",
      });
    }

    // Validate interview type
    const validTypes = [
      "resume-based",
      "job-description",
      "technical",
      "behavioral",
      "mixed",
    ];
    if (!validTypes.includes(interviewType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid interview type. Must be one of: ${validTypes.join(
          ", "
        )}`,
      });
    }

    // Get resume text if resume-based interview
    let resumeText = "";
    if (resumeId || interviewType === "resume-based") {
      if (!resumeId) {
        return res.status(400).json({
          success: false,
          error: "Resume ID is required for resume-based interviews",
        });
      }

      const resume = await Resume.findOne({_id: resumeId, userId});
      if (!resume) {
        return res.status(404).json({
          success: false,
          error: "Resume not found",
        });
      }

      resumeText = resume.rawText || convertResumeToText(resume);
    }

    // Validate job description for JD-based interviews
    if (interviewType === "job-description" && !jobDescription) {
      return res.status(400).json({
        success: false,
        error: "Job description is required for job-description interviews",
      });
    }

    // Create session
    const session = new InterviewSession({
      userId,
      interviewType,
      role,
      experienceLevel,
      mode,
      resumeId,
      resumeText,
      jobDescription,
      targetSkills,
      totalQuestions: Math.min(Math.max(totalQuestions, 5), 15), // Clamp between 5-15
      status: "created",
      aiModel: selectAIModel(req.user),
      metadata: {
        browserInfo: req.headers["user-agent"],
        ipAddress: req.ip,
      },
    });

    await session.save();

    console.log(
      `✅ Interview session created: ${session._id} for user ${userId}`
    );

    res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        interviewType: session.interviewType,
        role: session.role,
        experienceLevel: session.experienceLevel,
        mode: session.mode,
        totalQuestions: session.totalQuestions,
        status: session.status,
      },
    });
  } catch (error) {
    console.error("❌ Create session error:", error);
    res
      .status(500)
      .json({success: false, error: "Failed to create interview session"});
  }
};

/**
 * Start an interview session and get first question
 * POST /api/interview/sessions/:sessionId/start
 */
export const startSession = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const userId = req.user.userId || req.user._id;

    const session = await InterviewSession.findOne({_id: sessionId, userId});
    if (!session) {
      return res.status(404).json({success: false, error: "Session not found"});
    }

    if (session.status !== "created") {
      return res.status(400).json({
        success: false,
        error: `Cannot start session with status: ${session.status}`,
      });
    }

    // Update session status
    session.status = "in-progress";
    session.startedAt = new Date();

    // Generate first question
    const questionConfig = {
      interviewType: session.interviewType,
      role: session.role,
      experienceLevel: session.experienceLevel,
      resumeText: session.resumeText,
      jobDescription: session.jobDescription,
      targetSkills: session.targetSkills,
      previousQuestions: [],
      previousAnswers: [],
      currentDifficulty: "medium",
      questionNumber: 1,
    };

    const questionData = await interviewService.generateQuestion(
      questionConfig,
      req.user
    );

    // Add question to session
    session.addQuestion({
      questionText: questionData.question,
      questionType: questionData.questionType,
      category: questionData.category,
      difficulty: questionData.difficulty,
    });

    await session.save();

    // Generate audio for live mode
    const isLiveMode = session.mode === "live";
    const questionAudio = await generateQuestionAudio(
      questionData.question,
      isLiveMode
    );

    console.log(
      `✅ Interview session started: ${session._id} (mode: ${session.mode})`
    );

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        status: session.status,
        mode: session.mode,
        currentQuestion: {
          number: 1,
          text: questionData.question,
          type: questionData.questionType,
          category: questionData.category,
          audio: questionAudio, // null for text/voice mode, base64 audio for live mode
        },
        progress: {
          current: 1,
          total: session.totalQuestions,
          percentage: Math.round((1 / session.totalQuestions) * 100),
        },
      },
    });
  } catch (error) {
    console.error("❌ Start session error:", error);
    res
      .status(500)
      .json({success: false, error: "Failed to start interview session"});
  }
};

/**
 * Submit answer and get evaluation + next question
 * POST /api/interview/sessions/:sessionId/answer
 */
export const submitAnswer = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const {answer, questionNumber, answerMode = "text"} = req.body;
    const userId = req.user.userId || req.user._id;

    if (!answer || answer.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: "Please provide a more detailed answer (at least 10 characters)",
      });
    }

    const session = await InterviewSession.findOne({_id: sessionId, userId});
    if (!session) {
      return res.status(404).json({success: false, error: "Session not found"});
    }

    if (session.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        error: `Cannot submit answer for session with status: ${session.status}`,
      });
    }

    // Get current question
    const currentQuestion = session.questions.find(
      (q) => q.questionNumber === questionNumber
    );
    if (!currentQuestion) {
      return res
        .status(400)
        .json({success: false, error: "Question not found"});
    }

    if (currentQuestion.userAnswer) {
      return res
        .status(400)
        .json({success: false, error: "Question already answered"});
    }

    // Submit the answer
    session.submitAnswer(questionNumber, answer.trim(), answerMode);

    // Evaluate the answer
    const evaluation = await interviewService.evaluateAnswer(
      {
        question: currentQuestion.questionText,
        answer: answer.trim(),
        questionType: currentQuestion.questionType,
        category: currentQuestion.category,
        expectedKeywords: currentQuestion.expectedKeywords,
        role: session.role,
        experienceLevel: session.experienceLevel,
      },
      req.user
    );

    // Add evaluation to the question
    session.addEvaluation(questionNumber, {
      score: evaluation.score,
      relevance: evaluation.relevance,
      technicalAccuracy: evaluation.technicalAccuracy,
      clarity: evaluation.clarity,
      confidence: evaluation.confidence,
      roleFit: evaluation.roleFit,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      missingKeywords: evaluation.missingKeywords,
      suggestedAnswer: evaluation.suggestedAnswer,
      improvementTips: evaluation.improvementTips,
      feedback: evaluation.feedback,
    });

    // Check if interview is complete
    const answeredCount = session.questions.filter(
      (q) => q.userAnswer || q.skipped
    ).length;
    const isComplete = answeredCount >= session.totalQuestions;

    let nextQuestion = null;
    let shouldAskFollowUp =
      evaluation.shouldAskFollowUp && !isComplete && Math.random() < 0.3;

    if (!isComplete) {
      // Determine if we should ask a follow-up or new question
      if (shouldAskFollowUp) {
        const followUpData = await interviewService.generateFollowUp(
          {
            previousQuestion: currentQuestion.questionText,
            previousAnswer: answer.trim(),
            followUpReason: evaluation.followUpReason,
            role: session.role,
            experienceLevel: session.experienceLevel,
          },
          req.user
        );

        session.addQuestion({
          questionText: followUpData.question,
          questionType: "follow-up",
          category: currentQuestion.category,
          difficulty: currentQuestion.difficulty,
          isFollowUp: true,
          parentQuestionNumber: questionNumber,
        });

        nextQuestion = {
          number: session.questions.length,
          text: followUpData.question,
          type: "follow-up",
          category: currentQuestion.category,
          isFollowUp: true,
        };
      } else if (answeredCount < session.totalQuestions) {
        // Generate next regular question
        const previousQuestions = session.questions.map((q) => q.questionText);
        const previousAnswers = session.questions.map(
          (q) => q.userAnswer || ""
        );

        // Adaptive difficulty
        const recentScores = session.questions
          .slice(-3)
          .map((q) => q.evaluation?.score || 50);
        const avgRecentScore =
          recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        let currentDifficulty = currentQuestion.difficulty;

        if (avgRecentScore >= 80) currentDifficulty = "hard";
        else if (avgRecentScore <= 40) currentDifficulty = "easy";
        else currentDifficulty = "medium";

        const questionConfig = {
          interviewType: session.interviewType,
          role: session.role,
          experienceLevel: session.experienceLevel,
          resumeText: session.resumeText,
          jobDescription: session.jobDescription,
          targetSkills: session.targetSkills,
          previousQuestions,
          previousAnswers,
          currentDifficulty,
          questionNumber: session.questions.length + 1,
        };

        const questionData = await interviewService.generateQuestion(
          questionConfig,
          req.user
        );

        session.addQuestion({
          questionText: questionData.question,
          questionType: questionData.questionType,
          category: questionData.category,
          difficulty: questionData.difficulty,
        });

        nextQuestion = {
          number: session.questions.length,
          text: questionData.question,
          type: questionData.questionType,
          category: questionData.category,
        };
      }
    }

    await session.save();

    // Generate audio for next question in live mode
    const isLiveMode = session.mode === "live";
    if (nextQuestion && isLiveMode) {
      nextQuestion.audio = await generateQuestionAudio(nextQuestion.text, true);
    }

    const response = {
      success: true,
      data: {
        evaluation: {
          score: evaluation.score,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
          improvementTips: evaluation.improvementTips,
        },
        progress: {
          current: answeredCount,
          total: session.totalQuestions,
          percentage: Math.round(
            (answeredCount / session.totalQuestions) * 100
          ),
        },
        isComplete,
        mode: session.mode,
      },
    };

    if (nextQuestion) {
      response.data.nextQuestion = nextQuestion;
    }

    if (isComplete) {
      response.data.message = "Interview completed! Generating your report...";
    }

    res.json(response);
  } catch (error) {
    console.error("❌ Submit answer error:", error);
    res
      .status(500)
      .json({success: false, error: "Failed to process your answer"});
  }
};

/**
 * Skip current question
 * POST /api/interview/sessions/:sessionId/skip
 */
export const skipQuestion = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const {questionNumber} = req.body;
    const userId = req.user.userId || req.user._id;

    const session = await InterviewSession.findOne({_id: sessionId, userId});
    if (!session) {
      return res.status(404).json({success: false, error: "Session not found"});
    }

    const question = session.questions.find(
      (q) => q.questionNumber === questionNumber
    );
    if (!question) {
      return res
        .status(400)
        .json({success: false, error: "Question not found"});
    }

    question.skipped = true;
    question.answeredAt = new Date();
    question.evaluation = {
      score: 0,
      feedback: "Question was skipped",
    };

    // Check if complete
    const answeredCount = session.questions.filter(
      (q) => q.userAnswer || q.skipped
    ).length;
    const isComplete = answeredCount >= session.totalQuestions;

    let nextQuestion = null;

    if (!isComplete && answeredCount < session.totalQuestions) {
      // Generate next question
      const previousQuestions = session.questions.map((q) => q.questionText);
      const previousAnswers = session.questions.map(
        (q) => q.userAnswer || "(skipped)"
      );

      const questionConfig = {
        interviewType: session.interviewType,
        role: session.role,
        experienceLevel: session.experienceLevel,
        resumeText: session.resumeText,
        jobDescription: session.jobDescription,
        targetSkills: session.targetSkills,
        previousQuestions,
        previousAnswers,
        currentDifficulty: "medium",
        questionNumber: session.questions.length + 1,
      };

      const questionData = await interviewService.generateQuestion(
        questionConfig,
        req.user
      );

      session.addQuestion({
        questionText: questionData.question,
        questionType: questionData.questionType,
        category: questionData.category,
        difficulty: questionData.difficulty,
      });

      // Generate audio for live mode
      const questionAudio =
        session.mode === "live"
          ? await generateQuestionAudio(questionData.question, true)
          : null;

      nextQuestion = {
        number: session.questions.length,
        text: questionData.question,
        type: questionData.questionType,
        category: questionData.category,
        audio: questionAudio,
      };
    }

    await session.save();

    res.json({
      success: true,
      data: {
        skipped: true,
        progress: {
          current: answeredCount,
          total: session.totalQuestions,
          percentage: Math.round(
            (answeredCount / session.totalQuestions) * 100
          ),
        },
        nextQuestion,
        isComplete,
      },
    });
  } catch (error) {
    console.error("❌ Skip question error:", error);
    res.status(500).json({success: false, error: "Failed to skip question"});
  }
};

/**
 * Complete interview and generate report
 * POST /api/interview/sessions/:sessionId/complete
 */
export const completeSession = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const userId = req.user.userId || req.user._id;

    const session = await InterviewSession.findOne({_id: sessionId, userId});
    if (!session) {
      return res.status(404).json({success: false, error: "Session not found"});
    }

    if (session.status === "completed") {
      // Return existing result
      const existingResult = await InterviewResult.findOne({sessionId});
      if (existingResult) {
        return res.json({success: true, data: existingResult});
      }
    }

    // Mark session as completed
    session.status = "completed";
    session.completedAt = new Date();
    if (session.startedAt) {
      session.totalDurationSeconds = Math.round(
        (session.completedAt - session.startedAt) / 1000
      );
    }
    await session.save();

    // Generate comprehensive report
    const reportData = await interviewService.generateReport(session, req.user);

    // Calculate metrics
    const answeredQuestions = session.questions.filter(
      (q) => q.userAnswer
    ).length;
    const skippedQuestions = session.questions.filter((q) => q.skipped).length;
    const questionsAboveThreshold = session.questions.filter(
      (q) => (q.evaluation?.score || 0) >= 70
    ).length;
    const totalTime = session.questions.reduce(
      (sum, q) => sum + (q.timeSpentSeconds || 0),
      0
    );
    const avgTimePerQuestion =
      answeredQuestions > 0 ? Math.round(totalTime / answeredQuestions) : 0;

    // Get previous result for comparison
    const previousResult = await InterviewResult.findOne({
      userId,
      role: session.role,
      _id: {$ne: sessionId},
    }).sort({createdAt: -1});

    // Calculate percentile
    const percentile = await InterviewResult.calculatePercentile(
      session.role,
      reportData.overallScore
    );

    // Create result document
    const result = new InterviewResult({
      userId,
      sessionId: session._id,
      overallScore: reportData.overallScore,
      skillBreakdown: reportData.skillBreakdown,
      topicBreakdown: reportData.topicBreakdown || [],
      strengths: reportData.strengths,
      weaknesses: reportData.weaknesses,
      expectedKeywords: [], // Could be populated from questions
      mentionedKeywords: [], // Could be extracted from answers
      missedKeywords: reportData.missedKeywords,
      resumeImprovements: reportData.resumeImprovements,
      practiceAreas: reportData.practiceAreas,
      summary: reportData.summary,
      detailedFeedback: reportData.detailedFeedback,
      metrics: {
        totalQuestions: session.totalQuestions,
        answeredQuestions,
        skippedQuestions,
        averageTimePerQuestion: avgTimePerQuestion,
        totalDuration: session.totalDurationSeconds,
        questionsAboveThreshold,
      },
      comparisonData: {
        previousScore: previousResult?.overallScore,
        scoreChange: previousResult
          ? reportData.overallScore - previousResult.overallScore
          : null,
        percentileRank: percentile,
        trend: previousResult
          ? reportData.overallScore > previousResult.overallScore
            ? "improving"
            : reportData.overallScore < previousResult.overallScore
            ? "declining"
            : "stable"
          : null,
      },
      interviewType: session.interviewType,
      role: session.role,
      experienceLevel: session.experienceLevel,
      aiModel: session.aiModel,
      hiringRecommendation: reportData.hiringRecommendation,
      isPremiumAnalysis: isPremiumUser(req.user),
    });

    await result.save();

    console.log(`✅ Interview completed and report generated: ${session._id}`);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Complete session error:", error);
    res
      .status(500)
      .json({success: false, error: "Failed to generate interview report"});
  }
};

/**
 * Get session details
 * GET /api/interview/sessions/:sessionId
 */
export const getSession = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const userId = req.user.userId || req.user._id;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId,
    }).populate("resumeId", "resumeTitle name");

    if (!session) {
      return res.status(404).json({success: false, error: "Session not found"});
    }

    res.json({success: true, data: session});
  } catch (error) {
    console.error("❌ Get session error:", error);
    res.status(500).json({success: false, error: "Failed to get session"});
  }
};

/**
 * Get interview result
 * GET /api/interview/results/:sessionId
 */
export const getResult = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const userId = req.user.userId || req.user._id;

    const result = await InterviewResult.findOne({sessionId, userId});
    if (!result) {
      return res.status(404).json({success: false, error: "Result not found"});
    }

    res.json({success: true, data: result});
  } catch (error) {
    console.error("❌ Get result error:", error);
    res.status(500).json({success: false, error: "Failed to get result"});
  }
};

/**
 * Get user's interview history
 * GET /api/interview/history
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const {limit = 10, skip = 0, status} = req.query;

    const sessions = await InterviewSession.getUserHistory(userId, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      status,
    });

    // Get results for completed sessions
    const completedSessionIds = sessions
      .filter((s) => s.status === "completed")
      .map((s) => s._id);

    const results = await InterviewResult.find({
      sessionId: {$in: completedSessionIds},
    }).select("sessionId overallScore grade");

    const resultsMap = new Map(results.map((r) => [r.sessionId.toString(), r]));

    // Combine session data with results
    const history = sessions.map((session) => ({
      ...session,
      result: resultsMap.get(session._id.toString()) || null,
    }));

    // Get total count
    const totalCount = await InterviewSession.countDocuments({
      userId,
      ...(status && {status}),
    });

    res.json({
      success: true,
      data: {
        interviews: history,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: totalCount > parseInt(skip) + parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("❌ Get history error:", error);
    res
      .status(500)
      .json({success: false, error: "Failed to get interview history"});
  }
};

/**
 * Get user's interview statistics
 * GET /api/interview/stats
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const stats = await InterviewSession.getUserStats(userId);

    // Get improvement trend
    const trend = await InterviewResult.getImprovementTrend(userId, 10);

    res.json({
      success: true,
      data: {
        ...stats,
        improvementTrend: trend,
      },
    });
  } catch (error) {
    console.error("❌ Get stats error:", error);
    res.status(500).json({success: false, error: "Failed to get statistics"});
  }
};

/**
 * Abandon/cancel an interview session
 * POST /api/interview/sessions/:sessionId/abandon
 */
export const abandonSession = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const userId = req.user.userId || req.user._id;

    const session = await InterviewSession.findOne({_id: sessionId, userId});
    if (!session) {
      return res.status(404).json({success: false, error: "Session not found"});
    }

    if (session.status === "completed") {
      return res
        .status(400)
        .json({success: false, error: "Cannot abandon a completed session"});
    }

    session.status = "abandoned";
    await session.save();

    res.json({success: true, message: "Interview session abandoned"});
  } catch (error) {
    console.error("❌ Abandon session error:", error);
    res.status(500).json({success: false, error: "Failed to abandon session"});
  }
};

// Helper functions

function convertResumeToText(resume) {
  const parts = [];

  if (resume.name) parts.push(`Name: ${resume.name}`);
  if (resume.summary) parts.push(`Summary: ${resume.summary}`);

  if (resume.skills?.length) {
    const skills = resume.skills
      .map((s) => `${s.category}: ${s.items?.join(", ")}`)
      .join("; ");
    parts.push(`Skills: ${skills}`);
  }

  if (resume.experience?.length) {
    const exp = resume.experience
      .map(
        (e) =>
          `${e.title} at ${e.company} (${e.startDate} - ${
            e.endDate
          }): ${e.bullets?.join(". ")}`
      )
      .join(" | ");
    parts.push(`Experience: ${exp}`);
  }

  if (resume.education?.length) {
    const edu = resume.education
      .map((e) => `${e.degree} in ${e.field} from ${e.institution}`)
      .join("; ");
    parts.push(`Education: ${edu}`);
  }

  if (resume.projects?.length) {
    const proj = resume.projects
      .map((p) => `${p.name}: ${p.description} (${p.technologies?.join(", ")})`)
      .join(" | ");
    parts.push(`Projects: ${proj}`);
  }

  return parts.join("\n\n");
}

function selectAIModel(user) {
  const tier = user.subscription?.tier || "free";
  const paidTiers = ["one-time", "pro", "premium", "lifetime"];
  return paidTiers.includes(tier) ? "gpt4o" : "gemini";
}

function isPremiumUser(user) {
  const tier = user.subscription?.tier || "free";
  return ["pro", "premium", "lifetime"].includes(tier);
}

/**
 * Submit voice answer (audio file)
 * POST /api/interview/sessions/:sessionId/voice-answer
 */
export const submitVoiceAnswer = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const {questionNumber} = req.body;
    const userId = req.user.userId || req.user._id;
    const audioFile = req.file;

    console.log("🎤 Voice answer submission:");
    console.log("  - sessionId:", sessionId);
    console.log("  - questionNumber:", questionNumber);
    console.log(
      "  - req.file:",
      audioFile
        ? `${audioFile.originalname} (${audioFile.size} bytes, buffer: ${
            audioFile.buffer?.length || "NO BUFFER"
          })`
        : "MISSING"
    );
    console.log("  - Content-Type:", req.headers["content-type"]);
    console.log("  - req.body keys:", Object.keys(req.body || {}));

    if (!audioFile) {
      console.error("❌ No audio file in request.");
      console.error("  - req.files:", req.files);
      console.error("  - req.body:", req.body);
      return res.status(400).json({
        success: false,
        error:
          "No audio file provided. Please record your answer and try again.",
      });
    }

    if (!audioFile.buffer || audioFile.buffer.length === 0) {
      console.error("❌ Audio file has no buffer data!");
      return res.status(400).json({
        success: false,
        error: "Audio file is empty. Please record again.",
      });
    }

    const session = await InterviewSession.findOne({_id: sessionId, userId});
    if (!session) {
      return res.status(404).json({success: false, error: "Session not found"});
    }

    if (session.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        error: `Cannot submit answer for session with status: ${session.status}`,
      });
    }

    // Transcribe the audio using ML service
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:5001";

    console.log("📡 Sending to voice service:");
    console.log("  - URL:", `${mlServiceUrl}/transcribe`);
    console.log("  - Buffer length:", audioFile.buffer.length);
    console.log("  - Original name:", audioFile.originalname);
    console.log("  - Mimetype:", audioFile.mimetype);

    const formData = new FormData();
    formData.append("audio", audioFile.buffer, {
      filename: audioFile.originalname,
      contentType: audioFile.mimetype,
    });

    console.log("  - FormData headers:", formData.getHeaders());

    let transcriptionResult;
    try {
      const transcriptionResponse = await axios.post(
        `${mlServiceUrl}/transcribe`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 60000, // 60 second timeout for transcription
        }
      );
      transcriptionResult = transcriptionResponse.data;
      console.log("✅ Transcription response:", transcriptionResult);
    } catch (axiosError) {
      console.error("❌ Voice service error:", axiosError.message);
      if (axiosError.response) {
        console.error("  - Status:", axiosError.response.status);
        console.error("  - Data:", axiosError.response.data);
        return res.status(axiosError.response.status).json({
          success: false,
          error:
            axiosError.response.data?.error || "Failed to transcribe audio",
        });
      }
      throw axiosError;
    }

    if (!transcriptionResult.success) {
      return res.status(400).json({
        success: false,
        error: transcriptionResult.error || "Failed to transcribe audio",
      });
    }

    const transcribedText = transcriptionResult.data.text;

    if (!transcribedText || transcribedText.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error:
          "Could not understand the audio. Please speak clearly and try again.",
      });
    }

    // Now process the transcribed text as a regular answer
    // Store the transcription in the question
    const currentQuestion = session.questions.find(
      (q) => q.questionNumber === parseInt(questionNumber)
    );
    if (!currentQuestion) {
      return res
        .status(400)
        .json({success: false, error: "Question not found"});
    }

    if (currentQuestion.userAnswer) {
      return res
        .status(400)
        .json({success: false, error: "Question already answered"});
    }

    // Submit the transcribed answer
    session.submitAnswer(
      parseInt(questionNumber),
      transcribedText.trim(),
      "voice"
    );
    currentQuestion.transcribedText = transcribedText;

    // Evaluate the answer
    const evaluation = await interviewService.evaluateAnswer(
      {
        question: currentQuestion.questionText,
        answer: transcribedText.trim(),
        questionType: currentQuestion.questionType,
        category: currentQuestion.category,
        expectedKeywords: currentQuestion.expectedKeywords,
        role: session.role,
        experienceLevel: session.experienceLevel,
      },
      req.user
    );

    // Add evaluation to the question
    session.addEvaluation(parseInt(questionNumber), {
      score: evaluation.score,
      relevance: evaluation.relevance,
      technicalAccuracy: evaluation.technicalAccuracy,
      clarity: evaluation.clarity,
      confidence: evaluation.confidence,
      roleFit: evaluation.roleFit,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      missingKeywords: evaluation.missingKeywords,
      suggestedAnswer: evaluation.suggestedAnswer,
      improvementTips: evaluation.improvementTips,
      feedback: evaluation.feedback,
    });

    // Check if interview is complete
    const answeredCount = session.questions.filter(
      (q) => q.userAnswer || q.skipped
    ).length;
    const isComplete = answeredCount >= session.totalQuestions;

    let nextQuestion = null;

    if (!isComplete && answeredCount < session.totalQuestions) {
      // Generate next question
      const previousQuestions = session.questions.map((q) => q.questionText);
      const previousAnswers = session.questions.map((q) => q.userAnswer || "");

      const recentScores = session.questions
        .slice(-3)
        .map((q) => q.evaluation?.score || 50);
      const avgRecentScore =
        recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      let currentDifficulty = "medium";
      if (avgRecentScore >= 80) currentDifficulty = "hard";
      else if (avgRecentScore <= 40) currentDifficulty = "easy";

      const questionConfig = {
        interviewType: session.interviewType,
        role: session.role,
        experienceLevel: session.experienceLevel,
        resumeText: session.resumeText,
        jobDescription: session.jobDescription,
        targetSkills: session.targetSkills,
        previousQuestions,
        previousAnswers,
        currentDifficulty,
        questionNumber: session.questions.length + 1,
      };

      const questionData = await interviewService.generateQuestion(
        questionConfig,
        req.user
      );

      session.addQuestion({
        questionText: questionData.question,
        questionType: questionData.questionType,
        category: questionData.category,
        difficulty: questionData.difficulty,
      });

      nextQuestion = {
        number: session.questions.length,
        text: questionData.question,
        type: questionData.questionType,
        category: questionData.category,
      };

      // Generate audio for next question in live mode
      if (session.mode === "live") {
        nextQuestion.audio = await generateQuestionAudio(
          nextQuestion.text,
          true
        );
      }
    }

    await session.save();

    res.json({
      success: true,
      data: {
        transcription: {
          text: transcribedText,
          duration: transcriptionResult.data.duration,
          wordCount: transcriptionResult.data.wordCount,
        },
        evaluation: {
          score: evaluation.score,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
          improvementTips: evaluation.improvementTips,
        },
        progress: {
          current: answeredCount,
          total: session.totalQuestions,
          percentage: Math.round(
            (answeredCount / session.totalQuestions) * 100
          ),
        },
        nextQuestion,
        isComplete,
      },
    });
  } catch (error) {
    console.error("❌ Submit voice answer error:", error);
    res
      .status(500)
      .json({success: false, error: "Failed to process voice answer"});
  }
};

export default {
  getInterviewConfig,
  createSession,
  startSession,
  submitAnswer,
  submitVoiceAnswer,
  skipQuestion,
  completeSession,
  getSession,
  getResult,
  getHistory,
  getStats,
  abandonSession,
};
