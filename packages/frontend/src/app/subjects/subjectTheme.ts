import { Calculator, Brain, Atom, Languages, Music, BookOpen, type LucideIcon } from 'lucide-react'

/**
 * Subject Theme Configuration - SINGLE SOURCE OF TRUTH
 *
 * To add a new subject, just add an entry here!
 */

export interface SubjectTheme {
  icon: LucideIcon
  colors: {
    bg: string
    hover: string
    text: string
    bgLight: string
    hoverLight: string
    badge: string
    active: string
    /** Tailwind bg class for glass card tinting (with opacity) */
    glass: string
    /** Tailwind border class for glass card border */
    glassBorder: string
  }
}

export const subjectThemes: Record<string, SubjectTheme> = {
  math: {
    icon: Calculator,
    colors: {
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      text: 'text-blue-500',
      bgLight: 'bg-blue-50',
      hoverLight: 'hover:bg-blue-100',
      badge: 'bg-blue-100 text-blue-800',
      active: 'bg-blue-100 text-blue-800',
      glass: 'bg-blue-500/60',
      glassBorder: 'border-blue-300',
    },
  },
  logic: {
    icon: Brain,
    colors: {
      bg: 'bg-purple-500',
      hover: 'hover:bg-purple-600',
      text: 'text-purple-500',
      bgLight: 'bg-purple-50',
      hoverLight: 'hover:bg-purple-100',
      badge: 'bg-purple-100 text-purple-800',
      active: 'bg-purple-100 text-purple-800',
      glass: 'bg-purple-500/60',
      glassBorder: 'border-purple-300',
    },
  },
  physics: {
    icon: Atom,
    colors: {
      bg: 'bg-emerald-500',
      hover: 'hover:bg-emerald-600',
      text: 'text-emerald-500',
      bgLight: 'bg-emerald-50',
      hoverLight: 'hover:bg-emerald-100',
      badge: 'bg-emerald-100 text-emerald-800',
      active: 'bg-emerald-100 text-emerald-800',
      glass: 'bg-emerald-500/60',
      glassBorder: 'border-emerald-300',
    },
  },
  german: {
    icon: Languages,
    colors: {
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      text: 'text-red-500',
      bgLight: 'bg-red-50',
      hoverLight: 'hover:bg-red-100',
      badge: 'bg-red-100 text-red-800',
      active: 'bg-red-100 text-red-800',
      glass: 'bg-red-500/60',
      glassBorder: 'border-red-300',
    },
  },
  english: {
    icon: BookOpen,
    colors: {
      bg: 'bg-amber-500',
      hover: 'hover:bg-amber-600',
      text: 'text-amber-500',
      bgLight: 'bg-amber-50',
      hoverLight: 'hover:bg-amber-100',
      badge: 'bg-amber-100 text-amber-800',
      active: 'bg-amber-100 text-amber-800',
      glass: 'bg-amber-500/60',
      glassBorder: 'border-amber-300',
    },
  },
  music: {
    icon: Music,
    colors: {
      bg: 'bg-pink-500',
      hover: 'hover:bg-pink-600',
      text: 'text-pink-500',
      bgLight: 'bg-pink-50',
      hoverLight: 'hover:bg-pink-100',
      badge: 'bg-pink-100 text-pink-800',
      active: 'bg-pink-100 text-pink-800',
      glass: 'bg-pink-500/60',
      glassBorder: 'border-pink-300',
    },
  },
}

export const defaultTheme: SubjectTheme = {
  icon: BookOpen,
  colors: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    text: 'text-gray-500',
    bgLight: 'bg-gray-50',
    hoverLight: 'hover:bg-gray-100',
    badge: 'bg-gray-100 text-gray-800',
    active: 'bg-gray-100 text-gray-800',
    glass: 'bg-gray-500/60',
    glassBorder: 'border-gray-300',
  },
}

export function getSubjectTheme(subjectId: string): SubjectTheme {
  return subjectThemes[subjectId] || defaultTheme
}
