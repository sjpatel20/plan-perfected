import { useState } from 'react';
import { Camera, Upload, Leaf, AlertTriangle, CheckCircle, Clock, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

// Mock recent scans
const recentScans = [
  {
    id: '1',
    cropName: 'Wheat',
    scanDate: new Date(Date.now() - 86400000),
    status: 'healthy',
    diagnosis: null,
    confidence: 95,
    imageUrl: '/placeholder.svg',
  },
  {
    id: '2',
    cropName: 'Tomato',
    scanDate: new Date(Date.now() - 172800000),
    status: 'diseased',
    diagnosis: 'Early Blight',
    confidence: 89,
    imageUrl: '/placeholder.svg',
  },
  {
    id: '3',
    cropName: 'Cotton',
    scanDate: new Date(Date.now() - 259200000),
    status: 'pest_affected',
    diagnosis: 'Aphid Infestation',
    confidence: 92,
    imageUrl: '/placeholder.svg',
  },
];

const statusConfig = {
  healthy: {
    label: 'Healthy',
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
  },
  diseased: {
    label: 'Diseased',
    icon: AlertTriangle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
  },
  pest_affected: {
    label: 'Pest Detected',
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
  },
};

export default function CropHealth() {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      setSelectedImage(null);
    }, 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Leaf className="h-8 w-8 text-success" />
            {t('cropHealth')}
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered disease and pest detection for your crops
          </p>
        </div>

        {/* Scan Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Card */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t('scanCrop')}
              </CardTitle>
              <CardDescription>
                Take or upload a photo of your crop for instant AI diagnosis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary/50">
                  <img
                    src={selectedImage}
                    alt="Selected crop"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => setSelectedImage(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <label className="block">
                  <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium">{t('uploadPhoto')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drag and drop or click to select
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports JPG, PNG up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
              )}

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  disabled={!selectedImage || isScanning}
                  onClick={handleScan}
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Leaf className="mr-2 h-4 w-4" />
                      Scan for Disease
                    </>
                  )}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-success/5 to-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Tips for Better Diagnosis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">📷</span>
                </div>
                <div>
                  <p className="font-medium">Good Lighting</p>
                  <p className="text-sm text-muted-foreground">
                    Take photos in natural daylight for accurate color detection
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">🔍</span>
                </div>
                <div>
                  <p className="font-medium">Close-up Shots</p>
                  <p className="text-sm text-muted-foreground">
                    Focus on affected leaves or areas showing symptoms
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">🍃</span>
                </div>
                <div>
                  <p className="font-medium">Multiple Angles</p>
                  <p className="text-sm text-muted-foreground">
                    Capture both top and bottom of leaves if possible
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <p className="font-medium">Enable Location</p>
                  <p className="text-sm text-muted-foreground">
                    Location helps track regional disease patterns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                {t('recentScans')}
              </CardTitle>
              <Button variant="ghost" size="sm">
                {t('viewAll')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentScans.map((scan) => {
                const config = statusConfig[scan.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;

                return (
                  <div
                    key={scan.id}
                    className={cn(
                      'p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer',
                      config.bg,
                      config.border
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img
                          src={scan.imageUrl}
                          alt={scan.cropName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{scan.cropName}</p>
                          <Badge
                            variant="outline"
                            className={cn('gap-1', config.color, config.border)}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </div>
                        {scan.diagnosis && (
                          <p className="text-sm font-medium text-destructive">
                            {scan.diagnosis}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {scan.scanDate.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {scan.confidence}% confidence
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Disease Library Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Crop Diseases</CardTitle>
            <CardDescription>
              Learn about diseases affecting crops in your region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Wheat Rust', crop: 'Wheat', severity: 'High' },
                { name: 'Late Blight', crop: 'Potato', severity: 'Critical' },
                { name: 'Powdery Mildew', crop: 'Various', severity: 'Medium' },
                { name: 'Bacterial Wilt', crop: 'Tomato', severity: 'High' },
              ].map((disease) => (
                <div
                  key={disease.name}
                  className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-3">
                    <span className="text-2xl">🦠</span>
                  </div>
                  <p className="font-medium text-sm">{disease.name}</p>
                  <p className="text-xs text-muted-foreground">{disease.crop}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      'mt-2 text-xs',
                      disease.severity === 'Critical' && 'border-destructive/50 text-destructive',
                      disease.severity === 'High' && 'border-warning/50 text-warning',
                      disease.severity === 'Medium' && 'border-muted-foreground/50'
                    )}
                  >
                    {disease.severity} Risk
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
