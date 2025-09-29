import { Device, EnergyData, AIInsight, WeatherData, FamilyMember, SolarSystem } from '../types';

interface ScheduleRecommendation {
  deviceId: string;
  recommendedTime: string;
  reason: string;
}

interface OptimalSchedule {
  offPeak: ScheduleRecommendation[];
  solar: ScheduleRecommendation[];
  standard: ScheduleRecommendation[];
}

export class AIEnergyOptimizer {
  // Indian electricity tariff structure
  private readonly TARIFF_RATES = {
    peak: 8.5,      // ₹8.5 per unit (6 PM - 10 PM)
    standard: 6.2,  // ₹6.2 per unit (normal hours)
    offPeak: 4.8,   // ₹4.8 per unit (11 PM - 5 AM)
    solar: 3.2      // ₹3.2 per unit (feed-in tariff)
  };

  private readonly DEVICE_EFFICIENCY = {
    'ac': { optimal: 24, maxConsumption: 1500, summerBoost: 1.3 },
    'geyser': { optimal: 60, maxConsumption: 2000, winterBoost: 1.2 },
    'cooler': { optimal: 3, maxConsumption: 200, summerBoost: 1.5 },
    'fan': { optimal: 4, maxConsumption: 75, summerBoost: 1.1 },
    'refrigerator': { optimal: 4, maxConsumption: 150, monsoonBoost: 1.1 },
    'washing_machine': { optimal: 40, maxConsumption: 500, monsoonBoost: 1.2 }
  };

  /**
   * Generate AI-powered energy insights for Indian households
   */
  public generateEnergyInsights(
    devices: Device[],
    energyHistory: EnergyData[],
    weather: WeatherData,
    solarSystem: SolarSystem,
    family: FamilyMember[]
  ): AIInsight[] {
    const insights: AIInsight[] = [];
    const currentHour = new Date().getHours();
    const isPeakHour = currentHour >= 18 && currentHour <= 22;
    
    // Solar optimization insights
    insights.push(...this.generateSolarInsights(solarSystem, weather, energyHistory));
    
    // Load balancing insights
    insights.push(...this.generateLoadBalancingInsights(devices, isPeakHour));
    
    // Weather-based optimization
    insights.push(...this.generateWeatherInsights(devices, weather));
    
    // Seasonal optimization for Indian climate
    insights.push(...this.generateSeasonalInsights(devices, weather, family));
    
    // Cost optimization insights
    insights.push(...this.generateCostOptimizationInsights(devices, energyHistory));
    
    // Power cut preparation
    insights.push(...this.generatePowerCutInsights(devices, solarSystem));

    return insights.sort((a, b) => 
      b.priority === 'urgent' ? 1 : 
      a.priority === 'urgent' ? -1 : 
      b.confidence - a.confidence
    );
  }

  private generateSolarInsights(solar: SolarSystem, weather: WeatherData, _history: EnergyData[]): AIInsight[] {
    const insights: AIInsight[] = [];
    
    if (solar.currentGeneration < solar.capacity * 0.7 && weather.condition === 'sunny') {
      insights.push({
        id: `solar-efficiency-${Date.now()}`,
        category: 'energy',
        title: 'Solar Panel Cleaning Recommended',
        description: `Solar generation is ${Math.round((solar.currentGeneration/solar.capacity)*100)}% of capacity despite sunny weather. Cleaning panels could increase generation by 15-20%.`,
        confidence: 0.85,
        actionable: true,
        priority: 'medium',
        estimatedSavings: 150,
        implementation: 'manual',
        learningSource: 'device_health',
        indianContext: {
          summerOptimization: true,
          powerCutAdaptation: true
        }
      });
    }

    if (solar.batteryLevel < 0.3 && weather.condition === 'sunny' && new Date().getHours() < 16) {
      insights.push({
        id: `battery-charging-${Date.now()}`,
        category: 'energy',
        title: 'Optimize Battery Charging',
        description: 'Battery level is low but good solar generation expected. Consider reducing high-power appliance usage to maximize battery charging.',
        confidence: 0.92,
        actionable: true,
        priority: 'high',
        estimatedSavings: 200,
        implementation: 'user_approval',
        learningSource: 'weather',
        indianContext: {
          powerCutAdaptation: true
        }
      });
    }

    return insights;
  }

  private generateLoadBalancingInsights(devices: Device[], isPeakHour: boolean): AIInsight[] {
    const insights: AIInsight[] = [];
    const highPowerDevices = devices.filter(d => 
      d.status === 'on' && 
      (d.powerConsumption || 0) > 1000
    );

    if (isPeakHour && highPowerDevices.length > 2) {
      insights.push({
        id: `peak-hour-${Date.now()}`,
        category: 'energy',
        title: 'Peak Hour Load Optimization',
        description: `${highPowerDevices.length} high-power devices active during peak hours (₹${this.TARIFF_RATES.peak}/unit). Consider scheduling non-essential appliances for off-peak hours.`,
        confidence: 0.88,
        actionable: true,
        priority: 'high',
        estimatedSavings: 350,
        implementation: 'user_approval',
        learningSource: 'energy_price'
      });
    }

    return insights;
  }

  private generateWeatherInsights(devices: Device[], weather: WeatherData): AIInsight[] {
    const insights: AIInsight[] = [];

    // Monsoon insights
    if (weather.monsoonStatus === 'active') {
      const geysers = devices.filter(d => d.type === 'geyser');
      if (geysers.some(g => g.status === 'on' && (g.temperature || 0) > 45)) {
        insights.push({
          id: `monsoon-geyser-${Date.now()}`,
          category: 'energy',
          title: 'Monsoon Water Heating Optimization',
          description: 'During monsoon, water temperature is naturally higher. Reduce geyser temperature to 40°C to save 20% energy.',
          confidence: 0.82,
          actionable: true,
          priority: 'medium',
          estimatedSavings: 180,
          implementation: 'automatic',
          learningSource: 'weather',
          indianContext: {
            monsoonRelevant: true
          }
        });
      }
    }

    // Summer optimization
    if (weather.temperature > 35 && weather.condition === 'sunny') {
      const acs = devices.filter(d => d.type === 'ac' && d.status === 'on');
      if (acs.some(ac => (ac.temperature || 0) < 22)) {
        insights.push({
          id: `summer-ac-${Date.now()}`,
          category: 'energy',
          title: 'Summer AC Optimization',
          description: 'Set AC temperature to 24°C during hot summer days. Each degree increase saves 6-8% energy.',
          confidence: 0.91,
          actionable: true,
          priority: 'high',
          estimatedSavings: 400,
          implementation: 'user_approval',
          learningSource: 'weather',
          indianContext: {
            summerOptimization: true
          }
        });
      }
    }

    return insights;
  }

  private generateSeasonalInsights(devices: Device[], weather: WeatherData, family: FamilyMember[]): AIInsight[] {
    const insights: AIInsight[] = [];
    const month = new Date().getMonth();
    const isWinter = month >= 11 || month <= 2;

    // Winter optimization
    if (isWinter && weather.temperature < 20) {
      const geysers = devices.filter(d => d.type === 'geyser');
      const familyWakeupTimes = family.map(member => member.preferences.wakeTime);
      
      if (geysers.length > 0) {
        insights.push({
          id: `winter-schedule-${Date.now()}`,
          category: 'energy',
          title: 'Winter Energy Scheduling',
          description: `Schedule geyser heating 30 minutes before family wake-up times (${familyWakeupTimes.join(', ')}) to avoid heating during peak hours.`,
          confidence: 0.87,
          actionable: true,
          priority: 'medium',
          estimatedSavings: 250,
          implementation: 'user_approval',
          learningSource: 'usage_pattern'
        });
      }
    }

    return insights;
  }

  private generateCostOptimizationInsights(_devices: Device[], history: EnergyData[]): AIInsight[] {
    const insights: AIInsight[] = [];
    
    if (history.length > 7) {
      const avgDailyConsumption = history.slice(-7).reduce((sum, day) => sum + day.consumption, 0) / 7;
      const avgDailyCost = avgDailyConsumption * this.TARIFF_RATES.standard;

      if (avgDailyCost > 100) {
        insights.push({
          id: `cost-alert-${Date.now()}`,
          category: 'energy',
          title: 'High Energy Cost Alert',
          description: `Daily average cost is ₹${avgDailyCost.toFixed(2)}. Consider implementing scheduled automation to reduce consumption by 15-20%.`,
          confidence: 0.89,
          actionable: true,
          priority: 'high',
          estimatedSavings: Math.round(avgDailyCost * 0.18 * 30),
          implementation: 'user_approval',
          learningSource: 'energy_price'
        });
      }
    }

    return insights;
  }

  private generatePowerCutInsights(devices: Device[], solar: SolarSystem): AIInsight[] {
    const insights: AIInsight[] = [];
    
    if (solar.batteryLevel < 0.4) {
      const criticalDevices = devices.filter(d => 
        d.powerCutProtection && d.status === 'on'
      ).length;

      if (criticalDevices > 3) {
        insights.push({
          id: `power-cut-prep-${Date.now()}`,
          category: 'energy',
          title: 'Power Cut Preparation',
          description: `Battery level is ${Math.round(solar.batteryLevel*100)}%. Reduce non-essential device usage to ensure backup power for critical appliances.`,
          confidence: 0.95,
          actionable: true,
          priority: 'urgent',
          estimatedSavings: 0,
          implementation: 'automatic',
          learningSource: 'device_health',
          indianContext: {
            powerCutAdaptation: true
          }
        });
      }
    }

    return insights;
  }

  /**
   * Calculate optimal device scheduling for cost savings
   */
  public generateOptimalSchedule(devices: Device[], solar: SolarSystem, _family: FamilyMember[]): OptimalSchedule {
    const schedule: OptimalSchedule = {
      offPeak: [],
      solar: [],
      standard: []
    };

    devices.forEach(device => {
      if (device.type === 'washing_machine' || device.type === 'geyser') {
        // Schedule high-power appliances during solar hours or off-peak
        if (solar.currentGeneration > 1000) {
          schedule.solar.push({
            deviceId: device.id,
            recommendedTime: '11:00',
            reason: 'Maximum solar generation'
          });
        } else {
          schedule.offPeak.push({
            deviceId: device.id,
            recommendedTime: '02:00',
            reason: 'Lowest electricity rates'
          });
        }
      }
    });

    return schedule;
  }

  /**
   * Calculate potential savings from AI optimization
   */
  public calculatePotentialSavings(_devices: Device[], energyHistory: EnergyData[]): number {
    const currentConsumption = energyHistory.slice(-30).reduce((sum, day) => sum + day.consumption, 0);
    const optimizationPotential = {
      scheduling: 0.15,      // 15% savings from optimal scheduling
      automation: 0.12,      // 12% savings from smart automation
      loadBalancing: 0.08,   // 8% savings from load balancing
      weatherOptimization: 0.10 // 10% savings from weather-based optimization
    };

    const totalOptimization = Object.values(optimizationPotential).reduce((sum, val) => sum + val, 0);
    const monthlySavings = (currentConsumption * this.TARIFF_RATES.standard * totalOptimization);
    
    return Math.round(monthlySavings);
  }

  /**
   * Get device-specific efficiency recommendations
   */
  public getDeviceEfficiencyRecommendation(device: Device, weather: WeatherData): string | null {
    const efficiency = this.DEVICE_EFFICIENCY[device.type as keyof typeof this.DEVICE_EFFICIENCY];
    if (!efficiency) return null;

    switch (device.type) {
      case 'ac':
        if (weather.temperature > 35) {
          return `Set temperature to ${efficiency.optimal}°C for optimal efficiency during hot weather`;
        }
        break;
      case 'geyser':
        if (weather.monsoonStatus === 'active') {
          return `Reduce temperature to ${efficiency.optimal - 15}°C during monsoon season`;
        }
        break;
      case 'cooler':
        if (weather.humidity > 70) {
          return `Reduce cooler usage during high humidity (${weather.humidity}%) - consider AC instead`;
        }
        break;
      default:
        break;
    }

    return null;
  }
}

export const aiEnergyOptimizer = new AIEnergyOptimizer();