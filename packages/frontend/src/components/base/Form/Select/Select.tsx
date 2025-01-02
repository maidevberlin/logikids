import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { cn } from '../../../../utils/cn'
import { SelectProps } from './types'
import { styles } from './styles'

export function Select({
  value,
  onChange,
  options,
  label,
  error,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className = '',
  renderOption
}: SelectProps) {
  const selectedOption = options.find(opt => opt.value === value) || options[0]

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={cn(styles.container.base, fullWidth && styles.container.fullWidth, className)}>
        {label && (
          <Listbox.Label className={styles.label}>
            {label}
          </Listbox.Label>
        )}
        <Listbox.Button
          className={cn(
            styles.button.base,
            styles.button.sizes[size],
            styles.button.variants[error ? 'error' : variant]
          )}
        >
          <div className={styles.value}>
            {renderOption ? (
              renderOption(selectedOption)
            ) : (
              <span className={cn(
                styles.options.option.text,
                selectedOption.color && styles.options.option.variants[selectedOption.color]
              )}>
                {selectedOption.label}
              </span>
            )}
          </div>
          <ChevronUpDownIcon className={styles.icon} aria-hidden="true" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave={styles.transition.leave}
          leaveFrom={styles.transition.leaveFrom}
          leaveTo={styles.transition.leaveTo}
        >
          <Listbox.Options className={styles.options.container}>
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) => cn(
                  styles.options.option.base,
                  active && styles.options.option.active
                )}
              >
                {({ selected }) => (
                  <div className={styles.options.option.container}>
                    <div className={styles.options.option.content}>
                      {renderOption ? renderOption(option) : (
                        <span className={cn(
                          styles.options.option.text,
                          selected ? styles.options.option.selected : styles.options.option.notSelected,
                          option.color && styles.options.option.variants[option.color]
                        )}>
                          {option.label}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}
      </div>
    </Listbox>
  )
} 