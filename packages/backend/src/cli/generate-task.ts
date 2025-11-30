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

import { subjectRegistry } from '../subjects/registry'
import { taskTypeRegistry } from '../tasks/task-types'
import { TaskService } from '../tasks/service'
import { TaskCache } from '../cache/taskCache'
import { createAIClient } from '../common/ai/factory'
import { TaskRequest } from '../tasks/types'
import fs from 'fs'
import {
  colors,
  parseCliArgs,
  suppressLogsUnlessVerbose,
  initializeServices,
  printParameters,
} from './lib'

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
`)
}

async function generateTask() {
  const parsed = parseCliArgs(process.argv.slice(2), printUsage)
  if (!parsed) {
    process.exit(0)
  }

  const {
    subject,
    concept,
    taskType,
    grade: gradeOverride,
    difficulty,
    language,
    gender,
    output,
    verbose,
  } = parsed

  suppressLogsUnlessVerbose(verbose)

  if (verbose) {
    console.log('🤖 Generating task with AI...\n')
    printParameters(parsed)
  }

  try {
    const services = await initializeServices(subject, concept, taskType, gradeOverride, verbose)
    const { promptService, grade, age } = services

    // Create AI client
    if (verbose) console.log('Creating AI client...')
    const aiClient = await createAIClient()

    // Create task cache (in-memory for CLI)
    const taskCache = new TaskCache()

    // Create TaskService
    if (verbose) console.log('Creating TaskService...')
    const taskService = new TaskService(
      aiClient,
      promptService,
      subjectRegistry,
      taskTypeRegistry,
      taskCache
    )

    // Build task request
    const request: TaskRequest = {
      subject,
      concept,
      taskType,
      grade,
      age,
      difficulty,
      language,
      gender,
    }

    // Generate task
    if (verbose) console.log('Generating task with AI...\n')
    const taskResponse = await taskService.generateTask(request)

    // Output result
    if (verbose) {
      console.log('\n' + '='.repeat(80))
      console.log('GENERATED TASK')
      console.log('='.repeat(80) + '\n')
      console.log('Task ID:', taskResponse.taskId)
      console.log('Subject:', subject)
      console.log('Concept:', concept)
      console.log('Task Type:', taskType)
      console.log('Difficulty:', difficulty)
      console.log('\nTask Data:')
      console.log(JSON.stringify(taskResponse.task, null, 2))
      console.log('\n' + '='.repeat(80))
    } else {
      // Clean output: just the task as JSON
      console.log(JSON.stringify(taskResponse, null, 2))
    }

    // Save to file if requested
    if (output) {
      fs.writeFileSync(output, JSON.stringify(taskResponse, null, 2))
      if (verbose) console.log(`✅ Task saved to: ${output}`)
    }

    if (verbose) console.log('✅ Task generation successful!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Task generation failed:')
    console.error(error)
    process.exit(1)
  }
}

// Run generation
void generateTask()
