import { useState, useCallback, useRef, useEffect } from 'react'
import { getAccessToken } from '@/data/core/storage'
import { createLogger } from '@/lib/logger'

const logger = createLogger('TTS')

// In-memory cache for audio blobs
// Key format: `${taskId}:${field}`
const audioCache = new Map<string, Blob>()

// Shared audio element for playback
let sharedAudio: HTMLAudioElement | null = null

// Track currently playing field
let currentlyPlaying: string | null = null

type TTSState = 'idle' | 'loading' | 'playing'

interface UseTTSOptions {
  taskId: string
  field: string
}

interface UseTTSResult {
  state: TTSState
  play: () => Promise<void>
  stop: () => void
}

// Get API URL (same pattern as trpc.ts)
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production' ? window.location.origin : 'http://localhost:5175')

/**
 * Hook for Text-to-Speech functionality
 *
 * Provides audio playback for task fields with in-memory caching.
 * Uses a single shared Audio element for all playback.
 *
 * @param options - taskId and field to play
 * @returns state, play, and stop functions
 */
export function useTTS({ taskId, field }: UseTTSOptions): UseTTSResult {
  const [state, setState] = useState<TTSState>('idle')
  const cacheKey = `${taskId}:${field}`
  const isMountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      // If this instance is currently playing, stop it
      if (currentlyPlaying === cacheKey) {
        stop()
      }
    }
  }, [cacheKey])

  const fetchAudio = useCallback(async (): Promise<Blob> => {
    // Check cache first
    const cached = audioCache.get(cacheKey)
    if (cached) {
      logger.debug(`Cache hit for ${cacheKey}`)
      return cached
    }

    // Fetch from API
    logger.debug(`Fetching audio for ${cacheKey}`)
    const token = await getAccessToken()

    const response = await fetch(`${API_URL}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ taskId, field }),
    })

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()

    // Cache the blob
    audioCache.set(cacheKey, blob)
    logger.debug(`Cached audio for ${cacheKey}`)

    return blob
  }, [taskId, field, cacheKey])

  const play = useCallback(async () => {
    try {
      // Stop any currently playing audio
      if (currentlyPlaying && currentlyPlaying !== cacheKey) {
        if (sharedAudio) {
          sharedAudio.pause()
          sharedAudio.currentTime = 0
        }
      }

      setState('loading')
      currentlyPlaying = cacheKey

      // Get audio blob (from cache or fetch)
      const blob = await fetchAudio()

      if (!isMountedRef.current) return

      // Create audio element if needed
      if (!sharedAudio) {
        sharedAudio = new Audio()
      }

      // Create object URL and set as source
      const url = URL.createObjectURL(blob)
      sharedAudio.src = url

      // Set up event handlers
      const handleEnded = () => {
        if (!isMountedRef.current) return
        setState('idle')
        if (currentlyPlaying === cacheKey) {
          currentlyPlaying = null
        }
        URL.revokeObjectURL(url)
      }

      const handleError = () => {
        logger.error('Audio playback error', new Error('Audio playback failed'))
        if (!isMountedRef.current) return
        setState('idle')
        if (currentlyPlaying === cacheKey) {
          currentlyPlaying = null
        }
        URL.revokeObjectURL(url)
      }

      sharedAudio.onended = handleEnded
      sharedAudio.onerror = handleError as OnErrorEventHandler

      // Play audio
      await sharedAudio.play()

      if (!isMountedRef.current) return
      setState('playing')
    } catch (error) {
      logger.error('TTS play error', error as Error)
      if (!isMountedRef.current) return
      setState('idle')
      if (currentlyPlaying === cacheKey) {
        currentlyPlaying = null
      }
    }
  }, [cacheKey, fetchAudio])

  const stop = useCallback(() => {
    if (sharedAudio && currentlyPlaying === cacheKey) {
      sharedAudio.pause()
      sharedAudio.currentTime = 0
      setState('idle')
      currentlyPlaying = null
    }
  }, [cacheKey])

  return {
    state,
    play,
    stop,
  }
}
