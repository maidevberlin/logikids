import { GameStats } from '@/app/gamification/gameTypes'
import { ProgressData } from '@/app/progress'
import { Language, DEFAULT_LANGUAGE } from '@logikids/content/languages'

export interface UserSettings {
  name: string
  grade: number
  language: Language
  syncEnabled: boolean
}

// Legacy alias for backward compatibility
export type AccountSettings = UserSettings

export interface LastTask {
  subject: string
  concept?: string
}

export interface TaskCostRecord {
  subject: string
  concept: string
  inputTokens: number
  outputTokens: number
  totalTokens?: number
  cost?: number // Cost in USD
  timestamp: number
}

export interface UserData {
  userId: string
  settings: UserSettings
  progress: ProgressData
  gameStats?: GameStats // Optional for backward compatibility
  lastTask: LastTask
  costs?: TaskCostRecord[] // Optional for backward compatibility
  timestamp: number
  lastSyncTimestamp?: number
  encryptionKey?: string // JWK format, only included during export/import
}

export const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  grade: 5,
  language: DEFAULT_LANGUAGE,
  syncEnabled: false,
}

export const DEFAULT_LAST_TASK: LastTask = {
  subject: '',
  concept: '',
}

export function createDefaultUserData(userId: string): UserData {
  return {
    userId,
    settings: { ...DEFAULT_SETTINGS },
    progress: {},
    lastTask: { ...DEFAULT_LAST_TASK },
    costs: [],
    timestamp: Date.now(),
  }
}
