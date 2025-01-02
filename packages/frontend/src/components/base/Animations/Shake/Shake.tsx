import { motion } from 'framer-motion'
import { ShakeProps } from './types'
import { SHAKE_TIMING } from './constants'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'

export function Shake({ 
  children, 
  shouldShake,
  scale = 1.02,
  className = ''
}: ShakeProps) {
  return (
    <motion.div
      animate={shouldShake ? {
        x: [0, -10, 10, -10, 10, 0],
        scale: [1, scale, scale, scale, scale, 1]
      } : undefined}
      transition={{
        duration: SHAKE_TIMING.duration.fast / 1000,
        ease: SHAKE_TIMING.easing.default
      }}
      className={cn(styles.base, className)}
    >
      {children}
    </motion.div>
  )
} 