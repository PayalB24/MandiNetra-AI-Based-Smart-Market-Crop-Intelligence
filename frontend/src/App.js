import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import FarmersDashboard from './components/FarmersDashboard';
import BuyerMarketplace from './components/BuyerMarketplace';
import PriceAnalytics from './components/PriceAnalytics';
import SettingsAlerts from './components/SettingsAlerts';

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
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;