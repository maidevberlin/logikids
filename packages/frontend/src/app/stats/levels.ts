export interface TaskLevel {
  threshold: number
  colorClass: string
}

export const TASK_LEVELS: TaskLevel[] = [
  { threshold: 5, colorClass: 'bg-blue-300' },
  { threshold: 15, colorClass: 'bg-blue-400' },
  { threshold: 30, colorClass: 'bg-blue-500' },
  { threshold: 50, colorClass: 'bg-blue-600' },
  { threshold: 75, colorClass: 'bg-indigo-300' },
  { threshold: 100, colorClass: 'bg-indigo-400' },
  { threshold: 150, colorClass: 'bg-indigo-500' },
  { threshold: 200, colorClass: 'bg-indigo-600' },
  { threshold: 300, colorClass: 'bg-purple-300' },
  { threshold: 400, colorClass: 'bg-purple-400' },
  { threshold: 550, colorClass: 'bg-purple-500' },
  { threshold: 700, colorClass: 'bg-purple-600' },
  { threshold: 900, colorClass: 'bg-violet-300' },
  { threshold: 1100, colorClass: 'bg-violet-400' },
  { threshold: 1350, colorClass: 'bg-violet-500' },
  { threshold: 1600, colorClass: 'bg-violet-600' },
  { threshold: 2000, colorClass: 'bg-fuchsia-300' },
  { threshold: 2500, colorClass: 'bg-fuchsia-400' },
  { threshold: 3000, colorClass: 'bg-fuchsia-500' },
  { threshold: 4000, colorClass: 'bg-fuchsia-600' },
]
