import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PriceAlert {
  id: string;
  user_id: string;
  commodity: string;
  mandi_name: string | null;
  mandi_state: string | null;
  threshold_percentage: number;
  alert_type: 'increase' | 'decrease' | 'both';
  last_known_price: number | null;
  last_checked_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceNotification {
  id: string;
  user_id: string;
  alert_id: string;
  commodity: string;
  mandi_name: string | null;
  old_price: number;
  new_price: number;
  change_percentage: number;
  change_type: 'increase' | 'decrease';
  is_read: boolean;
  created_at: string;
}

export interface CreateAlertInput {
  commodity: string;
  mandi_name?: string;
  mandi_state?: string;
  threshold_percentage: number;
  alert_type: 'increase' | 'decrease' | 'both';
}

export function usePriceAlerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's price alerts
  const {
    data: alerts = [],
    isLoading: isLoadingAlerts,
    error: alertsError,
  } = useQuery({
    queryKey: ['price-alerts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PriceAlert[];
    },
  });

  // Fetch user's notifications
  const {
    data: notifications = [],
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ['price-notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('price_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as PriceNotification[];
    },
  });

  // Create new alert
  const createAlert = useMutation({
    mutationFn: async (input: CreateAlertInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user.id,
          commodity: input.commodity,
          mandi_name: input.mandi_name || null,
          mandi_state: input.mandi_state || null,
          threshold_percentage: input.threshold_percentage,
          alert_type: input.alert_type,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      toast({
        title: 'Alert created',
        description: 'You will be notified when prices change significantly.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create alert',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Toggle alert active status
  const toggleAlert = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
    },
  });

  // Delete alert
  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      toast({
        title: 'Alert deleted',
        description: 'Price alert has been removed.',
      });
    },
  });

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('price_notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-notifications'] });
    },
  });

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('price_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-notifications'] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    alerts,
    notifications,
    unreadCount,
    isLoadingAlerts,
    isLoadingNotifications,
    alertsError,
    createAlert,
    toggleAlert,
    deleteAlert,
    markAsRead,
    markAllAsRead,
    refetchNotifications,
  };
}
