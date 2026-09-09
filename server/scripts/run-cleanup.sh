#!/bin/bash

# Production Plan Cleanup Runner
# This script helps you run the cleanup with proper environment setup

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Production Plan Cleanup - Interactive Runner            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f "../.env" ] && [ ! -f ".env" ]; then
    echo "⚠️  No .env file found!"
    echo ""
    echo "Please choose an option:"
    echo "1. Enter MongoDB URI now (temporary for this run)"
    echo "2. Create .env file first"
    echo "3. Exit and create .env manually"
    echo ""
    read -p "Your choice (1-3): " choice
    
    case $choice in
        1)
            read -p "Enter your MONGODB_URI: " mongodb_uri
            export MONGODB_URI="$mongodb_uri"
            ;;
        2)
            read -p "Enter your MONGODB_URI: " mongodb_uri
            echo "MONGODB_URI=$mongodb_uri" > .env
            echo "✅ Created .env file"
            ;;
        3)
            echo "Please create a .env file with MONGODB_URI and run this script again"
            exit 0
            ;;
        *)
            echo "Invalid choice"
            exit 1
            ;;
    esac
fi

echo ""
echo "🔍 Running cleanup in DRY RUN mode first..."
echo ""

node scripts/cleanup-production-plans.js --dry-run

echo ""
read -p "Do you want to proceed with actual cleanup? (yes/no): " confirm

if [ "$confirm" = "yes" ] || [ "$confirm" = "y" ]; then
    echo ""
    read -p "Create backup before cleanup? (yes/no): " backup
    
    if [ "$backup" = "yes" ] || [ "$backup" = "y" ]; then
        echo "🚀 Running cleanup with backup..."
        node scripts/cleanup-production-plans.js --backup --force
    else
        echo "🚀 Running cleanup without backup..."
        node scripts/cleanup-production-plans.js --force
    fi
else
    echo "Cleanup cancelled."
fi
