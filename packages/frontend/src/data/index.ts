// Types
export type { UserData, UserSettings, LastTask } from './core/types.ts'

// Core operations (for non-React usage)
export { initialize, getData, setData, updateSettings, updateProgress } from './core/userData.ts'

// Plugins (for non-React usage)
export * as exportPlugin from './plugins/export.ts'
export * as qr from './plugins/qr.ts'
