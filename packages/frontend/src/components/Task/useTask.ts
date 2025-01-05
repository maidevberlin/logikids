import { useQuery } from '@tanstack/react-query';
import { TaskRequest } from '@logikids/backend/tasks/types';
import { useState, useCallback, useEffect, useRef } from 'react';
import i18n from '../../i18n/config';
import { logikids } from '../../api/logikids';
import { TIMING } from './constants';
import { Task, MultipleChoiceTask, YesNoTask } from './types';
import { TaskAnswerType } from './TaskAnswer/types';

export const useTask = (params: TaskRequest) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
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
    
    let correct: boolean;
    if (task.type === 'multiple_choice') {
      correct = (task as MultipleChoiceTask).options[selectedAnswer as number].isCorrect;
    } else {
      correct = selectedAnswer === (task as YesNoTask).solution.answer;
    }
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

  const selectAnswer = useCallback(<T extends Task>(answer: TaskAnswerType<T> | null) => {
    // Clear any existing timeout when selecting a new answer
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }
    setSelectedAnswer(answer);
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

  return {
    task,
    isLoading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    selectedAnswer,
    isCorrect,
    explanation: getExplanation(),
    checkAnswer,
    selectAnswer,
    nextTask
  };
}; 