
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Debt } from '@/domains/debts/types/debt.types'

interface DebtCardProps {
  debt: Debt
  onEdit: (debt: Debt) => void
  onDelete: (debt: Debt) => void
  onMakePayment: (debt: Debt) => void
  isUpdating: boolean
  isDeleting: boolean
}

export function DebtCard({ debt, onEdit, onDelete, onMakePayment, isUpdating, isDeleting }: DebtCardProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No set'
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'delinquent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{debt.creditor}</h3>
          <p className="text-sm text-muted-foreground">{debt.description || 'No description'}</p>
        </div>
        <Badge className={getStatusColor(debt.status)}>
          {debt.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="font-semibold text-red-600">${debt.current_balance.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Monthly Payment</p>
          <p className="font-semibold">${debt.monthly_payment.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Interest Rate</p>
          <p className="font-semibold">{debt.interest_rate}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Due Date</p>
          <p className="font-semibold">{formatDate(debt.due_date)}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {debt.status === 'active' && (
          <Button 
            size="sm" 
            onClick={() => onMakePayment(debt)}
          >
            Make Payment
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(debt)}
          disabled={isUpdating}
        >
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(debt)}
          disabled={isDeleting}
        >
          Delete
        </Button>
      </div>
    </Card>
  )
}
