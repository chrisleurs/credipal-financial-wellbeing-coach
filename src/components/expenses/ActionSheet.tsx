
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { 
  Wallet, 
  DollarSign, 
  CreditCard, 
  PiggyBank, 
  Repeat 
} from 'lucide-react'

interface ActionSheetOption {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
}

interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  options: ActionSheetOption[]
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  options
}) => {
  const handleOptionClick = (action: () => void) => {
    onClose()
    // Small delay to allow sheet to close smoothly before opening next modal
    setTimeout(action, 200)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-[20px] border-t">
        <SheetHeader className="text-center pb-4">
          <SheetTitle>¿Qué quieres registrar?</SheetTitle>
          <SheetDescription>
            Selecciona el tipo de movimiento que deseas añadir
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-3 pb-6">
          {options.map((option) => {
            const IconComponent = option.icon
            return (
              <Button
                key={option.id}
                variant="outline"
                onClick={() => handleOptionClick(option.action)}
                className="w-full h-auto p-4 justify-start text-left hover:bg-emerald-50 hover:border-emerald-300"
              >
                <div className="flex items-center w-full">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4">
                    <IconComponent className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{option.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export const createActionSheetOptions = (handlers: {
  onAddExpense: () => void
  onAddIncome: () => void
  onPayDebt: () => void
  onAddSaving: () => void
  onAddSubscription: () => void
}): ActionSheetOption[] => [
  {
    id: 'expense',
    title: 'Registrar Gasto 💸',
    description: 'Añadir un gasto realizado',
    icon: Wallet,
    action: handlers.onAddExpense
  },
  {
    id: 'income',
    title: 'Registrar Ingreso 💵',
    description: 'Registrar dinero recibido',
    icon: DollarSign,
    action: handlers.onAddIncome
  },
  {
    id: 'debt',
    title: 'Pagar Deuda 💳',
    description: 'Registrar pago de deuda',
    icon: CreditCard,
    action: handlers.onPayDebt
  },
  {
    id: 'saving',
    title: 'Registrar Ahorro 🏦',
    description: 'Mover dinero a ahorros',
    icon: PiggyBank,
    action: handlers.onAddSaving
  },
  {
    id: 'subscription',
    title: 'Añadir Suscripción 🔁',
    description: 'Crear pago recurrente',
    icon: Repeat,
    action: handlers.onAddSubscription
  }
]
