export { TaskTypeRegistry, taskTypeRegistry } from './registry';
export type { TaskTypeWithSchema } from './registry';
export { multipleChoiceSchema } from './multipleChoice';
export type { MultipleChoiceResponse, MultipleChoiceOption } from './multipleChoice';
export { yesNoSchema } from './yesNo';
export type { YesNoResponse, YesNoSolution } from './yesNo';

// Base task response types (without taskId)
export type BaseTaskResponse = MultipleChoiceResponse | YesNoResponse;

// Union type for all possible task responses with taskId
export type TaskResponse = BaseTaskResponse & {
  taskId: string;
};
