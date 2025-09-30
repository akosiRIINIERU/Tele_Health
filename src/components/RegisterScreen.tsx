import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Heart, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Stethoscope, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { UserInfoForm } from './UserInfoForm';

interface RegisterScreenProps {
  onBack: () => void;
}

export function RegisterScreen({ onBack }: RegisterScreenProps) {
  const [currentStep, setCurrentStep] = useState('basic'); // 'basic' or 'additional'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'patient'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Move to additional info step
    setCurrentStep('additional');
  };

  const handleCompleteRegistration = async (additionalInfo: any) => {
    setLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          userType: formData.userType,
          additionalInfo
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Account created successfully! Please sign in.');
        onBack();
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Show additional info form if on that step
  if (currentStep === 'additional') {
    return (
      <UserInfoForm
        userType={formData.userType as 'patient' | 'doctor'}
        basicInfo={formData}
        onComplete={handleCompleteRegistration}
        onBack={() => setCurrentStep('basic')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-pink-100">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={onBack}
              className="absolute left-6 top-6 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-800">Create Account</CardTitle>
          <p className="text-gray-600">Join our healthcare community</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBasicSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Type</label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) => handleInputChange('userType', value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border border-pink-200 rounded-lg p-3 hover:bg-pink-50">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient" className="flex items-center cursor-pointer">
                    <Users className="w-4 h-4 mr-2 text-pink-500" />
                    Patient
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border border-pink-200 rounded-lg p-3 hover:bg-pink-50">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor" className="flex items-center cursor-pointer">
                    <Stethoscope className="w-4 h-4 mr-2 text-pink-500" />
                    Doctor
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 border-pink-200 focus:border-pink-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 border-pink-200 focus:border-pink-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Continue to Profile Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}