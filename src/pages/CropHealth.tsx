import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCropAnalysis } from '@/hooks/useCropAnalysis';
import { ImageUpload } from '@/components/crop-health/ImageUpload';
import { DiagnosisResultCard } from '@/components/crop-health/DiagnosisResult';
import { ScanHistory } from '@/components/crop-health/ScanHistory';
import { cn } from '@/lib/utils';

export default function CropHealth() {
  const { t } = useLanguage();
  const { analyzeCrop, isAnalyzing, diagnosis, reset } = useCropAnalysis();
  const [scanRefreshTrigger, setScanRefreshTrigger] = useState(0);

  const handleAnalyze = async (imageBase64: string, cropName?: string) => {
    await analyzeCrop({ 
      imageBase64, 
      cropName,
      onScanSaved: () => setScanRefreshTrigger(prev => prev + 1)
    });
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
          {/* Show diagnosis result or upload card */}
          {diagnosis ? (
            <DiagnosisResultCard diagnosis={diagnosis} onNewScan={reset} />
          ) : (
            <ImageUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          )}

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
        <ScanHistory refreshTrigger={scanRefreshTrigger} />

        {/* Disease Library Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Crop Diseases</CardTitle>
            <p className="text-sm text-muted-foreground">
              Learn about diseases affecting crops in your region
            </p>
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
