
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
      monthlyIncome: financialData?.monthlyIncome || 0,
      monthlyExpenses: financialData?.monthlyExpenses || 0,
      savingsCapacity: financialData?.savingsCapacity || 0,
      debtsCount: financialData?.debts?.length || 0
    })

    // Validar que tenemos datos financieros
    if (!financialData) {
      throw new Error('No financial data provided')
    }

    // Generar plan con OpenAI si tenemos la API key
    if (openaiApiKey) {
      console.log('🔄 Using OpenAI to generate plan')
      const aiPlan = await generatePlanWithOpenAI(financialData)
      return new Response(JSON.stringify(aiPlan), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      console.log('⚠️ No OpenAI API key, using fallback plan')
      const fallbackPlan = generateFallbackPlan(financialData)
      return new Response(JSON.stringify(fallbackPlan), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

  } catch (error) {
    console.error('❌ Error in financial plan generation:', error)
    
    // Crear plan de fallback más básico en caso de error
    try {
      const { financialData } = await req.json().catch(() => ({ financialData: null }))
      const emergencyPlan = generateEmergencyFallbackPlan(financialData)
      
      return new Response(JSON.stringify(emergencyPlan), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (fallbackError) {
      console.error('❌ Even fallback failed:', fallbackError)
      
      return new Response(JSON.stringify({ 
        error: 'Failed to generate financial plan',
        message: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }
})

async function generatePlanWithOpenAI(data: any) {
  const prompt = createFinancialPlanPrompt(data)
  
  try {
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
            content: 'Eres CrediPal, un experto en finanzas personales que crea planes financieros estructurados y motivacionales. Siempre respondes con JSON válido.'
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
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error('Invalid OpenAI response structure:', result)
      throw new Error('Invalid response structure from OpenAI')
    }

    const planContent = JSON.parse(result.choices[0].message.content)
    console.log('✅ OpenAI plan generated successfully')
    return planContent
    
  } catch (error) {
    console.error('❌ OpenAI generation failed:', error)
    throw error
  }
}

function createFinancialPlanPrompt(data: any): string {
  const monthlyIncome = data.monthlyIncome || 0
  const monthlyExpenses = data.monthlyExpenses || 0
  const currentSavings = data.currentSavings || 0
  const savingsCapacity = data.savingsCapacity || Math.max(0, monthlyIncome - monthlyExpenses)
  const debts = data.debts || []
  const goals = data.goals || []

  return `
Crea un plan financiero personalizado basado en estos datos:

SITUACIÓN ACTUAL:
- Ingresos mensuales: $${monthlyIncome}
- Gastos mensuales: $${monthlyExpenses}
- Ahorros actuales: $${currentSavings}
- Capacidad de ahorro: $${savingsCapacity}
- Deudas: ${JSON.stringify(debts)}
- Metas: ${JSON.stringify(goals)}

Responde ÚNICAMENTE con un JSON válido que siga esta estructura exacta:

{
  "currentSnapshot": {
    "monthlyIncome": ${monthlyIncome},
    "monthlyExpenses": ${monthlyExpenses},
    "totalDebt": ${debts.reduce((sum: number, debt: any) => sum + (debt.amount || 0), 0)},
    "currentSavings": ${currentSavings}
  },
  "projectedSnapshot": {
    "debtIn12Months": ${Math.max(0, debts.reduce((sum: number, debt: any) => sum + (debt.amount || 0), 0) - (savingsCapacity * 0.6 * 12))},
    "emergencyFundIn12Months": ${monthlyExpenses * 3},
    "netWorthIn12Months": ${savingsCapacity * 12}
  },
  "recommendedBudget": {
    "needs": { "percentage": 50, "amount": ${monthlyIncome * 0.5} },
    "lifestyle": { "percentage": 30, "amount": ${monthlyIncome * 0.3} },
    "savings": { "percentage": 20, "amount": ${monthlyIncome * 0.2} }
  },
  "debtPayoffPlan": ${JSON.stringify(debts.map((debt: any) => ({
    debtName: debt.name || 'Deuda',
    currentBalance: debt.amount || 0,
    payoffDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    monthlyPayment: debt.monthlyPayment || Math.ceil((debt.amount || 0) / 24),
    interestSaved: (debt.amount || 0) * 0.15
  })))},
  "emergencyFund": {
    "targetAmount": ${monthlyExpenses * 3},
    "currentAmount": ${currentSavings},
    "monthlySaving": ${savingsCapacity * 0.4},
    "completionDate": "${new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}"
  },
  "wealthGrowth": {
    "year1": ${savingsCapacity * 12},
    "year3": ${savingsCapacity * 36 * 1.05},
    "year5": ${savingsCapacity * 60 * 1.1}
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
        "title": "Ahorrar para emergencias",
        "target": ${savingsCapacity * 0.4},
        "progress": 0,
        "type": "savings"
      }
    ]
  },
  "actionRoadmap": [
    {
      "step": 1,
      "title": "Establecer presupuesto mensual",
      "targetDate": "${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}",
      "completed": false,
      "description": "Definir límites de gasto por categoría"
    },
    {
      "step": 2,
      "title": "Iniciar fondo de emergencia",
      "targetDate": "${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}",
      "completed": false,
      "description": "Separar primer ahorro mensual"
    }
  ]
}

IMPORTANTE: Responde SOLO con el JSON, sin texto adicional. Usa números reales basados en los datos proporcionados.
`
}

function generateFallbackPlan(data: any) {
  const monthlyIncome = data?.monthlyIncome || 0
  const monthlyExpenses = data?.monthlyExpenses || 0
  const currentSavings = data?.currentSavings || 0
  const debts = data?.debts || []
  const totalDebt = debts.reduce((sum: number, debt: any) => sum + (debt.amount || 0), 0)
  const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses)
  const emergencyFundTarget = monthlyExpenses * 3

  console.log('🔄 Generating fallback plan with:', {
    monthlyIncome,
    monthlyExpenses,
    savingsCapacity,
    totalDebt
  })

  return {
    currentSnapshot: {
      monthlyIncome,
      monthlyExpenses,
      totalDebt,
      currentSavings
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
    debtPayoffPlan: debts.map((debt: any) => ({
      debtName: debt.name || 'Deuda',
      currentBalance: debt.amount || 0,
      payoffDate: new Date(Date.now() + (debt.amount || 0) / Math.max(debt.monthlyPayment || 100, 100) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyPayment: debt.monthlyPayment || Math.ceil((debt.amount || 0) / 24),
      interestSaved: (debt.amount || 0) * 0.15
    })),
    emergencyFund: {
      targetAmount: emergencyFundTarget,
      currentAmount: currentSavings,
      monthlySaving: savingsCapacity * 0.4,
      completionDate: new Date(Date.now() + ((emergencyFundTarget - currentSavings) / Math.max(savingsCapacity * 0.4, 100)) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
          target: Math.max(savingsCapacity * 0.4, 100),
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

function generateEmergencyFallbackPlan(data: any) {
  console.log('🚨 Generating emergency fallback plan')
  
  return {
    currentSnapshot: {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      totalDebt: 0,
      currentSavings: 0
    },
    projectedSnapshot: {
      debtIn12Months: 0,
      emergencyFundIn12Months: 3000,
      netWorthIn12Months: 1000
    },
    recommendedBudget: {
      needs: { percentage: 50, amount: 0 },
      lifestyle: { percentage: 30, amount: 0 },
      savings: { percentage: 20, amount: 0 }
    },
    debtPayoffPlan: [],
    emergencyFund: {
      targetAmount: 3000,
      currentAmount: 0,
      monthlySaving: 250,
      completionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    wealthGrowth: {
      year1: 1000,
      year3: 3000,
      year5: 5000
    },
    shortTermGoals: {
      weekly: [
        {
          title: "Registrar gastos",
          target: 100,
          progress: 0,
          type: "tracking"
        }
      ],
      monthly: [
        {
          title: "Comenzar a ahorrar",
          target: 250,
          progress: 0,
          type: "savings"
        }
      ]
    },
    actionRoadmap: [
      {
        step: 1,
        title: "Completar información financiera",
        targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        description: "Agregar ingresos y gastos mensuales"
      }
    ]
  }
}
