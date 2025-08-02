
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Calendar, DollarSign, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import type { Loan } from '@/hooks/useLoans';

interface LoanCardProps {
  loan: Loan;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getNextPaymentDay = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const paymentDates = loan.payment_dates.sort((a, b) => a - b);
    
    // Find next payment date
    const nextPaymentDay = paymentDates.find(day => day > currentDay) || paymentDates[0];
    return nextPaymentDay;
  };

  const progressPercentage = ((loan.total_payments - loan.remaining_payments) / loan.total_payments) * 100;

  return (
    <Card className="bg-white border border-gray-100 hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{loan.lender}</h3>
              <p className="text-sm text-gray-500">Préstamo Activo</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(loan.amount)}
            </p>
            <p className="text-sm text-gray-500">{loan.currency}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Pago Quincenal</p>
              <p className="font-semibold">{formatCurrency(loan.payment_amount)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Próximo Pago</p>
              <p className="font-semibold">{formatDate(loan.next_payment_date)}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Progreso</span>
            <span className="text-sm font-medium">
              {loan.total_payments - loan.remaining_payments} de {loan.total_payments}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Fechas de pago: {loan.payment_dates.join(', ')} de cada mes</span>
          </div>
          <span className="font-medium text-primary">
            {loan.remaining_payments} pagos restantes
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
