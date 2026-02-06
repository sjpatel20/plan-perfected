-- KisanIQ Core Database Schema
-- Phase 1: Farmer profiles, plots, crops, soil data, advisories, market prices

-- 1. Farmer Profiles Table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mobile_number TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'te', 'ta', 'mr')),
  state TEXT,
  district TEXT,
  village TEXT,
  pincode TEXT,
  avatar_url TEXT,
  farmer_id TEXT, -- AgriStack Farmer ID if available
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Farm Plots Table
CREATE TABLE public.plots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plot_name TEXT NOT NULL,
  area_hectares DECIMAL(10, 4),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  soil_type TEXT,
  irrigation_type TEXT CHECK (irrigation_type IN ('rainfed', 'canal', 'borewell', 'drip', 'sprinkler', 'other')),
  ownership_type TEXT CHECK (ownership_type IN ('owned', 'leased', 'shared')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Soil Health Data Table (from Soil Health Card)
CREATE TABLE public.soil_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plot_id UUID NOT NULL REFERENCES public.plots(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  ph DECIMAL(4, 2),
  organic_carbon DECIMAL(5, 2),
  nitrogen DECIMAL(6, 2),
  phosphorus DECIMAL(6, 2),
  potassium DECIMAL(6, 2),
  sulphur DECIMAL(6, 2),
  zinc DECIMAL(6, 2),
  iron DECIMAL(6, 2),
  copper DECIMAL(6, 2),
  manganese DECIMAL(6, 2),
  boron DECIMAL(6, 2),
  ec DECIMAL(6, 2), -- Electrical Conductivity
  shc_card_number TEXT, -- Soil Health Card reference
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Crop Cycles Table
CREATE TABLE public.crop_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plot_id UUID NOT NULL REFERENCES public.plots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  crop_variety TEXT,
  season TEXT CHECK (season IN ('kharif', 'rabi', 'zaid', 'perennial')),
  sowing_date DATE NOT NULL,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  current_stage TEXT CHECK (current_stage IN ('sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'maturity', 'harvested')),
  health_status TEXT DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'monitor', 'diseased', 'pest_affected')),
  expected_yield_kg DECIMAL(10, 2),
  actual_yield_kg DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Crop Health Scans Table (for AI disease detection)
CREATE TABLE public.crop_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_cycle_id UUID REFERENCES public.crop_cycles(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  scan_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  diagnosis_result JSONB, -- AI diagnosis response
  disease_detected TEXT,
  confidence_score DECIMAL(5, 2),
  recommendations TEXT[],
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Market Prices Cache Table
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commodity TEXT NOT NULL,
  commodity_local JSONB, -- {"hi": "गेहूं", "te": "గోధుమ"}
  mandi_name TEXT NOT NULL,
  mandi_state TEXT NOT NULL,
  mandi_district TEXT,
  min_price DECIMAL(10, 2),
  max_price DECIMAL(10, 2),
  modal_price DECIMAL(10, 2),
  price_unit TEXT DEFAULT 'quintal',
  arrival_quantity DECIMAL(10, 2),
  price_date DATE NOT NULL,
  source TEXT DEFAULT 'agmarknet',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(commodity, mandi_name, price_date)
);

-- 7. Advisories Table
CREATE TABLE public.advisories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for general advisories
  category TEXT NOT NULL CHECK (category IN ('weather', 'pest', 'disease', 'irrigation', 'fertilizer', 'market', 'scheme', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  message_local JSONB, -- Translated messages
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical', 'success')),
  is_read BOOLEAN DEFAULT FALSE,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  target_crop TEXT,
  target_region TEXT,
  audio_url TEXT, -- For voice advisories
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Government Schemes Table
CREATE TABLE public.govt_schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_name TEXT NOT NULL,
  scheme_name_local JSONB,
  description TEXT NOT NULL,
  description_local JSONB,
  ministry TEXT,
  eligibility_criteria TEXT,
  benefits TEXT,
  application_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from DATE,
  valid_until DATE,
  target_states TEXT[],
  target_crops TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.govt_schemes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Plots
CREATE POLICY "Users can view their own plots" ON public.plots
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own plots" ON public.plots
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Soil Data
CREATE POLICY "Users can view soil data for their plots" ON public.soil_data
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.plots WHERE plots.id = soil_data.plot_id AND plots.user_id = auth.uid())
  );
CREATE POLICY "Users can manage soil data for their plots" ON public.soil_data
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.plots WHERE plots.id = soil_data.plot_id AND plots.user_id = auth.uid())
  );

-- RLS Policies for Crop Cycles
CREATE POLICY "Users can view their own crops" ON public.crop_cycles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own crops" ON public.crop_cycles
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Crop Scans
CREATE POLICY "Users can view their own scans" ON public.crop_scans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own scans" ON public.crop_scans
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Market Prices (public read)
CREATE POLICY "Anyone can view market prices" ON public.market_prices
  FOR SELECT USING (true);

-- RLS Policies for Advisories
CREATE POLICY "Users can view general advisories" ON public.advisories
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Users can update read status on their advisories" ON public.advisories
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for Government Schemes (public read)
CREATE POLICY "Anyone can view active schemes" ON public.govt_schemes
  FOR SELECT USING (is_active = true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_plots_updated_at
  BEFORE UPDATE ON public.plots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_crop_cycles_updated_at
  BEFORE UPDATE ON public.crop_cycles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_govt_schemes_updated_at
  BEFORE UPDATE ON public.govt_schemes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Farmer'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_plots_user_id ON public.plots(user_id);
CREATE INDEX idx_crop_cycles_user_id ON public.crop_cycles(user_id);
CREATE INDEX idx_crop_cycles_plot_id ON public.crop_cycles(plot_id);
CREATE INDEX idx_crop_scans_user_id ON public.crop_scans(user_id);
CREATE INDEX idx_market_prices_commodity ON public.market_prices(commodity);
CREATE INDEX idx_market_prices_date ON public.market_prices(price_date);
CREATE INDEX idx_advisories_user_id ON public.advisories(user_id);
CREATE INDEX idx_advisories_category ON public.advisories(category);