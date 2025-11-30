/**
 * Prompt system validator - checks registries and templates
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import { subjectRegistry } from '../../../subjects/registry';
import { taskTypeRegistry } from '../../../tasks/task-types';
import { PromptLoader } from '../../../prompts/loader';
import type { CheckResult } from '../types';

export async function validatePrompts(): Promise<CheckResult> {
  const issues = [];

  try {
    // Initialize prompt loader
    const loader = new PromptLoader();

    // Test loading base prompt
    const basePrompt = await loader.loadBasePrompt();
    if (!basePrompt) {
      issues.push({
        message: 'Failed to load base prompt',
        fix: 'Check prompts/base-prompt.md exists and is readable',
      });
    }

    // Initialize subject registry
    await subjectRegistry.initialize();
    const subjects = subjectRegistry.getAll();

    // Validate each subject has base template and concepts
    for (const subject of subjects) {
      if (!subject.basePromptTemplate) {
        issues.push({
          message: `Subject ${subject.id} has no base template`,
          fix: `Add base.md to subjects/${subject.id}/`,
        });
      }
    }

    // Initialize task type registry
    await taskTypeRegistry.initialize();
    const taskTypes = taskTypeRegistry.getAll();

    if (taskTypes.length === 0) {
      issues.push({
        message: 'No task types found',
        fix: 'Check src/tasks/types/ directory',
      });
    }

    // Validate variations.md exists
    const variationsPath = resolve(process.cwd(), 'prompts', 'variations.md');
    if (!existsSync(variationsPath)) {
      issues.push({
        message: 'variations.md not found at prompts/variations.md',
        fix: 'Create prompts/variations.md',
      });
    }

  } catch (error) {
    issues.push({
      message: `Validation error: ${error}`,
      fix: 'Check error details and fix underlying issue',
    });
  }

  return {
    status: issues.length > 0 ? 'fail' : 'pass',
    issues,
  };
}
