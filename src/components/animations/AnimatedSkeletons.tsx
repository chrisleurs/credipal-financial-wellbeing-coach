
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

interface AnimatedSkeletonProps {
  className?: string
  delay?: number
}

export const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({
  className = '',
  delay = 0
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        delay: shouldReduceMotion ? 0 : delay,
        duration: shouldReduceMotion ? 0 : 0.3
      }}
    >
      <Skeleton className={className} />
    </motion.div>
  )
}

export const HeroCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl p-6 animate-pulse">
      <div className="text-center space-y-4">
        <AnimatedSkeleton className="h-6 w-48 mx-auto" delay={0.1} />
        <AnimatedSkeleton className="h-12 w-32 mx-auto" delay={0.2} />
        <AnimatedSkeleton className="h-4 w-64 mx-auto" delay={0.3} />
        <AnimatedSkeleton className="h-10 w-40 mx-auto rounded-lg" delay={0.4} />
      </div>
    </div>
  )
}

export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 animate-pulse border">
      <div className="flex items-center justify-between mb-4">
        <AnimatedSkeleton className="h-10 w-10 rounded-lg" delay={0.1} />
        <AnimatedSkeleton className="h-4 w-12" delay={0.2} />
      </div>
      <AnimatedSkeleton className="h-3 w-20 mb-2" delay={0.3} />
      <AnimatedSkeleton className="h-8 w-24" delay={0.4} />
    </div>
  )
}

export const GoalCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 animate-pulse border">
      <div className="flex items-start gap-3 mb-4">
        <AnimatedSkeleton className="h-10 w-10 rounded-full" delay={0.1} />
        <div className="flex-1 space-y-2">
          <AnimatedSkeleton className="h-4 w-32" delay={0.2} />
          <AnimatedSkeleton className="h-3 w-20" delay={0.3} />
        </div>
      </div>
      <div className="space-y-3">
        <AnimatedSkeleton className="h-2 w-full" delay={0.4} />
        <div className="grid grid-cols-2 gap-4">
          <AnimatedSkeleton className="h-4 w-16" delay={0.5} />
          <AnimatedSkeleton className="h-4 w-16" delay={0.6} />
        </div>
        <AnimatedSkeleton className="h-10 w-full rounded-lg" delay={0.7} />
      </div>
    </div>
  )
}
