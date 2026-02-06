import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageUploadProps {
  onAnalyze: (imageBase64: string, cropName?: string) => Promise<void>;
  isAnalyzing: boolean;
}

export function ImageUpload({ onAnalyze, isAnalyzing }: ImageUploadProps) {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropName, setCropName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    // Extract base64 data from data URL
    const base64Data = selectedImage.split(',')[1];
    await onAnalyze(base64Data, cropName || undefined);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setCropName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
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
              onClick={clearImage}
              disabled={isAnalyzing}
            >
              <X className="h-4 w-4 mr-1" />
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
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>
        )}

        {selectedImage && (
          <div className="space-y-2">
            <Label htmlFor="cropName">Crop Name (Optional)</Label>
            <Input
              id="cropName"
              placeholder="e.g., Wheat, Rice, Tomato..."
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>
        )}

        <div className="flex gap-3">
          <Button
            className="flex-1"
            disabled={!selectedImage || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Analyze Crop
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
          <input
            ref={cameraInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
          />
        </div>
      </CardContent>
    </Card>
  );
}
