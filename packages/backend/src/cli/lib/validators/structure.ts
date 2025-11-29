/**
 * Structure validator - checks learning_objectives, problem_types, age_guidelines, and difficulty_guidelines
 */

import type { CheckResult, CheckIssue } from '../types';

export function checkStructure(frontmatter: any): CheckResult {
  const issues: CheckIssue[] = [];

  // Check problem_types
  const problemTypes = frontmatter.problem_types;

  if (!problemTypes || !Array.isArray(problemTypes)) {
    return {
      status: 'fail',
      issues: [{
        message: 'problem_types array required in frontmatter',
        fix: 'Add problem_types array with 5-10 string items',
        reference: 'concept-rules.md - Schema Requirements',
      }],
    };
  }

  const count = problemTypes.length;

  if (count < 5) {
    issues.push({
      message: `Found ${count} problem types, required 5-10`,
      fix: `Add ${5 - count} more problem type descriptions`,
      reference: 'concept-rules.md - Schema Requirements',
    });
  }

  if (count > 10) {
    issues.push({
      message: `Found ${count} problem types, recommended maximum is 10`,
      fix: 'Consider consolidating similar problem types',
      reference: 'concept-rules.md - Schema Requirements',
    });
  }

  // Check learning_objectives
  const learningObjectives = frontmatter.learning_objectives;

  if (learningObjectives && Array.isArray(learningObjectives)) {
    const objectiveCount = learningObjectives.length;

    if (objectiveCount < 3) {
      issues.push({
        message: `Found ${objectiveCount} learning objectives, required 3-7`,
        fix: `Add ${3 - objectiveCount} more learning objectives`,
        reference: 'concept-rules.md - learning_objectives',
      });
    }

    if (objectiveCount > 7) {
      issues.push({
        message: `Found ${objectiveCount} learning objectives, recommended maximum is 7`,
        fix: 'Consider consolidating similar objectives',
        reference: 'concept-rules.md - learning_objectives',
      });
    }
  }

  // Check difficulty_guidelines
  const difficultyGuidelines = frontmatter.difficulty_guidelines;

  if (difficultyGuidelines && typeof difficultyGuidelines === 'object') {
    // Rule: max 3 bullets per difficulty level
    for (const [level, guidelines] of Object.entries(difficultyGuidelines)) {
      if (Array.isArray(guidelines) && guidelines.length > 3) {
        issues.push({
          message: `difficulty_guidelines[${level}] has ${guidelines.length} items (max 3)`,
          fix: 'Reduce to 3 most important guidelines',
          reference: 'concept-rules.md - difficulty_guidelines',
        });
      }
    }
  }

  // Check real_world_context
  const realWorldContext = frontmatter.real_world_context;

  if (realWorldContext && Array.isArray(realWorldContext)) {
    const contextCount = realWorldContext.length;

    if (contextCount < 3) {
      issues.push({
        message: `Found ${contextCount} real_world_context items, required 3-5`,
        fix: `Add ${3 - contextCount} more real-world context examples`,
        reference: 'concept-rules.md - real_world_context',
      });
    }

    if (contextCount > 5) {
      issues.push({
        message: `Found ${contextCount} real_world_context items, maximum is 5`,
        fix: 'Reduce to 5 most relevant real-world contexts',
        reference: 'concept-rules.md - real_world_context',
      });
    }
  }

  if (issues.length === 0) {
    return { status: 'pass', issues: [] };
  }

  // Determine severity: problem_types issues are warnings, age_guidelines issues are warnings
  return { status: 'warning', issues };
}
