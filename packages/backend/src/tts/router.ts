import 'reflect-metadata'
import { Router, Request, Response } from 'express'
import { container } from 'tsyringe'
import { TTSService } from './service'
import { TTSCache } from './cache'
import { taskCache } from '../cache/taskCache'
import { createLogger } from '../common/logger'
import { TaskNotFoundError } from '../common/errors'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

const logger = createLogger('TTSRouter')

const JWT_SECRET = env.JWT_SECRET

/**
 * Extract text from task response based on field specifier
 */
function getTextFromTask(task: any, field: string): string | null {
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
 * Middleware to authenticate requests
 */
async function authenticate(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    ;(req as any).userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

/**
 * TTS router - provides text-to-speech audio for task fields
 */
export const ttsRouter = Router()

ttsRouter.post('/tts', authenticate, async (req: Request, res: Response) => {
  try {
    const { taskId, field } = req.body

    if (!taskId || !field) {
      res.status(400).json({ error: 'Missing taskId or field' })
      return
    }

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
      text = getTextFromTask(context.taskResponse, field)
    }

    if (!text) {
      res.status(404).json({ error: 'Text not found for field' })
      return
    }

    logger.debug('Text extracted', { field, textLength: text.length })

    // Get language from task context
    const language = context.language

    // Check cache first
    const ttsCache = container.resolve(TTSCache)
    let audio = await ttsCache.get(text, language)

    // If not cached, synthesize
    if (!audio) {
      logger.debug('Cache miss, synthesizing audio')
      const ttsService = container.resolve(TTSService)
      audio = await ttsService.synthesize(text, language)

      // Store in cache
      await ttsCache.set(text, language, audio)
    }

    // Return audio
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', audio.length.toString())
    res.send(audio)

    logger.info('TTS audio sent', { taskId, field, audioSize: audio.length })
  } catch (error) {
    logger.error('Error processing TTS request', { error })

    if (error instanceof TaskNotFoundError) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.status(500).json({ error: 'Internal server error' })
  }
})
