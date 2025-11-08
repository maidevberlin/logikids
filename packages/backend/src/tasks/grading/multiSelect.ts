import type { MultiSelectOption } from '../types/multiSelect';

/**
 * Grades a multi-select answer
 * @param userSelected - Array of indices that the user selected
 * @param options - Array of all options with their correctness
 * @returns true if all correct options are selected and no incorrect options are selected, false otherwise
 */
export function gradeMultiSelect(
  userSelected: number[],
  options: MultiSelectOption[]
): boolean {
  // Get the indices of all correct options
  const correctIndices = options
    .filter(option => option.isCorrect)
    .map(option => option.id);

  // Check if the lengths match (user selected exactly the right number)
  if (userSelected.length !== correctIndices.length) {
    return false;
  }

  // Convert to sets for efficient comparison
  const userSet = new Set(userSelected);
  const correctSet = new Set(correctIndices);

  // Check if every correct option is selected
  for (const correctId of correctSet) {
    if (!userSet.has(correctId)) {
      return false;
    }
  }

  // Check if every selected option is correct (no extras)
  for (const selectedId of userSet) {
    if (!correctSet.has(selectedId)) {
      return false;
    }
  }

  return true;
}
