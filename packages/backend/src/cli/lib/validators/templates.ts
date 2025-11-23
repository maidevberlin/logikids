/**
 * Template validator - checks for required template variables
 */

import type { CheckResult, CheckIssue } from '../types';

export function checkTemplates(content: string): CheckResult {
  const hasAge = /\{\{age\}\}/.test(content);
  const hasDifficulty = /\{\{difficulty\}\}/.test(content);
  const issues: CheckIssue[] = [];

  if (!hasAge) {
    issues.push({
      message: 'Template variable {{age}} not found in content',
      fix: 'Add age-based scaffolding using {{age}} template variable',
      reference: 'generate-concept SKILL.md lines 100-108',
    });
  }

  if (!hasDifficulty) {
    issues.push({
      message: 'Template variable {{difficulty}} not found in content',
      fix: 'Add difficulty scaling using {{difficulty}} template variable',
      reference: 'generate-concept SKILL.md lines 100-108',
    });
  }

  return {
    status: issues.length > 0 ? 'warning' : 'pass',
    issues,
  };
}
