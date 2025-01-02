export interface NumberInputProps {
  /** The current value */
  value: number
  /** Callback when value changes */
  onChange: (value: number) => void
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
} 