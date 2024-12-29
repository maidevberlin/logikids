import { Difficulty } from '../../types/task'
import { BaseSelect, SelectOption } from './BaseSelect'

interface DifficultySelectProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
}

const difficulties: SelectOption<Difficulty>[] = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' },
]

export function DifficultySelect({ difficulty, onDifficultyChange }: DifficultySelectProps) {
  return (
    <BaseSelect
      value={difficulty}
      options={difficulties}
      onChange={onDifficultyChange}
      align="right"
    />
  )
} 