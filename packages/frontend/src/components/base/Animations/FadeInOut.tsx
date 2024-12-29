import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInOutProps {
  children: ReactNode
  show?: boolean
  direction?: 'up' | 'down'
  className?: string
  duration?: number
}

export function FadeInOut({ 
  children, 
  show = true, 
  direction = 'up',
  className = '',
  duration = 200
}: FadeInOutProps) {
  const y = direction === 'up' ? 10 : -10

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0, y }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -y }}
          transition={{ duration: duration / 1000 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
} 