#!/bin/bash

# Script to reorganize client component structure
# Run from: client/src/components directory

echo "🚀 Starting component restructuring..."

# Move to components directory
cd "$(dirname "$0")" || exit

# Common Components
echo "📦 Moving common components..."
git mv DarkModeToggle.jsx common/
git mv ErrorBoundary.jsx common/
git mv PageTransition.jsx common/
git mv ScrollToTop.jsx common/

# Common/Modals
echo "📦 Moving modal components..."
git mv ConfirmationModal.jsx common/modals/
git mv GitHubImportModal.jsx common/modals/

# Common/Cards
echo "📦 Moving card components..."
git mv ScoreCard.jsx common/cards/
git mv JobSpecificScoreCard.jsx common/cards/

# Layout Components
echo "🏗️  Moving layout components..."
git mv AdminLayout.jsx layout/
git mv MainLayout.jsx layout/
git mv Layout.jsx layout/
git mv Navbar.jsx layout/
git mv Sidebar.jsx layout/
git mv Footer.jsx layout/
git mv HeroSection.jsx layout/

# Editor Components
echo "✏️  Moving editor components..."
git mv EditorSections.jsx editor/sections/
git mv EditableSection.jsx editor/sections/
git mv CollapsibleSection.jsx editor/sections/
git mv ResumePreview.jsx editor/preview/
git mv RecommendationsPanel.jsx editor/panels/

# Feature Components - GitHub
echo "🔧 Moving feature components (GitHub)..."
git mv GitHubExtractor.jsx features/github/

# Feature Components - Job Match
echo "🔧 Moving feature components (Job Match)..."
git mv SmartJobMatch.jsx features/job-match/

# Auth Components
echo "🔐 Moving auth components..."
git mv ProtectedRoute.jsx auth/
git mv AdminProtectedRoute.jsx auth/
git mv BlockableLink.jsx auth/

# Remove backup files
echo "🗑️  Removing backup files..."
rm -f JobSpecificScoreCard.jsx.backup
cd templates
rm -f MinimalTemplate_OLD.jsx ModernTemplate_OLD.jsx ProfessionalTemplate_OLD.jsx add-color-themes.sh
cd ..

echo "✅ File restructuring complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create index.js barrel exports"
echo "2. Update all import statements"
echo "3. Test the application"
