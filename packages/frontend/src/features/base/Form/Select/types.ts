import { BaseSize, CoreVariant } from '../../types'

export type SelectVariant = 'default' | 'error'

export type SelectOption = {
  value: string
  label: string
  color?: CoreVariant
}

export interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label?: string
  error?: string
  size?: BaseSize
  variant?: SelectVariant
  fullWidth?: boolean
  className?: string
  renderOption?: (option: SelectOption) => React.ReactNode
} 