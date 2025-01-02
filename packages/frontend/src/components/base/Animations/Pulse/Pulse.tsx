import { motion } from 'framer-motion'
import { PulseProps } from './types'
import { PULSE_TIMING } from './constants'
import { styles } from './styles'
import { cn } from '../../../../utils/cn'

export function Pulse({ 
  children, 
  isPulsing = false,
  scale = 1.05,
  className = ''
}: PulseProps) {
  return (
    <motion.div
      animate={isPulsing ? {
        scale: [1, scale, 1]
      } : undefined}
      transition={{
        duration: PULSE_TIMING.duration / 1000,
        ease: PULSE_TIMING.easing
      }}
      className={cn(styles.base, className)}
    >
      {children}
    </motion.div>
  )
} 