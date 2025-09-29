# 🏠 AI-Powered Smart Home Automation Platform

<div align="center">

![Smart Home Banner](https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=Smart+Home+Automation+Platform)

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**A comprehensive AI-powered smart home automation platform designed specifically for Indian households**

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing)

</div>

## 🌟 Overview

Transform your Indian home into an intelligent, energy-efficient, and secure smart home with our comprehensive automation platform. Built with modern web technologies and tailored for Indian households, this system optimizes energy consumption, enhances security, and improves living comfort through intelligent device management and predictive automation.

## ✨ Key Features

### 🏡 Smart Device Management
- **20+ Indian Device Types**: Geysers, Inverters, Desert Coolers, Ceiling Fans, ACs, and more
- **Real-time Control**: Instant device status monitoring and control
- **Room-based Organization**: Manage devices by rooms (Living Room, Kitchen, Bedroom, etc.)
- **Custom Device Profiles**: Tailored settings for each device type

### 🧠 AI-Powered Energy Optimization
- **Solar Panel Integration**: Intelligent solar energy management and grid switching
- **Dynamic Tariff Awareness**: Optimizes usage based on Indian electricity pricing tiers
- **Peak Hour Management**: Automatic load balancing during high-demand periods
- **Energy Consumption Analytics**: Detailed insights with cost predictions

### 🔮 Predictive Automation
- **Family Pattern Learning**: Adapts to your daily routines and preferences
- **Weather-based Automation**: Adjusts settings based on Indian weather patterns
- **Smart Scheduling**: Optimizes device usage for comfort and efficiency
- **Routine Recommendations**: AI suggests energy-saving automation routines

### 🛡️ Advanced Security System
- **Indian Home Threats Detection**: Gas leaks, water leaks, power cuts, intrusion
- **Emergency Response**: Automatic alerts and safety protocols
- **Multi-sensor Integration**: Motion, door/window, smoke, and water sensors
- **Real-time Monitoring**: 24/7 security dashboard with instant notifications

### 🎤 Multilingual Voice Control
- **9 Indian Languages**: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, and more
- **Hugging Face Whisper Integration**: Advanced AI speech recognition
- **Natural Language Processing**: Understands conversational commands
- **Offline Fallback**: Web Speech API for reliable voice control

### 📊 Comprehensive Dashboard
- **Unified Control Center**: All devices and systems in one place
- **AI Insights**: Intelligent recommendations and analytics
- **Weather Integration**: Local weather data for smart automation
- **Energy Reports**: Detailed consumption analysis and cost breakdowns

### Voice Command Examples

```
English: "Turn on the living room lights"
Hindi: "लिविंग रूम की लाइट चालू करो"
Tamil: "வாழ்க்கை அறை விளக்குகளை இயக்கவும்"
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe development with enhanced developer experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling

### AI & Voice
- **Hugging Face Transformers** - Advanced speech recognition with Whisper models
- **Web Speech API** - Browser-native voice recognition fallback
- **Natural Language Processing** - Command understanding and intent recognition

### State Management
- **React Context API** - Centralized state management for devices, energy, and security
- **Custom Hooks** - Reusable logic for device control and automation

### Development Tools
- **ESLint** - Code quality and consistency enforcement
- **PostCSS** - CSS processing and optimization
- **TypeScript Compiler** - Static type checking and compilation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** for version control
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-home-automation.git
cd smart-home-automation
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Optional: Hugging Face API for advanced voice recognition
REACT_APP_HUGGING_FACE_API_KEY=your_hugging_face_api_key_here

# Optional: Weather API for automation
REACT_APP_WEATHER_API_KEY=your_weather_api_key_here

# Optional: Supabase for data persistence
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🔧 Usage

### Basic Setup

1. **Device Configuration**: Add your smart devices through the dashboard
2. **Room Assignment**: Organize devices by rooms for better management
3. **Voice Training**: Test voice commands in your preferred language
4. **Automation Rules**: Set up basic automation routines

### Advanced Features

#### Energy Optimization
```typescript
// Example: Set up solar panel integration
const solarConfig = {
  capacity: 5000, // 5kW system
  batteryBackup: 10000, // 10kWh battery
  gridTariff: [
    { time: "00:00-06:00", rate: 3.5 },
    { time: "06:00-18:00", rate: 6.2 },
    { time: "18:00-22:00", rate: 8.1 },
    { time: "22:00-24:00", rate: 5.4 }
  ]
};
```

#### Voice Commands
```javascript
// Supported command patterns
const voiceCommands = [
  "Turn {on/off} the {device} in {room}",
  "Set {device} temperature to {value} degrees",
  "Activate {automation} mode",
  "Show energy consumption report",
  "Increase/decrease {device} speed"
];
```

#### Security Automation
```typescript
// Example: Set up security automation
const securityRules = [
  {
    trigger: "motion_detected",
    condition: "armed_mode",
    action: "send_alert_and_record"
  },
  {
    trigger: "gas_leak_detected",
    action: "turn_off_gas_valve_and_alert"
  }
];
```

## 📱 API Reference

### Device Control API

```typescript
interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  status: boolean;
  properties: DeviceProperties;
}

// Toggle device state
toggleDevice(deviceId: string): Promise<void>

// Update device properties
updateDevice(deviceId: string, properties: Partial<DeviceProperties>): Promise<void>
```

### Voice Assistant API

```typescript
interface VoiceCommand {
  text: string;
  confidence: number;
  language: string;
  timestamp: Date;
}

// Process voice command
processVoiceCommand(command: string, confidence: number): Promise<void>

// Start voice recognition
startListening(): Promise<void>
```

## 🔌 Hardware Integration

### Supported Devices

| Device Type | Models Tested | Communication Protocol |
|-------------|---------------|------------------------|
| **Smart Switches** | Wipro, Anchor, Havells | WiFi, Zigbee |
| **AC Controllers** | Sensibo, Cielo | IR, WiFi |
| **Water Heaters** | Bajaj, Racold, AO Smith | WiFi, Smart Plugs |
| **Security Cameras** | Mi, TP-Link, D-Link | WiFi, RTSP |
| **Sensors** | Xiaomi, Sonoff, ESP32 | WiFi, Zigbee |

### Integration Guidelines

1. **WiFi Devices**: Direct HTTP/MQTT communication
2. **Zigbee Devices**: Use Zigbee2MQTT bridge
3. **IR Devices**: ESP32-based IR blasters
4. **Custom Sensors**: Arduino/ESP32 with REST API

## 🏗️ Project Structure

```
src/
├── components/           
│   ├── Dashboard.tsx     
│   ├── VoiceAssistant.tsx 
│   ├── DeviceCard.tsx    
│   ├── EnergyChart.tsx   
│   └── SecurityPanel.tsx 
├── contexts/            
│   ├── DeviceContext.tsx 
│   ├── EnergyContext.tsx 
│   └── SecurityContext.tsx 
├── services/             
│   ├── whisperService.ts 
│   ├── aiEnergyOptimizer.ts 
│   └── predictiveAutomation.ts 
├── types/                
│   └── index.ts          
└── utils/                
    ├── deviceUtils.ts    
    └── energyCalculations.ts
```


## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Areas

- 🆕 **New Device Integrations**: Add support for more Indian smart devices
- 🌐 **Language Support**: Expand multilingual capabilities
- 🤖 **AI Improvements**: Enhance energy optimization algorithms
- 🛡️ **Security Features**: Strengthen security monitoring
- 📱 **Mobile App**: React Native mobile companion
- 🔌 **Hardware Drivers**: IoT device communication protocols

### Code Style

- Follow TypeScript best practices
- Use Prettier for code formatting
- Maintain test coverage above 80%
- Write meaningful commit messages
- Document new features and APIs

## 🙏 Acknowledgments

- **Hugging Face** for advanced AI speech recognition models
- **React Team** for the amazing React ecosystem
- **Tailwind CSS** for the utility-first CSS framework
- **Indian Smart Home Community** for feature suggestions and testing


</div>
