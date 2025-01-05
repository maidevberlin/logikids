import { TaskResponse } from '../types';

export const TYPE_ID = 'yes_no' as const;

export interface YesNoResponse extends TaskResponse {
  solution: {
    answer: boolean;
    explanation: string;
  };
} 