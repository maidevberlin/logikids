import { TaskResponse } from '../types';

export const TYPE_ID = 'multiple_choice' as const;

export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
  explanation?: string; // Only present for correct option
}

export interface MultipleChoiceResponse extends TaskResponse {
  options: MultipleChoiceOption[];
} 