import { Task, Difficulty } from '../types'

export interface TaskCardProps {
  isLoading: boolean
  task: Task | null
  selectedAnswer: number | null
  difficulty: Difficulty
  error?: string | null
  onAnswerSelect: (index: number | null) => void
  onAnswerSubmit: () => void
  onNextTask: () => void
  onDifficultyChange: (difficulty: Difficulty) => void
  onHintUsed?: () => void
}
