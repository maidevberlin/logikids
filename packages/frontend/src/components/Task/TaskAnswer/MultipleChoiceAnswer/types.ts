export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

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