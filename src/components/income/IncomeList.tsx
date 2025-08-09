
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, DollarSign, Trash2 } from 'lucide-react'
import { Income, NewIncome } from '@/types/income'

export function IncomeList() {
  const { user } = useAuth()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newIncome, setNewIncome] = useState<NewIncome>({
    source: '',
    amount: '',
    frequency: 'monthly'
  })
  
  const fetchIncomes = async () => {
    if (!user?.id) return
    
    const { data } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    setIncomes(data || [])
  }
  
  useEffect(() => {
    if (user?.id) fetchIncomes()
  }, [user])
  
  const addIncome = async () => {
    if (!newIncome.source || !newIncome.amount || !user?.id) return
    
    const { error } = await supabase.from('incomes').insert({
      user_id: user.id,
      source: newIncome.source,
      amount: parseFloat(newIncome.amount),
      frequency: newIncome.frequency
    })
    
    if (!error) {
      setNewIncome({ source: '', amount: '', frequency: 'monthly' })
      setShowForm(false)
      fetchIncomes()
    }
  }
  
  const deleteIncome = async (id: string) => {
    const { error } = await supabase
      .from('incomes')
      .update({ is_active: false })
      .eq('id', id)
    
    if (!error) {
      fetchIncomes()
    }
  }
  
  const totalMonthlyIncome = incomes.reduce((sum, inc) => {
    const multiplier = inc.frequency === 'weekly' ? 4 : 
                      inc.frequency === 'biweekly' ? 2 : 1
    return sum + (inc.amount * multiplier)
  }, 0)
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Income Sources</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center">
          <DollarSign className="h-6 w-6 text-green-600 mr-2" />
          <div>
            <p className="text-sm text-green-600 font-medium">Total Monthly Income</p>
            <p className="text-2xl font-bold text-green-800">
              ${totalMonthlyIncome.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      {showForm && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-4">
            <Input
              placeholder="Income source (e.g., Salary)"
              value={newIncome.source}
              onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
            />
            <select
              value={newIncome.frequency}
              onChange={(e) => setNewIncome({...newIncome, frequency: e.target.value as NewIncome['frequency']})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Monthly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="weekly">Weekly</option>
              <option value="one-time">One-time</option>
            </select>
            <Button onClick={addIncome} className="w-full">
              Add Income
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {incomes.map((income) => (
          <div key={income.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div>
              <p className="font-medium text-gray-900">{income.source}</p>
              <p className="text-sm text-gray-500">
                ${income.amount.toLocaleString()} - {income.frequency}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteIncome(income.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {incomes.length === 0 && !showForm && (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium mb-2">No income sources yet</p>
            <p className="text-sm">Add your first income source to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
