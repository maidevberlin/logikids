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
  'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-100 data-[selected=true]:shadow-lg data-[selected=true]:scale-[1.02]',
  'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100 data-[selected=true]:border-purple-500 data-[selected=true]:bg-purple-100 data-[selected=true]:shadow-lg data-[selected=true]:scale-[1.02]',
  'bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100 data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-100 data-[selected=true]:shadow-lg data-[selected=true]:scale-[1.02]',
  'bg-pink-50 border-pink-200 hover:border-pink-400 hover:bg-pink-100 data-[selected=true]:border-pink-500 data-[selected=true]:bg-pink-100 data-[selected=true]:shadow-lg data-[selected=true]:scale-[1.02]',
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
