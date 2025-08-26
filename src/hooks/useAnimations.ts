
import React, { useReducedMotion } from 'framer-motion'

export const useAnimations = () => {
  const shouldReduceMotion = useReducedMotion()

  // Standard animation durations
  const durations = {
    fast: shouldReduceMotion ? 0 : 0.15,
    normal: shouldReduceMotion ? 0 : 0.3,
    slow: shouldReduceMotion ? 0 : 0.5,
    extra: shouldReduceMotion ? 0 : 1
  }

  // Standard easing functions
  const easings = {
    easeOut: [0.0, 0.0, 0.2, 1],
    easeIn: [0.4, 0.0, 1, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55]
  }

  // Common animation variants
  const variants = {
    fadeIn: {
      hidden: { 
        opacity: 0, 
        y: shouldReduceMotion ? 0 : 20 
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: durations.normal,
          ease: easings.easeOut
        }
      }
    },
    slideUp: {
      hidden: { 
        opacity: 0, 
        y: shouldReduceMotion ? 0 : 50 
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: durations.normal,
          ease: easings.easeOut
        }
      }
    },
    scaleIn: {
      hidden: { 
        opacity: 0, 
        scale: shouldReduceMotion ? 1 : 0.8 
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: durations.normal,
          ease: easings.bounce
        }
      }
    },
    stagger: {
      visible: {
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.1
        }
      }
    }
  }

  // Performance optimization helpers
  const optimizeForPerformance = (element: HTMLElement) => {
    if (shouldReduceMotion) return

    element.style.willChange = 'transform, opacity'
    element.style.backfaceVisibility = 'hidden'
    element.style.perspective = '1000px'
  }

  const cleanupPerformanceOptimizations = (element: HTMLElement) => {
    element.style.willChange = 'auto'
    element.style.backfaceVisibility = 'visible'
    element.style.perspective = 'none'
  }

  return {
    shouldReduceMotion,
    durations,
    easings,
    variants,
    optimizeForPerformance,
    cleanupPerformanceOptimizations
  }
}

// Hook for number counting animation
export const useCountingAnimation = (
  target: number,
  duration: number = 1000,
  startValue: number = 0
) => {
  const shouldReduceMotion = useReducedMotion()
  const [current, setCurrent] = React.useState(startValue)

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setCurrent(target)
      return
    }

    let start = startValue
    const increment = (target - startValue) / (duration / 16) // 60fps
    
    const animate = () => {
      start += increment
      if (start >= target) {
        setCurrent(target)
        return
      }
      setCurrent(Math.round(start))
      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [target, duration, startValue, shouldReduceMotion])

  return current
}
