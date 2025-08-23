
import React from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, DollarSign, PiggyBank } from 'lucide-react'

interface QuickActionButtonsProps {
  onAddIncome: () => void
  onAddExpense: () => void
  onAddSaving: () => void
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onAddIncome,
  onAddExpense,
  onAddSaving
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Button 
        onClick={onAddIncome}
        variant="outline" 
        className="flex flex-col items-center py-6 h-auto gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
      >
        <DollarSign className="h-5 w-5" />
        <span className="text-xs font-medium">Registrar Ingreso</span>
      </Button>
      
      <Button 
        onClick={onAddExpense}
        variant="outline" 
        className="flex flex-col items-center py-6 h-auto gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <PlusCircle className="h-5 w-5" />
        <span className="text-xs font-medium">Registrar Gasto</span>
      </Button>
      
      <Button 
        onClick={onAddSaving}
        variant="outline" 
        className="flex flex-col items-center py-6 h-auto gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
      >
        <PiggyBank className="h-5 w-5" />
        <span className="text-xs font-medium">Registrar Ahorro</span>
      </Button>
    </div>
  )
}
