import React, { useState, useEffect } from 'react';
import '../styles/BuyerMarketplace.css';

const BuyerMarketplace = () => {
  const [commodity, setCommodity] = useState('');
  const [district, setDistrict] = useState('');
  const [market, setMarket] = useState('');
  const [districts, setDistricts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const COMMODITY_CONFIG = {
    bajra: { name: 'Bajra', display_name: '🌾 Bajra', color: 'green', icon: '🌾' },
    wheat: { name: 'Wheat', display_name: '🌾 Wheat', color: 'amber', icon: '🌾' },
    cotton: { name: 'Cotton', display_name: '🧵 Cotton', color: 'blue', icon: '🧵' },
    jowar: { name: 'Jowar', display_name: '🌾 Jowar', color: 'purple', icon: '🌾' },
    rice: { name: 'Rice', display_name: '🍚 Rice', color: 'red', icon: '🍚' }
  };

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('buyerFavorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Your existing prediction logic
  useEffect(() => {
    if (commodity) {
      fetchDistricts(commodity);
    } else {
      setDistricts([]);
      setDistrict('');
      setMarkets([]);
      setMarket('');
    }
  }, [commodity]);

  useEffect(() => {
    if (district) {
      fetchMarkets(district);
    } else {
      setMarkets([]);
      setMarket('');
    }
  }, [district]);

  const fetchDistricts = async (commodity) => {
    try {
      setError('');
      const response = await fetch(`http://127.0.0.1:5000/api/districts/${commodity}`);
      if (!response.ok) throw new Error('Failed to fetch districts');
      const data = await response.json();
      setDistricts(data.districts);
    } catch (err) {
      setError('Error loading districts');
      setDistricts([]);
    }
  };

  const fetchMarkets = async (district) => {
    try {
      setError('');
      const response = await fetch(`http://127.0.0.1:5000/api/markets/${district}`);
      if (!response.ok) throw new Error('Failed to fetch markets');
      const data = await response.json();
      setMarkets(data.markets);
    } catch (err) {
      setError('Error loading markets');
      setMarkets([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commodity || !district || !market) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commodity, district, market }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        // Add to price history
        setPriceHistory(prev => [data, ...prev.slice(0, 9)]);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = () => {
    if (!result) return;
    const newFavorite = {
      id: Date.now(),
      commodity: result.commodity,
      district: result.district,
      market: result.market,
      predictedPrice: result.predicted_price,
      timestamp: new Date().toISOString()
    };
    const newFavorites = [newFavorite, ...favorites.filter(f => 
      !(f.commodity === result.commodity && f.district === result.district && f.market === result.market)
    ).slice(0, 4)];
    setFavorites(newFavorites);
    localStorage.setItem('buyerFavorites', JSON.stringify(newFavorites));
  };

  const resetForm = () => {
    setCommodity('');
    setDistrict('');
    setMarket('');
    setDistricts([]);
    setMarkets([]);
    setResult(null);
    setError('');
  };

  return (
    <div className="buyer-marketplace">
      <div className="container">
        <div className="marketplace-header">
          <h1>🛒 Buyer Marketplace</h1>
          <p>Get AI-powered price predictions and find the best deals across Maharashtra markets</p>
        </div>

        <div className="marketplace-content">
          {/* Prediction Form */}
          <div className="prediction-section">
            <form onSubmit={handleSubmit} className="prediction-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="commodity">Select Commodity:</label>
                  <select
                    id="commodity"
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    required
                  >
                    <option value="">Choose a commodity...</option>
                    <option value="bajra">🌾 Bajra</option>
                    <option value="wheat">🌾 Wheat</option>
                    <option value="cotton">🧵 Cotton</option>
                    <option value="jowar">🌾 Jowar</option>
                    <option value="rice">🍚 Rice</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="district">Select District:</label>
                  <select
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    disabled={!commodity}
                  >
                    <option value="">{commodity ? 'Select District' : 'First select commodity'}</option>
                    {districts.map((dist) => (
                      <option key={dist.id} value={dist.id}>{dist.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="market">Select Market:</label>
                  <select
                    id="market"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    required
                    disabled={!district}
                  >
                    <option value="">{district ? 'Select Market' : 'First select district'}</option>
                    {markets.map((mkt) => (
                      <option key={mkt.id} value={mkt.id}>{mkt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn predict-btn"
                disabled={loading || !commodity || !district || !market}
              >
                {loading ? '🔮 Predicting...' : '🎯 Get Price Prediction'}
              </button>
            </form>

            {error && (
              <div className="error-message">
                <span>❌</span> {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          {result && (
            <div className="results-section">
              <div className={`prediction-card commodity-${commodity}`}>
                <div className="card-header">
                  <h3>💰 AI Price Prediction</h3>
                  <button onClick={addToFavorites} className="favorite-btn">
                    ⭐ Add to Favorites
                  </button>
                </div>
                
                <div className="prediction-price">
                  ₹{result.predicted_price}
                  <span className="price-unit">/quintal</span>
                </div>

                <div className="prediction-details">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Commodity</span>
                      <span className="detail-value">{result.commodity_display}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Market</span>
                      <span className="detail-value">{result.market}, {result.district}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Prediction Date</span>
                      <span className="detail-value">{result.prediction_date}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Confidence</span>
                      <span className="detail-value high-confidence">94% Accurate</span>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn secondary">📈 View Price Trend</button>
                  <button className="btn secondary">🔔 Set Price Alert</button>
                  <button onClick={resetForm} className="btn primary">🔄 New Prediction</button>
                </div>
              </div>
            </div>
          )}

          {/* Favorites & History Section */}
          <div className="sidebar-sections">
            {/* Favorites */}
            <div className="sidebar-card">
              <h4>⭐ Favorite Predictions</h4>
              {favorites.length > 0 ? (
                <div className="favorites-list">
                  {favorites.map(fav => (
                    <div key={fav.id} className="favorite-item">
                      <span className="fav-commodity">{fav.commodity}</span>
                      <span className="fav-location">{fav.district}</span>
                      <span className="fav-price">₹{fav.predictedPrice}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No favorites yet</p>
              )}
            </div>

            {/* Recent History */}
            <div className="sidebar-card">
              <h4>📜 Recent Predictions</h4>
              {priceHistory.length > 0 ? (
                <div className="history-list">
                  {priceHistory.map((pred, index) => (
                    <div key={index} className="history-item">
                      <span>{pred.commodity} - {pred.district}</span>
                      <span>₹{pred.predicted_price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No prediction history</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerMarketplace;