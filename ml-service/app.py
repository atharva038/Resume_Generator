"""
Flask REST API for Resume Category Classifier

This service provides ML-powered resume classification via REST API.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from train_model import ResumeClassifier

app = Flask(__name__)
CORS(app)  # Enable CORS for Node.js backend

# Load model on startup
classifier = ResumeClassifier()

try:
    classifier.load_model()
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"⚠️ Could not load model: {e}")
    print("Run train_model.py first to train the model!")
    classifier = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": classifier is not None,
        "service": "Resume Category Classifier"
    })

@app.route('/categories', methods=['GET'])
def get_categories():
    """Get available categories"""
    if not classifier:
        return jsonify({"error": "Model not loaded"}), 503
    
    return jsonify({
        "categories": classifier.categories,
        "count": len(classifier.categories)
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict resume category
    
    Request body:
    {
        "resume_text": "Your resume content here..."
    }
    
    Response:
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
    """
    if not classifier:
        return jsonify({
            "success": False,
            "error": "Model not loaded. Please train the model first."
        }), 503
    
    try:
        # Get resume text from request
        data = request.get_json()
        
        if not data or 'resume_text' not in data:
            return jsonify({
                "success": False,
                "error": "Missing 'resume_text' in request body"
            }), 400
        
        resume_text = data['resume_text']
        
        # Validate
        if not resume_text or len(resume_text.strip()) < 50:
            return jsonify({
                "success": False,
                "error": "Resume text must be at least 50 characters"
            }), 400
        
        # Predict
        result = classifier.predict(resume_text)
        
        return jsonify({
            "success": True,
            "data": result
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Predict categories for multiple resumes
    
    Request body:
    {
        "resumes": [
            "Resume 1 text...",
            "Resume 2 text...",
            ...
        ]
    }
    """
    if not classifier:
        return jsonify({
            "success": False,
            "error": "Model not loaded"
        }), 503
    
    try:
        data = request.get_json()
        
        if not data or 'resumes' not in data:
            return jsonify({
                "success": False,
                "error": "Missing 'resumes' array in request body"
            }), 400
        
        resumes = data['resumes']
        
        if not isinstance(resumes, list):
            return jsonify({
                "success": False,
                "error": "'resumes' must be an array"
            }), 400
        
        # Predict for each resume
        results = []
        for resume_text in resumes:
            if resume_text and len(resume_text.strip()) >= 50:
                result = classifier.predict(resume_text)
                results.append(result)
            else:
                results.append({
                    "error": "Resume text too short (min 50 chars)"
                })
        
        return jsonify({
            "success": True,
            "data": results,
            "count": len(results)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Resume Category Classifier API")
    print("="*60)
    print(f"Model loaded: {'✅' if classifier else '❌'}")
    if classifier:
        print(f"Categories: {len(classifier.categories)}")
    print("\n📡 Starting Flask server on http://localhost:5001")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
