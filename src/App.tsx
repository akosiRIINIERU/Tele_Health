import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setCurrentScreen('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentScreen('login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-300"></div>
      </div>
    );
  }

  if (!user) {
    if (currentScreen === 'register') {
      return <RegisterScreen onBack={() => setCurrentScreen('login')} />;
    }
    return <LoginScreen onRegister={() => setCurrentScreen('register')} />;
  }

  // Check user type from metadata
  const userType = user.user_metadata?.userType || 'patient';

  return (
    <div className="min-h-screen bg-white">
      {userType === 'doctor' ? (
        <DoctorDashboard user={user} onLogout={handleLogout} />
      ) : (
        <PatientDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}