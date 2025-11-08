import type { FillInBlankItem } from '../types/fillInBlank';

/**
 * Grades a fill-in-the-blank answer
 * @param userAnswers - Array of user-provided answers (one per blank)
 * @param blanks - Array of blank configurations with accepted answers
 * @returns true if all blanks match their accepted answers, false otherwise
 */
export function gradeFillInBlank(
  userAnswers: string[],
  blanks: FillInBlankItem[]
): boolean {
  // Check if the number of user answers matches the number of blanks
  if (userAnswers.length !== blanks.length) {
    return false;
  }

  // Check each blank
  for (let i = 0; i < blanks.length; i++) {
    const blank = blanks[i];
    const userAnswer = userAnswers[i];

    // Check if the user answer matches any of the accepted answers
    const isMatch = blank.acceptedAnswers.some(acceptedAnswer => {
      if (blank.caseSensitive) {
        return userAnswer === acceptedAnswer;
      } else {
        return userAnswer.toLowerCase() === acceptedAnswer.toLowerCase();
      }
    });

    // If no match found for this blank, the answer is incorrect
    if (!isMatch) {
      return false;
    }
  }

  // All blanks matched
  return true;
}
