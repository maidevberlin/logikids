import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import i18n from '@/i18n/config';
import { logikids, TaskRequest } from '@/api/logikids';
import { Task, SingleChoiceTask, YesNoTask } from './types';
import { useTaskAnswer } from './useTaskAnswer';
import { useHint } from './useHint';

export const useTask = (params: TaskRequest) => {
  const [startTime, setStartTime] = useState(Date.now());

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

  // Use the existing useTaskAnswer hook for answer management
  const {
    selectedAnswer,
    isCorrect,
    handleAnswerSelect: selectAnswer,
    handleAnswerSubmit: checkAnswer
  } = useTaskAnswer({ task });

  // Use the new useHint hook for hint management
  const {
    hints,
    hintsUsed,
    requestHint,
    hintLoading,
    hintError,
    canRequestHint
  } = useHint({ taskId: task?.taskId });

  // Update startTime whenever a new task is fetched
  useEffect(() => {
    if (task) {
      setStartTime(Date.now());
    }
  }, [task]);

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

  const nextTask = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Get the explanation for the correct answer
  const getExplanation = useCallback(() => {
    if (!task) return '';
    if (task.type === 'single_choice') {
      const correctOption = (task as SingleChoiceTask).options.find(opt => opt.isCorrect);
      return correctOption?.explanation || '';
    } else {
      return (task as YesNoTask).solution.explanation;
    }
  }, [task]);

  return {
    task,
    isLoading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    selectedAnswer,
    isCorrect,
    explanation: getExplanation(),
    checkAnswer,
    selectAnswer,
    nextTask,
    hints,
    hintsUsed,
    requestHint,
    hintLoading,
    hintError,
    canRequestHint,
    startTime
  };
}; 