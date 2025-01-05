import { TaskResponse } from '../types';

export const TYPE_ID = 'multiple_choice' as const;

export interface MultipleChoiceResponse extends TaskResponse {
  options: string[];
  solution: {
    index: number;
    explanation: string;
  };
} 