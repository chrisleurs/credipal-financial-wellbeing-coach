
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFormDraft } from '@/hooks/useFormDraft';
import { useToast } from '@/hooks/use-toast';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    source: string;
    date: string;
    description?: string;
    isRecurring?: boolean;
    recurringData?: {
      frequency: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
      dayOfPeriod: number;
      reminderDays?: number;
    };
  }) => Promise<{ success: boolean; error?: any }>;
}

const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' }
];

export const IncomeModal: React.FC<IncomeModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { toast } = useToast();
  
  const defaultFormData = {
    amount: '',
    source: '',
    description: '',
    date: new Date(),
    isRecurring: false,
    frequency: 'monthly' as const,
    dayOfPeriod: 1,
    reminderDays: 3,
    hasReminder: false
  };

  const { formData, saveDraft, clearDraft } = useFormDraft({
    key: 'income_new',
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
    if (!formData.amount || !formData.source) return;

    setIsLoading(true);
    try {
      const submitData = {
        amount: parseFloat(formData.amount),
        source: formData.source,
        date: formData.date.toISOString().split('T')[0],
        description: formData.description,
        ...(formData.isRecurring && {
          isRecurring: true,
          recurringData: {
            frequency: formData.frequency,
            dayOfPeriod: formData.dayOfPeriod,
            ...(formData.hasReminder && { reminderDays: formData.reminderDays })
          }
        })
      };

      const result = await onSubmit(submitData);
      if (result.success) {
        clearDraft();
        toast({
          title: "Ingreso registrado",
          description: `+$${formData.amount} agregado exitosamente 💰`,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting income:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Ingreso</DialogTitle>
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
            <Label htmlFor="source">Fuente de ingreso *</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              placeholder="Nómina, freelance, venta..."
              required
            />
          </div>

          <div>
            <Label>Fecha de cobro</Label>
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
              placeholder="Detalles adicionales (opcional)"
              rows={3}
            />
          </div>

          {/* Toggle Recurrente */}
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <Switch
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
            />
            <Label htmlFor="recurring" className="font-medium">
              Ingreso recurrente
            </Label>
          </div>

          {/* Campos adicionales para recurrencia */}
          {formData.isRecurring && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label>Periodicidad</Label>
                <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dayOfPeriod">
                  Día {formData.frequency === 'monthly' ? 'del mes' : 'aproximado'}
                </Label>
                <Input
                  id="dayOfPeriod"
                  type="number"
                  min="1"
                  max={formData.frequency === 'monthly' ? "31" : "7"}
                  value={formData.dayOfPeriod}
                  onChange={(e) => handleInputChange('dayOfPeriod', parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasReminder"
                  checked={formData.hasReminder}
                  onCheckedChange={(checked) => handleInputChange('hasReminder', checked)}
                />
                <Label htmlFor="hasReminder">Recordatorio</Label>
              </div>

              {formData.hasReminder && (
                <div>
                  <Label htmlFor="reminderDays">Días antes</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.reminderDays}
                    onChange={(e) => handleInputChange('reminderDays', parseInt(e.target.value) || 3)}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.amount || !formData.source}>
              {isLoading ? 'Guardando...' : 'Registrar Ingreso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
