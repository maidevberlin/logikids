import { useQuery, useMutation } from '@tanstack/react-query';
import { TaskParams } from '../types/task';
import { logikids } from '../services/logikids';

export const useTask = (params: TaskParams) => {
  const {
    data: task,
    isLoading: isTaskLoading,
    error: taskError,
    refetch,
    isFetching: isTaskFetching
  } = useQuery({
    queryKey: ['task', params],
    queryFn: ({ signal }) => logikids.getTask(params, signal),
    retry: false,
  });

  const {
    mutate: requestHint,
    data: hint = null,
    isPending: isHintLoading,
    error: hintError,
    reset: resetHint,
  } = useMutation({
    mutationFn: () => {
      if (!task) throw new Error('No task available');
      return logikids.getHint({task, previousHints: []});
    }
  });

  return {
    task,
    hint,
    isTaskLoading,
    isTaskFetching,
    isHintLoading,
    taskError: taskError ? taskError.message : null,
    hintError: hintError ? (hintError as Error).message : null,
    requestHint,
    resetHint,
    refetch,
  };
}
