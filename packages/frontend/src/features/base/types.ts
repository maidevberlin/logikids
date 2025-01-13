export type BaseSize = 'sm' | 'md' | 'lg'

// Core variants for basic components
export type CoreVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'

// Soft color variants for interactive elements
export type SoftVariant = 'softBlue' | 'softOrange' | 'softPurple' | 'softTeal'
export const SOFT_VARIANTS: SoftVariant[] = ['softBlue', 'softOrange', 'softPurple', 'softTeal']

export type SelectedVariant = 'selectedBlue' | 'selectedOrange' | 'selectedPurple' | 'selectedTeal'
export const SELECTED_VARIANTS: SelectedVariant[] = ['selectedBlue', 'selectedOrange', 'selectedPurple', 'selectedTeal']

// Combined variant type for all possible variants
export type BaseVariant = CoreVariant | SoftVariant | SelectedVariant
export type BaseColorVariant = BaseVariant | 'outline'

export interface BaseStyleProps {
  className?: string
}

export interface BaseSizeProps {
  size?: BaseSize
}

export interface BaseVariantProps {
  variant?: BaseColorVariant
}

export interface BaseInteractiveProps {
  disabled?: boolean
  onClick?: () => void
} 