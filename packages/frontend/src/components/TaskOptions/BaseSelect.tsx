import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'

export interface SelectOption<T> {
  value: T
  label: string
  color: string
}

interface BaseSelectProps<T> {
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  align?: 'left' | 'right'
}

export function BaseSelect<T>({ value, options, onChange, align = 'left' }: BaseSelectProps<T>) {
  const selectedOption = options.find(opt => opt.value === value) || options[0]
  const alignmentClasses = align === 'right' ? 'text-right right-0' : 'text-left left-0'

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-3 text-left focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500">
          <ColoredLabel color={selectedOption.color} label={selectedOption.label} />
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className={`absolute ${alignmentClasses} z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
            {options.map((option) => (
              <Listbox.Option
                key={String(option.value)}
                value={option.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                    active ? 'bg-primary-50' : 'bg-white'
                  } ${align === 'right' ? 'text-right' : ''}`
                }
              >
                {({ selected }) => (
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    <ColoredLabel color={option.color} label={option.label} />
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

interface ColoredLabelProps {
  color: string
  label: string
}

function ColoredLabel({ color, label }: ColoredLabelProps) {
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-sm font-medium ${color}`}>
      {label}
    </span>
  )
} 