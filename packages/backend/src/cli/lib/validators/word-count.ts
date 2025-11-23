/**
 * Word count validator - checks prompt content length
 */

import type { CheckResult } from '../types';

export function checkWordCount(content: string): CheckResult {
  // Count words in content (split by whitespace)
  const words = content.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Optimal range: 400-800 words
  if (wordCount >= 400 && wordCount <= 800) {
    return {
      status: 'pass',
      issues: [],
    };
  }

  // Warning zone: 800-1200 words (acceptable but not optimal)
  if (wordCount > 800 && wordCount <= 1200) {
    return {
      status: 'warning',
      issues: [{
        message: `Content has ${wordCount} words (optimal range: 400-800, max: 1200)`,
        fix: 'Consider condensing content to 400-800 words for optimal clarity',
      }],
    };
  }

  // Fail: less than 400 or more than 1200
  if (wordCount < 400) {
    return {
      status: 'fail',
      issues: [{
        message: `Content has ${wordCount} words (minimum required: 400)`,
        fix: `Add ${400 - wordCount} more words to provide sufficient detail`,
      }],
    };
  }

  // wordCount > 1200
  return {
    status: 'fail',
    issues: [{
      message: `Content has ${wordCount} words (maximum allowed: 1200)`,
      fix: `Remove ${wordCount - 1200} words to keep content focused and concise`,
    }],
  };
}
