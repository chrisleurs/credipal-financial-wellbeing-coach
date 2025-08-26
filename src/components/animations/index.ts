
// Animation Components Export
export { AnimatedProgressRing } from './AnimatedProgressRing'
export { CountingNumber } from './CountingNumber'
export { AnimatedCard } from './AnimatedCard'
export { SuccessAnimation } from './SuccessAnimation'
export { AnimatedSkeleton, HeroCardSkeleton, MetricCardSkeleton, GoalCardSkeleton } from './AnimatedSkeletons'
export { PageTransition, StaggerContainer } from './PageTransition'
export { AnimatedButton, FloatingActionButton } from './ButtonAnimations'

// Animation Hooks
export { useAnimations, useCountingAnimation } from '../hooks/useAnimations'

// Animation Utilities
export const createSpringConfig = (stiffness = 300, damping = 30, mass = 1) => ({
  type: 'spring' as const,
  stiffness,
  damping,
  mass
})

export const createTimingConfig = (duration = 0.3, ease = 'easeOut') => ({
  type: 'tween' as const,
  duration,
  ease
})
