import React from 'react';
import { useEnergyContext } from '../contexts/EnergyContext';
import { EnergyChart } from './EnergyChart';
import { SolarPanel } from './SolarPanel';
import { Battery, Zap, Sun, Home } from 'lucide-react';

export const EnergyDashboard: React.FC = () => {
  const { 
    currentPower, 
    solarGeneration, 
    batteryLevel, 
    energyMode,
    dailyUsage,
    monthlySavings,
    recommendations
  } = useEnergyContext();

  const formatValue = (value: number | undefined, suffix: string = '') => {
    if (value === undefined) return '0' + suffix;
    return Number(value).toFixed(2).replace(/\.?0+$/, '') + suffix;
  };

  const energySourceCards = [
    {
      title: 'Grid Power',
      value: `${formatValue(Math.max(0, currentPower - solarGeneration), 'W')}`,
      icon: <Zap className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-50',
      percentage: Math.round(((currentPower - solarGeneration) / currentPower) * 100)
    },
    {
      title: 'Solar Generation',
      value: `${formatValue(solarGeneration, 'W')}`,
      icon: <Sun className="w-5 h-5" />,
      color: 'text-yellow-600 bg-yellow-50',
      percentage: Math.round((solarGeneration / currentPower) * 100)
    },
    {
      title: 'Battery Storage',
      value: `${formatValue(batteryLevel, '%')}`,
      icon: <Battery className="w-5 h-5" />,
      color: 'text-green-600 bg-green-50',
      percentage: batteryLevel
    },
    {
      title: 'Total Consumption',
      value: `${formatValue(currentPower, 'W')}`,
      icon: <Home className="w-5 h-5" />,
      color: 'text-primary-600 bg-primary-50',
      percentage: 100
    }
  ];

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary-900">Energy Management</h2>
            <p className="text-primary-600 mt-1">Monitor and optimize your energy usage</p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-semibold border ${
            energyMode === 'Solar'
              ? 'bg-green-50 text-green-800 border-green-200'
              : energyMode === 'Battery'
              ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            {energyMode === 'Solar' && '☀️ '}
            {energyMode === 'Battery' && '🔋 '}
            {energyMode === 'Grid' && '⚡ '}
            Mode: {energyMode}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {energySourceCards.map((card, index) => (
            <div key={index} className="professional-card rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${card.color} border border-current border-opacity-20`}>
                  {card.icon}
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  card.color.includes('blue') ? 'bg-blue-100 text-blue-700' :
                  card.color.includes('yellow') ? 'bg-yellow-100 text-yellow-700' :
                  card.color.includes('green') ? 'bg-green-100 text-green-700' :
                  'bg-primary-100 text-primary-700'
                }`}>
                  {Math.min(100, card.percentage)}%
                </div>
              </div>
              <h3 className="text-sm font-semibold text-primary-700 mb-1">{card.title}</h3>
              <p className="text-xl font-bold text-primary-900 mb-3">{card.value}</p>
              <div className="w-full bg-primary-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    card.color.includes('blue') ? 'bg-blue-500' :
                    card.color.includes('yellow') ? 'bg-yellow-500' :
                    card.color.includes('green') ? 'bg-green-500' :
                    'bg-primary-500'
                  }`}
                  style={{ width: `${Math.min(100, card.percentage)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solar Panel Status */}
      <SolarPanel />

      {/* Energy Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="professional-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">24-Hour Usage Pattern</h3>
          <EnergyChart />
        </div>

        <div className="professional-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Monthly Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-primary-100">
              <span className="text-primary-700 font-medium">Daily Average</span>
              <span className="font-semibold text-primary-900">{formatValue(dailyUsage, ' kWh')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-primary-100">
              <span className="text-primary-700 font-medium">Monthly Savings</span>
              <span className="font-semibold text-green-600">₹{formatValue(monthlySavings)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-primary-100">
              <span className="text-primary-700 font-medium">Carbon Saved</span>
              <span className="font-semibold text-green-600">15.20 kg CO₂</span>
            </div>
            <div className="pt-3 border-t border-primary-200">
              <div className="text-sm text-primary-700 font-medium mb-2">Peak Hours (6 PM - 10 PM)</div>
              <div className="w-full bg-primary-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <div className="text-xs text-primary-600 mt-1">78% of daily peak consumption</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="professional-card rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Energy Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              rec.priority === 'high' ? 'border-red-500 bg-red-50' :
              rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-green-500 bg-green-50'
            }`}>
              <div className={`text-xs font-bold mb-2 px-2 py-1 rounded-full inline-block ${
                rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {rec.priority.toUpperCase()}
              </div>
              <div className="text-primary-900 font-semibold mb-1">{rec.title}</div>
              <div className="text-sm text-primary-700 mb-2">{rec.description}</div>
              {rec.savings && (
                <div className="text-sm font-semibold text-green-600">
                  Potential savings: ₹{formatValue(rec.savings)}/month
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};