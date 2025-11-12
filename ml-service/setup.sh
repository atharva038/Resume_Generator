#!/bin/bash

echo "🔧 Setting up ML Service Environment..."
echo "========================================"

# Check Python version
echo "Checking Python version..."
python3 --version

# Upgrade pip
echo ""
echo "📦 Upgrading pip..."
python3 -m pip install --upgrade pip

# Install packages one by one (more reliable)
echo ""
echo "📥 Installing dependencies..."

echo "  - Installing Flask..."
pip3 install Flask

echo "  - Installing Flask-CORS..."
pip3 install Flask-CORS

echo "  - Installing pandas..."
pip3 install pandas

echo "  - Installing numpy..."
pip3 install numpy

echo "  - Installing scikit-learn (this may take a while)..."
pip3 install scikit-learn

echo "  - Installing nltk..."
pip3 install nltk

echo "  - Installing kagglehub..."
pip3 install kagglehub

echo "  - Installing joblib..."
pip3 install joblib

echo "  - Installing python-dotenv..."
pip3 install python-dotenv

echo "  - Installing requests..."
pip3 install requests

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. python3 download_dataset.py"
echo "  2. python3 train_model.py"
echo "  3. python3 app.py"
