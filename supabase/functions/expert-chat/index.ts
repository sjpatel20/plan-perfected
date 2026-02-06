import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Input validation schema
const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(10000),
});

const ChatSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  conversationId: z.string().uuid().optional(),
});

const SYSTEM_PROMPT = `You are Kisan Mitra's Expert Agricultural Advisor - an AI assistant specialized in helping Indian farmers with:

1. **Crop Management**: Sowing schedules, irrigation, fertilizers, pest control, disease identification
2. **Weather Guidance**: Interpreting weather forecasts, planning farm activities around weather
3. **Market Insights**: Best times to sell, price trends, mandi selection
4. **Government Schemes**: PM-KISAN, crop insurance, subsidies, how to apply
5. **Sustainable Farming**: Organic methods, soil health, water conservation

Guidelines:
- Give practical, actionable advice specific to Indian agriculture
- Consider local seasons (Kharif, Rabi, Zaid) and regional variations
- Use simple language, avoid jargon
- When discussing chemicals/pesticides, always mention safety precautions
- If unsure, recommend consulting local Krishi Vigyan Kendra (KVK)
- Be empathetic to farmers' challenges

Always respond in the same language the farmer uses (Hindi, English, or regional languages).`;

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
      return new Response(JSON.stringify({ error: "Invalid input format. Messages must be an array with valid role and content." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, conversationId } = validatedInput;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing chat request with ${messages.length} messages`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
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

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Expert chat error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
