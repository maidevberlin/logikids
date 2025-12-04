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
${colors.cyan}🔧 Generate Prompt CLI${colors.reset}

Generate AI prompt without calling LLM (for testing/debugging).

${colors.cyan}Usage:${colors.reset}
  bun run generate:prompt <subject>/<concept>   Generate prompt for a concept

${colors.cyan}Options:${colors.reset}
  --taskType=<type>      Task type (default: singleChoice)
  --grade=<n>            Grade level (default: from concept)
  --difficulty=<level>   easy, medium, hard (default: medium)
  --language=<lang>      Language code (default: en)
  --output=<file>        Save prompt to file
  --verbose              Show debug info

${colors.cyan}Examples:${colors.reset}
  bun run generate:prompt math/grade5-fractions
  bun run generate:prompt math/grade1-basic-arithmetic-operations --difficulty=easy
  bun run generate:prompt math/grade5-fractions --taskType=multipleSelect --verbose
`)
}

async function testPrompt() {
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
    output,
    verbose,
  } = parsed

  suppressLogsUnlessVerbose(verbose)

  if (verbose) {
    console.log('🧪 Testing prompt generation...\n')
    printParameters(parsed)
  }

  try {
    const services = await initializeServices(subject, concept, taskType, gradeOverride, verbose)
    const {
      promptService,
      concept: selectedConcept,
      subject: subjectObj,
      taskType: taskTypeObj,
      grade,
    } = services

    // Build prompt using PromptService
    if (verbose) console.log('Building prompt...')
    const prompt = await promptService.buildPrompt({
      subject: subjectObj,
      taskType: taskTypeObj,
      concept: selectedConcept,
      grade,
      difficulty,
      language,
    })

    // Output result
    if (verbose) {
      console.log('\n' + '='.repeat(80))
      console.log('GENERATED PROMPT')
      console.log('='.repeat(80) + '\n')
      console.log(prompt)
      console.log('\n' + '='.repeat(80))
      console.log(`Prompt length: ${prompt.length} characters`)
      console.log('='.repeat(80) + '\n')
    } else {
      // Clean output: just the prompt
      console.log(prompt)
    }

    // Save to file if requested
    if (output) {
      fs.writeFileSync(output, prompt)
      if (verbose) console.log(`✅ Prompt saved to: ${output}`)
    }

    if (verbose) console.log('✅ Prompt generation successful!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Prompt generation failed:')
    console.error(error)
    process.exit(1)
  }
}

// Run test
void testPrompt()
