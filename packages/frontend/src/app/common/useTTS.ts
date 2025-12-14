import { useState, useCallback, useRef, useEffect } from 'react'
import { trpc } from '@/app/common/trpc'
import { createLogger } from '@/app/common/logger'

const logger = createLogger('TTS')

// In-memory cache for audio blobs
// Key format: `${taskId}:${field}`
const audioCache = new Map<string, Blob>()

// Shared audio element for playback
let sharedAudio: HTMLAudioElement | null = null

// Track currently playing field
let currentlyPlaying: string | null = null

// Event name for notifying hooks when playback changes
const TTS_PLAYBACK_CHANGED = 'tts-playback-changed'

type TTSState = 'idle' | 'loading' | 'playing'

export interface TTSUsage {
  characterCount: number
  cost: number
  cached: boolean
}

interface UseTTSOptions {
  taskId: string
  field: string
  onCostReceived?: (usage: TTSUsage) => void
}

interface UseTTSResult {
  state: TTSState
  play: () => Promise<void>
  stop: () => void
}

/**
 * Hook for Text-to-Speech functionality
 *
 * Provides audio playback for task fields with in-memory caching.
 * Uses a single shared Audio element for all playback.
 *
 * @param options - taskId and field to play
 * @returns state, play, and stop functions
 */
export function useTTS({ taskId, field, onCostReceived }: UseTTSOptions): UseTTSResult {
  const [state, setState] = useState<TTSState>('idle')
  const cacheKey = `${taskId}:${field}`
  const isMountedRef = useRef(true)
  const onCostReceivedRef = useRef(onCostReceived)
  const ttsMutation = trpc.tts.synthesize.useMutation()

  // Keep callback ref up to date
  useEffect(() => {
    onCostReceivedRef.current = onCostReceived
  }, [onCostReceived])

  // Track mounted state - only on true mount/unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Stop playback when cacheKey changes
  useEffect(() => {
    return () => {
      if (currentlyPlaying === cacheKey && sharedAudio) {
        sharedAudio.pause()
        sharedAudio.currentTime = 0
        currentlyPlaying = null
      }
    }
  }, [cacheKey])

  // Listen for playback changes from other hooks
  useEffect(() => {
    const handlePlaybackChanged = () => {
      // If another hook took over playback, reset our state to idle
      if (currentlyPlaying !== cacheKey) {
        setState('idle')
      }
    }

    window.addEventListener(TTS_PLAYBACK_CHANGED, handlePlaybackChanged)
    return () => window.removeEventListener(TTS_PLAYBACK_CHANGED, handlePlaybackChanged)
  }, [cacheKey])

  const fetchAudio = useCallback(async (): Promise<Blob> => {
    // Check cache first
    const cached = audioCache.get(cacheKey)
    if (cached) {
      logger.debug(`Cache hit for ${cacheKey}`)
      return cached
    }

    // Fetch from API using tRPC
    logger.debug(`Fetching audio for ${cacheKey}`)

    const data = await ttsMutation.mutateAsync({ taskId, field })

    // Call cost callback if provided and usage info is available
    if (data.usage && onCostReceivedRef.current) {
      onCostReceivedRef.current(data.usage)
    }

    const binaryString = atob(data.audio)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const blob = new Blob([bytes], { type: 'audio/mpeg' })

    // Cache the blob
    audioCache.set(cacheKey, blob)
    logger.debug(`Cached audio for ${cacheKey}`)

    return blob
  }, [taskId, field, cacheKey, ttsMutation])

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
      window.dispatchEvent(new Event(TTS_PLAYBACK_CHANGED))

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
