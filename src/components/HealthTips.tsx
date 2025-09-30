import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Droplets, Dumbbell, Moon, Apple, Brain, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function HealthTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    fetchHealthTips();
  }, []);

  const fetchHealthTips = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/health-tips`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTips(data.tips || []);
      }
    } catch (error) {
      console.error('Error fetching health tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return <Apple className="w-5 h-5" />;
      case 'fitness':
        return <Dumbbell className="w-5 h-5" />;
      case 'wellness':
        return <Moon className="w-5 h-5" />;
      case 'mental-health':
        return <Brain className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition':
        return 'bg-green-100 text-green-800';
      case 'fitness':
        return 'bg-orange-100 text-orange-800';
      case 'wellness':
        return 'bg-purple-100 text-purple-800';
      case 'mental-health':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-pink-100 text-pink-800';
    }
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-300 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading health tips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Health Tips</h2>
        <p className="text-gray-600">Stay healthy with our expert advice</p>
      </div>

      {/* Featured Tip of the Day */}
      {tips.length > 0 && (
        <Card className="bg-gradient-to-r from-pink-500 to-pink-400 text-white border-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Droplets className="w-6 h-6" />
                <span>Tip of the Day</span>
              </CardTitle>
              <Button
                size="sm"
                variant="secondary"
                onClick={nextTip}
                className="bg-white/20 hover:bg-white/30 text-white border-none"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-xl mb-2">{tips[currentTip]?.title}</h3>
            <p className="text-pink-100 leading-relaxed">{tips[currentTip]?.content}</p>
          </CardContent>
        </Card>
      )}

      {/* All Tips */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">All Health Tips</h3>
        <div className="grid gap-4">
          {tips.map((tip, index) => (
            <Card key={tip.id} className="border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                    {getCategoryIcon(tip.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{tip.content}</p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getCategoryColor(tip.category)}`}
                      >
                        {tip.category.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Health Challenge */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2 text-blue-900">
            <Heart className="w-6 h-6" />
            <span>This Week's Challenge</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-blue-900 mb-2">7-Day Hydration Challenge</h3>
          <p className="text-blue-800 text-sm mb-4">
            Drink at least 8 glasses of water every day this week. Track your progress and feel the difference!
          </p>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              Join Challenge
            </Button>
            <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health Categories */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'Nutrition', icon: Apple, color: 'green', tips: 'Diet & Eating' },
          { name: 'Fitness', icon: Dumbbell, color: 'orange', tips: 'Exercise & Movement' },
          { name: 'Mental Health', icon: Brain, color: 'blue', tips: 'Mind & Emotions' },
          { name: 'Sleep', icon: Moon, color: 'purple', tips: 'Rest & Recovery' }
        ].map((category) => (
          <Card key={category.name} className="border-pink-100 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <category.icon className={`w-6 h-6 text-${category.color}-600`} />
              </div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.tips}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Health Contacts */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-lg text-red-900">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-red-800">Emergency Hotline</span>
              <span className="font-semibold text-red-900">911</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-800">Poison Control</span>
              <span className="font-semibold text-red-900">1-800-222-1222</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-800">Mental Health Crisis</span>
              <span className="font-semibold text-red-900">988</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}