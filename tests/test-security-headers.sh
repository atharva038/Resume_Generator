#!/bin/bash

# Security Headers Test Script
# Tests the implementation of security headers and CORS

echo "🔒 SECURITY HEADERS & CORS TEST SUITE"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SERVER_URL="http://localhost:5000"
ALLOWED_ORIGIN="http://localhost:5173"
BLOCKED_ORIGIN="http://evil-site.com"

# Test counter
PASSED=0
FAILED=0

# Function to test if a header exists
test_header() {
    local header_name=$1
    local expected_pattern=$2
    local test_name=$3
    
    echo -n "Testing: $test_name... "
    
    result=$(curl -s -I "$SERVER_URL/api/resumes" 2>&1 | grep -i "^$header_name:" | head -1)
    
    if [ -n "$result" ]; then
        if [ -n "$expected_pattern" ]; then
            if echo "$result" | grep -q "$expected_pattern"; then
                echo -e "${GREEN}✅ PASS${NC}"
                echo "   Found: $result"
                ((PASSED++))
            else
                echo -e "${RED}❌ FAIL${NC}"
                echo "   Found: $result"
                echo "   Expected pattern: $expected_pattern"
                ((FAILED++))
            fi
        else
            echo -e "${GREEN}✅ PASS${NC}"
            echo "   Found: $result"
            ((PASSED++))
        fi
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "   Header '$header_name' not found"
        ((FAILED++))
    fi
    echo ""
}

# Test CORS
test_cors() {
    local origin=$1
    local should_allow=$2
    local test_name=$3
    
    echo -n "Testing: $test_name... "
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Origin: $origin" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS "$SERVER_URL/api/resumes" 2>&1)
    
    if [ "$should_allow" = "true" ]; then
        if [ "$http_code" = "204" ] || [ "$http_code" = "200" ]; then
            echo -e "${GREEN}✅ PASS${NC}"
            echo "   HTTP Status: $http_code (Allowed)"
            ((PASSED++))
        else
            echo -e "${RED}❌ FAIL${NC}"
            echo "   HTTP Status: $http_code (Should be allowed)"
            ((FAILED++))
        fi
    else
        if [ "$http_code" = "500" ] || [ "$http_code" = "403" ]; then
            echo -e "${GREEN}✅ PASS${NC}"
            echo "   HTTP Status: $http_code (Blocked as expected)"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠️  WARNING${NC}"
            echo "   HTTP Status: $http_code (Should be blocked)"
            ((FAILED++))
        fi
    fi
    echo ""
}

echo "📋 PART 1: SECURITY HEADERS TEST"
echo "================================"
echo ""

# Test Security Headers
test_header "Strict-Transport-Security" "max-age=31536000" "HSTS Header"
test_header "X-Frame-Options" "DENY" "X-Frame-Options Header"
test_header "X-Content-Type-Options" "nosniff" "X-Content-Type-Options Header"
test_header "X-XSS-Protection" "" "X-XSS-Protection Header"
test_header "Referrer-Policy" "strict-origin" "Referrer-Policy Header"
test_header "Content-Security-Policy" "" "Content-Security-Policy Header"
test_header "Permissions-Policy" "" "Permissions-Policy Header"

echo ""
echo "📋 PART 2: CORS TEST"
echo "===================="
echo ""

# Test CORS with allowed origin
test_cors "$ALLOWED_ORIGIN" "true" "CORS - Allowed Origin (localhost:5173)"

# Test CORS with blocked origin
test_cors "$BLOCKED_ORIGIN" "false" "CORS - Blocked Origin (evil-site.com)"

echo ""
echo "📋 PART 3: CORS HEADERS TEST (Allowed Origin)"
echo "============================================="
echo ""

echo "Testing CORS headers with allowed origin..."
cors_response=$(curl -s -I \
    -H "Origin: $ALLOWED_ORIGIN" \
    "$SERVER_URL/api/resumes" 2>&1)

echo "Response headers:"
echo "$cors_response" | grep -i "access-control" | while read line; do
    echo "   $line"
done
echo ""

# Check Access-Control-Allow-Origin
if echo "$cors_response" | grep -q "Access-Control-Allow-Origin: $ALLOWED_ORIGIN"; then
    echo -e "${GREEN}✅ PASS${NC} - Access-Control-Allow-Origin header present"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Access-Control-Allow-Origin header missing"
    ((FAILED++))
fi

# Check Access-Control-Allow-Credentials
if echo "$cors_response" | grep -q "Access-Control-Allow-Credentials: true"; then
    echo -e "${GREEN}✅ PASS${NC} - Access-Control-Allow-Credentials header present"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Access-Control-Allow-Credentials header missing"
    ((FAILED++))
fi

echo ""
echo "======================================"
echo "📊 TEST RESULTS SUMMARY"
echo "======================================"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Security implementation is working correctly!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please review the implementation.${NC}"
    exit 1
fi
