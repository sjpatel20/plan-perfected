import { CheckCircle, AlertTriangle, XCircle, Leaf, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DiagnosisResult as DiagnosisResultType } from '@/hooks/useCropAnalysis';

interface DiagnosisResultProps {
  diagnosis: DiagnosisResultType;
  onNewScan: () => void;
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
    label: 'Disease Detected',
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
  nutrient_deficiency: {
    label: 'Nutrient Deficiency',
    icon: AlertTriangle,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  unknown: {
    label: 'Unknown',
    icon: Info,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    border: 'border-muted-foreground/30',
  },
};

const severityConfig = {
  low: { label: 'Low Severity', color: 'bg-green-500' },
  medium: { label: 'Medium Severity', color: 'bg-yellow-500' },
  high: { label: 'High Severity', color: 'bg-orange-500' },
  critical: { label: 'Critical', color: 'bg-red-500' },
};

export function DiagnosisResultCard({ diagnosis, onNewScan }: DiagnosisResultProps) {
  const config = statusConfig[diagnosis.status];
  const severity = severityConfig[diagnosis.severity];
  const StatusIcon = config.icon;

  return (
    <Card className={cn('overflow-hidden', config.bg, config.border)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className={cn('h-6 w-6', config.color)} />
            <span className={config.color}>{config.label}</span>
          </CardTitle>
          <Badge className={cn('text-white', severity.color)}>
            {severity.label}
          </Badge>
        </div>
        {diagnosis.disease_name && (
          <p className="text-lg font-semibold mt-2">{diagnosis.disease_name}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confidence */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Confidence:</span>
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={cn('h-full rounded-full', config.color.replace('text-', 'bg-'))}
              style={{ width: `${diagnosis.confidence}%` }}
            />
          </div>
          <span className="text-sm font-medium">{diagnosis.confidence}%</span>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-medium mb-2">Analysis</h4>
          <p className="text-sm text-muted-foreground">{diagnosis.description}</p>
        </div>

        {/* Recommendations */}
        {diagnosis.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-success" />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {diagnosis.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm bg-background/50 p-3 rounded-lg"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">
                    {index + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={onNewScan} className="w-full mt-4">
          Scan Another Crop
        </Button>
      </CardContent>
    </Card>
  );
}
