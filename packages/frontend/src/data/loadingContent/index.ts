/**
 * Loading content for task generation screens.
 *
 * This module provides educational content (tips, facts, previews, and encouragement)
 * that displays while users wait for AI-generated tasks (~20 seconds).
 *
 * Content is organized by subject and stored as i18n keys for multi-language support.
 * Actual translations are defined in i18n/locales/{lang}/loading.json files.
 *
 * @example
 * ```typescript
 * import { getLoadingContent } from '@/data/loadingContent'
 *
 * const content = getLoadingContent('math')
 * // Returns math-specific tips, facts, and previews
 *
 * const unknown = getLoadingContent('unknown-subject')
 * // Returns fallback generic content
 * ```
 */

import { SubjectLoadingContent, LoadingContent, SubjectId } from './types'
import { mathContent } from './math'
import { physicsContent } from './physics'
import { logicContent } from './logic'
import { musicContent } from './music'
import { germanContent } from './german'
import { englishContent } from './english'
import { encouragement } from './shared'

// Export types
export type { SubjectLoadingContent, LoadingContent, SubjectId } from './types'

/**
 * Fallback content for unknown or unsupported subjects.
 * Uses generic learning content that applies broadly.
 */
const fallbackContent: SubjectLoadingContent = {
  tips: [
    'loading.tips.fallback.0', // Take your time to understand the question
    'loading.tips.fallback.1', // Break problems into manageable steps
    'loading.tips.fallback.2', // Review your answer before submitting
    'loading.tips.fallback.3', // Learn from mistakes to improve
    'loading.tips.fallback.4', // Practice makes perfect
  ],

  facts: [
    'loading.facts.fallback.0', // Learning rewires your brain
    'loading.facts.fallback.1', // Curiosity drives discovery
    'loading.facts.fallback.2', // Every expert was once a beginner
    'loading.facts.fallback.3', // Your brain never stops learning
    'loading.facts.fallback.4', // Making connections helps memory
  ],

  previews: [
    'loading.previews.fallback.0', // Get ready for an engaging challenge
    'loading.previews.fallback.1', // Learning something new today
  ],
}

/**
 * Complete loading content object mapping subjects to their content.
 * Includes shared encouragement messages that work across all subjects.
 */
export const loadingContent: LoadingContent = {
  math: mathContent,
  physics: physicsContent,
  logic: logicContent,
  music: musicContent,
  german: germanContent,
  english: englishContent,
  encouragement,
}

/**
 * Get loading content for a specific subject.
 * Returns fallback content if the subject is not found.
 *
 * @param subject - Subject identifier (e.g., 'math', 'physics')
 * @returns Subject-specific content or fallback content
 *
 * @example
 * ```typescript
 * const mathContent = getLoadingContent('math')
 * console.log(mathContent.tips) // Array of i18n keys for math tips
 * ```
 */
export function getLoadingContent(subject: string): SubjectLoadingContent {
  const content = loadingContent[subject as keyof typeof loadingContent]

  // If content exists and is a SubjectLoadingContent (not encouragement array)
  if (content && typeof content === 'object' && 'tips' in content) {
    return content
  }

  return fallbackContent
}

/**
 * Get all encouragement messages (subject-agnostic).
 *
 * @returns Array of i18n keys for motivational messages
 *
 * @example
 * ```typescript
 * const messages = getEncouragement()
 * console.log(messages) // ['loading.encouragement.0', ...]
 * ```
 */
export function getEncouragement(): string[] {
  return encouragement
}

/**
 * Get all available subject IDs.
 *
 * @returns Array of supported subject identifiers
 *
 * @example
 * ```typescript
 * const subjects = getAvailableSubjects()
 * console.log(subjects) // ['math', 'physics', 'logic', 'music', 'german', 'english']
 * ```
 */
export function getAvailableSubjects(): SubjectId[] {
  return ['math', 'physics', 'logic', 'music', 'german', 'english']
}

/**
 * Check if a subject has dedicated loading content.
 *
 * @param subject - Subject identifier to check
 * @returns true if subject has dedicated content, false if it would use fallback
 *
 * @example
 * ```typescript
 * hasSubjectContent('math') // true
 * hasSubjectContent('unknown') // false
 * ```
 */
export function hasSubjectContent(subject: string): boolean {
  const subjectIds: string[] = ['math', 'physics', 'logic', 'music', 'german', 'english']
  return subjectIds.includes(subject)
}
