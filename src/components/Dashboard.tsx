import React, { useState } from 'react';
import { Header } from './Header';
import { DeviceGrid } from './DeviceGrid';
import { EnergyDashboard } from './EnergyDashboard';
import SecurityPanel from './SecurityPanel';
import AIInsights from './AIInsights';
import { Settings } from './Settings';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('devices');

  const tabs = [
    { id: 'devices', label: 'Devices', icon: '🏠' },
    { id: 'energy', label: 'Energy', icon: '⚡' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'insights', label: 'AI Insights', icon: '🧠' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'devices':
        return <DeviceGrid />;
      case 'energy':
        return <EnergyDashboard />;
      case 'security':
        return <SecurityPanel />;
      case 'insights':
        return <AIInsights />;
      case 'settings':
        return <Settings />;
      default:
        return <DeviceGrid />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="transition-opacity duration-300 ease-in-out">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};