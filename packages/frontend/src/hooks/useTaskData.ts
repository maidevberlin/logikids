import { trpc } from '@/api/trpc'
import { TaskRequest } from '@/api/types.ts'

/**
 * Hook for fetching task data from the API.
 *
 * This hook is responsible ONLY for data fetching using React Query.
 * It does not handle answer management, hints, timing, or any other concerns.
 *
 * @param params - Task request parameters (subject, difficulty, grade, etc.)
 * @returns React Query result with task data
 */
export function useTaskData(params: TaskRequest) {
  return trpc.tasks.get.useQuery(params, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  })
}
