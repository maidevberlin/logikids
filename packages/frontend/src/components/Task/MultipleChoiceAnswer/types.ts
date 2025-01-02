export interface MultipleChoiceAnswerProps {
  options: string[]
  selectedAnswer: number | null
  isCorrect: boolean | null
  onAnswerSelect: (index: number | null) => void
  onSubmit: () => void
  onNextTask: () => void
  solutionExplanation: string
  isLoading?: boolean
} 