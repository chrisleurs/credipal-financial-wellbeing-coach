export const EXPENSE_CATEGORIES = [
  { value: 'housing', label: 'Vivienda', icon: '🏠' },
  { value: 'food', label: 'Alimentación', icon: '🍽️' },
  { value: 'transport', label: 'Transporte', icon: '🚗' },
  { value: 'entertainment', label: 'Entretenimiento', icon: '🎬' },
  { value: 'healthcare', label: 'Salud', icon: '⚕️' },
  { value: 'education', label: 'Educación', icon: '📚' },
  { value: 'clothing', label: 'Ropa', icon: '👕' },
  { value: 'utilities', label: 'Servicios', icon: '💡' },
  { value: 'other', label: 'Otros', icon: '📦' }
];

export const GOAL_TYPES = [
  { value: 'emergency_fund', label: 'Fondo de Emergencia', icon: '🛡️' },
  { value: 'vacation', label: 'Vacaciones', icon: '🏖️' },
  { value: 'house', label: 'Casa/Apartamento', icon: '🏠' },
  { value: 'car', label: 'Vehículo', icon: '🚗' },
  { value: 'education', label: 'Educación', icon: '🎓' },
  { value: 'business', label: 'Negocio', icon: '💼' },
  { value: 'retirement', label: 'Retiro', icon: '🏖️' },
  { value: 'investment', label: 'Inversión', icon: '📈' },
  { value: 'debt_payment', label: 'Pago de Deudas', icon: '💳' },
  { value: 'other', label: 'Otro', icon: '🎯' }
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Baja', color: 'text-green-600' },
  { value: 'medium', label: 'Media', color: 'text-yellow-600' },
  { value: 'high', label: 'Alta', color: 'text-red-600' }
];

export const WHATSAPP_FREQUENCIES = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' }
];

export const ONBOARDING_STEPS = [
  { id: 1, title: 'Ingresos', description: 'Ingresos mensuales' },
  { id: 2, title: 'Gastos', description: 'Gastos categorizados' },
  { id: 3, title: 'Deudas', description: 'Deudas actuales' },
  { id: 4, title: 'Ahorros', description: 'Situación de ahorros' },
  { id: 5, title: 'Metas', description: 'Objetivos financieros' },
  { id: 6, title: 'WhatsApp', description: 'Notificaciones' },
  { id: 7, title: 'IA', description: 'Generación del plan' },
  { id: 8, title: 'Resumen', description: 'Plan financiero' },
  { id: 9, title: 'Acciones', description: 'Plan de acción' }
];

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const CURRENCY_FORMAT = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export const PERCENTAGE_FORMAT = new Intl.NumberFormat('es-MX', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2
});