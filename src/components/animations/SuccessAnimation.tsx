
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle, Sparkles } from 'lucide-react'

interface SuccessAnimationProps {
  show: boolean
  title?: string
  message?: string
  onComplete?: () => void
  duration?: number
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  title = '¡Felicidades!',
  message = 'Meta completada',
  onComplete,
  duration = 3000
}) => {
  const shouldReduceMotion = useReducedMotion()
  const [confettiPieces] = useState(() => 
    Array.from({ length: shouldReduceMotion ? 0 : 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360
    }))
  )

  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, duration)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete, duration])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        >
          {/* Confetti */}
          {!shouldReduceMotion && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {confettiPieces.map((piece) => (
                <motion.div
                  key={piece.id}
                  className="absolute w-3 h-3"
                  style={{
                    left: `${piece.x}%`,
                    top: '-10px'
                  }}
                  initial={{ 
                    y: -100,
                    rotate: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    y: window.innerHeight + 100,
                    rotate: piece.rotation * 4,
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: piece.delay,
                    ease: 'linear'
                  }}
                >
                  <Sparkles className="w-full h-full text-yellow-400" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Success Card */}
          <motion.div
            className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            initial={{ 
              scale: shouldReduceMotion ? 1 : 0.5,
              opacity: 0,
              y: shouldReduceMotion ? 0 : 50
            }}
            animate={{ 
              scale: 1,
              opacity: 1,
              y: 0
            }}
            exit={{ 
              scale: shouldReduceMotion ? 1 : 0.8,
              opacity: 0
            }}
            transition={{
              type: shouldReduceMotion ? 'tween' : 'spring',
              damping: 15,
              stiffness: 300,
              duration: shouldReduceMotion ? 0 : undefined
            }}
          >
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : 0.2,
                duration: shouldReduceMotion ? 0 : 0.5,
                type: 'spring',
                damping: 10
              }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : 0.4,
                duration: shouldReduceMotion ? 0 : 0.3
              }}
            >
              {title}
            </motion.h2>

            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : 0.5,
                duration: shouldReduceMotion ? 0 : 0.3
              }}
            >
              {message}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
