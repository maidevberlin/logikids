/**
 * Word count validator - checks prompt content length
 */

import type { CheckResult } from '../types'

export function checkWordCount(content: string): CheckResult {
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
  const wordCount = words.length

  // Empty content is valid (guidelines now in frontmatter)
  if (wordCount === 0) {
    return { status: 'pass', issues: [] }
  }

  // Minimal content for fine-tuning (1-100 words) is optimal
  if (wordCount <= 100) {
    return { status: 'pass', issues: [] }
  }

  // Warning zone: 100-200 words
  if (wordCount <= 200) {
    return {
      status: 'warning',
      issues: [
        {
          message: `Prompt content has ${wordCount} words (optimal: 0-100)`,
          fix: 'Consider moving guidelines to frontmatter fields.',
        },
      ],
    }
  }

  // Fail: over 200 words
  return {
    status: 'fail',
    issues: [
      {
        message: `Prompt content has ${wordCount} words (maximum: 200)`,
        fix: 'Move guidelines to frontmatter fields.',
      },
    ],
  }
}
