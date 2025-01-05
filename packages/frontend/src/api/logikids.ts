import { api, ApiResponse } from './api';
import { TaskRequest } from '@logikids/backend/tasks/types';
import { Task } from '../components/Task/types';
import { getCurrentLanguage } from '../i18n/config';

export class LogikidsApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LogikidsApiError';
  }
}

export const logikids = {
  getTask: (params: TaskRequest, signal?: AbortSignal): ApiResponse<Task> => {
    return api.get<TaskRequest, Task>('/task', {
      params, 
      signal,
      headers: {
        'Accept-Language': getCurrentLanguage()
      }
    })
    .then(response => {
      if (!response) {
        throw new LogikidsApiError('No response received from server');
      }
      return response;
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
  }
}; 