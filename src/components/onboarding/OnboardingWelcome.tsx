
import React, { useState } from 'react'
import { ArrowLeft, ChevronDown, Settings, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function OnboardingWelcome() {
  const [selectedLanguage, setSelectedLanguage] = useState('ES')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mainIncome, setMainIncome] = useState('0')
  const [extraIncome, setExtraIncome] = useState('0')

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
      {/* Progress Bar - Sticky on mobile */}
      <div className="sticky top-0 z-50 md:relative bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-3 md:px-6 md:py-4">
        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
          <span>Paso 1 de 6</span>
          <span>17% completado</span>
        </div>
        <div className="mt-2 bg-white/50 rounded-full h-2 shadow-inner">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
            style={{ width: '17%' }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <Button 
          variant="ghost" 
          size="icon"
          className="p-2 hover:bg-white/50 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Button>
        
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
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              ¡Bienvenido a Credipal!
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed px-2">
              Tu préstamo Kueski ya está registrado. Ahora vamos a configurar tus ingresos.
            </p>
          </div>

          {/* Status Card */}
          <Card className="mb-8 bg-yellow-50 border-orange-200 border-l-4 border-l-orange-400">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-orange-800 font-medium flex-1">
                  Tu préstamo Kueski se está configurando automáticamente...
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Income Form */}
          <div className="space-y-6 md:space-y-8">
            {/* Main Income Card */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-gray-800">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  Ingreso Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="main-income" className="text-base font-medium text-gray-700 mb-2 block">
                    ¿Cuál es tu ingreso mensual principal? (USD)
                  </Label>
                  <Input
                    id="main-income"
                    type="number"
                    value={mainIncome}
                    onChange={(e) => setMainIncome(e.target.value)}
                    className="text-lg md:text-xl h-12 md:h-14 text-center font-semibold border-2 border-gray-200 focus:border-emerald-500 transition-colors"
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    Incluye salario, freelance, negocio, etc.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Income Card */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-gray-800">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                  Ingresos Adicionales
                  <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">
                    Opcional
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="extra-income" className="text-base font-medium text-gray-700 mb-2 block">
                    Ingresos extras o variables (USD)
                  </Label>
                  <Input
                    id="extra-income"
                    type="number"
                    value={extraIncome}
                    onChange={(e) => setExtraIncome(e.target.value)}
                    className="text-lg md:text-xl h-12 md:h-14 text-center font-semibold border-2 border-gray-200 focus:border-teal-500 transition-colors"
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    Trabajos de medio tiempo, comisiones, rentas, etc.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Total Summary */}
            {(parseInt(mainIncome) > 0 || parseInt(extraIncome) > 0) && (
              <Card className="bg-emerald-50 border-emerald-200 shadow-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-emerald-700 mb-2 font-medium">
                    Total de ingresos mensuales
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-emerald-800">
                    ${(parseInt(mainIncome) + parseInt(extraIncome)).toLocaleString()} USD
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Continue Button */}
            <div className="pt-6">
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-lg transition-all duration-200 transform hover:scale-105 h-14 md:h-16"
                disabled={parseInt(mainIncome) <= 0}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
