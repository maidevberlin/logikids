export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export interface UserProfile {
  grade: number;              // Grade when entered (e.g., 5)
  gradeEnteredAt: string;     // ISO date when user provided grade
  gender: Gender | null;
}

/**
 * Calculate current grade based on when it was entered
 * Note: This assumes typical school year progression (one grade per year)
 */
export function getCurrentGrade(profile: UserProfile): number {
  const enteredDate = new Date(profile.gradeEnteredAt);
  const now = new Date();
  const yearsElapsed = Math.floor(
    (now.getTime() - enteredDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  return Math.min(13, profile.grade + yearsElapsed);
}
