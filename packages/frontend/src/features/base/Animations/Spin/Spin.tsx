import { motion } from 'framer-motion'
import { SpinProps } from './types'
import { SPIN_TIMING } from './constants'
import { styles } from './styles'
import { cn } from '../../../../utils/cn'

export function Spin({ 
  children, 
  isSpinning = false,
  duration,
  className = ''
}: SpinProps) {
  return (
    <motion.div
      animate={isSpinning ? {
        rotate: 360
      } : undefined}
      transition={{
        duration: (duration ?? SPIN_TIMING.duration) / 1000,
        ease: SPIN_TIMING.easing,
        repeat: isSpinning ? Infinity : 0
      }}
      className={cn(styles.base, className)}
    >
      {children}
    </motion.div>
  )
} 