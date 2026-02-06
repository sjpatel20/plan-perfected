import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type WeatherCondition = "sunny" | "cloudy" | "rainy" | "stormy";

function mapWeatherCondition(main: string): WeatherCondition {
  const mainLower = main.toLowerCase();
  if (mainLower.includes("thunder") || mainLower.includes("storm")) return "stormy";
  if (
    mainLower.includes("rain") ||
    mainLower.includes("drizzle") ||
    mainLower.includes("shower")
  )
    return "rainy";
  if (
    mainLower.includes("cloud") ||
    mainLower.includes("overcast") ||
    mainLower.includes("mist") ||
    mainLower.includes("fog") ||
    mainLower.includes("haze")
  )
    return "cloudy";
  return "sunny";
}

function formatHour(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12} ${ampm}`;
}

function formatDay(timestamp: number): { day: string; date: string } {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return {
    day: isToday ? "Today" : days[date.getDay()],
    date: `${months[date.getMonth()]} ${date.getDate()}`,
  };
}

function getMockWeather(locationName: string) {
  const now = Math.floor(Date.now() / 1000);
  const hourly = [
    { offsetH: 0, temp: 24, condition: "sunny" as const, rainChance: 0 },
    { offsetH: 3, temp: 28, condition: "sunny" as const, rainChance: 5 },
    { offsetH: 6, temp: 32, condition: "sunny" as const, rainChance: 10 },
    { offsetH: 9, temp: 34, condition: "cloudy" as const, rainChance: 25 },
    { offsetH: 12, temp: 30, condition: "cloudy" as const, rainChance: 35 },
    { offsetH: 15, temp: 27, condition: "rainy" as const, rainChance: 60 },
  ].map((h) => ({
    time: formatHour(now + h.offsetH * 3600),
    temp: h.temp,
    condition: h.condition,
    rainChance: h.rainChance,
  }));

  const weekly = [
    { d: 0, condition: "sunny" as const, high: 34, low: 24, rainChance: 10, humidity: 65 },
    { d: 1, condition: "cloudy" as const, high: 32, low: 23, rainChance: 30, humidity: 70 },
    { d: 2, condition: "rainy" as const, high: 28, low: 22, rainChance: 80, humidity: 85 },
    { d: 3, condition: "rainy" as const, high: 27, low: 21, rainChance: 75, humidity: 82 },
    { d: 4, condition: "cloudy" as const, high: 29, low: 22, rainChance: 40, humidity: 72 },
    { d: 5, condition: "sunny" as const, high: 31, low: 23, rainChance: 15, humidity: 65 },
    { d: 6, condition: "sunny" as const, high: 33, low: 24, rainChance: 5, humidity: 60 },
  ].map((d) => {
    const ts = now + d.d * 86400;
    const label = formatDay(ts);
    return {
      day: label.day,
      date: label.date,
      condition: d.condition,
      high: d.high,
      low: d.low,
      rainChance: d.rainChance,
      humidity: d.humidity,
      rainfall: d.rainChance >= 60 ? 12 : 0,
    };
  });

  return {
    location: locationName,
    current: {
      temp: 32,
      feelsLike: 35,
      humidity: 65,
      pressure: 1015,
      windSpeed: 15,
      condition: "sunny" as const,
      description: "mock data (API key not active)",
      rainfall: 12,
    },
    hourly,
    weekly,
    lastUpdated: new Date().toISOString(),
    meta: {
      isMock: true,
      warning:
        "OpenWeatherMap returned 401 (invalid key or not activated yet). Showing mock weather until the key becomes active.",
    },
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const OPENWEATHERMAP_API_KEY = Deno.env.get("OPENWEATHERMAP_API_KEY");
    if (!OPENWEATHERMAP_API_KEY) {
      console.error("OPENWEATHERMAP_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Weather API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { lat = 22.7196, lon = 75.8577, locationName = "Indore, Madhya Pradesh" } =
      await req.json().catch(() => ({}));

    console.log(`Fetching weather for: ${locationName} (${lat}, ${lon})`);

    const currentUrl =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    // Key not active / invalid: keep the app working by returning mock payload
    if (currentRes.status === 401 || forecastRes.status === 401) {
      const currentBody = await currentRes.text();
      const forecastBody = await forecastRes.text();
      console.error(
        `OpenWeatherMap 401. current=${currentBody} forecast=${forecastBody}`,
      );

      const mock = getMockWeather(locationName);
      return new Response(JSON.stringify(mock), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!currentRes.ok) {
      const errorText = await currentRes.text();
      console.error(
        `Current weather API error [${currentRes.status}]: ${errorText}`,
      );
      throw new Error(`Weather API error: ${currentRes.status}`);
    }

    if (!forecastRes.ok) {
      const errorText = await forecastRes.text();
      console.error(`Forecast API error [${forecastRes.status}]: ${errorText}`);
      throw new Error(`Forecast API error: ${forecastRes.status}`);
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    // Hourly: next 8 entries (~24h at 3h interval)
    const hourlyData = forecastData.list.slice(0, 8).map((item: any) => ({
      time: formatHour(item.dt),
      temp: Math.round(item.main.temp),
      condition: mapWeatherCondition(item.weather[0].main),
      rainChance: Math.round((item.pop || 0) * 100),
    }));

    // Daily (5 days from /forecast): group by date
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
          rain: item.rain?.["3h"] || 0,
        });
      } else {
        const existing = dailyMap.get(dateKey);
        existing.temps.push(item.main.temp);
        existing.pop = Math.max(existing.pop, item.pop || 0);
        existing.rain += item.rain?.["3h"] || 0;
      }
    });

    // ensure today exists
    const todayKey = new Date().toDateString();
    if (!dailyMap.has(todayKey)) {
      dailyMap.set(todayKey, {
        dt: Math.floor(Date.now() / 1000),
        temps: [currentData.main.temp],
        humidity: currentData.main.humidity,
        pop: 0,
        weather: currentData.weather[0].main,
        rain: currentData.rain?.["1h"] || 0,
      });
    }

    const sortedDays = Array.from(dailyMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(0, 7);

    const weeklyData = sortedDays.map(([_, day]) => {
      const label = formatDay(day.dt);
      return {
        day: label.day,
        date: label.date,
        condition: mapWeatherCondition(day.weather),
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
        rainChance: Math.round(day.pop * 100),
        humidity: day.humidity,
        rainfall: Math.round(day.rain),
      };
    });

    const result = {
      location: locationName,
      current: {
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        windSpeed: Math.round(currentData.wind.speed * 3.6),
        condition: mapWeatherCondition(currentData.weather[0].main),
        description: currentData.weather[0].description,
        rainfall: currentData.rain?.["1h"] || 0,
      },
      hourly: hourlyData,
      weekly: weeklyData,
      lastUpdated: new Date().toISOString(),
      meta: { isMock: false },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weather fetch error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to fetch weather data",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
