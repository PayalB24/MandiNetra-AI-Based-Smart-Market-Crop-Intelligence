import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/FarmersDashboard.css';

const FarmersDashboard = () => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' }
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

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
      name: t('crops.moong'),
      confidence: 94,
      priceTrend: "high",
      expectedIncome: "₹6500/quintal",
      harvestTime: t('dashboard.harvestTime', { days: 60 }),
      description: t('cropDescriptions.moong'),
      suitability: t('suitability.perfect'),
      risk: t('common.low'),
      image: "🌱"
    },
    {
      id: 2,
      name: t('crops.mustard'),
      confidence: 89,
      priceTrend: "medium",
      expectedIncome: "₹4200/quintal",
      harvestTime: t('dashboard.harvestTime', { days: 120 }),
      description: t('cropDescriptions.mustard'),
      suitability: t('suitability.ideal'),
      risk: t('common.medium'),
      image: "🟡"
    },
    {
      id: 3,
      name: t('crops.chickpea'),
      confidence: 87,
      priceTrend: "high",
      expectedIncome: "₹5500/quintal",
      harvestTime: t('dashboard.harvestTime', { days: 90 }),
      description: t('cropDescriptions.chickpea'),
      suitability: t('suitability.matches'),
      risk: t('common.low'),
      image: "🟤"
    }
  ];

  // Mock demand alerts
  const mockDemandAlerts = [
    {
      id: 1,
      crop: t('crops.tomato'),
      location: "Pune",
      demand: "high",
      price: "₹45/kg",
      trend: "up"
    },
    {
      id: 2,
      crop: t('crops.onion'),
      location: "Nashik",
      demand: "medium",
      price: "₹32/kg",
      trend: "stable"
    },
    {
      id: 3,
      crop: t('crops.wheat'),
      location: "Aurangabad",
      demand: "high",
      price: "₹2200/quintal",
      trend: "up"
    }
  ];

  useEffect(() => {
    // Simulate loading demand alerts
    setDemandAlerts(mockDemandAlerts);
  }, [t]);

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
        crop: cropForm.cropName || t('crops.tomato'),
        marketAverage: "₹38/kg",
        profitPotential: "+10.5%",
        confidence: "92%",
        recommendation: t('prediction.recommendation')
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
      case 'high': return { class: 'demand-high', text: t('demand.high') };
      case 'medium': return { class: 'demand-medium', text: t('demand.medium') };
      case 'low': return { class: 'demand-low', text: t('demand.low') };
      default: return { class: 'demand-medium', text: t('demand.medium') };
    }
  };

  return (
    <div className="farmers-dashboard">
      {/* Language Switcher */}
      <div className="dashboard-language-switcher position-fixed top-0 end-0 m-3 z-3">
        <div className="dropdown">
          <button 
            className="btn btn-outline-success btn-sm dropdown-toggle d-flex align-items-center gap-2 language-switcher-btn"
            type="button" 
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="language-flag fs-6">{getCurrentLanguage().flag}</span>
            <span className="language-text d-none d-sm-inline">
              {getCurrentLanguage().nativeName}
            </span>
            <i className="bi bi-chevron-down small"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  className={`dropdown-item d-flex align-items-center gap-3 py-2 px-3 ${
                    i18n.language === lang.code ? 'active-language' : ''
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className="language-flag fs-5">{lang.flag}</span>
                  <div className="d-flex flex-column text-start">
                    <span className="fw-semibold">{lang.nativeName}</span>
                    <small className="text-muted">{lang.name}</small>
                  </div>
                  {i18n.language === lang.code && (
                    <i className="bi bi-check-lg text-success ms-auto fs-6"></i>
                  )}
                </button>
                {lang.code !== languages[languages.length - 1].code && (
                  <hr className="dropdown-divider my-1" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-fluid">
        {/* Dashboard Header */}
        <div className="dashboard-header text-center mb-5">
          <h1 className="display-4 fw-bold text-success">
            <i className="bi bi-person-badge me-3"></i>
            {t('dashboard.title')}
          </h1>
          <p className="lead text-muted fst-italic">
            {t('dashboard.tagline')}
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
                    {t('dashboard.aiActive')}
                  </h2>
                  <span className="badge bg-primary bg-gradient fs-6 px-3 py-2">
                    <i className="bi bi-lightning-charge me-1"></i>
                    {t('dashboard.livePrediction')}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <form onSubmit={handleCropPrediction}>
                  <h4 className="mb-4 text-dark fw-bold">
                    <i className="bi bi-upload me-2"></i>
                    {t('dashboard.uploadCropDetails')}
                  </h4>

                  <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                      {/* Crop Name */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark fs-6">
                          <i className="bi bi-tree me-2 text-success"></i>
                          {t('dashboard.cropName')}
                        </label>
                        <select
                          className="form-select form-select-lg border-2 shadow-sm"
                          value={cropForm.cropName}
                          onChange={(e) => handleInputChange('cropName', e.target.value)}
                          required
                        >
                          <option value="">{t('dashboard.selectCropType')}</option>
                          <option value="tomato">{t('crops.tomato')}</option>
                          <option value="wheat">{t('crops.wheat')}</option>
                          <option value="rice">{t('crops.rice')}</option>
                          <option value="cotton">{t('crops.cotton')}</option>
                          <option value="sugarcane">{t('crops.sugarcane')}</option>
                          <option value="moong">{t('crops.moong')}</option>
                          <option value="mustard">{t('crops.mustard')}</option>
                          <option value="chickpea">{t('crops.chickpea')}</option>
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark fs-6">
                          <i className="bi bi-scale me-2 text-success"></i>
                          {t('dashboard.quantity')}
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 shadow-sm"
                          placeholder={t('dashboard.quantityPlaceholder')}
                          value={cropForm.quantity}
                          onChange={(e) => handleInputChange('quantity', e.target.value)}
                          required
                        />
                        <div className="form-text text-muted small">
                          {t('dashboard.quantityHelp')}
                        </div>
                      </div>

                      {/* Expected Price */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark fs-6">
                          <i className="bi bi-currency-rupee me-2 text-success"></i>
                          {t('dashboard.expectedPrice')}
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 shadow-sm"
                          placeholder={t('dashboard.pricePlaceholder')}
                          value={cropForm.expectedPrice}
                          onChange={(e) => handleInputChange('expectedPrice', e.target.value)}
                          required
                        />
                        <div className="form-text text-muted small">
                          {t('dashboard.priceHelp')}
                        </div>
                      </div>

                      {/* Crop Photo Upload */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark fs-6">
                          <i className="bi bi-image me-2 text-success"></i>
                          {t('dashboard.cropPhoto')}
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
                                    {t('common.uploaded')}
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
                                    {t('common.remove')}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="upload-placeholder text-center py-5 border-2 border-dashed rounded-3 bg-light">
                                <i className="bi bi-cloud-arrow-up display-4 text-muted d-block mb-3"></i>
                                <p className="text-muted mb-2 fw-semibold">{t('dashboard.uploadHelp')}</p>
                                <p className="text-muted small mb-0">{t('dashboard.uploadSupport')}</p>
                              </div>
                            )}
                          </label>
                        </div>
                        <div className="form-text text-muted small mt-2">
                          {t('dashboard.imageHelp')}
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
                              <span className="fs-6">{t('dashboard.analyzing')}</span>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-magic me-2"></i>
                              <span className="fs-6">{t('dashboard.getPrediction')}</span>
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
                          {t('dashboard.predictionResults')}
                        </h4>

                        <div className="text-center mb-4">
                          <div className="prediction-price display-4 fw-bold text-success mb-2">
                            {predictionResult.predictedPrice}
                          </div>
                          <p className="prediction-crop text-muted fs-5">
                            {t('prediction.suggestedPrice')} <strong>{predictionResult.crop}</strong>
                          </p>
                        </div>

                        <div className="row g-3 mb-4">
                          <div className="col-12 col-md-4">
                            <div className="text-center p-3 bg-white rounded-3 border">
                              <i className="bi bi-shop fs-2 text-primary mb-2 d-block"></i>
                              <div className="stat-label text-muted small">{t('prediction.marketAverage')}</div>
                              <div className="stat-value fw-bold fs-5">{predictionResult.marketAverage}</div>
                            </div>
                          </div>
                          <div className="col-12 col-md-4">
                            <div className="text-center p-3 bg-white rounded-3 border">
                              <i className="bi bi-arrow-up-right fs-2 text-success mb-2 d-block"></i>
                              <div className="stat-label text-muted small">{t('prediction.profitPotential')}</div>
                              <div className="stat-value fw-bold fs-5 text-success">{predictionResult.profitPotential}</div>
                            </div>
                          </div>
                          <div className="col-12 col-md-4">
                            <div className="text-center p-3 bg-white rounded-3 border">
                              <i className="bi bi-shield-check fs-2 text-danger mb-2 d-block"></i>
                              <div className="stat-label text-muted small">{t('prediction.aiConfidence')}</div>
                              <div className="stat-value fw-bold fs-5 text-danger">{predictionResult.confidence}</div>
                            </div>
                          </div>
                        </div>

                        <div className="recommendation alert alert-success border-0 text-center">
                          <div className="d-flex align-items-center justify-content-center">
                            <i className="bi bi-lightbulb fs-4 text-warning me-2"></i>
                            <div>
                              <strong className="d-block">{t('prediction.expertRecommendation')}</strong>
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
                          {t('suggestions.title')}
                        </h2>
                        <p className="text-muted mb-0 fst-italic small">
                          {t('suggestions.tagline')}
                        </p>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success border border-success">
                        {cropSuggestions.length} {t('suggestions.options')}
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
                                    {crop.confidence}% {t('common.match')}
                                  </span>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className="text-muted">{t('dashboard.income')}</small>
                                  <strong className="text-success">{crop.expectedIncome}</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className="text-muted">{t('dashboard.harvest')}</small>
                                  <strong>{crop.harvestTime}</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">{t('dashboard.trend')}</small>
                                  <span className={`badge ${
                                    crop.priceTrend === 'high' ? 'bg-danger' : 'bg-warning'
                                  }`}>
                                    {getTrendIcon(crop.priceTrend)} {t(`common.${crop.priceTrend}`)}
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
                                  {crop.suitability}
                                </span>
                                <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">
                                  <i className="bi bi-shield-check me-1"></i>
                                  {crop.risk} {t('common.risk')}
                                </span>
                              </div>

                              <button className="btn btn-outline-primary btn-sm w-100">
                                <i className="bi bi-eye me-1"></i>
                                {t('common.viewDetails')}
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
                      {t('alerts.title')}
                    </h3>
                    <small className="text-muted">{t('alerts.realTimeUpdates')}</small>
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
                      {t('alerts.viewAll')}
                    </button>
                  </div>
                </div>

                {/* Quick Stats Card */}
                <div className="card stats-card shadow-lg border-0 rounded-4">
                  <div className="card-header bg-transparent border-bottom-0 py-4">
                    <h3 className="h5 mb-0 text-success">
                      <i className="bi bi-speedometer2 me-2"></i>
                      {t('stats.marketOverview')}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row text-center g-3">
                      <div className="col-6">
                        <div className="p-3 bg-success bg-opacity-10 rounded-3">
                          <i className="bi bi-arrow-up-circle fs-4 text-success d-block mb-2"></i>
                          <div className="fw-bold text-dark">12%</div>
                          <small className="text-muted">{t('stats.priceRise')}</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-warning bg-opacity-10 rounded-3">
                          <i className="bi bi-graph-up-arrow fs-4 text-warning d-block mb-2"></i>
                          <div className="fw-bold text-dark">45%</div>
                          <small className="text-muted">{t('stats.highDemand')}</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-info bg-opacity-10 rounded-3">
                          <i className="bi bi-calendar-check fs-4 text-info d-block mb-2"></i>
                          <div className="fw-bold text-dark">30d</div>
                          <small className="text-muted">{t('stats.bestSeason')}</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-primary bg-opacity-10 rounded-3">
                          <i className="bi bi-people fs-4 text-primary d-block mb-2"></i>
                          <div className="fw-bold text-dark">85%</div>
                          <small className="text-muted">{t('stats.farmersActive')}</small>
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
                    {selectedCrop.name} - {t('common.detailedAnalysis')}
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
                            {t('modal.marketAnalysis')}
                          </h6>
                          <p className="card-text text-muted">
                            {t('modal.marketAnalysisText', { crop: selectedCrop.name })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title text-success">
                            <i className="bi bi-cloud-sun me-2"></i>
                            {t('modal.weatherSuitability')}
                          </h6>
                          <p className="card-text text-muted">
                            {t('modal.weatherSuitabilityText')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title text-success">
                            <i className="bi bi-cash-coin me-2"></i>
                            {t('modal.investmentRequired')}
                          </h6>
                          <p className="card-text text-muted">
                            {t('modal.investmentRequiredText')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title text-success">
                            <i className="bi bi-shop me-2"></i>
                            {t('modal.marketChannels')}
                          </h6>
                          <p className="card-text text-muted">
                            {t('modal.marketChannelsText')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 rounded-bottom-4">
                  <button className="btn btn-success me-2">
                    <i className="bi bi-clipboard-check me-2"></i>
                    {t('modal.createFarmingPlan')}
                  </button>
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-telephone me-2"></i>
                    {t('modal.connectWithExperts')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default FarmersDashboard;