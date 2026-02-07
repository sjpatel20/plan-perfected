import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Input validation schema
const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system", "tool"]),
  content: z.string().max(50000),
  tool_call_id: z.string().optional(),
  tool_calls: z.array(z.any()).optional(),
});

const ChatSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  conversationId: z.string().uuid().optional(),
});

const SYSTEM_PROMPT = `You are Kisan Mitra's Expert Agricultural Advisor (AIkosh) - an AI agent with access to real tools to help Indian farmers.

You have access to these tools to provide accurate, real-time information:

1. **get_weather** - Get current weather and forecast for any location
2. **get_market_prices** - Look up current mandi prices for crops
3. **search_schemes** - Find government agricultural schemes
4. **analyze_crop_advice** - Provide crop-specific guidance based on conditions

**Guidelines:**
- Use tools proactively when relevant - don't just give generic advice
- If a farmer asks about weather, ALWAYS use the weather tool
- If they mention selling crops or prices, use the market prices tool
- If they ask about subsidies or government help, search schemes
- For crop questions, provide tailored advice using analyze_crop_advice
- Consider local seasons (Kharif, Rabi, Zaid) and regional variations
- Use simple language appropriate for farmers
- When discussing pesticides/chemicals, always mention safety precautions
- If unsure, recommend consulting local Krishi Vigyan Kendra (KVK)
- Be empathetic to farmers' challenges

Always respond in the same language the farmer uses (Hindi, English, or regional languages).`;

// Tool definitions for the AI
const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather conditions and 7-day forecast for a location in India. Use this when farmers ask about weather, rainfall, temperature, or need planning advice.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Location name (city, district, or state in India). Example: 'Indore, Madhya Pradesh'"
          },
          lat: {
            type: "number",
            description: "Latitude of the location (optional, will geocode if not provided)"
          },
          lon: {
            type: "number",
            description: "Longitude of the location (optional, will geocode if not provided)"
          }
        },
        required: ["location"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_market_prices",
      description: "Get current mandi (market) prices for agricultural commodities. Use when farmers ask about selling crops, price trends, or which mandi to go to.",
      parameters: {
        type: "object",
        properties: {
          commodity: {
            type: "string",
            description: "Name of the crop/commodity. Examples: Wheat, Rice, Soybean, Cotton, Onion, Tomato"
          },
          state: {
            type: "string",
            description: "State name to filter mandis. Example: 'Madhya Pradesh'"
          },
          mandi: {
            type: "string",
            description: "Specific mandi name (optional)"
          }
        },
        required: ["commodity"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_schemes",
      description: "Search for government agricultural schemes, subsidies, and programs. Use when farmers ask about financial help, loans, insurance, or government benefits.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query - what type of scheme they're looking for. Examples: 'crop insurance', 'PM-KISAN', 'irrigation subsidy', 'tractor loan'"
          },
          state: {
            type: "string",
            description: "State to filter state-specific schemes (optional)"
          },
          crop: {
            type: "string",
            description: "Crop name to find crop-specific schemes (optional)"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "analyze_crop_advice",
      description: "Get tailored crop management advice. Use when farmers ask about sowing, irrigation, fertilizers, pest control, or general crop guidance.",
      parameters: {
        type: "object",
        properties: {
          crop: {
            type: "string",
            description: "Name of the crop. Examples: Wheat, Rice, Cotton, Soybean"
          },
          stage: {
            type: "string",
            description: "Current growth stage: 'sowing', 'vegetative', 'flowering', 'maturity', 'harvest'"
          },
          issue: {
            type: "string",
            description: "Specific issue or question (optional). Example: 'yellow leaves', 'pest attack', 'irrigation timing'"
          },
          location: {
            type: "string",
            description: "Location for climate-specific advice (optional)"
          }
        },
        required: ["crop"]
      }
    }
  }
];

// Geocoding helper for Indian locations
async function geocodeLocation(location: string): Promise<{ lat: number; lon: number } | null> {
  // Default coordinates for major Indian agricultural regions
  const knownLocations: Record<string, { lat: number; lon: number }> = {
    "delhi": { lat: 28.6139, lon: 77.2090 },
    "mumbai": { lat: 19.0760, lon: 72.8777 },
    "indore": { lat: 22.7196, lon: 75.8577 },
    "bhopal": { lat: 23.2599, lon: 77.4126 },
    "nagpur": { lat: 21.1458, lon: 79.0882 },
    "pune": { lat: 18.5204, lon: 73.8567 },
    "jaipur": { lat: 26.9124, lon: 75.7873 },
    "lucknow": { lat: 26.8467, lon: 80.9462 },
    "chandigarh": { lat: 30.7333, lon: 76.7794 },
    "hyderabad": { lat: 17.3850, lon: 78.4867 },
    "chennai": { lat: 13.0827, lon: 80.2707 },
    "kolkata": { lat: 22.5726, lon: 88.3639 },
    "bangalore": { lat: 12.9716, lon: 77.5946 },
    "ahmedabad": { lat: 23.0225, lon: 72.5714 },
    "madhya pradesh": { lat: 22.9734, lon: 78.6569 },
    "maharashtra": { lat: 19.7515, lon: 75.7139 },
    "uttar pradesh": { lat: 26.8467, lon: 80.9462 },
    "rajasthan": { lat: 27.0238, lon: 74.2179 },
    "punjab": { lat: 31.1471, lon: 75.3412 },
    "haryana": { lat: 29.0588, lon: 76.0856 },
    "gujarat": { lat: 22.2587, lon: 71.1924 },
    "karnataka": { lat: 15.3173, lon: 75.7139 },
    "tamil nadu": { lat: 11.1271, lon: 78.6569 },
    "andhra pradesh": { lat: 15.9129, lon: 79.7400 },
    "telangana": { lat: 18.1124, lon: 79.0193 },
    "bihar": { lat: 25.0961, lon: 85.3131 },
    "west bengal": { lat: 22.9868, lon: 87.8550 },
  };

  const locationLower = location.toLowerCase();
  for (const [key, coords] of Object.entries(knownLocations)) {
    if (locationLower.includes(key)) {
      return coords;
    }
  }

  // Default to central India
  return { lat: 22.7196, lon: 75.8577 };
}

// Tool execution functions
async function executeGetWeather(args: { location: string; lat?: number; lon?: number }): Promise<string> {
  try {
    let lat = args.lat;
    let lon = args.lon;

    if (!lat || !lon) {
      const coords = await geocodeLocation(args.location);
      if (coords) {
        lat = coords.lat;
        lon = coords.lon;
      } else {
        lat = 22.7196;
        lon = 75.8577;
      }
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-weather`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({ lat, lon, locationName: args.location }),
    });

    if (!response.ok) {
      return JSON.stringify({ error: "Failed to fetch weather data" });
    }

    const data = await response.json();
    return JSON.stringify({
      location: data.location,
      current: {
        temperature: `${data.current.temp}°C`,
        feels_like: `${data.current.feelsLike}°C`,
        humidity: `${data.current.humidity}%`,
        condition: data.current.condition,
        description: data.current.description,
        wind_speed: `${data.current.windSpeed} km/h`,
      },
      forecast: data.weekly?.slice(0, 5).map((day: any) => ({
        day: day.day,
        date: day.date,
        high: `${day.high}°C`,
        low: `${day.low}°C`,
        condition: day.condition,
        rain_chance: `${day.rainChance}%`,
      })),
      farming_advisory: data.current.temp > 35 
        ? "⚠️ High temperature alert - avoid mid-day field work, ensure adequate irrigation"
        : data.current.temp < 10
        ? "⚠️ Cold weather - protect young crops from frost"
        : "Weather conditions are suitable for regular farm activities"
    });
  } catch (error) {
    console.error("Weather tool error:", error);
    return JSON.stringify({ error: "Unable to fetch weather information" });
  }
}

async function executeGetMarketPrices(args: { commodity: string; state?: string; mandi?: string }): Promise<string> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from("market_prices")
      .select("*")
      .ilike("commodity", `%${args.commodity}%`)
      .order("price_date", { ascending: false })
      .limit(10);

    if (args.state) {
      query = query.ilike("mandi_state", `%${args.state}%`);
    }
    if (args.mandi) {
      query = query.ilike("mandi_name", `%${args.mandi}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Market prices query error:", error);
      return JSON.stringify({ error: "Unable to fetch market prices" });
    }

    if (!data || data.length === 0) {
      return JSON.stringify({
        message: `No recent price data found for ${args.commodity}${args.state ? ` in ${args.state}` : ""}. You may want to check local mandi directly or try nearby states.`,
        suggestion: "Try searching for common crops like Wheat, Rice, Soybean, Cotton, or Onion"
      });
    }

    const prices = data.map((p: any) => ({
      mandi: p.mandi_name,
      state: p.mandi_state,
      district: p.mandi_district,
      modal_price: `₹${p.modal_price}/${p.price_unit || "quintal"}`,
      min_price: p.min_price ? `₹${p.min_price}` : null,
      max_price: p.max_price ? `₹${p.max_price}` : null,
      date: p.price_date,
    }));

    const avgPrice = data.reduce((sum: number, p: any) => sum + (p.modal_price || 0), 0) / data.length;

    return JSON.stringify({
      commodity: args.commodity,
      prices: prices,
      summary: {
        average_modal_price: `₹${Math.round(avgPrice)}/quintal`,
        mandis_checked: data.length,
        date_range: `${data[data.length - 1].price_date} to ${data[0].price_date}`,
      },
      tip: "Compare prices across multiple mandis before selling. Transportation cost should also be considered."
    });
  } catch (error) {
    console.error("Market prices tool error:", error);
    return JSON.stringify({ error: "Unable to fetch market prices" });
  }
}

async function executeSearchSchemes(args: { query: string; state?: string; crop?: string }): Promise<string> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from("govt_schemes")
      .select("*")
      .eq("is_active", true)
      .or(`scheme_name.ilike.%${args.query}%,description.ilike.%${args.query}%,benefits.ilike.%${args.query}%`)
      .limit(5);

    const { data, error } = await query;

    if (error) {
      console.error("Schemes query error:", error);
      return JSON.stringify({ error: "Unable to search schemes" });
    }

    if (!data || data.length === 0) {
      // Return common schemes as fallback
      return JSON.stringify({
        message: `No specific schemes found for "${args.query}". Here are major schemes available to farmers:`,
        common_schemes: [
          {
            name: "PM-KISAN",
            description: "Direct income support of ₹6,000 per year to eligible farmer families",
            how_to_apply: "Apply through local agriculture office or online at pmkisan.gov.in"
          },
          {
            name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            description: "Crop insurance scheme covering natural calamities, pests, and diseases",
            how_to_apply: "Apply through banks or online before sowing season"
          },
          {
            name: "Kisan Credit Card (KCC)",
            description: "Easy credit for farmers at subsidized interest rates",
            how_to_apply: "Apply at any bank branch with land documents"
          }
        ],
        suggestion: "Visit your local Krishi Vigyan Kendra (KVK) or agriculture office for state-specific schemes"
      });
    }

    const schemes = data.map((s: any) => ({
      name: s.scheme_name,
      ministry: s.ministry,
      description: s.description,
      benefits: s.benefits,
      eligibility: s.eligibility_criteria,
      how_to_apply: s.application_url ? `Apply at: ${s.application_url}` : "Contact local agriculture office",
      valid_until: s.valid_until,
    }));

    return JSON.stringify({
      query: args.query,
      schemes_found: schemes.length,
      schemes: schemes,
      tip: "Carry Aadhaar card, land records, and bank passbook when applying for any scheme"
    });
  } catch (error) {
    console.error("Schemes tool error:", error);
    return JSON.stringify({ error: "Unable to search schemes" });
  }
}

async function executeAnalyzeCropAdvice(args: { crop: string; stage?: string; issue?: string; location?: string }): Promise<string> {
  // Comprehensive crop knowledge base
  const cropAdvice: Record<string, any> = {
    wheat: {
      sowing: "Best sowing time: October-November (Rabi). Use certified seeds like HD-2967, PBW-343. Seed rate: 100-125 kg/hectare. Apply basal fertilizer (NPK 120:60:40).",
      vegetative: "First irrigation 20-25 days after sowing. Apply urea top dressing. Monitor for aphids and armyworm.",
      flowering: "Critical irrigation stage. Avoid water stress. Watch for rust diseases.",
      maturity: "Reduce irrigation 15 days before harvest. Check grain hardness for harvest timing.",
      common_issues: {
        "yellow leaves": "Could be nitrogen deficiency or root rot. Apply urea if deficiency. For root rot, improve drainage.",
        "rust": "Apply Propiconazole 25% EC @ 0.1% spray. Remove infected plants.",
        "aphids": "Spray Imidacloprid 17.8 SL @ 0.3ml/L or use neem oil"
      }
    },
    rice: {
      sowing: "Nursery in May-June for Kharif. Transplant 25-30 day old seedlings. Spacing 20x15 cm.",
      vegetative: "Maintain 5cm water depth. Apply nitrogen in 3 splits. Watch for stem borer.",
      flowering: "Critical water stage. Apply potash. Monitor for brown spot.",
      maturity: "Drain field 10-15 days before harvest. Harvest when 80% grains are golden.",
      common_issues: {
        "brown spot": "Spray Mancozeb 75WP @ 2.5g/L. Ensure balanced fertilization.",
        "stem borer": "Apply Cartap hydrochloride 4G @ 25kg/ha in standing water",
        "bph": "Avoid excess nitrogen. Spray Buprofezin 25SC @ 1.6ml/L"
      }
    },
    cotton: {
      sowing: "April-May for Kharif. Use Bt cotton for bollworm resistance. Spacing 90x60 cm.",
      vegetative: "Thin to one plant per spot. Apply nitrogen at 30-45 days. Monitor for sucking pests.",
      flowering: "Peak water requirement. Watch for bollworm, whitefly. Square formation critical.",
      maturity: "3-4 pickings needed. Pick only fully opened bolls. Grade cotton properly.",
      common_issues: {
        "whitefly": "Spray Spiromesifen 240 SC @ 0.75ml/L. Use yellow sticky traps.",
        "pink bollworm": "Install pheromone traps. Spray Emamectin benzoate if severe.",
        "leaf curl": "Control whitefly vector. Remove infected plants."
      }
    },
    soybean: {
      sowing: "June-July with onset of monsoon. Seed treatment with Rhizobium essential. Seed rate 75-80 kg/ha.",
      vegetative: "One hoeing at 30 days. Apply urea if needed. Monitor for Spodoptera.",
      flowering: "No irrigation if good rainfall. Critical pest monitoring period.",
      maturity: "Harvest when leaves yellow and pods rattle. Avoid over-drying.",
      common_issues: {
        "pod borer": "Spray Chlorantraniliprole 18.5 SC @ 0.3ml/L",
        "yellow mosaic": "Control whitefly. Use resistant varieties.",
        "rust": "Spray Hexaconazole 5EC @ 1ml/L at first sign"
      }
    }
  };

  const cropLower = args.crop.toLowerCase();
  const advice = cropAdvice[cropLower];

  if (!advice) {
    return JSON.stringify({
      crop: args.crop,
      message: `Specific database entry not available for ${args.crop}. Here is general advice:`,
      general_tips: [
        "Use certified seeds from authorized dealers",
        "Get soil tested before applying fertilizers",
        "Follow integrated pest management (IPM) practices",
        "Maintain field hygiene by removing crop residues",
        "Consult local KVK for region-specific recommendations"
      ],
      contact: "Visit your nearest Krishi Vigyan Kendra (KVK) for personalized guidance"
    });
  }

  const response: any = {
    crop: args.crop,
    current_stage_advice: args.stage ? advice[args.stage] || "Stage not recognized. Provide: sowing, vegetative, flowering, or maturity." : null,
  };

  if (args.issue) {
    const issueLower = args.issue.toLowerCase();
    let foundSolution = null;
    for (const [problem, solution] of Object.entries(advice.common_issues || {})) {
      if (issueLower.includes(problem) || problem.includes(issueLower)) {
        foundSolution = { problem, solution };
        break;
      }
    }
    response.issue_advice = foundSolution || {
      message: `Specific solution for "${args.issue}" not in database.`,
      recommendation: "Take photos and consult local agriculture officer or use crop health scanner in the app."
    };
  }

  if (!args.stage && !args.issue) {
    response.stage_wise_guide = {
      sowing: advice.sowing,
      vegetative: advice.vegetative,
      flowering: advice.flowering,
      maturity: advice.maturity,
    };
  }

  response.safety_reminder = "Always wear protective equipment when handling pesticides. Follow recommended dosage. Dispose of empty containers safely.";

  return JSON.stringify(response);
}

// Main tool executor
async function executeTool(name: string, args: any): Promise<string> {
  console.log(`Executing tool: ${name} with args:`, JSON.stringify(args));

  switch (name) {
    case "get_weather":
      return executeGetWeather(args);
    case "get_market_prices":
      return executeGetMarketPrices(args);
    case "search_schemes":
      return executeSearchSchemes(args);
    case "analyze_crop_advice":
      return executeAnalyzeCropAdvice(args);
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse and validate input
    let validatedInput;
    try {
      const rawBody = await req.json();
      validatedInput = ChatSchema.parse(rawBody);
    } catch (validationError) {
      console.error("Input validation failed:", validationError);
      return new Response(JSON.stringify({ error: "Invalid input format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = validatedInput;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing agentic chat with ${messages.length} messages`);

    // Prepare messages for AI
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role,
        content: m.content,
        ...(m.tool_call_id && { tool_call_id: m.tool_call_id }),
        ...(m.tool_calls && { tool_calls: m.tool_calls }),
      })),
    ];

    // First call - may result in tool calls
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        tools: TOOLS,
        tool_choice: "auto",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const assistantMessage = aiResponse.choices?.[0]?.message;

    // Check if there are tool calls
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log(`AI requested ${assistantMessage.tool_calls.length} tool calls`);

      // Execute all tool calls
      const toolResults = await Promise.all(
        assistantMessage.tool_calls.map(async (toolCall: any) => {
          const args = JSON.parse(toolCall.function.arguments);
          const result = await executeTool(toolCall.function.name, args);
          return {
            role: "tool",
            tool_call_id: toolCall.id,
            content: result,
          };
        })
      );

      // Second call with tool results
      const messagesWithToolResults = [
        ...aiMessages,
        assistantMessage,
        ...toolResults,
      ];

      const secondResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: messagesWithToolResults,
          stream: true,
        }),
      });

      if (!secondResponse.ok) {
        console.error("Second AI call failed:", secondResponse.status);
        return new Response(JSON.stringify({ error: "Failed to process tool results" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Return streaming response with tool call info header
      return new Response(secondResponse.body, {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/event-stream",
          "X-Tool-Calls": JSON.stringify(assistantMessage.tool_calls.map((tc: any) => tc.function.name)),
        },
      });
    }

    // No tool calls - stream the response directly
    // Make another call with streaming
    const streamResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!streamResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to stream response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(streamResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Expert chat agent error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
