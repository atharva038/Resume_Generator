# API Testing Guide

## Environment Setup

```bash
# Set base URL
export API_URL="http://localhost:5000/api"

# After registration/login, set token
export TOKEN="your_jwt_token_here"
```

## Authentication Tests

### 1. Register New User
```bash
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Developer",
    "email": "jane@example.com",
    "password": "secure123"
  }' \
  | jq
```

Expected Response (200):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "jane@example.com",
    "name": "Jane Developer"
  },
  "token": "eyJhbGci..."
}
```

### 2. Login
```bash
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "secure123"
  }' \
  | jq
```

### 3. Get Current User
```bash
curl -X GET $API_URL/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

## Resume Upload & Parse Tests

### 4. Upload PDF Resume
```bash
curl -X POST $API_URL/resume/upload \
  -F "resume=@./sample_resume.pdf" \
  -v \
  | jq
```

Expected Response (200):
```json
{
  "message": "Resume uploaded and parsed successfully",
  "data": {
    "name": "John Smith",
    "contact": {
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "summary": "...",
    "skills": [...],
    "experience": [...],
    "education": [...]
  }
}
```

### 5. Upload DOCX Resume
```bash
curl -X POST $API_URL/resume/upload \
  -F "resume=@./sample_resume.docx" \
  | jq
```

## AI Enhancement Tests

### 6. Enhance Experience Bullets
```bash
curl -X POST $API_URL/resume/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "content": [
      "Worked on backend development",
      "Fixed bugs and issues",
      "Collaborated with team members"
    ],
    "sectionType": "experience"
  }' \
  | jq
```

Expected Enhanced Output:
```json
{
  "message": "Content enhanced successfully",
  "enhanced": [
    "Architected and implemented scalable backend microservices processing 50K+ daily requests",
    "Resolved 30+ critical production bugs, improving system stability by 45%",
    "Led cross-functional team of 5 engineers to deliver features 20% ahead of schedule"
  ]
}
```

### 7. Enhance Summary
```bash
curl -X POST $API_URL/resume/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Software engineer with experience in web development",
    "sectionType": "summary"
  }' \
  | jq
```

### 8. Generate Summary from Resume
```bash
curl -X POST $API_URL/resume/generate-summary \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "name": "John Smith",
      "experience": [
        {
          "title": "Senior Engineer",
          "company": "Tech Corp",
          "bullets": ["Led team", "Built features"]
        }
      ],
      "skills": [
        {"category": "Languages", "items": ["JavaScript", "Python"]}
      ]
    }
  }' \
  | jq
```

## Resume CRUD Tests (Authenticated)

### 9. Save Resume
```bash
curl -X POST $API_URL/resume/save \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "contact": {
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "summary": "Experienced software engineer...",
    "skills": [
      {
        "category": "Programming Languages",
        "items": ["JavaScript", "Python", "Java"]
      }
    ],
    "experience": [
      {
        "company": "Tech Corp",
        "title": "Senior Software Engineer",
        "location": "San Francisco, CA",
        "startDate": "Jan 2020",
        "endDate": "Present",
        "current": true,
        "bullets": [
          "Led development of microservices architecture",
          "Improved system performance by 40%"
        ]
      }
    ],
    "education": [
      {
        "institution": "University of Technology",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "startDate": "Sep 2015",
        "endDate": "May 2019",
        "gpa": "3.8"
      }
    ]
  }' \
  | jq
```

### 10. List All Resumes
```bash
curl -X GET $API_URL/resume/list \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

### 11. Get Resume by ID
```bash
RESUME_ID="your_resume_id_here"

curl -X GET $API_URL/resume/$RESUME_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

### 12. Update Resume
```bash
curl -X PUT $API_URL/resume/$RESUME_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith (Updated)",
    "summary": "Updated summary..."
  }' \
  | jq
```

### 13. Delete Resume
```bash
curl -X DELETE $API_URL/resume/$RESUME_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

## Error Handling Tests

### 14. Upload Invalid File Type
```bash
curl -X POST $API_URL/resume/upload \
  -F "resume=@./test.txt" \
  -v
```

Expected: 400 Bad Request

### 15. Upload Without File
```bash
curl -X POST $API_URL/resume/upload \
  -v
```

Expected: 400 Bad Request

### 16. Access Protected Route Without Token
```bash
curl -X GET $API_URL/resume/list \
  -v
```

Expected: 401 Unauthorized

### 17. Invalid Login Credentials
```bash
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpass"
  }'
```

Expected: 401 Unauthorized

## Performance Tests

### 18. Large File Upload
```bash
# Create a 4MB test file
dd if=/dev/zero of=large_resume.pdf bs=1M count=4

curl -X POST $API_URL/resume/upload \
  -F "resume=@./large_resume.pdf" \
  -w "\nTime: %{time_total}s\n"
```

### 19. Concurrent Requests
```bash
# Test multiple enhance requests simultaneously
for i in {1..5}; do
  curl -X POST $API_URL/resume/enhance \
    -H "Content-Type: application/json" \
    -d "{\"content\": [\"Test bullet $i\"], \"sectionType\": \"experience\"}" \
    &
done
wait
```

## Health Check

### 20. Server Health
```bash
curl -X GET $API_URL/health | jq
```

Expected Response:
```json
{
  "status": "ok",
  "message": "ATS Resume API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Integration Test Flow

Complete end-to-end test:

```bash
#!/bin/bash

echo "🧪 Running Integration Tests..."

# 1. Health check
echo "\n1️⃣ Testing health endpoint..."
curl -s $API_URL/health | jq -r '.status'

# 2. Register user
echo "\n2️⃣ Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "test123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
echo "Token: ${TOKEN:0:20}..."

# 3. Upload resume
echo "\n3️⃣ Uploading resume..."
UPLOAD_RESPONSE=$(curl -s -X POST $API_URL/resume/upload \
  -F "resume=@./sample_resume.pdf")

echo $UPLOAD_RESPONSE | jq -r '.message'

# 4. Enhance content
echo "\n4️⃣ Enhancing content..."
ENHANCE_RESPONSE=$(curl -s -X POST $API_URL/resume/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "content": ["Developed features"],
    "sectionType": "experience"
  }')

echo $ENHANCE_RESPONSE | jq -r '.message'

# 5. Save resume
echo "\n5️⃣ Saving resume..."
SAVE_RESPONSE=$(curl -s -X POST $API_URL/resume/save \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$(echo $UPLOAD_RESPONSE | jq '.data')")

RESUME_ID=$(echo $SAVE_RESPONSE | jq -r '.resume.id')
echo "Resume ID: $RESUME_ID"

# 6. List resumes
echo "\n6️⃣ Listing resumes..."
curl -s -X GET $API_URL/resume/list \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.resumes | length'

# 7. Delete resume
echo "\n7️⃣ Deleting resume..."
curl -s -X DELETE $API_URL/resume/$RESUME_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.message'

echo "\n✅ Integration tests completed!"
```

Save as `test_api.sh`, make executable with `chmod +x test_api.sh`, and run with `./test_api.sh`

## Notes

- Replace `$API_URL` with your server URL
- Replace `$TOKEN` with actual JWT token from login/register
- Use `jq` for JSON formatting (install with `brew install jq` on macOS)
- Check response status codes with `-v` flag for debugging
- Some tests require sample files (sample_resume.pdf/docx)
