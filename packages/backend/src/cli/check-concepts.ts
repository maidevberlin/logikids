#!/usr/bin/env bun
/**
 * Concept Checker CLI
 *
 * Unified validation tool for educational concept files.
 * Supports single concept, subject-wide, or all-concepts validation.
 *
 * Usage:
 *   bun run check:concepts                              # Show usage
 *   bun run check:concepts math/grade5-fractions        # Single concept
 *   bun run check:concepts --subject math               # All in subject
 *   bun run check:concepts --all                        # All subjects
 */

import { readdirSync, existsSync } from 'fs';
import { basename, join } from 'path';
import {
  resolveConceptPath,
  resolveSubjectPath,
  extractSubjectFromPath,
  getSubjectsBasePath,
} from './lib/paths';
import {
  checkFilename,
  checkContent,
  checkStructure,
  checkTemplates,
  checkTranslations,
  checkWordCount,
  checkPrerequisites,
  parseAndValidateConcept,
} from './lib/validators';
import {
  colors,
  symbols,
  printSection,
  printFinalResult,
  printProgress,
  printResult,
  printSummary,
  type SummaryItem,
} from './lib/output';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface ConceptCheckResult {
  filename: string;
  subject: string;
  passed: boolean;
  issues: number;
  warnings: number;
}

// ═══════════════════════════════════════════════════════════════
// SINGLE CONCEPT CHECK (DETAILED OUTPUT)
// ═══════════════════════════════════════════════════════════════

function checkSingleConcept(input: string): number {
  const filePath = resolveConceptPath(input);
  const filename = basename(filePath);
  const subject = extractSubjectFromPath(filePath);

  // Check file exists
  if (!existsSync(filePath)) {
    console.error(`${colors.red}${symbols.fail} Error: File not found${colors.reset}`);
    console.error(`  Path: ${filePath}\n`);
    return 1;
  }

  // Skip base.md files
  if (filename === 'base.md') {
    console.log(`${colors.yellow}${symbols.warning} Skipping base.md file${colors.reset}\n`);
    return 0;
  }

  console.log(`\n${colors.cyan}${symbols.info} Checking concept: ${input}${colors.reset}\n`);

  try {
    // Parse and validate
    const parseResult = parseAndValidateConcept(filePath);

    if (!parseResult.success) {
      printSection('SCHEMA VALIDATION', parseResult.schemaResult);
      printFinalResult(filename, 1, 0);
      return 1;
    }

    const { frontmatter, content } = parseResult.parsed;

    const filenameResult = checkFilename(filename, frontmatter.grade);
    const contentResult = checkContent(content);
    const structureResult = checkStructure(frontmatter);
    const templateResult = checkTemplates(content);
    const wordCountResult = checkWordCount(content);
    const prerequisitesResult = checkPrerequisites(frontmatter);
    const translationResult = checkTranslations(frontmatter.id, subject);

    // Print all results
    printSection('SCHEMA VALIDATION', parseResult.parsed.schemaResult);
    printSection('FILENAME CONVENTION', filenameResult);
    printSection('CARDINAL RULE - No Example Code', contentResult);
    printSection('PROBLEM STRUCTURE VARIETY', structureResult);
    printSection('TEMPLATE VARIABLES', templateResult);
    printSection('WORD COUNT', wordCountResult);
    printSection('PREREQUISITES', prerequisitesResult);
    printSection('TRANSLATIONS', translationResult);

    // Count failures and warnings
    const results = [
      filenameResult,
      contentResult,
      structureResult,
      templateResult,
      wordCountResult,
      prerequisitesResult,
      translationResult,
    ];

    const criticalFailures = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    printFinalResult(filename, criticalFailures, warnings);

    return criticalFailures > 0 ? 1 : 0;

  } catch (error) {
    console.error(`${colors.red}${symbols.fail} Error processing file:${colors.reset}`);
    console.error(error);
    return 1;
  }
}

// ═══════════════════════════════════════════════════════════════
// BATCH CONCEPT CHECK (SUMMARY OUTPUT)
// ═══════════════════════════════════════════════════════════════

function checkConceptBatch(conceptPath: string, subject: string): ConceptCheckResult | null {
  const filename = basename(conceptPath);

  // Skip base.md files
  if (filename === 'base.md') {
    return null;
  }

  try {
    // Parse and validate
    const parseResult = parseAndValidateConcept(conceptPath);

    if (!parseResult.success) {
      return {
        filename,
        subject,
        passed: false,
        issues: parseResult.schemaResult.issues.length,
        warnings: 0,
      };
    }

    const { frontmatter, content } = parseResult.parsed;

    // Run remaining checks
    const results = [
      checkFilename(filename, frontmatter.grade),
      checkContent(content),
      checkStructure(frontmatter),
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
      subject,
      passed: criticalFailures === 0,
      issues: totalIssues,
      warnings,
    };

  } catch (error) {
    // Parsing error counts as failure
    return {
      filename,
      subject,
      passed: false,
      issues: 1,
      warnings: 0,
    };
  }
}

function checkSubject(subject: string): ConceptCheckResult[] {
  const subjectPath = resolveSubjectPath(subject);

  // Check if subject directory exists
  if (!existsSync(subjectPath)) {
    console.error(`${colors.red}${symbols.fail} Error: Subject directory not found${colors.reset}`);
    console.error(`  Path: ${subjectPath}\n`);
    return [];
  }

  // Get all .md files
  const files = readdirSync(subjectPath)
    .filter(f => f.endsWith('.md') && f !== 'base.md')
    .sort();

  if (files.length === 0) {
    console.log(`${colors.yellow}${symbols.warning} No concept files found in ${subject}${colors.reset}`);
    return [];
  }

  console.log(`\n${colors.cyan}${symbols.info} Checking ${files.length} concepts for subject: ${subject}${colors.reset}\n`);

  const results: ConceptCheckResult[] = [];
  let checked = 0;

  // Check each concept
  for (const file of files) {
    const conceptPath = join(subjectPath, file);
    checked++;

    printProgress(checked, files.length, file);

    const result = checkConceptBatch(conceptPath, subject);

    if (result) {
      results.push(result);
      printResult(result.passed, result.warnings, result.issues);
    }
  }

  return results;
}

function checkAllSubjects(): ConceptCheckResult[] {
  const subjectsBase = getSubjectsBasePath();

  if (!existsSync(subjectsBase)) {
    console.error(`${colors.red}${symbols.fail} Error: Subjects directory not found${colors.reset}`);
    console.error(`  Path: ${subjectsBase}\n`);
    return [];
  }

  // Get all subject directories
  const subjects = readdirSync(subjectsBase, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  if (subjects.length === 0) {
    console.log(`${colors.yellow}${symbols.warning} No subjects found${colors.reset}`);
    return [];
  }

  console.log(`\n${colors.cyan}${symbols.info} Checking all concepts across ${subjects.length} subjects${colors.reset}`);

  const allResults: ConceptCheckResult[] = [];

  for (const subject of subjects) {
    const results = checkSubject(subject);
    allResults.push(...results);
  }

  return allResults;
}

// ═══════════════════════════════════════════════════════════════
// USAGE
// ═══════════════════════════════════════════════════════════════

function printUsage() {
  console.log(`
${colors.cyan}${symbols.info} Concept Checker CLI${colors.reset}

Unified validation for educational concept files.

${colors.cyan}Usage:${colors.reset}
  bun run check:concepts <subject>/<concept>   Check a single concept
  bun run check:concepts <subject>             Check all concepts in a subject
  bun run check:concepts --all                 Check all concepts in all subjects

${colors.cyan}Examples:${colors.reset}
  bun run check:concepts math/grade5-fractions
  bun run check:concepts math
  bun run check:concepts --all

${colors.cyan}Checks performed:${colors.reset}
  • Schema validation (frontmatter fields and types)
  • Filename convention (grade{X}-{name}.md)
  • CARDINAL RULE (no code examples)
  • Problem structure variety (5-10 problem types)
  • Template variables ({{age}}, {{difficulty}})
  • Word count (150-250 optimal, 300+ warning, 400+ fail)
  • Prerequisites validation
  • Translation completeness (all languages)
`);
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  // No arguments - show usage
  if (args.length === 0) {
    printUsage();
    process.exit(0);
  }

  const input = args[0];

  // --all: check all subjects
  if (input === '--all') {
    const results = checkAllSubjects();

    if (results.length === 0) {
      process.exit(1);
    }

    // Convert to summary format
    const summaryItems: SummaryItem[] = results.map(r => ({
      name: `${r.subject}/${r.filename}`,
      passed: r.passed,
      issues: r.issues,
      warnings: r.warnings,
    }));

    printSummary('SUMMARY - ALL SUBJECTS', summaryItems);

    const failed = results.filter(r => !r.passed).length;
    process.exit(failed > 0 ? 1 : 0);
  }

  // Contains / -> single concept (e.g., math/grade5-fractions)
  if (input.includes('/')) {
    const exitCode = checkSingleConcept(input);
    process.exit(exitCode);
  }

  // No / -> subject name (e.g., math)
  const subject = input;
  const results = checkSubject(subject);

  if (results.length === 0) {
    process.exit(1);
  }

  // Convert to summary format
  const summaryItems: SummaryItem[] = results.map(r => ({
    name: r.filename,
    passed: r.passed,
    issues: r.issues,
    warnings: r.warnings,
  }));

  printSummary(`SUMMARY - ${subject.toUpperCase()}`, summaryItems);

  const failed = results.filter(r => !r.passed).length;
  process.exit(failed > 0 ? 1 : 0);
}

void main();
