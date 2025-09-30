import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { 
  User, Mail, Phone, MapPin, Calendar, Stethoscope,
  Settings, Bell, Moon, Sun, Shield, LogOut,
  Edit, Save, X, Star, Award
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface ProfileSettingsProps {
  user: any;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user.user_metadata?.name || '',
    email: user.email || '',
    phone: '',
    address: '',
    dateOfBirth: '',
    expertise: user.user_metadata?.expertise || '',
    bio: '',
    experience: '',
    points: user.user_metadata?.points || 0
  });

  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
      appointments: true,
      reminders: true
    },
    privacy: {
      profileVisible: true,
      showOnline: true
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/profile/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({ ...prev, ...data.profile }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const isDoctor = user.user_metadata?.userType === 'doctor';

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-pink-100">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
              {isDoctor ? (
                <Stethoscope className="w-10 h-10 text-pink-600" />
              ) : (
                <User className="w-10 h-10 text-pink-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-gray-600">{isDoctor ? 'Doctor' : 'Patient'}</p>
                  {isDoctor && profile.expertise && (
                    <p className="text-sm text-gray-500">{profile.expertise}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
              {!isDoctor && (
                <div className="flex items-center space-x-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{profile.points} Points</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="border-pink-200 bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                disabled={!isEditing}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>
            {!isDoctor && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                    disabled={!isEditing}
                    className="border-pink-200 focus:border-pink-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={profile.gender || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                    disabled={!isEditing}
                    className="border-pink-200 focus:border-pink-300"
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              disabled={!isEditing}
              className="border-pink-200 focus:border-pink-300"
            />
          </div>

          {isDoctor ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="expertise">Medical Specialization</Label>
                <Input
                  id="expertise"
                  value={profile.specialization || profile.expertise || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value, expertise: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="e.g., Cardiology, General Practice"
                  className="border-pink-200 focus:border-pink-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  value={profile.yearsOfExperience || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="e.g., 5"
                  className="border-pink-200 focus:border-pink-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalLicense">Medical License</Label>
                <Input
                  id="medicalLicense"
                  value={profile.medicalLicense || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, medicalLicense: e.target.value }))}
                  disabled={!isEditing}
                  className="border-pink-200 focus:border-pink-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consultationFee">Consultation Fee (₱)</Label>
                <Input
                  id="consultationFee"
                  type="number"
                  value={profile.consultationFee || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, consultationFee: e.target.value }))}
                  disabled={!isEditing}
                  className="border-pink-200 focus:border-pink-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professionalBio">Professional Bio</Label>
                <Textarea
                  id="professionalBio"
                  value={profile.professionalBio || profile.bio || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, professionalBio: e.target.value, bio: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Tell patients about your background and approach to medicine..."
                  className="border-pink-200 focus:border-pink-300"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Medical Education</Label>
                <Textarea
                  id="education"
                  value={profile.education || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Medical school, residency, fellowships..."
                  className="border-pink-200 focus:border-pink-300"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Input
                  id="bloodType"
                  value={profile.bloodType || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, bloodType: e.target.value }))}
                  disabled={!isEditing}
                  className="border-pink-200 focus:border-pink-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                    disabled={!isEditing}
                    className="border-pink-200 focus:border-pink-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, weight: e.target.value }))}
                    disabled={!isEditing}
                    className="border-pink-200 focus:border-pink-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea
                  id="allergies"
                  value={profile.allergies || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, allergies: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="List any allergies..."
                  className="border-pink-200 focus:border-pink-300"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chronicConditions">Medical Conditions</Label>
                <Textarea
                  id="chronicConditions"
                  value={profile.chronicConditions || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, chronicConditions: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Any ongoing medical conditions..."
                  className="border-pink-200 focus:border-pink-300"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact</Label>
                <Input
                  id="emergencyContactName"
                  value={profile.emergencyContactName || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Emergency contact name"
                  className="border-pink-200 focus:border-pink-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={profile.emergencyContactPhone || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Emergency contact phone"
                  className="border-pink-200 focus:border-pink-300"
                />
              </div>
            </>
          )}

          {isEditing && (
            <div className="flex space-x-2 pt-4">
              <Button
                onClick={updateProfile}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="border-gray-300"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-lg">App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label>Theme</Label>
            <RadioGroup
              value={settings.theme}
              onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center cursor-pointer">
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center cursor-pointer">
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <Label>Language</Label>
            <div className="text-sm text-gray-600">
              English (Default) • Filipino support coming soon
            </div>
          </div>

          {/* Data & Storage */}
          <div className="space-y-3">
            <Label>Data & Storage</Label>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Clear Cache
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                <p className="text-sm text-gray-500">
                  {key === 'email' && 'Receive updates via email'}
                  {key === 'push' && 'Push notifications on your device'}
                  {key === 'sms' && 'Text message notifications'}
                  {key === 'appointments' && 'Appointment confirmations and reminders'}
                  {key === 'reminders' && 'Health tips and medication reminders'}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, [key]: checked }
                  }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-lg">Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(settings.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                <p className="text-sm text-gray-500">
                  {key === 'profileVisible' && 'Allow others to see your profile information'}
                  {key === 'showOnline' && 'Show when you are online'}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, [key]: checked }
                  }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-red-900 mb-2">Data Protection</h4>
          <p className="text-red-800 text-sm">
            Your medical data is encrypted and stored securely. We comply with healthcare privacy regulations and never share your personal information without consent.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'settings':
        return renderSettingsTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4 mx-auto mb-1" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}