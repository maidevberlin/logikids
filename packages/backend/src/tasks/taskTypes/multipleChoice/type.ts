import { TaskType, TaskResponse, TASK_TYPES } from '../types';
import { MultipleChoiceResponse, MultipleChoiceOption, TYPE_ID } from './types';
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

    const r = response as Partial<MultipleChoiceResponse>;

    // Check basic TaskResponse properties
    if (typeof r.title !== 'string' || !r.title) return false;
    if (typeof r.task !== 'string' || !r.task) return false;
    if (!Array.isArray(r.hints) || r.hints.length !== 4) return false;
    if (!r.hints.every((hint: unknown) => typeof hint === 'string' && hint)) return false;

    // Check MultipleChoice specific properties
    if (!Array.isArray(r.options) || r.options.length !== 4) return false;

    // Validate each option structure
    const isValidOption = (opt: unknown): opt is MultipleChoiceOption => {
      if (!opt || typeof opt !== 'object') return false;
      
      const option = opt as Partial<MultipleChoiceOption>;
      
      if (typeof option.text !== 'string' || !option.text) return false;
      if (typeof option.isCorrect !== 'boolean') return false;
      
      // If option is correct, it must have an explanation
      if (option.isCorrect && (typeof option.explanation !== 'string' || !option.explanation)) {
        return false;
      }
      
      return true;
    };

    if (!r.options.every(isValidOption)) return false;

    // Validate that exactly one option is correct
    const correctOptions = r.options.filter(isValidOption).filter(opt => opt.isCorrect);
    if (correctOptions.length !== 1) return false;

    return true;
  }
}; 