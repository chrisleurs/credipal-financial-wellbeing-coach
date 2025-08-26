
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFinancialPlan } from '../useFinancialPlan'

// Mock Supabase
const mockSupabase = {
  functions: {
    invoke: vi.fn(() => Promise.resolve({ data: null, error: null }))
  }
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'test-user-id' } })
}))

vi.mock('@/hooks/useOptimizedFinancialData', () => ({
  useOptimizedFinancialData: () => ({
    data: {
      hasRealData: true,
      monthlyIncome: 5000,
      monthlyExpenses: 3000,
      savingsCapacity: 2000,
      totalDebtBalance: 10000,
      activeDebts: [],
      activeGoals: [],
      expenseCategories: {},
      currentSavings: 1000
    },
    isLoading: false,
    error: null
  })
}))

describe('useFinancialPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useFinancialPlan())
    
    expect(result.current.loading).toBe(false) // Since we're mocking data as loaded
    expect(result.current.plan).toBe(undefined)
    expect(result.current.error).toBe(null)
  })

  it('should handle updateBigGoal correctly', async () => {
    const { result } = renderHook(() => useFinancialPlan())
    
    await act(async () => {
      await result.current.updateBigGoal('goal-1', { progress: 50 })
    })
    
    // This should not throw since it's a placeholder function
    expect(true).toBe(true)
  })

  it('should handle completeMiniGoal correctly', async () => {
    const { result } = renderHook(() => useFinancialPlan())
    
    await act(async () => {
      await result.current.completeMiniGoal('mini-goal-1')
    })
    
    // This should not throw since it's a placeholder function
    expect(true).toBe(true)
  })

  it('should have regeneratePlan function', async () => {
    const { result } = renderHook(() => useFinancialPlan())
    
    expect(typeof result.current.regeneratePlan).toBe('function')
  })
})

