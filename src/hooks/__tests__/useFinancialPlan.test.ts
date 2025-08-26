
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFinancialPlan } from '../useFinancialPlan'

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  })),
  channel: vi.fn(() => ({
    on: vi.fn(() => ({
      subscribe: vi.fn()
    }))
  }))
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'test-user-id' } })
}))

describe('useFinancialPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useFinancialPlan())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.plan).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should handle updateBigGoal correctly', async () => {
    const { result } = renderHook(() => useFinancialPlan())
    
    await act(async () => {
      await result.current.updateBigGoal('goal-1', { progress: 50 })
    })
    
    expect(mockSupabase.from).toHaveBeenCalledWith('financial_plans')
  })

  it('should handle completeMiniGoal correctly', async () => {
    const { result } = renderHook(() => useFinancialPlan())
    
    await act(async () => {
      await result.current.completeMiniGoal('mini-goal-1')
    })
    
    expect(mockSupabase.from).toHaveBeenCalledWith('financial_plans')
  })

  it('should refresh plan data', async () => {
    const { result } = renderHook(() => useFinancialPlan())
    
    await act(async () => {
      await result.current.refreshPlan()
    })
    
    expect(mockSupabase.from).toHaveBeenCalled()
  })
})
