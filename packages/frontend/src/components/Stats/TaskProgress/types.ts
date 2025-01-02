interface TaskLevel {
  /** Number of tasks needed to reach this level */
  threshold: number
  /** Tailwind color class for the progress bar */
  colorClass: string
}

export const TASK_LEVELS: TaskLevel[] = [
  { threshold: 20, colorClass: 'bg-blue-300' },
  { threshold: 50, colorClass: 'bg-blue-400' },
  { threshold: 100, colorClass: 'bg-blue-500' },
  { threshold: 200, colorClass: 'bg-blue-600' },
]

export interface TaskProgressProps {
  /** Number of tasks completed */
  value: number
} 