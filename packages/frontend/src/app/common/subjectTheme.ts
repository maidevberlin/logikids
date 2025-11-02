import {
  Calculator,
  Brain,
  Atom,
  Languages,
  Music,
  BookOpen,
  type LucideIcon
} from 'lucide-react'

export interface SubjectTheme {
  icon: LucideIcon
  colors: {
    bg: string
    hover: string
    text: string
  }
}

export const subjectThemes: Record<string, SubjectTheme> = {
  math: {
    icon: Calculator,
    colors: {
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      text: 'text-blue-500'
    }
  },
  logic: {
    icon: Brain,
    colors: {
      bg: 'bg-purple-500',
      hover: 'hover:bg-purple-600',
      text: 'text-purple-500'
    }
  },
  physics: {
    icon: Atom,
    colors: {
      bg: 'bg-emerald-500',
      hover: 'hover:bg-emerald-600',
      text: 'text-emerald-500'
    }
  },
  german: {
    icon: Languages,
    colors: {
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      text: 'text-red-500'
    }
  },
  english: {
    icon: BookOpen,
    colors: {
      bg: 'bg-amber-500',
      hover: 'hover:bg-amber-600',
      text: 'text-amber-500'
    }
  },
  music: {
    icon: Music,
    colors: {
      bg: 'bg-pink-500',
      hover: 'hover:bg-pink-600',
      text: 'text-pink-500'
    }
  }
}

// Default theme for unknown subjects
export const defaultTheme: SubjectTheme = {
  icon: BookOpen,
  colors: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    text: 'text-gray-500'
  }
}

/**
 * Get theme for a subject, with fallback to default
 */
export function getSubjectTheme(subjectId: string): SubjectTheme {
  return subjectThemes[subjectId] || defaultTheme
}
