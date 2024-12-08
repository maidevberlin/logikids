import { useState, useEffect } from 'react'
import { logikids } from '../services/logikids'
import { 
  TaskResponse, 
  ArithmeticOperation, 
  GeometryOperation,
  TASK_TYPES,
  TaskType 
} from '../types/task'
import { HintResponse } from '../types/hints'

export type TaskWithOptions = TaskResponse & { options: string[] }

type UseTaskReturn = {
  task: TaskWithOptions | null
  hint: HintResponse | null
  loading: boolean
  error: string | null
  requestHint: () => Promise<void>
}

function useTaskBase(type: TaskType, operation?: ArithmeticOperation | GeometryOperation): UseTaskReturn {
  const [task, setTask] = useState<TaskWithOptions | null>(null)
  const [hint, setHint] = useState<HintResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchTask = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await logikids.getTask(type, operation, abortController.signal)
        // Only set the state if the request wasn't aborted
        if (!abortController.signal.aborted) {
          setTask(data)
        }
      } catch (err) {
        // Only set error if it's not an abort error and the request wasn't aborted
        if (err instanceof Error && err.name !== 'AbortError' && !abortController.signal.aborted) {
          setError(err.message)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchTask()

    // Cleanup function to abort any in-flight requests
    return () => {
      abortController.abort()
    }
  }, [type, operation])

  const requestHint = async () => {
    if (!task) return

    try {
      const hintData = await logikids.getHint(task)
      setHint(hintData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get hint')
    }
  }

  return { task, hint, loading, error, requestHint }
}

export function useArithmeticTask(operation?: ArithmeticOperation): UseTaskReturn {
  return useTaskBase(TASK_TYPES[0], operation)
}

export function useGeometryTask(operation?: GeometryOperation): UseTaskReturn {
  return useTaskBase(TASK_TYPES[1], operation)
} 