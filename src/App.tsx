import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { VoiceAssistant } from './components/VoiceAssistant';
import { DeviceProvider } from './contexts/DeviceContext';
import { EnergyProvider } from './contexts/EnergyContext';
import { SecurityProvider } from './contexts/SecurityContext';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate system initialization
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-8 text-center max-w-md mx-4">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-600 mx-auto"></div>
          </div>
          <h2 className="text-gray-900 text-xl font-semibold mb-2">Initializing Smart Home System</h2>
          <p className="text-gray-600 text-sm">Connecting to devices and loading AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <DeviceProvider>
      <EnergyProvider>
        <SecurityProvider>
          <div className="min-h-screen bg-gray-50">
            <Dashboard />
            <VoiceAssistant />
          </div>
        </SecurityProvider>
      </EnergyProvider>
    </DeviceProvider>
  );
}

export default App;