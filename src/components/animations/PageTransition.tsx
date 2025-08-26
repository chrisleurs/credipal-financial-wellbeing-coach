
import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: React.ReactNode
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  const pageVariants = {
    initial: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : -20,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: 'easeIn'
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Staggered container for lists
export const StaggerContainer: React.FC<{ 
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}> = ({ 
  children, 
  className = '',
  staggerDelay = 0.1 
}) => {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}
