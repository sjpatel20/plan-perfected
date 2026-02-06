import { Sun, Cloud, CloudRain, CloudLightning, Droplets, Wind, Thermometer, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { WeatherCondition } from '@/components/dashboard/WeatherCard';

// Mock hourly forecast data
const hourlyForecast = [
  { time: '6 AM', temp: 24, condition: 'sunny' as WeatherCondition, rainChance: 0 },
  { time: '9 AM', temp: 28, condition: 'sunny' as WeatherCondition, rainChance: 5 },
  { time: '12 PM', temp: 32, condition: 'sunny' as WeatherCondition, rainChance: 10 },
  { time: '3 PM', temp: 34, condition: 'cloudy' as WeatherCondition, rainChance: 25 },
  { time: '6 PM', temp: 30, condition: 'cloudy' as WeatherCondition, rainChance: 35 },
  { time: '9 PM', temp: 27, condition: 'rainy' as WeatherCondition, rainChance: 60 },
];

const weeklyForecast = [
  { day: 'Today', date: 'Feb 6', condition: 'sunny' as WeatherCondition, high: 34, low: 24, rainChance: 10, humidity: 65 },
  { day: 'Fri', date: 'Feb 7', condition: 'cloudy' as WeatherCondition, high: 32, low: 23, rainChance: 30, humidity: 70 },
  { day: 'Sat', date: 'Feb 8', condition: 'rainy' as WeatherCondition, high: 28, low: 22, rainChance: 80, humidity: 85 },
  { day: 'Sun', date: 'Feb 9', condition: 'rainy' as WeatherCondition, high: 27, low: 21, rainChance: 75, humidity: 82 },
  { day: 'Mon', date: 'Feb 10', condition: 'cloudy' as WeatherCondition, high: 29, low: 22, rainChance: 40, humidity: 72 },
  { day: 'Tue', date: 'Feb 11', condition: 'sunny' as WeatherCondition, high: 31, low: 23, rainChance: 15, humidity: 65 },
  { day: 'Wed', date: 'Feb 12', condition: 'sunny' as WeatherCondition, high: 33, low: 24, rainChance: 5, humidity: 60 },
];

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

export default function Weather() {
  const { t } = useLanguage();

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
              Indore, Madhya Pradesh
            </p>
          </div>
          <Badge variant="outline" className="w-fit flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('lastUpdated')}: {new Date().toLocaleTimeString()}
          </Badge>
        </div>

        {/* Current Weather */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sun className="h-16 w-16 text-white" />
                </div>
                <div>
                  <div className="text-6xl md:text-7xl font-bold text-white">
                    32°
                  </div>
                  <p className="text-xl text-white/90 mt-1">Feels like 35°</p>
                  <p className="text-white/80">{t('sunny')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Droplets className="h-6 w-6 text-white mx-auto mb-2" />
                  <p className="text-2xl font-semibold text-white">65%</p>
                  <p className="text-white/70 text-sm">{t('humidity')}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Wind className="h-6 w-6 text-white mx-auto mb-2" />
                  <p className="text-2xl font-semibold text-white">15</p>
                  <p className="text-white/70 text-sm">{t('wind')}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <CloudRain className="h-6 w-6 text-white mx-auto mb-2" />
                  <p className="text-2xl font-semibold text-white">12mm</p>
                  <p className="text-white/70 text-sm">{t('rainfall')}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Thermometer className="h-6 w-6 text-white mx-auto mb-2" />
                  <p className="text-2xl font-semibold text-white">1015</p>
                  <p className="text-white/70 text-sm">hPa</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Weather Alert */}
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning">{t('weatherWarning')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Heavy rainfall expected from Saturday to Sunday. Consider completing field activities before Friday evening. Expected precipitation: 45-60mm.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hourly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {hourlyForecast.map((hour, index) => {
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
            {weeklyForecast.map((day, index) => {
              const Icon = weatherIcons[day.condition];
              return (
                <div
                  key={day.day}
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
                  <li>• Good weather for wheat crop tillering stage</li>
                  <li>• Ideal conditions for fertilizer application today</li>
                  <li>• Suitable for irrigation planning</li>
                </ul>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="text-warning">⚠</span> Precautions
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete pesticide spraying before Saturday rain</li>
                  <li>• Ensure proper drainage in low-lying areas</li>
                  <li>• Cover harvested produce to protect from moisture</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
