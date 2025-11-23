/**
 * Unified output formatting for CLI commands
 */

import type { CheckResult } from './types';

// ANSI color codes
export const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

// Standard symbols
export const symbols = {
  pass: '✅',
  fail: '❌',
  warning: '⚠️',
  info: '🔍',
};

/**
 * Print a separator line
 */
export function printSeparator() {
  console.log('═'.repeat(63));
}

/**
 * Print a check section with result
 */
export function printSection(title: string, result: CheckResult) {
  printSeparator();
  console.log(title);
  printSeparator();

  if (result.status === 'pass') {
    console.log(`${colors.green}${symbols.pass} PASS${colors.reset}\n`);
    return;
  }

  const statusIcon = result.status === 'fail'
    ? `${colors.red}${symbols.fail} FAIL${colors.reset}`
    : `${colors.yellow}${symbols.warning} WARNING${colors.reset}`;

  console.log(`${statusIcon} - ${result.issues.length} issue(s)\n`);

  result.issues.forEach((issue, idx) => {
    const lineInfo = issue.line ? `Line ${issue.line}: ` : '';
    console.log(`  ${idx + 1}. ${lineInfo}${issue.message}`);
    console.log(`     Fix: ${issue.fix}`);
    if (issue.reference) {
      console.log(`     See: ${issue.reference}`);
    }
    console.log();
  });
}

/**
 * Print progress indicator for batch operations
 */
export function printProgress(current: number, total: number, item: string) {
  process.stdout.write(`${colors.dim}[${current}/${total}]${colors.reset} ${item}...`);
}

/**
 * Print a single result status (for batch operations)
 */
export function printResult(passed: boolean, warnings: number, issues: number) {
  if (passed) {
    if (warnings > 0) {
      console.log(` ${colors.yellow}${symbols.warning} ${warnings} warning(s)${colors.reset}`);
    } else {
      console.log(` ${colors.green}${symbols.pass}${colors.reset}`);
    }
  } else {
    console.log(` ${colors.red}${symbols.fail} ${issues} issue(s)${colors.reset}`);
  }
}

/**
 * Print summary table for batch operations
 */
export interface SummaryItem {
  name: string;
  passed: boolean;
  issues: number;
  warnings: number;
}

export function printSummary(title: string, items: SummaryItem[]) {
  console.log('\n' + '═'.repeat(63));
  console.log(title);
  console.log('═'.repeat(63));

  const passed = items.filter(r => r.passed).length;
  const failed = items.filter(r => !r.passed).length;
  const totalIssues = items.reduce((sum, r) => sum + r.issues, 0);
  const totalWarnings = items.reduce((sum, r) => sum + r.warnings, 0);

  console.log(`Total checked: ${items.length}`);
  console.log(`${colors.green}${symbols.pass} Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}${symbols.fail} Failed: ${failed}${colors.reset}`);
  console.log(`Total critical issues: ${totalIssues}`);
  console.log(`Total warnings: ${totalWarnings}`);

  if (failed > 0) {
    console.log(`\n${colors.red}Failed items:${colors.reset}`);
    items
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  • ${r.name} (${r.issues} issue(s))`);
      });
  }

  console.log('═'.repeat(63) + '\n');
}

/**
 * Print final result for single-item checks
 */
export function printFinalResult(
  filename: string,
  criticalFailures: number,
  warnings: number
) {
  printSeparator();
  if (criticalFailures === 0 && warnings === 0) {
    console.log(`${colors.green}${symbols.pass} ALL CHECKS PASSED${colors.reset}`);
    console.log(`\n${filename} is ready for human review!\n`);
  } else if (criticalFailures === 0) {
    console.log(`${colors.yellow}${symbols.warning} PASSED WITH WARNINGS${colors.reset}`);
    console.log(`\n${warnings} warning(s) - consider addressing before review\n`);
  } else {
    console.log(`${colors.red}${symbols.fail} FAILED${colors.reset}`);
    console.log(`\n${criticalFailures} critical issue(s), ${warnings} warning(s)\n`);
  }
  printSeparator();
}
