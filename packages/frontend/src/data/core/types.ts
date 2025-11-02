import { GameStats } from '@/app/stats/gameTypes'

export interface UserSettings {
  name: string
  age: number
  grade: number
  language: string
  gender: string
  syncEnabled: boolean
}

export interface LastTask {
  subject: string
  concept?: string
}

export interface UserData {
  userId: string
  settings: UserSettings
  progress: Record<string, any>
  gameStats?: GameStats  // Optional for backward compatibility
  lastTask: LastTask
  timestamp: number
  lastSyncTimestamp?: number
}

export const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  age: 10,
  grade: 5,
  language: 'en',
  gender: 'non-binary',
  syncEnabled: false
}

export const DEFAULT_LAST_TASK: LastTask = {
  subject: '',
  concept: ''
}

export function createDefaultUserData(userId: string): UserData {
  return {
    userId,
    settings: { ...DEFAULT_SETTINGS },
    progress: {},
    lastTask: { ...DEFAULT_LAST_TASK },
    timestamp: Date.now()
  }
}
