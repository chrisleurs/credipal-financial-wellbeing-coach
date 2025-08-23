
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useExpenses } from '@/domains/expenses/hooks/useExpenses'
import { useDebts } from '@/domains/debts/hooks/useDebts'
import { useGoals } from '@/domains/savings/hooks/useGoals'

export const useBottomNavigation = () => {
  const location = useLocation()
  const { expenses } = useExpenses()
  const { debts } = useDebts()
  const { goals } = useGoals()
  
  // Persist active tab in localStorage
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('bottomNav_activeTab') || 'home'
  })

  // Update active tab based on current route
  useEffect(() => {
    let tab = 'home'
    if (location.pathname === '/expenses') tab = 'movements'
    else if (location.pathname === '/progress') tab = 'progress'
    else if (location.pathname === '/coach') tab = 'coach'
    else if (location.pathname === '/profile') tab = 'profile'
    
    setActiveTab(tab)
    localStorage.setItem('bottomNav_activeTab', tab)
  }, [location.pathname])

  // Calculate badges
  const badges = {
    home: 0, // Could connect to notifications system
    movements: 0,
    progress: (() => {
      // Show badge if there are payments due within 48 hours
      const now = new Date()
      const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000)
      
      return debts.filter(debt => {
        if (!debt.due_date) return false
        const paymentDate = new Date(debt.due_date)
        return paymentDate <= in48Hours && paymentDate >= now
      }).length
    })(),
    coach: 0, // Could show if there are pending messages
    profile: 0
  }

  // Empty states data
  const emptyStates = {
    movements: {
      hasData: expenses.length > 0,
      title: "Sin transacciones aún",
      message: "Agrega tu primer gasto o ingreso para empezar a trackear tus finanzas.",
      actionLabel: "Registrar Gasto"
    },
    progress: {
      hasData: debts.length > 0 || goals.length > 0,
      title: "Aún no hay metas o deudas registradas",
      message: "Define tus objetivos financieros y registra tus deudas para ver tu progreso.",
      actionLabel: "Crear Meta"
    }
  }

  return {
    activeTab,
    badges,
    emptyStates
  }
}
