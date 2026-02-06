import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Edit, Plus, Leaf, Save, Loader2, CreditCard } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, LANGUAGES, Language } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { z } from 'zod';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Validation schema
const profileSchema = z.object({
  full_name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  mobile_number: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits').optional().or(z.literal('')),
  state: z.string().min(1, 'State is required'),
  district: z.string().trim().min(1, 'District is required').max(100, 'District must be less than 100 characters'),
  village: z.string().max(100, 'Village must be less than 100 characters').optional().or(z.literal('')),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional().or(z.literal('')),
  farmer_id: z.string().max(50, 'Farmer ID must be less than 50 characters').optional().or(z.literal('')),
});

interface FormData {
  full_name: string;
  mobile_number: string;
  state: string;
  district: string;
  village: string;
  pincode: string;
  farmer_id: string;
}

const mockPlots = [
  {
    id: '1',
    name: 'Main Field',
    area: 2.5,
    soilType: 'Black Cotton',
    irrigation: 'Borewell',
    currentCrop: 'Wheat',
  },
  {
    id: '2',
    name: 'East Plot',
    area: 1.8,
    soilType: 'Alluvial',
    irrigation: 'Canal',
    currentCrop: 'Chickpea',
  },
];

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const { profile, updateProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    mobile_number: '',
    state: '',
    district: '',
    village: '',
    pincode: '',
    farmer_id: '',
  });

  // Sync form data with profile when loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        mobile_number: profile.mobile_number || '',
        state: profile.state || '',
        district: profile.district || '',
        village: profile.village || '',
        pincode: profile.pincode || '',
        farmer_id: profile.farmer_id || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    // Validate with zod
    const result = profileSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      await updateProfile.mutateAsync({
        full_name: formData.full_name,
        mobile_number: formData.mobile_number || null,
        state: formData.state,
        district: formData.district,
        village: formData.village || null,
        pincode: formData.pincode || null,
        farmer_id: formData.farmer_id || null,
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        mobile_number: profile.mobile_number || '',
        state: profile.state || '',
        district: profile.district || '',
        village: profile.village || '',
        pincode: profile.pincode || '',
        farmer_id: profile.farmer_id || '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <User className="h-8 w-8 text-primary" />
              {t('profile')}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your farm profile and settings
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar and name */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
                  👨‍🌾
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{formData.full_name || 'Farmer'}</h2>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
                  {formData.farmer_id && (
                    <Badge variant="outline" className="text-xs mt-1">
                      <CreditCard className="h-3 w-3 mr-1" />
                      {formData.farmer_id}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    disabled={!isEditing}
                    className={errors.full_name ? 'border-destructive' : ''}
                  />
                  {errors.full_name && (
                    <p className="text-xs text-destructive">{errors.full_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile_number">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile_number"
                      value={formData.mobile_number}
                      onChange={(e) => handleInputChange('mobile_number', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      disabled={!isEditing}
                      className={`pl-10 ${errors.mobile_number ? 'border-destructive' : ''}`}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  {errors.mobile_number && (
                    <p className="text-xs text-destructive">{errors.mobile_number}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmer_id">Farmer ID / Kisan ID</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="farmer_id"
                      value={formData.farmer_id}
                      onChange={(e) => handleInputChange('farmer_id', e.target.value)}
                      disabled={!isEditing}
                      className={`pl-10 ${errors.farmer_id ? 'border-destructive' : ''}`}
                      placeholder="Government farmer ID"
                    />
                  </div>
                  {errors.farmer_id && (
                    <p className="text-xs text-destructive">{errors.farmer_id}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">{t('selectLanguage')}</Label>
                  <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.nativeName} ({lang.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    {isEditing ? (
                      <Select 
                        value={formData.state} 
                        onValueChange={(v) => handleInputChange('state', v)}
                      >
                        <SelectTrigger className={errors.state ? 'border-destructive' : ''}>
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
                    ) : (
                      <Input
                        id="state"
                        value={formData.state}
                        disabled
                      />
                    )}
                    {errors.state && (
                      <p className="text-xs text-destructive">{errors.state}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      disabled={!isEditing}
                      className={errors.district ? 'border-destructive' : ''}
                    />
                    {errors.district && (
                      <p className="text-xs text-destructive">{errors.district}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village">Village / Town</Label>
                    <Input
                      id="village"
                      value={formData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      disabled={!isEditing}
                      className={errors.village ? 'border-destructive' : ''}
                    />
                    {errors.village && (
                      <p className="text-xs text-destructive">{errors.village}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      disabled={!isEditing}
                      className={errors.pincode ? 'border-destructive' : ''}
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && (
                      <p className="text-xs text-destructive">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Farm Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Plots</span>
                  <span className="font-semibold">{mockPlots.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Area</span>
                  <span className="font-semibold">
                    {mockPlots.reduce((sum, p) => sum + p.area, 0).toFixed(1)} ha
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Crops</span>
                  <span className="font-semibold">{mockPlots.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-semibold">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">🎖️</span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {formData.farmer_id ? 'Verified Farmer' : 'Add Farmer ID'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.farmer_id ? 'PM-KISAN registered' : 'To unlock benefits'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plots Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-success" />
                  My Plots
                </CardTitle>
                <CardDescription>Manage your farm plots and crop details</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Plot
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPlots.map((plot) => (
                <div
                  key={plot.id}
                  className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{plot.name}</h4>
                      <p className="text-sm text-muted-foreground">{plot.area} hectares</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Soil Type</p>
                      <p className="font-medium">{plot.soilType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Irrigation</p>
                      <p className="font-medium">{plot.irrigation}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Current Crop</p>
                      <Badge variant="outline" className="mt-1">
                        🌾 {plot.currentCrop}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={signOut}>
              {t('logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
