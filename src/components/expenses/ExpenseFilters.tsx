
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, X } from 'lucide-react'

interface ExpenseFiltersProps {
  filters: {
    category: string
    dateFrom: string
    dateTo: string
  }
  onFiltersChange: (filters: { category: string; dateFrom: string; dateTo: string }) => void
}

const CATEGORIES = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'Food & Dining', label: 'Alimentación' },
  { value: 'Transportation', label: 'Transporte' },
  { value: 'Housing & Utilities', label: 'Vivienda' },
  { value: 'Entertainment', label: 'Entretenimiento' },
  { value: 'Healthcare', label: 'Salud' },
  { value: 'Shopping', label: 'Compras' },
  { value: 'Other', label: 'Otros' }
]

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      dateFrom: '',
      dateTo: ''
    })
  }

  const hasActiveFilters = filters.category !== 'all' || filters.dateFrom || filters.dateTo

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <Select 
            value={filters.category} 
            onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
              className="w-36"
              placeholder="Desde"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          
          <div className="relative">
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
              className="w-36"
              placeholder="Hasta"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Filtros activos
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        </div>
      )}
    </div>
  )
}
