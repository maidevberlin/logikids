import { AnswerOptionCard } from './'

interface Option {
  text: string
  isCorrect: boolean
}

interface SingleChoiceAnswerProps {
  taskId?: string
  options: Option[]
  selectedAnswer: number | null
  onAnswerSelect: (index: number) => void
  isLocked?: boolean
}

export function SingleChoiceAnswer({
  taskId,
  options,
  selectedAnswer,
  onAnswerSelect,
  isLocked = false,
}: SingleChoiceAnswerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {options.map((option, index) => (
        <AnswerOptionCard
          key={index}
          content={option.text}
          index={index}
          isSelected={selectedAnswer === index}
          onClick={() => onAnswerSelect(index)}
          isLocked={isLocked}
          taskId={taskId}
          ttsField={`options:${index}`}
        />
      ))}
    </div>
  )
}
