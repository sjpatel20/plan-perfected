import { Leaf } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PlotsList } from '@/components/profile/PlotsList';
import { usePlots } from '@/hooks/usePlots';
import { Card, CardContent } from '@/components/ui/card';

export default function Plots() {
  const { plots, totalArea, activeCropsCount, isLoading } = usePlots();

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Leaf className="h-8 w-8 text-success" />
              My Plots
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your farm plots and track crop cycles
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">🗺️</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? '...' : plots.length}</p>
                  <p className="text-sm text-muted-foreground">Total Plots</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-2xl">📐</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? '...' : totalArea.toFixed(1)} ha</p>
                  <p className="text-sm text-muted-foreground">Total Area</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                  <span className="text-2xl">🌾</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? '...' : activeCropsCount}</p>
                  <p className="text-sm text-muted-foreground">Active Crops</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plots List */}
        <PlotsList />
      </div>
    </AppLayout>
  );
}
