import { Difficulty } from '../../types/task'

interface DifficultySelectProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
}

export function DifficultySelect({ difficulty, onDifficultyChange }: DifficultySelectProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

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
        {difficulties.map((level) => (
          <option key={level} value={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
} 