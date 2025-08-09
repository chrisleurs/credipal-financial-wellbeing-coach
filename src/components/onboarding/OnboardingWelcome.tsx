
import React from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/hooks/useAuth'

interface OnboardingWelcomeProps {
  onNext: () => void
  onBack: () => void
}

export default function OnboardingWelcome({ onNext, onBack }: OnboardingWelcomeProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [selectedLanguage, setSelectedLanguage] = React.useState('ES')
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  const languages = [
    { code: 'ES', flag: '🇪🇸', name: 'Español' },
    { code: 'EN', flag: '🇺🇸', name: 'English' },
    { code: 'PT', flag: '🇧🇷', name: 'Português' },
    { code: 'FR', flag: '🇫🇷', name: 'Français' }
  ]

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang)
    setIsDropdownOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 relative">
      {/* Header con selector de idioma */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <div></div> {/* Spacer para centrar el selector */}
        
        {/* Language Selector */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-white/50 hover:bg-white/70 rounded-xl px-3 py-2 transition-colors"
          >
            <span className="text-lg">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
            <span className="font-medium text-gray-700">{selectedLanguage}</span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {/* Language Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[140px] z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div>
                    <span className="font-medium text-gray-700">{lang.code}</span>
                    <span className="text-xs text-gray-500 ml-1">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">💰</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              ¡Bienvenido a Credipal!
            </h1>
            
            <p className="text-gray-600 text-xl md:text-2xl leading-relaxed mb-8 px-2">
              Tu asistente personal para mejorar tu salud financiera
            </p>

            <div className="bg-white/70 rounded-2xl p-6 mb-8 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Lo que haremos juntos:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">📊</span>
                  </div>
                  <span className="text-gray-700">Analizar tus ingresos y gastos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">💳</span>
                  </div>
                  <span className="text-gray-700">Organizar tus deudas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">🎯</span>
                  </div>
                  <span className="text-gray-700">Definir tus metas financieras</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600">📋</span>
                  </div>
                  <span className="text-gray-700">Crear tu plan personalizado</span>
                </div>
              </div>
            </div>

            {/* Usuario info */}
            {user && (
              <Card className="mb-8 bg-white/80 border-0 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-gray-600 text-lg">
                    Hola <strong className="text-gray-800">{user.email}</strong>, 
                    <br />
                    vamos a configurar tu perfil financiero en solo 6 pasos.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Continue Button */}
            <Button 
              onClick={onNext}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 px-12 rounded-2xl text-xl shadow-lg transition-all duration-200 transform hover:scale-105 max-w-md mx-auto"
            >
              <div className="flex items-center justify-center gap-3">
                Comenzar
                <ArrowRight className="h-6 w-6" />
              </div>
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              Solo tomará unos minutos configurar tu perfil
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
