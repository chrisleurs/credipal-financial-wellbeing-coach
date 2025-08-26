
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFinancialPlan } from '../useFinancialPlan'
import { supabase } from '@/integrations/supabase/client'
import type { FinancialCoachPlan } from '@/types/coach'

// Mock dependencies
jest.mock('@/integrations/supabase/client')
jest.mock('../useAuth', () => ({
  useAuth: () => ({ user: { id: 'test-user-id' } })
}))
jest.mock('../useOptimizedFinancialData', () => ({
  useOptimizedFinancialData: () => ({ data: mockFinancialData })
}))
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() })
}))

const mockFinancialData = {
  monthlyIncome: 5000,
  monthlyExpenses: 3000,
  totalDebtBalance: 10000,
  hasRealData: true
}

const mockPlan: FinancialCoachPlan = {
  id: 'test-plan-id',
  userId: 'test-user-id',
  planName: 'Test Plan',
  methodology: '3.2.1',
  coachMessage: {
    id: 'msg-1',
    text: 'Test message',
    type: 'motivational',
    motivationLevel: 'high',
    personalizedGreeting: 'Hello!',
    timestamp: new Date().toISOString()
  },
  bigGoals: [
    {
      id: 'goal-1',
      type: 'debt_elimination',
      title: 'Eliminate Credit Card Debt',
      description: 'Pay off credit card',
      targetAmount: 5000,
      currentAmount: 1000,
      progress: 20,
      timeline: '6 months',
      status: 'in_progress',
      emoji: '💳',
      milestones: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  miniGoals: [
    {
      id: 'mini-1',
      title: 'Save lunch money',
      description: 'Pack lunch 4 days this week',
      targetValue: 4,
      currentValue: 0,
      unit: 'days',
      difficulty: 'easy',
      points: 50,
      weekStartDate: new Date().toISOString(),
      weekEndDate: new Date().toISOString(),
      status: 'not_started',
      emoji: '🥪',
      completionReward: 'Great job!',
      isCompleted: false
    }
  ],
  immediateAction: {
    id: 'action-1',
    title: 'Review budget',
    description: 'Review monthly budget',
    priority: 'immediate',
    estimatedMinutes: 15,
    category: 'planning',
    dueDate: new Date().toISOString(),
    isCompleted: false,
    emoji: '📊',
    impact: 'Better financial awareness'
  },
  weekNumber: 1,
  totalWeeks: 12,
  overallProgress: 25,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastCoachingDate: new Date().toISOString(),
  stats: {
    streak: 5,
    completedBigGoals: 0,
    completedMiniGoals: 0,
    completedActions: 0,
    totalPoints: 0,
    currentLevel: 1,
    progressThisWeek: 0,
    motivationTrend: []
  }
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useFinancialPlan', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch financial plan data successfully', async () => {
    const mockSupabase = supabase as jest.Mocked<typeof supabase>
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  maybeSingle: jest.fn().mockResolvedValue({
                    data: { plan_data: mockPlan },
                    error: null
                  })
                })
              })
            })
          })
        })
      })
    } as any)

    const { result } = renderHook(
      () => useFinancialPlan('test-user-id'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.plan).toEqual(mockPlan)
    expect(result.current.error).toBeNull()
  })

  it('should handle plan update with optimistic updates', async () => {
    const mockSupabase = supabase as jest.Mocked<typeof supabase>
    
    // Setup initial fetch
    mockSupabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  maybeSingle: jest.fn().mockResolvedValue({
                    data: { plan_data: mockPlan },
                    error: null
                  })
                })
              })
            })
          })
        })
      })
    } as any)

    // Setup update
    mockSupabase.from.mockReturnValueOnce({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { ...mockPlan, updatedAt: new Date().toISOString() },
                  error: null
                })
              })
            })
          })
        })
      })
    } as any)

    const { result } = renderHook(
      () => useFinancialPlan('test-user-id', { optimisticUpdates: true }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Test big goal update
    await result.current.updateBigGoal('goal-1', { progress: 50 })
    
    expect(result.current.loadingStates.updatingBigGoal).toBe(false)
  })

  it('should handle errors gracefully', async () => {
    const mockSupabase = supabase as jest.Mocked<typeof supabase>
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  maybeSingle: jest.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Database error' }
                  })
                })
              })
            })
          })
        })
      })
    } as any)

    const { result } = renderHook(
      () => useFinancialPlan('test-user-id'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Database error')
    expect(result.current.plan).toBeNull()
  })

  it('should complete mini goals successfully', async () => {
    const mockSupabase = supabase as jest.Mocked<typeof supabase>
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  maybeSingle: jest.fn().mockResolvedValue({
                    data: { plan_data: mockPlan },
                    error: null
                  })
                })
              })
            })
          })
        })
      })
    } as any)

    const { result } = renderHook(
      () => useFinancialPlan('test-user-id'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await result.current.completeMiniGoal('mini-1')
    expect(result.current.loadingStates.updatingMiniGoal).toBe(false)
  })

  it('should handle cache invalidation', async () => {
    const { result } = renderHook(
      () => useFinancialPlan('test-user-id'),
      { wrapper: createWrapper() }
    )

    result.current.invalidateCache()
    expect(result.current.invalidateCache).toBeDefined()
  })

  it('should calculate stale data correctly', async () => {
    const { result } = renderHook(
      () => useFinancialPlan('test-user-id', { cacheTimeout: 1000 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isStale).toBeDefined()
    })
  })
})
