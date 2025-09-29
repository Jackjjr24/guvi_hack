import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';

export const SolarPanel: React.FC = () => {
  const [weatherCondition, setWeatherCondition] = useState<'sunny' | 'cloudy' | 'rainy'>('sunny');
  const [efficiency, setEfficiency] = useState(85);

  useEffect(() => {
    // Simulate weather changes affecting solar efficiency
    const interval = setInterval(() => {
      const conditions: ('sunny' | 'cloudy' | 'rainy')[] = ['sunny', 'cloudy', 'rainy'];
      const newCondition = conditions[Math.floor(Math.random() * conditions.length)];
      setWeatherCondition(newCondition);
      
      // Set efficiency based on weather
      switch (newCondition) {
        case 'sunny':
          setEfficiency(80 + Math.random() * 15);
          break;
        case 'cloudy':
          setEfficiency(40 + Math.random() * 20);
          break;
        case 'rainy':
          setEfficiency(10 + Math.random() * 15);
          break;
      }
    }, 10000); // Change every 10 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weatherCondition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
    }
  };

  const getEfficiencyColor = () => {
    if (efficiency >= 75) return 'text-green-600';
    if (efficiency >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const panels = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    efficiency: efficiency + (Math.random() - 0.5) * 10,
    temperature: 45 + Math.random() * 15
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Solar Panel System</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getWeatherIcon()}
            <span className="text-sm text-gray-600 capitalize">{weatherCondition}</span>
          </div>
          <div className={`text-lg font-bold ${getEfficiencyColor()}`}>
            {efficiency.toFixed(1)}% efficiency
          </div>
        </div>
      </div>

      {/* Solar Panel Grid Visualization */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-6">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all duration-300 ${
              panel.efficiency >= 75 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : panel.efficiency >= 50
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                : 'bg-red-100 border-red-300 text-red-800'
            }`}
            title={`Panel ${panel.id}: ${panel.efficiency.toFixed(1)}% - ${panel.temperature.toFixed(1)}°C`}
          >
            {panel.id}
          </div>
        ))}
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">2.4 kW</div>
          <div className="text-sm text-gray-600">Current Generation</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">18.5 kWh</div>
          <div className="text-sm text-gray-600">Today's Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">₹142</div>
          <div className="text-sm text-gray-600">Today's Savings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">52°C</div>
          <div className="text-sm text-gray-600">Avg Panel Temp</div>
        </div>
      </div>

      {/* Performance Graph */}
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Today's Generation Pattern</h4>
        <div className="h-20 bg-gradient-to-r from-blue-200 via-yellow-200 to-orange-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-full h-full">
            <svg viewBox="0 0 300 80" className="w-full h-full">
              <path
                d="M 0 80 Q 75 40 150 20 Q 225 10 300 30 L 300 80 Z"
                fill="rgba(59, 130, 246, 0.3)"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};