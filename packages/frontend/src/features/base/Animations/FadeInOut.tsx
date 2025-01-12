import { motion, AnimatePresence } from 'framer-motion'
import { PropsWithChildren } from 'react'

interface FadeInOutProps extends PropsWithChildren {
  show?: boolean
  className?: string
}

export function FadeInOut({ children, show = true, className = '' }: FadeInOutProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
} 