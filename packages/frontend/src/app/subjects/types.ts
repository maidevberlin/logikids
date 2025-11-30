import { Concept } from '@/app/concepts'

export interface Subject {
  id: string
  name: string
  description: string
  conceptCount: number
  minGrade?: number
  maxGrade?: number
  concepts?: Concept[] // Optional - only present when grade filtering is active
  isDisabledForGrade?: boolean // Computed property for subjects without concepts for user's grade
}
