#!/usr/bin/env bun
/**
 * Concept Check CLI
 *
 * Automated validation tool for educational concept files.
 * Checks schema, filename patterns, content rules, and translations.
 *
 * Usage:
 *   bun run src/cli/concept-check.ts <path-to-concept.md>
 *   bun run src/cli/concept-check.ts ../../packages/content/subjects/math/official/grade5-fractions.md
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, basename, dirname } from 'path';
import matter from 'gray-matter';
import { conceptFrontmatterSchema } from '../prompts/schemas';
import type { ZodError } from 'zod';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

interface CheckIssue {
  line?: number;
  message: string;
  fix: string;
  reference?: string;
}

interface CheckResult {
  status: 'pass' | 'fail' | 'warning';
  issues: CheckIssue[];
}

// ═══════════════════════════════════════════════════════
// SCHEMA CHECKER
// ═══════════════════════════════════════════════════════

function checkSchema(frontmatter: any): CheckResult {
  const result = conceptFrontmatterSchema.safeParse(frontmatter);

  if (result.success) {
    return { status: 'pass', issues: [] };
  }

  const issues: CheckIssue[] = result.error.errors.map(err => ({
    message: `Field '${err.path.join('.')}': ${err.message}`,
    fix: 'Fix the frontmatter field according to the schema requirements',
    reference: 'src/prompts/schemas.ts:conceptFrontmatterSchema',
  }));

  return { status: 'fail', issues };
}

// ═══════════════════════════════════════════════════════
// FILENAME CHECKER
// ═══════════════════════════════════════════════════════

function checkFilename(filename: string, grade: number): CheckResult {
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

// ═══════════════════════════════════════════════════════
// CONTENT CHECKER (CARDINAL RULE)
// ═══════════════════════════════════════════════════════

function checkContent(content: string): CheckResult {
  const lines = content.split('\n');
  const issues: CheckIssue[] = [];

  // Patterns to detect code examples
  const patterns = [
    { regex: /<svg/i, description: 'SVG code snippet detected' },
    { regex: /<\/svg>/i, description: 'SVG closing tag detected' },
    { regex: /\$\$/, description: 'LaTeX delimiter ($$) detected' },
    { regex: /\\\[/, description: 'LaTeX delimiter (\\[) detected' },
    { regex: /\\\]/, description: 'LaTeX delimiter (\\]) detected' },
    // Match actual equations with = or operations with spaces, avoid ranges like "4-6"
    { regex: /\b\d+\s*[+*/]\s*\d+/, description: 'Numerical example detected' },
    { regex: /\b\d+\s*=\s*\d+/, description: 'Numerical example detected' },
    { regex: /"\d+\/\d+/, description: 'Fraction example detected' },
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

// ═══════════════════════════════════════════════════════
// STRUCTURE CHECKER
// ═══════════════════════════════════════════════════════

function checkStructure(content: string): CheckResult {
  const lines = content.split('\n');
  let count = 0;
  let inProblemSection = false;

  for (const line of lines) {
    // Detect problem variations section
    if (/##\s*(problem|variations|structure)/i.test(line)) {
      inProblemSection = true;
      continue;
    }

    // Stop at next major section
    if (inProblemSection && /^##\s+[^p]/i.test(line)) {
      break;
    }

    // Count numbered items or bullet points in problem section
    if (inProblemSection) {
      if (/^\d+\.\s+\*\*/.test(line) || /^-\s+\*\*/.test(line)) {
        count++;
      }
    }
  }

  if (count < 5) {
    return {
      status: 'warning',
      issues: [{
        message: `Found ${count} problem structures, required 5-10`,
        fix: `Add ${5 - count}-${10 - count} more distinct problem structure descriptions`,
        reference: 'generate-concept SKILL.md lines 92-93',
      }],
    };
  }

  if (count > 10) {
    return {
      status: 'warning',
      issues: [{
        message: `Found ${count} problem structures, recommended maximum is 10`,
        fix: 'Consider consolidating similar problem structures',
        reference: 'generate-concept SKILL.md lines 92-93',
      }],
    };
  }

  return { status: 'pass', issues: [] };
}

// ═══════════════════════════════════════════════════════
// TEMPLATE CHECKER
// ═══════════════════════════════════════════════════════

function checkTemplates(content: string): CheckResult {
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

// ═══════════════════════════════════════════════════════
// TRANSLATION CHECKER
// ═══════════════════════════════════════════════════════

function checkTranslations(conceptId: string, subjectPath: string): CheckResult {
  // Determine subject from path
  const pathParts = subjectPath.split('/');
  const subjectIdx = pathParts.indexOf('subjects');
  if (subjectIdx === -1) {
    return {
      status: 'warning',
      issues: [{
        message: 'Cannot determine subject from path',
        fix: 'Ensure concept file is in packages/content/subjects/{subject}/official/',
      }],
    };
  }

  const subject = pathParts[subjectIdx + 1];
  const localesPath = resolve(process.cwd(), '../../packages/frontend/public/locales');

  const languages = ['de', 'en'];
  const issues: CheckIssue[] = [];

  for (const lang of languages) {
    const translationPath = resolve(localesPath, lang, 'subjects', `${subject}.json`);

    if (!existsSync(translationPath)) {
      issues.push({
        message: `${lang}: Translation file not found at ${translationPath}`,
        fix: `Create translation file for ${lang}`,
      });
      continue;
    }

    try {
      const translations = JSON.parse(readFileSync(translationPath, 'utf-8'));
      const conceptKey = `concepts.${conceptId}`;

      // Check if concept key exists
      if (!translations.concepts || !translations.concepts[conceptId]) {
        issues.push({
          message: `${lang}: Missing key "${conceptKey}"`,
          fix: `Add translation to ${translationPath}`,
          reference: 'review-concept SKILL.md lines 82-87',
        });
        continue;
      }

      // Check if name and description exist
      const concept = translations.concepts[conceptId];
      if (!concept.name) {
        issues.push({
          message: `${lang}: Missing "name" in "${conceptKey}"`,
          fix: `Add name field to ${translationPath}`,
        });
      }
      if (!concept.description) {
        issues.push({
          message: `${lang}: Missing "description" in "${conceptKey}"`,
          fix: `Add description field to ${translationPath}`,
        });
      }

      // Note: Alphabetical sorting check removed as it's not part of critical validation

    } catch (error) {
      issues.push({
        message: `${lang}: Error reading translation file: ${error}`,
        fix: `Check JSON syntax in ${translationPath}`,
      });
    }
  }

  return {
    status: issues.length > 0 ? 'fail' : 'pass',
    issues,
  };
}

// ═══════════════════════════════════════════════════════
// REPORT FORMATTING
// ═══════════════════════════════════════════════════════

function printSeparator() {
  console.log('═'.repeat(63));
}

function printSection(title: string, result: CheckResult) {
  printSeparator();
  console.log(title);
  printSeparator();

  if (result.status === 'pass') {
    console.log(`${colors.green}✅ PASS${colors.reset}\n`);
    return;
  }

  const statusIcon = result.status === 'fail'
    ? `${colors.red}❌ FAIL${colors.reset}`
    : `${colors.yellow}⚠️  WARNING${colors.reset}`;

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

function printFinalResult(
  filename: string,
  criticalFailures: number,
  warnings: number
) {
  printSeparator();
  if (criticalFailures === 0 && warnings === 0) {
    console.log(`${colors.green}✅ ALL CHECKS PASSED${colors.reset}`);
    console.log(`\n${filename} is ready for human review!\n`);
  } else if (criticalFailures === 0) {
    console.log(`${colors.yellow}⚠️  PASSED WITH WARNINGS${colors.reset}`);
    console.log(`\n${warnings} warning(s) - consider addressing before review\n`);
  } else {
    console.log(`${colors.red}❌ FAILED${colors.reset}`);
    console.log(`\n${criticalFailures} critical issue(s), ${warnings} warning(s)\n`);
  }
  printSeparator();
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
${colors.cyan}🔍 Concept Check CLI${colors.reset}

Automated validation for educational concept files.

Usage:
  bun run src/cli/concept-check.ts <path-to-concept.md>

Examples:
  bun run src/cli/concept-check.ts ../../packages/content/subjects/math/official/grade5-fractions.md
  bun run src/cli/concept-check.ts ../content/subjects/physics/official/grade8-energy.md

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

  const filePath = resolve(args[0]);
  const filename = basename(filePath);

  // Check file exists
  if (!existsSync(filePath)) {
    console.error(`${colors.red}❌ Error: File not found${colors.reset}`);
    console.error(`  Path: ${filePath}\n`);
    process.exit(1);
  }

  // Skip base.md files
  if (filename === 'base.md') {
    console.log(`${colors.yellow}⚠️  Skipping base.md file${colors.reset}\n`);
    process.exit(0);
  }

  console.log(`\n${colors.cyan}🔍 Checking concept: ${filename}${colors.reset}\n`);

  try {
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
    const translationResult = checkTranslations(frontmatter.id, filePath);

    // Print all results
    printSection('SCHEMA VALIDATION', schemaResult);
    printSection('FILENAME CONVENTION', filenameResult);
    printSection('CARDINAL RULE - No Example Code', contentResult);
    printSection('PROBLEM STRUCTURE VARIETY', structureResult);
    printSection('TEMPLATE VARIABLES', templateResult);
    printSection('TRANSLATIONS', translationResult);

    // Count failures and warnings
    const results = [
      filenameResult,
      contentResult,
      structureResult,
      templateResult,
      translationResult,
    ];

    const criticalFailures = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    printFinalResult(filename, criticalFailures, warnings);

    // Exit with appropriate code
    process.exit(criticalFailures > 0 ? 1 : 0);

  } catch (error) {
    console.error(`${colors.red}❌ Error processing file:${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

main();
