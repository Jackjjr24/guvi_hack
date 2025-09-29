import React from 'react';
import { useDeviceContext } from '../contexts/DeviceContext';
import { useEnergyContext } from '../contexts/EnergyContext';
import { useSecurityContext } from '../contexts/SecurityContext';
import { Wifi, WifiOff, Shield, ShieldAlert, Battery } from 'lucide-react';

export const Header: React.FC = () => {
  const { isConnected, connectedDevices } = useDeviceContext();
  const { currentPower, energyMode } = useEnergyContext();
  const { securityStatus, alerts } = useSecurityContext();

  const currentTime = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Home Control Panel</h1>
            <p className="text-sm text-gray-600 mt-1">{currentTime}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 bg-primary-50 px-3 py-2 rounded-lg border border-primary-200">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <div className="text-sm">
                    <span className="font-medium text-primary-900">Connected</span>
                    <p className="text-xs text-primary-600">{connectedDevices} devices</p>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <div className="text-sm">
                    <span className="font-medium text-primary-900">Disconnected</span>
                    <p className="text-xs text-primary-600">{connectedDevices} devices</p>
                  </div>
                </>
              )}
            </div>

            {/* Energy Status */}
            <div className="flex items-center space-x-2 bg-primary-50 px-3 py-2 rounded-lg border border-primary-200">
              <Battery className="w-4 h-4 text-blue-600" />
              <div className="text-sm">
                <span className="font-medium text-primary-900">{Number(currentPower).toFixed(1)}W</span>
                <p className="text-xs text-primary-600 capitalize">{energyMode} mode</p>
              </div>
            </div>

            {/* Security Status */}
            <div className="flex items-center space-x-2 bg-primary-50 px-3 py-2 rounded-lg border border-primary-200">
              {securityStatus === 'secure' ? (
                <>
                  <Shield className="w-4 h-4 text-green-500" />
                  <div className="text-sm">
                    <span className="font-medium text-primary-900">Secure</span>
                    <p className="text-xs text-primary-600">{alerts.length} alerts</p>
                  </div>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-yellow-500" />
                  <div className="text-sm">
                    <span className="font-medium text-primary-900">Alert</span>
                    <p className="text-xs text-primary-600">{alerts.length} alerts</p>
                  </div>
                </>
              )}
            </div>

            {/* User Profile */}
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-semibold">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};