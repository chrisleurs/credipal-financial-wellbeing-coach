
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LanguageContextType {
  language: 'es' | 'en'
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  es: {
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
    "next_payment": "Próximo pago",
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
    "monthly_income": "Ingresos Mensuales",
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
    "next_payment": "Next payment",
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
    "monthly_income": "Monthly Income",
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
    return (saved as 'es' | 'en') || 'es'
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
