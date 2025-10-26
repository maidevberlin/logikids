import { Gender } from '../../../api/logikids'

export interface Settings {
  /** User's age */
  age: number
  /** User's name */
  name: string
  /** User's preferred language */
  language: string
  /** User's gender (optional) */
  gender?: Gender
}

export const defaultSettings: Settings = {
  age: 12,
  name: '',
  language: 'en',
  gender: undefined
}

export interface SettingsProviderProps {
  /** Child components */
  children: React.ReactNode
} 