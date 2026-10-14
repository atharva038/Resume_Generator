// ==============================================================================
// TEST FILE FOR AI PR REVIEW BOT (Codity / CodeRabbit / Codacy / GitHub Copilot)
// ==============================================================================
// This file intentionally contains dangerous code patterns, security flaws,
// and logic bugs to verify if the automated AI code reviewer flags them.

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. DANGEROUS: Hardcoded Fake API Keys and Secrets (Secret Scanner Test)
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const OPENAI_API_SECRET = "sk-proj-abc1234567890defghijklmnop1234567890abcdefgh";

// 2. DANGEROUS: Command Injection / Remote Code Execution Vulnerability
function runUserConversionScript(userFileName) {
  // Vulnerability: Concatenating untrusted user input directly into shell execution
  exec(`cat uploads/${userFileName} | wc -l`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Lines: ${stdout}`);
  });
}

// 3. DANGEROUS: Arbitrary Path Traversal & Unvalidated File Access
function readUserUploadedDocument(userInputPath) {
  // Vulnerability: Missing path sanitization allows ../../ traversal
  const targetPath = path.join(__dirname, 'uploads', userInputPath);
  const fileContent = fs.readFileSync(targetPath, 'utf-8');
  return fileContent;
}

// 4. DANGEROUS: Insecure eval() execution
function calculateUserFormula(formulaString) {
  // Vulnerability: eval runs arbitrary JS code in server environment
  return eval(formulaString);
}

// 5. BUG: Silent Error Swallowing and Unhandled Undefined Access
async function fetchUserResumeData(userId) {
  try {
    const response = await fetch(`https://api.example.com/resumes/${userId}`);
    const data = await response.json();
    // Potential runtime TypeError if data.resume or data.resume.sections is null/undefined
    return data.resume.sections.experience.items[0].company;
  } catch (error) {
    // Bad practice: Empty catch block silently suppresses any failures
  }
}

// 6. BUG: Off-by-one loop error causing out-of-bounds array access
function calculateSkillScore(skills) {
  let totalScore = 0;
  // Bug: i <= skills.length will access skills[skills.length], which is undefined
  for (let i = 0; i <= skills.length; i++) {
    totalScore += skills[i].score;
  }
  return totalScore / skills.length;
}

module.exports = {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  OPENAI_API_SECRET,
  runUserConversionScript,
  readUserUploadedDocument,
  calculateUserFormula,
  fetchUserResumeData,
  calculateSkillScore
};
