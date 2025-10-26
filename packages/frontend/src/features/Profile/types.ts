export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export interface UserProfile {
  age: number;              // Age when entered (e.g., 10)
  ageEnteredAt: string;     // ISO date when user provided age
  gender: Gender | null;
}

/**
 * Calculate current age based on when it was entered
 */
export function getCurrentAge(profile: UserProfile): number {
  const enteredDate = new Date(profile.ageEnteredAt);
  const now = new Date();
  const yearsElapsed = Math.floor(
    (now.getTime() - enteredDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  return profile.age + yearsElapsed;
}
