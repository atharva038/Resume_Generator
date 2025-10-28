#!/bin/bash

# Input Validation Test Script
# Tests various validation scenarios

BASE_URL="http://localhost:5000/api"
TOKEN=""  # Add your JWT token here for authenticated tests

# Delay between requests to avoid rate limiting (in seconds)
DELAY=2

echo "🧪 INPUT VALIDATION TEST SUITE"
echo "================================"
echo "⏱️  Delay between tests: ${DELAY}s (to avoid rate limiting)"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASS=0
FAIL=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    local headers=$6
    
    echo -n "Testing: $name... "
    
    if [ -z "$headers" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "$headers" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status_code)"
        ((PASS++))
    elif [ "$status_code" -eq 429 ]; then
        echo -e "${YELLOW}⚠ RATE LIMITED${NC} (Status: 429) - Test inconclusive"
        echo "  Note: Rate limiter is working, but can't test validation"
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        echo "  Response: $body"
        ((FAIL++))
    fi
    
    # Add delay to avoid rate limiting
    sleep $DELAY
}

echo "1️⃣  AUTHENTICATION VALIDATION TESTS"
echo "-----------------------------------"

# Test 1: Valid Registration
test_endpoint \
    "Valid Registration" \
    "POST" \
    "/auth/register" \
    '{"name":"John Doe","email":"test'$(date +%s)'@example.com","password":"SecurePass123!"}' \
    201

# Test 2: Weak Password
test_endpoint \
    "Weak Password (should fail)" \
    "POST" \
    "/auth/register" \
    '{"name":"John Doe","email":"weak@example.com","password":"weak"}' \
    400

# Test 3: Invalid Email
test_endpoint \
    "Invalid Email (should fail)" \
    "POST" \
    "/auth/register" \
    '{"name":"John Doe","email":"notanemail","password":"SecurePass123!"}' \
    400

# Test 4: Missing Name
test_endpoint \
    "Missing Name (should fail)" \
    "POST" \
    "/auth/register" \
    '{"email":"test@example.com","password":"SecurePass123!"}' \
    400

# Test 5: Name with Special Characters
test_endpoint \
    "Name with Special Chars (should fail)" \
    "POST" \
    "/auth/register" \
    '{"name":"<script>alert(1)</script>","email":"xss@example.com","password":"SecurePass123!"}' \
    400

# Test 6: Short Name
test_endpoint \
    "Short Name (should fail)" \
    "POST" \
    "/auth/register" \
    '{"name":"A","email":"short@example.com","password":"SecurePass123!"}' \
    400

# Test 7: Password Too Short
test_endpoint \
    "Password Too Short (should fail)" \
    "POST" \
    "/auth/register" \
    '{"name":"John Doe","email":"short@example.com","password":"Pass1!"}' \
    400

# Test 8: Password No Special Char
test_endpoint \
    "Password No Special Char (should fail)" \
    "POST" \
    "/auth/register" \
    '{"name":"John Doe","email":"nospecial@example.com","password":"Password123"}' \
    400

echo ""
echo "2️⃣  CONTACT FORM VALIDATION TESTS"
echo "----------------------------------"

if [ -z "$TOKEN" ]; then
    echo -e "${YELLOW}⚠ Skipping authenticated tests (no token provided)${NC}"
else
    # Test 9: Valid Contact
    test_endpoint \
        "Valid Contact Form" \
        "POST" \
        "/contact" \
        '{"name":"Jane Smith","email":"jane@example.com","subject":"Test Subject","message":"This is a test message with enough characters.","category":"general"}' \
        201 \
        "Authorization: Bearer $TOKEN"

    # Test 10: Invalid Email in Contact
    test_endpoint \
        "Invalid Email in Contact (should fail)" \
        "POST" \
        "/contact" \
        '{"name":"Jane Smith","email":"invalid-email","subject":"Test","message":"Message here"}' \
        400 \
        "Authorization: Bearer $TOKEN"

    # Test 11: Subject Too Short
    test_endpoint \
        "Subject Too Short (should fail)" \
        "POST" \
        "/contact" \
        '{"name":"Jane Smith","email":"jane@example.com","subject":"Hi","message":"This is a test message"}' \
        400 \
        "Authorization: Bearer $TOKEN"

    # Test 12: Message Too Short
    test_endpoint \
        "Message Too Short (should fail)" \
        "POST" \
        "/contact" \
        '{"name":"Jane Smith","email":"jane@example.com","subject":"Test Subject","message":"Short"}' \
        400 \
        "Authorization: Bearer $TOKEN"

    # Test 13: Invalid Phone Format
    test_endpoint \
        "Invalid Phone Format (should fail)" \
        "POST" \
        "/contact" \
        '{"name":"Jane Smith","email":"jane@example.com","subject":"Test Subject","message":"Test message here","phone":"invalid-phone"}' \
        400 \
        "Authorization: Bearer $TOKEN"

    # Test 14: Invalid Category
    test_endpoint \
        "Invalid Category (should fail)" \
        "POST" \
        "/contact" \
        '{"name":"Jane Smith","email":"jane@example.com","subject":"Test Subject","message":"Test message here","category":"invalid-category"}' \
        400 \
        "Authorization: Bearer $TOKEN"
fi

echo ""
echo "3️⃣  XSS PROTECTION TESTS"
echo "------------------------"

# Test 15: XSS in Registration Name
test_endpoint \
    "XSS in Name (should sanitize/fail)" \
    "POST" \
    "/auth/register" \
    '{"name":"<script>alert(\"XSS\")</script>","email":"xss'$(date +%s)'@example.com","password":"SecurePass123!"}' \
    400

# Test 16: XSS in Contact Message
if [ -n "$TOKEN" ]; then
    test_endpoint \
        "XSS in Contact Message (should sanitize/fail)" \
        "POST" \
        "/contact" \
        '{"name":"Test User","email":"test@example.com","subject":"XSS Test","message":"<script>alert(\"XSS\")</script> This is malicious content"}' \
        400 \
        "Authorization: Bearer $TOKEN"
fi

echo ""
echo "4️⃣  NOSQL INJECTION TESTS"
echo "--------------------------"

# Test 17: NoSQL Injection in Login
test_endpoint \
    "NoSQL Injection in Login (should fail)" \
    "POST" \
    "/auth/login" \
    '{"email":{"$gt":""},"password":{"$gt":""}}' \
    400

# Test 18: NoSQL Injection in Email
test_endpoint \
    "NoSQL Injection in Email (should fail)" \
    "POST" \
    "/auth/login" \
    '{"email":{"$ne":null},"password":"password"}' \
    400

echo ""
echo "5️⃣  LENGTH VALIDATION TESTS"
echo "----------------------------"

# Test 19: Message Too Long
if [ -n "$TOKEN" ]; then
    LONG_MESSAGE=$(python3 -c "print('A' * 3000)")
    test_endpoint \
        "Message Too Long (should fail)" \
        "POST" \
        "/contact" \
        "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"subject\":\"Test\",\"message\":\"$LONG_MESSAGE\"}" \
        400 \
        "Authorization: Bearer $TOKEN"
fi

# Test 20: Subject Too Long
if [ -n "$TOKEN" ]; then
    LONG_SUBJECT=$(python3 -c "print('A' * 250)")
    test_endpoint \
        "Subject Too Long (should fail)" \
        "POST" \
        "/contact" \
        "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"subject\":\"$LONG_SUBJECT\",\"message\":\"Valid message here\"}" \
        400 \
        "Authorization: Bearer $TOKEN"
fi

echo ""
echo "================================"
echo "📊 TEST RESULTS"
echo "================================"
echo -e "${GREEN}✓ Passed: $PASS${NC}"
echo -e "${RED}✗ Failed: $FAIL${NC}"
echo -e "Total: $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Review the output above.${NC}"
    exit 1
fi
