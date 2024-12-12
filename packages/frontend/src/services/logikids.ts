import { TaskResponse, TaskType } from '../../../backend/src/types/task';

export class LogikidsService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTask(type: TaskType, signal?: AbortSignal): Promise<TaskResponse> {
    const response = await fetch(`${this.baseUrl}/${type}/task`, {
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }

    return response.json();
  }

  async getHint(type: TaskType, task: TaskResponse, signal?: AbortSignal): Promise<string> {
    const response = await fetch(`${this.baseUrl}/${type}/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hint');
    }

    const data = await response.json();
    return data.hint;
  }
} 