/**
 * Grades an ordering answer
 * @param userOrder - Array of item IDs in the user's order
 * @param correctOrder - Array of item IDs in the correct order
 * @returns true if the arrays match exactly, false otherwise
 */
export function gradeOrdering(
  userOrder: string[],
  correctOrder: string[]
): boolean {
  // Check if lengths match
  if (userOrder.length !== correctOrder.length) {
    return false;
  }

  // Check if each element at each position matches
  for (let i = 0; i < correctOrder.length; i++) {
    if (userOrder[i] !== correctOrder[i]) {
      return false;
    }
  }

  return true;
}
