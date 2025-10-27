#!/usr/bin/env bun

/**
 * Validate all prompt templates by initializing registries
 * Uses production code paths to ensure consistency
 */

import { subjectRegistry } from '../tasks/subject.registry';
import { taskTypeRegistry } from '../tasks/types/registry';
import { PromptLoader } from '../tasks/loader';

async function validatePrompts() {
  console.log('🔍 Validating prompt templates...\n');

  try {
    // Initialize prompt loader
    const loader = new PromptLoader();

    // Test loading base prompt
    console.log('✓ Loading base prompt...');
    const basePrompt = await loader.loadBasePrompt();
    if (!basePrompt) {
      throw new Error('Failed to load base prompt');
    }

    // Initialize subject registry
    console.log('✓ Initializing subject registry...');
    await subjectRegistry.initialize();
    const subjects = subjectRegistry.getAll();
    console.log(`  Found ${subjects.length} subjects: ${subjects.map(s => s.id).join(', ')}`);

    // Validate each subject has base template and concepts
    for (const subject of subjects) {
      console.log(`  ✓ ${subject.id}: ${subject.concepts.size} concepts`);

      if (!subject.basePromptTemplate) {
        throw new Error(`Subject ${subject.id} has no base template`);
      }
    }

    // Initialize task type registry
    console.log('✓ Initializing task type registry...');
    await taskTypeRegistry.initialize();
    const taskTypes = taskTypeRegistry.getAll();
    console.log(`  Found ${taskTypes.length} task types: ${taskTypes.map(t => t.id).join(', ')}`);

    // Validate variations.md exists
    console.log('✓ Checking variations template...');
    const fs = require('fs');
    const path = require('path');
    const variationsPath = path.join(process.cwd(), 'prompts', 'variations.md');

    if (!fs.existsSync(variationsPath)) {
      throw new Error('variations.md not found at prompts/variations.md');
    }

    console.log('\n✅ All prompt templates are valid!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Validation failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run validation
validatePrompts();
