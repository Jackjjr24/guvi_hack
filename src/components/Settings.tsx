import React, { useState } from 'react';
import { 
  Globe, 
  Mic, 
  Shield, 
  Battery, 
  Wifi, 
  Bell, 
  Moon,
  Sun,
  Volume2,
  Smartphone
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    language: 'english',
    voiceEnabled: true,
    theme: 'light',
    notifications: true,
    energyMode: 'optimized',
    voiceLanguage: 'english',
    autoUpdate: true,
    privacyMode: false,
    soundEnabled: true,
    mobileSync: true
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const languages = [
    { code: 'english', name: 'English', native: 'English' },
    { code: 'hindi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
    { code: 'telugu', name: 'Telugu', native: 'తెలుగు' },
    { code: 'bengali', name: 'Bengali', native: 'বাংলা' },
    { code: 'marathi', name: 'Marathi', native: 'मराठी' }
  ];

  const energyModes = [
    { value: 'performance', label: 'Performance', description: 'Maximum comfort and speed' },
    { value: 'optimized', label: 'Optimized', description: 'Balance between comfort and efficiency' },
    { value: 'eco', label: 'Eco Mode', description: 'Maximum energy savings' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
      </div>

      {/* Language & Voice Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Language & Voice</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interface Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice Command Language
            </label>
            <select
              value={settings.voiceLanguage}
              onChange={(e) => updateSetting('voiceLanguage', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mic className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Voice Commands</div>
              <div className="text-sm text-gray-600">Enable voice control for all devices</div>
            </div>
          </div>
          <button
            onClick={() => updateSetting('voiceEnabled', !settings.voiceEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.voiceEnabled ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.voiceEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Energy Management */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Battery className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Energy Management</h3>
        </div>

        <div className="space-y-4">
          {energyModes.map((mode) => (
            <div
              key={mode.value}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                settings.energyMode === mode.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateSetting('energyMode', mode.value)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  settings.energyMode === mode.value
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}>
                  {settings.energyMode === mode.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{mode.label}</div>
                  <div className="text-sm text-gray-600">{mode.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Privacy & Security</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Privacy Mode</div>
              <div className="text-sm text-gray-600">Enhanced data protection and local processing only</div>
            </div>
            <button
              onClick={() => updateSetting('privacyMode', !settings.privacyMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.privacyMode ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.privacyMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Data Storage</h4>
            <p className="text-sm text-purple-800">
              All your data is stored locally on your device. No information is sent to external servers 
              or cloud services. Voice processing and AI analysis happen entirely on-device.
            </p>
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Wifi className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">System Preferences</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">Notifications</div>
                <div className="text-sm text-gray-600">System alerts and device updates</div>
              </div>
            </div>
            <button
              onClick={() => updateSetting('notifications', !settings.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">Sound Effects</div>
                <div className="text-sm text-gray-600">Audio feedback for interactions</div>
              </div>
            </div>
            <button
              onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">Mobile App Sync</div>
                <div className="text-sm text-gray-600">Synchronize with mobile application</div>
              </div>
            </div>
            <button
              onClick={() => updateSetting('mobileSync', !settings.mobileSync)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.mobileSync ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.mobileSync ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {settings.theme === 'light' ? (
                <Sun className="w-5 h-5 text-gray-600" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
              <div>
                <div className="font-medium text-gray-900">Theme</div>
                <div className="text-sm text-gray-600">Interface appearance</div>
              </div>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">AI Model Version:</span>
              <span className="font-medium">v1.8.2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Update:</span>
              <span className="font-medium">2 days ago</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Storage Used:</span>
              <span className="font-medium">2.3 GB / 5 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Connected Devices:</span>
              <span className="font-medium">15 devices</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium">7 days, 14 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};