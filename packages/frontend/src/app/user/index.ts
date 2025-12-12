// Main user domain exports
export { AccountPage } from './AccountPage'
export { ProfileSettings } from './ProfileSettings'
export { DataManagement } from './DataManagement'
export { useUserData } from './useUserData'
export { useAuth } from './AuthContext'

// Types
export type { AccountSettings, UserData, UserSettings, LastTask, TaskCostRecord } from './types'

// Re-export from sync subdomain
export { useDataSync } from './sync'
export type { SyncStatus, DataSyncContextValue } from './sync'

// Storage (for cross-domain access)
export { setData, getData, getAccessToken, storeTokens, getUserId } from './storage'
