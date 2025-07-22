
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Expense } from '@/hooks/useExpenses';

const EXPENSE_CATEGORIES = [
  'Comida',
  'Transporte', 
  'Entretenimiento',
  'Salud',
  'Servicios',
  'Otros'
];

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    category: string;
    description: string;
    expense_date: string;
  }) => Promise<{ success: boolean }>;
  expense?: Expense;
  title: string;
}

export function ExpenseModal({ isOpen, onClose, onSubmit, expense, title }: ExpenseModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        expense_date: expense.expense_date
      });
    } else {
      setFormData({
        amount: '',
        category: '',
        description: '',
        expense_date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [expense, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    if (!formData.expense_date) {
      newErrors.expense_date = 'La fecha es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmit({
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        expense_date: formData.expense_date
      });

      if (result.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Monto *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className={errors.amount ? 'border-destructive' : ''}
            />
            {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount}</p>}
          </div>

          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describe el gasto..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={errors.description ? 'border-destructive' : ''}
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="expense_date">Fecha *</Label>
            <Input
              id="expense_date"
              type="date"
              value={formData.expense_date}
              onChange={(e) => setFormData(prev => ({ ...prev, expense_date: e.target.value }))}
              className={errors.expense_date ? 'border-destructive' : ''}
            />
            {errors.expense_date && <p className="text-sm text-destructive mt-1">{errors.expense_date}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-primary">
              {isSubmitting ? 'Guardando...' : (expense ? 'Actualizar' : 'Agregar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
