#!/bin/bash

# Quick Validation Test Script
# Tests key validation scenarios with delays to avoid rate limiting

BASE_URL="http://localhost:5000/api"

echo "🧪 QUICK VALIDATION TEST"
echo "========================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test function with delay
test_validation() {
    local test_name=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    
    echo -e "${BLUE}→${NC} Testing: $test_name"
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "  ${GREEN}✓ PASS${NC} - Got expected status $status_code"
    elif [ "$status_code" -eq 429 ]; then
        echo -e "  ${YELLOW}⚠ RATE LIMITED${NC} - Wait 15 minutes and try again"
    else
        echo -e "  ${RED}✗ FAIL${NC} - Expected $expected_status, got $status_code"
        echo -e "  Response: $(echo "$body" | head -c 200)"
    fi
    echo ""
    
    # Delay to avoid rate limiting
    sleep 3
}

echo "📝 Testing Authentication Validation"
echo "------------------------------------"

# Test 1: Valid registration (should succeed)
test_validation \
    "Valid Registration" \
    "/auth/register" \
    "{\"name\":\"John Doe\",\"email\":\"test$(date +%s)@example.com\",\"password\":\"SecurePass123!\"}" \
    201

# Test 2: Weak password (should fail)
test_validation \
    "Weak Password (no special char)" \
    "/auth/register" \
    "{\"name\":\"John Doe\",\"email\":\"test$(date +%s)@example.com\",\"password\":\"password123\"}" \
    400

# Test 3: Invalid email (should fail)
test_validation \
    "Invalid Email Format" \
    "/auth/register" \
    "{\"name\":\"John Doe\",\"email\":\"notanemail\",\"password\":\"SecurePass123!\"}" \
    400

# Test 4: Short password (should fail)
test_validation \
    "Password Too Short" \
    "/auth/register" \
    "{\"name\":\"John Doe\",\"email\":\"test$(date +%s)@example.com\",\"password\":\"Pass1!\"}" \
    400

# Test 5: Missing required field (should fail)
test_validation \
    "Missing Name Field" \
    "/auth/register" \
    "{\"email\":\"test$(date +%s)@example.com\",\"password\":\"SecurePass123!\"}" \
    400

echo ""
echo "🔒 Testing Security Protection"
echo "-------------------------------"

# Test 6: XSS attempt (should fail/sanitize)
test_validation \
    "XSS in Name Field" \
    "/auth/register" \
    "{\"name\":\"<script>alert('XSS')</script>\",\"email\":\"test$(date +%s)@example.com\",\"password\":\"SecurePass123!\"}" \
    400

# Test 7: NoSQL injection attempt (should fail)
test_validation \
    "NoSQL Injection in Login" \
    "/auth/login" \
    "{\"email\":{\"\$gt\":\"\"},\"password\":{\"\$gt\":\"\"}}" \
    400

echo ""
echo "================================"
echo "✅ Validation Testing Complete!"
echo "================================"
echo ""
echo "If tests show RATE LIMITED, wait 15 minutes and run again."
echo "This proves rate limiting is working correctly!"
echo ""
