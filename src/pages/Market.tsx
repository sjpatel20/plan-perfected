import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, MapPin, Filter, ArrowUpDown } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

// Mock market data
const marketPrices = [
  { id: '1', commodity: 'Wheat', commodityLocal: 'गेहूं', mandi: 'Indore', state: 'MP', modal: 2450, min: 2380, max: 2520, prevModal: 2380, unit: 'quintal', arrival: 1250 },
  { id: '2', commodity: 'Rice (Basmati)', commodityLocal: 'चावल (बासमती)', mandi: 'Karnal', state: 'Haryana', modal: 4200, min: 4000, max: 4500, prevModal: 4100, unit: 'quintal', arrival: 850 },
  { id: '3', commodity: 'Soybean', commodityLocal: 'सोयाबीन', mandi: 'Dewas', state: 'MP', modal: 4800, min: 4650, max: 4950, prevModal: 4650, unit: 'quintal', arrival: 2100 },
  { id: '4', commodity: 'Cotton', commodityLocal: 'कपास', mandi: 'Nagpur', state: 'Maharashtra', modal: 6500, min: 6350, max: 6700, prevModal: 6480, unit: 'quintal', arrival: 450 },
  { id: '5', commodity: 'Gram (Chana)', commodityLocal: 'चना', mandi: 'Jaipur', state: 'Rajasthan', modal: 5200, min: 5050, max: 5400, prevModal: 5300, unit: 'quintal', arrival: 780 },
  { id: '6', commodity: 'Mustard', commodityLocal: 'सरसों', mandi: 'Alwar', state: 'Rajasthan', modal: 5600, min: 5450, max: 5750, prevModal: 5500, unit: 'quintal', arrival: 620 },
  { id: '7', commodity: 'Maize', commodityLocal: 'मक्का', mandi: 'Davangere', state: 'Karnataka', modal: 2100, min: 2000, max: 2200, prevModal: 2150, unit: 'quintal', arrival: 1800 },
  { id: '8', commodity: 'Groundnut', commodityLocal: 'मूंगफली', mandi: 'Junagadh', state: 'Gujarat', modal: 5800, min: 5600, max: 6000, prevModal: 5750, unit: 'quintal', arrival: 320 },
];

const nearbyMandis = [
  { name: 'Indore Mandi', distance: '5 km', commodities: 15, status: 'Open' },
  { name: 'Dewas Mandi', distance: '35 km', commodities: 12, status: 'Open' },
  { name: 'Ujjain Mandi', distance: '55 km', commodities: 18, status: 'Open' },
  { name: 'Dhar Mandi', distance: '60 km', commodities: 10, status: 'Closed' },
];

function getPriceChange(current: number, previous: number) {
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change).toFixed(1),
    direction: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable',
    absolute: current - previous,
  };
}

export default function Market() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');

  const filteredPrices = marketPrices.filter((price) => {
    const matchesSearch = 
      price.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.mandi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || price.state === selectedState;
    return matchesSearch && matchesState;
  });

  const states = [...new Set(marketPrices.map((p) => p.state))];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              {t('market')}
            </h1>
            <p className="text-muted-foreground mt-1">
              Live mandi prices across India
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
            {t('lastUpdated')}: {new Date().toLocaleTimeString()}
          </Badge>
        </div>

        {/* Nearby Mandis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t('nearbyMandis')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {nearbyMandis.map((mandi) => (
                <div
                  key={mandi.name}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{mandi.name}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        mandi.status === 'Open' ? 'text-success border-success/30' : 'text-muted-foreground'
                      )}
                    >
                      {mandi.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{mandi.distance}</p>
                  <p className="text-xs text-muted-foreground">{mandi.commodities} commodities</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commodity or mandi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('currentPrices')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Commodity</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mandi</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Modal Price</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Min/Max</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Change</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Arrivals</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrices.map((price) => {
                    const change = getPriceChange(price.modal, price.prevModal);
                    const TrendIcon = change.direction === 'up' ? TrendingUp : change.direction === 'down' ? TrendingDown : Minus;

                    return (
                      <tr key={price.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="text-lg">🌾</span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {language === 'en' ? price.commodity : price.commodityLocal}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {language !== 'en' && price.commodity}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium">{price.mandi}</p>
                          <p className="text-xs text-muted-foreground">{price.state}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-semibold text-lg">₹{price.modal.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">/{price.unit}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="text-sm">
                            ₹{price.min.toLocaleString()} - ₹{price.max.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Badge
                            variant="outline"
                            className={cn(
                              'gap-1',
                              change.direction === 'up' && 'text-success border-success/30 bg-success/10',
                              change.direction === 'down' && 'text-destructive border-destructive/30 bg-destructive/10'
                            )}
                          >
                            <TrendIcon className="h-3 w-3" />
                            {change.direction !== 'stable' && (
                              <>
                                {change.direction === 'up' ? '+' : '-'}₹{Math.abs(change.absolute)}
                              </>
                            )}
                            {change.direction === 'stable' && 'Stable'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right hidden md:table-cell">
                          <p className="text-sm">{price.arrival.toLocaleString()} q</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Best Prices */}
        <Card className="bg-gradient-to-br from-success/5 to-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🏆 {t('bestPrice')} Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketPrices
                .sort((a, b) => {
                  const changeA = getPriceChange(a.modal, a.prevModal);
                  const changeB = getPriceChange(b.modal, b.prevModal);
                  return parseFloat(changeB.value) - parseFloat(changeA.value);
                })
                .slice(0, 3)
                .map((price, index) => {
                  const change = getPriceChange(price.modal, price.prevModal);
                  const rankColors = ['bg-warning', 'bg-muted-foreground', 'bg-accent'];
                  return (
                    <div key={price.id} className="p-4 bg-card rounded-lg border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-white',
                          rankColors[index] || 'bg-muted'
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{price.commodity}</p>
                          <p className="text-xs text-muted-foreground">{price.mandi}</p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold">₹{price.modal.toLocaleString()}</p>
                        <Badge className="bg-success text-success-foreground">
                          +{change.value}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
