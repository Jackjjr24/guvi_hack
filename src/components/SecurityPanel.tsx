import React, { useState, useEffect } from 'react';
import { useSecurityContext } from '../contexts/SecurityContext';
import { 
  Shield, 
  ShieldAlert, 
  Camera, 
  Lock, 
  Unlock,
  AlertTriangle,
  Eye,
  EyeOff,
  Flame,
  Droplets,
  Zap,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Battery,
  Wifi,
  WifiOff
} from 'lucide-react';

interface SecurityThreat {
  id: string;
  type: 'gas_leak' | 'water_leak' | 'fire' | 'power_cut' | 'intrusion' | 'smoke' | 'flood' | 'earthquake';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  autoResponse: boolean;
  resolved: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  type: 'fire' | 'police' | 'medical' | 'gas' | 'electrician' | 'plumber';
  phone: string;
  available24x7: boolean;
}

const SecurityPanel: React.FC = () => {
  const { 
    alerts, 
    cameras, 
    doors,
    isArmed,
    toggleArmedStatus,
    toggleDoor
  } = useSecurityContext();
  
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [activeThreats, setActiveThreats] = useState<SecurityThreat[]>([]);
  const [systemStatus] = useState({
    gasDetector: 'online',
    waterSensor: 'online',
    fireAlarm: 'online',
    powerMonitor: 'online',
    internetConnection: 'online',
    backupPower: 85 // Battery percentage
  });

  const indianEmergencyContacts: EmergencyContact[] = [
    { id: 'fire', name: 'Fire Brigade', type: 'fire', phone: '101', available24x7: true },
    { id: 'police', name: 'Police', type: 'police', phone: '100', available24x7: true },
    { id: 'medical', name: 'Ambulance', type: 'medical', phone: '108', available24x7: true },
    { id: 'gas', name: 'Gas Emergency', type: 'gas', phone: '1906', available24x7: true },
    { id: 'electrician', name: 'Local Electrician', type: 'electrician', phone: '+91-98765-43210', available24x7: false },
    { id: 'plumber', name: 'Emergency Plumber', type: 'plumber', phone: '+91-98765-43211', available24x7: true }
  ];

  useEffect(() => {
    // Simulate real-time threat monitoring
    const mockThreats: SecurityThreat[] = [
      {
        id: 'threat-1',
        type: 'gas_leak',
        location: 'Kitchen',
        severity: 'high',
        timestamp: new Date().toISOString(),
        description: 'LPG leak detected near cooking area. Concentration: 0.3% LEL',
        autoResponse: true,
        resolved: false
      },
      {
        id: 'threat-2',
        type: 'water_leak',
        location: 'Bathroom',
        severity: 'medium',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        description: 'Water leak detected behind toilet. Flow rate: 2.5L/min',
        autoResponse: false,
        resolved: false
      }
    ];
    
    // Only set mock data for demo purposes
    if (activeThreats.length === 0) {
      setActiveThreats(mockThreats);
    }
  }, [activeThreats.length]);

  const formatValue = (value: number): string => {
    return parseFloat(value.toFixed(2)).toString();
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'gas_leak': return Flame;
      case 'water_leak': return Droplets;
      case 'fire': return Flame;
      case 'power_cut': return Zap;
      case 'intrusion': return Shield;
      case 'smoke': return AlertTriangle;
      case 'flood': return Droplets;
      default: return AlertTriangle;
    }
  };

  const getThreatColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-500';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-500';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-500';
      default: return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  const handleEmergencyCall = (contact: EmergencyContact) => {
    // In real implementation, this would trigger the emergency call
    alert(`Calling ${contact.name}: ${contact.phone}`);
  };

  const resolvethreat = (threatId: string) => {
    setActiveThreats(prev => prev.map(threat => 
      threat.id === threatId ? { ...threat, resolved: true } : threat
    ));
  };

  const statusColors = {
    secure: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    alert: 'text-red-600 bg-red-100'
  };

  return (
    <div className="space-y-6">
      {/* Security System Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Smart Security System</h2>
              <p className="text-gray-600">Comprehensive protection for Indian households</p>
            </div>
          </div>
          <button
            onClick={toggleArmedStatus}
            className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
              isArmed
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isArmed ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            <span>{isArmed ? 'Disarm System' : 'Arm System'}</span>
          </button>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg border-2 ${systemStatus.gasDetector === 'online' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center space-x-3">
              <Flame className={`h-5 w-5 ${systemStatus.gasDetector === 'online' ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium text-gray-900">Gas Detector</p>
                <p className={`text-sm ${systemStatus.gasDetector === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                  {systemStatus.gasDetector === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${systemStatus.waterSensor === 'online' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center space-x-3">
              <Droplets className={`h-5 w-5 ${systemStatus.waterSensor === 'online' ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium text-gray-900">Water Sensors</p>
                <p className={`text-sm ${systemStatus.waterSensor === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                  {systemStatus.waterSensor === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${systemStatus.powerMonitor === 'online' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center space-x-3">
              <Zap className={`h-5 w-5 ${systemStatus.powerMonitor === 'online' ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium text-gray-900">Power Monitor</p>
                <p className={`text-sm ${systemStatus.powerMonitor === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                  {systemStatus.powerMonitor === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-3">
              <Battery className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Backup Power</p>
                <p className="text-sm text-blue-600">{formatValue(systemStatus.backupPower)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {systemStatus.internetConnection === 'online' ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium text-gray-900">
              Internet: {systemStatus.internetConnection === 'online' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">System Active</span>
          </div>
        </div>
      </div>

      {/* Active Threats */}
      {activeThreats.filter(threat => !threat.resolved).length > 0 && (
        <div className="professional-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Active Security Threats</h3>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              {activeThreats.filter(threat => !threat.resolved).length}
            </span>
          </div>
          
          <div className="space-y-4">
            {activeThreats.filter(threat => !threat.resolved).map((threat) => {
              const ThreatIcon = getThreatIcon(threat.type);
              return (
                <div
                  key={threat.id}
                  className={`p-4 rounded-lg border-l-4 ${getThreatColor(threat.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <ThreatIcon className="h-6 w-6 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {threat.type.replace('_', ' ').toUpperCase()} - {threat.location}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatColor(threat.severity)}`}>
                            {threat.severity.toUpperCase()}
                          </span>
                          {threat.autoResponse && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              Auto-Response Active
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{threat.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(threat.timestamp).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {threat.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => resolvethreat(threat.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-1 inline" />
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="professional-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Phone className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Emergency Contacts</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indianEmergencyContacts.map((contact) => (
            <div key={contact.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{contact.name}</h4>
                {contact.available24x7 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">24x7</span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3 capitalize">{contact.type.replace('_', ' ')}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-gray-800">{contact.phone}</span>
                <button
                  onClick={() => handleEmergencyCall(contact)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 mr-1 inline" />
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security History & Cameras Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Events */}
        <div className="professional-card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Security Events</h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-500' :
                    alert.severity === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{alert.type}</p>
                    <p className="text-sm text-gray-600">{alert.location} • {alert.timestamp}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.resolved ? 'bg-green-100 text-green-800' : statusColors[alert.severity as keyof typeof statusColors]
                }`}>
                  {alert.resolved ? 'Resolved' : alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Camera Feed */}
        <div className="professional-card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Security Cameras</h3>
          <div className="space-y-3">
            {cameras.map((camera: any) => (
              <div key={camera.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Camera className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{camera.name}</p>
                    <p className="text-sm text-gray-600">{camera.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <button
                    onClick={() => setSelectedCamera(selectedCamera === camera.id ? null : camera.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {selectedCamera === camera.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Door/Lock Control */}
      <div className="professional-card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Smart Door Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doors.map((door: any) => (
            <div key={door.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {door.locked ? <Lock className="h-5 w-5 text-red-600" /> : <Unlock className="h-5 w-5 text-green-600" />}
                  <div>
                    <p className="font-medium text-gray-900">{door.name}</p>
                    <p className="text-sm text-gray-600">{door.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  door.locked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {door.locked ? 'Locked' : 'Unlocked'}
                </span>
              </div>
              <button
                onClick={() => toggleDoor(door.id)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  door.locked
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {door.locked ? 'Unlock' : 'Lock'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityPanel;