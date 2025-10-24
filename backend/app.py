from flask import Flask, request, jsonify
import pickle
import numpy as np
from datetime import datetime
from flask_cors import CORS
import os
import logging
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

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
    },
    'chikoo': {
        'name': 'Chikoo',
        'display_name': '🥭 Chikoo',
        'default_p_min': 3000,
        'default_p_max': 6000,
        'color': 'green',
        'icon': '🥭'
    },
    'grapes': {
        'name': 'Grapes',
        'display_name': '🍇 Grapes',
        'default_p_min': 4000,
        'default_p_max': 8000,
        'color': 'purple',
        'icon': '🍇'
    },
    'mangos': {
        'name': 'Mangoes',
        'display_name': '🥭 Mangoes',
        'default_p_min': 2000,
        'default_p_max': 5000,
        'color': 'orange',
        'icon': '🥭'
    },
    'orange': {
        'name': 'Orange',
        'display_name': '🍊 Orange',
        'default_p_min': 2500,
        'default_p_max': 4500,
        'color': 'orange',
        'icon': '🍊'
    },
    'papaya': {
        'name': 'Papaya',
        'display_name': '🍈 Papaya',
        'default_p_min': 1500,
        'default_p_max': 3000,
        'color': 'yellow',
        'icon': '🍈'
    }
}

# File name patterns for each commodity
COMMODITY_FILES = {
    'bajra': {
        'model': './models/bajra_model.pkl',
        'preprocessor': './models/bajra_preprocessor.pkl',
        'district_encoder': './models/Bajradistrict_encoder.pkl'
    },
    'wheat': {
        'model': './models/wheat_model.pkl',
        'preprocessor': './models/wheat_preprocessor.pkl',
        'district_encoder': './models/Wheatdistrict_encoder.pkl'
    },
    'cotton': {
        'model': './models/cotton_model.pkl',
        'preprocessor': './models/cotton_preprocessor.pkl',
        'district_encoder': './models/Cottondistrict_encoder.pkl'
    },
    'jowar': {
        'model': './models/jowar_model.pkl',
        'preprocessor': './models/jowar_preprocessor.pkl',
        'district_encoder': './models/Jowardistrict_encoder.pkl'
    },
    'rice': {
        'model': './models/rice_model.pkl',
        'preprocessor': './models/rice_preprocessor.pkl',
        'district_encoder': './models/Ricedistrict_encoder.pkl'
    },
    'chikoo': {
        'model': './models/chikoo_model.pkl',
        'preprocessor': './models/chikoo_preprocessor.pkl',
        'district_encoder': './models/chikoodistrict_encoder.pkl'
    },
    'grapes': {
        'model': './models/grapes_model.pkl',
        'preprocessor': './models/grapes_preprocessor.pkl',
        'district_encoder': './models/grapesdistrict_encoder.pkl'
    },
    'mangos': {
        'model': './models/mangos_model.pkl',
        'preprocessor': './models/mangos_preprocessor.pkl',
        'district_encoder': './models/mangosdistrict_encoder.pkl'
    },
    'orange': {
        'model': './models/orange_model.pkl',
        'preprocessor': './models/orange_preprocessor.pkl',
        'district_encoder': './models/orangedistrict_encoder.pkl'
    },
    'papaya': {
        'model': './models/papaya_model.pkl',
        'preprocessor': './models/papaya_preprocessor.pkl',
        'district_encoder': './models/papayadistrict_encoder.pkl'
    }
}

# Maharashtra districts and markets - EXPANDED WITH NAGPUR
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
    },
    'nashik': {
        'district_name': 'Nashik',
        'markets': ['Nashik', 'Malegaon'],
        'district_id': 507,
        'market_id': 1107
    },
    'pune': {
        'district_name': 'Pune',
        'markets': ['Pune', 'Baramati'],
        'district_id': 508,
        'market_id': 1108
    },
    'kolhapur': {
        'district_name': 'Kolhapur',
        'markets': ['Kolhapur'],
        'district_id': 509,
        'market_id': 1109
    },
    'nagpur': {
        'district_name': 'Nagpur',
        'markets': ['Nagpur', 'Katol', 'Kalmeshwar', 'Umred'],
        'district_id': 510,
        'market_id': 1110
    },
    'yavatmal': {
        'district_name': 'Yavatmal',
        'markets': ['Yavatmal', 'Wani'],
        'district_id': 511,
        'market_id': 1111
    },
    'latur': {
        'district_name': 'Latur',
        'markets': ['Latur'],
        'district_id': 512,
        'market_id': 1112
    },
    'jalna': {
        'district_name': 'Jalna',
        'markets': ['Jalna'],
        'district_id': 513,
        'market_id': 1113
    },
    'thane': {
        'district_name': 'Thane',
        'markets': ['Thane', 'Kalyan'],
        'district_id': 514,
        'market_id': 1114
    }
}

STATE_ID = 27

# Load all commodity models with error handling
COMMODITY_MODELS = {}
available_commodities = []
COMMODITY_DISTRICTS = {}

logger.info("🚀 Loading commodity models...")
logger.info(f"📁 Current directory: {os.getcwd()}")

for commodity, files in COMMODITY_FILES.items():
    try:
        logger.info(f"🔍 Attempting to load {commodity}...")
        
        # Check if essential files exist
        missing_files = []
        for file_type, file_path in files.items():
            if not os.path.exists(file_path):
                missing_files.append(f"{file_type}: {file_path}")
        
        if missing_files:
            logger.warning(f"❌ Missing files for {commodity}: {', '.join(missing_files)}")
            continue
            
        # Load files
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
            COMMODITY_DISTRICTS[commodity] = [district.strip() for district in district_encoder.classes_]
            logger.info(f"✅ {commodity} loaded with {len(COMMODITY_DISTRICTS[commodity])} districts")
        else:
            COMMODITY_DISTRICTS[commodity] = []
            logger.info(f"✅ {commodity} loaded (no district classes info)")
            
    except Exception as e:
        logger.error(f"❌ Error loading {commodity}: {str(e)}")

logger.info(f"🌾 Available commodities: {available_commodities}")

# Debug: Check what districts orange model knows
if 'orange' in COMMODITY_DISTRICTS:
    logger.info(f"🍊 Orange model knows these districts: {COMMODITY_DISTRICTS['orange']}")

@app.route("/")
def home():
    """Home route"""
    return jsonify({
        "message": "MandiNetra Price Prediction API",
        "status": "running",
        "available_commodities": available_commodities,
        "total_commodities": len(available_commodities)
    })

@app.route('/api/commodities', methods=['GET'])
def get_commodities():
    """Get available commodities"""
    commodities_list = []
    for commodity in available_commodities:
        config = COMMODITY_CONFIG.get(commodity, {})
        commodities_list.append({
            "id": commodity,
            "name": config.get('display_name', commodity.title()),
            "color": config.get('color', 'gray'),
            "icon": config.get('icon', '🌾')
        })
    
    return jsonify({"commodities": commodities_list})

@app.route('/api/districts/<commodity>', methods=['GET'])
def get_districts(commodity):
    """Get available districts for a specific commodity"""
    try:
        commodity_lower = commodity.lower()
        
        if commodity_lower not in COMMODITY_MODELS:
            return jsonify({
                "error": f"Commodity '{commodity}' not available. Available commodities: {', '.join(available_commodities)}"
            }), 400
        
        # Get districts that this commodity supports
        supported_districts = COMMODITY_DISTRICTS.get(commodity_lower, [])
        districts = []
        
        for district_name in supported_districts:
            # Clean district name for matching
            clean_district_name = district_name.strip().lower()
            
            # Find matching district info
            found = False
            for district_id, district_info in DISTRICT_TO_MARKETS.items():
                if district_info['district_name'].lower() == clean_district_name:
                    districts.append({
                        "id": district_id,
                        "name": district_info['district_name']
                    })
                    found = True
                    break
            
            # If not found in DISTRICT_TO_MARKETS, still include it
            if not found:
                districts.append({
                    "id": clean_district_name.replace(' ', '_'),
                    "name": district_name.strip()
                })
        
        logger.info(f"📋 Returning {len(districts)} districts for {commodity}")
        return jsonify({"districts": districts})
        
    except Exception as e:
        logger.error(f"Error getting districts for {commodity}: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/markets/<district>', methods=['GET'])
def get_markets(district):
    """Get markets for a specific district"""
    try:
        district_lower = district.lower()
        district_info = DISTRICT_TO_MARKETS.get(district_lower)
        
        if not district_info:
            # Try to find by partial match or name match
            matching_districts = []
            for dist_id, dist_info in DISTRICT_TO_MARKETS.items():
                if (district_lower in dist_id or 
                    district_lower in dist_info['district_name'].lower() or
                    dist_info['district_name'].lower() in district_lower):
                    matching_districts.append((dist_id, dist_info))
            
            if matching_districts:
                district_id, district_info = matching_districts[0]
                logger.info(f"🔍 Found matching district '{district_info['district_name']}' for input '{district}'")
            else:
                return jsonify({
                    "error": f"District '{district}' not found.",
                    "available_districts": list(DISTRICT_TO_MARKETS.keys())
                }), 404
        
        markets = []
        for market in district_info['markets']:
            markets.append({
                "id": market.lower().replace(' ', '_'),
                "name": market
            })
            
        logger.info(f"🏪 Returning {len(markets)} markets for {district_info['district_name']}")
        return jsonify({
            "markets": markets,
            "district_name": district_info['district_name']
        })
        
    except Exception as e:
        logger.error(f"Error getting markets for {district}: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict price for commodity"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        commodity = data.get('commodity', '').lower()
        district_input = data.get('district', '').lower()
        market_input = data.get('market', '').lower()
        
        logger.info(f"🎯 Prediction request for: {commodity}, district: {district_input}, market: {market_input}")
        
        # Validation
        if not commodity:
            return jsonify({"error": "Commodity is required"}), 400
        if not district_input:
            return jsonify({"error": "District is required"}), 400
        if not market_input:
            return jsonify({"error": "Market is required"}), 400
            
        if commodity not in COMMODITY_MODELS:
            return jsonify({
                "error": f"Commodity '{commodity}' not available. Available: {', '.join(available_commodities)}"
            }), 400
            
        # Get district info
        district_info = DISTRICT_TO_MARKETS.get(district_input)
        if not district_info:
            # Try partial match
            matching_districts = []
            for dist_id, dist_info in DISTRICT_TO_MARKETS.items():
                if (district_input in dist_id or 
                    district_input in dist_info['district_name'].lower() or
                    dist_info['district_name'].lower() in district_input):
                    matching_districts.append((dist_id, dist_info))
            
            if matching_districts:
                district_id, district_info = matching_districts[0]
                logger.info(f"🔍 Using matching district: {district_info['district_name']}")
            else:
                return jsonify({
                    "error": f"District '{district_input}' not found. Available districts: {list(DISTRICT_TO_MARKETS.keys())}"
                }), 400
        
        # Verify market exists in district
        market_names = [m.lower().replace(' ', '_') for m in district_info['markets']]
        if market_input not in market_names:
            return jsonify({
                "error": f"Market '{market_input}' not found in {district_info['district_name']}. Available markets: {district_info['markets']}"
            }), 400
        
        # Get model and encode district
        model_data = COMMODITY_MODELS[commodity]
        config = COMMODITY_CONFIG.get(commodity, COMMODITY_CONFIG['bajra'])  # Fallback to bajra config
        
        # Encode district
        try:
            district_encoded = model_data['district_encoder'].transform([district_info['district_name']])[0]
            logger.info(f"🔢 District '{district_info['district_name']}' encoded as: {district_encoded}")
        except Exception as e:
            available_for_commodity = COMMODITY_DISTRICTS.get(commodity, [])
            logger.error(f"District encoding failed: {str(e)}")
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
        predicted_price = max(0, round(float(prediction[0]), 2))  # Ensure non-negative price
        
        logger.info(f"✅ Prediction successful: ₹{predicted_price} for {commodity} in {district_info['district_name']}")
        
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
        logger.error(f"❌ Prediction error: {str(e)}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    commodity_info = {}
    for commodity in available_commodities:
        commodity_info[commodity] = {
            'districts': COMMODITY_DISTRICTS.get(commodity, []),
            'district_count': len(COMMODITY_DISTRICTS.get(commodity, [])),
            'config': COMMODITY_CONFIG.get(commodity, {})
        }
    
    return jsonify({
        "status": "healthy",
        "available_commodities": available_commodities,
        "total_commodities": len(available_commodities),
        "commodity_info": commodity_info,
        "total_districts_available": len(DISTRICT_TO_MARKETS),
        "all_districts": list(DISTRICT_TO_MARKETS.keys())
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# Add these endpoints to your existing Flask app

@app.route('/api/crop-suggestions', methods=['POST'])
def get_crop_suggestions():
    """Get AI-powered crop suggestions based on season and region"""
    try:
        data = request.get_json()
        season = data.get('season', 'kharif')
        region = data.get('region', 'Maharashtra')
        soil_type = data.get('soil_type', 'black_cotton')
        
        # This would typically call your ML model for crop suggestions
        # For now, returning dynamic suggestions based on season
        suggestions = generate_crop_suggestions(season, region, soil_type)
        
        return jsonify({
            "suggestions": suggestions,
            "season": season,
            "region": region,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error generating crop suggestions: {str(e)}")
        return jsonify({"error": "Failed to generate suggestions"}), 500

@app.route('/api/demand-alerts', methods=['GET'])
def get_demand_alerts():
    """Get real-time demand alerts for various crops"""
    try:
        # This would typically fetch from a real-time database or external API
        alerts = generate_demand_alerts()
        
        return jsonify({
            "alerts": alerts,
            "last_updated": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error fetching demand alerts: {str(e)}")
        return jsonify({"error": "Failed to fetch demand alerts"}), 500

@app.route('/api/market-stats', methods=['GET'])
def get_market_stats():
    """Get real-time market statistics"""
    try:
        # Simulate real-time stats - replace with actual data source
        stats = {
            "priceRise": f"{random.randint(8, 15)}%",
            "highDemand": f"{random.randint(40, 60)}%",
            "bestSeason": "30d",
            "activeFarmers": f"{random.randint(80, 95)}%",
            "totalTransactions": f"{random.randint(1000, 5000)}",
            "marketSentiment": "positive"
        }
        
        return jsonify({
            "stats": stats,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error fetching market stats: {str(e)}")
        return jsonify({"error": "Failed to fetch market stats"}), 500

@app.route('/api/analyze-crop-health', methods=['POST'])
def analyze_crop_health():
    """Analyze crop health from uploaded image"""
    try:
        if 'crop_image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        image_file = request.files['crop_image']
        
        # Here you would integrate with your computer vision model
        # For now, returning mock analysis
        analysis = {
            "health_score": random.randint(75, 95),
            "disease_detected": random.choice([None, "leaf_rust", "powdery_mildew"]),
            "nutrient_deficiency": random.choice([None, "nitrogen", "potassium"]),
            "recommendations": [
                "Crop is in good health",
                "Consider adding organic fertilizer",
                "Monitor for pest activity"
            ]
        }
        
        return jsonify({
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error analyzing crop health: {str(e)}")
        return jsonify({"error": "Failed to analyze crop image"}), 500

def generate_crop_suggestions(season, region, soil_type):
    """Generate crop suggestions based on parameters"""
    base_suggestions = [
        {
            "id": 1,
            "name": "Moong Dal (Green Gram)",
            "confidence": random.randint(85, 96),
            "priceTrend": "high",
            "expectedIncome": f"₹{random.randint(6000, 7000)}/quintal",
            "harvestTime": "60 days",
            "description": "High demand in urban markets, low water requirement",
            "suitability": "Perfect for your region's soil type",
            "risk": "Low",
            "image": "🌱"
        },
        {
            "id": 2,
            "name": "Mustard",
            "confidence": random.randint(80, 92),
            "priceTrend": "medium",
            "expectedIncome": f"₹{random.randint(4000, 5000)}/quintal",
            "harvestTime": "120 days",
            "description": "Low rainfall crop, good for oil production",
            "suitability": "Ideal for current season",
            "risk": "Medium",
            "image": "🟡"
        },
        {
            "id": 3,
            "name": "Chickpea",
            "confidence": random.randint(82, 90),
            "priceTrend": "high",
            "expectedIncome": f"₹{random.randint(5000, 6000)}/quintal",
            "harvestTime": "90 days",
            "description": "Fast harvesting, high nutritional value",
            "suitability": "Matches your farm size",
            "risk": "Low",
            "image": "🟤"
        }
    ]
    
    # Adjust based on season
    if season == 'kharif':
        base_suggestions[0]['confidence'] += 5
    elif season == 'rabi':
        base_suggestions[1]['confidence'] += 5
        
    return base_suggestions

def generate_demand_alerts():
    """Generate realistic demand alerts"""
    crops = ["Tomato", "Onion", "Wheat", "Rice", "Cotton", "Sugarcane"]
    locations = ["Pune", "Nashik", "Aurangabad", "Nagpur", "Kolhapur"]
    
    alerts = []
    for i in range(4):
        crop = random.choice(crops)
        alerts.append({
            "id": i + 1,
            "crop": crop,
            "location": random.choice(locations),
            "demand": random.choice(["high", "medium", "low"]),
            "price": f"₹{random.randint(20, 50)}/kg" if crop in ['Tomato', 'Onion'] else f"₹{random.randint(2000, 5000)}/quintal",
            "trend": random.choice(["up", "stable", "up"])
        })
    
    return alerts

if __name__ == '__main__':
    print(f"\n🎯 Multi-Commodity Price Prediction API Ready!")
    print(f"🌾 Available commodities: {available_commodities}")
    print(f"📍 Total districts in database: {len(DISTRICT_TO_MARKETS)}")
    print(f"🏪 Available districts: {list(DISTRICT_TO_MARKETS.keys())}")
    print(f"🚀 Backend running on: http://127.0.0.1:5000")
    print(f"🌐 React app should connect from: http://localhost:3000")
    
    # Debug info for orange commodity
    if 'orange' in COMMODITY_DISTRICTS:
        print(f"🍊 Orange districts: {COMMODITY_DISTRICTS['orange']}")
    
    app.run(debug=True, port=5000)