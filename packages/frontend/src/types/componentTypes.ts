import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import type { ColorVariant } from '../theme/utils'

// Common types
export type Size = 'sm' | 'md' | 'lg'
export type Variant = ColorVariant | 'outline'

// Base component props
export interface BaseProps {
  className?: string
  children?: ReactNode
}

// Button props
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'>, BaseProps {
  variant?: Variant
  size?: Size
  isFullWidth?: boolean
  isDisabled?: boolean
  isLoading?: boolean
}

// Input props
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>, BaseProps {
  value: string | number
  onChange: (value: string) => void
  label?: string
  error?: string
  size?: Size
  variant?: 'default' | 'error'
  isFullWidth?: boolean
}

// Select props
export interface SelectOption {
  value: string
  label: string
  color?: ColorVariant
}

export interface SelectProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label?: string
  error?: string
  size?: Size
  variant?: 'default' | 'error'
  isFullWidth?: boolean
  isDisabled?: boolean
}

// Card props
export interface CardProps extends BaseProps {
  variant?: ColorVariant
  isInteractive?: boolean
  isElevated?: boolean
  onClick?: () => void
}

// Typography props
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'
export type TextColor = ColorVariant | 'muted'
export type TextElement = 'p' | 'span' | 'div' | 'label'

export interface TextProps extends BaseProps {
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
  as?: TextElement
  htmlFor?: string
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingProps extends BaseProps {
  level: HeadingLevel
  variant?: ColorVariant
}

// Animation props
export interface FadeInOutProps extends BaseProps {
  show: boolean
}

export interface ShakeProps extends BaseProps {
  shouldShake: boolean
  scale?: number
}

export interface InteractiveProps extends BaseProps {
  isDisabled?: boolean
  onClick?: () => void
}

// Layout props
export interface ContainerProps extends BaseProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface PageProps extends BaseProps {
  background?: 'gradient' | 'white' | 'gray'
}

export interface SectionProps extends BaseProps {
  padding?: 'none' | 'sm' | 'md' | 'lg'
} 