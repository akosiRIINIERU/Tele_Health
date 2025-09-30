import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Heart, Home, Calendar, MessageCircle, Phone, BookOpen, 
  ShoppingBag, Settings, User, Search, Star, Clock, 
  CheckCircle, XCircle, Crown, Bell, LogOut 
} from 'lucide-react';
import { DoctorList } from './DoctorList';
import { AppointmentBooking } from './AppointmentBooking';
import { AppointmentsList } from './AppointmentsList';
import { ChatSystem } from './ChatSystem';
import { HealthTips } from './HealthTips';
import { ArticlesSection } from './ArticlesSection';
import { MedicineShop } from './MedicineShop';
import { ProfileSettings } from './ProfileSettings';
import { SubscriptionPlans } from './SubscriptionPlans';

interface PatientDashboardProps {
  user: any;
  onLogout: () => void;
}

export function PatientDashboard({ user, onLogout }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContent user={user} onSelectDoctor={setSelectedDoctor} />;
      case 'doctors':
        return <DoctorList onSelectDoctor={(doctor) => {
          setSelectedDoctor(doctor);
          setActiveTab('booking');
        }} />;
      case 'booking':
        return <AppointmentBooking 
          selectedDoctor={selectedDoctor} 
          user={user}
          onBack={() => setActiveTab('doctors')}
        />;
      case 'appointments':
        return <AppointmentsList user={user} />;
      case 'chat':
        return <ChatSystem user={user} userType="patient" />;
      case 'tips':
        return <HealthTips />;
      case 'articles':
        return <ArticlesSection showBookButton={true} onBookAppointment={() => setActiveTab('doctors')} />;
      case 'shop':
        return <MedicineShop />;
      case 'subscription':
        return <SubscriptionPlans user={user} />;
      case 'profile':
        return <ProfileSettings user={user} />;
      default:
        return <HomeContent user={user} onSelectDoctor={setSelectedDoctor} />;
    }
  };

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'doctors', icon: Search, label: 'Doctors' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'tips', icon: Heart, label: 'Health Tips' },
    { id: 'articles', icon: BookOpen, label: 'Articles' },
    { id: 'shop', icon: ShoppingBag, label: 'Shop' },
    { id: 'subscription', icon: Crown, label: 'Plans' },
    { id: 'profile', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">TeleHealth</h1>
              <p className="text-xs text-gray-500">Welcome, {user.user_metadata?.name || 'Patient'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
          {navigationItems.slice(0, 5).map((item) => (
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
        <div className="flex justify-around mt-1">
          {navigationItems.slice(5).map((item) => (
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
    </div>
  );
}

function HomeContent({ user, onSelectDoctor }: { user: any; onSelectDoctor: (doctor: any) => void }) {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-pink-500 to-pink-400 text-white border-none">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Good morning!</h2>
          <p className="text-pink-100">How are you feeling today?</p>
          <div className="mt-4 flex space-x-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              Book Appointment
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              Emergency
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-pink-100 hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="font-medium text-gray-900">Find Doctor</h3>
            <p className="text-sm text-gray-500 mt-1">Search available doctors</p>
          </CardContent>
        </Card>

        <Card className="border-pink-100 hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="font-medium text-gray-900">My Appointments</h3>
            <p className="text-sm text-gray-500 mt-1">View upcoming visits</p>
          </CardContent>
        </Card>

        <Card className="border-pink-100 hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="font-medium text-gray-900">Chat</h3>
            <p className="text-sm text-gray-500 mt-1">Message doctors</p>
          </CardContent>
        </Card>

        <Card className="border-pink-100 hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="font-medium text-gray-900">Medicine</h3>
            <p className="text-sm text-gray-500 mt-1">Order medicines</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Appointment completed</p>
                <p className="text-xs text-gray-500">Dr. Makaguba - General Checkup</p>
              </div>
              <span className="text-xs text-gray-400">2 days ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Medicine delivered</p>
                <p className="text-xs text-gray-500">Paracetamol, Vitamin C</p>
              </div>
              <span className="text-xs text-gray-400">1 week ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotional Banner */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Get Premium Plan</h3>
              <p className="text-sm text-purple-100">Unlimited consultations & free medicine delivery</p>
            </div>
            <Crown className="w-8 h-8 text-yellow-300" />
          </div>
          <Button 
            size="sm" 
            className="mt-3 bg-white text-purple-600 hover:bg-gray-100"
          >
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}