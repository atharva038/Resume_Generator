"""
Test Script for Resume Category Classifier API

Run this after starting the Flask server to test all endpoints.
"""

import requests
import json

API_URL = "http://localhost:5001"

def test_health():
    """Test health check endpoint"""
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200

def test_categories():
    """Test get categories endpoint"""
    print("\n" + "="*60)
    print("TEST 2: Get Categories")
    print("="*60)
    
    response = requests.get(f"{API_URL}/categories")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Number of categories: {data.get('count')}")
    print(f"Categories: {data.get('categories')}")
    
    return response.status_code == 200

def test_predict():
    """Test prediction endpoint"""
    print("\n" + "="*60)
    print("TEST 3: Predict Resume Category")
    print("="*60)
    
    # Sample resumes for different categories
    test_resumes = [
        {
            "name": "Software Engineer",
            "text": """
            Software Engineer with 5 years of experience in full-stack development.
            Expert in JavaScript, React, Node.js, Python, and AWS.
            Built scalable web applications serving millions of users.
            Strong background in database design, RESTful API development, and cloud architecture.
            Experience with agile methodologies, CI/CD pipelines, and microservices.
            """
        },
        {
            "name": "Data Scientist",
            "text": """
            Data Scientist with 4 years of experience in machine learning and analytics.
            Proficient in Python, TensorFlow, PyTorch, scikit-learn, and SQL.
            Developed predictive models for customer churn, recommendation systems, and fraud detection.
            Experience with data visualization (Tableau, PowerBI), A/B testing, and statistical analysis.
            Strong background in deep learning, NLP, and computer vision.
            """
        },
        {
            "name": "HR Professional",
            "text": """
            Human Resources Manager with 6 years of experience in talent acquisition and employee relations.
            Skilled in recruitment, onboarding, performance management, and HR policies.
            Managed teams of 50+ employees and reduced turnover by 30%.
            Experience with HRIS systems, compensation analysis, and compliance.
            Strong communication and conflict resolution skills.
            """
        }
    ]
    
    for test in test_resumes:
        print(f"\n📝 Testing: {test['name']}")
        print("-" * 60)
        
        response = requests.post(
            f"{API_URL}/predict",
            json={"resume_text": test['text']}
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                result = data['data']
                print(f"\n✅ Prediction: {result['predicted_category']}")
                print(f"   Confidence: {result['confidence']:.2f}%")
                print(f"\n📊 Top 3 Predictions:")
                for i, pred in enumerate(result['top_predictions'], 1):
                    print(f"   {i}. {pred['category']}: {pred['confidence']:.2f}%")
            else:
                print(f"❌ Error: {data['error']}")
        else:
            print(f"❌ Request failed: {response.text}")
    
    return True

def test_batch():
    """Test batch prediction endpoint"""
    print("\n" + "="*60)
    print("TEST 4: Batch Prediction")
    print("="*60)
    
    resumes = [
        "Software Engineer with React and Node.js experience. Built web applications and APIs.",
        "Marketing Manager with 5 years experience in digital marketing, SEO, and content strategy."
    ]
    
    response = requests.post(
        f"{API_URL}/predict/batch",
        json={"resumes": resumes}
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            print(f"\n✅ Processed {data['count']} resumes")
            for i, result in enumerate(data['data'], 1):
                if 'predicted_category' in result:
                    print(f"\n{i}. Category: {result['predicted_category']} ({result['confidence']:.2f}%)")
                else:
                    print(f"\n{i}. Error: {result.get('error')}")
        else:
            print(f"❌ Error: {data['error']}")
    else:
        print(f"❌ Request failed: {response.text}")
    
    return True

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🧪 Resume Category Classifier API Tests")
    print("="*60)
    print(f"API URL: {API_URL}")
    
    try:
        # Run tests
        test_health()
        test_categories()
        test_predict()
        test_batch()
        
        print("\n" + "="*60)
        print("✅ All tests completed!")
        print("="*60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Could not connect to API!")
        print("Make sure the Flask server is running:")
        print("   python3 app.py")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")

if __name__ == "__main__":
    main()
