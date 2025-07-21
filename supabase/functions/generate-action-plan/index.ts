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
    const { financialPlan, userData } = await req.json();
    
    console.log('Generating action plan for:', { financialPlan, userData });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `
Basándote en el siguiente plan financiero y datos del usuario, crea un plan de acción específico con tareas concretas:

PLAN FINANCIERO:
- Recomendaciones: ${financialPlan.recommendations?.join(', ') || 'N/A'}
- Ahorro sugerido: $${financialPlan.savingsSuggestion?.toLocaleString() || 0}
- Balance mensual: $${financialPlan.monthlyBalance?.toLocaleString() || 0}

DATOS DEL USUARIO:
- Ingresos: $${userData.monthlyIncome?.toLocaleString() || 0}
- Gastos: $${userData.monthlyExpenses?.toLocaleString() || 0}
- Número de deudas: ${userData.debts?.length || 0}
- Acepta WhatsApp: ${userData.whatsappOptin ? 'Sí' : 'No'}

Crea 4-6 tareas específicas y accionables para los próximos 30 días. Cada tarea debe tener:
- Título claro y específico
- Descripción detallada
- Prioridad (high, medium, low)
- Fecha límite (en días desde hoy)
- 2-4 pasos específicos para completarla

Responde en formato JSON:
{
  "tasks": [
    {
      "title": "título",
      "description": "descripción",
      "priority": "high|medium|low",
      "dueDate": "YYYY-MM-DD",
      "steps": ["paso 1", "paso 2", ...]
    }
  ],
  "nextReviewDate": "YYYY-MM-DD",
  "whatsappReminders": true/false
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'Eres un coach financiero que crea planes de acción específicos y realizables. Enfócate en tareas concretas que el usuario pueda completar.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('OpenAI action plan response:', aiResponse);

    // Parse the JSON response from OpenAI
    let actionPlan;
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      actionPlan = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fallback action plan if parsing fails
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      actionPlan = {
        tasks: [
          {
            title: 'Registrar gastos diarios',
            description: 'Anota todos tus gastos durante una semana para identificar patrones',
            priority: 'high',
            dueDate: nextWeek.toISOString().split('T')[0],
            steps: [
              'Descarga una app de gastos o usa una libreta',
              'Anota cada compra inmediatamente',
              'Categoriza los gastos al final del día',
              'Revisa el total semanal'
            ]
          },
          {
            title: 'Crear fondo de emergencia',
            description: 'Establece una cuenta separada para emergencias',
            priority: 'high',
            dueDate: nextMonth.toISOString().split('T')[0],
            steps: [
              'Abre una cuenta de ahorros separada',
              'Transfiere una cantidad inicial',
              'Programa transferencias automáticas mensuales'
            ]
          }
        ],
        nextReviewDate: nextMonth.toISOString().split('T')[0],
        whatsappReminders: userData.whatsappOptin || false
      };
    }

    // Ensure all tasks have unique IDs
    actionPlan.tasks = actionPlan.tasks.map((task: any, index: number) => ({
      ...task,
      id: `${Date.now()}_${index}`,
      completed: false
    }));

    return new Response(JSON.stringify(actionPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-action-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error generating action plan' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});