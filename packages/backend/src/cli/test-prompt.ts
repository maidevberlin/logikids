#!/usr/bin/env bun

/**
 * Test prompt generation without calling LLM
 * Uses production code paths to ensure consistency
 */

import Mustache from 'mustache';
import { subjectRegistry } from '../subjects/registry';
import { taskTypeRegistry } from '../tasks/types/registry';
import { PromptService } from '../prompts/prompt.service';
import {Difficulty, Gender, TaskGenerationParams} from '../tasks/types';

// Configure Mustache: disable HTML escaping since we generate plain text/markdown
Mustache.escape = (text) => text;

async function testPrompt() {
  // Parse CLI arguments
  const args = process.argv.slice(2);
  const getArg = (name: string, defaultValue: string): string => {
    const arg = args.find(a => a.startsWith(`--${name}=`));
    return arg ? arg.split('=')[1] : defaultValue;
  };

  const subject = getArg('subject', 'logic');
  const concept = getArg('concept', 'patterns');
  const taskType = getArg('taskType', 'multipleChoice');
  const grade = parseInt(getArg('grade', '5'));
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
    console.log = (...args: any[]) => {
      const msg = args.join(' ');
      // Only suppress registry/loader logs
      if (msg.startsWith('[') || msg.includes('Loaded variations:') || msg.includes('Hot-reload') || msg.match(/^\s*- (Scenarios|Problem|Character|Temporal|Metacognitive|Mystery|Real-World|Emotional|Structure)/)) {
        return;
      }
      originalLog(...args);
    };
  }

  if (verbose) {
    console.log('🧪 Testing prompt generation...\n');
    console.log('Parameters:');
    console.log(`  Subject: ${subject}`);
    console.log(`  Concept: ${concept}`);
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

    // Get enriched concept
    if (verbose) console.log('Loading concept...');
    const enrichedConcept = subjectRegistry.getEnrichedConcept(subject, concept);
    if (!enrichedConcept) {
      throw new Error(`Concept not found: ${concept} in subject ${subject}`);
    }

    // Create and initialize PromptService
    if (verbose) console.log('Initializing PromptService...');
    const promptService = new PromptService();
    await promptService.initialize();

    // Calculate age from grade
    const age = grade + 6;

    // Build prompt using PromptService
    if (verbose) console.log('Building prompt...');
    const prompt = await promptService.buildPrompt({
      subject: subjectObj,
      taskType: taskTypeObj,
      concept: enrichedConcept,
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
