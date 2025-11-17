import { useQuery } from '@tanstack/react-query';
import { logikids, TaskRequest } from '@/api/logikids';
import { Task } from '@/app/tasks/types';

/**
 * Hook for fetching task data from the API.
 *
 * This hook is responsible ONLY for data fetching using React Query.
 * It does not handle answer management, hints, timing, or any other concerns.
 *
 * @param params - Task request parameters (subject, difficulty, age, etc.)
 * @returns React Query result with task data
 */
export function useTaskData(params: TaskRequest) {
  return useQuery<Task>({
    queryKey: ['task', params],
    queryFn: ({ signal }) => logikids.getTask(params, signal),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
}
