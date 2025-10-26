import { Gender } from '../../../api/logikids'

export interface Settings {
  /** User's grade (1-13) */
  grade: number
  /** User's name */
  name: string
  /** User's preferred language */
  language: string
  /** User's gender (optional) */
  gender?: Gender
}

export const defaultSettings: Settings = {
  grade: 6,
  name: '',
  language: 'en',
  gender: undefined
}

export interface SettingsProviderProps {
  /** Child components */
  children: React.ReactNode
} 