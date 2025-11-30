/**
 * Word count validator - checks prompt content length
 *
 * UPDATED 2025-11-24: Prompt content is now OPTIONAL. Guidelines moved to frontmatter.
 * Empty prompt content is perfectly valid (and preferred for most concepts).
 * If prompt content exists, it should be minimal (for fine-tuning only).
 */

import type { CheckResult } from '../types'

export function checkWordCount(content: string): CheckResult {
  // Count words in content (split by whitespace)
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
  const wordCount = words.length

  // Empty content is valid (guidelines now in frontmatter)
  if (wordCount === 0) {
    return {
      status: 'pass',
      issues: [],
    }
  }

  // Minimal content for fine-tuning (1-100 words) is optimal
  if (wordCount <= 100) {
    return {
      status: 'pass',
      issues: [],
    }
  }

  // Warning zone: 100-200 words (may be over-specified)
  if (wordCount <= 200) {
    return {
      status: 'warning',
      issues: [
        {
          message: `Prompt content has ${wordCount} words (optimal: 0-100 for fine-tuning only)`,
          fix: 'Consider moving guidelines to frontmatter fields. Prompt content should only contain edge-case fine-tuning.',
        },
      ],
    }
  }

  // Fail: over 200 words (guidelines should be in frontmatter)
  return {
    status: 'fail',
    issues: [
      {
        message: `Prompt content has ${wordCount} words (maximum: 200)`,
        fix: 'Move problem types, age guidelines, and difficulty guidelines to frontmatter fields. Prompt content should only contain minimal fine-tuning notes.',
      },
    ],
  }
}
