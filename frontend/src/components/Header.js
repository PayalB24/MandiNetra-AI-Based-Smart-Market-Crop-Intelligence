import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Header.css';

const Header = ({ activeTab, setActiveTab }) => {
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

  return (
    <header className="app-header">
      {/* Language Switcher */}
      <div className="header-language-switcher">
        <div className="dropdown">
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

      {/* Big Hero Image Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="logo-section">
              <h1 className="main-title">
                <span className="eye-symbol">👁️</span>
                {t('header.title')}
              </h1>
              <p className="tagline">{t('header.tagline')}</p>
              <p className="subtagline">{t('header.subtagline')}</p>
              
              <div className="hero-buttons">
                <button className="hero-btn direct-farm">
                  {t('header.directFarm')}
                </button>
                <button className="hero-btn ai-powered">
                  {t('header.aiPowered')}
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