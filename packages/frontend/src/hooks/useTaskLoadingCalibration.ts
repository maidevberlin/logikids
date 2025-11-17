import { useCallback, useRef } from 'react'
import { createLogger } from '@/lib/logger'

/**
 * Storage key for task load time history in localStorage
 */
const STORAGE_KEY = 'taskLoadTimes'

/**
 * Maximum number of load time measurements to keep
 */
const MAX_HISTORY_SIZE = 10

/**
 * Default time constant for easing function (milliseconds)
 * This represents the expected load time for new users
 */
const DEFAULT_TIME_CONSTANT = 7000

/**
 * Minimum allowed time constant (milliseconds)
 * Prevents the progress bar from moving too fast
 */
const MIN_TIME_CONSTANT = 3000

/**
 * Maximum allowed time constant (milliseconds)
 * Prevents the progress bar from moving too slow
 */
const MAX_TIME_CONSTANT = 15000

/**
 * Load time measurement in milliseconds
 */
interface LoadTimeHistory {
  times: number[]
}

/**
 * Hook return value interface
 */
interface UseTaskLoadingCalibration {
  /**
   * Get the calibrated time constant for the easing function.
   * This value is based on the user's historical load times.
   *
   * @returns Calibrated time constant in milliseconds (default: 7000ms)
   */
  getTimeConstant: () => number

  /**
   * Record a completed task load time.
   * This updates the calibration history and should be called when
   * a task successfully loads.
   *
   * @param loadTimeMs - The actual load time in milliseconds
   */
  recordLoadTime: (loadTimeMs: number) => void

  /**
   * Get the average load time from historical data.
   *
   * @returns Average load time in milliseconds, or null if no history
   */
  getAverageLoadTime: () => number | null

  /**
   * Get the start timestamp for measuring load time.
   * This should be called when loading begins.
   *
   * @returns The current timestamp in milliseconds
   */
  startMeasurement: () => number

  /**
   * Complete a measurement and record the load time.
   * This is a convenience method that calculates the elapsed time
   * and records it automatically.
   *
   * @param startTime - The timestamp from startMeasurement()
   */
  completeMeasurement: (startTime: number) => void
}

/**
 * Safely read load time history from localStorage
 *
 * @returns Load time history or null if unavailable/invalid
 */
function readHistory(): LoadTimeHistory | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored)

    // Validate structure
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.times)) {
      return null
    }

    // Validate all times are numbers and positive
    if (!parsed.times.every((t: unknown) => typeof t === 'number' && t > 0)) {
      return null
    }

    return parsed as LoadTimeHistory
  } catch (error) {
    // localStorage may be disabled, full, or corrupted
    const logger = createLogger('useTaskLoadingCalibration')
    logger.warn('Failed to read task load time history', { error })
    return null
  }
}

/**
 * Safely write load time history to localStorage
 *
 * @param history - Load time history to store
 */
function writeHistory(history: LoadTimeHistory): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    // localStorage may be disabled or full - this is non-critical
    const logger = createLogger('useTaskLoadingCalibration')
    logger.warn('Failed to write task load time history', { error })
  }
}

/**
 * Calculate average from an array of numbers
 *
 * @param numbers - Array of numbers
 * @returns Average value or null if array is empty
 */
function calculateAverage(numbers: number[]): number | null {
  if (numbers.length === 0) return null
  const sum = numbers.reduce((acc, val) => acc + val, 0)
  return sum / numbers.length
}

/**
 * Custom hook for task loading calibration
 *
 * This hook provides a self-calibrating system that learns from actual task load times
 * and adjusts the progress bar animation to match the user's typical experience.
 *
 * Features:
 * - Tracks last 10 load times in localStorage
 * - Calculates rolling average to determine typical load time
 * - Adjusts easing function time constant based on average
 * - Provides safe fallback if localStorage is unavailable
 * - Handles edge cases (fast/slow/invalid measurements)
 *
 * Usage:
 * ```tsx
 * const { getTimeConstant, startMeasurement, completeMeasurement } = useTaskLoadingCalibration()
 *
 * // When loading starts
 * const startTime = startMeasurement()
 *
 * // Use calibrated time constant in progress calculation
 * const timeConstant = getTimeConstant()
 * const progress = 100 * (1 - Math.exp(-elapsed / timeConstant))
 *
 * // When loading completes successfully
 * completeMeasurement(startTime)
 * ```
 *
 * @returns Calibration API object
 */
export function useTaskLoadingCalibration(): UseTaskLoadingCalibration {
  // Use ref to avoid re-renders when recording times
  const measurementStartRef = useRef<number | null>(null)

  const getTimeConstant = useCallback((): number => {
    const history = readHistory()
    if (!history || history.times.length === 0) {
      return DEFAULT_TIME_CONSTANT
    }

    const average = calculateAverage(history.times)
    if (average === null) {
      return DEFAULT_TIME_CONSTANT
    }

    // The time constant should be proportional to the average load time
    // We use the average directly as the time constant, but clamp it
    // to reasonable bounds to prevent extreme behavior
    const calibratedConstant = Math.round(average)

    return Math.max(
      MIN_TIME_CONSTANT,
      Math.min(MAX_TIME_CONSTANT, calibratedConstant)
    )
  }, [])

  const recordLoadTime = useCallback((loadTimeMs: number): void => {
    // Validate input
    if (!Number.isFinite(loadTimeMs) || loadTimeMs <= 0) {
      const logger = createLogger('useTaskLoadingCalibration')
      logger.warn('Invalid load time measurement', { loadTimeMs })
      return
    }

    // Get existing history or create new one
    const history = readHistory() || { times: [] }

    // Add new measurement
    history.times.push(loadTimeMs)

    // Keep only the most recent measurements
    if (history.times.length > MAX_HISTORY_SIZE) {
      history.times = history.times.slice(-MAX_HISTORY_SIZE)
    }

    // Save updated history
    writeHistory(history)
  }, [])

  const getAverageLoadTime = useCallback((): number | null => {
    const history = readHistory()
    if (!history || history.times.length === 0) {
      return null
    }
    return calculateAverage(history.times)
  }, [])

  const startMeasurement = useCallback((): number => {
    const now = Date.now()
    measurementStartRef.current = now
    return now
  }, [])

  const completeMeasurement = useCallback((startTime: number): void => {
    const endTime = Date.now()
    const elapsed = endTime - startTime

    // Only record if we have a valid measurement
    if (elapsed > 0 && Number.isFinite(elapsed)) {
      recordLoadTime(elapsed)
    }
  }, [recordLoadTime])

  return {
    getTimeConstant,
    recordLoadTime,
    getAverageLoadTime,
    startMeasurement,
    completeMeasurement
  }
}
