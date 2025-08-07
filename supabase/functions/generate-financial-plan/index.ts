
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
    
    console.log('Generating AI-powered financial plan for:', financialData);

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

    // Enhanced context analysis
    const financialHealthScore = calculateFinancialHealth(financialData);
    const userProfile = analyzeUserProfile(financialData);
    const priorityArea = identifyPriorityArea(financialData);

    const enhancedPrompt = `
Eres Credi, un asistente financiero especializado que conoce íntimamente la situación de ${financialData.name || 'este usuario'}. Genera un plan personalizado usando tu comprensión profunda de sus finanzas.

PERFIL FINANCIERO COMPLETO:
👤 Usuario: ${financialData.name || 'Usuario'} 
💰 Ingresos totales: ${formatUSD(totalIncome)} (principal: ${formatUSD(financialData.monthlyIncome)}, extra: ${formatUSD(financialData.extraIncome || 0)})
💸 Gastos mensuales: ${formatUSD(totalExpenses)}
💳 Pagos de deudas: ${formatUSD(totalDebts)}
📊 Balance disponible: ${formatUSD(monthlyBalance)}
🎯 Completitud de datos: ${Math.round(financialData.dataCompleteness || 50)}%

ANÁLISIS DE CONTEXTO:
🏥 Salud financiera: ${financialHealthScore}/100
👥 Perfil de usuario: ${userProfile}
🚨 Área prioritaria: ${priorityArea}

DESGLOSE DETALLADO DE GASTOS:
${Object.entries(financialData.expenseCategories || {}).map(([category, amount]) => 
  `• ${category}: ${formatUSD(amount as number)}`
).join('\n') || 'Gastos no categorizados disponibles'}

SITUACIÓN DE DEUDAS:
${financialData.debts?.length > 0 ? financialData.debts.map((debt: any) => 
  `• ${debt.name}: ${formatUSD(debt.amount)} (${debt.interestRate}% interés, pago mín: ${formatUSD(debt.monthlyPayment)})`
).join('\n') : 'Sin deudas registradas - ¡Excelente posición financiera!'}

METAS Y ASPIRACIONES:
${financialData.goals?.length > 0 ? financialData.goals.map((goal: any) => 
  `• ${goal.name}: ${formatUSD(goal.target)} (progreso: ${formatUSD(goal.current)}, fecha: ${goal.date})`
).join('\n') : 'Metas financieras por definir'}

AHORROS ACTUALES:
• Disponible: ${formatUSD(financialData.currentSavings || 0)}
• Meta general: ${formatUSD(financialData.savingsGoal || 0)}

Como Credi, tu asistente personal, proporciona:

1. 🎯 RECOMENDACIONES PERSONALIZADAS (4-6 acciones específicas):
   - Basadas en su situación única y datos reales
   - Priorizadas por impacto inmediato vs. largo plazo
   - Considerando su perfil de riesgo y capacidad actual

2. 💡 ESTRATEGIA DE OPTIMIZACIÓN:
   - Identificar oportunidades de ahorro específicas
   - Sugerir redistribución inteligente de gastos
   - Proponer aceleración de metas existentes

3. 📈 ANÁLISIS PREDICTIVO:
   - Proyección realista de progreso en 3, 6 y 12 meses
   - Impacto financiero de seguir vs. no seguir el plan
   - Alertas proactivas sobre patrones preocupantes

4. 🎉 MOTIVACIÓN CONTEXTUALIZADA:
   - Celebrar fortalezas financieras actuales
   - Crear momentum con victorias rápidas
   - Vincular recomendaciones con metas personales

Responde en formato JSON con esta estructura optimizada:
{
  "recommendations": [
    "recomendación específica y accionable 1",
    "recomendación específica y accionable 2",
    "etc..."
  ],
  "analysis": "análisis profundo de 2-3 párrafos sobre su situación única, patrones identificados, y oportunidades clave",
  "savingsSuggestion": número_realista_mensual,
  "budgetBreakdown": {
    "fixedExpenses": número,
    "variableExpenses": número,
    "savings": número,
    "debtPayments": número,
    "emergency": número
  },
  "timeEstimate": "proyección realista con hitos específicos",
  "motivationalMessage": "mensaje personal y motivador de 2-3 líneas que reconozca sus fortalezas y anime hacia las metas",
  "proactiveInsights": [
    "insight predictivo 1",
    "insight predictivo 2"
  ],
  "priorityActions": [
    {
      "action": "acción específica",
      "timeline": "cuando hacerla",
      "impact": "beneficio esperado"
    }
  ]
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
            content: 'Eres Credi, un asistente financiero personal experto que conoce profundamente a cada usuario. Proporcionas análisis detallados, recomendaciones específicas, y motivación personalizada basada en datos reales. Tu objetivo es ser el mejor asesor financiero personal que cada usuario pueda tener.' 
          },
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('Enhanced AI response:', aiResponse);

    // Parse the JSON response from OpenAI
    let financialPlan;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      financialPlan = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing enhanced AI response:', parseError);
      // Enhanced fallback plan
      financialPlan = generateEnhancedFallbackPlan(financialData, monthlyBalance);
    }

    // Add calculated monthly balance and enhanced metadata
    financialPlan.monthlyBalance = monthlyBalance;
    financialPlan.financialHealthScore = financialHealthScore;
    financialPlan.userProfile = userProfile;
    financialPlan.dataQuality = financialData.dataCompleteness || 50;

    return new Response(JSON.stringify(financialPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced generate-financial-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error generating enhanced financial plan' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateFinancialHealth(data: any): number {
  let score = 0;
  
  // Income stability (20 points)
  if (data.monthlyIncome > 0) score += 20;
  if (data.extraIncome > 0) score += 5;
  
  // Expense management (25 points)
  const incomeExpenseRatio = data.monthlyExpenses / (data.monthlyIncome || 1);
  if (incomeExpenseRatio < 0.5) score += 25;
  else if (incomeExpenseRatio < 0.7) score += 20;
  else if (incomeExpenseRatio < 0.9) score += 10;
  
  // Debt situation (25 points)
  const highInterestDebts = data.debts?.filter((d: any) => d.interestRate > 20) || [];
  if (data.debts?.length === 0) score += 25;
  else if (highInterestDebts.length === 0) score += 20;
  else if (highInterestDebts.length <= 2) score += 10;
  
  // Savings and goals (20 points)
  if (data.currentSavings > 0) score += 10;
  if (data.goals?.length > 0) score += 10;
  
  // Data completeness (10 points)
  score += Math.round((data.dataCompleteness || 50) / 10);
  
  return Math.min(score, 100);
}

function analyzeUserProfile(data: any): string {
  const balance = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
  const hasDebts = data.debts?.length > 0;
  const hasGoals = data.goals?.length > 0;
  
  if (balance > 500 && !hasDebts && hasGoals) return "Planificador Avanzado";
  if (balance > 200 && hasGoals) return "Constructor de Patrimonio";
  if (hasDebts && balance > 0) return "Optimizador de Deudas";
  if (balance > 0) return "Ahorrador Principiante";
  return "Equilibrista Financiero";
}

function identifyPriorityArea(data: any): string {
  const balance = (data.monthlyIncome || 0) - (data.monthlyExpenses || 0);
  const highInterestDebts = data.debts?.filter((d: any) => d.interestRate > 20) || [];
  const emergencyFund = data.currentSavings || 0;
  
  if (balance < 0) return "Estabilización de Ingresos";
  if (highInterestDebts.length > 0) return "Eliminación de Deudas Costosas";
  if (emergencyFund < 500) return "Fondo de Emergencia";
  if (data.goals?.length > 0) return "Aceleración de Metas";
  return "Optimización y Crecimiento";
}

function generateEnhancedFallbackPlan(data: any, monthlyBalance: number): any {
  return {
    recommendations: [
      `Basado en tu balance mensual de ${formatUSD(monthlyBalance)}, prioriza crear un presupuesto detallado`,
      'Establece un fondo de emergencia como primera meta financiera',
      'Automatiza tus ahorros para construir disciplina financiera',
      'Revisa y optimiza tus gastos más grandes cada mes',
      data.debts?.length > 0 ? 'Enfócate en pagar primero las deudas con mayor interés' : 'Considera opciones de inversión para hacer crecer tu dinero'
    ].filter(Boolean),
    analysis: `Tu situación financiera muestra un balance mensual de ${formatUSD(monthlyBalance)}. ${monthlyBalance > 0 ? 'Tienes capacidad de ahorro que podemos optimizar' : 'Necesitamos trabajar en equilibrar ingresos y gastos'}. Con los datos disponibles, veo oportunidades importantes para mejorar tu estabilidad financiera.`,
    savingsSuggestion: Math.max(monthlyBalance * 0.2, 50),
    budgetBreakdown: {
      fixedExpenses: data.monthlyExpenses * 0.6,
      variableExpenses: data.monthlyExpenses * 0.4,
      savings: Math.max(monthlyBalance * 0.2, 0),
      debtPayments: data.debts?.reduce((sum: number, debt: any) => sum + debt.monthlyPayment, 0) || 0,
      emergency: Math.max(monthlyBalance * 0.1, 0)
    },
    timeEstimate: '3-6 meses para establecer bases sólidas, 6-12 meses para ver progreso significativo',
    motivationalMessage: `¡${data.name || 'Usuario'}, estás dando el paso más importante hacia tu libertad financiera! Con disciplina y este plan personalizado, transformarás tu situación económica.`,
    proactiveInsights: [
      monthlyBalance > 0 ? 'Tu capacidad de ahorro te permite construir patrimonio gradualmente' : 'Identifica oportunidades de ingreso adicional o reducción de gastos',
      'Mantén consistencia en tus hábitos financieros para resultados duraderos'
    ],
    priorityActions: [
      {
        action: monthlyBalance > 0 ? 'Separar dinero para fondo de emergencia' : 'Revisar gastos para crear margen de ahorro',
        timeline: 'Esta semana',
        impact: monthlyBalance > 0 ? 'Seguridad financiera inmediata' : 'Mayor control sobre tus finanzas'
      }
    ]
  };
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
