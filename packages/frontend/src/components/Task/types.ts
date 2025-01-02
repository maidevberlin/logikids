import type { Task as BackendTask, Difficulty, Subject } from '@logikids/backend/tasks/types'

export type Age = number
export type { Difficulty, Subject }

// Base Task type
export interface Task extends BackendTask {
  title: string
  task: string // HTML content
  hints: string[]
  options: string[]
  solution: {
    index: number
    explanation: string
  }
}

// Default values
export const TASK_DEFAULTS = {
  difficulty: 'medium' as Difficulty,
  subject: 'math' as Subject,
  age: 10 as Age,
} as const

// API types
export interface TaskResponse {
  task: Task
  nextTaskId: string | null
}

export interface TaskListResponse {
  items: Task[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  filters: {
    difficulty: Difficulty[]
    subject: Subject[]
    ageRange: [number, number]
  }
} 