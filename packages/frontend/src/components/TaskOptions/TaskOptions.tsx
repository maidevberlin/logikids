import { Difficulty, Age } from '../../types/task'

interface TaskOptionsProps {
  age: Age
  difficulty: Difficulty
  onAgeChange: (age: Age) => void
  onDifficultyChange: (difficulty: Difficulty) => void
}

export function TaskOptions({ age, difficulty, onAgeChange, onDifficultyChange }: TaskOptionsProps) {
  return (
    <div className="flex gap-4 justify-center mb-4">
      <AgeSelect age={age} onAgeChange={onAgeChange} />
      <DifficultySelect difficulty={difficulty} onDifficultyChange={onDifficultyChange} />
    </div>
  )
}

interface AgeSelectProps {
  age: Age
  onAgeChange: (age: Age) => void
}

function AgeSelect({ age, onAgeChange }: AgeSelectProps) {
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
        {Array.from({ length: 14 }, (_, i) => i + 6).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  )
}

interface DifficultySelectProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
}

function DifficultySelect({ difficulty, onDifficultyChange }: DifficultySelectProps) {
  return (
    <div>
      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
        Difficulty
      </label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  )
} 