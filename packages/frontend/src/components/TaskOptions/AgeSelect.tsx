import { Age } from '../../types/task'

interface AgeSelectProps {
  age: Age
  onAgeChange: (age: Age) => void
}

export function AgeSelect({ age, onAgeChange }: AgeSelectProps) {
  const ageRange = Array.from({ length: 14 }, (_, i) => i + 6)

  return (
    <div>
      <label htmlFor="age" className="block text-sm font-medium text-gray-700">
        Age
      </label>
      <select
        id="age"
        value={age}
        onChange={(e) => onAgeChange(Number(e.target.value))}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {ageRange.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  )
} 