import { motion } from 'framer-motion'
import { ShakeProps } from './types'
import { SHAKE_TIMING } from './constants'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'

export function Shake({ 
  children,
  active = false,
  className = ''
}: ShakeProps) {
  return (
    <motion.div
      animate={active ? {
        x: [0, -10, 10, -10, 10, -5, 5, 0]
      } : undefined}
      transition={SHAKE_TIMING.easing.spring}
      className={cn(styles.base, className)}
    >
      {children}
    </motion.div>
  )
} 