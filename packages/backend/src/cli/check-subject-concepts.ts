#!/usr/bin/env bun
/**
 * Batch Concept Checker for Subject
 *
 * Validates all concept files for a given subject.
 *
 * Usage:
 *   bun run src/cli/check-subject-concepts.ts <subject>
 *   bun run src/cli/check-subject-concepts.ts math
 */

import { readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { spawnSync } from 'child_process';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

interface ConceptResult {
  filename: string;
  passed: boolean;
  issues: number;
  warnings: number;
}

function checkConcept(conceptPath: string): ConceptResult | null {
  const result = spawnSync('bun', ['src/cli/concept-check.ts', conceptPath], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  });

  const filename = conceptPath.split('/').pop() || conceptPath;

  // Skip base.md files
  if (filename === 'base.md') {
    return null;
  }

  const output = result.stdout + result.stderr;
  const passed = result.status === 0;

  // Count issues and warnings from output
  const failMatches = output.match(/❌ FAIL/g);
  const warningMatches = output.match(/⚠️  WARNING/g);

  return {
    filename,
    passed,
    issues: failMatches ? failMatches.length : 0,
    warnings: warningMatches ? warningMatches.length : 0,
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
${colors.cyan}🔍 Batch Concept Checker${colors.reset}

Validates all concept files for a given subject.

Usage:
  bun run src/cli/check-subject-concepts.ts <subject>

Examples:
  bun run src/cli/check-subject-concepts.ts math
  bun run src/cli/check-subject-concepts.ts physics
  bun run src/cli/check-subject-concepts.ts german

Checks all .md files in packages/content/subjects/{subject}/official/
`);
    process.exit(0);
  }

  const subject = args[0];
  const subjectPath = resolve(process.cwd(), '../../packages/content/subjects', subject, 'official');

  // Check if subject directory exists
  if (!existsSync(subjectPath)) {
    console.error(`${colors.red}❌ Error: Subject directory not found${colors.reset}`);
    console.error(`  Path: ${subjectPath}\n`);
    process.exit(1);
  }

  // Get all .md files
  const files = readdirSync(subjectPath)
    .filter(f => f.endsWith('.md') && f !== 'base.md')
    .sort();

  if (files.length === 0) {
    console.log(`${colors.yellow}⚠️  No concept files found in ${subject}${colors.reset}\n`);
    process.exit(0);
  }

  console.log(`\n${colors.cyan}🔍 Checking ${files.length} concepts for subject: ${subject}${colors.reset}\n`);

  const results: ConceptResult[] = [];
  let checked = 0;

  // Check each concept
  for (const file of files) {
    const conceptPath = join(subjectPath, file);
    checked++;

    process.stdout.write(`${colors.dim}[${checked}/${files.length}]${colors.reset} ${file}...`);

    const result = checkConcept(conceptPath);

    if (result) {
      results.push(result);

      if (result.passed) {
        if (result.warnings > 0) {
          console.log(` ${colors.yellow}⚠️  ${result.warnings} warning(s)${colors.reset}`);
        } else {
          console.log(` ${colors.green}✅${colors.reset}`);
        }
      } else {
        console.log(` ${colors.red}❌ ${result.issues} issue(s)${colors.reset}`);
      }
    }
  }

  // Print summary
  console.log('\n' + '═'.repeat(63));
  console.log('SUMMARY');
  console.log('═'.repeat(63));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const totalIssues = results.reduce((sum, r) => sum + r.issues, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings, 0);

  console.log(`Total concepts checked: ${results.length}`);
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  console.log(`Total critical issues: ${totalIssues}`);
  console.log(`Total warnings: ${totalWarnings}`);

  if (failed > 0) {
    console.log(`\n${colors.red}Failed concepts:${colors.reset}`);
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  • ${r.filename} (${r.issues} issue(s))`);
      });
  }

  console.log('═'.repeat(63) + '\n');

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

main();
