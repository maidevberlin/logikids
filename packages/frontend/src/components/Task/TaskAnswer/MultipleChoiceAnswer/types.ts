export type MultipleChoiceVariant = 
  | 'softBlue'
  | 'softOrange'
  | 'softPurple'
  | 'softTeal'
  | 'selectedBlue'
  | 'selectedOrange'
  | 'selectedPurple'
  | 'selectedTeal'

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