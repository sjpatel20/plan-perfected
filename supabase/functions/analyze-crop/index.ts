import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Input validation schema
const AnalyzeSchema = z.object({
  image_base64: z.string().min(1).max(10_000_000), // ~7.5MB max
  crop_name: z.string().max(100).optional(),
  location: z.string().regex(/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/).optional(),
});

interface DiagnosisResult {
  status: "healthy" | "diseased" | "pest_affected" | "nutrient_deficiency" | "unknown";
  disease_name: string | null;
  confidence: number;
  description: string;
  recommendations: string[];
  severity: "low" | "medium" | "high" | "critical";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse and validate input
    let validatedInput;
    try {
      const rawBody = await req.json();
      validatedInput = AnalyzeSchema.parse(rawBody);
    } catch (validationError) {
      console.error("Input validation failed:", validationError);
      return new Response(JSON.stringify({ error: "Invalid input format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { image_base64, crop_name, location } = validatedInput;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Analyzing crop image for user:", user.id);

    const systemPrompt = `You are an expert agricultural AI specializing in crop disease and pest detection. Analyze the provided crop image and identify any diseases, pests, or nutrient deficiencies.

Your response must be a structured analysis including:
1. Health status: Whether the crop is healthy, diseased, pest-affected, or has nutrient deficiency
2. Specific disease or pest name if detected
3. Confidence level (0-100)
4. Description of what you observe
5. Practical recommendations for treatment or prevention
6. Severity level (low, medium, high, critical)

Consider the crop type and location context when available. Be specific and actionable in your recommendations.`;

    const userPrompt = `Analyze this crop image for diseases, pests, or health issues.
${crop_name ? `Crop type: ${crop_name}` : ""}
${location ? `Location: ${location}` : ""}

Provide a detailed diagnosis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image_base64}`,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_diagnosis",
              description: "Provide structured crop health diagnosis",
              parameters: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["healthy", "diseased", "pest_affected", "nutrient_deficiency", "unknown"],
                    description: "Overall health status of the crop",
                  },
                  disease_name: {
                    type: "string",
                    nullable: true,
                    description: "Name of the disease or pest if detected, null if healthy",
                  },
                  confidence: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                    description: "Confidence percentage of the diagnosis",
                  },
                  description: {
                    type: "string",
                    description: "Detailed description of observations and diagnosis",
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of actionable recommendations for treatment or prevention",
                  },
                  severity: {
                    type: "string",
                    enum: ["low", "medium", "high", "critical"],
                    description: "Severity level of the issue",
                  },
                },
                required: ["status", "confidence", "description", "recommendations", "severity"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_diagnosis" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service quota exceeded. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to analyze image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await response.json();
    console.log("AI response received");

    let diagnosis: DiagnosisResult;
    
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      diagnosis = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback if tool calling didn't work as expected
      diagnosis = {
        status: "unknown",
        disease_name: null,
        confidence: 50,
        description: aiResult.choices?.[0]?.message?.content || "Unable to analyze the image",
        recommendations: ["Please try uploading a clearer image", "Consult with a local agricultural expert"],
        severity: "low",
      };
    }

    console.log("Diagnosis complete:", diagnosis.status);

    // Save scan to database
    let signedImageUrl = '';
    try {
      // Upload image to storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const imageBuffer = Uint8Array.from(atob(image_base64), c => c.charCodeAt(0));
      
      const { error: uploadError } = await supabaseClient.storage
        .from('crop-scans')
        .upload(fileName, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
      }

      // Get signed URL (valid for 7 days)
      const { data: signedUrlData, error: signedUrlError } = await supabaseClient.storage
        .from('crop-scans')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

      if (signedUrlError) {
        console.error("Signed URL error:", signedUrlError);
      } else {
        signedImageUrl = signedUrlData?.signedUrl || '';
      }

      // Parse location if provided
      let latitude: number | null = null;
      let longitude: number | null = null;
      if (location) {
        const coords = location.split(',').map((c: string) => parseFloat(c.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          latitude = coords[0];
          longitude = coords[1];
        }
      }

      // Insert scan record with signed URL
      const { data: scanData, error: scanError } = await supabaseClient
        .from('crop_scans')
        .insert({
          user_id: user.id,
          image_url: signedImageUrl,
          disease_detected: diagnosis.disease_name,
          confidence_score: diagnosis.confidence,
          diagnosis_result: diagnosis,
          recommendations: diagnosis.recommendations,
          latitude,
          longitude,
        })
        .select('id')
        .single();

      if (scanError) {
        console.error("Scan insert error:", scanError);
      } else {
        console.log("Scan saved with id:", scanData?.id);
      }
    } catch (saveError) {
      console.error("Error saving scan:", saveError);
      // Continue - don't fail the response if save fails
    }

    return new Response(JSON.stringify({ diagnosis }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-crop:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
