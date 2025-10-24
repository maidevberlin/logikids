import { Difficulty, Task } from '../types'


export interface TaskCardProps {
  isLoading: boolean
  task: Task | null
  selectedAnswer: number | boolean | null
  difficulty: Difficulty
  error: string | null
  isCorrect: boolean | null
  onAnswerSelect: (answer: number | boolean | null) => void
  onAnswerSubmit: () => void
  onNextTask: () => void
  onDifficultyChange: (difficulty: Difficulty) => void
  onHintUsed: () => void
  hints: string[]
  requestHint: () => void
  hintLoading: boolean
  hintError: string | null
  canRequestHint: boolean
}
