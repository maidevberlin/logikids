import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { LogikidsService } from '../services/logikids';
import config from '../config';

const logikidsService = new LogikidsService(config.apiBaseUrl);

export function useHint(task: Task | null) {
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHint(null);
    setError(null);
  }, [task]);

  const requestHint = async () => {
    if (!task) return;
    try {
      const newHint = await logikidsService.getHint(task);
      setHint(newHint);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hint');
    }
  };

  return { hint, error, requestHint };
} 