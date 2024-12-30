import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function NumberInput({ value, onChange, min, max }: NumberInputProps) {
  const [localValue, setLocalValue] = useState(value.toString())
  const [isInvalid, setIsInvalid] = useState(false)

  // Update local value when prop changes
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
    e.preventDefault() // Prevent form submission
    decrease()
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
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

    // Only update parent if the value is a valid number
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
    if (isNaN(newValue)) {
      setLocalValue(value.toString())
      setIsInvalid(false)
    } else if (!validateNumber(newValue)) {
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
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-stretch h-12">
        <button
          type="button"
          onClick={handleDecrease}
          className={clsx(
            "flex items-center justify-center w-12 rounded-l-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10",
            isInvalid && "border-red-300"
          )}
        >
          <MinusIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={clsx(
            "w-16 border-y border-x-0 p-2 text-center text-lg focus:outline-none focus:ring-2 focus:z-10",
            isInvalid 
              ? "border-red-300 text-red-900 focus:ring-red-500" 
              : "border-gray-300 focus:ring-primary-500"
          )}
        />
        <button
          type="button"
          onClick={handleIncrease}
          className={clsx(
            "flex items-center justify-center w-12 rounded-r-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10",
            isInvalid && "border-red-300"
          )}
        >
          <PlusIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
        </button>
      </div>
      {errorMessage && (
        <span className="text-sm text-red-600">{errorMessage}</span>
      )}
    </div>
  )
} 