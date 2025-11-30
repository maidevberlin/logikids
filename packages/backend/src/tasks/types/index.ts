export { TaskTypeRegistry, taskTypeRegistry } from './registry';
export type { TaskTypeWithSchema } from './registry';
export { singleChoiceSchema } from './singleChoice';
export type { SingleChoiceResponse, SingleChoiceOption } from './singleChoice';
export { yesNoSchema } from './yesNo';
export type { YesNoResponse } from './yesNo';
export { fillInBlankSchema } from './fillInBlank';
export type { FillInBlankResponse, FillInBlankItem } from './fillInBlank';
export { multiSelectSchema } from './multiSelect';
export type { MultiSelectResponse, MultiSelectOption } from './multiSelect';
export { numberInputSchema } from './numberInput';
export type { NumberInputResponse } from './numberInput';
export { orderingSchema } from './ordering';
export type { OrderingResponse, OrderingItem } from './ordering';

// Import types for local use
import type { SingleChoiceResponse, SingleChoiceOption } from './singleChoice';
import type { YesNoResponse } from './yesNo';
import type { FillInBlankResponse, FillInBlankItem } from './fillInBlank';
import type { MultiSelectResponse, MultiSelectOption } from './multiSelect';
import type { NumberInputResponse } from './numberInput';
import type { OrderingResponse } from './ordering';

// Usage information from AI providers
export interface TaskUsageInfo {
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
}

// Base task response types (without taskId)
export type BaseTaskResponse = SingleChoiceResponse | YesNoResponse | FillInBlankResponse | MultiSelectResponse | NumberInputResponse | OrderingResponse;

// Union type for all possible task responses with taskId and optional usage info
export type TaskResponse = BaseTaskResponse & {
  taskId: string;
  usage?: TaskUsageInfo;
};

/**
 * Solution data extracted from task responses for hint generation.
 * Union type covering all possible solution structures:
 * - single_choice: options array with isCorrect flags
 * - multi_select: options array with isCorrect flags
 * - yes_no: boolean answer
 * - number_input: numeric answer
 * - fill_in_blank: blanks array with acceptedAnswers
 * - ordering: string array of correct order
 */
export type TaskSolution =
  | SingleChoiceOption[]
  | MultiSelectOption[]
  | boolean
  | number
  | FillInBlankItem[]
  | string[];

/**
 * Extract the solution/answer data from a task response.
 * Each task type stores its answer differently:
 * - single_choice/multi_select: options array with isCorrect flags
 * - yes_no/number_input: answer field
 * - fill_in_blank: blanks array with acceptedAnswers
 * - ordering: correctOrder array
 */
export function extractSolution(response: BaseTaskResponse): TaskSolution {
  switch (response.type) {
    case 'single_choice':
    case 'multi_select':
      return response.options;
    case 'yes_no':
    case 'number_input':
      return response.answer;
    case 'fill_in_blank':
      return response.blanks;
    case 'ordering':
      return response.correctOrder;
  }
}
