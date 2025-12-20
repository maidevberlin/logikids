/**
 * Type definitions for task loading screen content.
 *
 * All content is stored as i18n keys (not actual text) to support
 * multi-language translations. The actual text is defined in
 * i18n/locales/{lang}/loading.json files.
 */

/**
 * Content structure for a single subject.
 * Each property contains an array of i18n translation keys.
 */
export interface SubjectLoadingContent {
  /** Learning tips specific to this subject (5-7 tips) */
  tips: string[]

  /** Fun facts and trivia related to this subject (5-7 facts) */
  facts: string[]

  /** Brief previews/introductions to subject concepts (2-3 previews) */
  previews: string[]
}

/**
 * Complete loading content structure.
 * Contains subject-specific content and shared encouragement messages.
 */
export interface LoadingContent {
  /** Mathematics content */
  math: SubjectLoadingContent
  /** Physics content */
  physics: SubjectLoadingContent
  /** Logic content */
  logic: SubjectLoadingContent
  /** Music content */
  music: SubjectLoadingContent
  /** German language content */
  german: SubjectLoadingContent
  /** English language content */
  english: SubjectLoadingContent
  /** History content */
  history: SubjectLoadingContent
  /** Subject-specific encouragement messages connecting learning to real life */
  encouragement: Record<string, string[]>
}

/**
 * Valid subject identifiers in the system.
 */
export type SubjectId = 'math' | 'physics' | 'logic' | 'music' | 'german' | 'english' | 'history'
