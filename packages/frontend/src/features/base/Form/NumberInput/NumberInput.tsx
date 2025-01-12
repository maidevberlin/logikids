import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { cn } from '../../../../utils/cn'
import { NumberInputProps } from './types'
import { styles } from './styles'

export function NumberInput({ value, onChange, min, max }: NumberInputProps) {
  const [localValue, setLocalValue] = useState(value.toString())
  const [isInvalid, setIsInvalid] = useState(false)

  useEffect(() => {
    setLocalValue(value.toString())
    setIsInvalid(false)
  }, [value])

  const validateNumber = (num: number): boolean => {
    return !isNaN(num) && (min === undefined || num >= min) && (max === undefined || num <= max)
  }

  const decrease = () => {
    if (min === undefined || value > min) {
      onChange(value - 1)
    }
  }

  const increase = () => {
    if (max === undefined || value < max) {
      onChange(value + 1)
    }
  }

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault()
    decrease()
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault()
    increase()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increase()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decrease()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setLocalValue(inputValue)

    const newValue = parseInt(inputValue, 10)
    if (!isNaN(newValue)) {
      const isValid = validateNumber(newValue)
      setIsInvalid(!isValid)
      if (isValid) {
        onChange(newValue)
      }
    }
  }

  const handleBlur = () => {
    const newValue = parseInt(localValue, 10)
    if (isNaN(newValue) || !validateNumber(newValue)) {
      setLocalValue(value.toString())
      setIsInvalid(false)
    }
  }

  const getErrorMessage = () => {
    const num = parseInt(localValue, 10)
    if (isNaN(num)) return null
    if (min !== undefined && num < min) return `Min: ${min}`
    if (max !== undefined && num > max) return `Max: ${max}`
    return null
  }

  const errorMessage = getErrorMessage()

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={handleDecrease}
          className={cn(
            styles.button.base,
            styles.button.left,
            isInvalid && styles.button.error
          )}
        >
          <MinusIcon className={styles.icon} aria-hidden="true" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn(
            styles.field.base,
            isInvalid && styles.field.error
          )}
        />
        <button
          type="button"
          onClick={handleIncrease}
          className={cn(
            styles.button.base,
            styles.button.right,
            isInvalid && styles.button.error
          )}
        >
          <PlusIcon className={styles.icon} aria-hidden="true" />
        </button>
      </div>
      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  )
} 