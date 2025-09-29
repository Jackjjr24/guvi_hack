import React, { createContext, useContext, useState, useEffect } from 'react';

interface EnergyRecommendation {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  savings?: number;
}

interface EnergyContextType {
  currentPower: number;
  solarGeneration: number;
  batteryLevel: number;
  energyMode: string;
  dailyUsage: number;
  monthlySavings: number;
  recommendations: EnergyRecommendation[];
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const useEnergyContext = () => {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergyContext must be used within an EnergyProvider');
  }
  return context;
};

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPower, setCurrentPower] = useState(2800);
  const [solarGeneration, setSolarGeneration] = useState(1200);
  const [batteryLevel, setBatteryLevel] = useState(75);
  const [energyMode, setEnergyMode] = useState('Solar');

  const dailyUsage = 28.5;
  const monthlySavings = 1240;

  const recommendations: EnergyRecommendation[] = [
    {
      title: 'Peak Hour Optimization',
      description: 'Schedule heavy appliances during solar peak hours (11 AM - 3 PM)',
      priority: 'high',
      savings: 420
    },
    {
      title: 'AC Temperature Adjustment',
      description: 'Increase AC temperature by 2°C during day time',
      priority: 'medium',
      savings: 280
    },
    {
      title: 'Smart Lighting Schedule',
      description: 'Automatically dim lights during peak solar generation',
      priority: 'low',
      savings: 150
    }
  ];

  // Simulate real-time energy data changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate power consumption changes
      setCurrentPower(prev => {
        const change = (Math.random() - 0.5) * 200;
        return Math.max(1000, Math.min(4000, prev + change));
      });

      // Simulate solar generation (time-based)
      const hour = new Date().getHours();
      let baseSolar = 0;
      
      if (hour >= 6 && hour <= 18) {
        // Simulate solar curve throughout the day
        const solarFactor = Math.sin(((hour - 6) / 12) * Math.PI);
        baseSolar = solarFactor * 2000 * (0.8 + Math.random() * 0.4);
      }
      
      setSolarGeneration(Math.max(0, baseSolar));

      // Simulate battery level changes
      setBatteryLevel(prev => {
        const solarExcess = Math.max(0, baseSolar - currentPower);
        const batteryChange = solarExcess > 0 ? 0.5 : -0.2;
        return Math.max(20, Math.min(100, prev + batteryChange));
      });

      // Update energy mode based on conditions
      if (baseSolar > currentPower) {
        setEnergyMode('Solar');
      } else if (batteryLevel > 30) {
        setEnergyMode('Battery');
      } else {
        setEnergyMode('Grid');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPower, batteryLevel]);

  return (
    <EnergyContext.Provider 
      value={{
        currentPower,
        solarGeneration,
        batteryLevel,
        energyMode,
        dailyUsage,
        monthlySavings,
        recommendations
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};