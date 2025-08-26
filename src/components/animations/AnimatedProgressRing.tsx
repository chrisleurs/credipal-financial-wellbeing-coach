
import React, { useEffect, useState } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'

interface AnimatedProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  duration?: number
  color?: string
  backgroundColor?: string
  showLabel?: boolean
  className?: string
}

export const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  duration = 1.5,
  color = '#10b981',
  backgroundColor = '#e5e7eb',
  showLabel = true,
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion()
  const controls = useAnimation()
  const [displayProgress, setDisplayProgress] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const animationDuration = shouldReduceMotion ? 0 : duration

    // Animate the stroke
    controls.start({
      strokeDashoffset: offset,
      transition: {
        duration: animationDuration,
        ease: 'easeOut'
      }
    })

    // Animate the number counting
    if (!shouldReduceMotion) {
      let start = 0
      const increment = progress / (duration * 60) // 60fps
      const timer = setInterval(() => {
        start += increment
        if (start >= progress) {
          start = progress
          clearInterval(timer)
        }
        setDisplayProgress(Math.round(start))
      }, 1000 / 60)

      return () => clearInterval(timer)
    } else {
      setDisplayProgress(progress)
    }
  }, [progress, offset, controls, duration, shouldReduceMotion])

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          animate={controls}
          initial={{ strokeDashoffset: circumference }}
        />
      </svg>

      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-lg font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : duration * 0.3,
              duration: shouldReduceMotion ? 0 : 0.3 
            }}
          >
            {displayProgress}%
          </motion.span>
        </div>
      )}
    </div>
  )
}
