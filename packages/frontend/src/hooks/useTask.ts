import { useQuery } from '@tanstack/react-query';
import { TaskParams, Task } from '../types/task';
import { logikids } from '../services/logikids';
import { useState, useCallback } from 'react';

export const useTask = (params: TaskParams) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const {
    data: task,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery<Task>({
    queryKey: ['task', params],
    queryFn: ({ signal }) => logikids.getTask(params, signal),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const checkAnswer = useCallback(() => {
    if (!task || selectedAnswer === null) return;
    setIsCorrect(selectedAnswer === task.solution.index);
  }, [task, selectedAnswer]);

  const selectAnswer = useCallback((index: number | null) => {
    setSelectedAnswer(index);
    setIsCorrect(null);
  }, []);

  const nextTask = useCallback(async () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    await refetch();
  }, [refetch]);

  return {
    task,
    isLoading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    selectedAnswer,
    isCorrect,
    checkAnswer,
    selectAnswer,
    nextTask
  };
}
