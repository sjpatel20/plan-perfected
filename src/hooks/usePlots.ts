import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables } from '@/integrations/supabase/types';

type Plot = Tables<'plots'>;
type CropCycle = Tables<'crop_cycles'>;

export interface PlotWithCrop extends Plot {
  currentCrop?: string;
}

export function usePlots() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: plots, isLoading, error } = useQuery({
    queryKey: ['plots', user?.id],
    queryFn: async (): Promise<PlotWithCrop[]> => {
      if (!user) return [];
      
      // Fetch plots
      const { data: plotsData, error: plotsError } = await supabase
        .from('plots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (plotsError) throw plotsError;
      if (!plotsData) return [];

      // Fetch current crops for each plot (most recent active crop cycle)
      const plotIds = plotsData.map(p => p.id);
      
      if (plotIds.length === 0) return plotsData;

      const { data: cropsData } = await supabase
        .from('crop_cycles')
        .select('plot_id, crop_name')
        .in('plot_id', plotIds)
        .is('actual_harvest_date', null) // Still active (not harvested)
        .order('sowing_date', { ascending: false });

      // Map crops to plots (take most recent for each plot)
      const cropMap = new Map<string, string>();
      cropsData?.forEach(crop => {
        if (!cropMap.has(crop.plot_id)) {
          cropMap.set(crop.plot_id, crop.crop_name);
        }
      });

      return plotsData.map(plot => ({
        ...plot,
        currentCrop: cropMap.get(plot.id),
      }));
    },
    enabled: !!user,
  });

  const createPlot = useMutation({
    mutationFn: async (plotData: {
      plot_name: string;
      area_hectares?: number;
      soil_type?: string;
      irrigation_type?: string;
      ownership_type?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('plots')
        .insert({
          ...plotData,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots', user?.id] });
    },
  });

  const updatePlot = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Plot> & { id: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('plots')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots', user?.id] });
    },
  });

  const deletePlot = useMutation({
    mutationFn: async (plotId: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('plots')
        .delete()
        .eq('id', plotId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots', user?.id] });
    },
  });

  const totalArea = plots?.reduce((sum, p) => sum + (p.area_hectares || 0), 0) || 0;
  const activeCropsCount = plots?.filter(p => p.currentCrop).length || 0;

  return {
    plots: plots || [],
    isLoading,
    error,
    createPlot,
    updatePlot,
    deletePlot,
    totalArea,
    activeCropsCount,
  };
}
