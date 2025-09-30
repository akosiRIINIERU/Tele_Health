import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Heart, Home, Calendar, MessageCircle, Users, BookOpen, 
  Settings, User, DollarSign, Bell, LogOut, Clock,
  CheckCircle, XCircle, Activity, Stethoscope
} from 'lucide-react';
import { AppointmentsList } from './AppointmentsList';
import { ChatSystem } from './ChatSystem';
import { ArticlesSection } from './ArticlesSection';
import { ProfileSettings } from './ProfileSettings';
import { PatientProfiles } from './PatientProfiles';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DoctorDashboardProps {
  user: any;
  onLogout: () => void;
}

export function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [doctorStatus, setDoctorStatus] = useState('offline');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/profile/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.access_token || publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setDoctorStatus(data.profile.status || 'offline');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token || publicAnonKey}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setDoctorStatus(newStatus);
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DoctorHomeContent user={user} profile={profile} />;
      case 'appointments':
        return <AppointmentsList user={user} />;
      case 'patients':
        return <PatientProfiles user={user} />;
      case 'chat':
        return <ChatSystem user={user} userType="doctor" />;
      case 'articles':
        return <ArticlesSection showBookButton={false} />;
      case 'profile':
        return <ProfileSettings user={user} />;
      default:
        return <DoctorHomeContent user={user} profile={profile} />;
    }
  };

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'articles', icon: BookOpen, label: 'Articles' },
    { id: 'profile', icon: Settings, label: 'Settings' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Dr. Portal</h1>
              <p className="text-xs text-gray-500">Dr. {user.user_metadata?.name || 'Doctor'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(doctorStatus)}`}></div>
              <span className="text-xs capitalize text-gray-600">{doctorStatus}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 px-2 py-2">
        <div className="flex justify-around">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'text-pink-500 bg-pink-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Status Update Modal */}
      {activeTab === 'home' && (
        <div className="fixed bottom-24 right-4">
          <div className="bg-white rounded-lg shadow-lg border border-pink-100 p-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Update Status</p>
            <div className="space-y-2">
              {['available', 'busy', 'offline'].map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={doctorStatus === status ? 'default' : 'outline'}
                  onClick={() => updateStatus(status)}
                  className={`w-full justify-start ${
                    doctorStatus === status 
                      ? 'bg-pink-500 text-white' 
                      : 'border-pink-200 text-gray-700 hover:bg-pink-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(status)}`}></div>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorHomeContent({ user, profile }: { user: any; profile: any }) {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-400 text-white border-none">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome back, Doctor!</h2>
          <p className="text-blue-100">Ready to help your patients today?</p>
          <div className="mt-4">
            <p className="text-sm text-blue-100">
              Expertise: {profile?.expertise || 'General Practice'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-pink-100">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">8</h3>
            <p className="text-sm text-gray-500">Today's Appointments</p>
          </CardContent>
        </Card>

        <Card className="border-pink-100">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">24</h3>
            <p className="text-sm text-gray-500">Total Patients</p>
          </CardContent>
        </Card>

        <Card className="border-pink-100">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₱240</h3>
            <p className="text-sm text-gray-500">Today's Earnings</p>
          </CardContent>
        </Card>

        <Card className="border-pink-100">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
            <p className="text-sm text-gray-500">Average Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-lg">Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Inday Puday</p>
                  <p className="text-sm text-gray-500">General Checkup</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">10:00 AM</p>
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                  Pending
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">James Reid</p>
                  <p className="text-sm text-gray-500">Follow-up</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">11:30 AM</p>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  Confirmed
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Summary */}
      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-lg">Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Week</span>
              <span className="font-semibold text-gray-900">₱1,680</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-gray-900">₱6,720</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available for Withdrawal</span>
              <span className="font-semibold text-green-600">₱5,200</span>
            </div>
            <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              Withdraw Earnings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}