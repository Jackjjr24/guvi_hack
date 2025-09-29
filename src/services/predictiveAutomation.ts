import { Device, Routine, AutomationRule, FamilyMember, WeatherData, EnergyData } from '../types';

interface UsagePattern {
  name: string;
  type: 'daily' | 'weekly' | 'seasonal' | 'festival' | 'custom';
  triggers: any[];
  actions: any[];
  conditions: any[];
  confidence: number;
}

export class PredictiveAutomationEngine {
  private readonly CONFIDENCE_THRESHOLD = 0.7;
  private readonly LEARNING_RATE = 0.1;

  /**
   * Generate predictive automation rules based on usage patterns
   */
  public generateAutomationRules(
    devices: Device[],
    family: FamilyMember[],
    _routines: Routine[],
    weatherData: WeatherData,
    energyHistory: EnergyData[]
  ): AutomationRule[] {
    const rules: AutomationRule[] = [];

    // Generate family routine-based rules
    rules.push(...this.generateFamilyRoutineRules(devices, family));

    // Generate weather-based automation
    rules.push(...this.generateWeatherBasedRules(devices, weatherData));

    // Generate energy optimization rules
    rules.push(...this.generateEnergyOptimizationRules(devices, energyHistory));

    // Generate Indian household specific rules
    rules.push(...this.generateIndianHouseholdRules(devices, family, weatherData));

    return rules.filter(rule => rule.accuracy >= this.CONFIDENCE_THRESHOLD);
  }

  private generateFamilyRoutineRules(devices: Device[], family: FamilyMember[]): AutomationRule[] {
    const rules: AutomationRule[] = [];

    family.forEach(member => {
      const { preferences } = member;

      // Morning routine automation
      rules.push({
        id: `morning-routine-${member.id}`,
        name: `${member.name}'s Morning Routine`,
        enabled: true,
        trigger: {
          type: 'time',
          value: preferences.wakeTime,
          operator: 'equals'
        },
        actions: [
          {
            deviceId: devices.find(d => d.type === 'light' && d.room === 'bedroom')?.id || '',
            action: 'turn_on',
            value: 30, // Dim brightness
            delay: 0
          },
          {
            deviceId: devices.find(d => d.type === 'geyser' && d.room === 'bathroom')?.id || '',
            action: 'turn_on',
            delay: 0
          },
          {
            deviceId: devices.find(d => d.type === 'ac' && d.room === 'bedroom')?.id || '',
            action: 'turn_off',
            delay: 300 // 5 minutes delay
          }
        ],
        conditions: [
          {
            type: 'occupancy',
            operator: 'equals',
            value: 'home'
          }
        ],
        learningEnabled: true,
        accuracy: 0.85,
        energySavings: 120
      });

      // Evening routine automation
      rules.push({
        id: `evening-routine-${member.id}`,
        name: `${member.name}'s Evening Wind Down`,
        enabled: true,
        trigger: {
          type: 'time',
          value: '21:30',
          operator: 'equals'
        },
        actions: [
          {
            deviceId: devices.find(d => d.type === 'light' && d.room === 'living_room')?.id || '',
            action: 'set_brightness',
            value: 20, // Dim for evening
            delay: 0
          },
          {
            deviceId: devices.find(d => d.type === 'tv')?.id || '',
            action: 'turn_off',
            delay: 1800 // 30 minutes
          }
        ],
        conditions: [
          {
            type: 'occupancy',
            operator: 'equals',
            value: 'home'
          }
        ],
        learningEnabled: true,
        accuracy: 0.78,
        energySavings: 85
      });
    });

    return rules;
  }

  private generateWeatherBasedRules(devices: Device[], weather: WeatherData): AutomationRule[] {
    const rules: AutomationRule[] = [];

    // Monsoon automation rules
    if (weather.monsoonStatus === 'active' || weather.monsoonStatus === 'pre') {
      rules.push({
        id: 'monsoon-ac-optimization',
        name: 'Monsoon AC Optimization',
        enabled: true,
        trigger: {
          type: 'weather',
          value: { humidity: 80 },
          operator: 'greater'
        },
        actions: [
          {
            deviceId: devices.find(d => d.type === 'ac')?.id || '',
            action: 'set_temperature',
            value: 26, // Higher temperature during high humidity
            delay: 0
          },
          {
            deviceId: devices.find(d => d.type === 'cooler')?.id || '',
            action: 'turn_off',
            delay: 0
          }
        ],
        conditions: [
          {
            type: 'weather',
            operator: 'equals',
            value: 'active'
          }
        ],
        learningEnabled: true,
        accuracy: 0.82,
        energySavings: 200
      });
    }

    // Summer optimization
    if (weather.temperature > 35) {
      rules.push({
        id: 'summer-cooling-optimization',
        name: 'Summer Cooling Strategy',
        enabled: true,
        trigger: {
          type: 'weather',
          value: { temperature: 35 },
          operator: 'greater'
        },
        actions: [
          {
            deviceId: devices.find(d => d.type === 'ac')?.id || '',
            action: 'set_temperature',
            value: 24,
            delay: 0
          },
          {
            deviceId: devices.find(d => d.type === 'fan')?.id || '',
            action: 'set_speed',
            value: 4,
            delay: 0
          }
        ],
        conditions: [
          {
            type: 'time',
            operator: 'between',
            value: ['10:00', '18:00']
          }
        ],
        learningEnabled: true,
        accuracy: 0.88,
        energySavings: 180
      });
    }

    return rules;
  }

  private generateEnergyOptimizationRules(devices: Device[], energyHistory: EnergyData[]): AutomationRule[] {
    const rules: AutomationRule[] = [];

    if (energyHistory.length > 7) {
      const avgConsumption = energyHistory.slice(-7).reduce((sum, day) => sum + day.consumption, 0) / 7;
      const peakHours = energyHistory.filter(data => data.peakHours).length > 0;

      if (peakHours) {
        rules.push({
          id: 'peak-hour-load-shifting',
          name: 'Peak Hour Load Shifting',
          enabled: true,
          trigger: {
            type: 'energy_price',
            value: 'peak',
            operator: 'equals'
          },
          actions: [
            {
              deviceId: devices.find(d => d.type === 'washing_machine')?.id || '',
              action: 'turn_off',
              delay: 0
            },
            {
              deviceId: devices.find(d => d.type === 'geyser')?.id || '',
              action: 'turn_off',
              delay: 0
            }
          ],
          conditions: [
            {
              type: 'time',
              operator: 'between',
              value: ['18:00', '22:00']
            }
          ],
          learningEnabled: true,
          accuracy: 0.91,
          energySavings: avgConsumption * 0.15
        });
      }
    }

    return rules;
  }

  private generateIndianHouseholdRules(
    devices: Device[], 
    _family: FamilyMember[], 
    _weather: WeatherData
  ): AutomationRule[] {
    const rules: AutomationRule[] = [];

    // Power cut preparation rule
    rules.push({
      id: 'power-cut-preparation',
      name: 'Power Cut Preparation',
      enabled: true,
      trigger: {
        type: 'device_status',
        value: 'offline',
        operator: 'equals'
      },
      actions: [
        {
          deviceId: devices.find(d => d.type === 'inverter')?.id || '',
          action: 'turn_on',
          delay: 0
        },
        {
          deviceId: devices.find(d => d.type === 'light')?.id || '',
          action: 'set_brightness',
          value: 50, // Conserve battery
          delay: 0
        }
      ],
      conditions: [
        {
          type: 'device_status',
          operator: 'equals',
          value: 'power_cut'
        }
      ],
      learningEnabled: false,
      accuracy: 0.95,
      energySavings: 0
    });

    // Festival season automation
    const month = new Date().getMonth();
    const isFestivalSeason = (month >= 9 && month <= 11) || month === 0; // Oct-Jan

    if (isFestivalSeason) {
      rules.push({
        id: 'festival-lighting',
        name: 'Festival Lighting Automation',
        enabled: true,
        trigger: {
          type: 'time',
          value: '18:00',
          operator: 'equals'
        },
        actions: [
          {
            deviceId: devices.find(d => d.type === 'light' && d.room === 'entrance')?.id || '',
            action: 'turn_on',
            value: 80,
            delay: 0
          },
          {
            deviceId: devices.find(d => d.type === 'light' && d.room === 'balcony')?.id || '',
            action: 'turn_on',
            value: 100,
            delay: 0
          }
        ],
        conditions: [
          {
            type: 'time',
            operator: 'between',
            value: ['18:00', '23:00']
          }
        ],
        learningEnabled: true,
        accuracy: 0.75,
        energySavings: -50 // Negative because it increases consumption during festivals
      });
    }

    // Water heating optimization for Indian households
    rules.push({
      id: 'water-heating-optimization',
      name: 'Smart Water Heating',
      enabled: true,
      trigger: {
        type: 'time',
        value: '05:30',
        operator: 'equals'
      },
      actions: [
        {
          deviceId: devices.find(d => d.type === 'geyser')?.id || '',
          action: 'turn_on',
          delay: 0
        }
      ],
      conditions: [
        {
          type: 'weather',
          operator: 'less',
          value: 20 // Cold weather
        }
      ],
      learningEnabled: true,
      accuracy: 0.87,
      energySavings: 150
    });

    return rules;
  }

  /**
   * Learn and update automation rules based on user feedback
   */
  public updateRuleAccuracy(ruleId: string, userFeedback: 'positive' | 'negative', rules: AutomationRule[]): AutomationRule[] {
    return rules.map(rule => {
      if (rule.id === ruleId && rule.learningEnabled) {
        const adjustment = userFeedback === 'positive' ? this.LEARNING_RATE : -this.LEARNING_RATE;
        const newAccuracy = Math.max(0, Math.min(1, rule.accuracy + adjustment));
        
        return {
          ...rule,
          accuracy: newAccuracy,
          enabled: newAccuracy >= this.CONFIDENCE_THRESHOLD
        };
      }
      return rule;
    });
  }

  /**
   * Generate routine suggestions based on usage patterns
   */
  public suggestNewRoutines(
    _devices: Device[],
    _family: FamilyMember[],
    usageHistory: any[]
  ): Routine[] {
    const suggestions: Routine[] = [];

    // Analyze usage patterns to suggest routines
    const patterns = this.analyzeUsagePatterns(usageHistory);

    patterns.forEach(pattern => {
      if (pattern.confidence > this.CONFIDENCE_THRESHOLD) {
        suggestions.push({
          id: `suggested-${Date.now()}-${Math.random()}`,
          name: pattern.name,
          type: pattern.type,
          triggers: pattern.triggers,
          actions: pattern.actions,
          conditions: pattern.conditions,
          confidence: pattern.confidence,
          learningEnabled: true
        });
      }
    });

    return suggestions;
  }

  private analyzeUsagePatterns(usageHistory: any[]): UsagePattern[] {
    // Simplified pattern analysis
    // In real implementation, this would use machine learning algorithms
    
    const patterns: UsagePattern[] = [];

    // Example pattern: Consistent device usage at specific times
    const timeBasedUsage = this.groupUsageByTime(usageHistory);
    
    Object.entries(timeBasedUsage).forEach(([time, devices]) => {
      if (devices.length >= 2) { // Multiple devices used consistently at same time
        patterns.push({
          name: `${time} Routine`,
          type: 'daily',
          triggers: [{
            type: 'time',
            value: time,
            operator: 'equals'
          }],
          actions: devices.map((device: any) => ({
            deviceId: device.id,
            action: device.mostCommonAction,
            value: device.mostCommonValue
          })),
          conditions: [],
          confidence: Math.min(0.95, devices.length * 0.2 + 0.5)
        });
      }
    });

    return patterns;
  }

  private groupUsageByTime(usageHistory: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};
    
    usageHistory.forEach(usage => {
      const hour = new Date(usage.timestamp).getHours();
      const timeKey = `${hour}:00`;
      
      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }
      
      grouped[timeKey].push(usage);
    });

    return grouped;
  }

  /**
   * Calculate automation efficiency and energy savings
   */
  public calculateAutomationEfficiency(rules: AutomationRule[]): {
    totalRules: number;
    activeRules: number;
    averageAccuracy: number;
    totalEnergySavings: number;
  } {
    const activeRules = rules.filter(rule => rule.enabled);
    const averageAccuracy = activeRules.length > 0 
      ? activeRules.reduce((sum, rule) => sum + rule.accuracy, 0) / activeRules.length
      : 0;
    const totalEnergySavings = activeRules.reduce((sum, rule) => sum + rule.energySavings, 0);

    return {
      totalRules: rules.length,
      activeRules: activeRules.length,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      totalEnergySavings: Math.round(totalEnergySavings)
    };
  }
}

export const predictiveAutomationEngine = new PredictiveAutomationEngine();