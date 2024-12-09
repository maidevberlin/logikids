import { useState, useCallback, useEffect } from 'react';
import { TaskResponse, TaskType } from '../../../backend/src/types/task';
import { LogikidsService } from '../services/logikids';
import config from '../config';

interface UseTaskReturn {
  task: TaskResponse | null;
  hint: string | null;
  loading: boolean;
  error: string | null;
  requestHint: () => Promise<void>;
}

function useTaskBase(type: TaskType): UseTaskReturn {
  const [task, setTask] = useState<TaskResponse | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logikidsService = new LogikidsService(config.apiBaseUrl);

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await logikidsService.getTask(type);
      setTask(newTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  }, [type]);

  const requestHint = useCallback(async () => {
    if (!task) return;

    try {
      const newHint = await logikidsService.getHint(type, task);
      setHint(newHint);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hint');
    }
  }, [task, type]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return { task, hint, loading, error, requestHint };
}

export function useArithmeticTask(): UseTaskReturn {
  return useTaskBase('arithmetic');
}

export function useGeometryTask(): UseTaskReturn {
  return useTaskBase('geometry');
} 