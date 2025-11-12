# Resume Category Classifier - ML Service 🤖

Real machine learning service for classifying resumes into job categories using **scikit-learn**.

---

## 🎯 What This Does

Trains a **Random Forest classifier** on real resume data to predict job categories:
- Software Engineer
- Data Scientist
- HR Professional
- Designer
- Marketing
- ...and more (depends on dataset)

Uses:
- ✅ **TF-IDF vectorization** for text features
- ✅ **Random Forest** classifier (real ML, not API)
- ✅ **scikit-learn** (industry-standard ML library)
- ✅ **Real dataset** from Kaggle

---

## 📦 Setup

### 1. Install Python Dependencies

```bash
cd ml-service
pip3 install -r requirements.txt
```

### 2. Download Dataset

```bash
python3 download_dataset.py
```

This will:
- Download resume dataset from Kaggle
- Explore data structure
- Save dataset info to `dataset_info.json`

### 3. Train ML Model

```bash
python3 train_model.py
```

This will:
- Load and preprocess resume data
- Train Random Forest classifier
- Evaluate model accuracy
- Save trained model to `models/` directory

**Expected output:**
```
📊 Dataset info:
   Total samples: 962
   Number of categories: 25

✅ Accuracy: 98.45%

💾 Model saved to: models/resume_classifier.joblib
```

### 4. Start Flask API

```bash
python3 app.py
```

Server runs on: **http://localhost:5001**

---

## 🔌 API Endpoints

### 1. Health Check
```bash
GET http://localhost:5001/health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "service": "Resume Category Classifier"
}
```

### 2. Get Categories
```bash
GET http://localhost:5001/categories
```

Response:
```json
{
  "categories": ["Software Engineer", "Data Scientist", "HR", ...],
  "count": 25
}
```

### 3. Predict Category (Single Resume)
```bash
POST http://localhost:5001/predict
Content-Type: application/json

{
  "resume_text": "Software Engineer with 5 years experience in React, Node.js..."
}
```

Response:
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

### 4. Batch Prediction
```bash
POST http://localhost:5001/predict/batch
Content-Type: application/json

{
  "resumes": [
    "Resume 1 text...",
    "Resume 2 text..."
  ]
}
```

---

## 🧪 Test the API

### Using cURL

```bash
# Health check
curl http://localhost:5001/health

# Get categories
curl http://localhost:5001/categories

# Predict category
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Software Engineer with 5 years of experience in full-stack development. Proficient in JavaScript, React, Node.js, Python, and AWS. Built scalable web applications."
  }'
```

### Using Python

```python
import requests

url = "http://localhost:5001/predict"
data = {
    "resume_text": "Your resume text here..."
}

response = requests.post(url, json=data)
print(response.json())
```

---

## 📂 Project Structure

```
ml-service/
├── app.py                    # Flask REST API
├── download_dataset.py       # Download Kaggle dataset
├── train_model.py           # Train ML model
├── requirements.txt         # Python dependencies
├── dataset_info.json        # Dataset metadata (auto-generated)
├── models/                  # Trained models (auto-generated)
│   ├── resume_classifier.joblib
│   ├── tfidf_vectorizer.joblib
│   └── categories.json
└── README.md               # This file
```

---

## 🔗 Integration with Node.js Backend

Add this to your Node.js backend (`server/services/mlClassifier.service.js`):

```javascript
import axios from 'axios';

const ML_SERVICE_URL = 'http://localhost:5001';

export const classifyResume = async (resumeText) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
      resume_text: resumeText
    });
    return response.data;
  } catch (error) {
    throw new Error('ML service unavailable');
  }
};
```

---

## 🎓 Technical Details

### ML Pipeline

1. **Text Preprocessing**
   - Lowercase conversion
   - URL/email removal
   - Special character removal
   - Tokenization

2. **Feature Extraction**
   - TF-IDF vectorization
   - Top 5000 features
   - Unigrams + bigrams
   - English stop words removed

3. **Model Training**
   - Algorithm: Random Forest
   - 100 trees
   - Max depth: 20
   - 80/20 train-test split
   - Stratified sampling

4. **Evaluation**
   - Accuracy score
   - Classification report
   - Confusion matrix

### Model Persistence

Models saved using `joblib`:
- Faster than pickle for large numpy arrays
- Better compression
- Compatible with scikit-learn

---

## 🚀 Performance

- **Accuracy**: ~98% (depends on dataset quality)
- **Prediction time**: <100ms per resume
- **Training time**: 1-2 minutes (for ~1000 resumes)
- **Model size**: ~10-20 MB

---

## 🐛 Troubleshooting

**"Model not loaded" error:**
```bash
# Train the model first
python3 train_model.py
```

**"Dataset not found" error:**
```bash
# Download dataset first
python3 download_dataset.py
```

**Import errors:**
```bash
# Install dependencies
pip3 install -r requirements.txt
```

---

## 📚 Next Steps

1. ✅ Train model with full dataset
2. ✅ Test API endpoints
3. ⏳ Integrate with Node.js backend
4. ⏳ Add frontend UI component
5. ⏳ Deploy as microservice

---

**Built with ❤️ using scikit-learn**
