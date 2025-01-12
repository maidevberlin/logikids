import { motion } from 'framer-motion'
import { InteractiveProps } from './types'
import { INTERACTIVE_TIMING } from './constants'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'

export function Interactive({ 
  children, 
  as = 'div',
  onClick,
  disabled = false,
  className = ''
}: InteractiveProps) {
  const Component = motion[as]

  return (
    <Component
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={INTERACTIVE_TIMING.easing.spring}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        styles.base,
        disabled && styles.disabled,
        className
      )}
    >
      {children}
    </Component>
  )
} 