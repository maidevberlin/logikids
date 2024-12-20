import { Task } from '../types/task';

export class LogikidsService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTask(signal?: AbortSignal): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/task`, {
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }

    return response.json();
  }

  async getHint(task: Task, signal?: AbortSignal): Promise<string> {
    const response = await fetch(`${this.baseUrl}/hint`, {
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