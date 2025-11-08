/**
 * Grading Service
 *
 * This module provides deterministic grading functions for all task answer types.
 * Each function takes user input and the expected solution, returning a boolean
 * indicating whether the answer is correct.
 */

export { gradeFillInBlank } from './fillInBlank';
export { gradeNumberInput } from './numberInput';
export { gradeOrdering } from './ordering';
export { gradeMultiSelect } from './multiSelect';

export type {
  FillInBlankAnswer,
  NumberInputAnswer,
  OrderingAnswer,
  MultiSelectAnswer,
  FillInBlankGradingInput,
  NumberInputGradingInput,
  OrderingGradingInput,
  MultiSelectGradingInput,
  NumberInputGradingResult,
  GradingResult
} from './types';
