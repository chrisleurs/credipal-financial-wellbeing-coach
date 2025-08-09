
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import OnboardingStep from './OnboardingStep'
import { useOnboardingStore } from '@/store/modules/onboardingStore'
import { useLoans } from '@/hooks/useLoans'
import { useLanguage } from '@/contexts/LanguageContext'
import { DollarSign, TrendingUp, CreditCard, CheckCircle } from 'lucide-react'

interface Step1IncomeProps {
  onNext: () => void
  onBack: () => void
}

export default function Step1Income({ onNext, onBack }: Step1IncomeProps) {
  const { financialData, updateIncome } = useOnboardingStore()
  const { kueskiLoan, isLoading: isLoadingLoan } = useLoans()
  const { t } = useLanguage()
  
  const [montoPrincipal, setMontoPrincipal] = useState(financialData.monthlyIncome.toString())
  const [montoExtras, setMontoExtras] = useState(financialData.extraIncome.toString())

  useEffect(() => {
    setMontoPrincipal(financialData.monthlyIncome.toString())
    setMontoExtras(financialData.extraIncome.toString())
  }, [financialData.monthlyIncome, financialData.extraIncome])

  const handleNext = async () => {
    const ingresoPrincipal = parseFloat(montoPrincipal) || 0
    const ingresoExtra = parseFloat(montoExtras) || 0

    console.log('💰 Saving income data:', { ingresoPrincipal, ingresoExtra })
    updateIncome(ingresoPrincipal, ingresoExtra)
    
    onNext()
  }

  const totalIngresos = (parseFloat(montoPrincipal) || 0) + (parseFloat(montoExtras) || 0)
  const canProceed = montoPrincipal && parseFloat(montoPrincipal) > 0

  return (
    <OnboardingStep
      currentStep={0}
      totalSteps={6}
      title={t('income_title')}
      subtitle={t('loan_registered')}
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
      nextButtonText={t('continue')}
    >
      <div className="space-y-6">
        {/* Kueski Loan Confirmation */}
        {kueskiLoan && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">
                    {t('kueski_loan_registered')}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Tu préstamo de <strong>${kueskiLoan.amount} USD</strong> {t('kueski_loan_description')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white/70 rounded-lg p-3">
                      <p className="text-xs text-text-secondary">{t('next_payment')}</p>
                      <p className="font-semibold text-primary">
                        {new Date(kueskiLoan.next_payment_date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                      <p className="text-xs text-text-secondary">{t('biweekly_payment')}</p>
                      <p className="font-semibold text-primary">${kueskiLoan.payment_amount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoadingLoan && !kueskiLoan && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-700">
                <CreditCard className="h-5 w-5" />
                <p className="text-sm font-medium">
                  Tu préstamo Kueski se está configurando automáticamente...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Income Configuration */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                {t('monthly_income')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ingreso-principal">
                    {t('monthly_income_question')}
                  </Label>
                  <Input
                    id="ingreso-principal"
                    type="number"
                    placeholder="1500"
                    value={montoPrincipal}
                    onChange={(e) => setMontoPrincipal(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-text-secondary mt-2">
                    {t('monthly_income_help')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-secondary" />
                {t('additional_income')}
                <Badge variant="secondary" className="ml-2">{t('optional')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ingresos-extras">
                    {t('additional_income_question')}
                  </Label>
                  <Input
                    id="ingresos-extras"
                    type="number"
                    placeholder="300"
                    value={montoExtras}
                    onChange={(e) => setMontoExtras(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-text-secondary mt-2">
                    {t('additional_income_help')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {totalIngresos > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-text-secondary mb-1">{t('total_monthly_income')}</p>
                  <p className="text-2xl font-bold text-primary">
                    ${totalIngresos.toLocaleString()} USD
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="px-8"
          >
            {t('back')}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!montoPrincipal || parseFloat(montoPrincipal) <= 0}
            className="px-8 bg-gradient-to-r from-primary to-primary/90"
          >
            {t('continue')}
          </Button>
        </div>
      </div>
    </OnboardingStep>
  )
}
