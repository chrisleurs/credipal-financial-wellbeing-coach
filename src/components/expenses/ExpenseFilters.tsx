
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { CategorySelector } from './CategorySelector';

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
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="filter-category">Category</Label>
            <div className="mt-1">
              <CategorySelector
                value={filters.category === 'all' ? '' : filters.category}
                onValueChange={(value) => onFiltersChange({ ...filters, category: value || 'all' })}
                showAddButton={false}
              />
              {filters.category === 'all' && (
                <div className="text-sm text-muted-foreground mt-1">
                  All categories
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="filter-date-from">From</Label>
            <Input
              id="filter-date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="filter-date-to">To</Label>
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
