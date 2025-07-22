
import type { Debt, DebtPayment, AIMotivationalMessage } from '@/types/debt'

export class AIMotivationalService {
  static generateMotivationalMessage(
    debt: Debt,
    payments: DebtPayment[],
    scenario?: 'positive' | 'negative' | 'progress'
  ): AIMotivationalMessage {
    const totalPaid = payments
      .filter(p => p.debt_id === debt.id)
      .reduce((sum, p) => sum + p.amount, 0)
    
    const progressPercentage = Math.round((totalPaid / debt.total_amount) * 100)
    const remainingBalance = debt.current_balance
    const monthsToPayOff = Math.ceil(remainingBalance / debt.minimum_payment)

    switch (scenario) {
      case 'positive':
        return this.generatePositiveScenario(debt, remainingBalance, monthsToPayOff)
      case 'negative':
        return this.generateNegativeScenario(debt, remainingBalance)
      case 'progress':
        return this.generateProgressMessage(debt, progressPercentage, remainingBalance)
      default:
        return this.generateGeneralMessage(debt, progressPercentage, remainingBalance)
    }
  }

  private static generatePositiveScenario(debt: Debt, remaining: number, months: number): AIMotivationalMessage {
    const extraPayment = Math.round(debt.minimum_payment * 0.2) // 20% extra
    const newMonths = Math.ceil(remaining / (debt.minimum_payment + extraPayment))
    const monthsSaved = months - newMonths
    const interestSaved = Math.round(monthsSaved * debt.minimum_payment * (debt.annual_interest_rate / 100 / 12))

    const messages = [
      `¡Imagina tu libertad! Si agregas solo $${extraPayment.toLocaleString()} extra a tu pago mensual, te liberarás ${monthsSaved} meses antes y ahorrarás $${interestSaved.toLocaleString()} en intereses. ¡Cada peso extra es una inversión en tu futuro!`,
      `Tu disciplina puede cambiar el juego: pagando $${extraPayment.toLocaleString()} adicionales mensuales, transformas ${months} meses de pagos en solo ${newMonths}. ¡Eso es acelerar tu camino hacia la libertad financiera!`,
      `Pequeños sacrificios, grandes recompensas: $${extraPayment.toLocaleString()} extra al mes significa $${interestSaved.toLocaleString()} menos para el banco y ${monthsSaved} meses más de libertad. ¡Tú puedes lograrlo!`
    ]

    return {
      type: 'positive',
      message: messages[Math.floor(Math.random() * messages.length)],
      actionSuggestion: `Considera hacer un pago extra de $${extraPayment.toLocaleString()} este mes`
    }
  }

  private static generateNegativeScenario(debt: Debt, remaining: number): AIMotivationalMessage {
    const missedPaymentCost = Math.round(remaining * (debt.annual_interest_rate / 100 / 12))
    const lateFeesEstimate = Math.round(debt.minimum_payment * 0.05) // 5% late fee estimate

    const messages = [
      `Entiendo que puede ser desafiante, pero saltarse un pago generaría aproximadamente $${missedPaymentCost.toLocaleString()} adicionales en intereses y posibles recargos de $${lateFeesEstimate.toLocaleString()}. Busquemos alternativas juntos.`,
      `Sé que no siempre es fácil, pero cada mes sin pago añade $${missedPaymentCost.toLocaleString()} a tu deuda. Exploremos opciones para mantener tu progreso, incluso con un pago parcial.`,
      `Los tiempos difíciles son temporales, pero las decisiones financieras tienen efectos duraderos. Un mes sin pagar podría costarte $${(missedPaymentCost + lateFeesEstimate).toLocaleString()} extra. ¿Qué opciones podemos considerar?`
    ]

    return {
      type: 'negative',
      message: messages[Math.floor(Math.random() * messages.length)],
      actionSuggestion: 'Contacta a tu acreedor para explorar opciones de pago'
    }
  }

  private static generateProgressMessage(debt: Debt, progress: number, remaining: number): AIMotivationalMessage {
    if (progress >= 75) {
      const messages = [
        `¡Increíble progreso! Has completado el ${progress}% de tu deuda con ${debt.creditor_name}. Solo faltan $${remaining.toLocaleString()} y estarás completamente libre de esta carga financiera. ¡La meta está muy cerca!`,
        `¡Eres imparable! ${progress}% completado significa que has demostrado una disciplina extraordinaria. Con solo $${remaining.toLocaleString()} restantes, la libertad financiera está a tu alcance.`,
        `¡Casi llegamos! El ${progress}% completado es prueba de tu compromiso. Cada pago te acerca más a esos $${remaining.toLocaleString()} finales. ¡No te detengas ahora!`
      ]
      
      return {
        type: 'progress',
        message: messages[Math.floor(Math.random() * messages.length)]
      }
    } else if (progress >= 50) {
      const messages = [
        `¡Excelente trabajo! Ya has pagado el ${progress}% de tu deuda. Llevas un ritmo constante y disciplinado. $${remaining.toLocaleString()} restantes y habrás conquistado esta meta.`,
        `¡Vas por la mitad del camino! El ${progress}% completado demuestra tu determinación. Mantén este momentum y pronto celebraremos tu libertad de esta deuda.`,
        `¡Sigue así! Has superado la mitad con ${progress}% pagado. Tu consistencia es inspiradora. $${remaining.toLocaleString()} y habrás logrado algo extraordinario.`
      ]
      
      return {
        type: 'progress',
        message: messages[Math.floor(Math.random() * messages.length)]
      }
    } else if (progress >= 25) {
      const messages = [
        `¡Buen progreso! El ${progress}% completado es un gran comienzo. Cada pago construye tu camino hacia los $${remaining.toLocaleString()} restantes. ¡Sigue con esta disciplina!`,
        `¡Vas encaminado! ${progress}% pagado demuestra que has tomado control. Mantén este ritmo y pronto verás resultados aún más significativos.`,
        `¡Paso a paso! El ${progress}% completado es evidencia de tu compromiso. Cada peso pagado es un peso menos de carga financiera.`
      ]
      
      return {
        type: 'progress',
        message: messages[Math.floor(Math.random() * messages.length)]
      }
    } else {
      const messages = [
        `¡Cada viaje comienza con el primer paso! Has iniciado el camino con ${progress}% pagado. $${remaining.toLocaleString()} pueden parecer mucho, pero con constancia lo lograrás.`,
        `¡El inicio es lo más difícil y ya lo diste! ${progress}% completado significa que estás comprometido con tu libertad financiera. ¡Sigue adelante!`,
        `¡Bienvenido a tu transformación financiera! Cada peso de ese ${progress}% pagado es una victoria. El camino hacia $${remaining.toLocaleString()} restantes comienza ahora.`
      ]
      
      return {
        type: 'progress',
        message: messages[Math.floor(Math.random() * messages.length)]
      }
    }
  }

  private static generateGeneralMessage(debt: Debt, progress: number, remaining: number): AIMotivationalMessage {
    const messages = [
      `Tu deuda con ${debt.creditor_name} está ${progress}% completada. Con disciplina y estrategia, esos $${remaining.toLocaleString()} restantes serán historia. ¡Confío en tu capacidad!`,
      `Gestionar deudas requiere paciencia y estrategia. Has progresado ${progress}% con ${debt.creditor_name}. Cada pago es una inversión en tu tranquilidad futura.`,
      `${progress}% de progreso demuestra tu compromiso. Los $${remaining.toLocaleString()} restantes son tu siguiente desafío, y sé que estás preparado para conquistarlo.`
    ]

    return {
      type: 'progress',
      message: messages[Math.floor(Math.random() * messages.length)]
    }
  }

  static generatePaymentCelebration(amount: number, debt: Debt): AIMotivationalMessage {
    const celebrationMessages = [
      `¡Fantástico! Acabas de pagar $${amount.toLocaleString()} hacia tu deuda con ${debt.creditor_name}. Cada pago es un paso gigante hacia tu libertad financiera. ¡Sigue así!`,
      `¡Bravo! $${amount.toLocaleString()} pagados hoy significan $${amount.toLocaleString()} menos de carga en tu futuro. Tu disciplina financiera es inspiradora.`,
      `¡Excelente decisión! Con este pago de $${amount.toLocaleString()}, estás escribiendo tu historia de éxito financiero. ¡Cada peso cuenta hacia tu libertad!`,
      `¡Qué satisfacción! $${amount.toLocaleString()} pagados hoy son la prueba de tu compromiso con un futuro sin deudas. ¡Tu yo del futuro te lo agradecerá!`,
      `¡Increíble trabajo! Este pago de $${amount.toLocaleString()} demuestra que eres más fuerte que cualquier deuda. ¡Sigue construyendo tu libertad financiera!`
    ]

    return {
      type: 'celebration',
      message: celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]
    }
  }
}
