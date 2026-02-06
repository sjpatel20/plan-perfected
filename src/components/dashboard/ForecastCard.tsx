import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { WeatherCondition } from './WeatherCard';

interface ForecastDay {
  day: string;
  condition: WeatherCondition;
  high: number;
  low: number;
  rainChance: number;
}

interface ForecastCardProps {
  forecast: ForecastDay[];
  className?: string;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
};

const weatherColors = {
  sunny: 'text-amber-500',
  cloudy: 'text-slate-400',
  rainy: 'text-blue-500',
  stormy: 'text-purple-600',
};

export function ForecastCard({ forecast, className }: ForecastCardProps) {
  const { t } = useLanguage();

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Cloud className="h-5 w-5 text-info" />
          {t('forecast')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {forecast.map((day, index) => {
            const Icon = weatherIcons[day.condition];
            
            return (
              <div
                key={day.day}
                className={cn(
                  'flex flex-col items-center p-3 rounded-xl min-w-[80px] transition-all',
                  index === 0
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted'
                )}
              >
                <span className={cn(
                  'text-xs font-medium mb-2',
                  index === 0 ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                  {day.day}
                </span>
                <Icon className={cn(
                  'h-8 w-8 mb-2',
                  index === 0 ? 'text-primary-foreground' : weatherColors[day.condition]
                )} />
                <div className={cn(
                  'text-center',
                  index === 0 ? 'text-primary-foreground' : ''
                )}>
                  <span className="font-semibold">{day.high}°</span>
                  <span className={cn(
                    'text-sm ml-1',
                    index === 0 ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {day.low}°
                  </span>
                </div>
                {day.rainChance > 0 && (
                  <span className={cn(
                    'text-xs mt-1 flex items-center gap-1',
                    index === 0 ? 'text-primary-foreground/80' : 'text-info'
                  )}>
                    💧 {day.rainChance}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
