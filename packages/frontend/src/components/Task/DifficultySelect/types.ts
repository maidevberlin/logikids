import { Difficulty } from '../types'

export interface DifficultySelectProps {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
  disabled?: boolean
} 