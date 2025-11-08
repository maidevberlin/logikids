import type { NumberInputGradingResult } from './types';

export interface NumberInputAnswer {
  value: number;
  unit?: string;
}

/**
 * Grades a number input answer
 * @param userAnswer - User's answer with value and optional unit
 * @param solution - Expected solution with answer, unit, and optional unitOptions
 * @returns NumberInputGradingResult with correct, numberCorrect, and optionally unitCorrect
 */
export function gradeNumberInput(
  userAnswer: NumberInputAnswer,
  solution: { answer: number; unit?: string; unitOptions?: string[] }
): NumberInputGradingResult {
  // Validate solution consistency
  if (solution.unitOptions && solution.unitOptions.length > 0) {
    if (!solution.unit) {
      throw new Error('Invalid solution: unitOptions provided without unit');
    }
    if (!solution.unitOptions.includes(solution.unit)) {
      throw new Error('Invalid solution: unit must be present in unitOptions array');
    }
  }

  // Check exact numeric match (no tolerance)
  const numberCorrect = userAnswer.value === solution.answer;

  // If unitOptions is present and has items, validate unit separately
  if (solution.unitOptions && solution.unitOptions.length > 0) {
    const unitCorrect = userAnswer.unit === solution.unit;
    return {
      correct: numberCorrect && unitCorrect,
      numberCorrect,
      unitCorrect
    };
  }

  // No unit validation needed
  return {
    correct: numberCorrect,
    numberCorrect,
    unitCorrect: undefined
  };
}
