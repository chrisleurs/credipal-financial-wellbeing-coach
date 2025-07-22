
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Crear cliente con service role para operaciones de base de datos
    const supabase = createClient(supabaseUrl ?? '', supabaseServiceKey ?? '');

    // Obtener contexto financiero del usuario
    const [expensesResult, debtsResult, financialDataResult] = await Promise.all([
      supabase.from('expenses').select('*').eq('user_id', userId).order('expense_date', { ascending: false }).limit(10),
      supabase.from('debts').select('*').eq('user_id', userId),
      supabase.from('user_financial_data').select('*').eq('user_id', userId).maybeSingle()
    ]);

    const userContext = {
      recentExpenses: expensesResult.data || [],
      debts: debtsResult.data || [],
      financialData: financialDataResult.data
    };

    // Definir funciones disponibles para OpenAI
    const functions = [
      {
        name: "add_expense",
        description: "Agregar un nuevo gasto del usuario",
        parameters: {
          type: "object",
          properties: {
            amount: { type: "number", description: "Cantidad del gasto" },
            category: { 
              type: "string", 
              enum: ["Comida", "Transporte", "Entretenimiento", "Salud", "Servicios", "Otros"],
              description: "Categoría del gasto" 
            },
            description: { type: "string", description: "Descripción del gasto" },
            expense_date: { type: "string", format: "date", description: "Fecha del gasto (YYYY-MM-DD)" }
          },
          required: ["amount", "category", "description"]
        }
      },
      {
        name: "add_debt_payment",
        description: "Registrar un pago a una deuda",
        parameters: {
          type: "object",
          properties: {
            debt_id: { type: "string", description: "ID de la deuda" },
            amount: { type: "number", description: "Cantidad del pago" },
            payment_date: { type: "string", format: "date", description: "Fecha del pago" },
            notes: { type: "string", description: "Notas del pago" }
          },
          required: ["debt_id", "amount"]
        }
      },
      {
        name: "get_expenses_summary",
        description: "Obtener resumen de gastos por período",
        parameters: {
          type: "object",
          properties: {
            period: { type: "string", enum: ["week", "month", "all"], description: "Período a consultar" },
            category: { type: "string", description: "Filtrar por categoría específica" }
          }
        }
      },
      {
        name: "analyze_spending_patterns",
        description: "Analizar patrones de gasto del usuario",
        parameters: {
          type: "object",
          properties: {
            analysis_type: { type: "string", enum: ["trends", "categories", "alerts"], description: "Tipo de análisis" }
          }
        }
      }
    ];

    const systemPrompt = `Eres CrediPal Assistant, un coach financiero personal cálido, estratégico y motivacional. Ayudas a usuarios a gestionar sus finanzas de manera natural y proactiva.

PERSONALIDAD:
- Conversacional y natural, como un amigo financiero experto
- Ejecuta acciones directamente cuando el usuario las menciona
- Celebra logros y motiva durante desafíos
- Ofrece insights y consejos personalizados
- Solo pregunta confirmación para acciones de alto riesgo (eliminar datos, pagos mayores a $5000)

CONTEXTO DEL USUARIO:
- Gastos recientes: ${JSON.stringify(userContext.recentExpenses.slice(0, 5))}
- Deudas actuales: ${JSON.stringify(userContext.debts)}
- Datos financieros: ${JSON.stringify(userContext.financialData)}

COMPORTAMIENTO INTELIGENTE:
1. EJECUTA DIRECTAMENTE gastos cuando el usuario los menciona ("gasté $50 en almuerzo", "compré café $8")
2. INFIERE categorías automáticamente (almuerzo=Comida, gasolina=Transporte, etc.)
3. USA fecha actual si no se especifica
4. DA RESPUESTAS NATURALES con insights ("✅ Gasto agregado. Llevas $230 en comida esta semana, dentro de tu presupuesto!")

INSTRUCCIONES:
- Ejecuta acciones inmediatamente sin pedir confirmación para gastos normales
- Personaliza respuestas usando el contexto financiero del usuario
- Ofrece análisis proactivos y sugerencias inteligentes
- Mantén conversaciones fluidas y naturales
- Usa emojis para hacer la experiencia más amigable

Responde en español de manera concisa y útil.`;

    // Llamada a OpenAI con function calling
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        functions: functions,
        function_call: 'auto',
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    const aiMessage = data.choices[0].message;

    // Si OpenAI quiere ejecutar una función
    if (aiMessage.function_call) {
      const functionName = aiMessage.function_call.name;
      const functionArgs = JSON.parse(aiMessage.function_call.arguments);

      let functionResult = null;

      switch (functionName) {
        case 'add_expense':
          const { data: expenseData, error: expenseError } = await supabase
            .from('expenses')
            .insert({
              user_id: userId,
              amount: functionArgs.amount,
              category: functionArgs.category,
              description: functionArgs.description,
              expense_date: functionArgs.expense_date || new Date().toISOString().split('T')[0]
            })
            .select()
            .single();

          if (expenseError) {
            console.error('Error inserting expense:', expenseError);
            throw expenseError;
          }
          functionResult = { success: true, expense: expenseData };
          break;

        case 'add_debt_payment':
          const { data: paymentData, error: paymentError } = await supabase
            .from('debt_payments')
            .insert({
              user_id: userId,
              debt_id: functionArgs.debt_id,
              amount: functionArgs.amount,
              payment_date: functionArgs.payment_date || new Date().toISOString().split('T')[0],
              notes: functionArgs.notes
            })
            .select()
            .single();

          if (paymentError) {
            console.error('Error inserting payment:', paymentError);
            throw paymentError;
          }
          functionResult = { success: true, payment: paymentData };
          break;

        case 'get_expenses_summary':
          let query = supabase.from('expenses').select('*').eq('user_id', userId);
          
          if (functionArgs.period === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query = query.gte('expense_date', weekAgo.toISOString().split('T')[0]);
          } else if (functionArgs.period === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            query = query.gte('expense_date', monthAgo.toISOString().split('T')[0]);
          }

          if (functionArgs.category) {
            query = query.eq('category', functionArgs.category);
          }

          const { data: summaryData, error: summaryError } = await query.order('expense_date', { ascending: false });
          
          if (summaryError) {
            console.error('Error fetching expenses summary:', summaryError);
            throw summaryError;
          }

          const total = summaryData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
          
          functionResult = {
            expenses: summaryData || [],
            total,
            count: summaryData?.length || 0,
            period: functionArgs.period
          };
          break;

        case 'analyze_spending_patterns':
          const { data: allExpenses, error: analysisError } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('expense_date', { ascending: false })
            .limit(50);

          if (analysisError) {
            console.error('Error fetching expenses for analysis:', analysisError);
            throw analysisError;
          }

          const analysis = analyzeSpendingPatterns(allExpenses || [], functionArgs.analysis_type);
          functionResult = analysis;
          break;

        default:
          throw new Error(`Unknown function: ${functionName}`);
      }

      // Segunda llamada a OpenAI con el resultado de la función
      const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
            { role: 'assistant', content: '', function_call: aiMessage.function_call },
            { role: 'function', name: functionName, content: JSON.stringify(functionResult) }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
      });

      const followUpData = await followUpResponse.json();
      
      return new Response(JSON.stringify({
        message: followUpData.choices[0].message.content,
        functionExecuted: functionName,
        functionResult
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Respuesta normal sin función
    return new Response(JSON.stringify({
      message: aiMessage.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: 'Lo siento, hubo un error procesando tu solicitud. Por favor intenta de nuevo.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeSpendingPatterns(expenses: any[], analysisType: string) {
  if (!expenses.length) return { message: 'No hay suficientes datos para analizar' };

  switch (analysisType) {
    case 'trends':
      const last30Days = expenses.filter(e => {
        const expenseDate = new Date(e.expense_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return expenseDate >= thirtyDaysAgo;
      });

      const totalLast30 = last30Days.reduce((sum, e) => sum + e.amount, 0);
      const avgDaily = totalLast30 / 30;

      return {
        totalLast30Days: totalLast30,
        averageDaily: avgDaily,
        expenseCount: last30Days.length,
        trend: last30Days.length > 20 ? 'high_frequency' : 'normal'
      };

    case 'categories':
      const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});

      const sortedCategories = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5);

      return {
        topCategories: sortedCategories,
        totalCategories: Object.keys(categoryTotals).length
      };

    case 'alerts':
      const alerts = [];
      const recentExpenses = expenses.slice(0, 10);
      const highExpenses = recentExpenses.filter(e => e.amount > 1000);
      
      if (highExpenses.length > 2) {
        alerts.push('Has tenido varios gastos altos recientemente');
      }

      const foodExpenses = recentExpenses.filter(e => e.category === 'Comida');
      if (foodExpenses.length > 5) {
        alerts.push('Gastos frecuentes en comida - considera planificar meals');
      }

      return { alerts };

    default:
      return { message: 'Tipo de análisis no reconocido' };
  }
}
