export type MultipleChoiceVariant = 
  | 'softBlue'
  | 'softOrange'
  | 'softPurple'
  | 'softTeal'

export interface MultipleChoiceAnswerProps {
  options: {
    text: string
    isCorrect: boolean
    explanation?: string
  }[]
  selectedAnswer: number | null
  onAnswerSelect: (answer: number | null) => void
  isLoading?: boolean
} 