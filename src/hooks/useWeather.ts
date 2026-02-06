import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy';

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  condition: WeatherCondition;
  description: string;
  rainfall: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: WeatherCondition;
  rainChance: number;
}

export interface DailyForecast {
  day: string;
  date: string;
  condition: WeatherCondition;
  high: number;
  low: number;
  rainChance: number;
  humidity: number;
  rainfall?: number;
}

export interface WeatherData {
  location: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  weekly: DailyForecast[];
  lastUpdated: string;
}

interface UseWeatherResult {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWeather(
  lat: number = 22.7196,
  lon: number = 75.8577,
  locationName: string = 'Indore, Madhya Pradesh'
): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-weather', {
        body: { lat, lon, locationName }
      });

      if (fnError) {
        console.error('Weather function error:', fnError);
        throw new Error(fnError.message || 'Failed to fetch weather');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setWeather(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('Weather fetch error:', err);
      setError(message);
      toast({
        title: 'Weather Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [lat, lon, locationName]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather, isLoading, error, refetch: fetchWeather };
}
