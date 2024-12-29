import { api, ApiResponse } from './api';
import { Task, TaskParams } from '../types/task';
import { Hint, HintParams } from '../types/hint';

export class LogikidsApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LogikidsApiError';
  }
}

export const logikids = {
  getTask: (params: TaskParams, signal?: AbortSignal): ApiResponse<Task> => {
    return api.get<any, Task>('/task', {params, signal})
    .then(task => {
      if (!task) {
        throw new LogikidsApiError('No task data received from server');
      }
      return task;
    })
    .catch((error) => {
      if (error.response?.status === 404) {
        throw new LogikidsApiError('No tasks found for the selected criteria');
      }
      if (error instanceof LogikidsApiError) {
        throw error;
      }
      throw new LogikidsApiError(error.message || 'Failed to fetch task');
    });
  },

  getHint: (params: HintParams, signal?: AbortSignal): ApiResponse<Hint> => {
    return api.post<any, Hint>('/hint', params, { signal })
      .then((hint) => {
        if (!hint) {
          throw new LogikidsApiError('No hint data received from server');
        }
        return hint;
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          throw new LogikidsApiError('Hint not available for this task');
        }
        throw error;
      });
  }
}; 

