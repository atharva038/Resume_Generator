"""
Resume Category Classifier - Dataset Download & Exploration

This script downloads the Kaggle resume dataset and explores its structure.
"""

import kagglehub
import pandas as pd
import os
import json

def download_dataset():
    """Download the resume dataset from Kaggle"""
    print("📥 Downloading resume dataset from Kaggle...")
    
    try:
        # Download latest version
        path = kagglehub.dataset_download("snehaanbhawal/resume-dataset")
        print(f"✅ Dataset downloaded to: {path}")
        return path
    except Exception as e:
        print(f"❌ Error downloading dataset: {e}")
        return None

def explore_dataset(dataset_path):
    """Explore the structure and contents of the dataset"""
    print("\n📊 Exploring dataset structure...")
    
    # List all files in the dataset directory
    files = os.listdir(dataset_path)
    print(f"\n📁 Files/folders found: {files}")
    
    # Look for CSV files in the main directory
    csv_files = [f for f in files if f.endswith('.csv')]
    
    # If no CSV files in main directory, search subdirectories
    if not csv_files:
        print("\n🔍 Searching subdirectories for CSV files...")
        for item in files:
            item_path = os.path.join(dataset_path, item)
            if os.path.isdir(item_path):
                subfiles = os.listdir(item_path)
                sub_csv = [f for f in subfiles if f.endswith('.csv')]
                if sub_csv:
                    print(f"   Found CSV in '{item}/' folder: {sub_csv}")
                    # Update dataset_path to subdirectory
                    dataset_path = item_path
                    csv_files = sub_csv
                    break
    
    if not csv_files:
        print("❌ No CSV files found in dataset or subdirectories")
        print("📁 Available files/folders:")
        for item in files:
            item_path = os.path.join(dataset_path, item)
            if os.path.isdir(item_path):
                print(f"   Folder: {item}/")
                subfiles = os.listdir(item_path)[:5]  # Show first 5 files
                for sf in subfiles:
                    print(f"      - {sf}")
            else:
                print(f"   File: {item}")
        return None, None
    
    print(f"\n📄 CSV files: {csv_files}")
    
    # Read the main CSV file (usually the first one)
    main_csv = csv_files[0]
    csv_path = os.path.join(dataset_path, main_csv)
    
    print(f"\n📖 Reading: {main_csv}")
    df = pd.read_csv(csv_path)
    
    # Display basic information
    print("\n" + "="*60)
    print("DATASET OVERVIEW")
    print("="*60)
    print(f"\n📏 Shape: {df.shape[0]} rows × {df.shape[1]} columns")
    print(f"\n📋 Columns: {list(df.columns)}")
    
    print("\n" + "-"*60)
    print("COLUMN DETAILS")
    print("-"*60)
    print(df.info())
    
    # Check for category column (common names)
    category_cols = ['Category', 'category', 'Role', 'role', 'Job', 'job', 'Label', 'label']
    category_col = None
    
    for col in category_cols:
        if col in df.columns:
            category_col = col
            break
    
    if category_col:
        print(f"\n🎯 Category column found: '{category_col}'")
        print(f"\n📊 Category distribution:")
        print(df[category_col].value_counts())
        print(f"\n🔢 Number of unique categories: {df[category_col].nunique()}")
    else:
        print("\n⚠️ No obvious category column found. Columns available:")
        print(list(df.columns))
    
    # Check for resume text column
    text_cols = ['Resume', 'resume', 'Text', 'text', 'Resume_str', 'resume_str', 'Content', 'content']
    text_col = None
    
    for col in text_cols:
        if col in df.columns:
            text_col = col
            break
    
    if text_col:
        print(f"\n📝 Resume text column found: '{text_col}'")
        print(f"\n📊 Sample resume (first 500 chars):")
        print("-"*60)
        print(df[text_col].iloc[0][:500] + "...")
        print("-"*60)
    else:
        print("\n⚠️ No obvious resume text column found")
    
    # Show first few rows
    print("\n" + "="*60)
    print("SAMPLE DATA (first 3 rows)")
    print("="*60)
    print(df.head(3))
    
    # Save dataset info to JSON for later use
    dataset_info = {
        "dataset_path": dataset_path,
        "csv_file": main_csv,
        "shape": {"rows": int(df.shape[0]), "columns": int(df.shape[1])},
        "columns": list(df.columns),
        "category_column": category_col,
        "text_column": text_col,
        "num_categories": int(df[category_col].nunique()) if category_col else None,
        "categories": df[category_col].value_counts().to_dict() if category_col else None
    }
    
    # Save to ml-service directory
    info_path = os.path.join(os.path.dirname(__file__), 'dataset_info.json')
    with open(info_path, 'w') as f:
        json.dump(dataset_info, f, indent=2)
    
    print(f"\n💾 Dataset info saved to: {info_path}")
    
    return df, dataset_info

def main():
    """Main function to download and explore dataset"""
    print("🤖 Resume Category Classifier - Dataset Preparation")
    print("="*60)
    
    # Download dataset
    dataset_path = download_dataset()
    
    if dataset_path:
        # Explore dataset
        result = explore_dataset(dataset_path)
        
        if result is not None:
            df, info = result
            
            if df is not None:
                print("\n✅ Dataset exploration complete!")
                print(f"\n📊 Summary:")
                print(f"   - Total resumes: {info['shape']['rows']}")
                print(f"   - Categories: {info['num_categories']}")
                print(f"   - Category column: {info['category_column']}")
                print(f"   - Text column: {info['text_column']}")
                print(f"\n🎯 Ready to build ML model!")
            else:
                print("\n❌ Failed to explore dataset")
        else:
            print("\n❌ Dataset exploration returned no results")
    else:
        print("\n❌ Failed to download dataset")

if __name__ == "__main__":
    main()
