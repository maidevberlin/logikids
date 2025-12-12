import { useState, useCallback, useEffect } from 'react'
import { trpc } from '@/app/common/trpc'

export interface HintUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost?: number
}

interface UseHintOptions {
  taskId?: string
  maxHints?: number
  onHintReceived?: (usage?: HintUsage) => void
}

export const useHint = ({ taskId, maxHints = 4, onHintReceived }: UseHintOptions) => {
  const [hints, setHints] = useState<string[]>([])
  const [hintError, setHintError] = useState<string | null>(null)
  const [totalHintUsage, setTotalHintUsage] = useState<HintUsage>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    cost: 0,
  })

  // Reset hints when task changes
  useEffect(() => {
    setHints([])
    setHintError(null)
    setTotalHintUsage({ inputTokens: 0, outputTokens: 0, totalTokens: 0, cost: 0 })
  }, [taskId])

  const hintMutation = trpc.tasks.getHint.useMutation()

  const requestHint = useCallback(async () => {
    if (hints.length < maxHints && !hintMutation.isPending && taskId) {
      try {
        const data = await hintMutation.mutateAsync({ taskId })
        setHints((prev) => [...prev, data.hint])
        setHintError(null)

        // Accumulate hint usage
        if (data.usage) {
          setTotalHintUsage((prev) => ({
            inputTokens: prev.inputTokens + data.usage!.inputTokens,
            outputTokens: prev.outputTokens + data.usage!.outputTokens,
            totalTokens: prev.totalTokens + data.usage!.totalTokens,
            cost: (prev.cost || 0) + (data.usage!.cost || 0),
          }))
        }

        onHintReceived?.(data.usage)
      } catch (error) {
        setHintError(error instanceof Error ? error.message : 'Failed to get hint')
      }
    }
  }, [hints.length, maxHints, hintMutation, taskId, onHintReceived])

  return {
    hints,
    hintsUsed: hints.length,
    requestHint,
    hintLoading: hintMutation.isPending,
    hintError,
    canRequestHint: hints.length < maxHints && !hintMutation.isPending,
    totalHintUsage,
  }
}
