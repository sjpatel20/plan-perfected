import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DiagnosisResult {
  status: 'healthy' | 'diseased' | 'pest_affected' | 'nutrient_deficiency' | 'unknown';
  disease_name: string | null;
  confidence: number;
  description: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AnalyzeParams {
  imageBase64: string;
  cropName?: string;
  location?: { latitude: number; longitude: number };
}

export function useCropAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeCrop = async ({ imageBase64, cropName, location }: AnalyzeParams) => {
    setIsAnalyzing(true);
    setError(null);
    setDiagnosis(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to analyze crops');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-crop`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            image_base64: imageBase64,
            crop_name: cropName,
            location: location ? `${location.latitude}, ${location.longitude}` : undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 429) {
          toast({
            title: 'Rate Limit',
            description: 'Too many requests. Please wait a moment and try again.',
            variant: 'destructive',
          });
          throw new Error('Rate limit exceeded');
        }
        
        if (response.status === 402) {
          toast({
            title: 'Service Unavailable',
            description: 'AI analysis quota exceeded. Please try again later.',
            variant: 'destructive',
          });
          throw new Error('Service quota exceeded');
        }
        
        throw new Error(errorData.error || 'Failed to analyze crop');
      }

      const { diagnosis: result } = await response.json();
      setDiagnosis(result);

      toast({
        title: 'Analysis Complete',
        description: result.status === 'healthy' 
          ? 'Your crop appears to be healthy!' 
          : `Detected: ${result.disease_name || result.status}`,
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      toast({
        title: 'Analysis Failed',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setDiagnosis(null);
    setError(null);
  };

  return {
    analyzeCrop,
    isAnalyzing,
    diagnosis,
    error,
    reset,
  };
}
