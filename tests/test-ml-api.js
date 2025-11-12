// ============================================
// ML Job Matching API - Node.js Test Script
// ============================================
// Run: node test-ml-api.js
// ============================================

const axios = require("axios");

// Configuration
const BASE_URL = "http://localhost:5000/api/ml";
const AUTH_TOKEN = "YOUR_JWT_TOKEN_HERE"; // Replace with actual token

// Test data
const fullStackResume = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  summary:
    "Experienced Full-Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies.",
  skills: [
    "React.js",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Git",
    "RESTful APIs",
    "Microservices",
    "CI/CD",
  ],
  experience: [
    {
      role: "Senior Full-Stack Developer",
      company: "Tech Innovations Inc.",
      responsibilities: [
        "Led development of microservices-based platform",
        "Built React applications with Redux",
        "Implemented CI/CD pipelines using Docker and AWS",
      ],
    },
  ],
};

const fullStackJobDescription = `
We are seeking a Senior Full-Stack Developer with 5+ years of experience.

Required Skills:
- React.js and modern JavaScript (ES6+)
- Node.js and Express.js
- MongoDB or PostgreSQL
- Docker and containerization
- AWS cloud services
- Microservices architecture
- CI/CD pipelines
- TypeScript

Responsibilities:
- Design and build scalable web applications
- Architect backend APIs and database schemas
- Deploy applications to cloud infrastructure
- Mentor junior developers
- Participate in code reviews
`;

// Helper function for API calls
const apiCall = async (endpoint, data, useAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (useAuth) {
    headers["Authorization"] = `Bearer ${AUTH_TOKEN}`;
  }

  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        status: error.response.status,
        message: error.response.data,
      };
    }
    throw error;
  }
};

// Test functions
const tests = [
  {
    name: "Test 1: Full-Stack Developer - High Match",
    run: async () => {
      console.log("\n🧪 Test 1: Full-Stack Developer (High Match Expected)");
      console.log("━".repeat(60));

      const result = await apiCall("/match-score", {
        resumeData: fullStackResume,
        jobDescription: fullStackJobDescription,
      });

      console.log("Result:", JSON.stringify(result, null, 2));

      if (result.success && result.data.matchPercentage >= 80) {
        console.log("✅ PASS: High match score achieved");
      } else {
        console.log("❌ FAIL: Expected high match score (80+)");
      }
    },
  },

  {
    name: "Test 2: Frontend Developer - Good Match",
    run: async () => {
      console.log("\n🧪 Test 2: Frontend Developer (Good Match Expected)");
      console.log("━".repeat(60));

      const frontendResume = {
        personalInfo: {name: "Sarah Johnson", email: "sarah@example.com"},
        skills: [
          "React.js",
          "JavaScript",
          "TypeScript",
          "HTML5",
          "CSS3",
          "Tailwind CSS",
        ],
        experience: [
          {
            role: "Frontend Developer",
            responsibilities: [
              "Built React dashboards",
              "Implemented responsive designs",
            ],
          },
        ],
      };

      const frontendJob =
        "Looking for React Frontend Developer. Required: React.js, TypeScript, HTML5, CSS3, Tailwind CSS. Build responsive UIs and optimize performance.";

      const result = await apiCall("/match-score", {
        resumeData: frontendResume,
        jobDescription: frontendJob,
      });

      console.log("Result:", JSON.stringify(result, null, 2));

      if (result.success && result.data.matchPercentage >= 70) {
        console.log("✅ PASS: Good match score achieved");
      } else {
        console.log("❌ FAIL: Expected good match score (70+)");
      }
    },
  },

  {
    name: "Test 3: Skill Gap Analysis",
    run: async () => {
      console.log("\n🧪 Test 3: Skill Gap Analysis");
      console.log("━".repeat(60));

      const result = await apiCall("/skill-gap-analysis", {
        resumeData: {
          skills: ["React.js", "Node.js", "JavaScript", "MongoDB"],
          experience: [
            {role: "Developer", responsibilities: ["Built web apps"]},
          ],
        },
        jobDescription:
          "Need developer with React, Node.js, TypeScript, Docker, Kubernetes, AWS, GraphQL. Build scalable microservices and deploy to cloud.",
      });

      console.log("Result:", JSON.stringify(result, null, 2));

      if (
        result.success &&
        result.data.missingSkills &&
        result.data.missingSkills.length > 0
      ) {
        console.log("✅ PASS: Skill gaps identified");
      } else {
        console.log("❌ FAIL: Expected skill gaps to be identified");
      }
    },
  },

  {
    name: "Test 4: Quick Match (Public)",
    run: async () => {
      console.log("\n🧪 Test 4: Quick Match (No Auth)");
      console.log("━".repeat(60));

      const result = await apiCall(
        "/quick-match",
        {
          skills: ["React.js", "Node.js", "TypeScript", "Docker", "AWS"],
          jobDescription:
            "Looking for developer with React, Node.js, TypeScript, Docker, Kubernetes, AWS",
        },
        false
      );

      console.log("Result:", JSON.stringify(result, null, 2));

      if (result.success && typeof result.data.matchPercentage === "number") {
        console.log("✅ PASS: Quick match returned percentage");
      } else {
        console.log("❌ FAIL: Expected match percentage");
      }
    },
  },

  {
    name: "Test 5: Error - Missing Resume Data",
    run: async () => {
      console.log("\n🧪 Test 5: Error Handling - Missing Resume Data");
      console.log("━".repeat(60));

      const result = await apiCall("/match-score", {
        jobDescription: "Some job description",
      });

      console.log("Result:", JSON.stringify(result, null, 2));

      if (result.error && result.status === 400) {
        console.log("✅ PASS: Correctly returned 400 error");
      } else {
        console.log("❌ FAIL: Expected 400 error");
      }
    },
  },

  {
    name: "Test 6: Error - Short Job Description",
    run: async () => {
      console.log("\n🧪 Test 6: Error Handling - Short Job Description");
      console.log("━".repeat(60));

      const result = await apiCall("/match-score", {
        resumeData: {skills: ["React"]},
        jobDescription: "Short",
      });

      console.log("Result:", JSON.stringify(result, null, 2));

      if (result.error && result.status === 400) {
        console.log("✅ PASS: Correctly returned 400 error");
      } else {
        console.log("❌ FAIL: Expected 400 error for short description");
      }
    },
  },
];

// Run all tests
const runTests = async () => {
  console.log("\n🚀 ML Job Matching API Test Suite");
  console.log("═".repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(
    `Auth Token: ${
      AUTH_TOKEN === "YOUR_JWT_TOKEN_HERE" ? "⚠️  NOT SET" : "✅ Configured"
    }`
  );

  if (AUTH_TOKEN === "YOUR_JWT_TOKEN_HERE") {
    console.log("\n⚠️  WARNING: Please set AUTH_TOKEN before running tests!");
    console.log("Get a token by logging in and checking the response.\n");
  }

  let passCount = 0;
  let failCount = 0;

  for (const test of tests) {
    try {
      await test.run();
      passCount++;
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      failCount++;
    }

    // Wait between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n═".repeat(60));
  console.log("📊 Test Summary");
  console.log("═".repeat(60));
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log("═".repeat(60));
};

// Run
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {runTests};
