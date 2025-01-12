interface TaskLevel {
  /** Number of tasks needed to reach this level */
  threshold: number
  /** Tailwind color class for the progress bar */
  colorClass: string
}

export const TASK_LEVELS: TaskLevel[] = [
  { threshold: 5, colorClass: 'bg-blue-300' },      // Level 1: Very easy to achieve
  { threshold: 15, colorClass: 'bg-blue-400' },     // Level 2: Still easy
  { threshold: 30, colorClass: 'bg-blue-500' },     // Level 3
  { threshold: 50, colorClass: 'bg-blue-600' },     // Level 4
  { threshold: 75, colorClass: 'bg-indigo-300' },   // Level 5: First milestone
  { threshold: 100, colorClass: 'bg-indigo-400' },  // Level 6
  { threshold: 150, colorClass: 'bg-indigo-500' },  // Level 7
  { threshold: 200, colorClass: 'bg-indigo-600' },  // Level 8
  { threshold: 300, colorClass: 'bg-purple-300' },  // Level 9
  { threshold: 400, colorClass: 'bg-purple-400' },  // Level 10: Major milestone
  { threshold: 550, colorClass: 'bg-purple-500' },  // Level 11
  { threshold: 700, colorClass: 'bg-purple-600' },  // Level 12
  { threshold: 900, colorClass: 'bg-violet-300' },  // Level 13
  { threshold: 1100, colorClass: 'bg-violet-400' }, // Level 14
  { threshold: 1350, colorClass: 'bg-violet-500' }, // Level 15: Elite milestone
  { threshold: 1600, colorClass: 'bg-violet-600' }, // Level 16
  { threshold: 2000, colorClass: 'bg-fuchsia-300' },// Level 17
  { threshold: 2500, colorClass: 'bg-fuchsia-400' },// Level 18
  { threshold: 3000, colorClass: 'bg-fuchsia-500' },// Level 19
  { threshold: 4000, colorClass: 'bg-fuchsia-600' },// Level 20: Master level
]

export interface TaskProgressProps {
  /** Number of tasks completed */
  value: number
} 