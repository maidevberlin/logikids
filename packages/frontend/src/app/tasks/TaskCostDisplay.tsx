import { TaskUsageInfo } from './types'

interface TaskCostDisplayProps {
  taskUsage?: TaskUsageInfo
  hintUsage?: TaskUsageInfo
}

export function TaskCostDisplay({ taskUsage, hintUsage }: TaskCostDisplayProps) {
  // Calculate combined totals
  const hasTaskUsage = taskUsage && taskUsage.inputTokens > 0
  const hasHintUsage = hintUsage && hintUsage.inputTokens > 0

  if (!hasTaskUsage && !hasHintUsage) {
    return null
  }

  const totalInputTokens = (taskUsage?.inputTokens || 0) + (hintUsage?.inputTokens || 0)
  const totalOutputTokens = (taskUsage?.outputTokens || 0) + (hintUsage?.outputTokens || 0)
  const totalCost = (taskUsage?.cost || 0) + (hintUsage?.cost || 0)

  // Format cost in cents
  const formatCost = (cost: number) => {
    const cents = cost * 100
    if (cents < 0.1) {
      return `${cents.toFixed(3)}¢`
    }
    if (cents < 1) {
      return `${cents.toFixed(2)}¢`
    }
    return `${cents.toFixed(1)}¢`
  }

  const formatTokens = (num: number) => {
    if (num >= 10000) {
      return `${(num / 1000).toFixed(0)}k`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <div className="flex items-center justify-end gap-3 mt-6 pt-3 border-t border-border/30">
      {/* Token usage pill */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 text-[11px] text-muted-foreground/80">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-600/70 dark:text-emerald-400/70">↓</span>
          <span className="font-medium tabular-nums">{formatTokens(totalInputTokens)}</span>
        </div>
        <div className="w-px h-3 bg-border/50" />
        <div className="flex items-center gap-1.5">
          <span className="text-blue-600/70 dark:text-blue-400/70">↑</span>
          <span className="font-medium tabular-nums">{formatTokens(totalOutputTokens)}</span>
        </div>
      </div>

      {/* Cost pill */}
      {totalCost > 0 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-800 dark:bg-amber-200 text-[11px]">
          <span className="font-medium tabular-nums text-amber-100 dark:text-amber-800">
            {formatCost(totalCost)}
          </span>
        </div>
      )}
    </div>
  )
}
