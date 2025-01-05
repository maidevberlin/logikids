import { TaskType, TaskResponse, TASK_TYPES } from '../types';
import { YesNoResponse, TYPE_ID } from './types';
import { prompt } from '../../prompts/taskTypes/yesNo';

export const yesNoType: TaskType<YesNoResponse> = {
  id: TYPE_ID,
  name: 'Yes/No Question',
  description: 'A task that requires a true/false or yes/no answer',
  promptTemplate: prompt,
  validateResponse: (response: unknown): response is YesNoResponse => {
    if (!response || typeof response !== 'object') {
      return false;
    }

    const r = response as any;

    // Check basic TaskResponse properties
    if (typeof r.title !== 'string' || !r.title) return false;
    if (typeof r.task !== 'string' || !r.task) return false;
    if (!Array.isArray(r.hints) || r.hints.length !== 4) return false;
    if (!r.hints.every((hint: unknown) => typeof hint === 'string' && hint)) return false;

    // Check YesNo specific properties
    if (!r.solution || typeof r.solution !== 'object') return false;
    if (typeof r.solution.answer !== 'boolean') return false;
    if (typeof r.solution.explanation !== 'string' || !r.solution.explanation) return false;

    return true;
  }
}; 