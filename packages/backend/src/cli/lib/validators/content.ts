/**
 * Content validator - checks CARDINAL RULE (no example code)
 */

import type { CheckResult, CheckIssue } from '../types';

export function checkContent(content: string): CheckResult {
  const lines = content.split('\n');
  const issues: CheckIssue[] = [];

  // Patterns to detect code examples
  const patterns = [
    { regex: /<svg/i, description: 'SVG code snippet detected' },
    { regex: /<\/svg>/i, description: 'SVG closing tag detected' },
    { regex: /\$\$/, description: 'LaTeX delimiter ($$) detected' },
    { regex: /\\\[/, description: 'LaTeX delimiter (\\[) detected' },
    { regex: /\\\]/, description: 'LaTeX delimiter (\\]) detected' },
  ];

  lines.forEach((line, idx) => {
    patterns.forEach(({ regex, description }) => {
      if (regex.test(line)) {
        const match = line.match(regex);
        if (match) {
          issues.push({
            line: idx + 1,
            message: `${description}: "${match[0]}"`,
            fix: 'Remove all code examples. Describe problem structures instead.',
            reference: 'generate-concept SKILL.md lines 70-87',
          });
        }
      }
    });
  });

  // Remove duplicate issues for the same line
  const uniqueIssues = issues.filter((issue, index, self) =>
    index === self.findIndex(i => i.line === issue.line)
  );

  return {
    status: uniqueIssues.length > 0 ? 'fail' : 'pass',
    issues: uniqueIssues,
  };
}
