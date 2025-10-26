import { useContext } from 'react'
import { UserDataContext, UserDataContextValue } from './UserDataContext'

export function useUserData(): UserDataContextValue {
  const context = useContext(UserDataContext)
  if (!context) {
    throw new Error('useUserData must be used within UserDataProvider')
  }
  return context
}
