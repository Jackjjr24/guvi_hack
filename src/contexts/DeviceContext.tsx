import React, { createContext, useContext, useState, useEffect } from 'react';
import { Device } from '../types';

interface DeviceContextType {
  devices: Device[];
  connectedDevices: number;
  isConnected: boolean;
  toggleDevice: (deviceId: string) => void;
  updateDeviceSettings: (deviceId: string, settings: Partial<Device>) => void;
  getDevice: <T = Device>(deviceId: string) => T | undefined;
  sendCommand: (deviceId: string, type: string, payload: any) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const useDeviceContext = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return context;
};

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Living Room Lights',
      type: 'light',
      room: 'Living Room',
      status: 'on',
      brightness: 80,
      powerConsumption: 12
    },
    {
      id: '2',
      name: 'Main AC',
      type: 'ac',
      room: 'Living Room',
      status: 'on',
      temperature: 24,
      powerConsumption: 1500
    },
    {
      id: '3',
      name: 'Bedroom Fan',
      type: 'fan',
      room: 'Master Bedroom',
      status: 'on',
      speed: 3,
      powerConsumption: 75
    },
    {
      id: '4',
      name: 'Kitchen Lights',
      type: 'light',
      room: 'Kitchen',
      status: 'off',
      brightness: 100,
      powerConsumption: 8
    },
    {
      id: '5',
      name: 'Bedroom AC',
      type: 'ac',
      room: 'Master Bedroom',
      status: 'off',
      temperature: 25,
      powerConsumption: 1200
    },
    {
      id: '6',
      name: 'Security Camera',
      type: 'camera',
      room: 'Front Door',
      status: 'on',
      powerConsumption: 5
    },
    {
      id: '7',
      name: 'Smart Lock',
      type: 'lock',
      room: 'Main Door',
      status: 'on',
      powerConsumption: 2
    },
    {
      id: '8',
      name: 'Dining Light',
      type: 'light',
      room: 'Dining Room',
      status: 'on',
      brightness: 60,
      powerConsumption: 10
    },
    {
      id: '9',
      name: 'Study Room Fan',
      type: 'fan',
      room: 'Study Room',
      status: 'off',
      speed: 2,
      powerConsumption: 60
    },
    {
      id: '10',
      name: 'Garden Lights',
      type: 'light',
      room: 'Garden',
      status: 'offline',
      brightness: 100,
      powerConsumption: 15
    }
  ]);

  const [isConnected, setIsConnected] = useState(true);

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change connection status (mostly connected)
      if (Math.random() > 0.95) {
        setIsConnected(prev => !prev);
        
        // Simulate some devices going offline when connection is lost
        if (!isConnected) {
          setDevices(prev => prev.map(device => ({
            ...device,
            status: Math.random() > 0.8 ? 'offline' : device.status
          })));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const connectedDevices = devices.filter(device => device.status !== 'offline').length;

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId && device.status !== 'offline') {
        return {
          ...device,
          status: device.status === 'on' ? 'off' : 'on'
        };
      }
      return device;
    }));
  };

  const updateDeviceSettings = (deviceId: string, settings: Partial<Device>) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return { ...device, ...settings };
      }
      return device;
    }));
  };

  // Get a device by ID
  const getDevice = <T = Device>(deviceId: string): T | undefined => devices.find(device => device.id === deviceId) as T | undefined;

  // Simulate sending a command to a device
  const sendCommand = (deviceId: string, type: string, payload: any) => {
    // For demo: handle light and fan actions
    if (type === 'light') {
      if (payload.action === 'set_state') {
        updateDeviceSettings(deviceId, { status: payload.value });
      } else if (payload.action === 'set_brightness') {
        updateDeviceSettings(deviceId, { brightness: payload.value });
      }
    } else if (type === 'fan') {
      if (payload.action === 'set_speed') {
        updateDeviceSettings(deviceId, { speed: payload.value, status: payload.value > 0 ? 'on' : 'off' });
      }
    }
    // Extend for other device types as needed
  };

  return (
    <DeviceContext.Provider 
      value={{
        devices,
        connectedDevices,
        isConnected,
        toggleDevice,
        updateDeviceSettings,
        getDevice,
        sendCommand
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};