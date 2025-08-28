
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Calendar, DollarSign, ArrowRight, AlertTriangle } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { useLanguage } from '@/contexts/LanguageContext';

export const KueskiDebtScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const kueskiDebt = {
    creditor: 'KueskiPay',
    totalAmount: 500,
    currency: 'USD',
    installments: 5,
    installmentAmount: 100,
    paymentFrequency: 15, // days
    nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    remainingPayments: 5
  };

  const handleContinue = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('🏦 KueskiPay debt acknowledged - proceeding to onboarding');
    navigate('/onboarding', { replace: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-subtle flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-md mx-auto px-4 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('kueski_debt_detected')}
              </h1>
              <p className="text-gray-600">
                {t('kueski_debt_subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-6">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Alert */}
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                {t('kueski_debt_alert')}
              </AlertDescription>
            </Alert>

            {/* Debt Details Card */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                    KueskiPay
                  </CardTitle>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {t('kueski_active')}
                  </Badge>
                </div>
                <CardDescription>
                  {t('kueski_short_term_loan')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Total Amount */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{t('total_amount')}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    ${kueskiDebt.totalAmount} {kueskiDebt.currency}
                  </span>
                </div>

                {/* Payment Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('remaining_payments')}</span>
                    <span className="font-medium">{kueskiDebt.remainingPayments} of {kueskiDebt.installments}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('biweekly_payment')}</span>
                    <span className="font-medium">${kueskiDebt.installmentAmount} {kueskiDebt.currency}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('frequency')}</span>
                    <span className="font-medium">{t('every_x_days').replace('{days}', kueskiDebt.paymentFrequency.toString())}</span>
                  </div>
                </div>

                {/* Next Payment */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">{t('next_payment')}</span>
                  </div>
                  <span className="text-sm font-medium text-blue-800">
                    {formatDate(kueskiDebt.nextPaymentDate)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('payment_progress')}</span>
                    <span className="font-medium">{t('completed_payments').replace('{completed}', '0').replace('{total}', kueskiDebt.installments.toString())}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-blue-900">
                    {t('whats_next')}
                  </h3>
                  <p className="text-sm text-blue-800">
                    {t('credipal_plan_description')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t p-4">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={handleContinue}
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 h-12"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('processing')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {t('continue_with_plan')}
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              {t('plan_info_usage')}
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
