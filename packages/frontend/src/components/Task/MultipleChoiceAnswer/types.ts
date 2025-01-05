export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface MultipleChoiceAnswerProps {
  options: MultipleChoiceOption[]
  selectedAnswer: number | null
  onAnswerSelect: (index: number | null) => void
  onSubmit: () => void
  onNextTask: () => void
  isLoading?: boolean
} 