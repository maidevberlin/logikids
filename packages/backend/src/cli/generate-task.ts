#!/usr/bin/env bun

/**
 * Generate a complete task using AI
 * Used for testing concept quality by generating real tasks
 */

import { subjectRegistry } from '../subjects/registry';
import { taskTypeRegistry } from '../tasks/types/registry';
import { PromptService } from '../prompts/prompt.service';
import { PromptLoader } from '../prompts/loader';
import { VariationLoader } from '../variations/loader';
import { TaskService } from '../tasks/task.service';
import { TaskCache } from '../cache/taskCache';
import { createAIClient } from '../common/ai/factory';
import { Difficulty, Gender, TaskRequest } from '../tasks/types';
import fs from 'fs';

async function generateTask() {
  // Parse CLI arguments
  const args = process.argv.slice(2);
  const getArg = (name: string, defaultValue: string): string => {
    const arg = args.find(a => a.startsWith(`--${name}=`));
    return arg ? arg.split('=')[1] : defaultValue;
  };

  const subject = getArg('subject', 'logic');
  const concept = getArg('concept', '');
  const taskType = getArg('taskType', 'singleChoice');
  const grade = parseInt(getArg('grade', '5'));
  const difficulty = getArg('difficulty', 'medium') as Difficulty;
  const language = getArg('language', 'en');
  const gender = getArg('gender', '') as Gender;
  const output = getArg('output', '');
  const verbose = args.includes('--verbose');

  // Suppress all debug logs unless verbose
  if (!verbose) {
    process.env.NODE_ENV = 'production';
    const originalLog = console.log;
    console.log = (...args: any[]) => {
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
    if (concept) console.log(`  Concept: ${concept}`);
    console.log(`  Task Type: ${taskType}`);
    console.log(`  Grade: ${grade}`);
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

    // Calculate age from grade
    const age = grade + 6;

    // Build task request
    const request: TaskRequest = {
      subject,
      concept: concept || undefined,
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
      console.log('Subject:', taskResponse.subject);
      console.log('Concept:', taskResponse.concept);
      console.log('Task Type:', taskResponse.taskType);
      console.log('Difficulty:', taskResponse.difficulty);
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
