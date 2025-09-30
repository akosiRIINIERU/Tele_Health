import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, User, Calendar, Phone, Mail, 
  Heart, Activity, FileText, Clock,
  MessageCircle, Star, Filter
} from 'lucide-react';

interface PatientProfilesProps {
  user: any;
}

export function PatientProfiles({ user }: PatientProfilesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filter, setFilter] = useState('all');

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: 'Coco Marxton',
      age: 34,
      gender: 'Male',
      phone: '+63 912 345 6789',
      email: 'Coco.Marxton@email.com',
      lastVisit: '2024-01-15',
      totalVisits: 8,
      condition: 'Hypertension',
      status: 'Active',
      nextAppointment: '2024-02-01',
      notes: 'Regular blood pressure monitoring required',
      rating: 4.8,
      prescriptions: ['Amlodipine 5mg', 'Metformin 500mg'],
      allergies: ['Penicillin'],
      emergencyContact: 'Juan Santos - +63 912 345 6788',
      // Additional detailed information
      dateOfBirth: '1990-03-15',
      bloodType: 'A+',
      height: '165',
      weight: '62',
      address: '123 Main St, Quezon City',
      chronicConditions: 'Hypertension, Pre-diabetes',
      currentMedications: 'Amlodipine 5mg daily, Metformin 500mg twice daily',
      healthGoals: 'Maintain healthy blood pressure, lose 5kg',
      additionalNotes: 'Patient is very compliant with medications'
    },
    {
      id: 2,
      name: 'James Reid',
      age: 45,
      gender: 'Male',
      phone: '+63 923 456 7890',
      email: 'James.Reid@email.com',
      lastVisit: '2024-01-10',
      totalVisits: 12,
      condition: 'Diabetes Type 2',
      status: 'Active',
      nextAppointment: '2024-01-25',
      notes: 'Diet management and glucose monitoring',
      rating: 4.9,
      prescriptions: ['Metformin 1000mg', 'Glimepiride 2mg'],
      allergies: ['Sulfa drugs'],
      emergencyContact: 'Ana Cruz - +63 923 456 7891'
    },
    {
      id: 3,
      name: 'Inday Puday',
      age: 28,
      gender: 'Female',
      phone: '+63 934 567 8901',
      email: 'Inday.Puday@email.com',
      lastVisit: '2024-01-08',
      totalVisits: 3,
      condition: 'Anxiety',
      status: 'New',
      nextAppointment: '2024-01-30',
      notes: 'First-time patient, anxiety management',
      rating: 4.5,
      prescriptions: ['Sertraline 50mg'],
      allergies: ['None known'],
      emergencyContact: 'Carlos Garcia - +63 934 567 8902'
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || patient.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'follow-up':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedPatient) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPatient(null)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Patients
          </Button>
          <h2 className="text-xl font-bold text-gray-900">Patient Profile</h2>
        </div>

        {/* Patient Details */}
        <Card className="border-pink-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-gray-600">{selectedPatient.age} years old • {selectedPatient.gender}</p>
                  <Badge className={`mt-1 ${getStatusColor(selectedPatient.status)}`}>
                    {selectedPatient.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{selectedPatient.rating}</span>
                </div>
                <p className="text-sm text-gray-600">{selectedPatient.totalVisits} visits</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedPatient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedPatient.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Born: {selectedPatient.dateOfBirth}</span>
                </div>
              </div>
            </div>

            {/* Physical Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Physical Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Blood Type</p>
                  <p className="font-medium text-red-600">{selectedPatient.bloodType}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Height</p>
                  <p className="font-medium">{selectedPatient.height} cm</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Weight</p>
                  <p className="font-medium">{selectedPatient.weight} kg</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">BMI</p>
                  <p className="font-medium">
                    {(parseFloat(selectedPatient.weight) / Math.pow(parseFloat(selectedPatient.height) / 100, 2)).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Medical Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Primary Condition</p>
                  <p className="font-medium">{selectedPatient.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Visit</p>
                  <p className="font-medium">{selectedPatient.lastVisit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Appointment</p>
                  <p className="font-medium">{selectedPatient.nextAppointment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Visits</p>
                  <p className="font-medium">{selectedPatient.totalVisits}</p>
                </div>
              </div>
            </div>

            {/* Medical Conditions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Medical Conditions</h4>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">{selectedPatient.chronicConditions}</p>
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Current Medications</h4>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">{selectedPatient.currentMedications}</p>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Known Allergies</h4>
              <div className="space-y-2">
                {selectedPatient.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-800">{allergy}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Goals */}
            {selectedPatient.healthGoals && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Health Goals</h4>
                <p className="text-sm text-gray-700 p-3 bg-green-50 rounded-lg border border-green-200">
                  {selectedPatient.healthGoals}
                </p>
              </div>
            )}

            {/* Doctor Notes */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Doctor Notes</h4>
              <p className="text-sm text-gray-700 p-3 bg-blue-50 rounded-lg">
                {selectedPatient.notes}
              </p>
            </div>

            {/* Additional Notes */}
            {selectedPatient.additionalNotes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Patient Notes</h4>
                <p className="text-sm text-gray-700 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  {selectedPatient.additionalNotes}
                </p>
              </div>
            )}

            {/* Emergency Contact */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
              <p className="text-sm text-gray-700">{selectedPatient.emergencyContact}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-100">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button variant="outline" className="border-gray-200">
                <FileText className="w-4 h-4 mr-2" />
                Add Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Profiles</h2>
        <p className="text-gray-600">View and manage your patient information</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients by name or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-pink-200 focus:border-pink-300"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['all', 'active', 'new', 'follow-up'].map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className={`whitespace-nowrap ${
                filter === filterOption
                  ? 'bg-pink-500 text-white'
                  : 'border-pink-200 text-gray-700 hover:bg-pink-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-pink-100">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{patients.length}</h3>
            <p className="text-sm text-gray-500">Total Patients</p>
          </CardContent>
        </Card>

        <Card className="border-pink-100">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {patients.filter(p => p.status === 'Active').length}
            </h3>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>

        <Card className="border-pink-100">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {patients.filter(p => p.status === 'New').length}
            </h3>
            <p className="text-sm text-gray-500">New</p>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No patients found</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className="border-pink-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.condition}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{patient.age} years • {patient.gender}</span>
                        <span>Last visit: {patient.lastVisit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`mb-2 ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium">{patient.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{patient.totalVisits} visits</p>
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