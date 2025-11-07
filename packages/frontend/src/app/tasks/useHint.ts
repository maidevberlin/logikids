import { useMutation } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { logikids } from '@/api/logikids';

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

  const hintMutation = useMutation({
    mutationFn: () => {
      if (!taskId) {
        throw new Error('No task ID available');
      }
      return logikids.getHint(taskId);
    },
    onSuccess: (data) => {
      setHints(prev => [...prev, data.hint]);
      setHintError(null);
    },
    onError: (error) => {
      setHintError(error instanceof Error ? error.message : 'Failed to fetch hint');
    }
  });

  const requestHint = useCallback(() => {
    if (hints.length < maxHints && !hintMutation.isPending) {
      hintMutation.mutate();
    }
  }, [hints.length, maxHints, hintMutation]);

  return {
    hints,
    hintsUsed: hints.length,
    requestHint,
    hintLoading: hintMutation.isPending,
    hintError,
    canRequestHint: hints.length < maxHints && !hintMutation.isPending
  };
};
