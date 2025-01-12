import { motion } from 'framer-motion'
import { SequenceProps } from './types'
import { SEQUENCE_TIMING } from './constants'
import { styles } from './styles'
import { cn } from '../../../../utils/cn'

export function Sequence({ 
  children, 
  controls,
  className = ''
}: SequenceProps) {
  return (
    <motion.div
      animate={controls}
      transition={{
        duration: SEQUENCE_TIMING.duration / 1000,
        ease: SEQUENCE_TIMING.easing
      }}
      className={cn(styles.base, className)}
    >
      {children}
    </motion.div>
  )
} 