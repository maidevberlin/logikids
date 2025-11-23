#!/usr/bin/env bun
/**
 * Subject Checker - Batch validation for all concepts in a subject
 *
 * Validates all concept files for a given subject.
 *
 * Usage:
 *   bun run src/cli/check-subject.ts <subject>
 *   bun run src/cli/check-subject.ts math
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { basename, join } from 'path';
import matter from 'gray-matter';
import { resolveSubjectPath } from './lib/paths';
import {
  checkSchema,
  checkFilename,
  checkContent,
  checkStructure,
  checkTemplates,
  checkTranslations,
  checkWordCount,
} from './lib/validators';
import {
  colors,
  symbols,
  printProgress,
  printResult,
  printSummary,
  type SummaryItem,
} from './lib/output';

interface ConceptCheckResult {
  filename: string;
  passed: boolean;
  issues: number;
  warnings: number;
}

function checkConcept(conceptPath: string, subject: string): ConceptCheckResult | null {
  const filename = basename(conceptPath);

  // Skip base.md files
  if (filename === 'base.md') {
    return null;
  }

  try {
    // Parse file
    const fileContent = readFileSync(conceptPath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Run all checks
    const schemaResult = checkSchema(frontmatter);

    // If schema fails, count as critical failure
    if (schemaResult.status === 'fail') {
      return {
        filename,
        passed: false,
        issues: schemaResult.issues.length,
        warnings: 0,
      };
    }

    // Run remaining checks
    const results = [
      checkFilename(filename, frontmatter.grade),
      checkContent(content),
      checkStructure(content),
      checkTemplates(content),
      checkWordCount(content),
      checkTranslations(frontmatter.id, subject),
    ];

    const criticalFailures = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;
    const totalIssues = results
      .filter(r => r.status === 'fail')
      .reduce((sum, r) => sum + r.issues.length, 0);

    return {
      filename,
      passed: criticalFailures === 0,
      issues: totalIssues,
      warnings,
    };

  } catch (error) {
    // Parsing error counts as failure
    return {
      filename,
      passed: false,
      issues: 1,
      warnings: 0,
    };
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
${colors.cyan}${symbols.info} Subject Checker${colors.reset}

Validates all concept files for a given subject.

Usage:
  bun run src/cli/check-subject.ts <subject>

Examples:
  bun run src/cli/check-subject.ts math
  bun run src/cli/check-subject.ts physics
  bun run src/cli/check-subject.ts german

Checks all .md files in packages/content/subjects/{subject}/official/
`);
    process.exit(0);
  }

  const subject = args[0];
  const subjectPath = resolveSubjectPath(subject);

  // Check if subject directory exists
  if (!existsSync(subjectPath)) {
    console.error(`${colors.red}${symbols.fail} Error: Subject directory not found${colors.reset}`);
    console.error(`  Path: ${subjectPath}\n`);
    process.exit(1);
  }

  // Get all .md files
  const files = readdirSync(subjectPath)
    .filter(f => f.endsWith('.md') && f !== 'base.md')
    .sort();

  if (files.length === 0) {
    console.log(`${colors.yellow}${symbols.warning} No concept files found in ${subject}${colors.reset}\n`);
    process.exit(0);
  }

  console.log(`\n${colors.cyan}${symbols.info} Checking ${files.length} concepts for subject: ${subject}${colors.reset}\n`);

  const results: ConceptCheckResult[] = [];
  let checked = 0;

  // Check each concept
  for (const file of files) {
    const conceptPath = join(subjectPath, file);
    checked++;

    printProgress(checked, files.length, file);

    const result = checkConcept(conceptPath, subject);

    if (result) {
      results.push(result);
      printResult(result.passed, result.warnings, result.issues);
    }
  }

  // Convert to summary format
  const summaryItems: SummaryItem[] = results.map(r => ({
    name: r.filename,
    passed: r.passed,
    issues: r.issues,
    warnings: r.warnings,
  }));

  // Print summary
  printSummary('SUMMARY', summaryItems);

  // Exit with appropriate code
  const failed = results.filter(r => !r.passed).length;
  process.exit(failed > 0 ? 1 : 0);
}

main();
