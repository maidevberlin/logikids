import { useState, useCallback, useEffect } from 'react'
import { trpc } from '@/api/trpc'

interface UseHintOptions {
  taskId?: string
  maxHints?: number
}

export const useHint = ({ taskId, maxHints = 4 }: UseHintOptions) => {
  const [hints, setHints] = useState<string[]>([])
  const [hintError, setHintError] = useState<string | null>(null)

  // Reset hints when task changes
  useEffect(() => {
    setHints([])
    setHintError(null)
  }, [taskId])

  const hintMutation = trpc.tasks.getHint.useMutation()

  const requestHint = useCallback(async () => {
    if (hints.length < maxHints && !hintMutation.isPending && taskId) {
      try {
        const data = await hintMutation.mutateAsync({ taskId })
        setHints((prev) => [...prev, data.hint])
        setHintError(null)
      } catch (error) {
        setHintError(error instanceof Error ? error.message : 'Failed to get hint')
      }
    }
  }, [hints.length, maxHints, hintMutation, taskId])

  return {
    hints,
    hintsUsed: hints.length,
    requestHint,
    hintLoading: hintMutation.isPending,
    hintError,
    canRequestHint: hints.length < maxHints && !hintMutation.isPending,
  }
}
