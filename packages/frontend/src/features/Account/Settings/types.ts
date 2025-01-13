export interface Settings {
  /** User's age */
  age: number
  /** User's name */
  name: string
  /** User's preferred language */
  language: string
}

export const defaultSettings: Settings = {
  age: 12,
  name: '',
  language: 'en'
}

export interface SettingsProviderProps {
  /** Child components */
  children: React.ReactNode
} 