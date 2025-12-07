import { Card } from '@/app/common/ui/card'
import { Button } from '@/app/common/ui/button'
import { MarkdownRenderer } from '@/app/common/MarkdownRenderer'
import { PlayButton } from '@/app/common/PlayButton'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/app/common/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { Reorder, useDragControls } from 'framer-motion'
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react'

interface OrderingItem {
  id: string
  content: string
}

interface OrderingAnswerProps {
  taskId?: string
  items: OrderingItem[]
  selectedAnswer: string[] | null
  onAnswerSelect: (orderedIds: string[]) => void
  isLoading?: boolean
  isLocked?: boolean
}

function OrderingItemCard({
  taskId,
  item,
  index,
  isLocked,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  taskId?: string
  item: OrderingItem
  index: number
  isLocked: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className="list-none"
    >
      <Card
        className={cn(
          'p-4 border-2 transition-all duration-200',
          isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-grab active:cursor-grabbing',
          'hover:border-blue-300 hover:shadow-md'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div
            onPointerDown={(e) => !isLocked && dragControls.start(e)}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg',
              isLocked
                ? 'text-muted-foreground/50'
                : 'text-muted-foreground hover:bg-slate-100 cursor-grab active:cursor-grabbing'
            )}
          >
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Order Number */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
            {index + 1}
          </div>

          {/* Content */}
          <div className="flex-1">
            <MarkdownRenderer
              content={item.content}
              enableMath={true}
              enableMermaid={false}
              enableCode={false}
              noParagraphMargin={true}
            />
          </div>

          {/* TTS Button */}
          {taskId && <PlayButton taskId={taskId} field={`items:${index}`} />}

          {/* Accessibility Buttons */}
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={isLocked || !canMoveUp}
              className="h-7 w-7 p-0"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={isLocked || !canMoveDown}
              className="h-7 w-7 p-0"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Reorder.Item>
  )
}

export function OrderingAnswer({
  taskId,
  items,
  selectedAnswer,
  onAnswerSelect,
  isLoading = false,
  isLocked = false,
}: OrderingAnswerProps) {
  const { t } = useTranslation()

  // Initialize with current order or default order
  // Defensive check: ensure selectedAnswer is actually an array (handles race condition during task type changes)
  const orderedItems =
    selectedAnswer && Array.isArray(selectedAnswer)
      ? selectedAnswer.map((id) => items.find((item) => item.id === id)!).filter(Boolean)
      : items

  const handleReorder = (newOrder: OrderingItem[]) => {
    onAnswerSelect(newOrder.map((item) => item.id))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newOrder = [...orderedItems]
    ;[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
    onAnswerSelect(newOrder.map((item) => item.id))
  }

  const handleMoveDown = (index: number) => {
    if (index === orderedItems.length - 1) return
    const newOrder = [...orderedItems]
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    onAnswerSelect(newOrder.map((item) => item.id))
  }

  if (isLoading) {
    return (
      <div className="space-y-3 my-6">
        {items.map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="my-6 space-y-4">
      <div className="text-sm text-muted-foreground text-center mb-4">{t('task.dragToOrder')}</div>

      <Reorder.Group axis="y" values={orderedItems} onReorder={handleReorder} className="space-y-3">
        {orderedItems.map((item, index) => (
          <OrderingItemCard
            key={item.id}
            taskId={taskId}
            item={item}
            index={index}
            isLocked={isLocked}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            canMoveUp={index > 0}
            canMoveDown={index < orderedItems.length - 1}
          />
        ))}
      </Reorder.Group>
    </div>
  )
}
