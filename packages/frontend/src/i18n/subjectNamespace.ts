/**
 * Helper to determine which i18n namespace to use for a subject's concepts
 */

const SPLIT_SUBJECTS = ['math', 'german', 'english'];

function getGradeRange(grade: number): 'elementary' | 'middle' | 'high' {
  if (grade >= 1 && grade <= 4) return 'elementary';
  if (grade >= 5 && grade <= 8) return 'middle';
  return 'high';
}

/**
 * Get the i18n namespace for a subject based on concept grade
 * @param subjectId - The subject ID (e.g., 'math', 'logic')
 * @param grade - The concept's grade level (used for split subjects)
 * @returns The namespace to use for translations
 */
export function getSubjectNamespace(subjectId: string, grade?: number): string {
  if (!SPLIT_SUBJECTS.includes(subjectId)) {
    // Small subjects use single namespace
    return `subjects/${subjectId}`;
  }

  // Large subjects are split by grade range
  if (!grade) {
    // Default to elementary if no grade provided
    return `subjects/${subjectId}-elementary`;
  }

  const range = getGradeRange(grade);
  return `subjects/${subjectId}-${range}`;
}

/**
 * Get all possible namespaces for a subject
 * Useful for pre-loading all related namespaces
 */
export function getAllSubjectNamespaces(subjectId: string): string[] {
  if (!SPLIT_SUBJECTS.includes(subjectId)) {
    return [`subjects/${subjectId}`];
  }

  return [
    `subjects/${subjectId}-elementary`,
    `subjects/${subjectId}-middle`,
    `subjects/${subjectId}-high`
  ];
}
