import { Input } from '@/app/common/ui/input'
import { MarkdownRenderer } from '@/app/common/MarkdownRenderer'
import { cn } from '@/app/common/cn'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'

interface FillInBlankAnswerProps {
  fillableText: string
  blanksCount: number
  selectedAnswer: string[] | null
  onAnswerSelect: (answers: string[]) => void
  isLocked?: boolean
}

export function FillInBlankAnswer({
  fillableText,
  blanksCount,
  selectedAnswer,
  onAnswerSelect,
  isLocked = false,
}: FillInBlankAnswerProps) {
  const { t } = useTranslation()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize answers array if null
  // Defensive check: ensure selectedAnswer is actually an array (handles race condition during task type changes)
  const answers =
    selectedAnswer && Array.isArray(selectedAnswer) ? selectedAnswer : Array(blanksCount).fill('')

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    onAnswerSelect(newAnswers)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && index < blanksCount - 1) {
      // Move to next input on Enter
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Parse fillableText and replace __blank__ markers with inputs (case-insensitive)
  const parts: (string | JSX.Element)[] = []
  let blankIndex = 0
  let lastIndex = 0
  const blankRegex = /__blank__/gi // Case-insensitive
  let match

  while ((match = blankRegex.exec(fillableText)) !== null) {
    // Add text before the blank (rendered through MarkdownRenderer for LaTeX support)
    if (match.index > lastIndex) {
      const textPart = fillableText.substring(lastIndex, match.index)
      parts.push(
        <MarkdownRenderer
          key={`text-${lastIndex}`}
          content={textPart}
          enableMath={true}
          enableMermaid={false}
          enableCode={false}
          noParagraphMargin={true}
          className="inline"
        />
      )
    }

    const currentBlankIndex = blankIndex

    // Add the input field
    parts.push(
      <span key={`blank-${blankIndex}`} className="inline-flex items-center gap-1 mx-1">
        <span className="text-xs text-muted-foreground font-medium">#{blankIndex + 1}</span>
        <Input
          ref={(el) => (inputRefs.current[currentBlankIndex] = el)}
          type="text"
          value={answers[currentBlankIndex] || ''}
          onChange={(e) => handleInputChange(currentBlankIndex, e.target.value)}
          onKeyDown={(e) => handleKeyDown(currentBlankIndex, e)}
          disabled={isLocked}
          className={cn(
            'inline-block w-32 h-10 text-center border-0 border-b-2 rounded-none',
            'bg-muted/50 text-foreground border-border',
            'transition-colors focus-visible:ring-0 focus-visible:outline-none focus:border-primary',
            isLocked && 'cursor-not-allowed opacity-75',
            answers[currentBlankIndex] && 'border-primary'
          )}
          placeholder="..."
        />
      </span>
    )

    lastIndex = match.index + match[0].length
    blankIndex++
  }

  // Add remaining text after last blank (rendered through MarkdownRenderer for LaTeX support)
  if (lastIndex < fillableText.length) {
    const textPart = fillableText.substring(lastIndex)
    parts.push(
      <MarkdownRenderer
        key={`text-${lastIndex}`}
        content={textPart}
        enableMath={true}
        enableMermaid={false}
        enableCode={false}
        noParagraphMargin={true}
        className="inline"
      />
    )
  }

  return (
    <div className="my-6 space-y-4">
      <div className="text-sm text-muted-foreground text-center mb-4">
        {t('task.fillInBlanks', { count: blanksCount })}
      </div>
      <div className="text-lg leading-relaxed text-center p-6 bg-card rounded-2xl border border-border">
        {parts}
      </div>
    </div>
  )
}
