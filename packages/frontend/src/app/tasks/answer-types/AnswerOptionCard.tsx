import { ReactNode } from 'react'
import { Card } from '@/app/common/ui/card'
import { MarkdownRenderer } from '@/app/common/MarkdownRenderer'
import { PlayButton } from '@/app/common/PlayButton'
import { cn } from '@/lib/utils'
import { OPTION_COLORS } from '@/app/common/colors.ts'

interface AnswerOptionCardProps {
  /** Markdown content to render */
  content: string
  /** Index for color selection (from OPTION_COLORS) */
  index: number
  /** Whether this option is selected */
  isSelected: boolean
  /** Click handler */
  onClick: () => void
  /** Lock interaction */
  isLocked?: boolean
  /** Task ID for TTS */
  taskId?: string
  /** TTS field name (e.g., "options:0") */
  ttsField?: string
  /** Additional CSS classes */
  className?: string
  /** Custom content to render instead of markdown (e.g., for checkboxes) */
  children?: ReactNode
}

/**
 * Reusable card component for answer options.
 * Handles markdown rendering, TTS button, colors, and interaction states.
 */
export function AnswerOptionCard({
  content,
  index,
  isSelected,
  onClick,
  isLocked = false,
  taskId,
  ttsField,
  className,
  children,
}: AnswerOptionCardProps) {
  return (
    <Card
      data-selected={isSelected}
      onClick={isLocked ? undefined : onClick}
      className={cn(
        'p-6 transition-all duration-200 border-2 min-h-24',
        isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer',
        OPTION_COLORS[index % OPTION_COLORS.length],
        className
      )}
    >
      {children || (
        <div className="flex items-center gap-2 w-full">
          <MarkdownRenderer
            content={content}
            className="flex-1"
            enableMath={true}
            enableMermaid={false}
            enableCode={false}
            noParagraphMargin={true}
          />
          {taskId && ttsField && <PlayButton taskId={taskId} field={ttsField} />}
        </div>
      )}
    </Card>
  )
}
