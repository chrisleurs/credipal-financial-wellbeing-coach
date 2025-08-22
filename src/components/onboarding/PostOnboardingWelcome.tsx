
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface PostOnboardingWelcomeProps {
  onCreatePlan: () => void
}

export const PostOnboardingWelcome: React.FC<PostOnboardingWelcomeProps> = ({ onCreatePlan }) => {
  const { user } = useAuth()
  
  const getUserName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'Usuario'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          
          {/* Welcome Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Bienvenido {getUserName()}!
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Tu viaje financiero comienza aquí.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                CrediPal está listo
              </div>
              <p className="text-gray-600">
                Hemos procesado tu información financiera. Ahora vamos a crear un plan personalizado que te ayudará a alcanzar tus metas.
              </p>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={onCreatePlan}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <div className="flex items-center justify-center gap-2">
                Crea tu plan financiero
                <ArrowRight className="h-5 w-5" />
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Tu coach financiero personal te acompañará en cada paso
          </p>
        </div>
      </div>
    </div>
  )
}
