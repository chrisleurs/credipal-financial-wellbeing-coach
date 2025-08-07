
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { OnboardingExpense } from '@/hooks/useOnboardingExpenses';

interface ExpenseCategorySectionProps {
  category: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    description: string;
  };
  expenses: OnboardingExpense[];
  onAddExpense: (data: { category: string; subcategory: string; amount: number }) => Promise<any>;
  onEditExpense: (expense: OnboardingExpense) => void;
  onDeleteExpense: (id: string) => void;
}

// Updated subcategories with placeholders
const SUBCATEGORY_OPTIONS: Record<string, Array<{name: string, placeholder: string}>> = {
  'Food & Dining': [
    { name: 'Groceries', placeholder: 'e.g., supermarket, Costco' },
    { name: 'Restaurants', placeholder: 'e.g., dine-in or takeout' },
    { name: 'Coffee shops', placeholder: 'e.g., Starbucks, cafés' },
    { name: 'Delivery', placeholder: 'e.g., UberEats, DoorDash' },
    { name: 'Lunch', placeholder: 'e.g., daily work lunches' },
    { name: 'Snacks', placeholder: 'e.g., vending machines, convenience store' }
  ],
  'Transportation': [
    { name: 'Gas/Fuel', placeholder: 'e.g., gas station fill-ups' },
    { name: 'Uber/Lyft', placeholder: 'e.g., rideshare trips' },
    { name: 'Public Transport', placeholder: 'e.g., bus/train pass' },
    { name: 'Car Repairs', placeholder: 'e.g., oil change, maintenance' },
    { name: 'Parking', placeholder: 'e.g., daily parking fees' },
    { name: 'Car Payment', placeholder: 'e.g., monthly auto loan' }
  ],
  'Housing & Utilities': [
    { name: 'Rent/Mortgage', placeholder: 'Monthly rent or home payment' },
    { name: 'Electricity', placeholder: 'Monthly power bill' },
    { name: 'Water', placeholder: 'City/utility water charges' },
    { name: 'Internet', placeholder: 'Home WiFi or cable' },
    { name: 'Phone', placeholder: 'e.g., cell phone bill' },
    { name: 'Insurance', placeholder: 'Home/renter\'s insurance' }
  ],
  'Bills & Services': [
    { name: 'Gym Membership', placeholder: 'e.g., fitness club, yoga' },
    { name: 'Subscriptions', placeholder: 'e.g., Netflix, Spotify' },
    { name: 'Banking Fees', placeholder: 'e.g., monthly checking fees' },
    { name: 'Professional Services', placeholder: 'e.g., therapy, coaching' },
    { name: 'Phone Bill', placeholder: 'e.g., monthly mobile plan' }
  ],
  'Entertainment & Personal': [
    { name: 'Netflix', placeholder: 'e.g., streaming services' },
    { name: 'Spotify', placeholder: 'e.g., music subscriptions' },
    { name: 'Amazon Prime', placeholder: 'e.g., membership services' },
    { name: 'Movies', placeholder: 'e.g., theater tickets' },
    { name: 'Shopping', placeholder: 'e.g., clothes, personal items' },
    { name: 'Personal Care', placeholder: 'e.g., haircuts, beauty' }
  ]
};

export const ExpenseCategorySection: React.FC<ExpenseCategorySectionProps> = ({
  category,
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subcategory, setSubcategory] = useState('');
  const [amount, setAmount] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const IconComponent = category.icon;
  const categoryTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const subcategoryOptions = SUBCATEGORY_OPTIONS[category.name] || [];

  // Get placeholder for current subcategory
  const getPlaceholder = () => {
    if (subcategory === 'custom') {
      return 'e.g., your specific expense';
    }
    const option = subcategoryOptions.find(opt => opt.name === subcategory);
    return option ? option.placeholder : 'e.g., monthly amount';
  };

  const handleSubmit = async () => {
    const finalSubcategory = subcategory === 'custom' ? customSubcategory : subcategory;
    const numericAmount = parseFloat(amount);

    if (!finalSubcategory || !numericAmount || numericAmount <= 0) return;

    setIsLoading(true);
    try {
      await onAddExpense({
        category: category.name,
        subcategory: finalSubcategory,
        amount: numericAmount
      });

      // Reset form
      setSubcategory('');
      setAmount('');
      setCustomSubcategory('');
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSubcategory('');
    setAmount('');
    setCustomSubcategory('');
    setEditingId(null);
  };

  const canSubmit = (subcategory === 'custom' ? customSubcategory : subcategory) && 
                   amount && 
                   parseFloat(amount) > 0;

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

          {/* Inline Add Form */}
          {isFormOpen && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3 animate-fade-in">
              <div className="space-y-3">
                {/* Subcategory Selection */}
                <div>
                  <Select value={subcategory} onValueChange={setSubcategory}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategoryOptions.map((option) => (
                        <SelectItem key={option.name} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">
                        <div className="flex items-center">
                          <Plus className="h-4 w-4 mr-2" />
                          Custom subcategory...
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom subcategory input */}
                {subcategory === 'custom' && (
                  <Input
                    value={customSubcategory}
                    onChange={(e) => setCustomSubcategory(e.target.value)}
                    placeholder="Enter custom subcategory"
                    className="h-9"
                  />
                )}

                {/* Amount Input with dynamic placeholder */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="pl-6 h-9"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isLoading}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    ) : (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    Add
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="border-gray-300"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

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
          {!isFormOpen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(true)}
              className="w-full border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {category.name} Expense
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
