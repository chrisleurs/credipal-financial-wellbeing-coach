
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { FixedDataConsolidation } from '@/services/fixedDataConsolidation'

interface UserDataStatus {
  userId: string
  email: string
  onboardingCompleted: boolean
  onboardingData: any
  consolidatedData: {
    incomes: number
    expenses: number
    debts: number
    goals: number
  }
  needsMigration: boolean
}

export const DataRecoveryTool = () => {
  const [userEmail, setUserEmail] = useState('')
  const [userStatus, setUserStatus] = useState<UserDataStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)
  const { toast } = useToast()

  const diagnoseUser = async () => {
    if (!userEmail.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    console.log('🔍 ADMIN: Diagnosing user:', userEmail)

    try {
      // 1. Get user profile and onboarding data
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id, email, onboarding_completed, onboarding_data')
        .eq('email', userEmail.trim())
        .single()

      if (!profile) {
        toast({
          title: "Usuario no encontrado",
          description: `No se encontró usuario con email: ${userEmail}`,
          variant: "destructive"
        })
        return
      }

      // 2. Check consolidated tables
      const [incomesResult, expensesResult, debtsResult, goalsResult] = await Promise.all([
        supabase.from('income_sources').select('*').eq('user_id', profile.user_id),
        supabase.from('expenses').select('*').eq('user_id', profile.user_id),
        supabase.from('debts').select('*').eq('user_id', profile.user_id),
        supabase.from('goals').select('*').eq('user_id', profile.user_id)
      ])

      const consolidatedData = {
        incomes: incomesResult.data?.length || 0,
        expenses: expensesResult.data?.length || 0,
        debts: debtsResult.data?.length || 0,
        goals: goalsResult.data?.length || 0
      }

      const onboardingData = profile.onboarding_data as any || {}
      
      // Check if migration is needed
      const needsMigration = (
        profile.onboarding_completed &&
        (
          (onboardingData.monthlyIncome && onboardingData.monthlyIncome > 0 && consolidatedData.incomes === 0) ||
          (onboardingData.debts && onboardingData.debts.length > 0 && consolidatedData.debts <= 1) ||
          (onboardingData.financialGoals && onboardingData.financialGoals.length > 0 && consolidatedData.goals === 0)
        )
      )

      const status: UserDataStatus = {
        userId: profile.user_id,
        email: profile.email || userEmail,
        onboardingCompleted: profile.onboarding_completed,
        onboardingData,
        consolidatedData,
        needsMigration
      }

      setUserStatus(status)
      
      console.log('📊 ADMIN: User diagnosis:', {
        email: userEmail,
        onboardingCompleted: status.onboardingCompleted,
        onboardingData: {
          monthlyIncome: onboardingData.monthlyIncome,
          extraIncome: onboardingData.extraIncome,
          debts: onboardingData.debts?.length || 0,
          financialGoals: onboardingData.financialGoals?.length || 0
        },
        consolidatedData: status.consolidatedData,
        needsMigration: status.needsMigration
      })

      toast({
        title: "Diagnóstico completado",
        description: `Usuario ${userEmail} analizado exitosamente`,
      })

    } catch (error) {
      console.error('❌ ADMIN: Error diagnosing user:', error)
      toast({
        title: "Error en diagnóstico",
        description: "No se pudo analizar el usuario",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const migrateUserData = async () => {
    if (!userStatus) return

    setIsMigrating(true)
    console.log('🔄 ADMIN: Starting migration for user:', userStatus.email)

    try {
      const result = await FixedDataConsolidation.consolidateUserData(userStatus.userId)

      if (result.success) {
        toast({
          title: "Migración exitosa",
          description: `Migrados: ${result.migratedRecords.incomes} ingresos, ${result.migratedRecords.debts} deudas, ${result.migratedRecords.goals} metas`,
        })

        // Refresh user status
        await diagnoseUser()
      } else {
        toast({
          title: "Error en migración",
          description: result.errors.join(', '),
          variant: "destructive"
        })
      }

    } catch (error) {
      console.error('❌ ADMIN: Migration error:', error)
      toast({
        title: "Error en migración",
        description: "No se pudo completar la migración",
        variant: "destructive"
      })
    } finally {
      setIsMigrating(false)
    }
  }

  const recalculateFinancialSummary = async () => {
    if (!userStatus) return

    try {
      await supabase.rpc('calculate_financial_summary', {
        target_user_id: userStatus.userId
      })

      toast({
        title: "Resumen recalculado",
        description: "El resumen financiero ha sido actualizado",
      })
    } catch (error) {
      console.error('❌ ADMIN: Error recalculating summary:', error)
      toast({
        title: "Error",
        description: "No se pudo recalcular el resumen financiero",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Herramienta de Recuperación de Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ingresa el email del usuario"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && diagnoseUser()}
            />
            <Button onClick={diagnoseUser} disabled={isLoading}>
              {isLoading ? 'Analizando...' : 'Diagnosticar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {userStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Estado del Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><strong>Email:</strong> {userStatus.email}</div>
              <div><strong>Onboarding Completado:</strong> {userStatus.onboardingCompleted ? '✅ Sí' : '❌ No'}</div>
              <div className={`font-bold ${userStatus.needsMigration ? 'text-red-600' : 'text-green-600'}`}>
                <strong>Necesita Migración:</strong> {userStatus.needsMigration ? '⚠️ SÍ' : '✅ No'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📈 Datos en Tablas Consolidadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>Ingresos: <span className="font-bold">{userStatus.consolidatedData.incomes}</span></div>
              <div>Gastos: <span className="font-bold">{userStatus.consolidatedData.expenses}</span></div>
              <div>Deudas: <span className="font-bold">{userStatus.consolidatedData.debts}</span></div>
              <div>Metas: <span className="font-bold">{userStatus.consolidatedData.goals}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📋 Datos del Onboarding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>Ingreso Mensual: <span className="font-bold">${userStatus.onboardingData.monthlyIncome || 0}</span></div>
              <div>Ingreso Extra: <span className="font-bold">${userStatus.onboardingData.extraIncome || 0}</span></div>
              <div>Deudas: <span className="font-bold">{userStatus.onboardingData.debts?.length || 0}</span></div>
              <div>Metas: <span className="font-bold">{userStatus.onboardingData.financialGoals?.length || 0}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🛠️ Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {userStatus.needsMigration && (
                <Button 
                  onClick={migrateUserData} 
                  disabled={isMigrating}
                  className="w-full"
                  variant="default"
                >
                  {isMigrating ? 'Migrando...' : '🔄 Migrar Datos'}
                </Button>
              )}
              <Button 
                onClick={recalculateFinancialSummary}
                variant="outline"
                className="w-full"
              >
                📊 Recalcular Resumen
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
