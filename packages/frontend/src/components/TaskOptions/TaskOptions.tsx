import { Age, Difficulty } from '../../types/task'
import { AgeSelect } from './AgeSelect'
import { DifficultySelect } from './DifficultySelect'

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