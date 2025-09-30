import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Crown, Check, Star, Users, Building, 
  MessageCircle, Phone, Truck, FileText,
  Calendar, Shield, Gift, Zap
} from 'lucide-react';

interface SubscriptionPlansProps {
  user: any;
}

export function SubscriptionPlans({ user }: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState('individual');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'individual',
      name: 'Individual Plan',
      price: { monthly: 99, yearly: 990 },
      description: 'Perfect for personal healthcare needs',
      icon: Crown,
      color: 'pink',
      features: [
        'Unlimited 24/7 chat and call support with doctors',
        'Free bookings (no ₱5-10 fee per consult)',
        'Discounted medicine delivery fees',
        'Access to digital prescriptions & medical certificates',
        'Health tips & reminders via SMS/email',
        'Priority customer support'
      ],
      popular: false
    },
    {
      id: 'family',
      name: 'Family Plan',
      price: { monthly: 299, yearly: 2990 },
      description: 'Comprehensive healthcare for the whole family',
      icon: Users,
      color: 'blue',
      features: [
        'All features in Individual Plan, plus:',
        'Shared family account (1 subscription covers up to 4 members)',
        'Priority booking for consultations',
        'Discounts on lab tests for family members',
        'Monthly family health reports',
        'Family health calendar & reminders',
        'Emergency contact notifications'
      ],
      popular: true
    },
    {
      id: 'corporate',
      name: 'Corporate Plan',
      price: { monthly: 799, yearly: 7990 },
      description: 'Enterprise healthcare solution for businesses',
      icon: Building,
      color: 'purple',
      features: [
        'All features in Family Plan, plus:',
        'Dashboard for HR/management (up to 20 employees)',
        'Monitor employee usage & wellness stats',
        'Access to wellness webinars (nutrition, mental health, fitness)',
        'Annual health screenings & check-up discounts',
        'Option to include dependents (small add-on fee)',
        'Dedicated account manager',
        'Custom reporting & analytics'
      ],
      popular: false
    }
  ];

  const currentPlan = plans.find(plan => plan.id === selectedPlan);
  const yearlyDiscount = Math.round((1 - (currentPlan?.price.yearly / (currentPlan?.price.monthly * 12))) * 100);

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colors = {
      pink: { bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-500' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500' }
    };
    return colors[color]?.[variant] || colors.pink[variant];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Plans</h2>
        <p className="text-gray-600">Choose the perfect plan for your healthcare needs</p>
      </div>

      {/* Current Plan Status */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Current Plan: Free</h3>
                <p className="text-green-700 text-sm">
                  Basic consultation booking • ₱5-10 per consultation
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
              Save {yearlyDiscount}%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative border-2 transition-all cursor-pointer hover:shadow-lg ${
              selectedPlan === plan.id
                ? `${getColorClasses(plan.color, 'border')} shadow-lg`
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${getColorClasses(plan.color, 'bg')} bg-opacity-10 rounded-full flex items-center justify-center`}>
                    <plan.icon className={`w-6 h-6 ${getColorClasses(plan.color, 'text')}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-gray-900">
                      ₱{plan.price[billingCycle]}
                    </span>
                    <span className="text-gray-600 text-sm">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-600">
                      Save ₱{(plan.price.monthly * 12) - plan.price.yearly}
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <p className={`text-sm ${
                      feature.startsWith('All features') 
                        ? 'font-medium text-gray-900' 
                        : 'text-gray-700'
                    }`}>
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <Button 
                  className={`w-full ${
                    selectedPlan === plan.id
                      ? `${getColorClasses(plan.color, 'bg')} hover:opacity-90 text-white`
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  variant={selectedPlan === plan.id ? 'default' : 'outline'}
                >
                  {selectedPlan === plan.id ? 'Selected Plan' : 'Select Plan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Options */}
      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-lg">Payment Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'PayPal', icon: '💳' },
              { name: 'PayMaya', icon: '📱' },
              { name: 'GCash', icon: '💰' }
            ].map((payment) => (
              <div key={payment.name} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
                <span className="text-2xl">{payment.icon}</span>
                <span className="font-medium text-gray-900">{payment.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-4">Why upgrade to a paid plan?</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: MessageCircle, text: 'Unlimited consultations' },
              { icon: Gift, text: 'No booking fees' },
              { icon: Truck, text: 'Discounted delivery' },
              { icon: Zap, text: 'Priority support' }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <benefit.icon className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button 
          size="lg"
          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
        >
          Upgrade to {currentPlan?.name}
        </Button>
        <Button 
          size="lg"
          variant="outline"
          className="border-pink-200 text-pink-600 hover:bg-pink-50"
        >
          Compare Plans
        </Button>
      </div>
    </div>
  );
}