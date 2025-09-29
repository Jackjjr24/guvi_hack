// Base structure for any device status update
export interface BaseDevice {
    id: string;
    type: 'light' | 'fan' | 'security' | 'thermostat' | string;
    state: 'on' | 'off' | 'running' | 'locked' | string;
    last_updated: number; // Unix timestamp
}

export interface LightState extends BaseDevice {
    type: 'light';
    brightness: number; // 0-100
}

export interface FanState extends BaseDevice {
    type: 'fan';
    speed: number; // 0-5 (matching your UI)
    mode: 'normal' | 'sleep' | 'off' | string;
}

export interface SecurityState extends BaseDevice {
    type: 'security';
    locked: boolean;
    battery: number; // percentage
}

export type DeviceState = LightState | FanState | SecurityState;

export interface CommandPayload {
    action: string;
    value: string | number | boolean;
}