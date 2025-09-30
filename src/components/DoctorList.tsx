import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Star, MapPin, Clock, Stethoscope } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface DoctorListProps {
  onSelectDoctor: (doctor: any) => void;
}

export function DoctorList({ onSelectDoctor }: DoctorListProps) {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b415d497/doctors`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.expertise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-300 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find a Doctor</h2>
        <p className="text-gray-600">Choose from our available doctors</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-pink-200 focus:border-pink-300"
        />
      </div>

      {/* Specialty Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['All', 'General Practice', 'Cardiology', 'Dermatology', 'Pediatrics', 'Psychiatry'].map((specialty) => (
          <Button
            key={specialty}
            variant="outline"
            size="sm"
            className="whitespace-nowrap border-pink-200 text-gray-700 hover:bg-pink-50"
          >
            {specialty}
          </Button>
        ))}
      </div>

      {/* Doctors List */}
      <div className="space-y-3">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-8">
            <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No doctors found</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-gray-600 text-sm">{doctor.expertise}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">4.8</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">10 min</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(doctor.status)}`}
                      >
                        {doctor.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-600">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        Available now
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-pink-200 text-pink-600 hover:bg-pink-50"
                          disabled={doctor.status === 'offline'}
                        >
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          className="bg-pink-500 hover:bg-pink-600 text-white"
                          onClick={() => onSelectDoctor(doctor)}
                          disabled={doctor.status === 'offline'}
                        >
                          Book
                        </Button>
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