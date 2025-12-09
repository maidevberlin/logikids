import 'reflect-metadata'
import { container } from 'tsyringe'
import * as Sentry from '@sentry/bun'
import jwt from 'jsonwebtoken'
import { TTSService } from './service'
import { TTSCache } from './cache'
import { taskCache } from '../cache/taskCache'
import { createLogger } from '../common/logger'
import { TaskNotFoundError } from '../common/errors'
import { env } from '../config/env'

const logger = createLogger('TTSHandler')
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
 * Authenticate request and extract userId
 */
function authenticate(req: Request): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch (error) {
    return null
  }
}

/**
 * CORS headers for TTS responses
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

/**
 * Handle TTS requests - returns audio binary data
 */
export async function handleTTSRequest(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Authenticate
  const userId = authenticate(req)
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const { taskId, field } = body

    if (!taskId || !field) {
      return new Response(JSON.stringify({ error: 'Missing taskId or field' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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
      return new Response(JSON.stringify({ error: 'Text not found for field' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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

    logger.info('TTS audio sent', { taskId, field, audioSize: audio.length })

    // Return audio
    return new Response(audio, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audio.length.toString(),
      },
    })
  } catch (error) {
    // Capture error in Sentry
    Sentry.captureException(error)
    logger.error('Error processing TTS request', { error })

    if (error instanceof TaskNotFoundError) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
