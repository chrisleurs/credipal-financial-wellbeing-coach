
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
    const { financialData } = await req.json();
    
    console.log('Generating financial plan for:', financialData);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const totalIncome = financialData.monthlyIncome + (financialData.extraIncome || 0);
    const totalExpenses = financialData.monthlyExpenses;
    const totalDebts = financialData.debts?.reduce((sum: number, debt: any) => sum + debt.monthlyPayment, 0) || 0;
    const monthlyBalance = totalIncome - totalExpenses - totalDebts;

    const formatUSD = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    const prompt = `
Eres un asesor financiero experto. Analiza la siguiente información financiera y genera un plan personalizado en español:

INFORMACIÓN FINANCIERA:
- Ingresos mensuales: ${formatUSD(totalIncome)}
- Gastos mensuales: ${formatUSD(totalExpenses)}
- Pagos de deudas: ${formatUSD(totalDebts)}
- Balance mensual: ${formatUSD(monthlyBalance)}

DEUDAS:
${financialData.debts?.map((debt: any) => 
  `- ${debt.name}: ${formatUSD(debt.amount)} (pago mensual: ${formatUSD(debt.monthlyPayment)}, tasa: ${debt.interestRate}%)`
).join('\n') || 'Sin deudas registradas'}

OBJETIVO DE AHORRO:
- Meta: ${formatUSD(financialData.savingsGoal || 0)}

Por favor, proporciona:
1. 4-5 recomendaciones específicas y accionables
2. Sugerencia de ahorro mensual realista
3. Estrategia para manejo de deudas (si aplica)
4. Desglose presupuestario recomendado
5. Tiempo estimado para alcanzar objetivos
6. Mensaje motivacional personalizado

Responde en formato JSON con esta estructura:
{
  "recommendations": ["recomendación 1", "recomendación 2", ...],
  "savingsSuggestion": número,
  "budgetBreakdown": {
    "fixedExpenses": número,
    "variableExpenses": número,
    "savings": número,
    "emergency": número
  },
  "timeEstimate": "texto",
  "motivationalMessage": "texto"
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
            content: 'Eres un asesor financiero experto especializado en finanzas personales para el mercado americano usando USD. Proporciona consejos prácticos y realistas.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('OpenAI response:', aiResponse);

    // Parse the JSON response from OpenAI
    let financialPlan;
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      financialPlan = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fallback plan if parsing fails
      financialPlan = {
        recommendations: [
          'Crear un presupuesto detallado de ingresos y gastos',
          'Establecer un fondo de emergencia',
          'Revisar y optimizar gastos variables',
          'Considerar estrategias de inversión básicas'
        ],
        savingsSuggestion: Math.max(0, monthlyBalance * 0.2),
        budgetBreakdown: {
          fixedExpenses: totalExpenses * 0.6,
          variableExpenses: totalExpenses * 0.4,
          savings: Math.max(0, monthlyBalance * 0.2),
          emergency: totalExpenses * 3
        },
        timeEstimate: '6-12 meses para ver resultados',
        motivationalMessage: '¡Cada paso cuenta hacia tu libertad financiera!'
      };
    }

    // Add calculated monthly balance
    financialPlan.monthlyBalance = monthlyBalance;

    return new Response(JSON.stringify(financialPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-financial-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error generating financial plan' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
