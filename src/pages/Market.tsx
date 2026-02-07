import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, Filter, Calendar, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { CreateAlertDialog } from '@/components/market/CreateAlertDialog';
import { PriceAlertsList } from '@/components/market/PriceAlertsList';

// Mock market data
const marketPrices = [
  { id: '1', commodity: 'Wheat', mandi: 'Khanna', state: 'Punjab', min: 2100, max: 2350, modal: 2275, trend: 'high' },
  { id: '2', commodity: 'Rice (Basmati)', mandi: 'Ludhiana', state: 'Punjab', min: 3500, max: 4200, modal: 3950, trend: 'stable' },
  { id: '3', commodity: 'Wheat', mandi: 'Karnal', state: 'Haryana', min: 2150, max: 2380, modal: 2300, trend: 'high' },
  { id: '4', commodity: 'Potato', mandi: 'Ambala', state: 'Haryana', min: 600, max: 850, modal: 750, trend: 'low' },
  { id: '5', commodity: 'Onion', mandi: 'Pune', state: 'Maharashtra', min: 1200, max: 1800, modal: 1550, trend: 'high' },
  { id: '6', commodity: 'Tomato', mandi: 'Nashik', state: 'Maharashtra', min: 1500, max: 2200, modal: 1900, trend: 'low' },
  { id: '7', commodity: 'Potato', mandi: 'Agra', state: 'Uttar Pradesh', min: 650, max: 900, modal: 800, trend: 'stable' },
];

const topGainer = { commodity: 'Cotton', change: '+2.5%', price: '₹6,900/qt' };
const topLoser = { commodity: 'Tomato', change: '-1.8%', price: '₹1,900/qt' };
const highDemand = { commodity: 'Wheat', info: 'High Volume Trade', markets: 'Punjab, MP' };

export default function Market() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');

  const filteredPrices = marketPrices.filter((price) => {
    const matchesSearch = 
      price.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.mandi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || price.state === selectedState;
    const matchesCommodity = selectedCommodity === 'all' || price.commodity === selectedCommodity;
    return matchesSearch && matchesState && matchesCommodity;
  });

  const states = [...new Set(marketPrices.map((p) => p.state))];
  const commodities = [...new Set(marketPrices.map((p) => p.commodity))];

  const today = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'high':
        return <Badge className="bg-success/10 text-success border-success/20 gap-1"><TrendingUp className="h-3 w-3" />High</Badge>;
      case 'low':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1"><TrendingDown className="h-3 w-3" />Low</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Minus className="h-3 w-3" />Stable</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Smart Mandi Live <span className="text-success">Live</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time agricultural commodity prices across India.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              {today}
            </Badge>
            <Button className="bg-success hover:bg-success/90 text-white">
              Live Updates
            </Button>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top Gainer */}
          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Top Gainer (24h)</p>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <p className="text-2xl font-bold mt-2">{topGainer.commodity}</p>
              <p className="text-success text-sm">{topGainer.change} from yesterday</p>
              <p className="text-muted-foreground text-sm">Avg Price: {topGainer.price}</p>
            </CardContent>
          </Card>

          {/* Top Loser */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Top Loser (24h)</p>
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-2xl font-bold mt-2">{topLoser.commodity}</p>
              <p className="text-destructive text-sm">{topLoser.change} from yesterday</p>
              <p className="text-muted-foreground text-sm">Avg Price: {topLoser.price}</p>
            </CardContent>
          </Card>

          {/* High Demand */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">High Demand</p>
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold mt-2">{highDemand.commodity}</p>
              <p className="text-primary text-sm">{highDemand.info}</p>
              <p className="text-muted-foreground text-sm">Key Markets: {highDemand.markets}</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Prices Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">Market Prices</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger className="w-[140px]">
                    <span className="mr-2">⊘</span>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {commodities.map((commodity) => (
                      <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search market or crop..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-[200px]"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Commodity</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">State</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Market Center</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Min Price (₹)</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Max Price (₹)</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Modal Price (₹)</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrices.map((price) => (
                    <tr key={price.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 font-medium">{price.commodity}</td>
                      <td className="py-4 px-4 text-muted-foreground">{price.state}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-success"></span>
                          {price.mandi}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">{price.min.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right">{price.max.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-semibold text-primary">₹{price.modal.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center">{getTrendBadge(price.trend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Price Alerts */}
        <PriceAlertsList />
      </div>
    </AppLayout>
  );
}
