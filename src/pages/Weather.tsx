import { Sun, Cloud, CloudRain, CloudLightning, Droplets, Wind, Thermometer, MapPin, Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeather, WeatherCondition } from '@/hooks/useWeather';

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

const weatherGradients = {
  sunny: 'from-amber-400 via-orange-400 to-yellow-500',
  cloudy: 'from-slate-400 via-gray-400 to-slate-500',
  rainy: 'from-blue-500 via-sky-500 to-blue-600',
  stormy: 'from-slate-700 via-purple-700 to-slate-800',
};

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-40" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}

export default function Weather() {
  const { t } = useLanguage();
  const { weather, isLoading, error, refetch } = useWeather();

  const CurrentWeatherIcon = weather ? weatherIcons[weather.current.condition] : Sun;
  const currentGradient = weather ? weatherGradients[weather.current.condition] : weatherGradients.sunny;

  // Generate agricultural advisory based on weather
  const getAdvisory = () => {
    if (!weather) return { favorable: [], precautions: [] };
    
    const favorable: string[] = [];
    const precautions: string[] = [];
    
    const { current, weekly } = weather;
    
    // Current conditions
    if (current.condition === 'sunny' && current.temp < 35) {
      favorable.push('Good weather for field activities');
      favorable.push('Ideal conditions for fertilizer application');
    }
    
    if (current.humidity > 70) {
      precautions.push('High humidity - monitor for fungal diseases');
    }
    
    // Check upcoming rain
    const upcomingRain = weekly.find(day => day.rainChance > 60);
    if (upcomingRain) {
      precautions.push(`Heavy rain expected on ${upcomingRain.day} - plan accordingly`);
      precautions.push('Complete pesticide spraying before rain');
    }
    
    if (current.windSpeed > 25) {
      precautions.push('High winds - avoid pesticide spraying');
    }
    
    if (favorable.length === 0) {
      favorable.push('Monitor conditions for optimal field work timing');
    }
    
    if (precautions.length === 0) {
      precautions.push('No immediate weather concerns');
    }
    
    return { favorable, precautions };
  };

  const advisory = getAdvisory();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-fade-in">
          <WeatherSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (error || !weather) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <AlertTriangle className="h-16 w-16 text-warning" />
          <h2 className="text-xl font-semibold">Unable to load weather data</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {error || 'Please check your internet connection and try again.'}
          </p>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
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
              <Cloud className="h-8 w-8 text-info" />
              {t('weather')}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {weather.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={refetch} variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('lastUpdated')}: {new Date(weather.lastUpdated).toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        {/* Current Weather */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-br ${currentGradient} p-6 md:p-8`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CurrentWeatherIcon className="h-16 w-16 text-white" />
                </div>
                <div>
                  <div className="text-6xl md:text-7xl font-bold text-white">
                    {weather.current.temp}°
                  </div>
                  <p className="text-xl text-white/90 mt-1">Feels like {weather.current.feelsLike}°</p>
                  <p className="text-white/80 capitalize">{weather.current.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Droplets className="h-6 w-6 text-white mx-auto mb-2" />
                  <p className="text-2xl font-semibold text-white">{weather.current.humidity}%</p>
                  <p className="text-white/70 text-sm">{t('humidity')}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Wind className="h-6 w-6 text-white mx-auto mb-2" />
                  <p className="text-2xl font-semibold text-white">{weather.current.windSpeed}</p>
                  <p className="text-white/70 text-sm">{t('wind')}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <CloudRain className="h-6 w-6 text-white mx-auto mb-2" />
                  <p className="text-2xl font-semibold text-white">{weather.current.rainfall}mm</p>
                  <p className="text-white/70 text-sm">{t('rainfall')}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Thermometer className="h-6 w-6 text-white mx-auto mb-2" />
                  <p className="text-2xl font-semibold text-white">{weather.current.pressure}</p>
                  <p className="text-white/70 text-sm">hPa</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Weather Alert */}
        {weather.weekly.some(day => day.rainChance > 60) && (
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warning">{t('weatherWarning')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Heavy rainfall expected in the coming days. Consider completing field activities before the rain arrives.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hourly Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hourly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {weather.hourly.map((hour, index) => {
                const Icon = weatherIcons[hour.condition];
                return (
                  <div
                    key={hour.time}
                    className={`flex flex-col items-center p-4 rounded-xl min-w-[80px] ${
                      index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted/50'
                    }`}
                  >
                    <span className={`text-sm font-medium ${index === 0 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {hour.time}
                    </span>
                    <Icon className={`h-8 w-8 my-2 ${index === 0 ? 'text-primary-foreground' : weatherColors[hour.condition]}`} />
                    <span className="font-semibold text-lg">{hour.temp}°</span>
                    {hour.rainChance > 0 && (
                      <span className={`text-xs mt-1 ${index === 0 ? 'text-primary-foreground/80' : 'text-info'}`}>
                        💧 {hour.rainChance}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('forecast')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weather.weekly.map((day, index) => {
              const Icon = weatherIcons[day.condition];
              return (
                <div
                  key={`${day.day}-${day.date}`}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    index === 0 ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30 hover:bg-muted/50'
                  } transition-colors`}
                >
                  <div className="flex items-center gap-4 min-w-[140px]">
                    <div>
                      <p className="font-medium">{day.day}</p>
                      <p className="text-sm text-muted-foreground">{day.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Icon className={`h-8 w-8 ${weatherColors[day.condition]}`} />
                    <span className="text-sm text-muted-foreground capitalize w-16">{t(day.condition)}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="font-semibold">{day.high}°</span>
                      <span className="text-muted-foreground ml-1">{day.low}°</span>
                    </div>
                    
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <Droplets className="h-4 w-4 text-info" />
                      <span className="text-sm">{day.rainChance}%</span>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-1 min-w-[60px]">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{day.humidity}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Agricultural Advisory */}
        <Card className="bg-gradient-to-br from-primary/5 to-success/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🌾 Agricultural Weather Advisory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="text-success">✓</span> Favorable Conditions
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {advisory.favorable.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="text-warning">⚠</span> Precautions
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {advisory.precautions.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
