
import React from 'react'
import { User, Mail, Phone, Calendar, Settings, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useFinancialStore } from '@/store/financialStore'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

export default function Profile() {
  const { user, logout } = useAuth()
  const { onboardingCompleted } = useOnboardingStatus()
  const { financialData, isOnboardingComplete } = useFinancialStore()
  const navigate = useNavigate()

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long'
      })
    : 'Desconocido'

  const handleCompleteOnboarding = () => {
    navigate('/onboarding')
  }

  const handleSignOut = async () => {
    await logout()
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground">Información personal y configuración de cuenta</p>
        </div>

        {/* Onboarding Incomplete Alert */}
        {onboardingCompleted === false && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Settings className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800">Completa tu perfil financiero</h3>
                    <p className="text-sm text-amber-700">
                      Termina de configurar tu perfil para obtener recomendaciones personalizadas
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleCompleteOnboarding}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Completar ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    {user?.email?.split('@')[0] || 'Usuario'}
                  </h2>
                  <Badge variant={onboardingCompleted ? "default" : "secondary"}>
                    {onboardingCompleted ? "Perfil Completo" : "Perfil Incompleto"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{user?.email || 'No disponible'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Miembro desde:</span>
                    <span className="font-medium">{memberSince}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">WhatsApp:</span>
                    <span className="font-medium">
                      {financialData.whatsappOptin ? 'Habilitado' : 'Deshabilitado'}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-fit">
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary - Solo mostrar si el onboarding está completo */}
        {onboardingCompleted && (
          <Card>
            <CardHeader>
              <CardTitle>Resumen Financiero</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-secondary">${(financialData.monthlyIncome + financialData.extraIncome).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-destructive">${financialData.monthlyExpenses.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Gastos Mensuales</p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-primary">${financialData.currentSavings.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Ahorros Actuales</p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-warning">{financialData.debts.length}</p>
                  <p className="text-sm text-muted-foreground">Deudas Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals - Solo mostrar si hay metas */}
        {onboardingCompleted && financialData.financialGoals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mis Metas Financieras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {financialData.financialGoals.map((goal, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border">
                    <p className="font-medium text-foreground">{goal.replace('-', ' ')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {onboardingCompleted && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Notificaciones por WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">Recibe consejos y recordatorios</p>
                  </div>
                  <Badge variant={financialData.whatsappOptin ? "default" : "secondary"}>
                    {financialData.whatsappOptin ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Perfil completo</h4>
                <p className="text-sm text-muted-foreground">Información de onboarding completada</p>
              </div>
              <Badge variant={onboardingCompleted ? "default" : "destructive"}>
                {onboardingCompleted ? "Completo" : "Incompleto"}
              </Badge>
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="destructive" size="sm" onClick={handleSignOut}>
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
