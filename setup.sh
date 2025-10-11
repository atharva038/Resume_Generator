#!/bin/bash

# AI Resume Rebuilder - Setup Script
# This script automates the initial setup process

echo "🚀 AI Resume Rebuilder - Setup Script"
echo "======================================"
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Setup server
echo "📦 Setting up server..."
cd server || exit

if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit server/.env with your MongoDB URI and Gemini API key"
fi

echo "📥 Installing server dependencies..."
npm install --silent

if [ $? -eq 0 ]; then
    echo "✅ Server dependencies installed"
else
    echo "❌ Server installation failed"
    exit 1
fi

cd ..

# Setup client
echo ""
echo "📦 Setting up client..."
cd client || exit

if [ ! -f .env ]; then
    echo "📝 Creating client .env file..."
    cp .env.example .env
fi

echo "📥 Installing client dependencies..."
npm install --silent

if [ $? -eq 0 ]; then
    echo "✅ Client dependencies installed"
else
    echo "❌ Client installation failed"
    exit 1
fi

cd ..

# Summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo ""
echo "1. Edit server/.env file:"
echo "   - Add your MongoDB connection string (MONGODB_URI)"
echo "   - Add your Gemini API key (GEMINI_API_KEY)"
echo "   - Optionally change JWT_SECRET"
echo ""
echo "2. Start the server:"
echo "   cd server && npm run dev"
echo ""
echo "3. In a new terminal, start the client:"
echo "   cd client && npm run dev"
echo ""
echo "4. Open your browser to:"
echo "   http://localhost:5173"
echo ""
echo "📚 For more details, see:"
echo "   - README.md (complete documentation)"
echo "   - QUICK_START.md (fast setup guide)"
echo "   - API_TESTING.md (API testing guide)"
echo ""
echo "Need help? Check the troubleshooting section in README.md"
echo ""
