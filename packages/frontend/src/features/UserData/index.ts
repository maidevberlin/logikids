// Context
export { UserDataProvider } from './context/UserDataContext'
export { useUserData } from './context/useUserData'
export type { UserDataContextValue } from './context/UserDataContext'

// Types
export type { UserData, UserSettings, LastTask } from './core/types'

// Core operations (for non-React usage)
export { initialize, getData, setData, updateSettings, updateProgress } from './core/userData'

// Plugins (for non-React usage)
export * as sync from './plugins/sync'
export * as exportPlugin from './plugins/export'
export * as qr from './plugins/qr'
