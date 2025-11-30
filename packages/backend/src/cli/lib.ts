/**
 * Shared CLI utilities for generate-task and generate-prompt
 */

import { subjectRegistry } from '../subjects/registry';
import { taskTypeRegistry, TaskTypeWithSchema } from '../tasks/types/registry';
import { PromptService } from '../prompts/service';
import { PromptLoader, Subject } from '../prompts/loader';
import { VariationLoader } from '../prompts/variations/loader';
import { Difficulty, Gender } from '../tasks/types';
import { Concept } from '../prompts/schemas';

// ANSI colors
export const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
};

export interface ParsedCliArgs {
  subject: string;
  concept: string;
  taskType: string;
  grade: number;
  difficulty: Difficulty;
  language: string;
  gender: Gender | undefined;
  output: string;
  verbose: boolean;
}

/**
 * Parse CLI arguments for generate commands
 * @returns parsed args or null if should show usage
 */
export function parseCliArgs(args: string[], printUsage: () => void): ParsedCliArgs | null {
  // No arguments - show usage
  if (args.length === 0 || args[0].startsWith('--')) {
    printUsage();
    return null;
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
  const genderArg = getArg('gender', '');
  const output = getArg('output', '');
  const verbose = args.includes('--verbose');

  return {
    subject,
    concept,
    taskType,
    grade: gradeArg ? parseInt(gradeArg) : 0,
    difficulty,
    language,
    gender: genderArg ? (genderArg as Gender) : undefined,
    output,
    verbose,
  };
}

/**
 * Print parsed CLI parameters (for verbose mode)
 */
export function printParameters(args: ParsedCliArgs): void {
  console.log('Parameters:');
  console.log(`  Subject: ${args.subject}`);
  console.log(`  Concept: ${args.concept}`);
  console.log(`  Task Type: ${args.taskType}`);
  console.log(`  Grade: ${args.grade || '(from concept)'}`);
  console.log(`  Difficulty: ${args.difficulty}`);
  console.log(`  Language: ${args.language}`);
  if (args.gender) console.log(`  Gender: ${args.gender}`);
  console.log('');
}

/**
 * Suppress debug logs unless verbose mode is enabled
 */
export function suppressLogsUnlessVerbose(verbose: boolean): void {
  if (!verbose) {
    process.env.NODE_ENV = 'production';
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      const msg = args.join(' ');
      // Suppress registry/loader logs
      if (
        msg.startsWith('[') ||
        msg.includes('Loaded variations:') ||
        msg.includes('Hot-reload') ||
        msg.match(/^\s*- (Scenarios|Problem|Character|Temporal|Metacognitive|Mystery|Real-World|Emotional|Structure)/)
      ) {
        return;
      }
      originalLog(...args);
    };
  }
}

export interface InitializedServices {
  promptService: PromptService;
  concept: Concept;
  subject: Subject;
  taskType: TaskTypeWithSchema;
  grade: number;
  age: number;
}

/**
 * Initialize registries and services needed for task/prompt generation
 */
export async function initializeServices(
  subjectId: string,
  conceptId: string,
  taskTypeId: string,
  gradeOverride: number,
  verbose: boolean
): Promise<InitializedServices> {
  // Initialize registries
  if (verbose) console.log('Initializing registries...');
  await subjectRegistry.initialize();
  await taskTypeRegistry.initialize();

  // Load subject
  if (verbose) console.log('Loading subject and task type...');
  const subject = subjectRegistry.get(subjectId);
  if (!subject) {
    throw new Error(`Subject not found: ${subjectId}`);
  }

  // Load task type
  const taskType = taskTypeRegistry.get(taskTypeId);
  if (!taskType) {
    throw new Error(`Task type not found: ${taskTypeId}`);
  }

  // Load concept
  if (verbose) console.log('Loading concept...');
  const concept = subjectRegistry.getConcept(subjectId, conceptId);
  if (!concept) {
    throw new Error(`Concept not found: ${conceptId} in subject ${subjectId}`);
  }

  // Determine grade
  const grade = gradeOverride || concept.grade;
  const age = grade + 6;

  // Create loaders and PromptService
  if (verbose) console.log('Creating loaders...');
  const promptLoader = new PromptLoader();
  const variationLoader = new VariationLoader();

  if (verbose) console.log('Initializing PromptService...');
  const promptService = new PromptService(promptLoader, variationLoader);
  await promptService.initialize();

  return {
    promptService,
    concept,
    subject,
    taskType,
    grade,
    age,
  };
}
