export interface YesNoAnswerProps {
  selectedAnswer: boolean | null;
  onAnswerSelect: (answer: boolean | null) => void;
  isLoading?: boolean;
  solution: {
    answer: boolean;
    explanation: string;
  };
} 