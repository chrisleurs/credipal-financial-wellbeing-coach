
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Comida',
  'Transporte', 
  'Entretenimiento',
  'Salud',
  'Servicios',
  'Otros'
];

interface ExpenseFiltersProps {
  filters: {
    category: string;
    dateFrom: string;
    dateTo: string;
  };
  onFiltersChange: (filters: {
    category: string;
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export function ExpenseFilters({ filters, onFiltersChange }: ExpenseFiltersProps) {
  const handleClearFilters = () => {
    onFiltersChange({
      category: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const hasActiveFilters = filters.category !== 'all' || filters.dateFrom || filters.dateTo;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="filter-category">Categoría</Label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-date-from">Desde</Label>
            <Input
              id="filter-date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="filter-date-to">Hasta</Label>
            <Input
              id="filter-date-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
