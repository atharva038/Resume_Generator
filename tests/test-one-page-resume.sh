#!/bin/bash

# One-Page Resume Validation Test Script
# Tests the resume page limit and character count features

echo "==================================="
echo "One-Page Resume System - Test Suite"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to check if server is running
check_server() {
    echo "Checking if development server is running..."
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Server is running${NC}"
        return 0
    else
        echo -e "${RED}✗ Server is not running${NC}"
        echo "Please start the development server with: npm run dev"
        return 1
    fi
}

# Function to check if required files exist
check_files() {
    echo ""
    echo "Checking required files..."
    
    FILES=(
        "client/src/utils/resumePageValidator.js"
        "client/src/components/PageLimitWarning.jsx"
        "client/src/components/CharacterCounter.jsx"
        "client/src/components/templates/ClassicTemplate.jsx"
    )
    
    for file in "${FILES[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✓ $file exists${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}✗ $file missing${NC}"
            ((TESTS_FAILED++))
        fi
    done
}

# Function to check character limits are defined
check_character_limits() {
    echo ""
    echo "Checking character limit configuration..."
    
    FILE="client/src/utils/resumePageValidator.js"
    
    REQUIRED_LIMITS=(
        "summary"
        "experience"
        "education"
        "projects"
        "skills"
        "certifications"
        "achievements"
    )
    
    for limit in "${REQUIRED_LIMITS[@]}"; do
        if grep -q "$limit" "$FILE"; then
            echo -e "${GREEN}✓ $limit limit defined${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}✗ $limit limit missing${NC}"
            ((TESTS_FAILED++))
        fi
    done
}

# Function to check template styling
check_template_styling() {
    echo ""
    echo "Checking template optimization..."
    
    FILE="client/src/components/templates/ClassicTemplate.jsx"
    
    # Check for optimized font size
    if grep -q "fontSize.*9" "$FILE"; then
        echo -e "${GREEN}✓ Optimized font size (9-10pt)${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠ Font size might not be optimized${NC}"
    fi
    
    # Check for max height constraint
    if grep -q "maxHeight.*11in" "$FILE"; then
        echo -e "${GREEN}✓ Max height constraint set${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ Max height constraint missing${NC}"
        ((TESTS_FAILED++))
    fi
    
    # Check for overflow hidden
    if grep -q "overflow.*hidden" "$FILE"; then
        echo -e "${GREEN}✓ Overflow control implemented${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ Overflow control missing${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to check component integration
check_integration() {
    echo ""
    echo "Checking component integration in Editor..."
    
    FILE="client/src/pages/Editor.jsx"
    
    # Check for PageLimitWarning import
    if grep -q "PageLimitWarning" "$FILE"; then
        echo -e "${GREEN}✓ PageLimitWarning imported${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ PageLimitWarning not imported${NC}"
        ((TESTS_FAILED++))
    fi
    
    # Check for CharacterCounter import
    if grep -q "CharacterCounter" "$FILE"; then
        echo -e "${GREEN}✓ CharacterCounter imported${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠ CharacterCounter not imported (optional)${NC}"
    fi
    
    # Check for validator import
    if grep -q "resumePageValidator" "$FILE"; then
        echo -e "${GREEN}✓ Validator utility imported${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ Validator utility not imported${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to verify ResumePreview changes
check_resume_preview() {
    echo ""
    echo "Checking ResumePreview component..."
    
    FILE="client/src/components/ResumePreview.jsx"
    
    # Check for data-resume-template attribute
    if grep -q "data-resume-template" "$FILE"; then
        echo -e "${GREEN}✓ Resume template data attribute set${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ Resume template data attribute missing${NC}"
        ((TESTS_FAILED++))
    fi
    
    # Check for A4 dimensions
    if grep -q "297mm" "$FILE"; then
        echo -e "${GREEN}✓ A4 page dimensions configured${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠ A4 dimensions might not be set${NC}"
    fi
}

# Function to display test summary
display_summary() {
    echo ""
    echo "==================================="
    echo "Test Summary"
    echo "==================================="
    echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
    echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed!${NC}"
        echo "One-page resume system is properly configured."
        return 0
    else
        echo -e "${RED}✗ Some tests failed${NC}"
        echo "Please review the errors above and fix the issues."
        return 1
    fi
}

# Main execution
main() {
    check_files
    check_character_limits
    check_template_styling
    check_integration
    check_resume_preview
    display_summary
    
    echo ""
    echo "==================================="
    echo "Manual Testing Steps"
    echo "==================================="
    echo "1. Start the dev server: cd client && npm run dev"
    echo "2. Navigate to the Editor page"
    echo "3. Enter a long summary (>600 characters)"
    echo "4. Verify character counter appears and turns red"
    echo "5. Add multiple experience entries with long descriptions"
    echo "6. Check if page overflow warning appears at bottom-right"
    echo "7. Reduce content until warning disappears"
    echo "8. Download PDF and verify it's exactly 1 page"
    echo ""
}

# Run main function
main
exit $?
