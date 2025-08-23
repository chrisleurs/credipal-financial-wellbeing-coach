
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFormDraft } from '@/hooks/useFormDraft';
import { useToast } from '@/hooks/use-toast';
import { useDebts } from '@/domains/debts/hooks/useDebts';

interface DebtPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    debtId: string;
    amount: number;
    date: string;
    description?: string;
  }) => Promise<{ success: boolean; error?: any }>;
}

export const DebtPaymentModal: React.FC<DebtPaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { toast } = useToast();
  const { debts, isLoading: debtsLoading } = useDebts();
  
  const defaultFormData = {
    debtId: '',
    amount: '',
    description: '',
    date: new Date()
  };

  const { formData, saveDraft, clearDraft } = useFormDraft({
    key: 'debt_payment_new',
    defaultValues: defaultFormData
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<any>(null);

  const activeDebts = debts.filter(debt => debt.status === 'active');

  useEffect(() => {
    if (isOpen) {
      saveDraft({ ...defaultFormData, date: new Date() });
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.debtId) {
      const debt = activeDebts.find(d => d.id === formData.debtId);
      setSelectedDebt(debt);
    } else {
      setSelectedDebt(null);
    }
  }, [formData.debtId, activeDebts]);

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    saveDraft(newData);
  };

  const handleQuickAmount = (type: 'minimum' | 'half' | 'full') => {
    if (!selectedDebt) return;
    
    let amount = 0;
    switch (type) {
      case 'minimum':
        amount = selectedDebt.monthly_payment;
        break;
      case 'half':
        amount = selectedDebt.current_balance / 2;
        break;
      case 'full':
        amount = selectedDebt.current_balance;
        break;
    }
    
    handleInputChange('amount', amount.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.debtId || !formData.amount) return;

    setIsLoading(true);
    try {
      const submitData = {
        debtId: formData.debtId,
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString().split('T')[0],
        description: formData.description
      };

      const result = await onSubmit(submitData);
      if (result.success) {
        clearDraft();
        
        // Calculate progress
        const paymentAmount = parseFloat(formData.amount);
        const newBalance = selectedDebt.current_balance - paymentAmount;
        const percentPaid = ((selectedDebt.original_amount - newBalance) / selectedDebt.original_amount) * 100;
        
        toast({
          title: "Pago registrado",
          description: `Deuda reducida a $${newBalance.toFixed(2)} (${percentPaid.toFixed(1)}% pagado) 🎯`,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting debt payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasNoDebts = !debtsLoading && activeDebts.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pagar Deuda</DialogTitle>
        </DialogHeader>
        
        {hasNoDebts ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No tienes deudas activas registradas</p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Seleccionar deuda *</Label>
              <Select value={formData.debtId} onValueChange={(value) => handleInputChange('debtId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una deuda" />
                </SelectTrigger>
                <SelectContent>
                  {activeDebts.map((debt) => (
                    <SelectItem key={debt.id} value={debt.id}>
                      {debt.creditor} - ${debt.current_balance} (Pago mín: ${debt.monthly_payment})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDebt && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount('minimum')}
                  >
                    Pago mínimo (${selectedDebt.monthly_payment})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount('half')}
                  >
                    50% (${(selectedDebt.current_balance / 2).toFixed(2)})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount('full')}
                  >
                    Liquidar (${selectedDebt.current_balance})
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="amount">Monto *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                inputMode="numeric"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label>Fecha de pago</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Selecciona fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && handleInputChange('date', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="description">Nota</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detalles del pago (opcional)"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !formData.debtId || !formData.amount}>
                {isLoading ? 'Procesando...' : 'Registrar Pago'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
