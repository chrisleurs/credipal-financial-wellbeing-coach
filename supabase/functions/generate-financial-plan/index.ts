
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    
    console.log('🤖 Generating comprehensive financial plan for:', financialData);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Extraer datos consolidados
    const monthlyIncome = financialData.totalMonthlyIncome || financialData.monthlyIncome || 0;
    const monthlyExpenses = financialData.monthlyExpenses || 0;
    const currentSavings = financialData.currentSavings || 0;
    const savingsCapacity = financialData.monthlySavingsCapacity || financialData.savingsCapacity || 0;
    const totalDebt = financialData.debts?.reduce((sum: number, debt: any) => sum + (debt.amount || debt.current_balance || 0), 0) || 0;
    const monthlyDebtPayments = financialData.debts?.reduce((sum: number, debt: any) => sum + (debt.monthlyPayment || debt.monthly_payment || 0), 0) || 0;

    // Cálculos proyectados
    const emergencyFund = monthlyExpenses * 3; // 3 meses de gastos
    const projectedWealth = currentSavings + (savingsCapacity * 12) - (totalDebt * 0.5); // Proyección conservadora

    const formatUSD = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    // Prompt estructurado para OpenAI
    const enhancedPrompt = `
Eres un asesor financiero experto mexicano. Analiza estos datos y crea un plan financiero completo con exactamente estos 8 componentes:

DATOS DEL USUARIO:
- Ingreso mensual: ${formatUSD(monthlyIncome)}
- Gastos mensuales: ${formatUSD(monthlyExpenses)}
- Deudas: ${JSON.stringify(financialData.debts || [])}
- Ahorros actuales: ${formatUSD(currentSavings)}
- Capacidad de ahorro: ${formatUSD(savingsCapacity)}
- Pagos mensuales de deuda: ${formatUSD(monthlyDebtPayments)}

GENERA UN JSON CON ESTA ESTRUCTURA EXACTA:

{
  "snapshotInicial": {
    "hoy": {
      "ingresos": ${monthlyIncome},
      "gastos": ${monthlyExpenses},
      "deuda": ${totalDebt},
      "ahorro": ${currentSavings}
    },
    "en12Meses": {
      "deuda": [calcula deuda restante después de 12 meses de pagos],
      "fondoEmergencia": ${emergencyFund},
      "patrimonio": [calcula patrimonio proyectado realista]
    }
  },
  
  "presupuestoMensual": {
    "necesidades": { "porcentaje": [calcula %], "cantidad": [cantidad en pesos] },
    "estiloVida": { "porcentaje": [calcula %], "cantidad": [cantidad en pesos] },
    "ahorro": { "porcentaje": [calcula %], "cantidad": [cantidad en pesos] }
  },
  
  "planPagoDeuda": [
    // Para cada deuda, calcula plan de pago realista
    {
      "deuda": "nombre de la deuda",
      "balanceActual": [balance actual],
      "fechaLiquidacion": "[fecha ISO realista]",
      "pagoMensual": [pago mensual sugerido],
      "interesesAhorrados": [estimado de intereses ahorrados]
    }
  ],
  
  "fondoEmergencia": {
    "metaTotal": ${emergencyFund},
    "progresoActual": ${Math.min(currentSavings, emergencyFund)},
    "ahorroMensual": [calcula contribución mensual realista],
    "fechaCompletion": "[fecha ISO cuando se completaría]"
  },
  
  "crecimientoPatrimonial": {
    "año1": [proyección conservadora año 1],
    "año3": [proyección año 3], 
    "año5": [proyección año 5]
  },
  
  "roadmapTrimestral": [
    {
      "trimestre": "Q1 2025",
      "ahorroAcumulado": [ahorro acumulado al final del trimestre],
      "deudaPendiente": [deuda restante],
      "avance": [porcentaje de avance hacia metas]
    },
    // Generar 4 trimestres
  ],
  
  "metasCortoPlazo": {
    "semanales": [
      {
        "titulo": "[meta específica semanal]",
        "meta": [cantidad numérica],
        "progreso": 0,
        "tipo": "ahorro|deuda|gasto"
      }
      // 3-4 metas semanales
    ],
    "mensuales": [
      {
        "titulo": "[meta específica mensual]",
        "meta": [cantidad numérica],
        "progreso": 0,
        "tipo": "ahorro|deuda|gasto"
      }
      // 2-3 metas mensuales
    ]
  },
  
  "roadmapAccion": [
    {
      "paso": 1,
      "titulo": "[acción prioritaria específica]",
      "fechaObjetivo": "[fecha ISO]",
      "completado": false
    }
    // 5-6 pasos de acción priorizados
  ]
}

INSTRUCCIONES CRÍTICAS:
- Todos los cálculos deben ser matemáticamente correctos y realistas
- Fechas en formato ISO (YYYY-MM-DD)
- Cantidades sin símbolos de moneda (solo números)
- Metas semanales/mensuales específicas y alcanzables
- Considera el contexto financiero mexicano
- Si no hay deudas, el array planPagoDeuda debe estar vacío []
- Proyecciones conservadoras pero motivadoras
- Roadmap trimestral debe cubrir los próximos 12 meses

Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`;

    console.log('🤖 Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'Eres un asesor financiero experto especializado en planes financieros estructurados para usuarios mexicanos. Generas análisis precisos basados en datos reales y proporcionas planes de acción específicos y alcanzables.' 
          },
          { role: 'user', content: enhancedPrompt }
        ],
        max_completion_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('🤖 Raw AI response:', aiResponse);

    // Parse the JSON response from OpenAI
    let financialPlan;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      financialPlan = JSON.parse(cleanedResponse);
      console.log('✅ Parsed financial plan successfully');
    } catch (parseError) {
      console.error('❌ Error parsing AI response:', parseError);
      console.error('❌ Raw response was:', aiResponse);
      
      // Fallback plan estructurado
      financialPlan = generateFallbackPlan(financialData, monthlyIncome, monthlyExpenses, totalDebt, currentSavings, savingsCapacity);
    }

    // Add metadata to plan
    financialPlan.metadata = {
      generatedAt: new Date().toISOString(),
      userId: financialData.userId,
      monthlyBalance: monthlyIncome - monthlyExpenses,
      dataQuality: calculateDataQuality(financialData),
      planVersion: '2.0'
    };

    // Save to database using Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error: saveError } = await supabase
      .from('financial_plans')
      .upsert({
        user_id: financialData.userId,
        plan_type: 'comprehensive',
        plan_data: financialPlan,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,plan_type'
      });

    if (saveError) {
      console.error('❌ Error saving plan to database:', saveError);
      // Continue anyway, return the plan even if save failed
    } else {
      console.log('✅ Financial plan saved to database successfully');
    }

    return new Response(JSON.stringify(financialPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in comprehensive generate-financial-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error generating comprehensive financial plan',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFallbackPlan(data: any, income: number, expenses: number, debt: number, savings: number, capacity: number) {
  const emergencyGoal = expenses * 3;
  const currentDate = new Date();
  
  return {
    snapshotInicial: {
      hoy: {
        ingresos: income,
        gastos: expenses,
        deuda: debt,
        ahorro: savings
      },
      en12Meses: {
        deuda: Math.max(0, debt - (capacity * 0.5 * 12)),
        fondoEmergencia: Math.min(emergencyGoal, savings + (capacity * 0.3 * 12)),
        patrimonio: savings + (capacity * 12) - (debt * 0.3)
      }
    },
    presupuestoMensual: {
      necesidades: { porcentaje: 50, cantidad: income * 0.5 },
      estiloVida: { porcentaje: 30, cantidad: income * 0.3 },
      ahorro: { porcentaje: 20, cantidad: income * 0.2 }
    },
    planPagoDeuda: debt > 0 ? [{
      deuda: "Deuda consolidada",
      balanceActual: debt,
      fechaLiquidacion: new Date(currentDate.getTime() + (24 * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      pagoMensual: Math.max(capacity * 0.4, 200),
      interesesAhorrados: debt * 0.15
    }] : [],
    fondoEmergencia: {
      metaTotal: emergencyGoal,
      progresoActual: Math.min(savings, emergencyGoal),
      ahorroMensual: capacity * 0.3,
      fechaCompletion: new Date(currentDate.getTime() + (12 * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    },
    crecimientoPatrimonial: {
      año1: savings + (capacity * 12),
      año3: savings + (capacity * 36) + (capacity * 36 * 0.05),
      año5: savings + (capacity * 60) + (capacity * 60 * 0.12)
    },
    roadmapTrimestral: [
      {
        trimestre: "Q1 2025",
        ahorroAcumulado: capacity * 3,
        deudaPendiente: Math.max(0, debt - (capacity * 0.4 * 3)),
        avance: 25
      },
      {
        trimestre: "Q2 2025", 
        ahorroAcumulado: capacity * 6,
        deudaPendiente: Math.max(0, debt - (capacity * 0.4 * 6)),
        avance: 50
      },
      {
        trimestre: "Q3 2025",
        ahorroAcumulado: capacity * 9, 
        deudaPendiente: Math.max(0, debt - (capacity * 0.4 * 9)),
        avance: 75
      },
      {
        trimestre: "Q4 2025",
        ahorroAcumulado: capacity * 12,
        deudaPendiente: Math.max(0, debt - (capacity * 0.4 * 12)), 
        avance: 100
      }
    ],
    metasCortoPlazo: {
      semanales: [
        {
          titulo: `Ahorra $${Math.round(capacity * 0.25 / 4)} esta semana`,
          meta: Math.round(capacity * 0.25 / 4),
          progreso: 0,
          tipo: "ahorro"
        },
        {
          titulo: "Revisa y categoriza gastos diarios",
          meta: 7,
          progreso: 0,
          tipo: "gasto"
        }
      ],
      mensuales: [
        {
          titulo: `Reduce deuda en $${Math.round(capacity * 0.4)}`,
          meta: Math.round(capacity * 0.4),
          progreso: 0,
          tipo: "deuda"
        },
        {
          titulo: `Ahorra $${Math.round(capacity * 0.3)} para emergencias`,
          meta: Math.round(capacity * 0.3),
          progreso: 0,
          tipo: "ahorro"
        }
      ]
    },
    roadmapAccion: [
      {
        paso: 1,
        titulo: "Establecer presupuesto mensual automático",
        fechaObjetivo: new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        completado: false
      },
      {
        paso: 2,
        titulo: debt > 0 ? "Consolidar y priorizar pagos de deuda" : "Establecer fondo de emergencia",
        fechaObjetivo: new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        completado: false
      },
      {
        paso: 3,
        titulo: "Automatizar transferencias de ahorro",
        fechaObjetivo: new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        completado: false
      }
    ]
  };
}

function calculateDataQuality(data: any): number {
  let score = 0;
  if (data.monthlyIncome > 0) score += 25;
  if (data.monthlyExpenses > 0) score += 25;
  if (data.debts && data.debts.length > 0) score += 25;
  if (data.financialGoals && data.financialGoals.length > 0) score += 25;
  return score;
}
