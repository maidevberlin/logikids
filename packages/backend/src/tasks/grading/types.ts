import type { FillInBlankItem } from '../types/fillInBlank';
import type { MultiSelectOption } from '../types/multiSelect';

/**
 * User answer for fill-in-the-blank tasks
 */
export interface FillInBlankAnswer {
  answers: string[];
}

/**
 * User answer for number input tasks
 */
export interface NumberInputAnswer {
  value: number;
  unit?: string;
}

/**
 * User answer for ordering tasks
 */
export interface OrderingAnswer {
  orderedIds: string[];
}

/**
 * User answer for multi-select tasks
 */
export interface MultiSelectAnswer {
  selectedIndices: number[];
}

/**
 * Grading input for fill-in-the-blank tasks
 */
export interface FillInBlankGradingInput {
  userAnswers: string[];
  blanks: FillInBlankItem[];
}

/**
 * Grading input for number input tasks
 */
export interface NumberInputGradingInput {
  userAnswer: NumberInputAnswer;
  solution: {
    answer: number;
    unit?: string;
    unitOptions?: string[];
  };
}

/**
 * Grading input for ordering tasks
 */
export interface OrderingGradingInput {
  userOrder: string[];
  correctOrder: string[];
}

/**
 * Grading input for multi-select tasks
 */
export interface MultiSelectGradingInput {
  userSelected: number[];
  options: MultiSelectOption[];
}

/**
 * Result of grading a number input task
 */
export interface NumberInputGradingResult {
  correct: boolean;
  numberCorrect: boolean;
  unitCorrect?: boolean;  // undefined when no unit validation needed
}

/**
 * Result of grading any task type
 */
export type GradingResult =
  | { type: 'number_input'; result: NumberInputGradingResult }
  | { type: 'other'; isCorrect: boolean };
