import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import i18n from '@/i18n/config';
import { logikids, TaskRequest } from '@/api/logikids';
import { Task, MultipleChoiceTask, YesNoTask, TaskAnswerType } from './types';

export const useTask = (params: TaskRequest) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [hintError, setHintError] = useState<string | null>(null);

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

  // Hint mutation
  const hintMutation = useMutation({
    mutationFn: () => {
      if (!task?.taskId) {
        throw new Error('No task ID available');
      }
      return logikids.getHint(task.taskId);
    },
    onSuccess: (data) => {
      setHints(prev => [...prev, data.hint]);
      setHintError(null);
    },
    onError: (error) => {
      setHintError(error instanceof Error ? error.message : 'Failed to fetch hint');
    }
  });

  // Reset hints when task changes
  useEffect(() => {
    if (task) {
      setHints([]);
      setHintError(null);
    }
  }, [task?.taskId]);

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

    let correct: boolean;
    if (task.type === 'multiple_choice') {
      correct = (task as MultipleChoiceTask).options[selectedAnswer as number].isCorrect;
    } else {
      correct = selectedAnswer === (task as YesNoTask).solution.answer;
    }
    setIsCorrect(correct);
  }, [task, selectedAnswer]);

  const selectAnswer = useCallback(<T extends Task>(answer: TaskAnswerType<T> | null) => {
    // Don't allow changing answer if already correct
    if (isCorrect === true) {
      return;
    }

    setSelectedAnswer(answer);
    setIsCorrect(null);
  }, [isCorrect]);

  const nextTask = useCallback(async () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    await refetch();
  }, [refetch]);

  // Get the explanation for the correct answer
  const getExplanation = useCallback(() => {
    if (!task) return '';
    if (task.type === 'multiple_choice') {
      const correctOption = (task as MultipleChoiceTask).options.find(opt => opt.isCorrect);
      return correctOption?.explanation || '';
    } else {
      return (task as YesNoTask).solution.explanation;
    }
  }, [task]);

  const requestHint = useCallback(() => {
    if (hints.length < 4 && !hintMutation.isPending) {
      hintMutation.mutate();
    }
  }, [hints.length, hintMutation]);

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
    requestHint,
    hintLoading: hintMutation.isPending,
    hintError,
    canRequestHint: hints.length < 4 && !hintMutation.isPending
  };
}; 