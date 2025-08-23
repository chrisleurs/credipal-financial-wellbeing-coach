
import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Wallet, TrendingUp, CreditCard, PiggyBank, Repeat } from 'lucide-react'

export interface ActionSheetOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
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
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-[20px] border-0">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center">¿Qué quieres registrar?</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-3 pb-6">
          {options.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              className="w-full h-auto p-4 flex items-start gap-4 justify-start text-left hover:bg-muted/50"
              onClick={() => {
                option.onClick()
                onClose()
              }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {option.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">{option.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export const createActionSheetOptions = ({
  onAddExpense,
  onAddIncome,
  onPayDebt,
  onAddSaving,
  onAddSubscription
}: {
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
    icon: <Wallet className="h-5 w-5 text-primary" />,
    onClick: onAddExpense
  },
  {
    id: 'income',
    title: 'Registrar Ingreso 💵',
    description: 'Registrar dinero recibido',
    icon: <TrendingUp className="h-5 w-5 text-green-600" />,
    onClick: onAddIncome
  },
  {
    id: 'debt',
    title: 'Pagar Deuda 💳',
    description: 'Registrar pago de deuda',
    icon: <CreditCard className="h-5 w-5 text-blue-600" />,
    onClick: onPayDebt
  },
  {
    id: 'saving',
    title: 'Registrar Ahorro 🏦',
    description: 'Mover dinero a ahorros',
    icon: <PiggyBank className="h-5 w-5 text-purple-600" />,
    onClick: onAddSaving
  },
  {
    id: 'subscription',
    title: 'Añadir Suscripción 🔁',
    description: 'Crear pago recurrente',
    icon: <Repeat className="h-5 w-5 text-orange-600" />,
    onClick: onAddSubscription
  }
]
