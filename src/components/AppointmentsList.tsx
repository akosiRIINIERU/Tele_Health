import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageCircle, Stethoscope } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface AppointmentsListProps {
  user: any;
}

export function AppointmentsList({ user }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/appointments`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success(`Appointment ${status}`);
        fetchAppointments(); // Refresh the list
      } else {
        toast.error('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const isDoctor = user.user_metadata?.userType === 'doctor';

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-300 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isDoctor ? 'Patient Appointments' : 'My Appointments'}
        </h2>
        <p className="text-gray-600">
          {isDoctor ? 'Manage your patient appointments' : 'View and manage your appointments'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    {isDoctor ? (
                      <User className="w-6 h-6 text-pink-600" />
                    ) : (
                      <Stethoscope className="w-6 h-6 text-pink-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {isDoctor ? appointment.otherUserName : `Dr. ${appointment.otherUserName}`}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(appointment.status)}`}
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(appointment.status)}
                            <span>{appointment.status}</span>
                          </div>
                        </Badge>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          ₱{appointment.cost}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-pink-200 text-pink-600 hover:bg-pink-50"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            Join Call
                          </Button>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {isDoctor && appointment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Confirm
                            </Button>
                          </>
                        )}
                        
                        {!isDoctor && appointment.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}

                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {isDoctor ? 'Mark Complete' : 'Complete'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}