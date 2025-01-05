import { TaskType, TaskResponse, TASK_TYPES } from '../types';
import { MultipleChoiceResponse, TYPE_ID } from './types';
import { prompt } from '../../prompts/taskTypes/multipleChoice';

export const multipleChoiceType: TaskType<MultipleChoiceResponse> = {
  id: TYPE_ID,
  name: 'Multiple Choice',
  description: 'A task with exactly 4 options where one is correct',
  promptTemplate: prompt,
  validateResponse: (response: unknown): response is MultipleChoiceResponse => {
    if (!response || typeof response !== 'object') {
      return false;
    }

    const r = response as any;

    // Check basic TaskResponse properties
    if (typeof r.title !== 'string' || !r.title) return false;
    if (typeof r.task !== 'string' || !r.task) return false;
    if (!Array.isArray(r.hints) || r.hints.length !== 4) return false;
    if (!r.hints.every((hint: unknown) => typeof hint === 'string' && hint)) return false;

    // Check MultipleChoice specific properties
    if (!Array.isArray(r.options) || r.options.length !== 4) return false;
    if (!r.options.every((opt: unknown) => typeof opt === 'string' && opt)) return false;

    if (!r.solution || typeof r.solution !== 'object') return false;
    if (typeof r.solution.index !== 'number' || r.solution.index < 0 || r.solution.index > 3) return false;
    if (typeof r.solution.explanation !== 'string' || !r.solution.explanation) return false;

    return true;
  }
}; 