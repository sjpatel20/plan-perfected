import { useState } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Droplets, Wind, MapPin, Calendar, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeather } from '@/hooks/useWeather';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
};

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}

// Mock hourly data for the chart
const generateHourlyChartData = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;
    const temp = 8 + Math.sin((i - 6) * Math.PI / 12) * 12 + Math.random() * 2;
    hours.push({ hour, temp: Math.round(temp) });
  }
  return hours;
};

export default function Weather() {
  const { t } = useLanguage();
  const { weather, isLoading, error, refetch } = useWeather();
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [activeTab, setActiveTab] = useState('7-day');

  const hourlyChartData = generateHourlyChartData();

  const CurrentWeatherIcon = weather ? weatherIcons[weather.current.condition] : Cloud;

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

  const daysOfWeek = ['Today', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Weather Card */}
          <Card className="lg:col-span-2 overflow-hidden border-0">
            <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 p-6 md:p-8 rounded-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-lg">Today</p>
                  <p className="text-7xl font-bold text-white mt-2">{weather.current.temp}°C</p>
                  <p className="text-xl text-white/90 mt-2">{weather.current.description}</p>
                  <Badge className="mt-3 bg-white/20 text-white border-0 gap-1">
                    <MapPin className="h-3 w-3" />
                    {weather.location}
                  </Badge>
                </div>
                <div className="text-8xl opacity-90">
                  <CurrentWeatherIcon className="h-24 w-24 text-white" />
                </div>
              </div>

              {/* Weather Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Wind className="h-5 w-5 text-white mx-auto mb-2" />
                  <p className="text-white/80 text-sm">Wind</p>
                  <p className="text-white font-semibold">{weather.current.windSpeed} km/h</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Droplets className="h-5 w-5 text-white mx-auto mb-2" />
                  <p className="text-white/80 text-sm">Humidity</p>
                  <p className="text-white font-semibold">{weather.current.humidity}%</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <CloudRain className="h-5 w-5 text-white mx-auto mb-2" />
                  <p className="text-white/80 text-sm">Precipitation</p>
                  <p className="text-white font-semibold">{weather.current.rainfall} mm</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Side Cards */}
          <div className="space-y-4">
            {/* Weather Alert */}
            <Card className="border-warning/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-4 w-4" />
                  Weather Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">No severe alerts currently.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Conditions are favorable for field operations.
                </p>
              </CardContent>
            </Card>

            {/* Farm Advisory */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Farm Advisory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-primary">Current Conditions</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Temp: {weather.current.temp}°C, Humidity: {weather.current.humidity}%. Appropriate for spraying and harvesting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs: 7-Day Forecast / Detailed Analytics */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className="bg-muted">
              <TabsTrigger value="7-day">7-Day Forecast</TabsTrigger>
              <TabsTrigger value="analytics">Detailed Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="7-day" className="mt-4">
            {/* Day Pills */}
            <div className="flex gap-2 justify-center flex-wrap mb-6">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDay(day)}
                  className={selectedDay === day ? 'bg-primary text-primary-foreground' : ''}
                >
                  {day}
                </Button>
              ))}
            </div>

            {/* Hourly Temperature Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Hourly Temperature - {selectedDay}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fontSize: 10 }} 
                        tickLine={false}
                        axisLine={false}
                        interval={1}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}°C`}
                        domain={['dataMin - 2', 'dataMax + 2']}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-popover border rounded-lg p-2 shadow-lg">
                                <p className="text-sm font-medium">{payload[0].payload.hour}</p>
                                <p className="text-sm text-primary">{payload[0].value}°C</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#tempGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weekly Weather Summary</CardTitle>
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
                        <Icon className="h-8 w-8 text-warning" />
                        <span className="text-sm text-muted-foreground capitalize w-16">{day.condition}</span>
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
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
