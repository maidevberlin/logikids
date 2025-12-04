import { ReactNode } from 'react'

export type SelectorVariant = 'default' | 'grid' | 'icon' | 'flag'

interface SelectorButtonProps<T = string> {
  value: T
  isSelected: boolean
  onChange: (value: T) => void
  variant?: SelectorVariant
  className?: string
  children: ReactNode
}

/**
 * Reusable selector button component with different visual variants
 * Eliminates code duplication across GradeSelector, LanguageSelector
 */
export function SelectorButton<T = string>({
  value,
  isSelected,
  onChange,
  variant = 'default',
  className = '',
  children,
}: SelectorButtonProps<T>) {
  const baseClasses = 'flex items-center justify-center transition-all duration-200'

  const variantClasses: Record<SelectorVariant, string> = {
    default: `rounded-2xl ${
      isSelected
        ? 'bg-primary text-white shadow-md scale-110'
        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
    }`,
    grid: `h-24 rounded-2xl text-3xl font-bold border ${
      isSelected
        ? 'bg-primary text-white border-primary shadow-md scale-105'
        : 'bg-card text-foreground shadow-xs hover:shadow-md hover:scale-[1.02]'
    }`,
    icon: `w-16 h-16 rounded-full ${
      isSelected
        ? 'bg-primary text-white shadow-md scale-110'
        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
    }`,
    flag: `w-20 h-20 rounded-2xl text-4xl ${
      isSelected
        ? 'bg-primary/10 shadow-md scale-110 ring-2 ring-primary'
        : 'bg-muted hover:bg-muted/80 hover:scale-105'
    }`,
  }

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
