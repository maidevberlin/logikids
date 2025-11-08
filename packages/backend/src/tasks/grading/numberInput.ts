import type { NumberInputSolution } from '../types/numberInput';

export interface NumberInputAnswer {
  value: number;
  unit?: string;
}

/**
 * Grades a number input answer
 * @param userAnswer - User's answer with value and optional unit
 * @param solution - Expected solution with value, tolerance, and optional unit
 * @returns true if the answer is within tolerance and unit matches (if required), false otherwise
 */
export function gradeNumberInput(
  userAnswer: NumberInputAnswer,
  solution: NumberInputSolution
): boolean {
  // Check numeric equality within tolerance
  const numericDifference = Math.abs(userAnswer.value - solution.value);
  const isWithinTolerance = numericDifference <= solution.tolerance;

  if (!isWithinTolerance) {
    return false;
  }

  // If solution has a unit, validate it
  if (solution.unit || solution.acceptedUnits) {
    // User must provide a unit if one is expected
    if (!userAnswer.unit) {
      return false;
    }

    // Check if user's unit matches any accepted unit
    const acceptedUnits = solution.acceptedUnits || (solution.unit ? [solution.unit] : []);
    const unitMatches = acceptedUnits.some(
      acceptedUnit => userAnswer.unit === acceptedUnit
    );

    if (!unitMatches) {
      return false;
    }
  }

  return true;
}
