import { Card } from '@/components/ui/card'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface Option {
  text: string
  isCorrect: boolean
  explanation?: string
}

interface MultipleChoiceAnswerProps {
  options: Option[]
  selectedAnswer: number | null
  onAnswerSelect: (index: number) => void
  isLoading?: boolean
}

const OPTION_COLORS = [
  'hover:border-blue-400 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-50 data-[selected=true]:shadow-lg',
  'hover:border-purple-400 data-[selected=true]:border-purple-500 data-[selected=true]:bg-purple-50 data-[selected=true]:shadow-lg',
  'hover:border-emerald-400 data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-50 data-[selected=true]:shadow-lg',
  'hover:border-pink-400 data-[selected=true]:border-pink-500 data-[selected=true]:bg-pink-50 data-[selected=true]:shadow-lg',
]

export function MultipleChoiceAnswer({
  options,
  selectedAnswer,
  onAnswerSelect,
  isLoading = false,
}: MultipleChoiceAnswerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {options.map((option, index) => (
        <Card
          key={index}
          data-selected={selectedAnswer === index}
          onClick={() => onAnswerSelect(index)}
          className={cn(
            'p-6 cursor-pointer transition-all duration-200 border-2',
            OPTION_COLORS[index % OPTION_COLORS.length]
          )}
        >
          <MarkdownRenderer
            content={option.text}
            enableMath={true}
            enableMermaid={false}
            enableCode={false}
          />
        </Card>
      ))}
    </div>
  )
}
