
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { OnboardingExpense } from '@/hooks/useOnboardingExpenses';

interface ExpenseCategorySectionProps {
  category: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    description: string;
  };
  expenses: OnboardingExpense[];
  onAddExpense: (category: string) => void;
  onEditExpense: (expense: OnboardingExpense) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseCategorySection: React.FC<ExpenseCategorySectionProps> = ({
  category,
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense
}) => {
  const IconComponent = category.icon;
  const categoryTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="bg-emerald-100 p-3 rounded-xl flex-shrink-0">
          <IconComponent className="h-6 w-6 text-emerald-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-medium text-gray-700">{category.name}</h3>
              <p className="text-xs text-emerald-600 font-medium">{category.description}</p>
            </div>
            {categoryTotal > 0 && (
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                ${categoryTotal.toLocaleString()}
              </Badge>
            )}
          </div>

          {/* Expense list */}
          <div className="space-y-2 mb-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-sm"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{expense.subcategory}</span>
                  <span className="ml-2 text-emerald-600 font-semibold">
                    ${expense.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditExpense(expense)}
                    className="h-6 w-6 p-0 text-gray-500 hover:text-blue-600"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteExpense(expense.id)}
                    className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add expense button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddExpense(category.name)}
            className="w-full border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {category.name} Expense
          </Button>
        </div>
      </div>
    </div>
  );
};
