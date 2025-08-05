
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, dashboardData, crediPersonality } = await req.json();
    
    console.log('Generating Credi dashboard insight for data:', dashboardData);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = crediPersonality ?
      `Eres Credi, el asesor financiero empático de Credipal. Analizas datos del dashboard y generas insights específicos, actionables y motivadores. Responde en JSON con: {"type": "suggestion|celebration|alert|trend", "title": "Título del insight", "message": "Mensaje específico", "priority": "high|medium|low", "actionable": boolean}` :
      'Eres un asesor financiero que analiza datos y genera insights. Responde en JSON.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('OpenAI insight response:', aiResponse);

    // Parse the JSON response
    let insight;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      insight = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing insight response:', parseError);
      // Fallback insight
      insight = {
        type: 'suggestion',
        title: 'Oportunidad Financiera',
        message: aiResponse || 'Continúa con el excelente trabajo en tus finanzas personales.',
        priority: 'medium',
        actionable: true
      };
    }

    return new Response(JSON.stringify(insight), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-dashboard-insight function:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Error generating dashboard insight',
      type: 'suggestion',
      title: 'Sigue Construyendo',
      message: 'Tu disciplina financiera está construyendo un futuro más próspero.',
      priority: 'medium', 
      actionable: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
