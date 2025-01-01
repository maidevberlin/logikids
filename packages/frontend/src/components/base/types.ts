export type BaseSize = 'sm' | 'md' | 'lg'
export type BaseVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
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