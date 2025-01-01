import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { cn } from '../styles/utils'
import { BaseSize, BaseVariant } from '../types'

type SelectVariant = 'default' | 'error'

export interface SelectOption {
  value: string
  label: string
  color?: BaseVariant
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label?: string
  error?: string
  size?: BaseSize
  variant?: SelectVariant
  fullWidth?: boolean
  className?: string
}

const sizeClasses: Record<BaseSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const variantClasses: Record<SelectVariant, string> = {
  default: 'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-500',
  error: 'border-error-300 hover:border-error-400 text-error-900 focus:border-error-500 focus:ring-error-500'
}

const optionColorClasses: Record<BaseVariant, string> = {
  default: 'text-gray-900',
  primary: 'text-primary-600',
  success: 'text-success-600',
  error: 'text-error-600',
  warning: 'text-warning-600'
}

export function Select({
  value,
  onChange,
  options,
  label,
  error,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className = ''
}: SelectProps) {
  const selectedOption = options.find(option => option.value === value)

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={cn(
              'relative w-full cursor-default rounded-lg border-2',
              'text-left focus:outline-none focus:ring-2 focus:ring-offset-2',
              'transition-colors duration-200',
              sizeClasses[size],
              variantClasses[variant],
              className
            )}
          >
            <span className="block truncate">
              {selectedOption?.label || 'Select an option'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) => cn(
                    'relative cursor-default select-none',
                    sizeClasses[size],
                    active && 'bg-primary-50',
                    option.color ? optionColorClasses[option.color] : optionColorClasses.default
                  )}
                >
                  {({ selected }) => (
                    <span className={cn(
                      'block truncate',
                      selected ? 'font-medium' : 'font-normal'
                    )}>
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && (
        <p className="mt-2 text-sm text-error-600">
          {error}
        </p>
      )}
    </div>
  )
} 