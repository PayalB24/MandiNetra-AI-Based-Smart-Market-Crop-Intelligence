import React, { useState, Suspense } from 'react';
import './App.css';
import './i18n';
import Header from './components/Header';
import FarmersDashboard from './components/FarmersDashboard';
import BuyerMarketplace from './components/BuyerMarketplace';
import PriceAnalytics from './components/PriceAnalytics';
import SettingsAlerts from './components/SettingsAlerts';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const [activeTab, setActiveTab] = useState('farmers');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'farmers':
        return <FarmersDashboard />;
      case 'buyers':
        return <BuyerMarketplace />;
      case 'analytics':
        return <PriceAnalytics />;
      case 'settings':
        return <SettingsAlerts />;
      default:
        return <FarmersDashboard />;
    }
  };

  return (
    <div className="App">
      <Suspense fallback={<div className="loading-screen">Loading...</div>}>
        {/* Language Switcher - Fixed Position */}
        <LanguageSwitcher />
        
        {/* Header with Navigation */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <main className="main-content">
          {renderTabContent()}
        </main>
      </Suspense>
    </div>
  );
}

export default App;