import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ShakeProps {
  children: ReactNode
  shouldShake: boolean
  scale?: number
  className?: string
}

export function Shake({ 
  children, 
  shouldShake,
  scale = 1.05,
  className = ''
}: ShakeProps) {
  return (
    <motion.div 
      animate={{ scale: shouldShake ? scale : 1 }} 
      className={`${shouldShake ? 'animate-shake' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
} 