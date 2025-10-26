#!/usr/bin/env python3
"""
Script to list available Gemini AI models
"""

import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please set it in .env file")

# Configure the API
genai.configure(api_key=API_KEY)

print("\n" + "="*60)
print("📋 Available Gemini Models")
print("="*60 + "\n")

try:
    # List all available models
    models = genai.list_models()
    
    for model in models:
        print(f"Model: {model.name}")
        print(f"  Display Name: {model.display_name}")
        print(f"  Description: {model.description}")
        print(f"  Supported Generation Methods: {model.supported_generation_methods}")
        print(f"  Input Token Limit: {model.input_token_limit}")
        print(f"  Output Token Limit: {model.output_token_limit}")
        print("-" * 60)
    
    print("\n" + "="*60)
    print("Models that support 'generateContent':")
    print("="*60 + "\n")
    
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"✅ {model.name}")
            if hasattr(model, 'input_token_limit'):
                print(f"   Max tokens: {model.input_token_limit}")
    
    print("\n" + "="*60)
    print("Models that support vision/multimodal:")
    print("="*60 + "\n")
    
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            # Vision models typically have "vision" in the name or support image inputs
            if 'vision' in model.name.lower() or 'pro' in model.name.lower():
                print(f"🖼️  {model.name}")
                print(f"   Display: {model.display_name}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nMake sure you have the package installed:")
    print("  pip install google-generativeai")

print("\n")
