
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button, ButtonProps } from '@/components/ui/button'

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
  haptic?: boolean
  pulseOnHover?: boolean
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  haptic = false,
  pulseOnHover = false,
  className = '',
  onClick,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Haptic feedback simulation
    if (haptic && !shouldReduceMotion && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    onClick?.(e)
  }

  const buttonVariants = {
    tap: shouldReduceMotion ? {} : { 
      scale: 0.95,
      transition: { duration: 0.1, ease: "easeInOut" as const }
    },
    hover: shouldReduceMotion ? {} : {
      scale: pulseOnHover ? 1.05 : 1.02,
      transition: { duration: 0.2, ease: "easeOut" as const }
    }
  }

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      style={{ willChange: 'transform' }}
    >
      <Button
        className={`transition-all duration-200 ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}

export const FloatingActionButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  className?: string
}> = ({ children, onClick, className = '' }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      className={`
        fixed bottom-20 right-4 z-40 w-14 h-14 bg-primary text-white rounded-full
        shadow-lg flex items-center justify-center transition-shadow duration-200
        hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/50
        ${className}
      `}
      onClick={onClick}
      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
      animate={shouldReduceMotion ? {} : {
        y: [0, -4, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.button>
  )
}
