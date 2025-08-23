
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFormDraft } from '@/hooks/useFormDraft';
import { useToast } from '@/hooks/use-toast';
import { useGoals } from '@/domains/savings/hooks/useGoals';

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    goalId?: string;
    date: string;
    description?: string;
  }) => Promise<{ success: boolean; error?: any }>;
}

export const SavingsModal: React.FC<SavingsModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { toast } = useToast();
  const { activeGoals, isLoading: goalsLoading } = useGoals();
  
  const defaultFormData = {
    amount: '',
    goalId: '',
    description: '',
    date: new Date()
  };

  const { formData, saveDraft, clearDraft } = useFormDraft({
    key: 'savings_new',
    defaultValues: defaultFormData
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      saveDraft({ ...defaultFormData, date: new Date() });
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    saveDraft(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    setIsLoading(true);
    try {
      const submitData = {
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString().split('T')[0],
        description: formData.description,
        ...(formData.goalId && { goalId: formData.goalId })
      };

      const result = await onSubmit(submitData);
      if (result.success) {
        clearDraft();
        
        // Calcular progreso si hay meta seleccionada
        const selectedGoal = activeGoals.find(goal => goal.id === formData.goalId);
        let progressMessage = `+$${formData.amount} agregado a tus ahorros 🏦`;
        
        if (selectedGoal) {
          const newProgress = ((selectedGoal.current_amount + parseFloat(formData.amount)) / selectedGoal.target_amount) * 100;
          const progressIncrease = (parseFloat(formData.amount) / selectedGoal.target_amount) * 100;
          progressMessage = `Tu ahorro empuja tu meta un +${progressIncrease.toFixed(1)}% 🎯 (${newProgress.toFixed(1)}% completado)`;
        }

        toast({
          title: "Ahorro registrado",
          description: progressMessage,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting savings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasNoGoals = !goalsLoading && activeGoals.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Ahorro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label>Meta/Objetivo</Label>
            {hasNoGoals ? (
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-3">
                  No tienes metas de ahorro creadas
                </p>
                <Button type="button" variant="outline" size="sm" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primera meta
                </Button>
              </div>
            ) : (
              <Select value={formData.goalId} onValueChange={(value) => handleInputChange('goalId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una meta (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {activeGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title} - ${goal.current_amount}/${goal.target_amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label>Fecha</Label>
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
              placeholder="Detalle del ahorro (opcional)"
              rows={3}
            />
          </div>

          {parseFloat(formData.amount) > 1000 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 Verificar que tienes fondos disponibles para este ahorro
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.amount || hasNoGoals}>
              {isLoading ? 'Guardando...' : 'Registrar Ahorro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
