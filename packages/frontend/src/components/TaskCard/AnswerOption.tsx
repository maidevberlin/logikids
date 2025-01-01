import { Button } from '../base/Button/Button'

interface AnswerOptionProps {
  text: string
  isSelected: boolean
  isCorrect: boolean | null
  isDisabled: boolean
  onClick: () => void
}

export function AnswerOption({
  text,
  isSelected,
  isCorrect,
  isDisabled,
  onClick
}: AnswerOptionProps) {
  let variantClass = ''
  if (isCorrect !== null && isSelected) {
    variantClass = isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
  } else if (isSelected) {
    variantClass = 'border-primary-500 bg-primary-50'
  }

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      variant="outline"
      className={`text-left h-full ${variantClass}`}
    >
      <div 
        className="text-lg font-medium text-gray-900 prose prose-blue max-w-none"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </Button>
  )
} 