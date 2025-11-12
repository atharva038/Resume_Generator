#!/bin/bash

# ============================================
# ML Job Matching API - Test Script
# ============================================
# This script tests the ML matching endpoints
# with various resume and job combinations
# ============================================

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:5000/api/ml"
AUTH_TOKEN="YOUR_JWT_TOKEN_HERE"  # Replace with actual token

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}ML Job Matching API Test Suite${NC}"
echo -e "${BLUE}================================${NC}\n"

# ============================================
# Test 1: Full-Stack Developer - Perfect Match
# ============================================
echo -e "${YELLOW}Test 1: Full-Stack Developer (High Match Expected)${NC}"
curl -X POST "$BASE_URL/match-score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "resumeData": {
      "personalInfo": {
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "summary": "Experienced Full-Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies.",
      "skills": [
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
        "CI/CD"
      ],
      "experience": [
        {
          "role": "Senior Full-Stack Developer",
          "company": "Tech Innovations Inc.",
          "responsibilities": [
            "Led development of microservices-based platform",
            "Built React applications with Redux",
            "Implemented CI/CD pipelines using Docker and AWS"
          ]
        }
      ]
    },
    "jobDescription": "We are seeking a Senior Full-Stack Developer with 5+ years of experience. Required: React.js, Node.js, MongoDB or PostgreSQL, Docker, AWS, Microservices, CI/CD pipelines, TypeScript. Responsibilities: Design scalable web applications, architect backend APIs, deploy to cloud, mentor junior developers."
  }' | jq .

echo -e "\n${GREEN}✓ Test 1 Complete${NC}\n"
sleep 2

# ============================================
# Test 2: Frontend Developer - Good Match
# ============================================
echo -e "${YELLOW}Test 2: Frontend Developer (Good Match Expected)${NC}"
curl -X POST "$BASE_URL/match-score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "resumeData": {
      "personalInfo": {
        "name": "Sarah Johnson",
        "email": "sarah.j@example.com"
      },
      "summary": "Creative Frontend Developer with 4 years of experience in React and modern CSS.",
      "skills": [
        "React.js",
        "JavaScript",
        "TypeScript",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "Responsive Design",
        "Git",
        "Webpack"
      ],
      "experience": [
        {
          "role": "Frontend Developer",
          "company": "DesignHub",
          "responsibilities": [
            "Built interactive dashboards using React",
            "Implemented responsive designs with Tailwind",
            "Improved web performance to 95+ Lighthouse scores"
          ]
        }
      ]
    },
    "jobDescription": "Looking for React Frontend Developer with 3+ years experience. Required: React.js, TypeScript, HTML5, CSS3, Tailwind CSS, Responsive design, Webpack, Git. Nice to have: Next.js, Redux, Testing (Jest, Cypress). Responsibilities: Build reusable components, implement responsive designs, optimize performance."
  }' | jq .

echo -e "\n${GREEN}✓ Test 2 Complete${NC}\n"
sleep 2

# ============================================
# Test 3: Backend Developer vs DevOps Job (Low Match)
# ============================================
echo -e "${YELLOW}Test 3: Backend Developer vs DevOps Job (Low Match Expected)${NC}"
curl -X POST "$BASE_URL/match-score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "resumeData": {
      "personalInfo": {
        "name": "Michael Chen",
        "email": "michael.chen@example.com"
      },
      "summary": "Backend Engineer with 6 years of experience building APIs and microservices.",
      "skills": [
        "Node.js",
        "Python",
        "Express.js",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "GraphQL",
        "Docker"
      ],
      "experience": [
        {
          "role": "Senior Backend Engineer",
          "company": "CloudTech Solutions",
          "responsibilities": [
            "Designed microservices architecture",
            "Built GraphQL APIs",
            "Optimized database queries"
          ]
        }
      ]
    },
    "jobDescription": "DevOps Engineer position. Required: Kubernetes, Terraform, AWS EKS, Jenkins, GitLab CI, Linux administration, Bash scripting, Prometheus, Grafana. Responsibilities: Manage Kubernetes clusters, build CI/CD pipelines, write Infrastructure as Code."
  }' | jq .

echo -e "\n${GREEN}✓ Test 3 Complete${NC}\n"
sleep 2

# ============================================
# Test 4: Junior Developer (Fair Match)
# ============================================
echo -e "${YELLOW}Test 4: Junior Developer (Fair Match Expected)${NC}"
curl -X POST "$BASE_URL/match-score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "resumeData": {
      "personalInfo": {
        "name": "Alex Kim",
        "email": "alex.kim@example.com"
      },
      "summary": "Recent CS graduate with internship experience and strong web development foundation.",
      "skills": [
        "JavaScript",
        "React.js",
        "HTML5",
        "CSS3",
        "Node.js",
        "Git",
        "MySQL"
      ],
      "experience": [
        {
          "role": "Software Development Intern",
          "company": "TechStart",
          "responsibilities": [
            "Developed React components",
            "Fixed bugs",
            "Participated in Agile sprints"
          ]
        }
      ],
      "education": [
        {
          "degree": "Bachelor of Science in Computer Science",
          "institution": "University of Texas"
        }
      ]
    },
    "jobDescription": "Junior Full-Stack Developer position. Required: JavaScript, HTML5, CSS3, React.js, Node.js, MySQL, Git. Nice to have: TypeScript, Docker, Testing. Responsibilities: Develop web applications, write clean code, participate in code reviews. 0-2 years experience required."
  }' | jq .

echo -e "\n${GREEN}✓ Test 4 Complete${NC}\n"
sleep 2

# ============================================
# Test 5: Skill Gap Analysis
# ============================================
echo -e "${YELLOW}Test 5: Skill Gap Analysis${NC}"
curl -X POST "$BASE_URL/skill-gap-analysis" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "resumeData": {
      "personalInfo": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "skills": [
        "React.js",
        "Node.js",
        "JavaScript",
        "MongoDB",
        "Git"
      ],
      "experience": [
        {
          "role": "Full-Stack Developer",
          "responsibilities": [
            "Built web applications with React and Node.js",
            "Managed MongoDB databases"
          ]
        }
      ]
    },
    "jobDescription": "Senior Full-Stack Developer. Required: React.js, Node.js, TypeScript, Docker, Kubernetes, AWS, GraphQL, Microservices, CI/CD. Build scalable applications, deploy to cloud, mentor team."
  }' | jq .

echo -e "\n${GREEN}✓ Test 5 Complete${NC}\n"
sleep 2

# ============================================
# Test 6: Quick Match (No Auth Required)
# ============================================
echo -e "${YELLOW}Test 6: Quick Match (Public Endpoint)${NC}"
curl -X POST "$BASE_URL/quick-match" \
  -H "Content-Type: application/json" \
  -d '{
    "skills": [
      "React.js",
      "Node.js",
      "JavaScript",
      "TypeScript",
      "Docker",
      "AWS"
    ],
    "jobDescription": "Looking for a developer with React.js, Node.js, TypeScript, Docker, Kubernetes, and AWS experience."
  }' | jq .

echo -e "\n${GREEN}✓ Test 6 Complete${NC}\n"

# ============================================
# Test 7: Error Cases
# ============================================
echo -e "${YELLOW}Test 7: Error Case - Missing Resume Data${NC}"
curl -X POST "$BASE_URL/match-score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "jobDescription": "Some job description"
  }' | jq .

echo -e "\n${GREEN}✓ Test 7 Complete${NC}\n"

echo -e "${YELLOW}Test 8: Error Case - Short Job Description${NC}"
curl -X POST "$BASE_URL/match-score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "resumeData": {
      "skills": ["React"]
    },
    "jobDescription": "Short desc"
  }' | jq .

echo -e "\n${GREEN}✓ Test 8 Complete${NC}\n"

# ============================================
# Summary
# ============================================
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}All Tests Complete!${NC}"
echo -e "${BLUE}================================${NC}\n"

echo -e "${GREEN}Expected Results:${NC}"
echo -e "  Test 1: ~85-95% match (Full-Stack perfect match)"
echo -e "  Test 2: ~75-85% match (Frontend good match)"
echo -e "  Test 3: ~30-50% match (Backend vs DevOps mismatch)"
echo -e "  Test 4: ~60-75% match (Junior developer)"
echo -e "  Test 5: Skill gaps identified (TypeScript, Docker, K8s, etc.)"
echo -e "  Test 6: Quick keyword match percentage"
echo -e "  Test 7: 400 error (missing resume data)"
echo -e "  Test 8: 400 error (job description too short)"

echo -e "\n${YELLOW}Note: Replace AUTH_TOKEN with a valid JWT token before running!${NC}\n"
