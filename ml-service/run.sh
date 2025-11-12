#!/bin/bash

# Helper script to run Python commands with the correct virtual environment

VENV_PYTHON="/Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR/.venv/bin/python"
ML_SERVICE_DIR="/Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR/ml-service"

cd "$ML_SERVICE_DIR"

case "$1" in
    "download")
        echo "📥 Downloading dataset..."
        $VENV_PYTHON download_dataset.py
        ;;
    "train")
        echo "🎓 Training model..."
        $VENV_PYTHON train_model.py
        ;;
    "start"|"run")
        echo "🚀 Starting Flask server..."
        $VENV_PYTHON app.py
        ;;
    "test")
        echo "🧪 Testing API..."
        $VENV_PYTHON test_api.py
        ;;
    "ui")
        echo "🎨 Opening test UI..."
        open test_ui.html
        ;;
    "all")
        echo "🤖 Running full setup..."
        $VENV_PYTHON download_dataset.py && \
        $VENV_PYTHON train_model.py && \
        $VENV_PYTHON app.py
        ;;
    *)
        echo "ML Service Helper Script"
        echo ""
        echo "Usage: ./run.sh [command]"
        echo ""
        echo "Commands:"
        echo "  download  - Download Kaggle dataset"
        echo "  train     - Train ML model"
        echo "  start     - Start Flask API server"
        echo "  test      - Test API endpoints"
        echo "  ui        - Open test UI in browser"
        echo "  all       - Run download → train → start"
        echo ""
        echo "Examples:"
        echo "  ./run.sh download"
        echo "  ./run.sh train"
        echo "  ./run.sh start"
        echo "  ./run.sh all"
        ;;
esac
