import { useState } from 'react';
import { TaskResponse, TaskType } from '../types/task';
import { LogikidsService } from '../services/logikids';
import config from '../config';

const logikidsService = new LogikidsService(config.apiBaseUrl);

export function useTaskHint(type: TaskType, task: TaskResponse | null) {
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestHint = async () => {
    if (!task) return;
    try {
      const newHint = await logikidsService.getHint(type, task);
      setHint(newHint);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hint');
    }
  };

  return { hint, error, requestHint };
} 