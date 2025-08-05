import type { FinancialData, AIGeneratedPlan, ActionPlan, Goal } from '@/types'
import { supabase } from '@/integrations/supabase/client'
import { 
  PLAN_GENERATION_PROMPT, 
  MOTIVATIONAL_MESSAGE_PROMPT,
  DASHBOARD_INSIGHT_PROMPT,
  formatPromptWithData,
  validatePlanResponse,
  createFallbackPlan
} from './crediPrompts'

// Rate limiting for OpenAI calls
const RATE_LIMIT = {
  maxCalls: 10,
  windowMs: 60000, // 1 minute
  calls: [] as number[]
};

const checkRateLimit = (): boolean => {
  const now = Date.now();
  RATE_LIMIT.calls = RATE_LIMIT.calls.filter(callTime => now - callTime < RATE_LIMIT.windowMs);
  
  if (RATE_LIMIT.calls.length >= RATE_LIMIT.maxCalls) {
    console.warn('Rate limit exceeded for OpenAI calls');
    return false;
  }
  
  RATE_LIMIT.calls.push(now);
  return true;
};

// FIXED: Enhanced createFallbackPlan to return proper AIGeneratedPlan structure
const createFallbackPlan = (data: FinancialData): AIGeneratedPlan => {
  const totalIncome = (data.monthlyIncome || 0) + (data.extraIncome || 0);
  const monthlyBalance = totalIncome - (data.monthlyExpenses || 0);
  const savingsSuggestion = Math.max(monthlyBalance * 0.2, 0);

  const shortTermGoals: Goal[] = [
    {
      id: 'short-1',
      title: 'Crear Fondo de Emergencia Básico',
      description: 'Ahorrar $500 para imprevistos menores',
      targetAmount: 500,
      currentAmount: 0,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      status: 'pending',
      actionSteps: [
        'Abrir cuenta de ahorros separada',
        'Programar transferencia automática de $50 semanal'
      ]
    },
    {
      id: 'short-2',
      title: 'Optimizar Gastos Variables',
      description: 'Reducir gastos no esenciales en $200/mes',
      targetAmount: 200,
      currentAmount: 0,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      status: 'pending',
      actionSteps: [
        'Revisar suscripciones y cancelar las no usadas',
        'Buscar alternativas más económicas para servicios'
      ]
    }
  ];

  const mediumTermGoals: Goal[] = [
    {
      id: 'medium-1',
      title: 'Fondo de Emergencia Completo',
      description: 'Ahorrar 3 meses de gastos para emergencias',
      targetAmount: data.monthlyExpenses * 3,
      currentAmount: 0,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      status: 'pending',
      actionSteps: [
        'Aumentar ahorro mensual gradualmente',
        'Destinar bonos extra al fondo de emergencia'
      ]
    }
  ];

  const longTermGoals: Goal[] = [
    {
      id: 'long-1',
      title: 'Independencia Financiera Inicial',
      description: 'Ahorrar equivalente a 6 meses de gastos',
      targetAmount: data.monthlyExpenses * 6,
      currentAmount: 0,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      status: 'pending',
      actionSteps: [
        'Mantener disciplina de ahorro consistente',
        'Considerar inversiones de bajo riesgo'
      ]
    }
  ];

  return {
    shortTermGoals,
    mediumTermGoals,
    longTermGoals,
    recommendations: [
      'Crear un presupuesto 50/30/20 para organizar tus finanzas',
      'Establecer transferencias automáticas para ahorros',
      'Revisar y optimizar gastos mensuales',
      'Construir hábitos financieros saludables paso a paso'
    ],
    monthlyBalance,
    savingsSuggestion,
    budgetBreakdown: {
      fixedExpenses: data.monthlyExpenses * 0.6,
      variableExpenses: data.monthlyExpenses * 0.4,
      savings: savingsSuggestion,
      emergency: Math.max(monthlyBalance * 0.1, 0)
    },
    timeEstimate: '3-6 meses para ver resultados significativos con Credi',
    motivationalMessage: '¡Estás dando el primer paso hacia tu libertad financiera! Con pequeños cambios consistentes, verás grandes transformaciones en tu vida. Credi está aquí para guiarte en cada paso del camino.'
  };
};

// Enhanced OpenAI service implementation using Supabase edge functions with Credi personality
export async function generateFinancialPlan(data: FinancialData): Promise<AIGeneratedPlan> {
  console.log('🤖 Credi generando plan financiero personalizado:', data)
  
  // Check rate limiting
  if (!checkRateLimit()) {
    console.log('Rate limit hit, using fallback plan');
    return createFallbackPlan(data);
  }
  
  try {
    const prompt = formatPromptWithData(PLAN_GENERATION_PROMPT, data);
    
    const { data: result, error } = await supabase.functions.invoke('generate-financial-plan', {
      body: { 
        financialData: data,
        crediPrompt: prompt,
        useCrediPersonality: true
      }
    })

    if (error) {
      console.error('Error calling Credi OpenAI function:', error)
      console.log('Falling back to Credi default plan');
      return createFallbackPlan(data);
    }

    // Validate and map OpenAI response to AIGeneratedPlan
    if (result && validatePlanResponse(result)) {
      console.log('✅ Valid Credi plan generated');
      return mapPlanResponseToAIGeneratedPlan(result, data);
    } else {
      console.warn('Invalid OpenAI response, using Credi fallback');
      return createFallbackPlan(data);
    }

  } catch (error) {
    console.error('Error generating Credi financial plan:', error)
    console.log('Using Credi fallback plan due to error');
    return createFallbackPlan(data);
  }
}

// FIXED: Map the structured plan response to proper AIGeneratedPlan format
const mapPlanResponseToAIGeneratedPlan = (planResponse: any, userData: FinancialData): AIGeneratedPlan => {
  const totalIncome = (userData.monthlyIncome || 0) + (userData.extraIncome || 0);
  const monthlyBalance = totalIncome - (userData.monthlyExpenses || 0);
  
  // Map goals from OpenAI response or use fallback
  const shortTermGoals: Goal[] = (planResponse.shortTermGoals || []).map((goal: any, index: number) => ({
    id: goal.id || `short-${index}`,
    title: goal.title || `Meta a corto plazo ${index + 1}`,
    description: goal.description || '',
    targetAmount: goal.targetAmount || 500,
    currentAmount: goal.currentAmount || 0,
    deadline: goal.deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    priority: goal.priority || 'medium',
    status: goal.status || 'pending',
    actionSteps: goal.actionSteps || []
  }));

  const mediumTermGoals: Goal[] = (planResponse.mediumTermGoals || []).map((goal: any, index: number) => ({
    id: goal.id || `medium-${index}`,
    title: goal.title || `Meta a mediano plazo ${index + 1}`,
    description: goal.description || '',
    targetAmount: goal.targetAmount || userData.monthlyExpenses * 3,
    currentAmount: goal.currentAmount || 0,
    deadline: goal.deadline || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    priority: goal.priority || 'medium',
    status: goal.status || 'pending',
    actionSteps: goal.actionSteps || []
  }));

  const longTermGoals: Goal[] = (planResponse.longTermGoals || []).map((goal: any, index: number) => ({
    id: goal.id || `long-${index}`,
    title: goal.title || `Meta a largo plazo ${index + 1}`,
    description: goal.description || '',
    targetAmount: goal.targetAmount || userData.monthlyExpenses * 6,
    currentAmount: goal.currentAmount || 0,
    deadline: goal.deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    priority: goal.priority || 'medium',
    status: goal.status || 'pending',
    actionSteps: goal.actionSteps || []
  }));

  return {
    shortTermGoals,
    mediumTermGoals,
    longTermGoals,
    recommendations: planResponse.recommendations || [
      'Crear un presupuesto 50/30/20 para organizar tus finanzas',
      'Establecer un fondo de emergencia equivalente a 3 meses de gastos',
      'Optimizar gastos variables para liberar dinero extra',
      'Automatizar ahorros para construir disciplina financiera'
    ],
    monthlyBalance,
    savingsSuggestion: Math.max(monthlyBalance * 0.2, 0),
    budgetBreakdown: planResponse.budgetBreakdown || {
      fixedExpenses: userData.monthlyExpenses * 0.6,
      variableExpenses: userData.monthlyExpenses * 0.4,
      savings: Math.max(monthlyBalance * 0.2, 0),
      emergency: Math.max(monthlyBalance * 0.1, 0)
    },
    timeEstimate: planResponse.timeEstimate || '3-6 meses para ver resultados significativos con Credi',
    motivationalMessage: planResponse.motivationalMessage || 
      '¡Estás dando el primer paso hacia tu libertad financiera! Con pequeños cambios consistentes, verás grandes transformaciones en tu vida.'
  };
};

export async function generateActionPlan(data: FinancialData): Promise<ActionPlan> {
  console.log('📋 Credi generando plan de acción personalizado:', data)
  
  if (!checkRateLimit()) {
    return createFallbackActionPlan(data);
  }
  
  try {
    const { data: result, error } = await supabase.functions.invoke('generate-action-plan', {
      body: { 
        financialPlan: await generateFinancialPlan(data),
        userData: data,
        crediPersonality: true
      }
    })

    if (error) {
      console.error('Error calling Credi action plan function:', error)
      return createFallbackActionPlan(data);
    }

    return {
      tasks: result.tasks || createFallbackTasks(data),
      nextReviewDate: result.nextReviewDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      whatsappReminders: data.whatsappOptin
    }
  } catch (error) {
    console.error('Error generating Credi action plan:', error)
    return createFallbackActionPlan(data);
  }
}

// Enhanced interfaces for real-time assistance
export interface ChatAIResponse {
  message: string;
  functionExecuted?: string;
  functionResult?: any;
  suggestions?: string[];
  crediPersonality?: boolean;
}

export interface FinancialInsight {
  type: 'alert' | 'celebration' | 'suggestion' | 'trend';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  crediMessage?: string;
}

// Generate motivational messages with Credi personality
export async function generateMotivationalMessage(
  context: string, 
  progressData?: any
): Promise<string> {
  console.log('💪 Credi generando mensaje motivacional');
  
  if (!checkRateLimit()) {
    return getFallbackMotivationalMessage(context);
  }

  try {
    const prompt = formatPromptWithData(MOTIVATIONAL_MESSAGE_PROMPT, null, {
      progress_context: context,
      recent_achievements: progressData?.achievements || 'Usuario está empezando su journey',
      current_challenges: progressData?.challenges || 'Estableciendo nuevos hábitos',
      upcoming_milestones: progressData?.milestones || 'Primeras metas a corto plazo'
    });

    const { data: result, error } = await supabase.functions.invoke('generate-motivational-message', {
      body: { 
        prompt,
        context,
        crediPersonality: true
      }
    });

    if (error) {
      console.error('Error generating Credi motivational message:', error);
      return getFallbackMotivationalMessage(context);
    }

    return result.message || getFallbackMotivationalMessage(context);
  } catch (error) {
    console.error('Error in Credi motivational message generation:', error);
    return getFallbackMotivationalMessage(context);
  }
}

// Generate dashboard insights with Credi personality
export async function generateQuickInsight(dashboardData: any): Promise<FinancialInsight> {
  console.log('💡 Credi generando insight del dashboard');
  
  if (!checkRateLimit()) {
    return getFallbackInsight(dashboardData);
  }

  try {
    const prompt = formatPromptWithData(DASHBOARD_INSIGHT_PROMPT, null, {
      monthly_balance: dashboardData.monthlyBalance,
      recent_expenses: dashboardData.totalExpenses,
      goal_progress: dashboardData.goalProgress || 'Iniciando',
      spending_patterns: dashboardData.spendingPatterns || 'Analizando patrones',
      opportunities: dashboardData.opportunities || 'Identificando oportunidades'
    });

    const { data: result, error } = await supabase.functions.invoke('generate-dashboard-insight', {
      body: { 
        prompt,
        dashboardData,
        crediPersonality: true
      }
    });

    if (error) {
      console.error('Error generating Credi dashboard insight:', error);
      return getFallbackInsight(dashboardData);
    }

    return {
      type: result.type || 'suggestion',
      title: result.title || 'Insight de Credi',
      message: result.message || 'Continúa con el gran trabajo que estás haciendo',
      priority: result.priority || 'medium',
      actionable: result.actionable !== false,
      crediMessage: result.crediMessage || result.message
    };
  } catch (error) {
    console.error('Error in Credi insight generation:', error);
    return getFallbackInsight(dashboardData);
  }
}

// Function to save generated plan to Supabase - FIXED TYPE COMPATIBILITY
export async function saveFinancialPlan(plan: AIGeneratedPlan, userId: string): Promise<void> {
  // Convert AIGeneratedPlan to JSON-compatible format for Supabase
  const planData = {
    budgetBreakdown: plan.budgetBreakdown,
    timeEstimate: plan.timeEstimate,
    motivationalMessage: plan.motivationalMessage,
    crediGenerated: true,
    version: '2.0'
  }

  const { error } = await supabase
    .from('financial_plans')
    .upsert({
      user_id: userId,
      plan_data: planData, // JSON-compatible object
      recommendations: plan.recommendations, // Array of strings is JSON-compatible
      monthly_balance: plan.monthlyBalance,
      savings_suggestion: plan.savingsSuggestion,
      status: 'active',
      plan_type: 'credi_ai_generated'
    })

  if (error) {
    throw new Error(`Failed to save Credi plan: ${error.message}`)
  }

  console.log('✅ Credi plan saved successfully to Supabase');
}

// Fallback functions for when OpenAI is unavailable
const createFallbackActionPlan = (data: FinancialData): ActionPlan => {
  return {
    tasks: createFallbackTasks(data),
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    whatsappReminders: data.whatsappOptin
  };
};

const createFallbackTasks = (data: FinancialData) => {
  const monthlyBalance = (data.monthlyIncome + data.extraIncome) - data.monthlyExpenses;
  const savingsAmount = Math.max(monthlyBalance * 0.2, 50);

  return [
    {
      id: '1',
      title: 'Configurar Ahorro Automático',
      description: `Programa una transferencia automática de $${savingsAmount} cada quincena a tu cuenta de ahorros`,
      priority: 'high' as const,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    },
    {
      id: '2', 
      title: 'Revisar Gastos Variables',
      description: 'Identifica 2-3 gastos que puedas reducir o eliminar este mes',
      priority: 'medium' as const,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    }
  ];
};

const getFallbackMotivationalMessage = (context: string): string => {
  const messages = [
    '¡Cada pequeño paso cuenta! Tu disciplina de hoy construye la libertad financiera de mañana.',
    'Estás haciendo exactamente lo correcto. Los hábitos que builds ahora cambiarán tu vida para siempre.',
    '¡Tu progreso es inspirador! Recuerda: no se trata de la perfección, sino de la consistencia.',
    'Celebro cada decisión inteligente que tomas. Tu futuro yo te está agradeciendo ahora mismo.',
    '¡Sigue así! Cada peso ahorrado es un voto de confianza en tu futuro más próspero.'
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

const getFallbackInsight = (dashboardData: any): FinancialInsight => {
  const insights = [
    {
      type: 'suggestion' as const,
      title: 'Oportunidad de Ahorro',
      message: 'Tu balance positivo este mes es una oportunidad perfecta para acelerar tus metas de ahorro.',
      priority: 'medium' as const,
      actionable: true
    },
    {
      type: 'celebration' as const, 
      title: '¡Gran Trabajo!',
      message: 'Mantener tus gastos controlados muestra tu compromiso con tus metas financieras.',
      priority: 'high' as const,
      actionable: false
    },
    {
      type: 'trend' as const,
      title: 'Patrón Positivo',
      message: 'Tu consistencia en el control de gastos está construyendo hábitos financieros saludables.',
      priority: 'medium' as const,
      actionable: true
    }
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
};
