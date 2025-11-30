#!/usr/bin/env bun

/**
 * Generate a complete task using AI
 * Used for testing concept quality by generating real tasks
 *
 * Usage:
 *   bun run generate:task                            # Show usage
 *   bun run generate:task math/grade5-fractions      # Generate task for concept
 *   bun run generate:task math/grade5-fractions --difficulty=hard
 */

import { subjectRegistry } from '../subjects/registry';
import { taskTypeRegistry } from '../tasks/types/registry';
import { PromptService } from '../prompts/service';
import { PromptLoader } from '../prompts/loader';
import { VariationLoader } from '../variations/loader';
import { TaskService } from '../tasks/service';
import { TaskCache } from '../cache/taskCache';
import { createAIClient } from '../common/ai/factory';
import { Difficulty, Gender, TaskRequest } from '../tasks/types';
import fs from 'fs';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
};

function printUsage() {
  console.log(`
${colors.cyan}🤖 Generate Task CLI${colors.reset}

Generate a complete task using AI.

${colors.cyan}Usage:${colors.reset}
  bun run generate:task <subject>/<concept>   Generate task for a concept

${colors.cyan}Options:${colors.reset}
  --taskType=<type>      Task type (default: singleChoice)
  --grade=<n>            Grade level (default: from concept)
  --difficulty=<level>   easy, medium, hard (default: medium)
  --language=<lang>      Language code (default: en)
  --gender=<g>           male, female (optional)
  --output=<file>        Save task to file
  --verbose              Show debug info

${colors.cyan}Examples:${colors.reset}
  bun run generate:task math/grade5-fractions
  bun run generate:task math/grade1-basic-arithmetic-operations --difficulty=easy
  bun run generate:task math/grade5-fractions --taskType=multipleSelect --verbose
`);
}

async function generateTask() {
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

  // Grade will be determined after loading concept if not specified
  let grade = gradeArg ? parseInt(gradeArg) : 0;

  // Suppress all debug logs unless verbose
  if (!verbose) {
    process.env.NODE_ENV = 'production';
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      const msg = args.join(' ');
      // Only suppress registry/loader logs
      if (msg.startsWith('[') || msg.includes('Loaded variations:') || msg.includes('Hot-reload')) {
        return;
      }
      originalLog(...args);
    };
  }

  if (verbose) {
    console.log('🤖 Generating task with AI...\n');
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

    // Create loaders
    if (verbose) console.log('Creating loaders...');
    const promptLoader = new PromptLoader();
    const variationLoader = new VariationLoader();

    // Create and initialize PromptService
    if (verbose) console.log('Initializing PromptService...');
    const promptService = new PromptService(promptLoader, variationLoader);
    await promptService.initialize();

    // Create AI client
    if (verbose) console.log('Creating AI client...');
    const aiClient = await createAIClient();

    // Create task cache (in-memory for CLI)
    const taskCache = new TaskCache();

    // Create TaskService
    if (verbose) console.log('Creating TaskService...');
    const taskService = new TaskService(
      aiClient,
      promptService,
      subjectRegistry,
      taskTypeRegistry,
      taskCache
    );

    // Get concept and use its grade if not specified
    const selectedConcept = subjectRegistry.getConcept(subject, concept);
    if (!selectedConcept) {
      throw new Error(`Concept not found: ${concept} in subject ${subject}`);
    }

    if (!grade) {
      grade = selectedConcept.grade;
    }

    // Calculate age from grade
    const age = grade + 6;

    // Build task request
    const request: TaskRequest = {
      subject,
      concept,
      taskType,
      grade,
      age,
      difficulty,
      language,
      gender: gender || undefined
    };

    // Generate task
    if (verbose) console.log('Generating task with AI...\n');
    const taskResponse = await taskService.generateTask(request);

    // Output result
    if (verbose) {
      console.log('\n' + '='.repeat(80));
      console.log('GENERATED TASK');
      console.log('='.repeat(80) + '\n');
      console.log('Task ID:', taskResponse.taskId);
      console.log('Subject:', subject);
      console.log('Concept:', concept);
      console.log('Task Type:', taskType);
      console.log('Difficulty:', difficulty);
      console.log('\nTask Data:');
      console.log(JSON.stringify(taskResponse.task, null, 2));
      console.log('\n' + '='.repeat(80));
    } else {
      // Clean output: just the task as JSON
      console.log(JSON.stringify(taskResponse, null, 2));
    }

    // Save to file if requested
    if (output) {
      fs.writeFileSync(output, JSON.stringify(taskResponse, null, 2));
      if (verbose) console.log(`✅ Task saved to: ${output}`);
    }

    if (verbose) console.log('✅ Task generation successful!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Task generation failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run generation
generateTask();
