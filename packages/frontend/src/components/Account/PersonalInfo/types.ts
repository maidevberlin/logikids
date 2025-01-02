import { Age } from '../../Task/types'

export interface PersonalInfoProps {
  /** User's name */
  name: string
  /** User's age */
  age: number
  /** Callback when name changes */
  onNameChange: (name: string) => void
  /** Callback when age changes */
  onAgeChange: (age: Age) => void
} 