import { TFunction } from 'i18next'

/**
 * Formats a grade or grade range for display
 *
 * @param minGrade - The minimum grade (or single grade)
 * @param maxGrade - The maximum grade (optional)
 * @param t - Translation function
 * @returns Formatted grade string, or null if no grades provided
 *
 * @example
 * formatGradeRange(5, 5, t) // "Grade 5"
 * formatGradeRange(5, 7, t) // "Grades 5-7"
 * formatGradeRange(undefined, undefined, t) // null
 */
export function formatGradeRange(
  minGrade: number | undefined,
  maxGrade: number | undefined,
  t: TFunction
): string | null {
  if (!minGrade || !maxGrade) {
    return null
  }

  if (minGrade === maxGrade) {
    return t('subjects.grade', {
      grade: minGrade,
      defaultValue: `Grade ${minGrade}`
    })
  }

  return t('subjects.gradeRange', {
    minGrade,
    maxGrade,
    defaultValue: `Grades ${minGrade}-${maxGrade}`
  })
}

/**
 * Formats a single grade for display
 *
 * @param grade - The grade to format
 * @param t - Translation function
 * @returns Formatted grade string
 *
 * @example
 * formatGrade(5, t) // "Grade 5"
 */
export function formatGrade(grade: number, t: TFunction): string {
  return t('concepts.gradeLabel', {
    grade,
    defaultValue: `Grade ${grade}`
  })
}
