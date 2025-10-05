import requests
import json

url = "http://127.0.0.1:5000/predict"

# Test with different values
test_cases = [
    {
        "p_min": 1800,
        "p_max": 2500, 
        "Month": 7,
        "district_encoded": 42
    },
    {
        "p_min": 2000,
        "p_max": 2800,
        "Month": 8,
        "district_encoded": 42
    },
    {
        "p_min": 1500,
        "p_max": 2200,
        "Month": 6,
        "district_encoded": 45
    }
]

for i, data in enumerate(test_cases):
    try:
        response = requests.post(url, json=data)
        print(f"Test Case {i+1}:")
        print(f"  Input: {data}")
        print(f"  Prediction: {response.json()['Predicted_p_modal']}")
        print()
    except Exception as e:
        print(f"Error in test case {i+1}: {e}")