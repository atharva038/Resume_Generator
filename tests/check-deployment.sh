#!/bin/bash

# ==============================================
# Pre-Deployment Validation Script
# ==============================================
# This script checks if your application is ready for deployment
# Run this before deploying to Vercel and Render

echo "🔍 Checking deployment readiness..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this from project root${NC}"
    exit 1
fi

echo "📦 Checking Dependencies..."

# Check if node_modules exist
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Warning: server/node_modules not found${NC}"
    echo "   Run: cd server && npm install"
    warnings=$((warnings + 1))
fi

if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Warning: client/node_modules not found${NC}"
    echo "   Run: cd client && npm install"
    warnings=$((warnings + 1))
fi

# Check for .env files
echo ""
echo "🔐 Checking Environment Files..."

if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚠️  Warning: server/.env not found (needed for local testing)${NC}"
    warnings=$((warnings + 1))
fi

if [ ! -f "client/.env" ]; then
    echo -e "${YELLOW}⚠️  Warning: client/.env not found (needed for local testing)${NC}"
    warnings=$((warnings + 1))
fi

# Check .gitignore
echo ""
echo "📝 Checking .gitignore..."

if grep -q "^.env$" .gitignore; then
    echo -e "${GREEN}✅ .env files are ignored by git${NC}"
else
    echo -e "${RED}❌ Error: .env not in .gitignore! This is a security risk!${NC}"
    errors=$((errors + 1))
fi

if grep -q "^node_modules" .gitignore; then
    echo -e "${GREEN}✅ node_modules are ignored by git${NC}"
else
    echo -e "${RED}❌ Error: node_modules not in .gitignore!${NC}"
    errors=$((errors + 1))
fi

# Check deployment config files
echo ""
echo "⚙️  Checking Deployment Config Files..."

if [ -f "client/vercel.json" ]; then
    echo -e "${GREEN}✅ client/vercel.json exists${NC}"
else
    echo -e "${RED}❌ Error: client/vercel.json not found${NC}"
    errors=$((errors + 1))
fi

if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✅ render.yaml exists${NC}"
else
    echo -e "${RED}❌ Error: render.yaml not found${NC}"
    errors=$((errors + 1))
fi

# Check server files
echo ""
echo "🔧 Checking Server Configuration..."

if [ -f "server/server.js" ]; then
    echo -e "${GREEN}✅ server/server.js exists${NC}"
    
    # Check if health endpoint exists
    if grep -q "/api/health" server/server.js; then
        echo -e "${GREEN}✅ Health check endpoint found${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: Health check endpoint not found${NC}"
        warnings=$((warnings + 1))
    fi
    
    # Check if CORS is configured
    if grep -q "cors" server/server.js; then
        echo -e "${GREEN}✅ CORS middleware configured${NC}"
    else
        echo -e "${RED}❌ Error: CORS not configured${NC}"
        errors=$((errors + 1))
    fi
else
    echo -e "${RED}❌ Error: server/server.js not found${NC}"
    errors=$((errors + 1))
fi

# Check client build
echo ""
echo "🏗️  Testing Client Build..."

cd client
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Client builds successfully${NC}"
    rm -rf dist
else
    echo -e "${RED}❌ Error: Client build failed${NC}"
    echo "   Run: cd client && npm run build"
    errors=$((errors + 1))
fi
cd ..

# Check package.json scripts
echo ""
echo "📜 Checking Package Scripts..."

if grep -q '"build"' client/package.json; then
    echo -e "${GREEN}✅ Client has build script${NC}"
else
    echo -e "${RED}❌ Error: Client missing build script${NC}"
    errors=$((errors + 1))
fi

if grep -q '"start"' server/package.json; then
    echo -e "${GREEN}✅ Server has start script${NC}"
else
    echo -e "${RED}❌ Error: Server missing start script${NC}"
    errors=$((errors + 1))
fi

# Check for sensitive data in code
echo ""
echo "🔒 Checking for Sensitive Data..."

if git ls-files | xargs grep -l "mongodb+srv://" > /dev/null 2>&1; then
    echo -e "${RED}❌ CRITICAL: MongoDB connection string found in code!${NC}"
    echo "   Remove hardcoded credentials immediately!"
    errors=$((errors + 1))
else
    echo -e "${GREEN}✅ No MongoDB credentials in code${NC}"
fi

if git ls-files | xargs grep -l "GEMINI_API_KEY.*=" | grep -v ".env.example" > /dev/null 2>&1; then
    echo -e "${RED}❌ CRITICAL: API keys found in code!${NC}"
    errors=$((errors + 1))
else
    echo -e "${GREEN}✅ No API keys hardcoded${NC}"
fi

# Summary
echo ""
echo "════════════════════════════════════════"
echo "📊 Deployment Readiness Summary"
echo "════════════════════════════════════════"

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Your app is ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Follow DEPLOYMENT_CHECKLIST.md"
    echo "2. Deploy backend to Render"
    echo "3. Deploy frontend to Vercel"
    echo "4. Update CORS settings"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  ${warnings} warning(s) found${NC}"
    echo -e "${GREEN}✅ No critical errors - deployment possible${NC}"
    echo ""
    echo "Consider fixing warnings before deployment"
    exit 0
else
    echo -e "${RED}❌ ${errors} error(s) found${NC}"
    if [ $warnings -gt 0 ]; then
        echo -e "${YELLOW}⚠️  ${warnings} warning(s) found${NC}"
    fi
    echo ""
    echo "❌ NOT READY FOR DEPLOYMENT"
    echo "Please fix the errors above before deploying"
    exit 1
fi
