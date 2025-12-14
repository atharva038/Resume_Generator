#!/bin/bash

# Script to update legal pages styling to match purple/blue gradient theme
# Run from project root: bash update-legal-pages.sh

echo "🎨 Updating Legal Pages Styling..."

cd client/src/pages

# Function to update a file
update_file() {
    local file=$1
    echo "📝 Updating $file..."
    
    # Backup
    cp "$file" "${file}.backup"
    
    # Update main background
    sed -i '' 's/from-gray-50 via-white to-blue-50/from-gray-50 via-purple-50\/30 to-blue-50\/30/g' "$file"
    sed -i '' 's/from-blue-50 via-white to-purple-50/from-gray-50 via-purple-50\/30 to-blue-50\/30/g' "$file"
    sed -i '' 's/dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/dark:from-gray-900 dark:via-purple-900\/10 dark:to-blue-900\/10/g' "$file"
    sed -i '' 's/dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/dark:from-gray-900 dark:via-purple-900\/10 dark:to-blue-900\/10/g' "$file"
    
    # Update hero gradients
    sed -i '' 's/from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800/from-purple-600 via-violet-600 to-blue-600 dark:from-purple-900 dark:via-violet-900 dark:to-blue-900/g' "$file"
    
    # Update hero text color
    sed -i '' 's/text-gray-900 dark:text-white py-16/text-white py-16/g' "$file"
    sed-i '' 's/text-blue-100 dark:text-blue-200/text-purple-100 dark:text-purple-200/g' "$file"
    
    # Fix duplicate dark mode classes
    sed -i '' 's/dark:text-gray-700 dark:text-gray-300/dark:text-gray-300/g' "$file"
    sed -i '' 's/dark:text-gray-600 dark:text-gray-400/dark:text-gray-400/g' "$file"
    sed -i '' 's/dark:text-gray-900 dark:text-white/dark:text-white/g' "$file"
    
    # Update icon containers to gradients
    sed -i '' 's/bg-blue-100 dark:bg-blue-900/bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900\/30 dark:to-blue-900\/30/g' "$file"
    sed -i '' 's/bg-purple-100 dark:bg-purple-900/bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900\/30 dark:to-blue-900\/30/g' "$file"
    sed -i '' 's/bg-orange-100 dark:bg-orange-900/bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900\/30 dark:to-amber-900\/30/g' "$file"
    sed -i '' 's/bg-green-100 dark:bg-green-900/bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900\/30 dark:to-emerald-900\/30/g' "$file"
    sed -i '' 's/bg-pink-100 dark:bg-pink-900/bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900\/30 dark:to-rose-900\/30/g' "$file"
    sed -i '' 's/bg-indigo-100 dark:bg-indigo-900/bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900\/30 dark:to-blue-900\/30/g' "$file"
    
    # Update link colors
    sed -i '' 's/text-blue-600 dark:text-blue-400/text-purple-600 dark:text-purple-400/g' "$file"
    
    # Update info boxes
    sed -i '' 's/bg-gray-50 dark:bg-gray-700 rounded-lg/bg-gray-50 dark:bg-gray-700\/50 rounded-lg border border-gray-200 dark:border-gray-600/g' "$file"
    
    # Update gradient boxes
    sed -i '' 's/from-blue-50 to-purple-50 dark:from-blue-900\/20 dark:to-purple-900\/20/from-purple-50 to-blue-50 dark:from-purple-900\/20 dark:to-blue-900\/20/g' "$file"
    
    # Add border to main content card
    sed -i '' 's/rounded-2xl shadow-xl p-8/rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8/g' "$file"
    
    echo "✅ $file updated!"
}

# Update each file
update_file "PrivacyPolicy.jsx"
update_file "TermsAndConditions.jsx"
update_file "RefundPolicy.jsx"
update_file "ShippingPolicy.jsx"

echo ""
echo "🎉 All legal pages updated!"
echo "💾 Backups created with .backup extension"
echo ""
echo "To restore backups if needed:"
echo "  mv PrivacyPolicy.jsx.backup PrivacyPolicy.jsx"
echo "  mv TermsAndConditions.jsx.backup TermsAndConditions.jsx"
echo "  mv RefundPolicy.jsx.backup RefundPolicy.jsx"
echo "  mv ShippingPolicy.jsx.backup ShippingPolicy.jsx"
