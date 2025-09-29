import React, { useEffect, useState } from 'react';

export const EnergyChart: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    // Generate realistic 24-hour energy usage pattern for Indian households
    const generateUsagePattern = () => {
      const basePattern = [
        0.5, 0.3, 0.2, 0.2, 0.3, 0.5, // 0-5 AM: Very low usage
        1.2, 2.1, 2.8, 2.5, 2.0, 1.8, // 6-11 AM: Morning activities
        2.2, 2.0, 1.8, 1.5, 1.3, 1.8, // 12-5 PM: Afternoon
        3.2, 4.1, 4.8, 4.2, 3.5, 2.1  // 6-11 PM: Peak evening hours
      ];
      
      // Add some random variation
      return basePattern.map(base => base + (Math.random() - 0.5) * 0.3);
    };

    setData(generateUsagePattern());

    // Update current hour every minute
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...data);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full h-64">
      <div className="flex items-end justify-between h-48 px-2">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          const isCurrentHour = index === currentHour;
          
          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 mx-px"
            >
              <div
                className={`w-full rounded-t transition-all duration-300 ${
                  isCurrentHour 
                    ? 'bg-green-500 shadow-lg' 
                    : value > 3 
                    ? 'bg-red-400' 
                    : value > 2 
                    ? 'bg-yellow-400' 
                    : 'bg-blue-400'
                }`}
                style={{ height: `${height}%` }}
                title={`${index}:00 - ${value.toFixed(1)} kW`}
              >
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Hour labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
        {hours.filter((_, i) => i % 4 === 0).map((hour) => (
          <span key={hour}>{hour}:00</span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 rounded mr-1"></div>
          <span className="text-gray-600">Low</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-400 rounded mr-1"></div>
          <span className="text-gray-600">Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
          <span className="text-gray-600">High</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
          <span className="text-gray-600">Current</span>
        </div>
      </div>
    </div>
  );
};