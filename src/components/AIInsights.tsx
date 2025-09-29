import { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Shield, 
  Wrench, 
  Sun, 
  Battery,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  CheckCircle,
  Clock,
  IndianRupee,
  Lightbulb,
  Target,
  BarChart3
} from 'lucide-react';
import { AIInsight, Device, EnergyData, WeatherData, FamilyMember, SolarSystem } from '../types';
import { aiEnergyOptimizer } from '../services/aiEnergyOptimizer';

interface AIInsightsProps {
  devices?: Device[];
  energyHistory?: EnergyData[];
  weather?: WeatherData;
  solarSystem?: SolarSystem;
  family?: FamilyMember[];
}

const AIInsights = ({ 
  devices = [], 
  energyHistory = [], 
  weather = {
    temperature: 28,
    humidity: 65,
    condition: 'sunny',
    airQuality: 85,
    uvIndex: 7,
    monsoonStatus: 'pre',
    recommendation: ['Use AC efficiently', 'Solar generation optimal']
  },
  solarSystem = {
    capacity: 5000,
    currentGeneration: 3200,
    efficiency: 85,
    batteryCapacity: 10000,
    batteryLevel: 0.75,
    inverterStatus: 'online',
    gridTieEnabled: true,
    netMetering: true
  },
  family = []
}: AIInsightsProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [potentialSavings, setPotentialSavings] = useState<number>(0);
  const [autoImplementCount, setAutoImplementCount] = useState<number>(0);

  const categories = [
    { id: 'all', label: 'All Insights', icon: Brain },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'comfort', label: 'Comfort', icon: Thermometer },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'health', label: 'Health', icon: Wind }
  ];

  useEffect(() => {
    const generatedInsights = aiEnergyOptimizer.generateEnergyInsights(
      devices,
      energyHistory,
      weather,
      solarSystem,
      family
    );
    
    setInsights(generatedInsights);
    
    const savings = aiEnergyOptimizer.calculatePotentialSavings(devices, energyHistory);
    setPotentialSavings(savings);
    
    const autoCount = generatedInsights.filter(insight => 
      insight.implementation === 'automatic'
    ).length;
    setAutoImplementCount(autoCount);
  }, [devices, energyHistory, weather, solarSystem, family]);

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return CheckCircle;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energy': return Zap;
      case 'security': return Shield;
      case 'comfort': return Thermometer;
      case 'maintenance': return Wrench;
      case 'health': return Wind;
      default: return Lightbulb;
    }
  };

  const getImplementationBadge = (implementation: string) => {
    switch (implementation) {
      case 'automatic':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Auto</span>;
      case 'user_approval':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Approval</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Manual</span>;
    }
  };

  const formatValue = (value: number): string => {
    return parseFloat(value.toFixed(2)).toString();
  };

  return (
    <div className="space-y-6">
      {/* AI Dashboard Header */}
      <div className="professional-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Smart Home Intelligence</h2>
              <p className="text-gray-600">Optimizing your home for Indian households</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">₹{formatValue(potentialSavings)}</div>
            <div className="text-sm text-gray-600">Monthly Savings Potential</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Insights</p>
                <p className="text-2xl font-bold text-blue-700">{insights.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Auto Actions</p>
                <p className="text-2xl font-bold text-green-700">{autoImplementCount}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Weather Impact</p>
                <p className="text-2xl font-bold text-yellow-700">{formatValue(weather.temperature)}°C</p>
              </div>
              <Sun className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Battery Level</p>
                <p className="text-2xl font-bold text-purple-700">{formatValue(solarSystem.batteryLevel * 100)}%</p>
              </div>
              <Battery className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Weather & System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Thermometer className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Weather: {weather.condition}</p>
                <p className="text-sm text-blue-700">{formatValue(weather.temperature)}°C, {formatValue(weather.humidity)}% humidity</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Sun className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Solar Generation</p>
                <p className="text-sm text-green-700">{formatValue(solarSystem.currentGeneration)}W / {formatValue(solarSystem.capacity)}W</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Droplets className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-900">Monsoon Status</p>
                <p className="text-sm text-purple-700 capitalize">{weather.monsoonStatus || 'none'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="professional-card p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.label}</span>
                {category.id === 'all' && (
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                    {insights.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="professional-card p-8 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
            <p className="text-gray-600">AI is analyzing your home data. Check back in a few minutes.</p>
          </div>
        ) : (
          filteredInsights.map((insight) => {
            const CategoryIcon = getCategoryIcon(insight.category);
            const PriorityIcon = getPriorityIcon(insight.priority);
            
            return (
              <div
                key={insight.id}
                className={`professional-card p-6 border-l-4 ${
                  insight.priority === 'urgent' ? 'border-l-red-500' :
                  insight.priority === 'high' ? 'border-l-orange-500' :
                  insight.priority === 'medium' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      insight.priority === 'urgent' ? 'bg-red-100' :
                      insight.priority === 'high' ? 'bg-orange-100' :
                      insight.priority === 'medium' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <CategoryIcon className={`h-5 w-5 ${
                        insight.priority === 'urgent' ? 'text-red-600' :
                        insight.priority === 'high' ? 'text-orange-600' :
                        insight.priority === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                          <PriorityIcon className="h-3 w-3" />
                          <span className="capitalize">{insight.priority}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{insight.description}</p>
                      
                      {/* Indian Context Indicators */}
                      {insight.indianContext && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {insight.indianContext.monsoonRelevant && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Droplets className="h-3 w-3 mr-1" />
                              Monsoon
                            </span>
                          )}
                          {insight.indianContext.summerOptimization && (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Sun className="h-3 w-3 mr-1" />
                              Summer
                            </span>
                          )}
                          {insight.indianContext.powerCutAdaptation && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Zap className="h-3 w-3 mr-1" />
                              Power Backup
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Confidence: {formatValue(insight.confidence * 100)}%</span>
                          {insight.estimatedSavings && (
                            <span className="flex items-center text-green-600 font-medium">
                              <IndianRupee className="h-4 w-4 mr-1" />
                              {formatValue(insight.estimatedSavings)} savings
                            </span>
                          )}
                        </div>
                        {getImplementationBadge(insight.implementation)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {insight.actionable && (
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                    {insight.implementation === 'automatic' ? (
                      <button className="btn-primary">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Auto-Applied
                      </button>
                    ) : (
                      <>
                        <button className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          Dismiss
                        </button>
                        <button className="btn-primary">
                          <Target className="h-4 w-4 mr-2" />
                          Implement
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Learning Progress */}
      <div className="professional-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Learning Progress</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Usage Patterns</p>
            <div className="flex items-center justify-between">
              <div className="w-full bg-blue-200 rounded-full h-2 mr-3">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <span className="text-blue-700 font-medium">78%</span>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Energy Optimization</p>
            <div className="flex items-center justify-between">
              <div className="w-full bg-green-200 rounded-full h-2 mr-3">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-green-700 font-medium">65%</span>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Indian Context</p>
            <div className="flex items-center justify-between">
              <div className="w-full bg-purple-200 rounded-full h-2 mr-3">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <span className="text-purple-700 font-medium">92%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;