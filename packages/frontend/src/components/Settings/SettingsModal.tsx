import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Age } from '../../types/task'
import { NumberInput } from '../Common/NumberInput'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  age: Age
  name: string
  onAgeChange: (age: Age) => void
  onNameChange: (name: string) => void
}

export function SettingsModal({
  isOpen,
  onClose,
  age,
  name,
  onAgeChange,
  onNameChange,
}: SettingsModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900">
                      Settings
                    </Dialog.Title>
                    <div className="mt-8 space-y-8">
                      <div>
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                          What's your name?
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={name}
                          onChange={(e) => onNameChange(e.target.value)}
                          className="block w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                          placeholder="Type your name here..."
                        />
                      </div>
                      <div>
                        <label htmlFor="age" className="block text-lg font-medium text-gray-700 mb-2">
                          How old are you?
                        </label>
                        <div className="flex justify-center sm:justify-start">
                          <NumberInput
                            value={Number(age)}
                            onChange={(value) => onAgeChange(value as Age)}
                            min={5}
                            max={20}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 