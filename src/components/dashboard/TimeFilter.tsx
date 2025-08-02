
import React from 'react';
import { Button } from '@/components/ui/button';

interface TimeFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const timeFilters = [
  { id: 'week', label: '7 días' },
  { id: 'month', label: '1 mes' },
  { id: 'quarter', label: '3 meses' },
  { id: 'year', label: '1 año' }
];

export const TimeFilter: React.FC<TimeFilterProps> = ({
  activeFilter,
  onFilterChange
}) => {
  return (
    <div className="inline-flex bg-slate-100 rounded-xl p-1">
      {timeFilters.map((filter) => (
        <Button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          variant="ghost"
          size="sm"
          className={`
            px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
            ${activeFilter === filter.id 
              ? 'bg-white shadow-md text-primary border-0' 
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }
          `}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
