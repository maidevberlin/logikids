import { TaskResponse, TaskType } from '../../../backend/src/types/task';

export class LogikidsService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTask(type: TaskType, signal?: AbortSignal): Promise<TaskResponse> {
    console.log(`${this.baseUrl}/tasks/${type}`)
    const response = await fetch(`${this.baseUrl}/tasks/${type}`, {
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }

    return response.json();
  }

  async getHint(type: TaskType, task: TaskResponse, signal?: AbortSignal): Promise<string> {
    const response = await fetch(`${this.baseUrl}/hints/${type}`, {
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