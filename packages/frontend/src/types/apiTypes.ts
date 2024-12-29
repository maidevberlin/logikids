import type { Task, Difficulty, Subject } from './taskTypes'

// Generic API response type
export interface ApiResponse<T> {
  data: T
  error: ApiError | null
}

// Error types
export interface ApiError {
  code: ApiErrorCode
  message: string
  details?: Record<string, unknown>
}

export enum ApiErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST'
}

// Common response types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Common request types
export interface PaginationParams {
  page: number
  pageSize: number
}

// API specific types
export interface TaskResponse {
  task: Task
  nextTaskId: string | null
}

export interface TaskError extends ApiError {
  details?: {
    taskId?: string
    validationErrors?: Record<string, string[]>
  }
}

export interface TaskListResponse extends PaginatedResponse<Task> {
  filters: {
    difficulty: Difficulty[]
    subject: Subject[]
    ageRange: [number, number]
  }
}

// Type guards
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as ApiError).code === 'string' &&
    typeof (error as ApiError).message === 'string'
  )
}

export function isTaskError(error: unknown): error is TaskError {
  return (
    isApiError(error) &&
    (!('details' in error) ||
      (typeof error.details === 'object' &&
        error.details !== null &&
        (!('taskId' in error.details) || typeof error.details.taskId === 'string') &&
        (!('validationErrors' in error.details) ||
          typeof error.details.validationErrors === 'object')))
  )
} 