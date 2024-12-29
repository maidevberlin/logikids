import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { getColorClasses } from '../../../theme/utils'

type SelectSize = 'sm' | 'md' | 'lg'
type SelectVariant = 'default' | 'error'

export interface SelectOption {
  value: string
  label: string
  color?: 'primary' | 'success' | 'error' | 'warning'
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label?: string
  error?: string
  size?: SelectSize
  variant?: SelectVariant
  fullWidth?: boolean
  className?: string
}

const sizeClasses: Record<SelectSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
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
  const colorClasses = getColorClasses({
    variant: variant === 'error' ? 'error' : 'default',
    border: true,
    text: true,
    hover: true
  })

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className={`
          block mb-2 font-medium
          ${getColorClasses({ variant: 'default', text: true })}
        `}>
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={`
              relative w-full cursor-default rounded-lg border-2
              ${sizeClasses[size]}
              ${colorClasses}
              text-left
              focus:outline-none focus:ring-2 focus:ring-offset-2
              transition-colors duration-200
              ${className}
            `}
          >
            <span className="block truncate">
              {selectedOption?.label || 'Select an option'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className={`h-5 w-5 ${getColorClasses({ variant: 'default', text: true })}`}
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
                  className={({ active }) => `
                    relative cursor-default select-none
                    ${sizeClasses[size]}
                    ${active ? getColorClasses({ variant: 'primary', bg: true }) : ''}
                    ${option.color ? getColorClasses({ variant: option.color, text: true }) : getColorClasses({ variant: 'default', text: true })}
                  `}
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
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
        <p className={`
          mt-2 text-sm
          ${getColorClasses({ variant: 'error', text: true })}
        `}>
          {error}
        </p>
      )}
    </div>
  )
} 