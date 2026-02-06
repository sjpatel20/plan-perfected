import { Camera, TrendingUp, FileText, Leaf, Cloud, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { AlertCard, Alert } from '@/components/dashboard/AlertCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { MarketPriceCard, CropPrice } from '@/components/dashboard/MarketPriceCard';
import { ForecastCard } from '@/components/dashboard/ForecastCard';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data - will be replaced with real API data
const mockWeatherAlerts: Alert[] = [
  {
    id: '1',
    title: 'Heavy Rain Expected',
    message: 'Heavy rainfall expected in the next 48 hours. Consider postponing field activities.',
    severity: 'warning',
    timestamp: new Date(),
  },
  {
    id: '2',
    title: 'Favorable Sowing Conditions',
    message: 'Soil moisture levels optimal for Rabi crop sowing this week.',
    severity: 'success',
    timestamp: new Date(Date.now() - 3600000),
  },
];

const mockPrices: CropPrice[] = [
  {
    id: '1',
    cropName: 'Wheat',
    cropNameLocal: 'गेहूं',
    price: 2450,
    previousPrice: 2380,
    unit: 'quintal',
    mandi: 'Indore Mandi',
  },
  {
    id: '2',
    cropName: 'Rice',
    cropNameLocal: 'चावल',
    price: 3200,
    previousPrice: 3250,
    unit: 'quintal',
    mandi: 'Kolar Mandi',
  },
  {
    id: '3',
    cropName: 'Soybean',
    cropNameLocal: 'सोयाबीन',
    price: 4800,
    previousPrice: 4650,
    unit: 'quintal',
    mandi: 'Dewas Mandi',
  },
  {
    id: '4',
    cropName: 'Cotton',
    cropNameLocal: 'कपास',
    price: 6500,
    previousPrice: 6480,
    unit: 'quintal',
    mandi: 'Nagpur Mandi',
  },
];

const mockForecast = [
  { day: 'Today', condition: 'sunny' as const, high: 32, low: 24, rainChance: 10 },
  { day: 'Tue', condition: 'cloudy' as const, high: 30, low: 23, rainChance: 30 },
  { day: 'Wed', condition: 'rainy' as const, high: 28, low: 22, rainChance: 80 },
  { day: 'Thu', condition: 'rainy' as const, high: 27, low: 21, rainChance: 70 },
  { day: 'Fri', condition: 'cloudy' as const, high: 29, low: 22, rainChance: 40 },
  { day: 'Sat', condition: 'sunny' as const, high: 31, low: 23, rainChance: 15 },
  { day: 'Sun', condition: 'sunny' as const, high: 33, low: 24, rainChance: 5 },
];

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('welcomeMessage')} 👋
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              Indore, Madhya Pradesh
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('lastUpdated')}: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Weather */}
          <div className="lg:col-span-2 space-y-6">
            <WeatherCard
              temperature={32}
              humidity={65}
              rainfall={12}
              windSpeed={15}
              condition="sunny"
              location="Indore"
            />
            
            <ForecastCard forecast={mockForecast} />
          </div>

          {/* Right Column - Alerts */}
          <div className="space-y-6">
            <AlertCard alerts={mockWeatherAlerts} />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon={Camera}
              title={t('scanCrop')}
              description="AI disease detection"
              href="/crop-health"
              color="success"
            />
            <QuickActionCard
              icon={TrendingUp}
              title={t('market')}
              description="Live mandi prices"
              href="/market"
              color="warning"
            />
            <QuickActionCard
              icon={Cloud}
              title={t('weather')}
              description="Detailed forecast"
              href="/weather"
              color="info"
            />
            <QuickActionCard
              icon={FileText}
              title={t('schemes')}
              description="Govt schemes"
              href="/schemes"
              color="primary"
            />
          </div>
        </div>

        {/* Market Prices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketPriceCard prices={mockPrices} />
          
          {/* Crop Status Summary */}
          <div className="bg-gradient-to-br from-primary/10 via-success/10 to-accent/10 rounded-2xl p-6 border">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              {t('cropStatus')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌾</span>
                  <div>
                    <p className="font-medium">Wheat (Rabi)</p>
                    <p className="text-sm text-muted-foreground">Sown: 15 Jan 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
                    {t('healthy')}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">Stage: Tillering</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🫛</span>
                  <div>
                    <p className="font-medium">Chickpea (Chana)</p>
                    <p className="text-sm text-muted-foreground">Sown: 20 Oct 2025</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning">
                    Monitor
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">Stage: Flowering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
