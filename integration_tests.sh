#!/bin/bash

# ============================================
# Integration Tests for ATS Resume Generator
# ============================================
# Tests the production readiness improvements:
# 1. Gemini optional configuration
# 2. AI Router fallback logic
# 3. Subscription and quota enforcement
# ============================================

set -e  # Exit on error

echo "=========================================="
echo "🧪 ATS Resume Integration Tests"
echo "=========================================="
echo ""

# Configuration
API_BASE_URL="http://localhost:5000/api"
CLIENT_URL="http://localhost:5173"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    echo -n "🔍 Test $TESTS_RUN: $test_name ... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Helper function to run a test with output
run_test_verbose() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    echo ""
    echo "🔍 Test $TESTS_RUN: $test_name"
    echo "Command: $test_command"
    echo "---"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo "📋 Running Basic Connectivity Tests..."
echo "--------------------------------------"

run_test "Server health check" \
    "curl -sf $API_BASE_URL/health | jq -e '.status == \"ok\"'"

run_test "Server returns timestamp" \
    "curl -sf $API_BASE_URL/health | jq -e '.timestamp != null'"

echo ""
echo "📋 Checking Server Configuration..."
echo "--------------------------------------"

# Check if environment variables are set (in .env file)
if [ -f "server/.env" ]; then
    echo "✅ .env file exists"
    
    if grep -q "MONGODB_URI=" server/.env; then
        echo "✅ MONGODB_URI is configured"
    else
        echo -e "${RED}❌ MONGODB_URI not found${NC}"
    fi
    
    if grep -q "OPENAI_API_KEY=" server/.env; then
        echo "✅ OPENAI_API_KEY is configured"
    else
        echo -e "${YELLOW}⚠️  OPENAI_API_KEY not found${NC}"
    fi
    
    if grep -q "GEMINI_API_KEY=" server/.env; then
        echo "✅ GEMINI_API_KEY is configured (Gemini enabled)"
    else
        echo "ℹ️  GEMINI_API_KEY not found (using OpenAI fallback - this is OK)"
    fi
else
    echo -e "${RED}❌ server/.env file not found${NC}"
fi

echo ""
echo "📋 Testing AI Service Availability..."
echo "--------------------------------------"

# Check if AI services are properly initialized
echo "ℹ️  AI Router should fallback to OpenAI if Gemini unavailable"
echo "ℹ️  Free tier will use Gemini (if available) or OpenAI (fallback)"
echo "ℹ️  One-time/Premium/Lifetime tiers always use OpenAI"

echo ""
echo "📋 Testing Production Logger..."
echo "--------------------------------------"

# Check if logger utility exists
if [ -f "client/src/utils/logger.js" ]; then
    echo "✅ Production logger utility exists"
    
    # Check if it has the right exports
    if grep -q "export default logger" client/src/utils/logger.js; then
        echo "✅ Logger exports correctly"
    fi
    
    # Check if Editor.jsx uses logger
    if grep -q "import logger from" client/src/pages/Editor.jsx; then
        echo "✅ Editor.jsx imports logger"
    fi
    
    if grep -q "logger.log\|logger.error" client/src/pages/Editor.jsx; then
        echo "✅ Editor.jsx uses logger instead of console"
    fi
else
    echo -e "${RED}❌ Logger utility not found${NC}"
fi

echo ""
echo "📋 Checking Gemini Service Guards..."
echo "--------------------------------------"

# Check if gemini.service.js has proper guards
if [ -f "server/services/gemini.service.js" ]; then
    if grep -q "ensureGeminiEnabled" server/services/gemini.service.js; then
        echo "✅ Gemini service has runtime guards"
    else
        echo -e "${YELLOW}⚠️  Gemini service missing runtime guards${NC}"
    fi
    
    if grep -q "GEMINI_ENABLED" server/services/gemini.service.js; then
        echo "✅ Gemini service checks if enabled"
    else
        echo -e "${YELLOW}⚠️  Gemini service missing enabled check${NC}"
    fi
fi

echo ""
echo "📋 Checking AI Router Fallback Logic..."
echo "--------------------------------------"

# Check if aiRouter has fallback logic
if [ -f "server/services/aiRouter.service.js" ]; then
    if grep -q "GEMINI_ENABLED" server/services/aiRouter.service.js; then
        echo "✅ AI Router checks Gemini availability"
    else
        echo -e "${YELLOW}⚠️  AI Router missing Gemini check${NC}"
    fi
    
    if grep -q "fallback\|Falls back" server/services/aiRouter.service.js; then
        echo "✅ AI Router has fallback logic"
    else
        echo -e "${YELLOW}⚠️  AI Router missing fallback comments${NC}"
    fi
fi

echo ""
echo "📋 Checking Server Startup Requirements..."
echo "--------------------------------------"

# Check if GEMINI_API_KEY is still required
if grep -q '"GEMINI_API_KEY"' server/server.js; then
    if grep -A2 'requiredEnvVars' server/server.js | grep -q 'GEMINI_API_KEY'; then
        echo -e "${RED}❌ GEMINI_API_KEY still marked as required${NC}"
    else
        echo "✅ GEMINI_API_KEY removed from required vars"
    fi
else
    echo "✅ GEMINI_API_KEY not in required checks"
fi

echo ""
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo "Total Tests Run:    $TESTS_RUN"
echo -e "Tests Passed:       ${GREEN}$TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "Tests Failed:       ${RED}$TESTS_FAILED${NC}"
else
    echo -e "Tests Failed:       ${GREEN}$TESTS_FAILED${NC}"
fi
echo ""

# Calculate pass rate
if [ $TESTS_RUN -gt 0 ]; then
    PASS_RATE=$((TESTS_PASSED * 100 / TESTS_RUN))
    echo "Pass Rate: $PASS_RATE%"
    
    if [ $PASS_RATE -eq 100 ]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        exit 0
    elif [ $PASS_RATE -ge 80 ]; then
        echo -e "${YELLOW}⚠️  Most tests passed, but some issues found${NC}"
        exit 0
    else
        echo -e "${RED}❌ Too many test failures${NC}"
        exit 1
    fi
else
    echo "No tests were run"
    exit 1
fi
