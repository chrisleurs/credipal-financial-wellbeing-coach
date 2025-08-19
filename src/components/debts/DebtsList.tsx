
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Debt } from '@/domains/debts/types/debt.types'
import { DebtCard } from './DebtCard'

interface DebtsListProps {
  debts: Debt[]
  onEdit: (debt: Debt) => void
  onDelete: (debt: Debt) => void
  onMakePayment: (debt: Debt) => void
  onCreate: () => void
  isUpdating: boolean
  isDeleting: boolean
}

export function DebtsList({ 
  debts, 
  onEdit, 
  onDelete, 
  onMakePayment, 
  onCreate, 
  isUpdating, 
  isDeleting 
}: DebtsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Debts</CardTitle>
      </CardHeader>
      <CardContent>
        {debts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't added any debts yet.</p>
            <Button onClick={onCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Debt
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {debts.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onEdit={onEdit}
                onDelete={onDelete}
                onMakePayment={onMakePayment}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
