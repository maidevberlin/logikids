/**
 * Structure validator - checks problem variation count
 */

import type { CheckResult } from '../types';

export function checkStructure(content: string): CheckResult {
  const lines = content.split('\n');
  let count = 0;
  let inProblemSection = false;

  for (const line of lines) {
    // Detect problem variations section
    if (/##\s*(problem|variations|structure)/i.test(line)) {
      inProblemSection = true;
      continue;
    }

    // Stop at next major section
    if (inProblemSection && /^##\s+[^p]/i.test(line)) {
      break;
    }

    // Count numbered items or bullet points in problem section
    if (inProblemSection) {
      if (/^\d+\.\s+\*\*/.test(line) || /^-\s+\*\*/.test(line)) {
        count++;
      }
    }
  }

  if (count < 5) {
    return {
      status: 'warning',
      issues: [{
        message: `Found ${count} problem structures, required 5-10`,
        fix: `Add ${5 - count}-${10 - count} more distinct problem structure descriptions`,
        reference: 'generate-concept SKILL.md lines 92-93',
      }],
    };
  }

  if (count > 10) {
    return {
      status: 'warning',
      issues: [{
        message: `Found ${count} problem structures, recommended maximum is 10`,
        fix: 'Consider consolidating similar problem structures',
        reference: 'generate-concept SKILL.md lines 92-93',
      }],
    };
  }

  return { status: 'pass', issues: [] };
}
