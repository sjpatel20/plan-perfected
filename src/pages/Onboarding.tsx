import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Building, Home, CreditCard, Languages, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage, LANGUAGES } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import smartKisanLogo from '@/assets/smart-kisan-logo.jpg';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

interface FormData {
  full_name: string;
  mobile_number: string;
  state: string;
  district: string;
  village: string;
  pincode: string;
  farmer_id: string;
  preferred_language: string;
}

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Tell us your name' },
  { id: 2, title: 'Contact', icon: Phone, description: 'Your mobile number' },
  { id: 3, title: 'State', icon: MapPin, description: 'Select your state' },
  { id: 4, title: 'District', icon: Building, description: 'Enter your district' },
  { id: 5, title: 'Village', icon: Home, description: 'Your village details' },
  { id: 6, title: 'Farmer ID', icon: CreditCard, description: 'Government ID (optional)' },
  { id: 7, title: 'Language', icon: Languages, description: 'Preferred language' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const { setLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    full_name: profile?.full_name || '',
    mobile_number: profile?.mobile_number || '',
    state: profile?.state || '',
    district: profile?.district || '',
    village: profile?.village || '',
    pincode: profile?.pincode || '',
    farmer_id: profile?.farmer_id || '',
    preferred_language: profile?.preferred_language || 'en',
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.full_name.trim()) {
          toast.error('Please enter your name');
          return false;
        }
        break;
      case 2:
        if (!formData.mobile_number.trim() || formData.mobile_number.length < 10) {
          toast.error('Please enter a valid mobile number');
          return false;
        }
        break;
      case 3:
        if (!formData.state) {
          toast.error('Please select your state');
          return false;
        }
        break;
      case 4:
        if (!formData.district.trim()) {
          toast.error('Please enter your district');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateStep()) return;

    try {
      await updateProfile.mutateAsync({
        full_name: formData.full_name,
        mobile_number: formData.mobile_number,
        state: formData.state,
        district: formData.district,
        village: formData.village || null,
        pincode: formData.pincode || null,
        farmer_id: formData.farmer_id || null,
        preferred_language: formData.preferred_language,
      });

      // Update app language
      setLanguage(formData.preferred_language as any);
      
      toast.success('Profile completed successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    }
  };

  const renderStepContent = () => {
    const StepIcon = STEPS[currentStep - 1].icon;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="text-lg h-12"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile_number">Mobile Number</Label>
              <Input
                id="mobile_number"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile_number}
                onChange={(e) => handleInputChange('mobile_number', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="text-lg h-12"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                placeholder="Enter your district"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="text-lg h-12"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="village">Village/Town (Optional)</Label>
                <Input
                  id="village"
                  placeholder="Enter your village or town"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode (Optional)</Label>
                <Input
                  id="pincode"
                  placeholder="Enter 6-digit pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-lg h-12"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmer_id">Farmer ID / Kisan ID (Optional)</Label>
              <Input
                id="farmer_id"
                placeholder="Enter your government farmer ID"
                value={formData.farmer_id}
                onChange={(e) => handleInputChange('farmer_id', e.target.value)}
                className="text-lg h-12"
              />
              <p className="text-sm text-muted-foreground">
                This helps us fetch your soil health card and scheme eligibility
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Languages className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <Label>Preferred Language</Label>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {LANGUAGES.map((lang) => (
                  <Button
                    key={lang.code}
                    type="button"
                    variant={formData.preferred_language === lang.code ? 'default' : 'outline'}
                    className="h-14 text-lg"
                    onClick={() => handleInputChange('preferred_language', lang.code)}
                  >
                    {lang.nativeName}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <img src={smartKisanLogo} alt="Smart किसान" className="h-16 w-16 object-contain" />
          </div>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress bar */}
          <Progress value={progress} className="h-2" />

          {/* Step indicators */}
          <div className="flex justify-between px-2">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id === currentStep
                    ? 'text-primary'
                    : step.id < currentStep
                    ? 'text-success'
                    : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.id === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step.id < currentStep
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
                </div>
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[200px] flex flex-col justify-center">
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} className="flex-1">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                className="flex-1"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? 'Saving...' : 'Complete'}
                <Check className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
