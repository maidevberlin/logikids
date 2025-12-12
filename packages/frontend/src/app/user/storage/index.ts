// Storage Layer - Encryption, IndexedDB, and localStorage operations
export {
  getData,
  setData,
  initialize,
  updateSettings,
  updateProgress,
  updateGameStats,
  updateProgressAndGameStats,
} from './localStorage'
export {
  getUserId,
  storeUserId,
  loadKey,
  storeKey,
  getAccessToken,
  storeTokens,
  clearStorage,
} from './storage'
export { encrypt, decrypt, exportKey, importKey, generateKey } from './encryption'
export { mergeUserData } from './mergeData'
