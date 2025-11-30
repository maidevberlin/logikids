export {TaskTypeRegistry, taskTypeRegistry} from './registry';
export type {TaskTypeWithSchema} from './registry';
export {singleChoiceSchema} from './singleChoice';
export type {SingleChoiceResponse, SingleChoiceOption} from './singleChoice';
export {yesNoSchema} from './yesNo';
export type {YesNoResponse} from './yesNo';
export {fillInBlankSchema} from './fillInBlank';
export type {FillInBlankResponse, FillInBlankItem} from './fillInBlank';
export {multiSelectSchema} from './multiSelect';
export type {MultiSelectResponse, MultiSelectOption} from './multiSelect';
export {numberInputSchema} from './numberInput';
export type {NumberInputResponse} from './numberInput';
export {orderingSchema} from './ordering';
export type {OrderingResponse, OrderingItem} from './ordering';

// Import types for local use
import type {SingleChoiceResponse} from './singleChoice';
import type {YesNoResponse} from './yesNo';
import type {FillInBlankResponse} from './fillInBlank';
import type {MultiSelectResponse} from './multiSelect';
import type {NumberInputResponse} from './numberInput';
import type {OrderingResponse} from './ordering';

// Usage information from AI providers
export interface TaskUsageInfo {
    inputTokens: number;
    outputTokens: number;
    totalTokens?: number;
}

// Base task response types (without taskId)
export type BaseTaskResponse =
    SingleChoiceResponse
    | YesNoResponse
    | FillInBlankResponse
    | MultiSelectResponse
    | NumberInputResponse
    | OrderingResponse;

// Union type for all possible task responses with taskId and optional usage info
export type TaskResponse = BaseTaskResponse & {
    taskId: string;
    usage?: TaskUsageInfo;
};
