
import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { User, Settings, LogOut } from 'lucide-react'

export default function Profile() {
  const { user, signOut } = useAuth()

  return (
    <AppLayout>
      <div className="container mx-auto p-4 pb-20 max-w-2xl"> {/* Added bottom padding */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  onClick={signOut}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
