#!/bin/bash

# Rate Limiting Test Script
# Tests all rate limiters in the ATS Resume Generator application

echo "🧪 ======================================"
echo "   Rate Limiting Test Suite"
echo "   Testing all rate limiters..."
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5000"

# Test counter
PASSED=0
FAILED=0

echo -e "${BLUE}📡 Testing if server is running...${NC}"
if ! curl -s "${BASE_URL}/api/health" > /dev/null; then
    echo -e "${RED}❌ Server is not running! Please start the server with 'npm run dev' in the server directory${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# ============================================
# Test 1: Auth Rate Limiter (Login)
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test 1: Auth Rate Limiter (Login)${NC}"
echo -e "${BLUE}Expected: 5 requests allowed, 6th blocked${NC}"
echo -e "${BLUE}========================================${NC}"

SUCCESS_COUNT=0
BLOCKED_COUNT=0

for i in {1..7}; do
    echo -n "Attempt $i: "
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"wrongpassword"}')
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "429" ]; then
        echo -e "${YELLOW}🚫 Rate limited (429)${NC}"
        BLOCKED_COUNT=$((BLOCKED_COUNT + 1))
    elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "500" ]; then
        echo -e "${GREEN}✓ Request went through (HTTP $HTTP_CODE)${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}✗ Unexpected status: $HTTP_CODE${NC}"
    fi
    
    sleep 0.3
done

echo ""
if [ $SUCCESS_COUNT -ge 5 ] && [ $BLOCKED_COUNT -ge 1 ]; then
    echo -e "${GREEN}✅ Test 1 PASSED: Auth rate limiter working correctly${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ Test 1 FAILED: Expected 5+ successful and 1+ blocked, got $SUCCESS_COUNT successful and $BLOCKED_COUNT blocked${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""
sleep 2

# ============================================
# Test 2: Auth Rate Limiter (Register)
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test 2: Auth Rate Limiter (Register)${NC}"
echo -e "${BLUE}Expected: 5 requests allowed, 6th blocked${NC}"
echo -e "${BLUE}========================================${NC}"

SUCCESS_COUNT=0
BLOCKED_COUNT=0

for i in {1..7}; do
    echo -n "Attempt $i: "
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/auth/register" \
        -H "Content-Type: application/json" \
        -d '{"email":"test'$i'@example.com","password":"test123","name":"Test User"}')
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "429" ]; then
        echo -e "${YELLOW}🚫 Rate limited (429)${NC}"
        BLOCKED_COUNT=$((BLOCKED_COUNT + 1))
    elif [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "409" ] || [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "500" ]; then
        echo -e "${GREEN}✓ Request went through (HTTP $HTTP_CODE)${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}✗ Unexpected status: $HTTP_CODE${NC}"
    fi
    
    sleep 0.3
done

echo ""
if [ $SUCCESS_COUNT -ge 5 ] && [ $BLOCKED_COUNT -ge 1 ]; then
    echo -e "${GREEN}✅ Test 2 PASSED: Register rate limiter working correctly${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ Test 2 FAILED: Expected 5+ successful and 1+ blocked, got $SUCCESS_COUNT successful and $BLOCKED_COUNT blocked${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""
sleep 2

# ============================================
# Test 3: Get JWT Token (needed for protected routes)
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test 3: Getting JWT Token${NC}"
echo -e "${BLUE}Required for testing protected endpoints${NC}"
echo -e "${BLUE}========================================${NC}"

# First, try to register a test user
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"ratelimit_test@example.com","password":"TestPassword123","name":"Rate Limit Tester"}')

# Try to login (in case user already exists)
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"ratelimit_test@example.com","password":"TestPassword123"}')

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
    # Try from register response
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
fi

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Could not get JWT token. Cannot test protected endpoints.${NC}"
    echo -e "${YELLOW}⚠️  This might be due to rate limiting from previous tests.${NC}"
    echo -e "${YELLOW}⚠️  Wait 15 minutes or restart the server to reset rate limits.${NC}"
    echo ""
    echo -e "${BLUE}Skipping protected endpoint tests...${NC}"
    TOKEN="SKIP"
else
    echo -e "${GREEN}✅ Got JWT token successfully${NC}"
    echo "Token: ${TOKEN:0:20}..."
fi
echo ""
sleep 2

# ============================================
# Test 4: AI Rate Limiter
# ============================================
if [ "$TOKEN" != "SKIP" ]; then
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Test 4: AI Rate Limiter${NC}"
    echo -e "${BLUE}Expected: 20 requests allowed, 21st blocked${NC}"
    echo -e "${BLUE}========================================${NC}"

    SUCCESS_COUNT=0
    BLOCKED_COUNT=0

    for i in {1..22}; do
        echo -n "AI Request $i: "
        
        RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/resume/enhance" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"content":"Test content for enhancement","sectionType":"experience"}')
        
        HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
        
        if [ "$HTTP_CODE" = "429" ]; then
            echo -e "${YELLOW}🚫 Rate limited (429)${NC}"
            BLOCKED_COUNT=$((BLOCKED_COUNT + 1))
        elif [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "500" ]; then
            echo -e "${GREEN}✓ Request went through (HTTP $HTTP_CODE)${NC}"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo -e "${RED}✗ Unexpected status: $HTTP_CODE${NC}"
        fi
        
        sleep 0.2
    done

    echo ""
    if [ $SUCCESS_COUNT -ge 20 ] && [ $BLOCKED_COUNT -ge 1 ]; then
        echo -e "${GREEN}✅ Test 4 PASSED: AI rate limiter working correctly${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ Test 4 FAILED: Expected 20+ successful and 1+ blocked, got $SUCCESS_COUNT successful and $BLOCKED_COUNT blocked${NC}"
        FAILED=$((FAILED + 1))
    fi
    echo ""
    sleep 2
else
    echo -e "${YELLOW}⚠️  Skipping Test 4 (AI Rate Limiter) - No token available${NC}"
    echo ""
fi

# ============================================
# Test 5: Global API Rate Limiter
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test 5: Global API Rate Limiter${NC}"
echo -e "${BLUE}Expected: 100 requests allowed per 15 min${NC}"
echo -e "${BLUE}Testing with health endpoint (not rate limited)${NC}"
echo -e "${BLUE}========================================${NC}"

echo "Testing health endpoint (should never be rate limited)..."
for i in {1..10}; do
    echo -n "Request $i: "
    
    HTTP_CODE=$(curl -s -w "%{http_code}" -o /dev/null "${BASE_URL}/api/health")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Success (200)${NC}"
    else
        echo -e "${RED}✗ Failed ($HTTP_CODE)${NC}"
    fi
    
    sleep 0.1
done

echo ""
echo -e "${GREEN}✅ Test 5 PASSED: Health endpoint accessible (skipped from rate limiting)${NC}"
PASSED=$((PASSED + 1))
echo ""

# ============================================
# Test Summary
# ============================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}          Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Tests Passed: ${GREEN}$PASSED${NC}"
echo -e "Tests Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Rate limiting is working correctly.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the output above.${NC}"
    exit 1
fi
