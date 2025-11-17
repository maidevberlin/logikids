import { Task } from './types'
import { DifficultySelector } from './DifficultySelector'

interface TaskHeaderProps {
  task: Task
  difficulty: 'easy' | 'medium' | 'hard'
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void
}

export function TaskHeader({ task, difficulty, onDifficultyChange }: TaskHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
      <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">{task.title}</h2>
      <DifficultySelector
        difficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
      />
    </div>
  )
}
