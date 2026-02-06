import { Link } from 'react-router-dom';
import { Leaf, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlots } from '@/hooks/usePlots';
import { Skeleton } from '@/components/ui/skeleton';

const IRRIGATION_LABELS: Record<string, string> = {
  borewell: 'Borewell',
  canal: 'Canal',
  drip: 'Drip',
  sprinkler: 'Sprinkler',
  rainfed: 'Rainfed',
  other: 'Other',
};

export function PlotsSummaryCard() {
  const { plots, isLoading, totalArea, activeCropsCount } = usePlots();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Leaf className="h-5 w-5 text-success" />
            My Plots
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/plots">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {plots.length === 0 ? (
          <div className="text-center py-6">
            <Leaf className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-3">No plots added yet</p>
            <Button size="sm" asChild>
              <Link to="/plots">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Plot
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{plots.length}</p>
                <p className="text-xs text-muted-foreground">Total Plots</p>
              </div>
              <div className="text-center border-x">
                <p className="text-2xl font-bold text-success">{totalArea.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Hectares</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{activeCropsCount}</p>
                <p className="text-xs text-muted-foreground">Active Crops</p>
              </div>
            </div>

            {/* Plot list (show first 3) */}
            <div className="space-y-2">
              {plots.slice(0, 3).map((plot) => (
                <div
                  key={plot.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <span className="text-lg">🌾</span>
                    </div>
                    <div>
                      <p className="font-medium">{plot.plot_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {plot.area_hectares ? `${plot.area_hectares} ha` : 'Area not set'} 
                        {plot.irrigation_type && ` • ${IRRIGATION_LABELS[plot.irrigation_type] || plot.irrigation_type}`}
                      </p>
                    </div>
                  </div>
                  {plot.currentCrop ? (
                    <Badge variant="outline" className="bg-success/10">
                      {plot.currentCrop}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      No crop
                    </Badge>
                  )}
                </div>
              ))}

              {plots.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/plots">
                    +{plots.length - 3} more plots
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
