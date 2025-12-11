import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { TTSService } from './service'
import { TTSCache } from './cache'
import { TaskCache } from '../cache/taskCache'
import { notFound } from '../common/errors'
import { markdownToSpeech } from './markdown-to-speech'
import type { SynthesizeInput } from './schemas'

@injectable()
export class TTSController {
  constructor(
    @inject(TTSService) private readonly ttsService: TTSService,
    @inject(TTSCache) private readonly ttsCache: TTSCache,
    @inject(TaskCache) private readonly taskCache: TaskCache
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

    // Get task from cache
    const context = this.taskCache.get(taskId)
    if (!context) {
      throw notFound('Task not found or expired')
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
      throw notFound('Text not found for field')
    }

    // Get language from task context
    const language = context.language

    // Convert markdown to speech-friendly text (with language for proper LaTeX conversion)
    const speechText = await markdownToSpeech(text, language)

    if (!speechText.trim()) {
      throw notFound('No speakable text found for field')
    }

    // Check cache first (use converted text for cache key)
    let audio = await this.ttsCache.get(speechText, language)

    // If not cached, synthesize
    if (!audio) {
      audio = await this.ttsService.synthesize(speechText, language)

      // Store in cache
      await this.ttsCache.set(speechText, language, audio)
    }

    // Return audio as base64
    return { audio: audio.toString('base64') }
  }
}
