"""
Resume Category Classifier - ML Model Training

This script trains a machine learning model to classify resumes into categories.
Uses TF-IDF vectorization and Random Forest classifier.
"""

import pandas as pd
import numpy as np
import json
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import re
import string

class ResumeClassifier:
    """Resume Category Classifier using ML"""
    
    def __init__(self):
        self.vectorizer = None
        self.model = None
        self.categories = None
        
    def preprocess_text(self, text):
        """Clean and preprocess resume text"""
        if not isinstance(text, str):
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove special characters and digits (keep spaces)
        text = re.sub(r'[^a-z\s]', ' ', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    def load_data(self):
        """Load dataset using saved info"""
        print("📥 Loading dataset...")
        
        # Load dataset info
        info_path = os.path.join(os.path.dirname(__file__), 'dataset_info.json')
        
        if not os.path.exists(info_path):
            raise FileNotFoundError("dataset_info.json not found. Run download_dataset.py first!")
        
        with open(info_path, 'r') as f:
            info = json.load(f)
        
        # Load CSV
        csv_path = os.path.join(info['dataset_path'], info['csv_file'])
        df = pd.read_csv(csv_path)
        
        print(f"✅ Loaded {len(df)} resumes")
        
        return df, info
    
    def train(self, max_samples=None):
        """Train the classification model"""
        print("\n🤖 Training Resume Category Classifier...")
        print("="*60)
        
        # Load data
        df, info = self.load_data()
        
        # Get column names
        text_col = info['text_column']
        category_col = info['category_column']
        
        if not text_col or not category_col:
            raise ValueError("Text or category column not found in dataset!")
        
        # Prepare data
        print("\n📊 Preparing data...")
        
        # Limit samples if specified (for faster training)
        if max_samples and len(df) > max_samples:
            df = df.sample(n=max_samples, random_state=42)
            print(f"   Using {max_samples} samples for faster training")
        
        # Clean text
        print("   Preprocessing text...")
        df['cleaned_text'] = df[text_col].apply(self.preprocess_text)
        
        # Remove empty texts
        df = df[df['cleaned_text'].str.len() > 0]
        
        # Prepare X and y
        X = df['cleaned_text']
        y = df[category_col]
        
        # Store categories
        self.categories = sorted(y.unique())
        
        print(f"\n📋 Dataset info:")
        print(f"   Total samples: {len(X)}")
        print(f"   Number of categories: {len(self.categories)}")
        print(f"   Categories: {self.categories}")
        
        # Category distribution
        print(f"\n📊 Category distribution:")
        for cat, count in y.value_counts().items():
            print(f"   {cat}: {count} ({count/len(y)*100:.1f}%)")
        
        # Split data
        print(f"\n✂️ Splitting data (80% train, 20% test)...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"   Training samples: {len(X_train)}")
        print(f"   Testing samples: {len(X_test)}")
        
        # Vectorization (TF-IDF)
        print(f"\n🔤 Vectorizing text with TF-IDF...")
        self.vectorizer = TfidfVectorizer(
            max_features=5000,  # Top 5000 words
            ngram_range=(1, 2),  # Unigrams and bigrams
            min_df=2,  # Ignore terms appearing in less than 2 documents
            stop_words='english'
        )
        
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        print(f"   Feature matrix shape: {X_train_vec.shape}")
        
        # Train model (Random Forest)
        print(f"\n🌳 Training Random Forest classifier...")
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            random_state=42,
            n_jobs=-1  # Use all CPU cores
        )
        
        self.model.fit(X_train_vec, y_train)
        
        # Evaluate
        print(f"\n📈 Evaluating model...")
        y_pred = self.model.predict(X_test_vec)
        
        accuracy = accuracy_score(y_test, y_pred)
        print(f"\n✅ Accuracy: {accuracy*100:.2f}%")
        
        print(f"\n📊 Classification Report:")
        print(classification_report(y_test, y_pred))
        
        # Save model
        self.save_model()
        
        print(f"\n🎉 Training complete!")
        
        return accuracy
    
    def save_model(self):
        """Save trained model and vectorizer"""
        print(f"\n💾 Saving model...")
        
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        # Save model
        model_path = os.path.join(models_dir, 'resume_classifier.joblib')
        joblib.dump(self.model, model_path)
        print(f"   ✅ Model saved to: {model_path}")
        
        # Save vectorizer
        vectorizer_path = os.path.join(models_dir, 'tfidf_vectorizer.joblib')
        joblib.dump(self.vectorizer, vectorizer_path)
        print(f"   ✅ Vectorizer saved to: {vectorizer_path}")
        
        # Save categories
        categories_path = os.path.join(models_dir, 'categories.json')
        with open(categories_path, 'w') as f:
            json.dump({"categories": self.categories}, f, indent=2)
        print(f"   ✅ Categories saved to: {categories_path}")
    
    def load_model(self):
        """Load trained model and vectorizer"""
        print("📥 Loading trained model...")
        
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        
        # Load model
        model_path = os.path.join(models_dir, 'resume_classifier.joblib')
        self.model = joblib.load(model_path)
        
        # Load vectorizer
        vectorizer_path = os.path.join(models_dir, 'tfidf_vectorizer.joblib')
        self.vectorizer = joblib.load(vectorizer_path)
        
        # Load categories
        categories_path = os.path.join(models_dir, 'categories.json')
        with open(categories_path, 'r') as f:
            self.categories = json.load(f)['categories']
        
        print("✅ Model loaded successfully!")
    
    def predict(self, resume_text):
        """Predict category for a single resume"""
        if not self.model or not self.vectorizer:
            raise ValueError("Model not trained or loaded!")
        
        # Preprocess
        cleaned = self.preprocess_text(resume_text)
        
        # Vectorize
        vectorized = self.vectorizer.transform([cleaned])
        
        # Predict
        prediction = self.model.predict(vectorized)[0]
        probabilities = self.model.predict_proba(vectorized)[0]
        
        # Get top 3 predictions with confidence
        top_indices = np.argsort(probabilities)[-3:][::-1]
        top_predictions = [
            {
                "category": self.categories[idx],
                "confidence": float(probabilities[idx] * 100)
            }
            for idx in top_indices
        ]
        
        return {
            "predicted_category": prediction,
            "confidence": float(probabilities[self.categories.index(prediction)] * 100),
            "top_predictions": top_predictions
        }

def main():
    """Main function to train the model"""
    classifier = ResumeClassifier()
    
    # Train model (use max_samples for faster training during development)
    # Remove max_samples parameter for production to use full dataset
    classifier.train(max_samples=None)  # Use all data
    
    # Test with sample prediction
    print("\n" + "="*60)
    print("TESTING MODEL")
    print("="*60)
    
    sample_resume = """
    Software Engineer with 5 years of experience in full-stack development.
    Proficient in JavaScript, React, Node.js, Python, and AWS.
    Built scalable web applications serving millions of users.
    Strong background in database design, API development, and cloud architecture.
    """
    
    result = classifier.predict(sample_resume)
    
    print(f"\n📝 Sample Resume:")
    print(sample_resume.strip())
    print(f"\n🎯 Prediction:")
    print(f"   Category: {result['predicted_category']}")
    print(f"   Confidence: {result['confidence']:.2f}%")
    print(f"\n📊 Top 3 Predictions:")
    for i, pred in enumerate(result['top_predictions'], 1):
        print(f"   {i}. {pred['category']}: {pred['confidence']:.2f}%")

if __name__ == "__main__":
    main()
