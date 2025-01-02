import { ReactNode } from 'react'
import { SettingsButton } from '../../../Settings/SettingsButton'
import { StatsButton } from '../../../Stats/StatsButton'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'
import { TaskButton } from '../../../Task/TaskCard/TaskButton'

interface NavigationProps {
  children?: ReactNode
  className?: string
  fixed?: boolean
}

export function Navigation({ 
  children,
  className,
  fixed = false 
}: NavigationProps) {
  return (
    <nav className={cn(
      styles.base,
      fixed && styles.fixed,
      className
    )}>
      <TaskButton />
      <StatsButton />
      <SettingsButton />
      {children}
    </nav>
  )
} 