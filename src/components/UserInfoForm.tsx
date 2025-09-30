import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { 
  User, Stethoscope, Heart, Calendar, Phone, 
  MapPin, FileText, AlertTriangle, ArrowLeft,
  GraduationCap, Award, Clock
} from 'lucide-react';

interface UserInfoFormProps {
  userType: 'patient' | 'doctor';
  basicInfo: {
    email: string;
    password: string;
    name: string;
    userType: string;
  };
  onComplete: (additionalInfo: any) => void;
  onBack: () => void;
}

export function UserInfoForm({ userType, basicInfo, onComplete, onBack }: UserInfoFormProps) {
  const [formData, setFormData] = useState(() => {
    if (userType === 'patient') {
      return {
        // Personal Information
        age: '',
        gender: '',
        dateOfBirth: '',
        phone: '',
        address: '',
        
        // Medical Information
        bloodType: '',
        height: '',
        weight: '',
        allergies: '',
        chronicConditions: '',
        currentMedications: '',
        
        // Emergency Contact
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        
        // Preferences
        preferredLanguage: 'English',
        healthGoals: '',
        additionalNotes: ''
      };
    } else {
      return {
        // Personal Information
        age: '',
        gender: '',
        phone: '',
        address: '',
        
        // Professional Information
        medicalLicense: '',
        specialization: '',
        subSpecialty: '',
        yearsOfExperience: '',
        education: '',
        currentHospital: '',
        
        // Professional Details
        consultationFee: '',
        availableHours: '',
        languagesSpoken: 'English',
        professionalBio: '',
        achievements: '',
        
        // Verification Documents
        licenseVerified: false,
        hospitalAffiliation: ''
      };
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = userType === 'patient' ? 3 : 3;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    if (userType === 'patient') {
      switch (currentStep) {
        case 1:
          return formData.age && formData.gender && formData.phone;
        case 2:
          return formData.bloodType;
        case 3:
          return formData.emergencyContactName && formData.emergencyContactPhone;
        default:
          return true;
      }
    } else {
      switch (currentStep) {
        case 1:
          return formData.phone && formData.specialization;
        case 2:
          return formData.medicalLicense && formData.yearsOfExperience;
        case 3:
          return formData.consultationFee && formData.professionalBio;
        default:
          return true;
      }
    }
  };

  const renderPatientStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <p className="text-gray-600">Help us know you better</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="border-pink-200 focus:border-pink-300"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+63 912 345 6789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Your complete address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
              <p className="text-gray-600">This helps doctors provide better care</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select onValueChange={(value) => handleInputChange('bloodType', value)}>
                  <SelectTrigger className="border-pink-200 focus:border-pink-300">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="border-pink-200 focus:border-pink-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="65"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea
                id="allergies"
                placeholder="List any allergies to medications, food, or other substances"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chronicConditions">Chronic Conditions</Label>
              <Textarea
                id="chronicConditions"
                placeholder="Any ongoing medical conditions (diabetes, hypertension, etc.)"
                value={formData.chronicConditions}
                onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                placeholder="List all medications you're currently taking"
                value={formData.currentMedications}
                onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Phone className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
              <p className="text-gray-600">Someone we can reach in case of emergency</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Contact Name</Label>
              <Input
                id="emergencyContactName"
                placeholder="Full name of emergency contact"
                value={formData.emergencyContactName}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
              <Input
                id="emergencyContactPhone"
                placeholder="+63 912 345 6789"
                value={formData.emergencyContactPhone}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelation">Relationship</Label>
              <Select onValueChange={(value) => handleInputChange('emergencyContactRelation', value)}>
                <SelectTrigger className="border-pink-200 focus:border-pink-300">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthGoals">Health Goals (Optional)</Label>
              <Textarea
                id="healthGoals"
                placeholder="What are your health and wellness goals?"
                value={formData.healthGoals}
                onChange={(e) => handleInputChange('healthGoals', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any other information you'd like to share with your healthcare providers"
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDoctorStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Stethoscope className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
              <p className="text-gray-600">Help patients know about your practice</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+63 912 345 6789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Medical Specialization</Label>
              <Select onValueChange={(value) => handleInputChange('specialization', value)}>
                <SelectTrigger className="border-pink-200 focus:border-pink-300">
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general-practice">General Practice</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="psychiatry">Psychiatry</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="gynecology">Gynecology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                  <SelectItem value="emergency-medicine">Emergency Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subSpecialty">Sub-specialty (Optional)</Label>
              <Input
                id="subSpecialty"
                placeholder="e.g., Interventional Cardiology"
                value={formData.subSpecialty}
                onChange={(e) => handleInputChange('subSpecialty', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentHospital">Current Hospital/Clinic</Label>
              <Input
                id="currentHospital"
                placeholder="Name of your primary workplace"
                value={formData.currentHospital}
                onChange={(e) => handleInputChange('currentHospital', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Practice Address</Label>
              <Textarea
                id="address"
                placeholder="Address of your clinic or hospital"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <GraduationCap className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Credentials & Experience</h3>
              <p className="text-gray-600">Verify your professional qualifications</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalLicense">Medical License Number</Label>
              <Input
                id="medicalLicense"
                placeholder="Your medical license number"
                value={formData.medicalLicense}
                onChange={(e) => handleInputChange('medicalLicense', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                placeholder="5"
                value={formData.yearsOfExperience}
                onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Medical Education</Label>
              <Textarea
                id="education"
                placeholder="Medical school, residency, fellowships"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">Professional Achievements (Optional)</Label>
              <Textarea
                id="achievements"
                placeholder="Board certifications, awards, publications"
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="licenseVerified"
                checked={formData.licenseVerified}
                onCheckedChange={(checked) => handleInputChange('licenseVerified', checked)}
              />
              <Label htmlFor="licenseVerified" className="text-sm">
                I confirm that my medical license is valid and up to date
              </Label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Clock className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Practice Details</h3>
              <p className="text-gray-600">Set your consultation preferences</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultationFee">Consultation Fee (₱)</Label>
              <Input
                id="consultationFee"
                type="number"
                placeholder="500"
                value={formData.consultationFee}
                onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableHours">Available Hours</Label>
              <Input
                id="availableHours"
                placeholder="e.g., Mon-Fri 9AM-5PM"
                value={formData.availableHours}
                onChange={(e) => handleInputChange('availableHours', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languagesSpoken">Languages Spoken</Label>
              <Input
                id="languagesSpoken"
                placeholder="English, Filipino, etc."
                value={formData.languagesSpoken}
                onChange={(e) => handleInputChange('languagesSpoken', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalBio">Professional Bio</Label>
              <Textarea
                id="professionalBio"
                placeholder="Tell patients about your background, approach to medicine, and what makes you unique"
                value={formData.professionalBio}
                onChange={(e) => handleInputChange('professionalBio', e.target.value)}
                className="border-pink-200 focus:border-pink-300"
                rows={6}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-pink-100">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <CardTitle className="text-xl text-gray-800">
                Complete Your Profile
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <div className="w-9" /> {/* Spacer for alignment */}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {userType === 'patient' ? renderPatientStep() : renderDoctorStep()}

          {/* Navigation Buttons */}
          <div className="flex space-x-3 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 border-pink-200 text-gray-700 hover:bg-pink-50"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white disabled:bg-gray-300"
            >
              {currentStep === totalSteps ? 'Complete Registration' : 'Next'}
            </Button>
          </div>

          {/* Important Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 text-sm">Privacy & Security</h4>
                <p className="text-blue-800 text-xs mt-1">
                  Your information is encrypted and securely stored. We comply with healthcare privacy regulations and only share information with your consent.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}