export type BaseSize = 'sm' | 'md' | 'lg'
export type BaseVariant = 'default' | 'primary' | 'success' | 'error' | 'warning'
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