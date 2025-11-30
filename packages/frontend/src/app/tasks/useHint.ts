import { useState, useCallback, useEffect } from 'react';
import { trpc } from '@/api/trpc';

interface UseHintOptions {
  taskId?: string;
  maxHints?: number;
}

export const useHint = ({ taskId, maxHints = 4 }: UseHintOptions) => {
  const [hints, setHints] = useState<string[]>([]);
  const [hintError, setHintError] = useState<string | null>(null);

  // Reset hints when task changes
  useEffect(() => {
    setHints([]);
    setHintError(null);
  }, [taskId]);

  const hintMutation = trpc.tasks.getHint.useMutation({
    onSuccess: (data) => {
      setHints(prev => [...prev, data.hint]);
      setHintError(null);
    },
    onError: (error) => {
      setHintError(error.message);
    }
  });

  const requestHint = useCallback(() => {
    if (hints.length < maxHints && !hintMutation.isPending && taskId) {
      hintMutation.mutate({ taskId });
    }
  }, [hints.length, maxHints, hintMutation, taskId]);

  return {
    hints,
    hintsUsed: hints.length,
    requestHint,
    hintLoading: hintMutation.isPending,
    hintError,
    canRequestHint: hints.length < maxHints && !hintMutation.isPending
  };
};
