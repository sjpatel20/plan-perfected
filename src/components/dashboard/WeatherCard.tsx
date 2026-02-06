import { Sun, Cloud, CloudRain, CloudLightning, Droplets, Wind, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy';

interface WeatherCardProps {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: WeatherCondition;
  location: string;
  className?: string;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
};

const weatherGradients = {
  sunny: 'from-amber-400 via-orange-400 to-yellow-500',
  cloudy: 'from-slate-400 via-gray-400 to-slate-500',
  rainy: 'from-blue-500 via-sky-500 to-blue-600',
  stormy: 'from-slate-700 via-purple-700 to-slate-800',
};

export function WeatherCard({
  temperature,
  humidity,
  rainfall,
  windSpeed,
  condition,
  location,
  className,
}: WeatherCardProps) {
  const { t } = useLanguage();
  const WeatherIcon = weatherIcons[condition];

  return (
    <Card className={cn('overflow-hidden relative', className)}>
      {/* Weather gradient background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-90',
        weatherGradients[condition]
      )} />
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white/90 text-sm font-medium">
            {t('todayWeather')}
          </CardTitle>
          <span className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded-full">
            {location}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <WeatherIcon className="h-10 w-10 text-white" />
            </div>
            <div>
              <div className="text-5xl font-bold text-white">
                {temperature}
                <span className="text-2xl">{t('celsius')}</span>
              </div>
              <p className="text-white/80 capitalize">{t(condition)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Droplets className="h-5 w-5 text-white mx-auto mb-1" />
            <p className="text-white text-lg font-semibold">{humidity}{t('percent')}</p>
            <p className="text-white/70 text-xs">{t('humidity')}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <CloudRain className="h-5 w-5 text-white mx-auto mb-1" />
            <p className="text-white text-lg font-semibold">{rainfall}{t('mm')}</p>
            <p className="text-white/70 text-xs">{t('rainfall')}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Wind className="h-5 w-5 text-white mx-auto mb-1" />
            <p className="text-white text-lg font-semibold">{windSpeed}</p>
            <p className="text-white/70 text-xs">{t('wind')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
