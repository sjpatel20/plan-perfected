import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function mapWeatherCondition(main: string): 'sunny' | 'cloudy' | 'rainy' | 'stormy' {
  const mainLower = main.toLowerCase();
  if (mainLower.includes('thunder') || mainLower.includes('storm')) {
    return 'stormy';
  }
  if (mainLower.includes('rain') || mainLower.includes('drizzle') || mainLower.includes('shower')) {
    return 'rainy';
  }
  if (mainLower.includes('cloud') || mainLower.includes('overcast') || mainLower.includes('mist') || mainLower.includes('fog') || mainLower.includes('haze')) {
    return 'cloudy';
  }
  return 'sunny';
}

function formatHour(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12} ${ampm}`;
}

function formatDay(timestamp: number): { day: string; date: string } {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    day: isToday ? 'Today' : days[date.getDay()],
    date: `${months[date.getMonth()]} ${date.getDate()}`
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const OPENWEATHERMAP_API_KEY = Deno.env.get('OPENWEATHERMAP_API_KEY');
    if (!OPENWEATHERMAP_API_KEY) {
      console.error('OPENWEATHERMAP_API_KEY is not configured');
      throw new Error('Weather API key not configured');
    }

    // Get coordinates from request body or use default (Indore, MP)
    const { lat = 22.7196, lon = 75.8577, locationName = 'Indore, Madhya Pradesh' } = await req.json().catch(() => ({}));
    
    console.log(`Fetching weather for: ${locationName} (${lat}, ${lon})`);

    // Use free tier API endpoints (2.5)
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
    
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);
    
    if (!currentRes.ok) {
      const errorText = await currentRes.text();
      console.error(`Current weather API error [${currentRes.status}]: ${errorText}`);
      throw new Error(`Weather API error: ${currentRes.status} - Please verify your API key is active. New keys may take up to 2 hours to activate.`);
    }
    
    if (!forecastRes.ok) {
      const errorText = await forecastRes.text();
      console.error(`Forecast API error [${forecastRes.status}]: ${errorText}`);
      throw new Error(`Forecast API error: ${forecastRes.status}`);
    }
    
    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();
    
    console.log('Current weather fetched:', currentData.weather?.[0]?.main);
    
    // Transform forecast data for hourly (next 8 entries = 24 hours at 3h intervals)
    const hourlyData = forecastData.list.slice(0, 8).map((item: any) => ({
      time: formatHour(item.dt),
      temp: Math.round(item.main.temp),
      condition: mapWeatherCondition(item.weather[0].main),
      rainChance: Math.round((item.pop || 0) * 100)
    }));
    
    // Group forecast by day for weekly data (5-day forecast)
    const dailyMap = new Map<string, any>();
    forecastData.list.forEach((item: any) => {
      const dateKey = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          dt: item.dt,
          temps: [item.main.temp],
          humidity: item.main.humidity,
          pop: item.pop || 0,
          weather: item.weather[0].main,
          rain: item.rain?.['3h'] || 0
        });
      } else {
        const existing = dailyMap.get(dateKey);
        existing.temps.push(item.main.temp);
        existing.pop = Math.max(existing.pop, item.pop || 0);
        existing.rain += item.rain?.['3h'] || 0;
      }
    });
    
    // Add today if not in forecast
    const todayKey = new Date().toDateString();
    if (!dailyMap.has(todayKey)) {
      dailyMap.set(todayKey, {
        dt: Math.floor(Date.now() / 1000),
        temps: [currentData.main.temp],
        humidity: currentData.main.humidity,
        pop: 0,
        weather: currentData.weather[0].main,
        rain: currentData.rain?.['1h'] || 0
      });
    }
    
    // Sort by date and take first 7 days
    const sortedDays = Array.from(dailyMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(0, 7);
    
    const weeklyData = sortedDays.map(([_, day]) => {
      const { day: dayName, date } = formatDay(day.dt);
      return {
        day: dayName,
        date,
        condition: mapWeatherCondition(day.weather),
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
        rainChance: Math.round(day.pop * 100),
        humidity: day.humidity,
        rainfall: Math.round(day.rain)
      };
    });
    
    const result = {
      location: locationName,
      current: {
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // m/s to km/h
        condition: mapWeatherCondition(currentData.weather[0].main),
        description: currentData.weather[0].description,
        rainfall: currentData.rain?.['1h'] || 0
      },
      hourly: hourlyData,
      weekly: weeklyData,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Weather data prepared successfully');
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Weather fetch error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch weather data' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
