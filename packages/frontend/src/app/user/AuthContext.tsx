import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getUserId, storeKey, storeUserId, storeTokens, generateKey, encrypt } from './storage'
import { createLogger } from '@/app/common/logger'
import { createDefaultUserData } from '@/app/user/types.ts'
import { trpc } from '@/app/common/trpc'
import { AccountNotFoundModal } from './AccountNotFoundModal'

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
  const [accountNotFound, setAccountNotFound] = useState(false)

  // tRPC mutations
  const registerMutation = trpc.auth.register.useMutation()
  const loginMutation = trpc.auth.login.useMutation()

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

      if (!userId) {
        setCurrentUserId(null)
        logger.debug('Auth initialized', { userId: 'absent' })
        return
      }

      // Verify user still exists by logging in
      try {
        const { accessToken } = await loginMutation.mutateAsync({ userId })
        await storeTokens(accessToken)
        setCurrentUserId(userId)
        logger.debug('Auth initialized', { userId: 'present' })
      } catch (error) {
        // Check if account was not found (404)
        const is404 =
          error instanceof Error &&
          (error.message.includes('NOT_FOUND') || error.message.includes('404'))

        if (is404) {
          logger.warn('Account not found during auth init')
          setAccountNotFound(true)
          setCurrentUserId(null)
        } else {
          // Other errors - just clear auth state
          logger.error('Failed to verify user', error as Error)
          setCurrentUserId(null)
        }
      }
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

      // Generate key and userId locally
      const key = await generateKey()
      const userId = crypto.randomUUID()

      // Call backend via tRPC mutation
      const { accessToken } = await registerMutation.mutateAsync({
        userId,
        inviteCode,
      })

      // Store key, userId, and tokens in IndexedDB
      await storeKey(key)
      await storeUserId(userId)
      await storeTokens(accessToken)

      // Create default data and encrypt to localStorage
      const defaultData = createDefaultUserData(userId)
      const encrypted = await encrypt(key, defaultData)
      localStorage.setItem('logikids_data', encrypted)

      setCurrentUserId(userId)
      logger.info('User registered successfully', { userId })

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

      // Call backend via tRPC mutation
      const { accessToken } = await loginMutation.mutateAsync({ userId })

      // Store tokens in IndexedDB
      await storeTokens(accessToken)

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

  return (
    <AuthContext.Provider value={value}>
      {children}
      {accountNotFound && <AccountNotFoundModal />}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
