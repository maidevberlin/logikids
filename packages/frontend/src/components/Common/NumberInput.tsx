import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function NumberInput({ value, onChange, min, max }: NumberInputProps) {
  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    if (min === undefined || value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    if (max === undefined || value < max) {
      onChange(value + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (!isNaN(newValue)) {
      if ((min === undefined || newValue >= min) && (max === undefined || newValue <= max)) {
        onChange(newValue)
      }
    }
  }

  return (
    <div className="flex items-stretch h-12">
      <button
        type="button"
        onClick={handleDecrease}
        className="flex items-center justify-center w-12 rounded-l-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10"
      >
        <MinusIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        className="w-16 border-y border-x-0 border-gray-300 p-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={handleIncrease}
        className="flex items-center justify-center w-12 rounded-r-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10"
      >
        <PlusIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
      </button>
    </div>
  )
} 