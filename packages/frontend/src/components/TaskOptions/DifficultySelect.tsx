import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { Difficulty } from '../../types/task'

interface DifficultySelectProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
}

const difficulties: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' },
]

export function DifficultySelect({ difficulty, onDifficultyChange }: DifficultySelectProps) {
  const selectedDifficulty = difficulties.find(d => d.value === difficulty) || difficulties[0]

  return (
    <Listbox value={difficulty} onChange={onDifficultyChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-3 text-rightfocus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500">
          <span className={`inline-flex rounded-md px-2 py-1 text-sm font-medium ${selectedDifficulty.color}`}>
            {selectedDifficulty.label}
          </span>
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
          <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {difficulties.map((level) => (
              <Listbox.Option
                key={level.value}
                value={level.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-3 pr-9 text-right ${
                    active ? 'bg-indigo-50' : 'bg-white'
                  }`
                }
              >
                {({ selected }) => (
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    <span className={`inline-flex rounded-md px-2 py-1 text-sm font-medium ${level.color}`}>
                      {level.label}
                    </span>
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