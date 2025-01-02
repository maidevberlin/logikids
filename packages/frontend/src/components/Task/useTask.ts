import { useQuery } from '@tanstack/react-query';
import { TaskRequest, Task } from '@logikids/backend/tasks/types';
import { useState, useCallback, useEffect, useRef } from 'react';
import i18n from '../../i18n/config';
import { logikids } from '../../api/logikids';

export const useTask = (params: TaskRequest) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const resetTimeoutRef = useRef<number>();

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  // Refetch task when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      refetch();
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [refetch]);

  const checkAnswer = useCallback(() => {
    if (!task || selectedAnswer === null) return;
    const correct = selectedAnswer === task.solution.index;
    setIsCorrect(correct);

    // Clear any existing timeout
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    // Set timeout for auto-reset if answer is wrong
    if (!correct) {
      resetTimeoutRef.current = window.setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, TIMING.WRONG_ANSWER_RESET);
    }
  }, [task, selectedAnswer]);

  const selectAnswer = useCallback((index: number | null) => {
    // Clear any existing timeout when selecting a new answer
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }
    setSelectedAnswer(index);
    setIsCorrect(null);
  }, []);

  const nextTask = useCallback(async () => {
    // Clear any existing timeout when moving to next task
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }
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