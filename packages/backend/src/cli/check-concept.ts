#!/usr/bin/env bun
/**
 * Concept Check CLI
 *
 * Automated validation tool for educational concept files.
 * Checks schema, filename patterns, content rules, and translations.
 *
 * Usage:
 *   bun run src/cli/check-concept.ts <subject>/<concept>
 *   bun run src/cli/check-concept.ts math/grade5-fractions
 */

import { readFileSync, existsSync } from 'fs';
import { basename } from 'path';
import matter from 'gray-matter';
import { resolveConceptPath, extractSubjectFromPath } from './lib/paths';
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
  printSection,
  printFinalResult,
} from './lib/output';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
${colors.cyan}${symbols.info} Concept Check CLI${colors.reset}

Automated validation for educational concept files.

Usage:
  bun run src/cli/check-concept.ts <subject>/<concept>

Examples:
  bun run src/cli/check-concept.ts math/grade5-fractions
  bun run src/cli/check-concept.ts physics/grade8-energy

Checks:
  • Schema validation (frontmatter fields and types)
  • Filename convention (grade{X}-{name}.md)
  • CARDINAL RULE (no code examples)
  • Problem structure variety (5-10 structures)
  • Template variables ({{age}}, {{difficulty}})
  • Translation completeness (all languages)
`);
    process.exit(0);
  }

  const input = args[0];

  try {
    // Resolve path
    const filePath = resolveConceptPath(input);
    const filename = basename(filePath);
    const subject = extractSubjectFromPath(filePath);

    // Check file exists
    if (!existsSync(filePath)) {
      console.error(`${colors.red}${symbols.fail} Error: File not found${colors.reset}`);
      console.error(`  Path: ${filePath}\n`);
      process.exit(1);
    }

    // Skip base.md files
    if (filename === 'base.md') {
      console.log(`${colors.yellow}${symbols.warning} Skipping base.md file${colors.reset}\n`);
      process.exit(0);
    }

    console.log(`\n${colors.cyan}${symbols.info} Checking concept: ${input}${colors.reset}\n`);

    // Parse file
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Run all checks
    const schemaResult = checkSchema(frontmatter);

    // Only run other checks if schema is valid
    if (schemaResult.status === 'fail') {
      printSection('SCHEMA VALIDATION', schemaResult);
      printFinalResult(filename, 1, 0);
      process.exit(1);
    }

    const filenameResult = checkFilename(filename, frontmatter.grade);
    const contentResult = checkContent(content);
    const structureResult = checkStructure(content);
    const templateResult = checkTemplates(content);
    const wordCountResult = checkWordCount(content);
    const translationResult = checkTranslations(frontmatter.id, subject);

    // Print all results
    printSection('SCHEMA VALIDATION', schemaResult);
    printSection('FILENAME CONVENTION', filenameResult);
    printSection('CARDINAL RULE - No Example Code', contentResult);
    printSection('PROBLEM STRUCTURE VARIETY', structureResult);
    printSection('TEMPLATE VARIABLES', templateResult);
    printSection('WORD COUNT', wordCountResult);
    printSection('TRANSLATIONS', translationResult);

    // Count failures and warnings
    const results = [
      filenameResult,
      contentResult,
      structureResult,
      templateResult,
      wordCountResult,
      translationResult,
    ];

    const criticalFailures = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    printFinalResult(filename, criticalFailures, warnings);

    // Exit with appropriate code
    process.exit(criticalFailures > 0 ? 1 : 0);

  } catch (error) {
    console.error(`${colors.red}${symbols.fail} Error processing file:${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

main();
