
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expenseDescription: string;
}

export function DeleteExpenseDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  expenseDescription 
}: DeleteExpenseDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar el gasto "{expenseDescription}"? 
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
