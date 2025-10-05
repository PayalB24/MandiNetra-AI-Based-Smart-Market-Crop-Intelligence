import React, { useState, useEffect } from 'react';
import '../styles/PriceAnalytics.css';

// Mock chart component (in real app, use Chart.js or Recharts)
const PriceChart = ({ data, type = 'line' }) => {
  return (
    <div className="price-chart">
      <div className="chart-container">
        {/* Mock chart visualization */}
        <div className="chart-bars">
          {data.map((item, index) => (
            <div key={index} className="chart-bar-container">
              <div 
                className="chart-bar"
                style={{ height: `${(item.price / 100) * 80}%` }}
                title={`${item.month}: ₹${item.price}`}
              ></div>
              <span className="chart-label">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PriceAnalytics = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('wheat');
  const [selectedDistrict, setSelectedDistrict] = useState('pune');
  const [timeRange, setTimeRange] = useState('3months');
  const [chartData, setChartData] = useState([]);
  const [marketInsights, setMarketInsights] = useState([]);
  const [priceComparisons, setPriceComparisons] = useState([]);
  const [trendingCommodities, setTrendingCommodities] = useState([]);
  const [loading, setLoading] = useState(false);

  const commodities = [
    { id: 'wheat', name: '🌾 Wheat', color: '#f39c12' },
    { id: 'rice', name: '🍚 Rice', color: '#e74c3c' },
    { id: 'cotton', name: '🧵 Cotton', color: '#3498db' },
    { id: 'bajra', name: '🌾 Bajra', color: '#27ae60' },
    { id: 'jowar', name: '🌾 Jowar', color: '#9b59b6' }
  ];

  const districts = [
    { id: 'pune', name: 'Pune' },
    { id: 'nashik', name: 'Nashik' },
    { id: 'nagpur', name: 'Nagpur' },
    { id: 'aurangabad', name: 'Aurangabad' },
    { id: 'amravati', name: 'Amravati' }
  ];

  const timeRanges = [
    { id: '1month', name: '1 Month' },
    { id: '3months', name: '3 Months' },
    { id: '6months', name: '6 Months' },
    { id: '1year', name: '1 Year' }
  ];

  // Mock data generation
  const generateChartData = (commodity, range) => {
    const months = {
      '1month': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      '3months': ['Jan', 'Feb', 'Mar'],
      '6months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      '1year': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };

    const basePrices = {
      wheat: 2200,
      rice: 2800,
      cotton: 6500,
      bajra: 1800,
      jowar: 2400
    };

    return months[range].map((month, index) => ({
      month,
      price: Math.round(basePrices[commodity] * (0.9 + Math.random() * 0.2)),
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }));
  };

  const generateMarketInsights = (commodity) => {
    const insights = [
      {
        id: 1,
        type: 'demand',
        title: 'High Demand Alert',
        description: `Demand for ${commodity} increased by 15% in Pune region`,
        impact: 'positive',
        confidence: 92
      },
      {
        id: 2,
        type: 'supply',
        title: 'Supply Chain Update',
        description: 'New transportation routes reducing delivery time by 20%',
        impact: 'positive',
        confidence: 85
      },
      {
        id: 3,
        type: 'weather',
        title: 'Weather Impact',
        description: 'Good monsoon expected to boost production next quarter',
        impact: 'positive',
        confidence: 78
      },
      {
        id: 4,
        type: 'market',
        title: 'Export Opportunities',
        description: 'International demand rising from Middle East markets',
        impact: 'positive',
        confidence: 88
      }
    ];
    return insights;
  };

  const generatePriceComparisons = () => {
    return [
      {
        market: 'Pune Market',
        price: 2250,
        trend: 'up',
        change: '+5.2%',
        bestDeal: true
      },
      {
        market: 'Nashik Market',
        price: 2180,
        trend: 'down',
        change: '-2.1%',
        bestDeal: false
      },
      {
        market: 'Nagpur Market',
        price: 2320,
        trend: 'up',
        change: '+8.7%',
        bestDeal: false
      },
      {
        market: 'Mumbai Market',
        price: 2450,
        trend: 'up',
        change: '+12.3%',
        bestDeal: false
      }
    ];
  };

  const generateTrendingCommodities = () => {
    return [
      {
        commodity: 'Tomato',
        trend: 'rising',
        currentPrice: '₹45/kg',
        change: '+18%',
        reason: 'Seasonal demand increase'
      },
      {
        commodity: 'Onion',
        trend: 'stable',
        currentPrice: '₹32/kg',
        change: '+2%',
        reason: 'Balanced supply chain'
      },
      {
        commodity: 'Potato',
        trend: 'falling',
        currentPrice: '₹28/kg',
        change: '-5%',
        reason: 'Increased production'
      },
      {
        commodity: 'Wheat',
        trend: 'rising',
        currentPrice: '₹2250/quintal',
        change: '+8%',
        reason: 'Export demand surge'
      }
    ];
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedCommodity, selectedDistrict, timeRange]);

  const loadAnalyticsData = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setChartData(generateChartData(selectedCommodity, timeRange));
      setMarketInsights(generateMarketInsights(selectedCommodity));
      setPriceComparisons(generatePriceComparisons());
      setTrendingCommodities(generateTrendingCommodities());
      setLoading(false);
    }, 1000);
  };

  const getCommodityColor = (commodityId) => {
    const commodity = commodities.find(c => c.id === commodityId);
    return commodity ? commodity.color : '#3498db';
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'rising': return '#27ae60';
      case 'falling': return '#e74c3c';
      case 'stable': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  return (
    <div className="price-analytics">
      <div className="container">
        {/* Analytics Header */}
        <div className="analytics-header">
          <h1>📊 Price Analytics</h1>
          <p>Advanced market intelligence and price trend analysis</p>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Commodity</label>
            <select 
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
            >
              {commodities.map(commodity => (
                <option key={commodity.id} value={commodity.id}>
                  {commodity.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>District</label>
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {districts.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Time Range</label>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {timeRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn refresh-btn" onClick={loadAnalyticsData}>
            🔄 Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="loading-analytics">
            <div className="spinner"></div>
            <p>Loading market analytics...</p>
          </div>
        ) : (
          <div className="analytics-content">
            {/* Main Chart Section */}
            <div className="main-chart-section">
              <div className="analytics-card">
                <div className="card-header">
                  <h2>
                    {commodities.find(c => c.id === selectedCommodity)?.name} Price Trends
                  </h2>
                  <div className="current-price">
                    <span className="price">₹{chartData[chartData.length - 1]?.price || 0}</span>
                    <span className="price-unit">/quintal</span>
                  </div>
                </div>
                
                <div className="chart-wrapper">
                  <PriceChart 
                    data={chartData} 
                    type="line" 
                  />
                </div>

                <div className="chart-stats">
                  <div className="stat">
                    <span className="stat-label">Current Price</span>
                    <span className="stat-value">₹{chartData[chartData.length - 1]?.price || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">3M Change</span>
                    <span className="stat-value positive">+8.2%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Volatility</span>
                    <span className="stat-value">Medium</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Market Sentiment</span>
                    <span className="stat-value positive">Bullish</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Sections */}
            <div className="sidebar-sections">
              {/* Market Insights */}
              <div className="analytics-card insights-card">
                <div className="card-header">
                  <h3>💡 Market Insights</h3>
                </div>
                <div className="insights-list">
                  {marketInsights.map(insight => (
                    <div key={insight.id} className="insight-item">
                      <div className="insight-icon">
                        {insight.type === 'demand' && '📈'}
                        {insight.type === 'supply' && '🚚'}
                        {insight.type === 'weather' && '🌧️'}
                        {insight.type === 'market' && '🌍'}
                      </div>
                      <div className="insight-content">
                        <h4>{insight.title}</h4>
                        <p>{insight.description}</p>
                        <div className="insight-meta">
                          <span className={`impact ${insight.impact}`}>
                            {insight.impact === 'positive' ? 'Positive' : 'Neutral'}
                          </span>
                          <span className="confidence">{insight.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Comparison */}
              <div className="analytics-card comparison-card">
                <div className="card-header">
                  <h3>⚖️ Market Comparison</h3>
                </div>
                <div className="comparison-list">
                  {priceComparisons.map((market, index) => (
                    <div key={index} className="comparison-item">
                      <div className="market-info">
                        <span className="market-name">{market.market}</span>
                        {market.bestDeal && <span className="best-deal-badge">Best Deal</span>}
                      </div>
                      <div className="price-info">
                        <span className="market-price">₹{market.price}</span>
                        <span className={`price-change ${market.trend}`}>
                          {market.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending Commodities */}
            <div className="trending-section">
              <div className="analytics-card trending-card">
                <div className="card-header">
                  <h3>🔥 Trending Commodities</h3>
                  <span className="update-time">Updated 5 min ago</span>
                </div>
                <div className="trending-grid">
                  {trendingCommodities.map((item, index) => (
                    <div key={index} className="trending-item">
                      <div className="trending-header">
                        <span className="commodity-name">{item.commodity}</span>
                        <span 
                          className="trend-indicator"
                          style={{ color: getTrendColor(item.trend) }}
                        >
                          {getTrendIcon(item.trend)} {item.trend}
                        </span>
                      </div>
                      <div className="trending-price">{item.currentPrice}</div>
                      <div className="trending-change">{item.change}</div>
                      <div className="trending-reason">{item.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Analytics */}
            <div className="advanced-analytics">
              <div className="analytics-card">
                <div className="card-header">
                  <h3>🔍 Advanced Analytics</h3>
                </div>
                <div className="advanced-grid">
                  <div className="advanced-metric">
                    <span className="metric-label">Price Predictability</span>
                    <div className="metric-value">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: '78%' }}
                        ></div>
                      </div>
                      <span>78%</span>
                    </div>
                  </div>
                  
                  <div className="advanced-metric">
                    <span className="metric-label">Market Correlation</span>
                    <div className="metric-value">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                      <span>65%</span>
                    </div>
                  </div>
                  
                  <div className="advanced-metric">
                    <span className="metric-label">Risk Level</span>
                    <div className="metric-value">
                      <span className="risk-level medium">Medium</span>
                    </div>
                  </div>
                  
                  <div className="advanced-metric">
                    <span className="metric-label">Seasonal Impact</span>
                    <div className="metric-value">
                      <span className="seasonal-impact high">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceAnalytics;