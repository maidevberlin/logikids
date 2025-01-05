export interface YesNoAnswerProps {
  selectedAnswer: boolean | null;
  onAnswerSelect: (answer: boolean | null) => void;
  onSubmit: () => void;
  onNextTask: () => void;
  isLoading?: boolean;
  solution: {
    answer: boolean;
    explanation: string;
  };
} 