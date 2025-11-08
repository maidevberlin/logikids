import { describe, test, expect } from 'bun:test';
import { gradeFillInBlank } from './fillInBlank';
import { gradeNumberInput } from './numberInput';
import { gradeOrdering } from './ordering';
import { gradeMultiSelect } from './multiSelect';
import type { FillInBlankItem } from '../types/fillInBlank';
import type { NumberInputSolution } from '../types/numberInput';
import type { MultiSelectOption } from '../types/multiSelect';

describe('gradeFillInBlank', () => {
  test('should return true when all blanks match (case insensitive)', () => {
    const blanks: FillInBlankItem[] = [
      { id: 0, acceptedAnswers: ['Paris', 'paris'], caseSensitive: false },
      { id: 1, acceptedAnswers: ['2.1', '2.2', '2'], caseSensitive: false }
    ];
    const userAnswers = ['PARIS', '2.1'];
    expect(gradeFillInBlank(userAnswers, blanks)).toBe(true);
  });

  test('should return false when case does not match (case sensitive)', () => {
    const blanks: FillInBlankItem[] = [
      { id: 0, acceptedAnswers: ['Paris'], caseSensitive: true }
    ];
    const userAnswers = ['paris'];
    expect(gradeFillInBlank(userAnswers, blanks)).toBe(false);
  });

  test('should return true when case matches (case sensitive)', () => {
    const blanks: FillInBlankItem[] = [
      { id: 0, acceptedAnswers: ['Paris'], caseSensitive: true }
    ];
    const userAnswers = ['Paris'];
    expect(gradeFillInBlank(userAnswers, blanks)).toBe(true);
  });

  test('should return false when number of answers does not match', () => {
    const blanks: FillInBlankItem[] = [
      { id: 0, acceptedAnswers: ['Paris'], caseSensitive: false },
      { id: 1, acceptedAnswers: ['2'], caseSensitive: false }
    ];
    const userAnswers = ['Paris'];
    expect(gradeFillInBlank(userAnswers, blanks)).toBe(false);
  });

  test('should return false when one blank is incorrect', () => {
    const blanks: FillInBlankItem[] = [
      { id: 0, acceptedAnswers: ['Paris'], caseSensitive: false },
      { id: 1, acceptedAnswers: ['2'], caseSensitive: false }
    ];
    const userAnswers = ['Paris', '3'];
    expect(gradeFillInBlank(userAnswers, blanks)).toBe(false);
  });

  test('should accept any of multiple accepted answers', () => {
    const blanks: FillInBlankItem[] = [
      { id: 0, acceptedAnswers: ['cat', 'feline', 'kitty'], caseSensitive: false }
    ];
    expect(gradeFillInBlank(['cat'], blanks)).toBe(true);
    expect(gradeFillInBlank(['feline'], blanks)).toBe(true);
    expect(gradeFillInBlank(['KITTY'], blanks)).toBe(true);
    expect(gradeFillInBlank(['dog'], blanks)).toBe(false);
  });
});

describe('gradeNumberInput', () => {
  test('should return true when value is exact match', () => {
    const solution: NumberInputSolution = {
      value: 27,
      tolerance: 0.01
    };
    const userAnswer = { value: 27 };
    expect(gradeNumberInput(userAnswer, solution)).toBe(true);
  });

  test('should return true when value is within tolerance', () => {
    const solution: NumberInputSolution = {
      value: 27,
      tolerance: 0.1
    };
    const userAnswer = { value: 27.05 };
    expect(gradeNumberInput(userAnswer, solution)).toBe(true);
  });

  test('should return false when value exceeds tolerance', () => {
    const solution: NumberInputSolution = {
      value: 27,
      tolerance: 0.01
    };
    const userAnswer = { value: 27.05 };
    expect(gradeNumberInput(userAnswer, solution)).toBe(false);
  });

  test('should return true when value and unit both match', () => {
    const solution: NumberInputSolution = {
      value: 27,
      unit: 'm²',
      tolerance: 0.01,
      acceptedUnits: ['m²', 'm^2', 'sq m']
    };
    const userAnswer = { value: 27, unit: 'm²' };
    expect(gradeNumberInput(userAnswer, solution)).toBe(true);
  });

  test('should return true when value matches and unit is accepted alternative', () => {
    const solution: NumberInputSolution = {
      value: 27,
      unit: 'm²',
      tolerance: 0.01,
      acceptedUnits: ['m²', 'm^2', 'sq m']
    };
    const userAnswer = { value: 27, unit: 'm^2' };
    expect(gradeNumberInput(userAnswer, solution)).toBe(true);
  });

  test('should return false when unit is required but not provided', () => {
    const solution: NumberInputSolution = {
      value: 27,
      unit: 'm²',
      tolerance: 0.01,
      acceptedUnits: ['m²']
    };
    const userAnswer = { value: 27 };
    expect(gradeNumberInput(userAnswer, solution)).toBe(false);
  });

  test('should return false when unit does not match', () => {
    const solution: NumberInputSolution = {
      value: 27,
      unit: 'm²',
      tolerance: 0.01,
      acceptedUnits: ['m²']
    };
    const userAnswer = { value: 27, unit: 'km²' };
    expect(gradeNumberInput(userAnswer, solution)).toBe(false);
  });

  test('should handle negative numbers', () => {
    const solution: NumberInputSolution = {
      value: -5.5,
      tolerance: 0.1
    };
    const userAnswer = { value: -5.45 };
    expect(gradeNumberInput(userAnswer, solution)).toBe(true);
  });
});

describe('gradeOrdering', () => {
  test('should return true when order matches exactly', () => {
    const correctOrder = ['a', 'b', 'c'];
    const userOrder = ['a', 'b', 'c'];
    expect(gradeOrdering(userOrder, correctOrder)).toBe(true);
  });

  test('should return false when order is different', () => {
    const correctOrder = ['a', 'b', 'c'];
    const userOrder = ['a', 'c', 'b'];
    expect(gradeOrdering(userOrder, correctOrder)).toBe(false);
  });

  test('should return false when lengths do not match', () => {
    const correctOrder = ['a', 'b', 'c'];
    const userOrder = ['a', 'b'];
    expect(gradeOrdering(userOrder, correctOrder)).toBe(false);
  });

  test('should return false when completely reversed', () => {
    const correctOrder = ['a', 'b', 'c'];
    const userOrder = ['c', 'b', 'a'];
    expect(gradeOrdering(userOrder, correctOrder)).toBe(false);
  });

  test('should handle longer sequences', () => {
    const correctOrder = ['1', '2', '3', '4', '5'];
    const userOrder = ['1', '2', '3', '4', '5'];
    expect(gradeOrdering(userOrder, correctOrder)).toBe(true);
  });
});

describe('gradeMultiSelect', () => {
  test('should return true when all correct options selected', () => {
    const options: MultiSelectOption[] = [
      { id: 0, text: '2', isCorrect: true },
      { id: 1, text: '4', isCorrect: false },
      { id: 2, text: '7', isCorrect: true },
      { id: 3, text: '9', isCorrect: false },
      { id: 4, text: '11', isCorrect: true }
    ];
    const userSelected = [0, 2, 4];
    expect(gradeMultiSelect(userSelected, options)).toBe(true);
  });

  test('should return false when missing a correct option', () => {
    const options: MultiSelectOption[] = [
      { id: 0, text: '2', isCorrect: true },
      { id: 1, text: '4', isCorrect: false },
      { id: 2, text: '7', isCorrect: true }
    ];
    const userSelected = [0];
    expect(gradeMultiSelect(userSelected, options)).toBe(false);
  });

  test('should return false when including an incorrect option', () => {
    const options: MultiSelectOption[] = [
      { id: 0, text: '2', isCorrect: true },
      { id: 1, text: '4', isCorrect: false },
      { id: 2, text: '7', isCorrect: true }
    ];
    const userSelected = [0, 1, 2];
    expect(gradeMultiSelect(userSelected, options)).toBe(false);
  });

  test('should return false when selecting too many', () => {
    const options: MultiSelectOption[] = [
      { id: 0, text: 'A', isCorrect: true },
      { id: 1, text: 'B', isCorrect: false },
      { id: 2, text: 'C', isCorrect: false }
    ];
    const userSelected = [0, 1, 2];
    expect(gradeMultiSelect(userSelected, options)).toBe(false);
  });

  test('should handle selections in different order', () => {
    const options: MultiSelectOption[] = [
      { id: 0, text: 'A', isCorrect: true },
      { id: 1, text: 'B', isCorrect: false },
      { id: 2, text: 'C', isCorrect: true },
      { id: 3, text: 'D', isCorrect: true }
    ];
    const userSelected = [3, 0, 2]; // Different order but correct set
    expect(gradeMultiSelect(userSelected, options)).toBe(true);
  });

  test('should return false when no options selected', () => {
    const options: MultiSelectOption[] = [
      { id: 0, text: 'A', isCorrect: true },
      { id: 1, text: 'B', isCorrect: false }
    ];
    const userSelected: number[] = [];
    expect(gradeMultiSelect(userSelected, options)).toBe(false);
  });
});
