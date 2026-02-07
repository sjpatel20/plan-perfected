import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Save, Loader2, Leaf, Mail } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, LANGUAGES, Language } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { AvatarUpload } from '@/components/AvatarUpload';
import { usePlots } from '@/hooks/usePlots';
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

const FARMING_TYPES = ['Organic', 'Traditional', 'Mixed', 'Hydroponic', 'Precision'];

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
  farm_name: string;
  farming_type: string;
  total_land_size: string;
}

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const { profile, updateProfile, isLoading } = useProfile();
  const { totalArea } = usePlots();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    mobile_number: '',
    state: '',
    district: '',
    village: '',
    pincode: '',
    farmer_id: '',
    farm_name: '',
    farming_type: 'organic',
    total_land_size: '',
  });

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
        farm_name: '',
        farming_type: 'organic',
        total_land_size: totalArea.toFixed(1),
      });
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile, totalArea]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
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
        avatar_url: avatarUrl,
      });
      
      toast.success('Profile updated successfully!');
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
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

  const location = [formData.village, formData.district].filter(Boolean).join(', ') || 'Not set';

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">manage_profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Profile Display Card */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="mt-4">
                <AvatarUpload
                  currentAvatarUrl={avatarUrl}
                  onAvatarChange={setAvatarUrl}
                  fallback={formData.full_name?.charAt(0)?.toUpperCase() || 'F'}
                  disabled={false}
                />
              </div>
              <h2 className="text-xl font-semibold mt-4">{formData.full_name || 'Farmer'}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              
              <div className="mt-6 space-y-3 w-full text-left">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Leaf className="h-4 w-4" />
                  <span>{formData.farming_type || 'organic'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Edit Profile</CardTitle>
              <CardDescription>update_account_details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className={`pl-10 ${errors.full_name ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-xs text-destructive">{errors.full_name}</p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Farm Name */}
              <div className="space-y-2">
                <Label htmlFor="farm_name">Farm Name</Label>
                <Input
                  id="farm_name"
                  value={formData.farm_name}
                  onChange={(e) => handleInputChange('farm_name', e.target.value)}
                  placeholder="e.g., Wheat farmer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location / Village */}
                <div className="space-y-2">
                  <Label htmlFor="village">Location / Village</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="village"
                      value={formData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      className="pl-10"
                      placeholder="e.g., Kamrej Surat"
                    />
                  </div>
                </div>

                {/* Farming Type */}
                <div className="space-y-2">
                  <Label htmlFor="farming_type">primary_farming_type</Label>
                  <div className="relative">
                    <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select 
                      value={formData.farming_type} 
                      onValueChange={(v) => handleInputChange('farming_type', v)}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FARMING_TYPES.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Total Land Size */}
              <div className="space-y-2">
                <Label htmlFor="total_land_size">total_land_size</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">✎</span>
                  <Input
                    id="total_land_size"
                    value={formData.total_land_size}
                    onChange={(e) => handleInputChange('total_land_size', e.target.value)}
                    className="pl-10"
                    placeholder="e.g., 5.5"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={updateProfile.isPending} className="bg-primary hover:bg-primary/90">
                  {updateProfile.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
