from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
from datetime import datetime
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Added React port

# Commodity configuration
COMMODITY_CONFIG = {
    'bajra': {
        'name': 'Bajra',
        'display_name': '🌾 Bajra',
        'default_p_min': 1800,
        'default_p_max': 2500,
        'color': 'green',
        'icon': '🌾'
    },
    'wheat': {
        'name': 'Wheat',
        'display_name': '🌾 Wheat', 
        'default_p_min': 2000,
        'default_p_max': 2800,
        'color': 'amber',
        'icon': '🌾'
    },
    'cotton': {
        'name': 'Cotton',
        'display_name': '🧵 Cotton',
        'default_p_min': 5000, 
        'default_p_max': 8000,
        'color': 'blue',
        'icon': '🧵'
    },
    'jowar': {
        'name': 'Jowar',
        'display_name': '🌾 Jowar',
        'default_p_min': 1900,
        'default_p_max': 2600, 
        'color': 'purple',
        'icon': '🌾'
    },
    'rice': {
        'name': 'Rice',
        'display_name': '🍚 Rice',
        'default_p_min': 2500,
        'default_p_max': 5000,
        'color': 'red',
        'icon': '🍚'
    }
}

# File name patterns for each commodity - UPDATED PATHS
COMMODITY_FILES = {
    'bajra': {
        'model': 'notebooks/bajra_model.pkl',
        'preprocessor': 'notebooks/bajra_preprocessor.pkl', 
        'district_encoder': 'notebooks/Bajradistrict_encoder.pkl',
        'market_encoder': 'notebooks/Bajramarket_encoder.pkl'
    },
    'wheat': {
        'model': 'notebooks/wheat_model.pkl',
        'preprocessor': 'notebooks/wheat_preprocessor.pkl',
        'district_encoder': 'notebooks/Wheatdistrict_encoder.pkl',
        'market_encoder': 'notebooks/Wheatmarket_encoder.pkl'
    },
    'cotton': {
        'model': 'notebooks/cotton_model.pkl',
        'preprocessor': 'notebooks/cotton_preprocessor.pkl',
        'district_encoder': 'notebooks/Cottondistrict_encoder.pkl',
        'market_encoder': 'notebooks/Cottonmarket_encoder.pkl'
    },
    'jowar': {
        'model': 'notebooks/jowar_model.pkl',
        'preprocessor': 'notebooks/jowar_preprocessor.pkl',
        'district_encoder': 'notebooks/Jowardistrict_encoder.pkl',
        'market_encoder': 'notebooks/Jowarmarket_encoder.pkl'
    },
    'rice': {
        'model': 'notebooks/rice_model.pkl',
        'preprocessor': 'notebooks/rice_preprocessor.pkl',
        'district_encoder': 'notebooks/Ricedistrict_encoder.pkl',
        'market_encoder': 'notebooks/Ricemarket_encoder.pkl'
    }
}

# Load all commodity models with their specific encoders
COMMODITY_MODELS = {}
available_commodities = []
COMMODITY_DISTRICTS = {}

print("🚀 Loading commodity models...")
print(f"📁 Current directory: {os.getcwd()}")

for commodity, files in COMMODITY_FILES.items():
    try:
        print(f"\n🔍 Loading {commodity}:")
        print(f"   Model: {files['model']} - Exists: {os.path.exists(files['model'])}")
        print(f"   Preprocessor: {files['preprocessor']} - Exists: {os.path.exists(files['preprocessor'])}")
        print(f"   District Encoder: {files['district_encoder']} - Exists: {os.path.exists(files['district_encoder'])}")
        
        # Check if we have the essential files
        if all(os.path.exists(files[key]) for key in ['model', 'preprocessor', 'district_encoder']):
            with open(files['model'], "rb") as f:
                model = pickle.load(f)
            with open(files['preprocessor'], "rb") as f:
                preprocessor = pickle.load(f)
            with open(files['district_encoder'], "rb") as f:
                district_encoder = pickle.load(f)
            
            COMMODITY_MODELS[commodity] = {
                'model': model,
                'preprocessor': preprocessor,
                'district_encoder': district_encoder
            }
            available_commodities.append(commodity)
            
            # Store the districts this commodity knows
            if hasattr(district_encoder, 'classes_'):
                COMMODITY_DISTRICTS[commodity] = list(district_encoder.classes_)
                print(f"   ✅ {commodity} knows {len(COMMODITY_DISTRICTS[commodity])} districts:")
                for district in COMMODITY_DISTRICTS[commodity]:
                    print(f"      - '{district}'")
            else:
                print(f"   ✅ {commodity} loaded (no district classes info)")
                
        else:
            print(f"   ❌ Missing essential files for {commodity}")
            
    except Exception as e:
        print(f"   ❌ Error loading {commodity}: {e}")

print(f"\n🌾 Available commodities: {available_commodities}")

# Maharashtra districts and markets
DISTRICT_TO_MARKETS = {
    'ahmadnagar': {
        'district_name': 'Ahmadnagar',
        'markets': ['Ahmednagar', 'Ahmedpur', 'Akhadabalapur'],
        'district_id': 501,
        'market_id': 1101
    },
    'akola': {
        'district_name': 'Akola',
        'markets': ['Akola', 'Akot', 'Achalpur'],
        'district_id': 502,
        'market_id': 1102
    },
    'amravati': {
        'district_name': 'Amravati',
        'markets': ['Amravati', 'Achalpur'],
        'district_id': 503,
        'market_id': 1103
    },
    'aurangabad': {
        'district_name': 'Aurangabad',
        'markets': ['Aurangabad'],
        'district_id': 504,
        'market_id': 1104
    },
    'bid': {
        'district_name': 'Bid',
        'markets': ['Ahmedpur'],
        'district_id': 505,
        'market_id': 1105
    },
    'bhandara': {
        'district_name': 'Bhandara',
        'markets': ['Bhandara', 'Tumsar'],
        'district_id': 506,
        'market_id': 1106
    },
    'nandurbar': {
        'district_name': 'Nandurbar',
        'markets': ['Nandurbar'],
        'district_id': 497,
        'market_id': 165
    }
}

STATE_ID = 27

@app.route("/")
def home():
    """Home route - can serve a simple message since React will handle UI"""
    return jsonify({
        "message": "MandiNetra Price Prediction API",
        "status": "running",
        "available_commodities": available_commodities
    })

@app.route('/api/commodities', methods=['GET'])
def get_commodities():
    """Get available commodities"""
    return jsonify({"commodities": [
        {"id": commodity, "name": COMMODITY_CONFIG[commodity]['display_name']} 
        for commodity in available_commodities
    ]})

@app.route('/api/districts/<commodity>', methods=['GET'])
def get_districts(commodity):
    """Get available districts for a specific commodity"""
    try:
        commodity_lower = commodity.lower()
        
        if commodity_lower not in COMMODITY_DISTRICTS:
            return jsonify({"error": f"Commodity '{commodity}' not available"}), 400
        
        # Get districts that this commodity supports
        supported_districts = COMMODITY_DISTRICTS[commodity_lower]
        districts = []
        
        for district_name in supported_districts:
            # Find matching district info
            for district_id, district_info in DISTRICT_TO_MARKETS.items():
                if district_info['district_name'] == district_name:
                    districts.append({
                        "id": district_id,
                        "name": district_info['district_name']
                    })
                    break
        
        print(f"📋 Returning {len(districts)} districts for {commodity}")
        return jsonify({"districts": districts})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/markets/<district>', methods=['GET'])
def get_markets(district):
    """Get markets for a specific district"""
    try:
        district_info = DISTRICT_TO_MARKETS.get(district.lower())
        if district_info:
            markets = []
            for market in district_info['markets']:
                markets.append({
                    "id": market.lower().replace(' ', '_'),
                    "name": market
                })
            return jsonify({"markets": markets})
        else:
            return jsonify({"markets": []})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict price for commodity"""
    try:
        data = request.get_json()
        commodity = data.get('commodity', '').lower()
        
        print(f"🎯 Prediction request for: {commodity}")
        
        if commodity not in COMMODITY_MODELS:
            return jsonify({"error": f"Commodity '{commodity}' not available. Available: {available_commodities}"}), 400
            
        district_input = data.get('district', '').lower()
        market_input = data.get('market', '').lower()
        
        if not all([commodity, district_input, market_input]):
            return jsonify({"error": "All fields are required"}), 400
            
        district_info = DISTRICT_TO_MARKETS.get(district_input)
        if not district_info:
            return jsonify({"error": f"District '{district_input}' not found"}), 400
        
        # Get model and encode district using commodity-specific encoder
        model_data = COMMODITY_MODELS[commodity]
        config = COMMODITY_CONFIG[commodity]
        
        try:
            district_encoded = model_data['district_encoder'].transform([district_info['district_name']])[0]
            print(f"🔢 District '{district_info['district_name']}' encoded as: {district_encoded}")
        except Exception as e:
            # Show what districts ARE available for this commodity
            available_for_commodity = COMMODITY_DISTRICTS.get(commodity, [])
            return jsonify({
                "error": f"District '{district_info['district_name']}' not available for {commodity}. Available districts: {available_for_commodity}"
            }), 400
        
        # Prepare features
        current_date = datetime.now()
        features = np.array([[
            district_info['market_id'],
            STATE_ID,
            district_info['district_id'],
            config['default_p_min'],
            config['default_p_max'],
            current_date.year,
            current_date.month,
            current_date.day,
            district_encoded
        ]])
        
        # Predict
        prepared_features = model_data['preprocessor'].transform(features)
        prediction = model_data['model'].predict(prepared_features)
        predicted_price = round(float(prediction[0]), 2)
        
        print(f"✅ Prediction successful: ₹{predicted_price}")
        
        return jsonify({
            "predicted_price": predicted_price,
            "commodity": config['name'],
            "commodity_display": config['display_name'],
            "commodity_icon": config['icon'],
            "commodity_color": config['color'],
            "district": district_info['district_name'],
            "market": market_input.replace('_', ' ').title(),
            "state": "Maharashtra",
            "prediction_date": current_date.strftime("%Y-%m-%d"),
            "prediction_time": current_date.strftime("%H:%M:%S"),
            "status": "success"
        })
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    commodity_info = {}
    for commodity in available_commodities:
        commodity_info[commodity] = {
            'districts': COMMODITY_DISTRICTS.get(commodity, []),
            'district_count': len(COMMODITY_DISTRICTS.get(commodity, []))
        }
    
    return jsonify({
        "status": "healthy",
        "available_commodities": available_commodities,
        "commodity_info": commodity_info
    })

if __name__ == '__main__':
    print(f"\n🎯 Multi-Commodity Price Prediction API Ready!")
    print(f"🌾 Available commodities: {available_commodities}")
    print(f"📍 Using commodity-specific district encoders")
    print(f"🚀 Backend running on: http://127.0.0.1:5000")
    print(f"🌐 React app should connect from: http://localhost:3000")
    app.run(debug=True, port=5000)