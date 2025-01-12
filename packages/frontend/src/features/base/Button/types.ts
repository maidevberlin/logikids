import { ButtonHTMLAttributes, ReactNode } from 'react'

export type BaseSize = 'sm' | 'md' | 'lg'
export type BaseVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'outline'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  children?: ReactNode
  className?: string
  variant?: BaseVariant
  size?: BaseSize
  fullWidth?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  iconOnly?: boolean
} 