/**
 * Filename validator for concept files
 */

import type { CheckResult } from '../types';

export function checkFilename(filename: string, grade: number): CheckResult {
  const pattern = /^grade(\d+)-([a-z0-9]+(-[a-z0-9]+)*)\.md$/;
  const match = filename.match(pattern);

  if (!match) {
    return {
      status: 'fail',
      issues: [{
        message: `Filename '${filename}' does not match pattern grade{X}-{kebab-case-name}.md`,
        fix: `Rename to match pattern: grade${grade}-{concept-name}.md`,
        reference: 'generate-concept SKILL.md line 211',
      }],
    };
  }

  const filenameGrade = parseInt(match[1], 10);
  if (filenameGrade !== grade) {
    return {
      status: 'fail',
      issues: [{
        message: `Filename grade is ${filenameGrade} but frontmatter grade is ${grade}`,
        fix: `Rename to grade${grade}-*.md to match frontmatter`,
        reference: 'review-concept SKILL.md line 64',
      }],
    };
  }

  return { status: 'pass', issues: [] };
}
