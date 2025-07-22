
import React, { useState, useMemo } from 'react';
import { Plus, DollarSign, TrendingDown, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useExpenses, type Expense } from '@/hooks/useExpenses';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { DeleteExpenseDialog } from '@/components/expenses/DeleteExpenseDialog';
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters';

export default function Expenses() {
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenses();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesCategory = filters.category === 'all' || expense.category === filters.category;
      const matchesDateFrom = !filters.dateFrom || expense.expense_date >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || expense.expense_date <= filters.dateTo;
      
      return matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [expenses, filters]);

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleAddExpense = async (data: any) => {
    const result = await addExpense(data);
    return result;
  };

  const handleEditExpense = async (data: any) => {
    if (!editingExpense) return { success: false };
    const result = await updateExpense(editingExpense.id, data);
    if (result.success) {
      setEditingExpense(null);
    }
    return result;
  };

  const handleDeleteExpense = async () => {
    if (!deletingExpense) return;
    const result = await deleteExpense(deletingExpense.id);
    if (result.success) {
      setDeletingExpense(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gastos</h1>
          <p className="text-muted-foreground">Gestiona y rastrea tus gastos</p>
        </div>
        
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Gasto
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-sm text-muted-foreground">
              {filteredExpenses.length} gasto{filteredExpenses.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Promedio por Gasto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">
              {formatCurrency(filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Este Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-secondary">
              {formatCurrency(
                expenses
                  .filter(expense => {
                    const expenseDate = new Date(expense.expense_date);
                    const now = new Date();
                    return expenseDate.getMonth() === now.getMonth() && 
                           expenseDate.getFullYear() === now.getFullYear();
                  })
                  .reduce((sum, expense) => sum + expense.amount, 0)
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <ExpenseFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Expenses by Category */}
      {Object.keys(expensesByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(expensesByCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => (
                <div key={category} className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">{category}</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((amount / totalExpenses) * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No se encontraron gastos
            </h3>
            <p className="text-muted-foreground mb-4">
              {expenses.length === 0 
                ? 'Comienza agregando tu primer gasto'
                : 'Prueba ajustando los filtros o agrega nuevos gastos'
              }
            </p>
            <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Gasto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div 
                  key={expense.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground">{expense.description}</h4>
                      <Badge variant="secondary">{expense.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(expense.expense_date)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-destructive">
                        -{formatCurrency(expense.amount)}
                      </p>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingExpense(expense)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingExpense(expense)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExpense}
        title="Agregar Nuevo Gasto"
      />

      <ExpenseModal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        onSubmit={handleEditExpense}
        expense={editingExpense || undefined}
        title="Editar Gasto"
      />

      <DeleteExpenseDialog
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteExpense}
        expenseDescription={deletingExpense?.description || ''}
      />
    </div>
  );
}
