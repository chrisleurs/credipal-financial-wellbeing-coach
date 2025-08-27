
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!

const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { financialData } = await req.json()
    
    console.log('🤖 Generating financial plan for:', {
      monthlyIncome: financialData.monthlyIncome,
      monthlyExpenses: financialData.monthlyExpenses,
      savingsCapacity: financialData.savingsCapacity,
      debtsCount: financialData.debts?.length || 0
    })

    // Generar plan con OpenAI
    const aiPlan = await generatePlanWithOpenAI(financialData)
    
    return new Response(JSON.stringify(aiPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Error in financial plan generation:', error)
    
    // Fallback plan si OpenAI falla
    const fallbackPlan = generateFallbackPlan(financialData)
    
    return new Response(JSON.stringify(fallbackPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function generatePlanWithOpenAI(data: any) {
  const prompt = createFinancialPlanPrompt(data)
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        {
          role: 'system',
          content: 'Eres CrediPal, un experto en finanzas personales que crea planes financieros estructurados y motivacionales.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 2000,
      response_format: { type: "json_object" }
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const result = await response.json()
  const planContent = JSON.parse(result.choices[0].message.content)
  
  return planContent
}

function createFinancialPlanPrompt(data: any): string {
  return `
Crea un plan financiero personalizado basado en estos datos:

SITUACIÓN ACTUAL:
- Ingresos mensuales: $${data.monthlyIncome}
- Gastos mensuales: $${data.monthlyExpenses}
- Ahorros actuales: $${data.currentSavings || 0}
- Capacidad de ahorro: $${data.savingsCapacity}
- Deudas: ${JSON.stringify(data.debts || [])}
- Metas: ${JSON.stringify(data.goals || [])}

Responde ÚNICAMENTE con un JSON válido que siga esta estructura exacta:

{
  "currentSnapshot": {
    "monthlyIncome": ${data.monthlyIncome},
    "monthlyExpenses": ${data.monthlyExpenses},
    "totalDebt": [suma total de deudas],
    "currentSavings": ${data.currentSavings || 0}
  },
  "projectedSnapshot": {
    "debtIn12Months": [proyección de deuda en 12 meses],
    "emergencyFundIn12Months": [fondo de emergencia en 12 meses],
    "netWorthIn12Months": [patrimonio neto en 12 meses]
  },
  "recommendedBudget": {
    "needs": { "percentage": 50, "amount": [50% de ingresos] },
    "lifestyle": { "percentage": 30, "amount": [30% de ingresos] },
    "savings": { "percentage": 20, "amount": [20% de ingresos] }
  },
  "debtPayoffPlan": [
    {
      "debtName": "[nombre de deuda]",
      "currentBalance": [balance actual],
      "payoffDate": "[fecha de liquidación YYYY-MM-DD]",
      "monthlyPayment": [pago mensual sugerido],
      "interestSaved": [intereses ahorrados]
    }
  ],
  "emergencyFund": {
    "targetAmount": [3 meses de gastos],
    "currentAmount": ${data.currentSavings || 0},
    "monthlySaving": [ahorro mensual sugerido],
    "completionDate": "[fecha de completion YYYY-MM-DD]"
  },
  "wealthGrowth": {
    "year1": [patrimonio proyectado año 1],
    "year3": [patrimonio proyectado año 3],
    "year5": [patrimonio proyectado año 5]
  },
  "shortTermGoals": {
    "weekly": [
      {
        "title": "Revisar gastos diarios",
        "target": 100,
        "progress": 0,
        "type": "tracking"
      }
    ],
    "monthly": [
      {
        "title": "Ahorrar para fondo de emergencia",
        "target": [meta mensual],
        "progress": 0,
        "type": "savings"
      }
    ]
  },
  "actionRoadmap": [
    {
      "step": 1,
      "title": "[acción prioritaria]",
      "targetDate": "[fecha YYYY-MM-DD]",
      "completed": false,
      "description": "[descripción breve]"
    }
  ]
}

IMPORTANTE: Responde SOLO con el JSON, sin texto adicional. Usa números reales basados en los datos proporcionados.
`
}

function generateFallbackPlan(data: any) {
  const totalDebt = data.debts?.reduce((sum: number, debt: any) => sum + debt.amount, 0) || 0
  const monthlyIncome = data.monthlyIncome || 0
  const monthlyExpenses = data.monthlyExpenses || 0
  const savingsCapacity = monthlyIncome - monthlyExpenses
  const emergencyFundTarget = monthlyExpenses * 3

  return {
    currentSnapshot: {
      monthlyIncome,
      monthlyExpenses,
      totalDebt,
      currentSavings: data.currentSavings || 0
    },
    projectedSnapshot: {
      debtIn12Months: Math.max(0, totalDebt - (savingsCapacity * 0.6 * 12)),
      emergencyFundIn12Months: emergencyFundTarget,
      netWorthIn12Months: (savingsCapacity * 12) - totalDebt
    },
    recommendedBudget: {
      needs: { percentage: 50, amount: monthlyIncome * 0.5 },
      lifestyle: { percentage: 30, amount: monthlyIncome * 0.3 },
      savings: { percentage: 20, amount: monthlyIncome * 0.2 }
    },
    debtPayoffPlan: data.debts?.map((debt: any) => ({
      debtName: debt.name,
      currentBalance: debt.amount,
      payoffDate: new Date(Date.now() + (debt.amount / (debt.monthlyPayment || 100)) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyPayment: debt.monthlyPayment || Math.ceil(debt.amount / 24),
      interestSaved: debt.amount * 0.15
    })) || [],
    emergencyFund: {
      targetAmount: emergencyFundTarget,
      currentAmount: data.currentSavings || 0,
      monthlySaving: savingsCapacity * 0.4,
      completionDate: new Date(Date.now() + ((emergencyFundTarget - (data.currentSavings || 0)) / (savingsCapacity * 0.4)) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    wealthGrowth: {
      year1: savingsCapacity * 12,
      year3: savingsCapacity * 36 * 1.05,
      year5: savingsCapacity * 60 * 1.1
    },
    shortTermGoals: {
      weekly: [
        {
          title: "Revisar gastos diarios",
          target: 100,
          progress: 0,
          type: "tracking"
        }
      ],
      monthly: [
        {
          title: "Ahorrar para emergencias",
          target: savingsCapacity * 0.4,
          progress: 0,
          type: "savings"
        }
      ]
    },
    actionRoadmap: [
      {
        step: 1,
        title: "Establecer presupuesto mensual",
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        description: "Definir límites de gasto por categoría"
      },
      {
        step: 2,
        title: "Iniciar fondo de emergencia",
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        description: "Separar primer ahorro mensual"
      }
    ]
  }
}
