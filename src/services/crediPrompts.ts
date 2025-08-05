
// Credi's personality and prompt system
export const CREDI_PERSONALITY = `
Eres "Credi", el asesor financiero personal de Credipal.

PERSONALIDAD CORE:
- Amigable: Como un mejor amigo financiero que genuinamente se preocupa por el bienestar del usuario
- Motivador: Celebras cada pequeño logro y progreso, sin importar cuán pequeño sea
- Inspirador: Conectas las acciones financieras con los sueños y metas personales del usuario
- Comprensivo: Eres empático con los tropiezos, nunca juzgas, siempre ofreces apoyo
- Práctico: Das pasos específicos con fechas exactas, montos precisos y acciones concretas

FILOSOFÍA "ESCALONES ALCANZABLES":
- Crees en pequeños pasos consistentes que construyen momentum
- Prefieres 3 logros pequeños que 1 meta imposible
- Siempre conectas el progreso con las emociones y motivaciones personales

METODOLOGÍA "3-2-1":
- 3 metas corto plazo (1-3 meses): Quick wins que generan momentum y confianza
- 2 metas mediano plazo (3-12 meses): Cambios significativos en hábitos financieros  
- 1 meta largo plazo (12+ meses): Visión inspiracional que conecta con sueños profundos

ESTILO DE COMUNICACIÓN:
- Siempre empezar destacando aspectos positivos de la situación
- Usar lenguaje cálido y alentador, nunca técnico o frío
- Conectar cada recomendación con beneficios emocionales
- Hacer que cada paso se sienta alcanzable y emocionante
`;

export const PLAN_GENERATION_PROMPT = `
${CREDI_PERSONALITY}

ANÁLISIS DE SITUACIÓN:
Ingresos totales: $[TOTAL_INCOME]
Gastos mensuales: $[MONTHLY_EXPENSES]  
Balance disponible: $[MONTHLY_BALANCE]
Ahorros actuales: $[CURRENT_SAVINGS]
Deudas principales: [DEBT_SUMMARY]
Metas personales: [FINANCIAL_GOALS]

TAREA:
Genera un plan financiero personalizado usando la metodología 3-2-1. 

Para CADA meta debes incluir:
- Título inspirador y específico
- Descripción motivacional que conecte con emociones
- Monto exacto y fecha específica  
- 2-3 pasos de acción concretos
- Mensaje de por qué esta meta cambiará su vida

ESTRUCTURA DE RESPUESTA (JSON válido):
{
  "shortTermGoals": [
    {
      "id": "short_1",
      "title": "Título inspirador específico",
      "description": "Por qué esta meta es importante emocionalmente", 
      "targetAmount": 500,
      "deadline": "2025-09-15",
      "currentProgress": 0,
      "actionSteps": [
        "Acción específica 1 con fecha",
        "Acción específica 2 con monto"
      ],
      "emotionalWhy": "Cómo esta meta conecta con sus sueños"
    }
    // Exactamente 3 metas corto plazo
  ],
  "mediumTermGoals": [
    // Exactamente 2 metas mediano plazo con misma estructura
  ],
  "longTermGoals": [
    // Exactamente 1 meta largo plazo con misma estructura  
  ],
  "motivationalMessage": "Mensaje personal inspirador que celebra su potencial y los conecta emocionalmente con su futuro financiero"
}
`;

export const MOTIVATIONAL_MESSAGE_PROMPT = `
${CREDI_PERSONALITY}

CONTEXTO ACTUAL:
Progreso del usuario: [PROGRESS_CONTEXT]
Logros recientes: [RECENT_ACHIEVEMENTS] 
Challenges actuales: [CURRENT_CHALLENGES]
Próximos hitos: [UPCOMING_MILESTONES]

TAREA:
Genera un mensaje motivacional específico para este momento del journey del usuario.

TIPOS DE MENSAJE:
- "celebration": Meta completada o gran progreso
- "encouragement": Usuario necesita apoyo después de un tropiezo  
- "momentum": Progreso consistente, mantener el impulso
- "adaptation": Cambios en circunstancias, necesita ajustes al plan
- "opportunity": Nueva oportunidad detectada para acelerar progreso

El mensaje debe:
- Ser específico a su situación actual
- Conectar con sus emociones y metas personales
- Incluir un paso de acción concreto
- Mantener energía positiva y esperanzadora
- Ser auténtico, no generic

RESPUESTA:
Un párrafo inspirador de 2-3 oraciones que haga sentir al usuario comprendido, celebrado y motivado a continuar.
`;

export const DASHBOARD_INSIGHT_PROMPT = `
${CREDI_PERSONALITY}

DATOS DEL DASHBOARD:
Balance mensual: $[MONTHLY_BALANCE]
Gastos último mes: $[RECENT_EXPENSES]
Progreso en metas: [GOAL_PROGRESS]
Patrones detectados: [SPENDING_PATTERNS]
Oportunidades: [OPPORTUNITIES]

TAREA:
Genera un insight contextual inteligente basado en los datos actuales del dashboard.

El insight debe:
- Identificar el patrón o oportunidad más importante
- Explicar por qué es relevante ahora
- Dar una recomendación específica y actionable
- Mantener tono alentador y práctico
- Incluir beneficio emocional de tomar acción

TIPOS DE INSIGHTS:
- Surplus detection: "Tienes $X extra este mes"
- Spending spike: "Gastos subieron en categoría Y"  
- Goal acceleration: "Puedes alcanzar meta X antes"
- Pattern recognition: "Patrón positivo/negativo detectado"
- Opportunity alert: "Nueva oportunidad para optimizar"

RESPUESTA:
2-3 oraciones que combinen el insight con motivación específica y una acción clara.
`;

export const formatPromptWithData = (
  template: string, 
  userData: any, 
  context?: any
): string => {
  let formattedPrompt = template;
  
  // Replace financial data placeholders
  if (userData) {
    const totalIncome = (userData.monthlyIncome || 0) + (userData.extraIncome || 0);
    const monthlyBalance = totalIncome - (userData.monthlyExpenses || 0);
    
    formattedPrompt = formattedPrompt
      .replace('[TOTAL_INCOME]', totalIncome.toString())
      .replace('[MONTHLY_EXPENSES]', (userData.monthlyExpenses || 0).toString())
      .replace('[MONTHLY_BALANCE]', monthlyBalance.toString())
      .replace('[CURRENT_SAVINGS]', (userData.currentSavings || 0).toString())
      .replace('[DEBT_SUMMARY]', formatDebtSummary(userData.debts || []))
      .replace('[FINANCIAL_GOALS]', (userData.financialGoals || []).join(', '));
  }
  
  // Replace context placeholders
  if (context) {
    Object.keys(context).forEach(key => {
      const placeholder = `[${key.toUpperCase()}]`;
      formattedPrompt = formattedPrompt.replace(placeholder, context[key]?.toString() || '');
    });
  }
  
  return formattedPrompt;
};

const formatDebtSummary = (debts: any[]): string => {
  if (!debts || debts.length === 0) return 'Sin deudas registradas';
  
  return debts.map(debt => 
    `${debt.name}: $${debt.amount} (pago mensual: $${debt.monthlyPayment})`
  ).join(', ');
};

// Validation helpers for OpenAI responses
export const validatePlanResponse = (response: any): boolean => {
  try {
    const required = ['shortTermGoals', 'mediumTermGoals', 'longTermGoals', 'motivationalMessage'];
    const hasRequiredFields = required.every(field => response.hasOwnProperty(field));
    
    if (!hasRequiredFields) return false;
    
    // Validate goal structure
    const validateGoals = (goals: any[], expectedCount: number) => {
      if (!Array.isArray(goals) || goals.length !== expectedCount) return false;
      
      return goals.every(goal => 
        goal.id && goal.title && goal.description && 
        typeof goal.targetAmount === 'number' && 
        goal.deadline && Array.isArray(goal.actionSteps)
      );
    };
    
    return validateGoals(response.shortTermGoals, 3) &&
           validateGoals(response.mediumTermGoals, 2) &&
           validateGoals(response.longTermGoals, 1) &&
           typeof response.motivationalMessage === 'string';
           
  } catch (error) {
    console.error('Error validating plan response:', error);
    return false;
  }
};

// FIXED: Return proper AIGeneratedPlan structure with all required properties
export const createFallbackPlan = (userData: any): any => {
  const totalIncome = (userData.monthlyIncome || 0) + (userData.extraIncome || 0);
  const monthlyBalance = totalIncome - (userData.monthlyExpenses || 0);
  const emergencyTarget = Math.max(userData.monthlyExpenses * 3, 1000);
  const savingsSuggestion = Math.max(monthlyBalance * 0.2, 0);
  
  return {
    shortTermGoals: [
      {
        id: "short_1",
        title: "Crear Fondo de Emergencia Inicial",
        description: "Tener un colchón de seguridad te dará paz mental y confianza financiera",
        targetAmount: Math.min(500, monthlyBalance * 2),
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currentAmount: 0,
        priority: 'high',
        status: 'pending',
        actionSteps: [
          "Abrir una cuenta de ahorros separada esta semana",
          `Transferir automáticamente $${Math.max(50, monthlyBalance * 0.1)} cada quincena`
        ],
        reason: "Dormir tranquilo sabiendo que puedes manejar imprevistos"
      },
      {
        id: "short_2", 
        title: "Optimizar Gastos Variables",
        description: "Pequeños ajustes en gastos diarios pueden liberar dinero para tus sueños",
        targetAmount: userData.monthlyExpenses * 0.1,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currentAmount: 0,
        priority: 'medium',
        status: 'pending',
        actionSteps: [
          "Revisar y cancelar 2 suscripciones que no uses",
          "Cocinar en casa 3 días más por semana"
        ],
        reason: "Cada peso ahorrado es un paso hacia tus metas importantes"
      },
      {
        id: "short_3",
        title: "Establecer Hábito de Seguimiento",
        description: "Conocer tus números te da poder y control sobre tu futuro financiero", 
        targetAmount: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currentAmount: 0,
        priority: 'high',
        status: 'pending',
        actionSteps: [
          "Registrar gastos diarios durante 2 semanas",
          "Revisar progreso cada domingo por 15 minutos"
        ],
        reason: "Ver tu progreso te mantendrá motivado y enfocado"
      }
    ],
    mediumTermGoals: [
      {
        id: "medium_1",
        title: "Fondo de Emergencia Completo", 
        description: "Tener 3-6 meses de gastos te dará libertad total de decisiones",
        targetAmount: emergencyTarget,
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currentAmount: 0,
        priority: 'high',
        status: 'pending',
        actionSteps: [
          `Ahorrar $${Math.max(100, emergencyTarget / 6)} mensualmente`,
          "Destinar bonos y dinero extra directamente al fondo"
        ],
        reason: "Libertad de tomar decisiones sin presión financiera"
      },
      {
        id: "medium_2",
        title: "Optimización de Deudas",
        description: "Reducir deudas te libera dinero para invertir en tus sueños",
        targetAmount: userData.debts?.reduce((sum: number, debt: any) => sum + debt.amount, 0) || 0,
        deadline: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        currentAmount: 0,
        priority: 'medium',
        status: 'pending',
        actionSteps: [
          "Consolidar deudas con tasa más alta",
          "Pagar extra $50-100 mensual a deuda principal"
        ],
        reason: "Cada deuda pagada es más dinero en tu bolsillo cada mes"
      }
    ],
    longTermGoals: [
      {
        id: "long_1",
        title: "Libertad Financiera Personal",
        description: "Crear un futuro donde tu dinero trabaje para ti, no al revés",
        targetAmount: totalIncome * 12,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currentAmount: 0,
        priority: 'high',
        status: 'pending',
        actionSteps: [
          "Aumentar ingresos a través de habilidades o side hustle",
          "Invertir 10-15% de ingresos consistentemente"
        ],
        reason: "Despertar cada día eligiendo qué hacer, no por necesidad económica"
      }
    ],
    recommendations: [
      'Crear un presupuesto 50/30/20 para organizar tus finanzas',
      'Establecer un fondo de emergencia equivalente a 3-6 meses de gastos',
      'Pagar primero las deudas con mayor tasa de interés',
      'Automatizar ahorros para que se transfieran automáticamente',
      'Revisar gastos mensuales para identificar áreas de mejora'
    ],
    monthlyBalance,
    savingsSuggestion,
    budgetBreakdown: {
      fixedExpenses: userData.monthlyExpenses * 0.6,
      variableExpenses: userData.monthlyExpenses * 0.4,
      savings: savingsSuggestion,
      emergency: Math.max(monthlyBalance * 0.1, 0)
    },
    timeEstimate: '3-6 meses para ver resultados significativos con Credi',
    motivationalMessage: "¡Tienes todo lo necesario para transformar tu vida financiera! Cada pequeño paso que tomes hoy te acerca a la libertad y tranquilidad que mereces. Tu futuro yo te agradecerá por empezar ahora.",
    analysis: {
      positives: [
        "Estás dando el primer paso hacia el control financiero",
        "Tienes potencial para crear un balance mensual positivo"
      ],
      concerns: [
        "Es importante establecer hábitos de ahorro consistentes",
        "Revisar gastos variables puede liberar dinero extra"
      ],
      quickWins: [
        "Configurar transferencias automáticas de ahorro",
        "Cancelar suscripciones no utilizadas",
        "Crear un sistema simple de seguimiento de gastos"
      ]
    }
  };
};
