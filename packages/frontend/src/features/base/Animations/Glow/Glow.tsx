import { motion } from 'framer-motion'
import { GlowProps } from './types'
import { GLOW_TIMING } from './constants'
import { styles } from './styles'
import { cn } from '../../../../utils/cn'

export function Glow({ 
  children, 
  isGlowing = false,
  glowColor,
  className = ''
}: GlowProps) {
  return (
    <motion.div
      animate={isGlowing ? {
        boxShadow: glowColor ? `0 0 15px ${glowColor}` : undefined
      } : undefined}
      transition={{
        duration: GLOW_TIMING.duration / 1000,
        ease: GLOW_TIMING.easing
      }}
      className={cn(
        styles.base,
        isGlowing && !glowColor && styles.glowing,
        className
      )}
    >
      {children}
    </motion.div>
  )
} 