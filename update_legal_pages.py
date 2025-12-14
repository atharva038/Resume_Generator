#!/usr/bin/env python3
"""
Script to update legal pages styling to match purple/blue gradient theme
Run from project root: python3 update_legal_pages.py
"""

import re
import os
from pathlib import Path

def update_styling(content):
    """Apply all styling updates to content"""
    
    # Main background gradients
    content = content.replace(
        'from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
        'from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10'
    )
    content = content.replace(
        'from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900',
        'from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10'
    )
    
    # Hero gradients
    content = content.replace(
        'from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800',
        'from-purple-600 via-violet-600 to-blue-600 dark:from-purple-900 dark:via-violet-900 dark:to-blue-900'
    )
    
    # Hero text colors
    content = content.replace('text-gray-900 dark:text-white py-16', 'text-white py-16')
    content = content.replace('text-blue-100 dark:text-blue-200', 'text-purple-100 dark:text-purple-200')
    
    # Fix duplicate dark mode classes
    content = content.replace('dark:text-gray-700 dark:text-gray-300', 'dark:text-gray-300')
    content = content.replace('dark:text-gray-600 dark:text-gray-400', 'dark:text-gray-400')
    content = content.replace('dark:text-gray-900 dark:text-white', 'dark:text-white')
    content = content.replace('text-gray-700 dark:text-gray-700 dark:text-gray-300', 'text-gray-700 dark:text-gray-300')
    content = content.replace('text-gray-600 dark:text-gray-600 dark:text-gray-400', 'text-gray-600 dark:text-gray-400')
    content = content.replace('text-gray-900 dark:text-gray-900 dark:text-white', 'text-gray-900 dark:text-white')
    
    # Icon containers to gradients
    content = content.replace(
        'bg-blue-100 dark:bg-blue-900 rounded-lg',
        'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg'
    )
    content = content.replace(
        'bg-purple-100 dark:bg-purple-900 rounded-lg',
        'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg'
    )
    content = content.replace(
        'bg-green-100 dark:bg-green-900 rounded-lg',
        'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg'
    )
    content = content.replace(
        'bg-orange-100 dark:bg-orange-900 rounded-lg',
        'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg'
    )
    content = content.replace(
        'bg-pink-100 dark:bg-pink-900 rounded-lg',
        'bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-lg'
    )
    content = content.replace(
        'bg-indigo-100 dark:bg-indigo-900 rounded-lg',
        'bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg'
    )
    
    # Update link colors
    content = content.replace('text-blue-600 dark:text-blue-400', 'text-purple-600 dark:text-purple-400')
    
    # Info boxes - add borders
    content = content.replace(
        'bg-gray-50 dark:bg-gray-700 rounded-lg p-',
        'bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 p-'
    )
    content = content.replace(
        'bg-gray-50 dark:bg-gray-700 p-',
        'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-'
    )
    
    # Gradient boxes
    content = content.replace(
        'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20',
        'from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
    )
    
    # Add border to main content card if missing
    content = re.sub(
        r'rounded-2xl shadow-xl p-8 md:p-12 space-y-8">',
        'rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 space-y-8">',
        content
    )
    content = re.sub(
        r'rounded-2xl shadow-xl p-8 space-y-8">',
        'rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-8">',
        content
    )
    
    # Update button gradients
    content = re.sub(
        r'bg-gradient-to-r from-blue-600 to-purple-600(.*?)text-gray-900 dark:text-white',
        r'bg-gradient-to-r from-purple-600 to-blue-600\1text-white',
        content
    )
    content = content.replace(
        'hover:from-blue-700 hover:to-purple-700',
        'hover:from-purple-700 hover:to-blue-700'
    )
    
    # Add border to contact boxes
    content = re.sub(
        r'(from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg)',
        r'\1 border border-purple-200 dark:border-purple-700',
        content
    )
    
    return content

def update_file(filepath):
    """Update a single file"""
    print(f"📝 Updating {filepath.name}...")
    
    # Read file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Apply updates
    updated_content = update_styling(content)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"✅ {filepath.name} updated!")

def main():
    """Main function"""
    print("🎨 Updating Legal Pages Styling...")
    print()
    
    # Get paths
    base_path = Path(__file__).parent / 'client' / 'src' / 'pages'
    
    files_to_update = [
        'PrivacyPolicy.jsx',
        'TermsAndConditions.jsx',
        'RefundPolicy.jsx',
        'ShippingPolicy.jsx'
    ]
    
    for filename in files_to_update:
        filepath = base_path / filename
        if filepath.exists():
            update_file(filepath)
        else:
            print(f"⚠️  {filename} not found at {filepath}")
    
    print()
    print("🎉 All legal pages styling updated!")
    print("✨ Changes applied:")
    print("   • Purple/blue gradient theme")
    print("   • Proper dark mode colors")
    print("   • Glass effect hero icons")
    print("   • Gradient section headers")
    print("   • Updated link colors")
    print("   • Added borders to cards")

if __name__ == '__main__':
    main()
