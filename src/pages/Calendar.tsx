import React, { useState } from 'react'
import { Calendar as CalendarIcon, Clock, DollarSign, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar as UICalendar } from '@/components/ui/calendar'
import { useFinancialStore } from '@/store/financialStore'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

interface FinancialEvent {
  id: string
  title: string
  date: Date
  type: 'income' | 'expense' | 'debt' | 'reminder'
  amount?: number
}

export default function Calendar() {
  const { financialData } = useFinancialStore()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  
  // Generate recurring financial events
  const generateFinancialEvents = (): FinancialEvent[] => {
    const events: FinancialEvent[] = []
    const currentMonth = new Date()
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    
    // Income events (monthly)
    if (financialData.monthlyIncome > 0) {
      events.push({
        id: 'income-monthly',
        title: 'Ingreso Mensual',
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        type: 'income',
        amount: financialData.monthlyIncome
      })
    }

    // Debt payments
    financialData.debts.forEach((debt, index) => {
      events.push({
        id: `debt-${debt.id}`,
        title: `Pago ${debt.name}`,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15),
        type: 'debt',
        amount: debt.monthlyPayment
      })
    })

    // Savings reminder
    if (financialData.monthlySavingsCapacity > 0) {
      events.push({
        id: 'savings-reminder',
        title: 'Transferir a Ahorros',
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 20),
        type: 'reminder',
        amount: financialData.monthlySavingsCapacity
      })
    }

    // Budget review reminder
    events.push({
      id: 'budget-review',
      title: 'Revisar Presupuesto',
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 25),
      type: 'reminder'
    })

    return events
  }

  const events = generateFinancialEvents()
  
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <DollarSign className="h-3 w-3" />
      case 'expense':
        return <CreditCard className="h-3 w-3" />
      case 'debt':
        return <CreditCard className="h-3 w-3" />
      case 'reminder':
        return <Clock className="h-3 w-3" />
      default:
        return <CalendarIcon className="h-3 w-3" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-secondary text-secondary-foreground'
      case 'expense':
        return 'bg-destructive text-destructive-foreground'
      case 'debt':
        return 'bg-warning text-warning-foreground'
      case 'reminder':
        return 'bg-primary text-primary-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const selectedDateEvents = getEventsForDate(selectedDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calendario Financiero</h1>
        <p className="text-muted-foreground">Planifica y organiza tus finanzas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(selectedDate, 'MMMM yyyy', { locale: es })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UICalendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={es}
              className="rounded-md border w-full"
              modifiers={{
                hasEvents: (date) => getEventsForDate(date).length > 0
              }}
              modifiersClassNames={{
                hasEvents: 'bg-primary/10 text-primary font-medium'
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, 'dd MMMM yyyy', { locale: es })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay eventos para esta fecha
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.type)}
                        <div>
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          {event.amount && (
                            <p className="text-sm text-muted-foreground">
                              ${event.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className={getEventColor(event.type)}>
                        {event.type === 'income' && 'Ingreso'}
                        {event.type === 'expense' && 'Gasto'}
                        {event.type === 'debt' && 'Deuda'}
                        {event.type === 'reminder' && 'Recordatorio'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events
              .filter(event => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.type)}
                    <div>
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(event.date, 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {event.amount && (
                      <p className="font-medium text-foreground">
                        ${event.amount.toLocaleString()}
                      </p>
                    )}
                    <Badge variant="outline" className={getEventColor(event.type)}>
                      {event.type === 'income' && 'Ingreso'}
                      {event.type === 'expense' && 'Gasto'}
                      {event.type === 'debt' && 'Deuda'}
                      {event.type === 'reminder' && 'Recordatorio'}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <p className="text-2xl font-bold text-secondary">
                ${financialData.monthlyIncome.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Ingresos Planificados</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-destructive/10">
              <p className="text-2xl font-bold text-destructive">
                ${financialData.monthlyExpenses.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Gastos Planificados</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-warning/10">
              <p className="text-2xl font-bold text-warning">
                ${financialData.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Pagos de Deuda</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <p className="text-2xl font-bold text-primary">
                ${financialData.monthlySavingsCapacity.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Capacidad de Ahorro</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}