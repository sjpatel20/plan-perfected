-- Create price_alerts table for user alert preferences
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  commodity TEXT NOT NULL,
  mandi_name TEXT,
  mandi_state TEXT,
  threshold_percentage NUMERIC NOT NULL DEFAULT 5,
  alert_type TEXT NOT NULL DEFAULT 'both' CHECK (alert_type IN ('increase', 'decrease', 'both')),
  last_known_price NUMERIC,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create price_notifications table for triggered alerts
CREATE TABLE public.price_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_id UUID NOT NULL REFERENCES public.price_alerts(id) ON DELETE CASCADE,
  commodity TEXT NOT NULL,
  mandi_name TEXT,
  old_price NUMERIC NOT NULL,
  new_price NUMERIC NOT NULL,
  change_percentage NUMERIC NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('increase', 'decrease')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for price_alerts
CREATE POLICY "Users can view their own alerts"
  ON public.price_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts"
  ON public.price_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.price_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON public.price_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for price_notifications
CREATE POLICY "Users can view their own notifications"
  ON public.price_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.price_notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_price_alerts_updated_at
  BEFORE UPDATE ON public.price_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();