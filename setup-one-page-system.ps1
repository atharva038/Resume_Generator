# One-Page Resume System - Setup Script
# PowerShell script for Windows

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "One-Page Resume System - Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$SuccessCount = 0

Write-Host "Checking required files..." -ForegroundColor Yellow
Write-Host ""

$RequiredFiles = @(
    "client\src\utils\resumePageValidator.js",
    "client\src\components\PageLimitWarning.jsx",
    "client\src\components\CharacterCounter.jsx",
    "client\src\components\templates\ClassicTemplate.jsx",
    "client\src\components\ResumePreview.jsx",
    "client\src\components\EditableSection.jsx",
    "client\src\pages\Editor.jsx"
)

foreach ($file in $RequiredFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
        $SuccessCount++
    } else {
        Write-Host "[MISSING] $file" -ForegroundColor Red
        $ErrorCount++
    }
}

Write-Host ""
Write-Host "Checking documentation..." -ForegroundColor Yellow
Write-Host ""

$DocFiles = @(
    "docs\ONE_PAGE_RESUME_SYSTEM.md",
    "README_ONE_PAGE_SYSTEM.md",
    "tests\test-one-page-resume.sh"
)

foreach ($doc in $DocFiles) {
    if (Test-Path $doc) {
        Write-Host "[OK] $doc" -ForegroundColor Green
        $SuccessCount++
    } else {
        Write-Host "[MISSING] $doc" -ForegroundColor Red
        $ErrorCount++
    }
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Setup Summary" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Files checked: $SuccessCount" -ForegroundColor Green
Write-Host "Files missing: $ErrorCount" -ForegroundColor Red
Write-Host ""

if ($ErrorCount -eq 0) {
    Write-Host "[SUCCESS] All files are in place!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. cd client" -ForegroundColor White
    Write-Host "2. npm install (if not done)" -ForegroundColor White
    Write-Host "3. npm run dev" -ForegroundColor White
    Write-Host "4. Navigate to Editor page" -ForegroundColor White
    Write-Host "5. Test the one-page resume features" -ForegroundColor White
    Write-Host ""
    Write-Host "Read README_ONE_PAGE_SYSTEM.md for full guide" -ForegroundColor Yellow
} else {
    Write-Host "[ERROR] Some files are missing" -ForegroundColor Red
    Write-Host "Please ensure all files are created properly" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Feature Highlights:" -ForegroundColor Cyan
Write-Host "- Real-time character counters" -ForegroundColor White
Write-Host "- Page overflow warnings" -ForegroundColor White
Write-Host "- Optimized template spacing" -ForegroundColor White
Write-Host "- ATS-friendly one-page format" -ForegroundColor White
Write-Host ""
