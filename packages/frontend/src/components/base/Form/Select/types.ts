import { BaseSize, BaseVariant } from '../../types'

export type SelectVariant = 'default' | 'error'

export interface SelectOption {
  /** The value of the option */
  value: string
  /** The label to display */
  label: string
  /** Optional color variant */
  color?: BaseVariant
  /** Additional CSS classes */
  className?: string
}

export interface SelectProps {
  /** The current value */
  value: string
  /** Callback when value changes */
  onChange: (value: string) => void
  /** Array of options */
  options: SelectOption[]
  /** Optional label */
  label?: string
  /** Optional error message */
  error?: string
  /** Size variant */
  size?: BaseSize
  /** Visual variant */
  variant?: SelectVariant
  /** Whether to take full width */
  fullWidth?: boolean
  /** Additional CSS classes */
  className?: string
  /** Optional custom render function for options */
  renderOption?: (option: SelectOption) => React.ReactNode
} 