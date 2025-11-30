#!/usr/bin/env bun

/**
 * Test prompt generation without calling LLM
 * Uses production code paths to ensure consistency
 *
 * Usage:
 *   bun run generate:prompt                          # Show usage
 *   bun run generate:prompt math/grade5-fractions    # Generate prompt with defaults
 *   bun run generate:prompt math/grade5-fractions --difficulty=hard
 */

import { subjectRegistry } from '../subjects/registry';
import { taskTypeRegistry } from '../tasks/types/registry';
import { PromptService } from '../prompts/service';
import { PromptLoader } from '../prompts/loader';
import { VariationLoader } from '../variations/loader';
import {Difficulty, Gender, TaskGenerationParams} from '../tasks/types';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
};

function printUsage() {
  console.log(`
${colors.cyan}🔧 Generate Prompt CLI${colors.reset}

Generate AI prompt without calling LLM (for testing/debugging).

${colors.cyan}Usage:${colors.reset}
  bun run generate:prompt <subject>/<concept>   Generate prompt for a concept

${colors.cyan}Options:${colors.reset}
  --taskType=<type>      Task type (default: singleChoice)
  --grade=<n>            Grade level (default: from concept)
  --difficulty=<level>   easy, medium, hard (default: medium)
  --language=<lang>      Language code (default: en)
  --gender=<g>           male, female (optional)
  --output=<file>        Save prompt to file
  --verbose              Show debug info

${colors.cyan}Examples:${colors.reset}
  bun run generate:prompt math/grade5-fractions
  bun run generate:prompt math/grade1-basic-arithmetic-operations --difficulty=easy
  bun run generate:prompt math/grade5-fractions --taskType=multipleSelect --verbose
`);
}

async function testPrompt() {
  // Parse CLI arguments
  const args = process.argv.slice(2);

  // No arguments - show usage
  if (args.length === 0 || args[0].startsWith('--')) {
    printUsage();
    process.exit(0);
  }

  // First positional arg is subject/concept
  const input = args[0];
  if (!input.includes('/')) {
    console.error('❌ Error: Invalid format. Use subject/concept (e.g., math/grade5-fractions)\n');
    printUsage();
    process.exit(1);
  }

  const [subject, concept] = input.split('/');

  // Parse optional flags
  const getArg = (name: string, defaultValue: string): string => {
    const arg = args.find(a => a.startsWith(`--${name}=`));
    return arg ? arg.split('=')[1] : defaultValue;
  };

  const taskType = getArg('taskType', 'singleChoice');
  const gradeArg = getArg('grade', '');
  const difficulty = getArg('difficulty', 'medium') as Difficulty;
  const language = getArg('language', 'en');
  const gender = getArg('gender', '') as Gender;
  const output = getArg('output', '');
  const verbose = args.includes('--verbose');

  // Suppress all debug logs unless verbose
  if (!verbose) {
    process.env.NODE_ENV = 'production';
    // Suppress console.log from registries
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      const msg = args.join(' ');
      // Only suppress registry/loader logs
      if (msg.startsWith('[') || msg.includes('Loaded variations:') || msg.includes('Hot-reload') || msg.match(/^\s*- (Scenarios|Problem|Character|Temporal|Metacognitive|Mystery|Real-World|Emotional|Structure)/)) {
        return;
      }
      originalLog(...args);
    };
  }

  // Grade will be determined after loading concept if not specified
  let grade = gradeArg ? parseInt(gradeArg) : 0;

  if (verbose) {
    console.log('🧪 Testing prompt generation...\n');
    console.log('Parameters:');
    console.log(`  Subject: ${subject}`);
    console.log(`  Concept: ${concept}`);
    console.log(`  Task Type: ${taskType}`);
    console.log(`  Grade: ${gradeArg || '(from concept)'}`);
    console.log(`  Difficulty: ${difficulty}`);
    console.log(`  Language: ${language}`);
    if (gender) console.log(`  Gender: ${gender}`);
    console.log('');
  }

  try {
    // Initialize registries
    if (verbose) console.log('Initializing registries...');
    await subjectRegistry.initialize();
    await taskTypeRegistry.initialize();

    // Load components
    if (verbose) console.log('Loading subject and task type...');
    const subjectObj = subjectRegistry.get(subject);
    if (!subjectObj) {
      throw new Error(`Subject not found: ${subject}`);
    }

    const taskTypeObj = taskTypeRegistry.get(taskType);
    if (!taskTypeObj) {
      throw new Error(`Task type not found: ${taskType}`);
    }

    // Get concept
    if (verbose) console.log('Loading concept...');
    const selectedConcept = subjectRegistry.getConcept(subject, concept);
    if (!selectedConcept) {
      throw new Error(`Concept not found: ${concept} in subject ${subject}`);
    }

    // Use concept's grade if not specified
    if (!grade) {
      grade = selectedConcept.grade;
    }

    // Create loaders
    if (verbose) console.log('Creating loaders...');
    const promptLoader = new PromptLoader();
    const variationLoader = new VariationLoader();

    // Create and initialize PromptService
    if (verbose) console.log('Initializing PromptService...');
    const promptService = new PromptService(promptLoader, variationLoader);
    await promptService.initialize();

    // Calculate age from grade
    const age = grade + 6;

    // Build prompt using PromptService
    if (verbose) console.log('Building prompt...');
    const prompt = await promptService.buildPrompt({
      subject: subjectObj,
      taskType: taskTypeObj,
      concept: selectedConcept,
      age,
      grade,
      difficulty,
      language,
      gender: gender || undefined
    });

    // Output result
    if (verbose) {
      console.log('\n' + '='.repeat(80));
      console.log('GENERATED PROMPT');
      console.log('='.repeat(80) + '\n');
      console.log(prompt);
      console.log('\n' + '='.repeat(80));
      console.log(`Prompt length: ${prompt.length} characters`);
      console.log('='.repeat(80) + '\n');
    } else {
      // Clean output: just the prompt
      console.log(prompt);
    }

    // Save to file if requested
    if (output) {
      const fs = require('fs');
      fs.writeFileSync(output, prompt);
      if (verbose) console.log(`✅ Prompt saved to: ${output}`);
    }

    if (verbose) console.log('✅ Prompt generation successful!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Prompt generation failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run test
testPrompt();
