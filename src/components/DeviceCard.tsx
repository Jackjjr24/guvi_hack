import React from 'react';
import { Lightbulb, Fan, Thermometer, Lock, Video } from 'lucide-react';
import { useDeviceContext } from '../contexts/DeviceContext'; 
// NOTE: Since you defined LightDevice, FanDevice, and ACDevice locally,
// the import from '../types' must be correctly done:
import { Device } from '../types';

// Define the partial types locally, or preferably, export them from '../types'
// Assuming they are exported from '../types' based on the structure provided previously.
// If they are NOT exported, you must define them here like this:
type LightDevice = Device & { brightness?: number };
type FanDevice = Device & { speed: number };
type ACDevice = Device & { temperature: number };

interface DeviceCardProps {
    // FIX: Only need the deviceId. All other data (name, room, etc.)
    // will be pulled from the 'device' object using getDevice(deviceId).
    deviceId: string;
}

// --- Helper Components for specific device controls ---

// Renders controls for a Light device
const LightControls: React.FC<{ light: LightDevice }> = ({ light }) => {
    const { sendCommand, toggleDevice } = useDeviceContext();
    const is_on = light.status === 'on';
    // Use optional chaining for safety, although the type specifies the property
    const brightness = light.brightness || 0; 

    const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBrightness = parseInt(e.target.value);
        const payload = { action: 'set_brightness', value: newBrightness };
        // Use sendCommand (which is MQTT-enabled)
        sendCommand(light.id, light.type, payload);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Brightness</span>
                <span className="text-lg font-semibold text-blue-600">{brightness}%</span>
            </div>
            
            <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={handleBrightnessChange}
                className="w-full"
            />

            <button 
                onClick={() => toggleDevice(light.id)} 
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    is_on 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {is_on ? 'Turn Off' : 'Turn On'}
            </button>
        </div>
    );
};

// Renders controls for a Fan device
const FanControls: React.FC<{ fan: FanDevice }> = ({ fan }) => {
    const { sendCommand, toggleDevice } = useDeviceContext();
    const current_speed = fan.speed;
    const is_running = fan.status === 'on'; 
    const speeds = [1, 2, 3, 4, 5]; 

    const handleSpeedChange = (speed: number) => {
        const payload = { action: 'set_speed', value: speed };
        sendCommand(fan.id, fan.type, payload);
    };
    
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Speed</span>
                <span className="text-lg font-semibold text-blue-600">Level {current_speed}</span>
            </div>
            
            <div className="flex justify-between space-x-1">
                {speeds.map(speed => (
                    <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                            current_speed === speed 
                                ? 'btn-primary' 
                                : 'btn-secondary'
                        }`}
                    >
                        {speed}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => toggleDevice(fan.id)}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    is_running 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {is_running ? 'Turn Off' : 'Turn On'}
            </button>
        </div>
    );
};

// Renders controls for a simple AC device
const ACControls: React.FC<{ ac: ACDevice }> = ({ ac }) => {
    const { updateDeviceSettings, toggleDevice } = useDeviceContext();
    const is_on = ac.status === 'on';
    const current_temp = ac.temperature;

    const handleTempChange = (delta: number) => {
        // NOTE: This uses local state update as AC MQTT logic is not fully defined yet.
        updateDeviceSettings(ac.id, { temperature: current_temp + delta });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center text-center">
                <button 
                    className="text-2xl font-bold p-2 text-gray-600" 
                    onClick={() => handleTempChange(-1)}
                    disabled={current_temp <= 18}
                >-</button>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Temperature</span>
                    <span className="text-2xl font-bold text-blue-600">{current_temp}°C</span>
                </div>
                <button 
                    className="text-2xl font-bold p-2 text-gray-600" 
                    onClick={() => handleTempChange(1)}
                    disabled={current_temp >= 30}
                >+</button>
            </div>
            
            <div className="flex justify-center space-x-1">
                {[22, 24, 26].map(temp => (
                    <button
                        key={temp}
                        onClick={() => updateDeviceSettings(ac.id, { temperature: temp })}
                        className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                            current_temp === temp 
                                ? 'btn-primary' 
                                : 'btn-secondary'
                        }`}
                    >
                        {temp}°C
                    </button>
                ))}
            </div>

            <button 
                onClick={() => toggleDevice(ac.id)}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    is_on 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {is_on ? 'Turn Off' : 'Turn On'}
            </button>
        </div>
    );
};


// --- Main DeviceCard Component ---

export const DeviceCard: React.FC<DeviceCardProps> = ({ deviceId }) => {
    const { getDevice } = useDeviceContext();
    // Get the device object, which contains name, room, powerConsumption, etc.
    const device = getDevice(deviceId); 

    if (!device) {
        return <div className="professional-card p-6 flex flex-col justify-center h-96">Device ID {deviceId} Not Found</div>;
    }
    
    let Controls;
    let Icon;
    let is_active = device.status === 'on' || device.status === 'running';

    // Determine controls, icon, and specific active state
    switch (device.type) {
        case 'light':
            Icon = Lightbulb;
            Controls = <LightControls light={device as LightDevice} />; 
            break;
        case 'fan':
            Icon = Fan;
            Controls = <FanControls fan={device as FanDevice} />;
            break;
        case 'ac':
            Icon = Thermometer;
            Controls = <ACControls ac={device as ACDevice} />;
            break;
        case 'lock':
            Icon = Lock;
            Controls = <p className="text-gray-600 text-center mt-4">Status: {device.status === 'on' ? 'Locked' : 'Unlocked'}</p>;
            is_active = device.status === 'on';
            break;
        case 'camera':
            Icon = Video;
            Controls = <p className="text-gray-600 text-center mt-4">Status: {device.status === 'on' ? 'Streaming' : 'Off'}</p>;
            is_active = device.status === 'on';
            break;
        default:
            Icon = Lightbulb;
            Controls = <p className="text-red-500">Unsupported Controls for {device.type}</p>;
    }
    
    const IconComponent = Icon as React.ElementType;

    return (
        <div className="professional-card p-4 flex flex-col justify-between h-96"> 
            {/* Header Status */}
            <div className="flex justify-between items-center mb-4">
                <IconComponent className={`w-8 h-8 ${is_active ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`status-indicator ${device.status !== 'offline' ? 'status-online' : 'status-offline'}`}>
                    {device.status !== 'offline' ? 'Online' : 'Offline'}
                </span>
            </div>

            {/* Title (Pulled from the device object in context) */}
            <h3 className="text-lg font-semibold text-gray-800">{device.name}</h3> 
            <p className="text-sm text-gray-500 mb-4">{device.room}</p>

            {/* Dynamic Controls */}
            {Controls}
            
            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-sm text-gray-500">
                <span className="font-medium">Power Usage</span>
                {/* Power consumption is a static property of the device object */}
                <span className="ml-2 text-blue-600">{device.powerConsumption}W</span>
            </div>
        </div>
    );
};