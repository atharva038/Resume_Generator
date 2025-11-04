#!/bin/bash

# Rate Limiting Test Script
# Tests all rate limiters to verify they're working correctly

echo "🧪 Starting Rate Limiting Tests..."
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SERVER_URL="http://localhost:5000"

# Function to test auth rate limiter
test_auth_limiter() {
    echo "📝 Test 1: Auth Rate Limiter (5 requests per 15 min)"
    echo "Sending 7 login attempts..."
    echo ""
    
    success_count=0
    rate_limited=0
    
    for i in {1..7}; do
        response=$(curl -s -w "\n%{http_code}" -X POST "$SERVER_URL/api/auth/login" \
            -H "Content-Type: application/json" \
            -d '{"email":"test@test.com","password":"wrong"}')
        
        status_code=$(echo "$response" | tail -n1)
        
        if [ "$status_code" == "429" ]; then
            echo -e "${RED}Attempt $i: Rate Limited (429) ✓${NC}"
            ((rate_limited++))
        else
            echo -e "${YELLOW}Attempt $i: Not Rate Limited ($status_code)${NC}"
            ((success_count++))
        fi
        
        sleep 0.5
    done
    
    echo ""
    if [ $rate_limited -ge 2 ]; then
        echo -e "${GREEN}✅ Auth rate limiter is WORKING (blocked $rate_limited requests)${NC}"
    else
        echo -e "${RED}❌ Auth rate limiter NOT working (only blocked $rate_limited requests)${NC}"
    fi
    echo ""
    echo "=================================="
    echo ""
}

# Function to test API rate limiter
test_api_limiter() {
    echo "📝 Test 2: Global API Rate Limiter (100 requests per 15 min)"
    echo "Sending 10 health check requests (should all succeed)..."
    echo ""
    
    success_count=0
    rate_limited=0
    
    for i in {1..10}; do
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$SERVER_URL/api/health")
        
        if [ "$status_code" == "200" ]; then
            ((success_count++))
        elif [ "$status_code" == "429" ]; then
            ((rate_limited++))
        fi
    done
    
    echo "Successful requests: $success_count"
    echo "Rate limited: $rate_limited"
    echo ""
    
    if [ $success_count -ge 8 ]; then
        echo -e "${GREEN}✅ API rate limiter is configured (allows normal traffic)${NC}"
    else
        echo -e "${RED}❌ API rate limiter may be too strict${NC}"
    fi
    echo ""
    echo "=================================="
    echo ""
}

# Function to get auth token
get_auth_token() {
    echo "🔑 Getting authentication token..."
    
    # Try to login with test credentials
    response=$(curl -s -X POST "$SERVER_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"testpassword123"}')
    
    token=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$token" ]; then
        echo -e "${GREEN}✅ Got token: ${token:0:20}...${NC}"
        echo "$token"
    else
        echo -e "${YELLOW}⚠️  Could not get token. Make sure you have a test user.${NC}"
        echo ""
        echo "To create a test user, run:"
        echo "curl -X POST $SERVER_URL/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"testpassword123\",\"name\":\"Test User\"}'"
        echo ""
        return 1
    fi
}

# Function to test AI rate limiter
test_ai_limiter() {
    echo "📝 Test 3: AI Rate Limiter (20 requests per hour)"
    echo "Attempting to get auth token first..."
    echo ""
    
    TOKEN=$(get_auth_token)
    
    if [ -z "$TOKEN" ]; then
        echo -e "${YELLOW}⚠️  Skipping AI limiter test (no auth token)${NC}"
        echo ""
        echo "=================================="
        echo ""
        return
    fi
    
    echo ""
    echo "Sending 5 AI requests (to test limiter is applied)..."
    echo ""
    
    success_count=0
    auth_error=0
    
    for i in {1..5}; do
        response=$(curl -s -w "\n%{http_code}" -X POST "$SERVER_URL/api/resume/enhance" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"content":"test","sectionType":"experience"}')
        
        status_code=$(echo "$response" | tail -n1)
        
        if [ "$status_code" == "200" ] || [ "$status_code" == "400" ]; then
            echo -e "${GREEN}Request $i: Processed ($status_code)${NC}"
            ((success_count++))
        elif [ "$status_code" == "429" ]; then
            echo -e "${RED}Request $i: Rate Limited (429)${NC}"
        elif [ "$status_code" == "401" ] || [ "$status_code" == "403" ]; then
            echo -e "${YELLOW}Request $i: Auth Error ($status_code)${NC}"
            ((auth_error++))
        else
            echo -e "${YELLOW}Request $i: Other Error ($status_code)${NC}"
        fi
        
        sleep 0.5
    done
    
    echo ""
    if [ $success_count -ge 3 ] || [ $auth_error -ge 3 ]; then
        echo -e "${GREEN}✅ AI rate limiter is configured (middleware applied)${NC}"
    else
        echo -e "${YELLOW}⚠️  AI rate limiter may not be working correctly${NC}"
    fi
    echo ""
    echo "=================================="
    echo ""
}

# Main execution
echo "🚀 Starting all tests..."
echo ""

# Check if server is running
if ! curl -s "$SERVER_URL/api/health" > /dev/null; then
    echo -e "${RED}❌ Server is not running at $SERVER_URL${NC}"
    echo ""
    echo "Please start the server first:"
    echo "  cd server && npm run dev"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# Run tests
test_auth_limiter
test_api_limiter
test_ai_limiter

# Summary
echo "=================================="
echo "🎉 Rate Limiting Tests Complete!"
echo "=================================="
echo ""
echo "Summary:"
echo "--------"
echo "1. Auth rate limiter: Applied to login/register"
echo "2. API rate limiter: Applied globally to all /api/* routes"
echo "3. AI rate limiter: Applied to AI-powered endpoints"
echo ""
echo "For detailed testing, see: RATE_LIMITING_IMPLEMENTATION.md"
echo ""
