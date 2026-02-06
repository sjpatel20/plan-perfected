import { Bell, BellOff, Trash2, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { cn } from '@/lib/utils';

export function PriceAlertsList() {
  const { alerts, isLoadingAlerts, toggleAlert, deleteAlert } = usePriceAlerts();

  if (isLoadingAlerts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Your Price Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Your Price Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No price alerts yet</p>
            <p className="text-sm">Create an alert to get notified when prices change</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Your Price Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'p-4 rounded-lg border transition-colors',
              alert.is_active ? 'bg-card' : 'bg-muted/50 opacity-60'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{alert.commodity}</p>
                  <Badge variant="outline" className="shrink-0">
                    {alert.alert_type === 'both' && <ArrowUpDown className="h-3 w-3 mr-1" />}
                    {alert.alert_type === 'increase' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {alert.alert_type === 'decrease' && <TrendingDown className="h-3 w-3 mr-1" />}
                    ±{alert.threshold_percentage}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {alert.mandi_name ? `${alert.mandi_name}, ` : ''}
                  {alert.mandi_state || 'All India'}
                </p>
                {alert.last_known_price && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last price: ₹{alert.last_known_price.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={alert.is_active}
                  onCheckedChange={(checked) =>
                    toggleAlert.mutate({ id: alert.id, is_active: checked })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteAlert.mutate(alert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
