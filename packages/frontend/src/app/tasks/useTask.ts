import { useCallback, useEffect, useState } from 'react';
import i18n from '@/i18n/config';
import { TaskRequest } from '@/api/logikids';
import { SingleChoiceTask, YesNoTask } from './types';
import { useTaskAnswer } from './useTaskAnswer';
import { useHint } from './useHint';
import { useTaskData } from '@/hooks/useTaskData';

export const useTask = (params: TaskRequest) => {
  const [startTime, setStartTime] = useState(Date.now());

  // Use the dedicated useTaskData hook for data fetching
  const {
    data: task,
    isLoading,
    isFetching,
    error,
    refetch
  } = useTaskData(params);

  // Use the existing useTaskAnswer hook for answer management
  const {
    selectedAnswer,
    isCorrect,
    gradingDetails,
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
    } else if (task.type === 'yes_no') {
      return (task as YesNoTask).explanation;
    } else if ('explanation' in task) {
      return task.explanation;
    }
    return '';
  }, [task]);

  return {
    task,
    isLoading: isLoading || isFetching,
    error: error ? error.message : null,
    selectedAnswer,
    isCorrect,
    gradingDetails,
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