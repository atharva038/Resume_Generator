#!/bin/bash

# Quick Start Script for ML Service
# This script will download dataset, train model, and start the API server

echo "🤖 Resume Category Classifier - Quick Start"
echo "==========================================="
echo ""

# Get the Python path from virtual environment
PYTHON_PATH="/Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR/.venv/bin/python"

# Check if Python exists
if [ ! -f "$PYTHON_PATH" ]; then
    echo "❌ Virtual environment not found!"
    echo "Please run: python3 -m venv .venv"
    exit 1
fi

echo "✅ Using virtual environment: $PYTHON_PATH"
echo ""

# Step 1: Download dataset
echo "📥 Step 1/3: Downloading Kaggle dataset..."
echo "----------------------------------------"
$PYTHON_PATH download_dataset.py
if [ $? -ne 0 ]; then
    echo "❌ Dataset download failed!"
    exit 1
fi

echo ""
echo "✅ Dataset downloaded successfully!"
echo ""

# Step 2: Train model
echo "🎓 Step 2/3: Training ML model..."
echo "----------------------------------------"
$PYTHON_PATH train_model.py
if [ $? -ne 0 ]; then
    echo "❌ Model training failed!"
    exit 1
fi

echo ""
echo "✅ Model trained successfully!"
echo ""

# Step 3: Start Flask server
echo "🚀 Step 3/3: Starting Flask API server..."
echo "----------------------------------------"
echo ""
echo "Server will start on: http://localhost:5001"
echo "Test UI: Open test_ui.html in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

$PYTHON_PATH app.py
