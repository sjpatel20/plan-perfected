import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export interface CropPrice {
  id: string;
  cropName: string;
  cropNameLocal: string;
  price: number;
  previousPrice: number;
  unit: string;
  mandi: string;
}

interface MarketPriceCardProps {
  prices: CropPrice[];
  className?: string;
}

function getPriceChange(current: number, previous: number) {
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change).toFixed(1),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
  };
}

export function MarketPriceCard({ prices, className }: MarketPriceCardProps) {
  const { t, language } = useLanguage();

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('marketPrices')}
          </CardTitle>
          <Link to="/market">
            <Button variant="ghost" size="sm" className="gap-1">
              {t('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {prices.slice(0, 5).map((crop) => {
          const change = getPriceChange(crop.price, crop.previousPrice);
          const TrendIcon =
            change.direction === 'up'
              ? TrendingUp
              : change.direction === 'down'
              ? TrendingDown
              : Minus;

          return (
            <div
              key={crop.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                  🌾
                </div>
                <div>
                  <p className="font-medium">
                    {language === 'en' ? crop.cropName : crop.cropNameLocal}
                  </p>
                  <p className="text-xs text-muted-foreground">{crop.mandi}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₹{crop.price.toLocaleString()}
                  <span className="text-xs text-muted-foreground font-normal">
                    /{crop.unit}
                  </span>
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs gap-1',
                    change.direction === 'up' && 'text-success border-success/30',
                    change.direction === 'down' && 'text-destructive border-destructive/30'
                  )}
                >
                  <TrendIcon className="h-3 w-3" />
                  {change.value}%
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
