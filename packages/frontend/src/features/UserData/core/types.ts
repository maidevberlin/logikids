export interface UserSettings {
  name: string
  age: number
  language: string
  gender: string
}

export interface LastTask {
  subject: string
  concept: string
}

export interface UserData {
  userId: string
  settings: UserSettings
  progress: Record<string, any>
  lastTask: LastTask
  timestamp: number
}

export const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  age: 10,
  language: 'en',
  gender: 'neutral'
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
