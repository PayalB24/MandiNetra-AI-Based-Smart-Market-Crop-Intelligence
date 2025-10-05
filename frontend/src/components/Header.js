import React from 'react';
import '../styles/Header.css';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <header className="app-header">
      {/* Big Hero Image Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="logo-section">
              <h1 className="main-title">
                <span className="eye-symbol">👁️</span>
                MandiNetra
              </h1>
              <p className="tagline">मंडी की आंख | The Eye on the Mandi</p>
              <p className="subtagline">AI-powered marketplace connecting farmers directly with consumers</p>
              
              <div className="hero-buttons">
                <button className="hero-btn direct-farm">
                  🌱 Direct from Farm
                </button>
                <button className="hero-btn ai-powered">
                  🤖 AI Powered
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="navigation-tabs">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeTab === 'farmers' ? 'active' : ''}`}
            onClick={() => setActiveTab('farmers')}
          >
            <span className="nav-icon">👨‍🌾</span>
            <span className="nav-text">Farmer's Dashboard</span>
            <span className="nav-hindi">किसान डैशबोर्ड</span>
          </button>

          <button 
            className={`nav-tab ${activeTab === 'buyers' ? 'active' : ''}`}
            onClick={() => setActiveTab('buyers')}
          >
            <span className="nav-icon">🛒</span>
            <span className="nav-text">Buyer Marketplace</span>
            <span className="nav-hindi">खरीदार बाजार</span>
          </button>

          <button 
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Price Analytics</span>
            <span className="nav-hindi">मूल्य विश्लेषण</span>
          </button>

          <button 
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings & Alerts</span>
            <span className="nav-hindi">सेटिंग्स</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;