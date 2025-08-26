
import React, { Suspense } from 'react'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { useAuth } from '@/hooks/useAuth'
import { HeroCoachCard } from './HeroCoachCard'
import { ModernFinancialSummary } from './ModernFinancialSummary'
import { LoanCard } from './LoanCard'
import { DebtsSection } from './DebtsSection'
import { FinancialGoalsSection } from './FinancialGoalsSection'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
    <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
  </div>
)

// Error Boundary Component
interface ErrorBoundaryProps {
  error: Error | null
  onRetry: () => void
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ error, onRetry }) => {
  if (!error) return null

  return (
    <Card className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
      <CardHeader>
        <CardTitle>Oops! Algo salió mal.</CardTitle>
        <CardDescription>
          Hubo un problema al cargar la información.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <strong>Error:</strong> {error.message}
        </p>
        <Button variant="destructive" onClick={onRetry}>
          Reintentar
        </Button>
      </CardContent>
    </Card>
  )
}

// Empty State Component
const EmptyState = () => (
  <Card className="text-center py-12">
    <CardHeader>
      <CardTitle>¡Bienvenido!</CardTitle>
      <CardDescription>
        Parece que aún no tienes datos financieros.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Comienza agregando tus ingresos, gastos y deudas para obtener una
        visión completa de tu situación financiera.
      </p>
      <Button asChild>
        <Link to="/onboarding">Completar Onboarding</Link>
      </Button>
    </CardContent>
  </Card>
)

// Main Dashboard Component
export const OptimizedFinancialDashboard = () => {
  const { user } = useAuth()
  const { data: financialData, isLoading: financialLoading, error: financialError } = useUnifiedFinancialData()
  
  const {
    aiPlan,
    loading: isLoadingPlan,
    generateNewPlan,
    isGeneratingPlan
  } = useFinancialPlan()

  if (financialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  if (financialError || !financialData) {
    console.error('❌ Dashboard error:', financialError)
    return (
      <ErrorBoundary 
        error={financialError} 
        onRetry={() => window.location.reload()}
      />
    )
  }

  if (!financialData.hasFinancialData) {
    return <EmptyState />
  }

  const userName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Usuario'

  // Convertir datos unificados al formato esperado por ModernFinancialSummary
  const consolidatedData = financialData ? {
    monthlyIncome: financialData.totalMonthlyIncome,
    monthlyExpenses: financialData.monthlyExpenses,
    currentSavings: financialData.currentSavings,
    savingsCapacity: financialData.monthlySavingsCapacity
  } : {
    monthlyIncome: 0,
    monthlyExpenses: 0,
    currentSavings: 0,
    savingsCapacity: 0
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* 1. Coach Card */}
        <section id="coach">
          <Suspense fallback={<LoadingSpinner size="md" text="Cargando coach..." />}>
            <HeroCoachCard 
              userName={userName}
              hasActivePlan={!!aiPlan}
              onGeneratePlan={generateNewPlan}
              isGeneratingPlan={isGeneratingPlan}
            />
          </Suspense>
        </section>

        {/* 2. Préstamo Kueski */}
        {financialData.kueskiLoan && (
          <section id="kueski-loan">
            <LoanCard loan={{
              ...financialData.kueskiLoan,
              user_id: financialData.userId,
              currency: 'MXN',
              payment_amount: financialData.kueskiLoan.paymentAmount,
              payment_dates: [1, 15], // Quincenal típico
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }} />
          </section>
        )}

        {/* 3. Deudas del onboarding y sistema */}
        <section id="debts">
          <Suspense fallback={<LoadingSpinner size="md" text="Cargando deudas..." />}>
            <DebtsSection
              debts={financialData.debts}
              totalDebt={financialData.totalDebtBalance}
              totalMonthlyPayments={financialData.totalMonthlyDebtPayments}
            />
          </Suspense>
        </section>

        {/* 4. Financial Summary */}
        <section id="summary">
          <Suspense fallback={<LoadingSpinner size="md" text="Cargando resumen..." />}>
            <ModernFinancialSummary consolidatedData={consolidatedData} />
          </Suspense>
        </section>

        {/* 5. Metas Financieras */}
        <section id="goals">
          <Suspense fallback={<LoadingSpinner size="md" text="Cargando metas..." />}>
            <FinancialGoalsSection goals={financialData.financialGoals} />
          </Suspense>
        </section>

        {/* 6. AI Plan Section (if available) */}
        {aiPlan && (
          <section id="ai-plan" className="mt-8">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Tu Plan Financiero Personalizado</h2>
              <div className="space-y-4">
                {aiPlan.coachMessage && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-muted-foreground">{aiPlan.coachMessage.text}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
