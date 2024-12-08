import { TaskResponse, ArithmeticOperation, GeometryOperation, TaskType } from '../../../backend/src/types/task';
import { HintResponse, Type } from '../../../backend/src/types/hints';
import config from '../config';

class LogikidsService {
  private static instance: LogikidsService;
  private baseUrl = config.apiBaseUrl;

  private constructor() {}

  public static getInstance(): LogikidsService {
    if (!LogikidsService.instance) {
      LogikidsService.instance = new LogikidsService();
    }
    return LogikidsService.instance;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || 'An error occurred');
    }
    return response.json();
  }

  async getTask(type: TaskType, operation?: ArithmeticOperation | GeometryOperation): Promise<TaskResponse & { options: string[] }> {
    const baseTaskUrl = `${this.baseUrl}/tasks/${type}`;
    const url = operation 
      ? `${baseTaskUrl}/${operation}`
      : baseTaskUrl;
    
    const response = await fetch(url);
    return this.handleResponse<TaskResponse & { options: string[] }>(response);
  }

  async getHint(task: TaskResponse, type?: Type): Promise<HintResponse> {
    const response = await fetch(`${this.baseUrl}/hints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task, type }),
    });
    return this.handleResponse<HintResponse>(response);
  }
}

export const logikids = LogikidsService.getInstance(); 