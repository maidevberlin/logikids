import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  registerUser as coreRegisterUser,
  loginWithAccount as coreLoginWithAccount,
} from '@/data/core/userData.ts'
import { getUserId } from '@/data/core/storage.ts'
import { createLogger } from '@/lib/logger'

const logger = createLogger('AuthContext')

export interface AuthContextValue {
  isAuthenticated: boolean
  currentUserId: string | null
  authLoading: boolean
  register: (inviteCode: string) => Promise<void>
  login: (userId: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Derived state
  const isAuthenticated = currentUserId !== null

  // Initialize authentication state on mount
  useEffect(() => {
    void initializeAuth()
  }, [])

  // Listen for authentication changes
  useEffect(() => {
    const handleAuthChange = () => {
      logger.debug('Auth change detected, reinitializing')
      void initializeAuth()
    }

    window.addEventListener('data-changed', handleAuthChange)
    return () => window.removeEventListener('data-changed', handleAuthChange)
  }, [])

  async function initializeAuth() {
    try {
      setAuthLoading(true)
      const userId = await getUserId()
      setCurrentUserId(userId)
      logger.debug('Auth initialized', { userId: userId ? 'present' : 'absent' })
    } catch (error) {
      logger.error('Failed to initialize auth', error as Error)
      setCurrentUserId(null)
    } finally {
      setAuthLoading(false)
    }
  }

  async function register(inviteCode: string): Promise<void> {
    try {
      logger.debug('Registering new user')
      const userData = await coreRegisterUser(inviteCode)
      setCurrentUserId(userData.userId)
      logger.info('User registered successfully', { userId: userData.userId })

      // Trigger data-changed event for other listeners
      window.dispatchEvent(new Event('data-changed'))
    } catch (error) {
      logger.error('Registration failed', error as Error)
      throw error
    }
  }

  async function login(userId: string): Promise<void> {
    try {
      logger.debug('Logging in user', { userId })
      await coreLoginWithAccount(userId)
      setCurrentUserId(userId)
      logger.info('User logged in successfully', { userId })

      // Trigger data-changed event for other listeners
      window.dispatchEvent(new Event('data-changed'))
    } catch (error) {
      logger.error('Login failed', error as Error)
      throw error
    }
  }

  async function logout(): Promise<void> {
    try {
      logger.debug('Logging out user')

      // Clear all storage
      localStorage.clear()

      // Clear IndexedDB by deleting the database
      const DB_NAME = 'logikids_secure_storage'
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
        request.onblocked = () => resolve() // Resolve anyway if blocked
      })

      setCurrentUserId(null)
      logger.info('User logged out successfully')

      // Trigger data-changed event for other listeners
      window.dispatchEvent(new Event('data-changed'))
    } catch (error) {
      logger.error('Logout failed', error as Error)
      throw error
    }
  }

  const value: AuthContextValue = {
    isAuthenticated,
    currentUserId,
    authLoading,
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
