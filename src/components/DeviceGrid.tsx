import React from 'react';
import { useDeviceContext } from '../contexts/DeviceContext'; // FIX: Changed hook name
import { DeviceCard } from './DeviceCard'; 

export const DeviceGrid: React.FC = () => {
    // FIX: Using the correct hook name
    const { devices, isConnected } = useDeviceContext(); 

    // Filter to render only the device types you have cards for (light, fan, ac)
    const renderableDevices = devices.filter(d => 
        d.type === 'light' || 
        d.type === 'fan' || 
        d.type === 'ac'
    );

    return (
        <div>
            {/* Top Info Header (similar to screenshot) */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Connected Devices</h2>
                    <p className="text-gray-600">Monitor and control your smart home devices</p>
                </div>
                <button className="btn-primary">+ Add Device</button>
            </div>
            
            {/* MQTT Connection Status Indicator */}
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                isConnected ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
                System Connection: {isConnected ? 'MQTT Broker Online' : 'Attempting to Connect to Broker...'}
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderableDevices.map(device => (
                    // Explicitly pass device ID for the MQTT communication
                        <DeviceCard 
                        key={device.id}
                        deviceId={device.id}
                    />
                ))}
            </div>
        </div>
    );
};