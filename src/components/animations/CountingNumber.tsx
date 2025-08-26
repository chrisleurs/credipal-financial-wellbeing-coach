
import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface CountingNumberProps {
  from: number
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  onComplete?: () => void
}

export const CountingNumber: React.FC<CountingNumberProps> = ({
  from,
  to,
  duration = 1,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  onComplete
}) => {
  const shouldReduceMotion = useReducedMotion()
  const [currentValue, setCurrentValue] = useState(from)

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrentValue(to)
      onComplete?.()
      return
    }

    const difference = to - from
    const increment = difference / (duration * 60) // 60fps
    let current = from

    const timer = setInterval(() => {
      current += increment
      
      if (
        (increment > 0 && current >= to) ||
        (increment < 0 && current <= to)
      ) {
        current = to
        setCurrentValue(current)
        clearInterval(timer)
        onComplete?.()
      } else {
        setCurrentValue(current)
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [from, to, duration, shouldReduceMotion, onComplete])

  const formatNumber = (value: number) => {
    const rounded = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
    return decimals > 0 ? rounded.toFixed(decimals) : Math.round(rounded).toString()
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {prefix}{formatNumber(currentValue)}{suffix}
    </motion.span>
  )
}
