import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { TTSService } from './service'
import { TTSCache } from './cache'
import { taskCache } from '../cache/taskCache'
import { createLogger } from '../common/logger'
import { TaskNotFoundError } from '../common/errors'
import type { SynthesizeInput } from './schemas'

const logger = createLogger('TTSController')

@injectable()
export class TTSController {
  constructor(
    private readonly ttsService: TTSService,
    private readonly ttsCache: TTSCache
  ) {}

  /**
   * Extract text from task response based on field specifier
   */
  private getTextFromTask(task: any, field: string): string | null {
    if (field === 'task') return task.task
    if (field === 'explanation') return task.explanation

    const [arrayName, indexStr] = field.split(':')
    const index = parseInt(indexStr)
    const array = task[arrayName]
    if (!Array.isArray(array)) return null

    const item = array[index]
    return item?.text ?? item?.content ?? null
  }

  /**
   * Synthesize text to speech for a task field
   * @returns Base64-encoded audio string
   */
  async synthesize(input: SynthesizeInput, _userId: string): Promise<{ audio: string }> {
    const { taskId, field } = input

    logger.debug('TTS request', { taskId, field })

    // Get task from cache
    const context = taskCache.get(taskId)
    if (!context) {
      throw new TaskNotFoundError()
    }

    // Extract text from task
    let text: string | null = null

    // Handle hints separately (they're in the context, not the task response)
    if (field.startsWith('hint:')) {
      const hintIndex = parseInt(field.split(':')[1])
      if (hintIndex >= 0 && hintIndex < context.hintsGenerated.length) {
        text = context.hintsGenerated[hintIndex]
      }
    } else {
      text = this.getTextFromTask(context.taskResponse, field)
    }

    if (!text) {
      throw new TaskNotFoundError('Text not found for field')
    }

    logger.debug('Text extracted', { field, textLength: text.length })

    // Get language from task context
    const language = context.language

    // Check cache first
    let audio = await this.ttsCache.get(text, language)

    // If not cached, synthesize
    if (!audio) {
      logger.debug('Cache miss, synthesizing audio')
      audio = await this.ttsService.synthesize(text, language)

      // Store in cache
      await this.ttsCache.set(text, language, audio)
    }

    logger.info('TTS audio generated', { taskId, field, audioSize: audio.length })

    // Return audio as base64
    return { audio: audio.toString('base64') }
  }
}
