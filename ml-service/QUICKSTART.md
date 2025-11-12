# Python ML Service - Setup & Run Guide

## 🚀 Quick Start (3 Steps)

**⚠️ Important:** Use the virtual environment Python!

### Step 1: Install Dependencies (Already Done! ✅)
Dependencies are already installed in the virtual environment.

### Step 2: Download Dataset & Train Model
```bash
cd /Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR/ml-service

# Download Kaggle dataset
/Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR/.venv/bin/python download_dataset.py

# Train ML model (takes 1-2 minutes)
/Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR/.venv/bin/python train_model.py
```

### Step 3: Start Flask API Server
```bash
cd /Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR/ml-service

/Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR/.venv/bin/python app.py
```

Server will run on: **http://localhost:5001** ✅

---

## 🎨 Test the UI

Open `test_ui.html` in your browser:
```bash
open test_ui.html
```

---

## ⚡ Or Use the Automated Script

```bash
cd /Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR/ml-service

# Run everything automatically
./start.sh
```

This will:
1. Download dataset
2. Train model
3. Start Flask server

---

## 🧪 Test the API

### Option 1: Run Test Script
```bash
# In a new terminal (keep Flask running)
python3 test_api.py
```

### Option 2: Manual cURL Tests
```bash
# Health check
curl http://localhost:5001/health

# Get all categories
curl http://localhost:5001/categories

# Predict resume category
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Software Engineer with 5 years experience in React, Node.js, Python. Built scalable web applications and RESTful APIs. Strong background in cloud architecture and database design."
  }'
```

---

## 📊 Expected Results

### After Training (`train_model.py`):
```
✅ Accuracy: 98.45%
💾 Model saved to: models/resume_classifier.joblib
```

### API Response Example:
```json
{
  "success": true,
  "data": {
    "predicted_category": "Software Engineer",
    "confidence": 87.5,
    "top_predictions": [
      {"category": "Software Engineer", "confidence": 87.5},
      {"category": "Data Scientist", "confidence": 8.2},
      {"category": "DevOps Engineer", "confidence": 4.3}
    ]
  }
}
```

---

## 🔧 Troubleshooting

**"No module named 'kagglehub'" error:**
```bash
pip3 install kagglehub
```

**"Model not loaded" error:**
```bash
# Train model first
python3 train_model.py
```

**Port 5001 already in use:**
```bash
# Change port in app.py (last line):
app.run(host='0.0.0.0', port=5002, debug=True)
```

---

## 📁 Files Created After Running

```
ml-service/
├── dataset_info.json        # Dataset metadata
├── models/                  # Trained ML models
│   ├── resume_classifier.joblib
│   ├── tfidf_vectorizer.joblib
│   └── categories.json
└── [Kaggle dataset cache]   # Downloaded dataset
```

---

## ✅ Checklist

- [ ] Installed Python dependencies
- [ ] Downloaded Kaggle dataset
- [ ] Trained ML model (98%+ accuracy)
- [ ] Started Flask server on port 5001
- [ ] Tested API endpoints
- [ ] Ready to integrate with Node.js backend!

---

**Next:** Integrate with your Node.js backend (see main README.md)
