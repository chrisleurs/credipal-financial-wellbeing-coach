
import React, { useState, useMemo } from 'react'
import { Home, Car, Utensils, CreditCard, MoreHorizontal, Calculator } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'
import { useOnboardingExpenses, OnboardingExpense } from '@/hooks/useOnboardingExpenses'
import { ExpenseCategorySection } from './ExpenseCategorySection'

interface Step2ExpensesProps {
  onNext: () => void
  onBack: () => void
}

const EXPENSE_CATEGORIES = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: Utensils,
    description: 'Add everything you spend on meals, snacks, groceries, and food delivery.'
  },
  {
    id: 'transport',
    name: 'Transportation',
    icon: Car,
    description: 'Enter how much you spend getting around each month.'
  },
  {
    id: 'housing',
    name: 'Housing & Utilities',
    icon: Home,
    description: 'Include all your housing-related bills and utilities.'
  },
  {
    id: 'bills',
    name: 'Bills & Services',
    icon: CreditCard,
    description: 'Other monthly services or memberships.'
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Personal',
    icon: MoreHorizontal,
    description: 'Individual entertainment and personal expenses (e.g., Netflix, Spotify, Amazon Prime, movies, shopping, personal care)'
  }
];

const Step2Expenses: React.FC<Step2ExpensesProps> = ({ onNext, onBack }) => {
  const { financialData, updateFinancialData } = useFinancialStore()
  const { expenses, addExpense, updateExpense, deleteExpense } = useOnboardingExpenses()
  const [editingExpense, setEditingExpense] = useState<OnboardingExpense | null>(null)

  // Group expenses by category
  const expensesByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = [];
      }
      acc[expense.category].push(expense);
      return acc;
    }, {} as Record<string, OnboardingExpense[]>);
  }, [expenses]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = async (data: { category: string; subcategory: string; amount: number }) => {
    return await addExpense(data);
  };

  const handleEditExpense = (expense: OnboardingExpense) => {
    setEditingExpense(expense);
    // For now, we'll just log this - you can implement inline editing later if needed
    console.log('Edit expense:', expense);
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
  };

  const handleNext = () => {
    // Convert individual expenses to the format expected by the store
    const expenseCategories: Record<string, number> = {};
    
    Object.entries(expensesByCategory).forEach(([category, categoryExpenses]) => {
      const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      if (categoryTotal > 0) {
        expenseCategories[category.toLowerCase().replace(/\s+/g, '_')] = categoryTotal;
      }
    });

    updateFinancialData({
      expenseCategories,
      monthlyExpenses: totalExpenses
    });
    
    onNext();
  };

  const canProceed = totalExpenses > 0;

  return (
    <OnboardingStep
      currentStep={1}
      totalSteps={6}
      title="What are your individual monthly expenses?"
      subtitle="Add specific expenses in each category. Break down your spending so we can give you better insights! 😊"
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
      nextButtonText="Perfect, let's continue!"
    >
      <div className="space-y-4">
        {EXPENSE_CATEGORIES.map((category) => (
          <ExpenseCategorySection
            key={category.id}
            category={category}
            expenses={expensesByCategory[category.name] || []}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        ))}

        {/* Total display */}
        {totalExpenses > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-orange-800 font-medium">Monthly total</span>
              </div>
              <span className="text-xl font-bold text-orange-800">
                ${totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-sm text-orange-700">
              Total individual expenses: {expenses.length} items
            </div>
          </div>
        )}

        {/* Balance preview */}
        {totalExpenses > 0 && financialData.monthlyIncome > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="text-center">
              <p className="text-sm text-blue-700 mb-1">Your estimated balance</p>
              <p className={`text-xl font-bold ${
                (financialData.monthlyIncome + financialData.extraIncome - totalExpenses) >= 0 
                  ? 'text-green-700' 
                  : 'text-red-700'
              }`}>
                ${((financialData.monthlyIncome + financialData.extraIncome) - totalExpenses).toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {(financialData.monthlyIncome + financialData.extraIncome - totalExpenses) >= 0 
                  ? "Great! You have a positive balance 🎉" 
                  : "No worries, we'll find the perfect balance together 💪"}
              </p>
            </div>
          </div>
        )}

        {/* Encouraging note */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
          <p className="text-sm text-emerald-800 text-center">
            <strong>Tip:</strong> Add individual expenses to get detailed insights. You can create custom subcategories 
            for better organization. This helps us provide more personalized recommendations! 🎯
          </p>
        </div>
      </div>
    </OnboardingStep>
  )
}

export default Step2Expenses
