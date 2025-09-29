// Comprehensive Smart Home Types for Indian Households

export interface Device {
  id: string;
  name: string;
  type: 'light' | 'ac' | 'fan' | 'camera' | 'lock' | 'sensor' | 'geyser' | 'washing_machine' | 
        'refrigerator' | 'microwave' | 'tv' | 'router' | 'inverter' | 'solar_panel' | 'water_pump' | 
        'air_purifier' | 'cooler' | 'induction' | 'mixer' | 'iron' | 'doorbell' | 'smart_switch';
  room: string;
  status: 'on' | 'off' | 'offline' | 'standby' | 'error' | 'maintenance';
  // Device-specific properties
  brightness?: number;
  temperature?: number;
  speed?: number;
  powerConsumption?: number;
  energyRating?: 'A' | 'B' | 'C' | 'D' | 'E';
  // Advanced features
  isScheduled?: boolean;
  automationEnabled?: boolean;
  lastMaintenance?: string;
  nextMaintenance?: string;
  warningLevel?: 'none' | 'low' | 'medium' | 'high';
  operatingHours?: number;
  efficiency?: number;
  // Indian-specific features
  voltageStability?: number;
  powerCutProtection?: boolean;
  monsoonMode?: boolean;
  summerOptimization?: boolean;
}

export interface Room {
  id: string;
  name: string;
  type: 'bedroom' | 'living_room' | 'kitchen' | 'bathroom' | 'balcony' | 'study' | 'dining' | 'terrace' | 'entrance';
  occupancy: number;
  temperature?: number;
  humidity?: number;
  lightLevel?: number;
  devices: Device[];
  automationRules: AutomationRule[];
}

export interface Family {
  id: string;
  members: FamilyMember[];
  routines: Routine[];
  preferences: FamilyPreferences;
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  role: 'adult' | 'child' | 'elderly';
  preferences: {
    preferredTemperature: number;
    sleepTime: string;
    wakeTime: string;
    workingDays: boolean[];
    voiceLanguage: 'english' | 'hindi' | 'tamil' | 'telugu' | 'marathi' | 'bengali' | 'gujarati' | 'kannada';
  };
  location?: 'home' | 'away' | 'work' | 'school';
}

export interface FamilyPreferences {
  energySavingMode: boolean;
  comfortPriority: 'energy' | 'comfort' | 'balanced';
  securityLevel: 'basic' | 'standard' | 'high';
  automationLevel: 'manual' | 'assisted' | 'full';
  budgetMode: boolean;
  monsoonSettings: boolean;
  festivalMode: boolean;
}

export interface Routine {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'seasonal' | 'festival' | 'custom';
  triggers: RoutineTrigger[];
  actions: DeviceAction[];
  conditions: Condition[];
  confidence: number;
  learningEnabled: boolean;
}

export interface RoutineTrigger {
  type: 'time' | 'presence' | 'weather' | 'energy_price' | 'device_status' | 'voice_command';
  value: any;
  operator: 'equals' | 'greater' | 'less' | 'between';
}

export interface DeviceAction {
  deviceId: string;
  action: 'turn_on' | 'turn_off' | 'set_temperature' | 'set_brightness' | 'set_speed' | 'schedule';
  value?: any;
  delay?: number;
}

export interface Condition {
  type: 'weather' | 'time' | 'occupancy' | 'energy_price' | 'device_status';
  operator: 'equals' | 'greater' | 'less' | 'between';
  value: any;
}

export interface EnergyData {
  timestamp: string;
  consumption: number;
  solar: number;
  battery: number;
  grid: number;
  gridPrice?: number;
  carbonFootprint: number;
  peakHours: boolean;
  weatherImpact: number;
}

export interface SolarSystem {
  capacity: number;
  currentGeneration: number;
  efficiency: number;
  batteryCapacity: number;
  batteryLevel: number;
  inverterStatus: 'online' | 'offline' | 'maintenance';
  gridTieEnabled: boolean;
  netMetering: boolean;
}

export interface SecurityEvent {
  id: string;
  type: 'motion' | 'door' | 'window' | 'alarm' | 'gas_leak' | 'water_leak' | 'fire' | 'power_cut' | 'intrusion';
  location: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  falseAlarm?: boolean;
  response?: string;
}

export interface AIInsight {
  id: string;
  category: 'energy' | 'security' | 'comfort' | 'maintenance' | 'health' | 'automation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedSavings?: number;
  implementation: 'automatic' | 'user_approval' | 'manual';
  learningSource: 'usage_pattern' | 'weather' | 'energy_price' | 'device_health' | 'user_feedback';
  indianContext?: {
    monsoonRelevant?: boolean;
    summerOptimization?: boolean;
    festivalSeason?: boolean;
    powerCutAdaptation?: boolean;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: RoutineTrigger;
  actions: DeviceAction[];
  conditions: Condition[];
  learningEnabled: boolean;
  accuracy: number;
  energySavings: number;
}

export interface MaintenanceAlert {
  id: string;
  deviceId: string;
  type: 'scheduled' | 'predictive' | 'breakdown' | 'warranty';
  severity: 'info' | 'warning' | 'critical' | 'urgent';
  title: string;
  description: string;
  estimatedCost?: number;
  recommendedAction: string;
  dueDate?: string;
  serviceProvider?: {
    name: string;
    contact: string;
    rating: number;
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'hazy';
  airQuality: number;
  uvIndex: number;
  monsoonStatus: 'pre' | 'active' | 'post' | 'none';
  recommendation: string[];
}