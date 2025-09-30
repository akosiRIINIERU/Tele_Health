import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, Clock, DollarSign, Stethoscope } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface AppointmentBookingProps {
  selectedDoctor: any;
  user: any;
  onBack: () => void;
}

export function AppointmentBooking({ selectedDoctor, user, onBack }: AppointmentBookingProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      toast.error('Please select date and time');
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to book appointment');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date: formData.date,
          time: formData.time,
          notes: formData.notes
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Appointment booked successfully! Waiting for doctor confirmation.');
        onBack();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
      </div>

      {/* Doctor Info */}
      <Card className="border-pink-100">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-pink-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedDoctor?.name}</h3>
              <p className="text-gray-600">{selectedDoctor?.expertise}</p>
              <Badge 
                variant="secondary" 
                className="mt-1 bg-green-100 text-green-800"
              >
                {selectedDoctor?.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-lg">Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-300"
                  required
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Time</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleInputChange('time', time)}
                    className={`p-2 text-sm border rounded-lg transition-colors ${
                      formData.time === time
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'border-pink-200 text-gray-700 hover:bg-pink-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <Textarea
                placeholder="Describe your symptoms or reason for visit..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={3}
              />
            </div>

            {/* Cost Information */}
            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-pink-600" />
                    <span className="font-medium text-gray-900">Consultation Fee</span>
                  </div>
                  <span className="font-bold text-pink-600">₱5 - ₱10</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Final cost will be determined and charged after doctor confirmation
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="border-pink-100 bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your appointment will be pending until confirmed by the doctor</li>
            <li>• You will receive a notification once confirmed</li>
            <li>• Payment will be processed after confirmation</li>
            <li>• You can cancel the appointment before confirmation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}