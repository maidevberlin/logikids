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

import { SubjectLoadingContent, LoadingContent } from './types'
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
    'tips.fallback.0', // Take your time to understand the question
    'tips.fallback.1', // Break problems into manageable steps
    'tips.fallback.2', // Review your answer before submitting
    'tips.fallback.3', // Learn from mistakes to improve
    'tips.fallback.4', // practice makes perfect
  ],

  facts: [
    'facts.fallback.0', // Learning rewires your brain
    'facts.fallback.1', // Curiosity drives discovery
    'facts.fallback.2', // Every expert was once a beginner
    'facts.fallback.3', // Your brain never stops learning
    'facts.fallback.4', // Making connections helps memory
  ],

  previews: [
    'previews.fallback.0', // Get ready for an engaging challenge
    'previews.fallback.1', // Learning something new today
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
