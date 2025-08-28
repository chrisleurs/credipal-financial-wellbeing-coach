import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LanguageContextType {
  language: 'es' | 'en'
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  es: {
    // Hero
    "hero_title": "Tu Coach de Bienestar Financiero Personal",
    "hero_subtitle": "Te acompañamos en cada paso hacia tu libertad financiera con seguimiento inteligente, motivación constante y estrategias personalizadas. No solo administramos tu dinero, te acompañamos en tu crecimiento financiero.",
    "hero_cta_primary": "Comenzar Mi Transformación Financiera",
    "hero_cta_secondary": "Conocer Más",
    "hero_stat_coach": "Coach Personal",
    "hero_stat_personalized": "Personalizado", 
    "hero_stat_motivation": "Motivación Constante",

    // What is Credipal
    "what_is_title": "¿Qué es Credipal?",
    "what_is_description": "Credipal es más que una aplicación financiera - es tu compañero personal en el viaje hacia la libertad económica. Combinamos inteligencia artificial con coaching humano para transformar la ansiedad financiera en confianza y control sobre tu futuro.",

    // Benefits
    "benefits_title": "¿Por qué elegir Credipal como tu coach financiero?",
    "benefits_subtitle": "El primer asistente financiero que actúa como tu coach personal, motivándote día a día hacia tus metas económicas.",
    "benefit_1_title": "Coach Personal 24/7",
    "benefit_1_desc": "Tu asistente inteligente que nunca duerme, siempre disponible para guiarte hacia tus metas financieras.",
    "benefit_2_title": "Seguimiento Inteligente", 
    "benefit_2_desc": "Monitorea automáticamente tu progreso y te alerta sobre oportunidades de mejora en tiempo real.",
    "benefit_3_title": "Motivación Constante",
    "benefit_3_desc": "Te impulsa día a día con recordatorios personalizados y celebra cada logro contigo.",
    "benefit_4_title": "Estrategias Personalizadas",
    "benefit_4_desc": "Planes financieros únicos adaptados a tu situación, objetivos y estilo de vida.",

    // How it helps
    "how_helps_title": "Cómo te ayuda Credipal",
    "how_helps_subtitle": "Nuestro enfoque integral te acompaña desde la planificación hasta el logro de tu libertad financiera, paso a paso.",

    // Testimonials  
    "testimonials_title": "Historias de transformación",
    "testimonials_subtitle": "Miles de personas han transformado su bienestar financiero con Credipal. Estas son algunas de sus historias.",

    // CTA
    "cta_title": "Comienza tu transformación financiera hoy",
    "cta_subtitle": "Únete a miles de personas que ya han tomado control de su bienestar financiero con Credipal. Tu coach personal te está esperando.",
    "cta_button": "Comenzar Ahora - Es Gratis",

    // Contact
    "contact_title": "¿Tienes preguntas sobre tu bienestar financiero?",
    "contact_subtitle": "Nuestro equipo está aquí para ayudarte. Contáctanos y comienza tu transformación.",

    // Onboarding
    "welcome_title": "¡Bienvenido a Credipal!",
    "welcome_subtitle": "Tu asistente financiero personal",
    "create_account": "Crear cuenta",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "confirm_password": "Confirmar contraseña",
    "congratulations": "¡Felicidades!",
    "loan_registered": "Tu préstamo Kueski ya está registrado. Ahora vamos a configurar tus ingresos.",
    "continue": "Continuar",
    "back": "Atrás",
    "step": "Paso",
    "of": "de",
    "income_title": "¡Bienvenido a Credipal!",
    "kueski_loan_registered": "✅ Préstamo Kueski Registrado",
    "kueski_loan_description": "ya está siendo administrado por Credipal.",
    "biweekly_payment": "Pago quincenal",
    "monthly_income": "Ingreso Principal",
    "monthly_income_question": "¿Cuál es tu ingreso mensual principal? (USD)",
    "monthly_income_help": "Incluye salario, freelance, negocio, etc.",
    "additional_income": "Ingresos Adicionales",
    "additional_income_question": "Ingresos extras o variables (USD)",
    "additional_income_help": "Trabajos de medio tiempo, comisiones, rentas, etc.",
    "optional": "Opcional",
    "total_monthly_income": "Total de ingresos mensuales",
    
    // Dashboard
    "dashboard": "Panel Financiero",
    "financial_management": "Gestiona tus finanzas de manera inteligente",
    "financial_dashboard": "Dashboard Financiero",
    "comprehensive_summary": "Resumen completo de tu situación financiera",
    "active_debt": "Deuda Activa",
    "next_payment": "Próximo pago",
    "suggested_goal": "Meta Sugerida",
    "emergency_fund": "Fondo de emergencia",
    "cards": "Tarjetas",
    "goals": "Metas",
    "loans": "Préstamos",
    "reports": "Reportes",
    "education": "Educación",
    "profile": "Perfil",
    "settings": "Configuración",
    "monthly_expenses": "Gastos del Mes",
    "active_debts": "Deudas Activas",
    "available_balance": "Balance Disponible",
    "total_income": "Ingresos Totales",
    "monthly_expenses_short": "Gastos Mensuales",
    "current_savings": "Ahorros Actuales",
    "monthly_balance": "Balance Mensual",
    "kueski_loan_active": "¡Tu préstamo Kueski está activo!",
    "kueski_loan_managed": "Ahora Credipal administra tu préstamo de",
    "total_amount": "Monto Total",
    "remaining_payments": "Pagos Restantes",
    "active_loans": "Préstamos Activos",
    "loading_financial_info": "Cargando tu información financiera...",
    "bienestar_financiero": "Bienestar Financiero",

    // UI Elements
    "delete": "Eliminar",
    "cancel": "Cancelar", 
    "add": "Agregar",
    "save": "Guardar",
    "edit": "Editar",
    "close": "Cerrar",
    "confirm": "Confirmar",
    "processing": "Procesando...",
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito",
    "warning": "Advertencia",
    "info": "Información",

    // Expense Management
    "register_income": "Registrar Ingreso",
    "register_expense": "Registrar Gasto", 
    "register_saving": "Registrar Ahorro",
    "delete_expense": "¿Eliminar gasto?",
    "delete_expense_confirm": "¿Estás seguro de que quieres eliminar el gasto \"{description}\"? Esta acción no se puede deshacer.",
    "this_month": "Este mes",
    "average": "Promedio",
    "movements": "Movimientos",
    "what_to_register": "¿Qué quieres registrar?",

    // Coach Messages
    "coach_expense_saved": "Listo, ¡movimiento guardado! 🚀",
    "coach_income_added": "¡Ingreso registrado! 💰 Lo verás en Programados",
    "coach_saving_progress": "Tu ahorro empuja tu meta un +{progress}% 🎯",
    "coach_debt_reduction": "¡Gran pago! Reduces tu deuda total en {reduction}% 💪",
    "coach_subscription_created": "Suscripción creada. Te avisamos 2 días antes ⏰",

    // Categories
    "category_food": "Comida",
    "category_transport": "Transporte", 
    "category_entertainment": "Entretenimiento",
    "category_health": "Salud",
    "category_shopping": "Compras",
    "category_bills": "Servicios",
    "category_other": "Otros",
    "add_category": "Agregar Categoría",
    "new_category": "Nueva Categoría",
    "category_name": "Nombre de la categoría",
    "category_created": "¡Categoría creada con éxito!",

    // Financial Goals
    "financial_goals": "Metas Financieras",
    "my_financial_goals": "Mis Metas Financieras",
    "goal_summary": "Resumen de Metas",
    "completed_goals": "Completadas",
    "in_progress_goals": "En Progreso",
    "active_goals": "Metas Activas",
    "goals_completed": "Metas Completadas",
    "progress": "Progreso",
    "current": "Actual",
    "target": "Meta",
    "remaining": "Restante",
    "goal_completed": "¡Meta completada! 🎉",
    "from_onboarding": "Del onboarding",
    "from_system": "Sistema",
    "define_financial_goals": "Define tus metas financieras",
    "clear_objectives": "Establece objetivos claros para alcanzar la libertad financiera",
    "short_term_goals": "Metas de Corto Plazo",
    "weekly_goals": "Metas Semanales",
    "monthly_goals": "Metas Mensuales",
    "weekly_monthly_objectives": "Objetivos semanales y mensuales para mantener el impulso",
    "add_weekly_goal": "Agregar meta semanal",
    "add_monthly_goal": "Agregar meta mensual",
    "add_goal": "Agregar Meta",
    "mark_completed": "Marcar como completada",
    "success_rate": "Tasa de éxito",
    "points_earned": "Puntos ganados",
    "big_goals": "Metas Principales",
    "main_goals": "Metas Principales",
    "no_goals_defined": "No tienes metas definidas",
    "generate_financial_plan": "Genera tu plan financiero para establecer metas personalizadas",
    "main_goal_timeline": "Meta:",
    "create_first_goal": "Crea tu primera meta financiera para comenzar a planificar tu futuro",
    "create_goal": "Crear Meta",
    "add_new_goal": "Agregar Nueva Meta",
    "goal_title": "Título de la Meta",
    "goal_title_placeholder": "ej. Fondo de emergencia, Casa nueva, Vacaciones",
    "description": "Descripción",
    "optional_description": "Descripción opcional de tu meta",
    "target_amount": "Monto Objetivo",
    "current_amount": "Monto Actual",
    "deadline": "Fecha Límite",
    "priority": "Prioridad",
    "high": "Alta",
    "medium": "Media",
    "low": "Baja",
    "active": "Activa",
    "completed": "Completada",
    "paused": "Pausada",
    "creating": "Creando...",
    "create_goal_action": "Crear Meta",
    "loading_goals": "Cargando metas...",
    "no_goals_yet": "No hay metas definidas",
    "goal_progress_percent": "{percent}% completado",
    "missing_amount": "Faltan {amount}",

    // Kueski Debt Screen
    "kueski_debt_detected": "Deuda Detectada",
    "kueski_debt_subtitle": "Hemos identificado tu préstamo activo con KueskiPay",
    "kueski_debt_alert": "Incluiremos esta deuda en tu plan financiero personalizado",
    "kueski_active": "Activa",
    "kueski_short_term_loan": "Préstamo personal a corto plazo",
    "frequency": "Frecuencia",
    "every_x_days": "Cada {days} días",
    "payment_progress": "Progreso de pago",
    "completed_payments": "{completed} de {total} completados",
    "whats_next": "¿Qué sigue?",
    "credipal_plan_description": "CrediPal creará un plan financiero personalizado que incluye esta deuda, ayudándote a pagarla de manera eficiente junto con tus otros gastos.",
    "continue_with_plan": "Continuar con mi Plan",
    "plan_info_usage": "Esta información se usará para crear tu plan financiero personalizado"
  },
  en: {
    // Hero
    "hero_title": "Your Personal Financial Wellness Coach",
    "hero_subtitle": "We accompany you every step towards your financial freedom with intelligent tracking, constant motivation, and personalized strategies. We don't just manage your money, we accompany you in your financial growth.",
    "hero_cta_primary": "Start My Financial Transformation",
    "hero_cta_secondary": "Learn More",
    "hero_stat_coach": "Personal Coach",
    "hero_stat_personalized": "Personalized",
    "hero_stat_motivation": "Constant Motivation",

    // What is Credipal
    "what_is_title": "What is Credipal?",
    "what_is_description": "Credipal is more than a financial application - it's your personal companion on the journey towards economic freedom. We combine artificial intelligence with human coaching to transform financial anxiety into confidence and control over your future.",

    // Benefits
    "benefits_title": "Why choose Credipal as your financial coach?",
    "benefits_subtitle": "The first financial assistant that acts as your personal coach, motivating you daily towards your economic goals.",
    "benefit_1_title": "24/7 Personal Coach",
    "benefit_1_desc": "Your intelligent assistant that never sleeps, always available to guide you towards your financial goals.",
    "benefit_2_title": "Intelligent Tracking",
    "benefit_2_desc": "Automatically monitors your progress and alerts you about real-time improvement opportunities.",
    "benefit_3_title": "Constant Motivation",
    "benefit_3_desc": "Drives you daily with personalized reminders and celebrates every achievement with you.",
    "benefit_4_title": "Personalized Strategies",
    "benefit_4_desc": "Unique financial plans adapted to your situation, objectives, and lifestyle.",

    // How it helps
    "how_helps_title": "How Credipal helps you",
    "how_helps_subtitle": "Our comprehensive approach accompanies you from planning to achieving your financial freedom, step by step.",

    // Testimonials
    "testimonials_title": "Transformation stories",
    "testimonials_subtitle": "Thousands of people have transformed their financial wellness with Credipal. These are some of their stories.",

    // CTA
    "cta_title": "Start your financial transformation today",
    "cta_subtitle": "Join thousands of people who have already taken control of their financial wellness with Credipal. Your personal coach is waiting for you.",
    "cta_button": "Start Now - It's Free",

    // Contact
    "contact_title": "Do you have questions about your financial wellness?",
    "contact_subtitle": "Our team is here to help you. Contact us and start your transformation.",

    // Onboarding
    "welcome_title": "Welcome to Credipal!",
    "welcome_subtitle": "Your personal financial assistant",
    "create_account": "Create account",
    "email": "Email",
    "password": "Password",
    "confirm_password": "Confirm password",
    "congratulations": "Congratulations!",
    "loan_registered": "Your Kueski loan is already registered. Now let's set up your income.",
    "continue": "Continue",
    "back": "Back",
    "step": "Step",
    "of": "of",
    "income_title": "Welcome to Credipal!",
    "kueski_loan_registered": "✅ Kueski Loan Registered",
    "kueski_loan_description": "is now being managed by Credipal.",
    "biweekly_payment": "Biweekly payment",
    "monthly_income": "Primary Income",
    "monthly_income_question": "What is your monthly primary income? (USD)",
    "monthly_income_help": "Include salary, freelance, business, etc.",
    "additional_income": "Additional Income",
    "additional_income_question": "Extra or variable income (USD)",
    "additional_income_help": "Part-time jobs, commissions, rent, etc.",
    "optional": "Optional",
    "total_monthly_income": "Total monthly income",
    
    // Dashboard
    "dashboard": "Financial Dashboard",
    "financial_management": "Manage your finances intelligently",
    "financial_dashboard": "Financial Dashboard",
    "comprehensive_summary": "Complete overview of your financial situation",
    "active_debt": "Active Debt",
    "next_payment": "Next payment",
    "suggested_goal": "Suggested Goal",
    "emergency_fund": "Emergency fund",
    "cards": "Cards",
    "goals": "Goals",
    "loans": "Loans",
    "reports": "Reports",
    "education": "Education",
    "profile": "Profile",
    "settings": "Settings",
    "monthly_expenses": "Monthly Expenses",
    "active_debts": "Active Debts",
    "available_balance": "Available Balance",
    "total_income": "Total Income",
    "monthly_expenses_short": "Monthly Expenses",
    "current_savings": "Current Savings",
    "monthly_balance": "Monthly Balance",
    "kueski_loan_active": "Your Kueski loan is active!",
    "kueski_loan_managed": "Credipal now manages your loan of",
    "total_amount": "Total Amount",
    "remaining_payments": "Remaining Payments",
    "active_loans": "Active Loans",
    "loading_financial_info": "Loading your financial information...",
    "bienestar_financiero": "Financial Wellness",

    // UI Elements
    "delete": "Delete",
    "cancel": "Cancel",
    "add": "Add",
    "save": "Save", 
    "edit": "Edit",
    "close": "Close",
    "confirm": "Confirm",
    "processing": "Processing...",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "warning": "Warning",
    "info": "Information",

    // Expense Management
    "register_income": "Add Income",
    "register_expense": "Add Expense",
    "register_saving": "Add Saving",
    "delete_expense": "Delete expense?",
    "delete_expense_confirm": "Are you sure you want to delete the expense \"{description}\"? This action cannot be undone.",
    "this_month": "This month",
    "average": "Average",
    "movements": "Movements",
    "what_to_register": "What would you like to register?",

    // Coach Messages
    "coach_expense_saved": "Done, movement saved! 🚀",
    "coach_income_added": "Income registered! 💰 You'll see it in Scheduled",
    "coach_saving_progress": "Your saving pushes your goal +{progress}% 🎯",
    "coach_debt_reduction": "Great payment! You reduce your total debt by {reduction}% 💪",
    "coach_subscription_created": "Subscription created. We'll remind you 2 days before ⏰",

    // Categories
    "category_food": "Food",
    "category_transport": "Transportation",
    "category_entertainment": "Entertainment", 
    "category_health": "Health",
    "category_shopping": "Shopping",
    "category_bills": "Bills",
    "category_other": "Other",
    "add_category": "Add Category",
    "new_category": "New Category",
    "category_name": "Category name",
    "category_created": "Category created successfully!",

    // Financial Goals
    "financial_goals": "Financial Goals",
    "my_financial_goals": "My Financial Goals",
    "goal_summary": "Goal Summary",
    "completed_goals": "Completed",
    "in_progress_goals": "In Progress",
    "active_goals": "Active Goals",
    "goals_completed": "Goals Completed",
    "progress": "Progress",
    "current": "Current",
    "target": "Target",
    "remaining": "Remaining",
    "goal_completed": "Goal completed! 🎉",
    "from_onboarding": "From onboarding",
    "from_system": "System",
    "define_financial_goals": "Define your financial goals",
    "clear_objectives": "Set clear objectives to achieve financial freedom",
    "short_term_goals": "Short-Term Goals",
    "weekly_goals": "Weekly Goals",
    "monthly_goals": "Monthly Goals",
    "weekly_monthly_objectives": "Weekly and monthly objectives to keep momentum",
    "add_weekly_goal": "Add weekly goal",
    "add_monthly_goal": "Add monthly goal",
    "add_goal": "Add Goal",
    "mark_completed": "Mark as completed",
    "success_rate": "Success Rate",
    "points_earned": "Points Earned",
    "big_goals": "Main Goals",
    "main_goals": "Main Goals",
    "no_goals_defined": "You have no goals defined",
    "generate_financial_plan": "Generate your financial plan to set personalized goals",
    "main_goal_timeline": "Goal:",
    "create_first_goal": "Create your first financial goal to start planning your future",
    "create_goal": "Create Goal",
    "add_new_goal": "Add New Goal",
    "goal_title": "Goal Title",
    "goal_title_placeholder": "e.g. Emergency fund, New house, Vacation",
    "description": "Description",
    "optional_description": "Optional description of your goal",
    "target_amount": "Target Amount",
    "current_amount": "Current Amount",
    "deadline": "Deadline",
    "priority": "Priority",
    "high": "High",
    "medium": "Medium",
    "low": "Low",
    "active": "Active",
    "completed": "Completed",
    "paused": "Paused",
    "creating": "Creating...",
    "create_goal_action": "Create Goal",
    "loading_goals": "Loading goals...",
    "no_goals_yet": "No goals defined yet",
    "goal_progress_percent": "{percent}% completed",
    "missing_amount": "Missing {amount}",

    // Kueski Debt Screen
    "kueski_debt_detected": "Debt Detected",
    "kueski_debt_subtitle": "We have identified your active loan with KueskiPay",
    "kueski_debt_alert": "We will include this debt in your personalized financial plan",
    "kueski_active": "Active",
    "kueski_short_term_loan": "Short-term personal loan",
    "frequency": "Frequency",
    "every_x_days": "Every {days} days",
    "payment_progress": "Payment progress",
    "completed_payments": "{completed} of {total} completed",
    "whats_next": "What's next?",
    "credipal_plan_description": "CrediPal will create a personalized financial plan that includes this debt, helping you pay it off efficiently alongside your other expenses.",
    "continue_with_plan": "Continue with my Plan",
    "plan_info_usage": "This information will be used to create your personalized financial plan"
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'es' | 'en'>(() => {
    // Force English as default and clear any existing Spanish preference
    localStorage.removeItem('credipal_language')
    localStorage.setItem('credipal_language', 'en')
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('credipal_language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es')
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
