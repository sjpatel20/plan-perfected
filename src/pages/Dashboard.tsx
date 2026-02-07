import { Plus, Cloud, Leaf, TrendingUp, ArrowUpRight, Droplets, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/hooks/useProfile';
import { usePlots } from '@/hooks/usePlots';

// Mock data
const mockWeather = {
  temp: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  wind: 12,
};

const recommendedActions = [
  { title: 'Irrigate Plot A', description: 'Soil moisture is low (~20%)', time: 'Today, 4:00 PM' },
  { title: 'Fertilizer Application', description: 'Recommended for Wheat crop', time: 'Tomorrow' },
  { title: 'Check Pest Trap', description: 'Weekly maintenance', time: 'Wed, 12th Feb' },
];

const mandiPrices = [
  { crop: 'Wheat', initial: 'W', price: 2100, change: 1.2 },
  { crop: 'Rice (Basmati)', initial: 'R', price: 3800, change: -0.5 },
  { crop: 'Mustard', initial: 'M', price: 5400, change: 0.8 },
  { crop: 'Cotton', initial: 'C', price: 6200, change: 0 },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { plots, totalArea, activeCropsCount } = usePlots();

  const userName = profile?.full_name?.split(' ')[0] || 'Kissan';

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              Welcome back, {userName}! <span className="text-2xl">👋</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening on your farm today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/weather" className="gap-2">
                <Cloud className="h-4 w-4" />
                Weather
              </Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/plots" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Plot
              </Link>
            </Button>
          </div>
        </div>

        {/* Weather & Farm Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Current Weather Card */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <Cloud className="h-4 w-4" />
                    Current Weather
                  </p>
                  <p className="text-5xl font-bold mt-2">{mockWeather.temp}°C</p>
                  <p className="text-white/90 mt-1">{mockWeather.condition}</p>
                </div>
                <div className="text-6xl opacity-80">
                  ⛅
                </div>
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-white/80" />
                  <span>{mockWeather.humidity}% Humidity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-white/80" />
                  <span>{mockWeather.wind} km/h Wind</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farm Overview */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Farm Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {/* Active Plots */}
                <div className="p-4 rounded-xl border bg-success/5 border-success/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-success font-medium">Active Plots</p>
                    <Leaf className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{plots.length || 4}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total {totalArea.toFixed(1) || '12.5'} Acres
                  </p>
                </div>

                {/* Pending Tasks */}
                <div className="p-4 rounded-xl border bg-warning/5 border-warning/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-warning font-medium">Pending Tasks</p>
                    <ArrowUpRight className="h-4 w-4 text-warning" />
                  </div>
                  <p className="text-3xl font-bold mt-2">3</p>
                  <p className="text-xs text-muted-foreground mt-1">2 high priority</p>
                </div>

                {/* Market Updates */}
                <div className="p-4 rounded-xl border bg-primary/5 border-primary/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-primary font-medium">Market Updates</p>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-3xl font-bold mt-2 flex items-center">
                    Wheat <TrendingUp className="h-5 w-5 text-success ml-2" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">₹2,100 / Quintal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Actions & Mandi Prices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recommended Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {recommendedActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">{action.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Local Mandi Prices */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Local Mandi Prices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {mandiPrices.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {item.initial}
                    </div>
                    <span className="font-medium">{item.crop}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.price.toLocaleString()}</p>
                    <p className={`text-xs ${item.change > 0 ? 'text-success' : item.change < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
