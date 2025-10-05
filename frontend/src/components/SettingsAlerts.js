import React, { useState, useEffect } from 'react';
import '../styles/SettingsAlerts.css';

const SettingsAlerts = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [userSettings, setUserSettings] = useState({
    language: 'english',
    theme: 'light',
    notifications: true,
    priceAlerts: true,
    marketUpdates: true,
    smsAlerts: false,
    emailAlerts: true,
    pushNotifications: true
  });
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    commodity: '',
    condition: 'above',
    targetPrice: '',
    district: 'all',
    frequency: 'instant'
  });
  const [userProfile, setUserProfile] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    userType: 'farmer',
    location: 'Pune, Maharashtra',
    farmSize: '5 acres',
    crops: ['Wheat', 'Tomato', 'Cotton']
  });

  const languages = [
    { code: 'english', name: 'English', native: 'English' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
    { code: 'marathi', name: 'Marathi', native: 'मराठी' },
    { code: 'gujarati', name: 'Gujarati', native: 'ગુજરાતી' }
  ];

  const commodities = [
    { id: 'wheat', name: '🌾 Wheat' },
    { id: 'rice', name: '🍚 Rice' },
    { id: 'cotton', name: '🧵 Cotton' },
    { id: 'bajra', name: '🌾 Bajra' },
    { id: 'jowar', name: '🌾 Jowar' },
    { id: 'tomato', name: '🍅 Tomato' },
    { id: 'onion', name: '🧅 Onion' },
    { id: 'potato', name: '🥔 Potato' }
  ];

  const districts = [
    { id: 'all', name: 'All Districts' },
    { id: 'pune', name: 'Pune' },
    { id: 'nashik', name: 'Nashik' },
    { id: 'nagpur', name: 'Nagpur' },
    { id: 'aurangabad', name: 'Aurangabad' },
    { id: 'amravati', name: 'Amravati' }
  ];

  const alertFrequencies = [
    { id: 'instant', name: 'Instant Alert' },
    { id: 'daily', name: 'Daily Summary' },
    { id: 'weekly', name: 'Weekly Report' }
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('priceAlerts');
    const savedSettings = localStorage.getItem('userSettings');
    
    if (savedAlerts) setPriceAlerts(JSON.parse(savedAlerts));
    if (savedSettings) setUserSettings(JSON.parse(savedSettings));
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  }, [userSettings]);

  const handleSettingChange = (key, value) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNewAlertChange = (field, value) => {
    setNewAlert(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPriceAlert = (e) => {
    e.preventDefault();
    
    if (!newAlert.commodity || !newAlert.targetPrice) {
      alert('Please fill all required fields');
      return;
    }

    const alert = {
      id: Date.now(),
      ...newAlert,
      created: new Date().toISOString(),
      active: true,
      triggered: false
    };

    const updatedAlerts = [alert, ...priceAlerts];
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
    
    setNewAlert({
      commodity: '',
      condition: 'above',
      targetPrice: '',
      district: 'all',
      frequency: 'instant'
    });

    alert('Price alert created successfully! 🎯');
  };

  const toggleAlert = (alertId) => {
    const updatedAlerts = priceAlerts.map(alert => 
      alert.id === alertId ? { ...alert, active: !alert.active } : alert
    );
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
  };

  const deleteAlert = (alertId) => {
    const updatedAlerts = priceAlerts.filter(alert => alert.id !== alertId);
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
  };

  const getCommodityName = (commodityId) => {
    const commodity = commodities.find(c => c.id === commodityId);
    return commodity ? commodity.name : commodityId;
  };

  const getDistrictName = (districtId) => {
    const district = districts.find(d => d.id === districtId);
    return district ? district.name : districtId;
  };

  const getFrequencyName = (frequencyId) => {
    const frequency = alertFrequencies.find(f => f.id === frequencyId);
    return frequency ? frequency.name : frequencyId;
  };

  return (
    <div className="settings-alerts">
      <div className="container">
        {/* Header */}
        <div className="settings-header">
          <h1>⚙️ Settings & Alerts</h1>
          <p>Manage your preferences and stay updated with smart price alerts</p>
        </div>

        {/* Settings Navigation */}
        <div className="settings-navigation">
          <button 
            className={`nav-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            🔔 Price Alerts
          </button>
          <button 
            className={`nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            📱 Notifications
          </button>
          <button 
            className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={`nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            🌐 Preferences
          </button>
        </div>

        {/* Content Area */}
        <div className="settings-content">
          {/* Price Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="tab-content">
              <div className="alerts-section">
                <div className="create-alert-card">
                  <h2>🎯 Create New Price Alert</h2>
                  <form onSubmit={addPriceAlert} className="alert-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Commodity</label>
                        <select
                          value={newAlert.commodity}
                          onChange={(e) => handleNewAlertChange('commodity', e.target.value)}
                          required
                        >
                          <option value="">Select Commodity</option>
                          {commodities.map(commodity => (
                            <option key={commodity.id} value={commodity.id}>
                              {commodity.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Condition</label>
                        <select
                          value={newAlert.condition}
                          onChange={(e) => handleNewAlertChange('condition', e.target.value)}
                        >
                          <option value="above">Price goes above</option>
                          <option value="below">Price goes below</option>
                          <option value="change">Price changes by</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Target Price (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g., 2500"
                          value={newAlert.targetPrice}
                          onChange={(e) => handleNewAlertChange('targetPrice', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>District</label>
                        <select
                          value={newAlert.district}
                          onChange={(e) => handleNewAlertChange('district', e.target.value)}
                        >
                          {districts.map(district => (
                            <option key={district.id} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Alert Frequency</label>
                        <select
                          value={newAlert.frequency}
                          onChange={(e) => handleNewAlertChange('frequency', e.target.value)}
                        >
                          {alertFrequencies.map(frequency => (
                            <option key={frequency.id} value={frequency.id}>
                              {frequency.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>&nbsp;</label>
                        <button type="submit" className="btn create-alert-btn">
                          ➕ Create Alert
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Active Alerts */}
                <div className="alerts-list-card">
                  <h2>📋 Your Active Alerts ({priceAlerts.filter(a => a.active).length})</h2>
                  
                  {priceAlerts.length > 0 ? (
                    <div className="alerts-list">
                      {priceAlerts.map(alert => (
                        <div key={alert.id} className={`alert-item ${alert.active ? 'active' : 'inactive'}`}>
                          <div className="alert-info">
                            <div className="alert-header">
                              <span className="commodity">{getCommodityName(alert.commodity)}</span>
                              <span className={`status ${alert.active ? 'active' : 'inactive'}`}>
                                {alert.active ? '🟢 Active' : '🔴 Inactive'}
                              </span>
                            </div>
                            <div className="alert-details">
                              <span className="condition">
                                Alert when price goes {alert.condition} ₹{alert.targetPrice}
                              </span>
                              <span className="location">📍 {getDistrictName(alert.district)}</span>
                              <span className="frequency">⏰ {getFrequencyName(alert.frequency)}</span>
                            </div>
                            <div className="alert-meta">
                              <span className="created">Created: {new Date(alert.created).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="alert-actions">
                            <button 
                              className={`btn toggle-btn ${alert.active ? 'deactivate' : 'activate'}`}
                              onClick={() => toggleAlert(alert.id)}
                            >
                              {alert.active ? '⏸️ Pause' : '▶️ Activate'}
                            </button>
                            <button 
                              className="btn delete-btn"
                              onClick={() => deleteAlert(alert.id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🔔</div>
                      <h3>No Price Alerts Yet</h3>
                      <p>Create your first price alert to get notified about market changes</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="tab-content">
              <div className="notifications-section">
                <div className="settings-card">
                  <h2>📱 Notification Preferences</h2>
                  <p className="card-description">
                    Choose how you want to receive updates and alerts from MandiNetra
                  </p>

                  <div className="notification-settings">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Push Notifications</h4>
                        <p>Receive instant alerts on your device</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={userSettings.pushNotifications}
                          onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Email Alerts</h4>
                        <p>Get detailed reports and summaries via email</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={userSettings.emailAlerts}
                          onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>SMS Alerts</h4>
                        <p>Important alerts via text message</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={userSettings.smsAlerts}
                          onChange={(e) => handleSettingChange('smsAlerts', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Price Alerts</h4>
                        <p>Notifications when prices hit your targets</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={userSettings.priceAlerts}
                          onChange={(e) => handleSettingChange('priceAlerts', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Market Updates</h4>
                        <p>Daily market trends and insights</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={userSettings.marketUpdates}
                          onChange={(e) => handleSettingChange('marketUpdates', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="notification-preview">
                    <h4>🔔 Preview</h4>
                    <div className="preview-card">
                      <div className="preview-header">
                        <span className="preview-title">Price Alert: Wheat</span>
                        <span className="preview-time">Just now</span>
                      </div>
                      <p className="preview-message">
                        Wheat price in Pune has reached your target of ₹2250/quintal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="profile-section">
                <div className="settings-card">
                  <h2>👤 User Profile</h2>
                  
                  <div className="profile-header">
                    <div className="avatar">👨‍🌾</div>
                    <div className="profile-info">
                      <h3>{userProfile.name}</h3>
                      <p className="user-type">{userProfile.userType}</p>
                      <p className="location">📍 {userProfile.location}</p>
                    </div>
                  </div>

                  <div className="profile-details">
                    <div className="detail-group">
                      <h4>Contact Information</h4>
                      <div className="detail-item">
                        <span className="label">📞 Phone</span>
                        <span className="value">{userProfile.phone}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">📧 Email</span>
                        <span className="value">{userProfile.email}</span>
                      </div>
                    </div>

                    <div className="detail-group">
                      <h4>Farm Details</h4>
                      <div className="detail-item">
                        <span className="label">🏞️ Farm Size</span>
                        <span className="value">{userProfile.farmSize}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">🌱 Main Crops</span>
                        <div className="crops-tags">
                          {userProfile.crops.map((crop, index) => (
                            <span key={index} className="crop-tag">{crop}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button className="btn primary">✏️ Edit Profile</button>
                    <button className="btn secondary">🔄 Update Farm Details</button>
                  </div>
                </div>

                <div className="stats-card">
                  <h3>📊 Your Activity</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-number">24</span>
                      <span className="stat-label">Price Checks</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">8</span>
                      <span className="stat-label">Active Alerts</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">15</span>
                      <span className="stat-label">Market Views</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">94%</span>
                      <span className="stat-label">Accuracy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="tab-content">
              <div className="preferences-section">
                <div className="settings-card">
                  <h2>🌐 App Preferences</h2>

                  <div className="preference-group">
                    <h4>Language & Region</h4>
                    <div className="preference-item">
                      <label>Language</label>
                      <select
                        value={userSettings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name} ({lang.native})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="preference-group">
                    <h4>Appearance</h4>
                    <div className="preference-item">
                      <label>Theme</label>
                      <div className="theme-options">
                        <label className="theme-option">
                          <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={userSettings.theme === 'light'}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                          />
                          <span className="theme-preview light">☀️ Light</span>
                        </label>
                        <label className="theme-option">
                          <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={userSettings.theme === 'dark'}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                          />
                          <span className="theme-preview dark">🌙 Dark</span>
                        </label>
                        <label className="theme-option">
                          <input
                            type="radio"
                            name="theme"
                            value="auto"
                            checked={userSettings.theme === 'auto'}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                          />
                          <span className="theme-preview auto">🔄 Auto</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="preference-group">
                    <h4>Data & Privacy</h4>
                    <div className="preference-item">
                      <label>Data Refresh Rate</label>
                      <select>
                        <option>Every 15 minutes</option>
                        <option>Every hour</option>
                        <option>Every 6 hours</option>
                        <option>Once a day</option>
                      </select>
                    </div>
                  </div>

                  <div className="preference-actions">
                    <button className="btn primary">💾 Save Preferences</button>
                    <button className="btn secondary">🔄 Reset to Defaults</button>
                  </div>
                </div>

                <div className="help-card">
                  <h3>❓ Need Help?</h3>
                  <div className="help-options">
                    <button className="help-option">
                      📖 User Guide
                    </button>
                    <button className="help-option">
                      🎥 Video Tutorials
                    </button>
                    <button className="help-option">
                      📞 Contact Support
                    </button>
                    <button className="help-option">
                      💬 Send Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsAlerts;