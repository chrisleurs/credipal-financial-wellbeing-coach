
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
    "bienestar_financiero": "Bienestar Financiero"
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
    "dashboard": "Financial Panel",
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
    "bienestar_financiero": "Financial Wellness"
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'es' | 'en'>(() => {
    const saved = localStorage.getItem('credipal_language')
    return (saved as 'es' | 'en') || 'en' // English is default
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
