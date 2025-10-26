import { useState, useEffect, useCallback } from 'react'
import { cryptoService } from '../services/crypto.service'
import { storageService } from '../services/storage.service'
import { syncService } from '../services/sync.service'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  userId: string | null
  error: string | null
}

export interface UserData {
  version: number
  settings: {
    name: string
    age: number
    language: string
  }
  progress: Record<string, any>
  timestamp: number
}

/**
 * Hook for managing authentication and encrypted data sync
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    error: null,
  })

  /**
   * Initialize - check if user is already authenticated
   */
  useEffect(() => {
    async function init() {
      try {
        const isAuth = await storageService.isAuthenticated()
        const userId = await storageService.getUserId()

        setState({
          isAuthenticated: isAuth,
          isLoading: false,
          userId,
          error: null,
        })

        // Setup auto-sync if authenticated
        if (isAuth) {
          syncService.setupAutoSync(() => getUserData())
        }
      } catch (error) {
        setState({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
          error: error instanceof Error ? error.message : 'Init failed',
        })
      }
    }

    init()
  }, [])

  /**
   * Create new account
   */
  const createAccount = useCallback(async (name: string, age: number, language: string = 'en'): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Generate encryption key and user ID
      const key = await cryptoService.generateKey()
      const userId = crypto.randomUUID()

      // Create initial user data
      const userData: UserData = {
        version: 1,
        settings: { name, age, language },
        progress: {},
        timestamp: Date.now(),
      }

      // Store credentials
      await storageService.storeKey(key)
      await storageService.storeUserId(userId)

      // Store data locally
      localStorage.setItem('logikids_data', JSON.stringify(userData))

      // Upload encrypted data to server
      await syncService.upload(userId, key, userData)

      setState({
        isAuthenticated: true,
        isLoading: false,
        userId,
        error: null,
      })

      // Setup auto-sync
      syncService.setupAutoSync(() => getUserData())

      console.log('[useAuth] Account created:', userId)
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Account creation failed',
      }))
      throw error
    }
  }, [])

  /**
   * Logout (clears local data, keeps server data)
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await storageService.clearAll()
      localStorage.removeItem('logikids_data')

      setState({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        error: null,
      })

      console.log('[useAuth] Logged out')
    } catch (error) {
      console.error('[useAuth] Logout failed:', error)
      throw error
    }
  }, [])

  /**
   * Delete account (clears local and server data permanently)
   */
  const deleteAccount = useCallback(async (): Promise<void> => {
    try {
      const userId = await storageService.getUserId()
      if (userId) {
        // Delete from server
        await syncService.deleteAccount(userId)
      }

      // Clear local data
      await storageService.clearAll()
      localStorage.removeItem('logikids_data')

      setState({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        error: null,
      })

      console.log('[useAuth] Account deleted')
    } catch (error) {
      console.error('[useAuth] Delete account failed:', error)
      throw error
    }
  }, [])

  /**
   * Sync data with server
   */
  const sync = useCallback(async (): Promise<void> => {
    try {
      const userId = await storageService.getUserId()
      const key = await storageService.getKey()

      if (!userId || !key) {
        throw new Error('Not authenticated')
      }

      const localData = getUserData()
      const syncedData = await syncService.sync(userId, key, localData)

      // Update local storage if server data was newer
      if (syncedData !== localData) {
        localStorage.setItem('logikids_data', JSON.stringify(syncedData))
        window.dispatchEvent(new CustomEvent('data-synced', { detail: syncedData }))
      }

      console.log('[useAuth] Sync completed')
    } catch (error) {
      console.error('[useAuth] Sync failed:', error)
      throw error
    }
  }, [])

  /**
   * Get current user data from localStorage
   */
  const getUserData = (): UserData => {
    const stored = localStorage.getItem('logikids_data')
    if (!stored) {
      return {
        version: 1,
        settings: { name: '', age: 12, language: 'en' },
        progress: {},
        timestamp: Date.now(),
      }
    }
    return JSON.parse(stored)
  }

  /**
   * Update user data and sync to server
   */
  const updateUserData = useCallback(async (updates: Partial<UserData>): Promise<void> => {
    try {
      const userId = await storageService.getUserId()
      const key = await storageService.getKey()

      if (!userId || !key) {
        throw new Error('Not authenticated')
      }

      const current = getUserData()
      const updated: UserData = {
        ...current,
        ...updates,
        timestamp: Date.now(),
      }

      // Store locally
      localStorage.setItem('logikids_data', JSON.stringify(updated))

      // Sync to server
      await syncService.upload(userId, key, updated)

      console.log('[useAuth] User data updated and synced')
    } catch (error) {
      console.error('[useAuth] Update user data failed:', error)
      throw error
    }
  }, [])

  return {
    ...state,
    createAccount,
    logout,
    deleteAccount,
    sync,
    getUserData,
    updateUserData,
  }
}
