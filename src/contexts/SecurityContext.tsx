import React, { createContext, useContext, useState, useEffect } from 'react';

interface SecurityAlert {
  id: string;
  type: 'motion' | 'door' | 'system';
  message: string;
  location: string;
  timestamp: string;
}

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
}

interface Door {
  id: string;
  name: string;
  location: string;
  status: 'locked' | 'unlocked';
}

interface SecurityContextType {
  securityStatus: 'secure' | 'warning' | 'alert';
  alerts: SecurityAlert[];
  cameras: Camera[];
  doors: Door[];
  isArmed: boolean;
  toggleArmedStatus: () => void;
  dismissAlert: (alertId: string) => void;
  toggleDoor: (doorId: string) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isArmed, setIsArmed] = useState(false);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'motion',
      message: 'Motion detected in garden area',
      location: 'Garden',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      type: 'door',
      message: 'Front door opened',
      location: 'Main Entrance',
      timestamp: '5 minutes ago'
    }
  ]);

  const [cameras] = useState<Camera[]>([
    { id: 'cam1', name: 'Front Door', location: 'Main Entrance', status: 'online' },
    { id: 'cam2', name: 'Living Room', location: 'Living Room', status: 'online' },
    { id: 'cam3', name: 'Garden View', location: 'Garden', status: 'online' },
    { id: 'cam4', name: 'Garage', location: 'Garage', status: 'offline' }
  ]);

  const [doors, setDoors] = useState<Door[]>([
    { id: 'door1', name: 'Main Door', location: 'Front Entrance', status: 'locked' },
    { id: 'door2', name: 'Back Door', location: 'Kitchen', status: 'locked' },
    { id: 'door3', name: 'Garage Door', location: 'Garage', status: 'unlocked' }
  ]);

  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'alert'>('warning');

  // Simulate security events
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly generate security events
      if (Math.random() > 0.95 && isArmed) {
        const eventTypes = ['motion', 'door', 'system'] as const;
        const locations = ['Front Door', 'Garden', 'Living Room', 'Kitchen'];
        const messages = {
          motion: 'Motion detected',
          door: 'Door sensor triggered',
          system: 'System anomaly detected'
        };

        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        const newAlert: SecurityAlert = {
          id: Date.now().toString(),
          type,
          message: `${messages[type]} in ${location.toLowerCase()}`,
          location,
          timestamp: 'Just now'
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isArmed]);

  // Update security status based on alerts and system state
  useEffect(() => {
    if (alerts.length === 0 && isArmed) {
      setSecurityStatus('secure');
    } else if (alerts.some(alert => alert.type === 'system')) {
      setSecurityStatus('alert');
    } else {
      setSecurityStatus('warning');
    }
  }, [alerts, isArmed]);

  const toggleArmedStatus = () => {
    setIsArmed(prev => !prev);
    if (!isArmed) {
      // Clear alerts when arming
      setAlerts([]);
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const toggleDoor = (doorId: string) => {
    setDoors(prev => prev.map(door => {
      if (door.id === doorId) {
        return {
          ...door,
          status: door.status === 'locked' ? 'unlocked' : 'locked'
        };
      }
      return door;
    }));
  };

  return (
    <SecurityContext.Provider 
      value={{
        securityStatus,
        alerts,
        cameras,
        doors,
        isArmed,
        toggleArmedStatus,
        dismissAlert,
        toggleDoor
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};