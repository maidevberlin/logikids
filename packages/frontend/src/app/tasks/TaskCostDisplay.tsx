import { TaskUsageInfo } from './types'

interface TaskCostDisplayProps {
  usage?: TaskUsageInfo
}

export function TaskCostDisplay({ usage }: TaskCostDisplayProps) {
  if (!usage) {
    return null
  }

  // Format cost in USD with appropriate precision
  const formatCost = (cost: number) => {
    if (cost < 0.01) {
      return `$${(cost * 1000).toFixed(2)}m` // Show in millicents for very small amounts
    }
    return `$${cost.toFixed(4)}`
  }

  return (
    <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
      {usage.cost !== undefined && (
        <span className="font-mono font-semibold text-foreground/70">
          {formatCost(usage.cost)}
        </span>
      )}
      <span className="flex items-center gap-1">
        <span className="font-mono">↓{usage.inputTokens.toLocaleString()}</span>
        <span className="font-mono">↑{usage.outputTokens.toLocaleString()}</span>
        {usage.totalTokens && (
          <span className="font-mono">Σ{usage.totalTokens.toLocaleString()}</span>
        )}
      </span>
      <span className="text-[10px] opacity-70">tokens</span>
    </div>
  )
}
