import { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface DiagnosisResultJson {
  status?: string;
  disease_name?: string | null;
  description?: string;
}

interface CropScan {
  id: string;
  scan_date: string;
  disease_detected: string | null;
  confidence_score: number | null;
  image_url: string;
  diagnosis_result: DiagnosisResultJson | null;
}

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
    icon: XCircle,
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

export function ScanHistory() {
  const { t } = useLanguage();
  const [scans, setScans] = useState<CropScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const { data, error } = await supabase
        .from('crop_scans')
        .select('*')
        .order('scan_date', { ascending: false })
        .limit(6);

      if (error) throw error;
      // Cast the Json type to our expected interface
      const typedScans = (data || []).map(scan => ({
        ...scan,
        diagnosis_result: scan.diagnosis_result as DiagnosisResultJson | null
      }));
      setScans(typedScans);
    } catch (err) {
      console.error('Error fetching scans:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            {t('recentScans')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border animate-pulse">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (scans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            {t('recentScans')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No scans yet. Upload a crop image to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
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
          {scans.map((scan) => {
            const diagnosisResult = scan.diagnosis_result as CropScan['diagnosis_result'];
            const status = diagnosisResult?.status || 'healthy';
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.healthy;
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
                      src={scan.image_url || '/placeholder.svg'}
                      alt="Crop scan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">
                        {diagnosisResult?.disease_name || 'Healthy Crop'}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn('gap-1 shrink-0', config.color, config.border)}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {new Date(scan.scan_date).toLocaleDateString()}
                      </p>
                      {scan.confidence_score && (
                        <p className="text-xs text-muted-foreground">
                          {scan.confidence_score}% confidence
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
