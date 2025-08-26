
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  hover?: boolean
  onClick?: () => void
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  hover = true,
  onClick
}) => {
  const shouldReduceMotion = useReducedMotion()

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        delay: shouldReduceMotion ? 0 : delay,
        ease: 'easeOut'
      }
    }
  }

  const hoverVariants = hover && !shouldReduceMotion ? {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  } : {}

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverVariants}
      whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
      style={{
        willChange: 'transform, opacity'
      }}
    >
      <Card className="h-full transition-shadow duration-200 hover:shadow-xl">
        {children}
      </Card>
    </motion.div>
  )
}
