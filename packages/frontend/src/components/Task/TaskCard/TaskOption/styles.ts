import { TaskOptionVariant } from './types'

export const variants: Record<TaskOptionVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
  success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700',
  error: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
}

export const option = {
  base: 'flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-medium transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-lg',
  content: 'text-inherit',
  icon: 'w-7 h-7',
} as const 