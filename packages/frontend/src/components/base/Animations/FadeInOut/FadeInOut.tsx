import { motion, AnimatePresence } from 'framer-motion'
import { FadeInOutProps } from './types'
import { FADE_TIMING } from './constants'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'

export function FadeInOut({ 
  children, 
  show = true, 
  direction = 'up',
  className = '',
  duration = FADE_TIMING.duration.default
}: FadeInOutProps) {
  const y = direction === 'up' ? 10 : -10

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0, y }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -y }}
          transition={{ 
            duration: duration / 1000,
            ease: FADE_TIMING.easing.default
          }}
          className={cn(styles.base, className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
} 