import React, { useState, useEffect } from 'react';
import '../styles/FarmersDashboard.css';

const FarmersDashboard = () => {
  const [cropForm, setCropForm] = useState({
    cropName: '',
    quantity: '',
    expectedPrice: '',
    cropImage: null
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demandAlerts, setDemandAlerts] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Mock data for crop suggestions
  const cropSuggestions = [
    {
      id: 1,
      name: "Moong Dal (Green Gram)",
      confidence: 94,
      priceTrend: "high",
      expectedIncome: "₹6500/quintal",
      harvestTime: "60 days",
      description: "High demand in urban markets, low water requirement",
      suitability: "Perfect for your region's soil type",
      risk: "Low",
      image: "🌱"
    },
    {
      id: 2,
      name: "Mustard",
      confidence: 89,
      priceTrend: "medium",
      expectedIncome: "₹4200/quintal",
      harvestTime: "120 days",
      description: "Low rainfall crop, good for oil production",
      suitability: "Ideal for current season",
      risk: "Medium",
      image: "🟡"
    },
    {
      id: 3,
      name: "Chickpea",
      confidence: 87,
      priceTrend: "high",
      expectedIncome: "₹5500/quintal",
      harvestTime: "90 days",
      description: "Fast harvesting, high nutritional value",
      suitability: "Matches your farm size",
      risk: "Low",
      image: "🟤"
    }
  ];

  // Mock demand alerts
  const mockDemandAlerts = [
    {
      id: 1,
      crop: "Tomato",
      location: "Pune",
      demand: "high",
      price: "₹45/kg",
      trend: "up"
    },
    {
      id: 2,
      crop: "Onion",
      location: "Nashik",
      demand: "medium",
      price: "₹32/kg",
      trend: "stable"
    },
    {
      id: 3,
      crop: "Wheat",
      location: "Aurangabad",
      demand: "high",
      price: "₹2200/quintal",
      trend: "up"
    }
  ];

  useEffect(() => {
    // Simulate loading demand alerts
    setDemandAlerts(mockDemandAlerts);
  }, []);

  const handleInputChange = (field, value) => {
    setCropForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCropForm(prev => ({
        ...prev,
        cropImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleCropPrediction = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setPredictionResult({
        predictedPrice: "₹42/kg",
        crop: cropForm.cropName || "Tomato",
        marketAverage: "₹38/kg",
        profitPotential: "+10.5%",
        confidence: "92%",
        recommendation: "Good time to sell in Pune market"
      });
      setLoading(false);
    }, 2000);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'high': return '📈';
      case 'medium': return '➡️';
      case 'low': return '📉';
      default: return '📊';
    }
  };

  const getDemandBadge = (demand) => {
    switch (demand) {
      case 'high': return { class: 'demand-high', text: 'High Demand' };
      case 'medium': return { class: 'demand-medium', text: 'Medium Demand' };
      case 'low': return { class: 'demand-low', text: 'Low Demand' };
      default: return { class: 'demand-medium', text: 'Medium Demand' };
    }
  };

  return (
    <div className="farmers-dashboard">
      {/* Bootstrap CSS CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />

      <div className="container-fluid">
        {/* Dashboard Header */}
        <div className="dashboard-header text-center mb-5">
          <h1 className="display-4 fw-bold text-success">
            <i className="bi bi-person-badge me-3"></i>
            Farmer's Dashboard
          </h1>
          <p className="lead text-muted fst-italic">
            "Every market under our watch — so you get the right price"
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-xxl-10">
            {/* AI Crop Prediction Card - TOP */}
            <div className="card prediction-card shadow-lg border-0 rounded-4 mb-5">
              <div className="card-header bg-transparent border-bottom-0 py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h3 mb-0 text-success">
                    <i className="bi bi-robot me-2"></i>
                    AI Active
                  </h2>
                  <span className="badge bg-primary bg-gradient fs-6 px-3 py-2">
                    <i className="bi bi-lightning-charge me-1"></i>
                    Live Prediction
                  </span>
                </div>
              </div>

              <div className="card-body">
                <form onSubmit={handleCropPrediction}>
                  <h4 className="mb-4 text-dark fw-bold">
                    <i className="bi bi-upload me-2"></i>
                    Upload Crop Details
                  </h4>

                  <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                      {/* Crop Name */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark fs-6">
                          <i className="bi bi-tree me-2 text-success"></i>
                          Crop Name
                        </label>
                        <select
                          className="form-select form-select-lg border-2 shadow-sm"
                          value={cropForm.cropName}
                          onChange={(e) => handleInputChange('cropName', e.target.value)}
                          required
                        >
                          <option value="">Select Crop Type</option>
                          <option value="tomato">Tomato</option>
                          <option value="wheat">Wheat</option>
                          <option value="rice">Rice</option>
                          <option value="cotton">Cotton</option>
                          <option value="sugarcane">Sugarcane</option>
                          <option value="moong">Moong Dal</option>
                          <option value="mustard">Mustard</option>
                          <option value="chickpea">Chickpea</option>
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark fs-6">
                          <i className="bi bi-scale me-2 text-success"></i>
                          Quantity
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 shadow-sm"
                          placeholder="e.g., 100 kg or 5 quintal"
                          value={cropForm.quantity}
                          onChange={(e) => handleInputChange('quantity', e.target.value)}
                          required
                        />
                        <div className="form-text text-muted small">
                          Enter quantity in kilograms (kg) or quintals as per your measurement
                        </div>
                      </div>

                      {/* Expected Price */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark fs-6">
                          <i className="bi bi-currency-rupee me-2 text-success"></i>
                          Expected Price
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 shadow-sm"
                          placeholder="e.g., ₹40/kg or ₹4000/quintal"
                          value={cropForm.expectedPrice}
                          onChange={(e) => handleInputChange('expectedPrice', e.target.value)}
                          required
                        />
                        <div className="form-text text-muted small">
                          Enter your expected selling price per unit
                        </div>
                      </div>

                      {/* Crop Photo Upload */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark fs-6">
                          <i className="bi bi-image me-2 text-success"></i>
                          Crop Photo
                        </label>
                        <div className="image-upload-container">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="image-upload-input"
                            id="cropImageUpload"
                          />
                          <label htmlFor="cropImageUpload" className="image-upload-preview w-100">
                            {cropForm.cropImage ? (
                              <div className="position-relative">
                                <img
                                  src={cropForm.cropImage}
                                  alt="Crop preview"
                                  className="img-fluid rounded shadow-sm w-100"
                                  style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="position-absolute top-0 end-0 m-2">
                                  <span className="badge bg-success px-3 py-2">
                                    <i className="bi bi-check-lg me-1"></i>
                                    Uploaded
                                  </span>
                                </div>
                                <div className="position-absolute bottom-0 start-0 m-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-light"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCropForm(prev => ({ ...prev, cropImage: null }));
                                    }}
                                  >
                                    <i className="bi bi-trash me-1"></i>
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="upload-placeholder text-center py-5 border-2 border-dashed rounded-3 bg-light">
                                <i className="bi bi-cloud-arrow-up display-4 text-muted d-block mb-3"></i>
                                <p className="text-muted mb-2 fw-semibold">Click to upload crop image</p>
                                <p className="text-muted small mb-0">Supports JPG, PNG, WEBP (Max 5MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                        <div className="form-text text-muted small mt-2">
                          Upload a clear photo of your crop for better analysis
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-success btn-lg px-5 py-3 fw-bold w-100"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              <span className="fs-6">AI is analyzing your crop...</span>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-magic me-2"></i>
                              <span className="fs-6">Get AI Price Prediction</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Prediction Results - Single Section */}
                {predictionResult && (
                  <div className="row justify-content-center mt-4">
                    <div className="col-12">
                      <div className="prediction-results p-4 bg-light rounded-3 border-start border-4 border-success">
                        <h4 className="text-dark mb-3 fw-bold text-center">
                          <i className="bi bi-graph-up-arrow me-2 text-success"></i>
                          AI Price Prediction
                        </h4>

                        <div className="text-center mb-4">
                          <div className="prediction-price display-4 fw-bold text-success mb-2">
                            {predictionResult.predictedPrice}
                          </div>
                          <p className="prediction-crop text-muted fs-5">
                            Suggested price for <strong>{predictionResult.crop}</strong>
                          </p>
                        </div>

                        <div className="row g-3 mb-4">
                          <div className="col-12 col-md-4">
                            <div className="text-center p-3 bg-white rounded-3 border">
                              <i className="bi bi-shop fs-2 text-primary mb-2 d-block"></i>
                              <div className="stat-label text-muted small">Market Average</div>
                              <div className="stat-value fw-bold fs-5">{predictionResult.marketAverage}</div>
                            </div>
                          </div>
                          <div className="col-12 col-md-4">
                            <div className="text-center p-3 bg-white rounded-3 border">
                              <i className="bi bi-arrow-up-right fs-2 text-success mb-2 d-block"></i>
                              <div className="stat-label text-muted small">Profit Potential</div>
                              <div className="stat-value fw-bold fs-5 text-success">{predictionResult.profitPotential}</div>
                            </div>
                          </div>
                          <div className="col-12 col-md-4">
                            <div className="text-center p-3 bg-white rounded-3 border">
                              <i className="bi bi-shield-check fs-2 text-danger mb-2 d-block"></i>
                              <div className="stat-label text-muted small">AI Confidence</div>
                              <div className="stat-value fw-bold fs-5 text-danger">{predictionResult.confidence}</div>
                            </div>
                          </div>
                        </div>

                        <div className="recommendation alert alert-success border-0 text-center">
                          <div className="d-flex align-items-center justify-content-center">
                            <i className="bi bi-lightbulb fs-4 text-warning me-2"></i>
                            <div>
                              <strong className="d-block">Expert Recommendation</strong>
                              <span className="small">{predictionResult.recommendation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Crop Suggestions & Demand Alerts */}
            <div className="row g-4">
              {/* Crop Suggestions - Main Content */}
              <div className="col-12 col-lg-8">
                <div className="card suggestions-card shadow-lg border-0 rounded-4 h-100">
                  <div className="card-header bg-transparent border-bottom-0 py-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h2 className="h3 mb-1 text-success">
                          <i className="bi bi-seedling me-2"></i>
                          Smart Crop Suggestions
                        </h2>
                        <p className="text-muted mb-0 fst-italic small">
                          "Now farmers themselves will decide what to sow, and how much to earn"
                        </p>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success border border-success">
                        {cropSuggestions.length} Options
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="row g-4">
                      {cropSuggestions.map(crop => (
                        <div key={crop.id} className="col-12 col-md-6 col-xl-4">
                          <div
                            className={`crop-suggestion-card card h-100 border-hover transition-all ${
                              selectedCrop?.id === crop.id ? 'border-success selected-crop' : ''
                            }`}
                            onClick={() => setSelectedCrop(crop)}
                          >
                            <div className="card-body d-flex flex-column">
                              {/* Header */}
                              <div className="d-flex align-items-center mb-3">
                                <div className="crop-icon me-3">
                                  <div className="display-6">{crop.image}</div>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="card-title mb-1 fw-bold text-dark">{crop.name}</h6>
                                  <span className={`badge ${
                                    crop.confidence > 90 ? 'bg-success' : 'bg-warning'
                                  }`}>
                                    {crop.confidence}% Match
                                  </span>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className="text-muted">Income</small>
                                  <strong className="text-success">{crop.expectedIncome}</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className="text-muted">Harvest</small>
                                  <strong>{crop.harvestTime}</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">Trend</small>
                                  <span className={`badge ${
                                    crop.priceTrend === 'high' ? 'bg-danger' : 'bg-warning'
                                  }`}>
                                    {getTrendIcon(crop.priceTrend)} {crop.priceTrend}
                                  </span>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="card-text text-muted small flex-grow-1">
                                {crop.description}
                              </p>

                              {/* Tags */}
                              <div className="d-flex flex-wrap gap-1 mb-3">
                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                                  <i className="bi bi-check-circle me-1"></i>
                                  {crop.suitability.split(' ')[0]}
                                </span>
                                <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">
                                  <i className="bi bi-shield-check me-1"></i>
                                  {crop.risk} Risk
                                </span>
                              </div>

                              <button className="btn btn-outline-primary btn-sm w-100">
                                <i className="bi bi-eye me-1"></i>
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Demand Alerts & Quick Stats */}
              <div className="col-12 col-lg-4">
                {/* Demand Alerts Card */}
                <div className="card alerts-card shadow-lg border-0 rounded-4 mb-4">
                  <div className="card-header bg-transparent border-bottom-0 py-4">
                    <h3 className="h5 mb-0 text-success">
                      <i className="bi bi-bell-fill me-2"></i>
                      Demand Alerts
                    </h3>
                    <small className="text-muted">Real-time market updates</small>
                  </div>

                  <div className="card-body">
                    <div className="demand-alerts-list">
                      {demandAlerts.map(alert => {
                        const demandBadge = getDemandBadge(alert.demand);
                        return (
                          <div key={alert.id} className="demand-alert-item card border-0 bg-light mb-3 transition-all">
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1 fw-bold text-dark">{alert.crop}</h6>
                                  <small className="text-muted">
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {alert.location}
                                  </small>
                                </div>
                                <span className={`badge ${
                                  alert.demand === 'high' ? 'bg-success' : 
                                  alert.demand === 'medium' ? 'bg-warning' : 'bg-danger'
                                }`}>
                                  {demandBadge.text}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-success fs-6">{alert.price}</span>
                                <span className={`fs-5 ${
                                  alert.trend === 'up' ? 'text-success' : 'text-muted'
                                }`}>
                                  {alert.trend === 'up' ? '📈' : '➡️'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button className="btn btn-outline-success w-100 mt-3">
                      <i className="bi bi-arrow-right me-2"></i>
                      View All Alerts
                    </button>
                  </div>
                </div>

                {/* Quick Stats Card */}
                <div className="card stats-card shadow-lg border-0 rounded-4">
                  <div className="card-header bg-transparent border-bottom-0 py-4">
                    <h3 className="h5 mb-0 text-success">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Market Overview
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row text-center g-3">
                      <div className="col-6">
                        <div className="p-3 bg-success bg-opacity-10 rounded-3">
                          <i className="bi bi-arrow-up-circle fs-4 text-success d-block mb-2"></i>
                          <div className="fw-bold text-dark">12%</div>
                          <small className="text-muted">Price Rise</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-warning bg-opacity-10 rounded-3">
                          <i className="bi bi-graph-up-arrow fs-4 text-warning d-block mb-2"></i>
                          <div className="fw-bold text-dark">45%</div>
                          <small className="text-muted">High Demand</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-info bg-opacity-10 rounded-3">
                          <i className="bi bi-calendar-check fs-4 text-info d-block mb-2"></i>
                          <div className="fw-bold text-dark">30d</div>
                          <small className="text-muted">Best Season</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-primary bg-opacity-10 rounded-3">
                          <i className="bi bi-people fs-4 text-primary d-block mb-2"></i>
                          <div className="fw-bold text-dark">85%</div>
                          <small className="text-muted">Farmers Active</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Crop Details Modal */}
        {selectedCrop && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header bg-success text-white border-0 rounded-top-4">
                  <h5 className="modal-title">
                    <i className="bi bi-info-circle me-2"></i>
                    {selectedCrop.name} - Detailed Analysis
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedCrop(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title text-success">
                            <i className="bi bi-graph-up me-2"></i>
                            Market Analysis
                          </h6>
                          <p className="card-text text-muted">
                            Current market conditions favor {selectedCrop.name} due to increasing demand in urban areas.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title text-success">
                            <i className="bi bi-cloud-sun me-2"></i>
                            Weather Suitability
                          </h6>
                          <p className="card-text text-muted">
                            Perfect for current monsoon patterns in Maharashtra.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title text-success">
                            <i className="bi bi-cash-coin me-2"></i>
                            Investment Required
                          </h6>
                          <p className="card-text text-muted">
                            Approximately ₹15,000 per acre for seeds and fertilizers.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title text-success">
                            <i className="bi bi-shop me-2"></i>
                            Market Channels
                          </h6>
                          <p className="card-text text-muted">
                            Direct to retailers in Pune and Mumbai markets available.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 rounded-bottom-4">
                  <button className="btn btn-success me-2">
                    <i className="bi bi-clipboard-check me-2"></i>
                    Create Farming Plan
                  </button>
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-telephone me-2"></i>
                    Connect with Experts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bootstrap JS CDN */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default FarmersDashboard;