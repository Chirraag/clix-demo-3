import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    const { language } = body;
    
    const ULTRAVOX_API_KEY = '3BrmlxOk.748Z6FekQpwKPQaoMUXQH07ubWRsQofp';
    const ULTRAVOX_API_BASE_URL = 'https://api.ultravox.ai/api';
    const HINDI_AGENT_ID = 'ad69ddb2-363f-4279-adf4-5961f127ec2f';

    const HINDI_SYSTEM_PROMPT = `You are Arjun, an AI agent from Clix Capital.`;

    const response = await fetch(`${ULTRAVOX_API_BASE_URL}/calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ULTRAVOX_API_KEY,
      },
      body: JSON.stringify({
        systemPrompt: HINDI_SYSTEM_PROMPT,
        initialOutputMedium: 'MESSAGE_MEDIUM_VOICE',
        languageHint: 'hi-IN',
        recordingEnabled: true,
        selectedTools: [],
        voice: HINDI_AGENT_ID,
        medium: {
          serverWebSocket: {
            inputSampleRate: 48000,
            outputSampleRate: 48000,
          }
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: `Failed to create call: ${error}` }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
