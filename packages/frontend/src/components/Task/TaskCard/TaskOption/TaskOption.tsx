import { cn } from '../../../../utils/cn'
import { TaskOptionProps } from './types'
import { option, variants } from './styles'

export const TaskOption = ({
  onClick,
  label,
  disabled = false,
  variant = 'primary',
  className,
  icon: Icon,
  iconPosition = 'left',
}: TaskOptionProps) => {
  const iconElement = Icon && <Icon className={option.icon} />
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(option.base, variants[variant], className)}
    >
      {iconPosition === 'left' && iconElement}
      <span className={option.content}>{label}</span>
      {iconPosition === 'right' && iconElement}
    </button>
  )
} 