import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import {
  Calculator,
  Brain,
  Atom,
  Languages,
  Music,
  BookOpen
} from 'lucide-react'
import { Subject } from './types'

const subjectIcons: Record<string, typeof Calculator> = {
  math: Calculator,
  logic: Brain,
  physics: Atom,
  german: Languages,
  english: BookOpen,
  music: Music,
}

const subjectColors: Record<string, string> = {
  math: 'bg-blue-500 hover:bg-blue-600',
  logic: 'bg-purple-500 hover:bg-purple-600',
  physics: 'bg-emerald-500 hover:bg-emerald-600',
  german: 'bg-red-500 hover:bg-red-600',
  english: 'bg-amber-500 hover:bg-amber-600',
  music: 'bg-pink-500 hover:bg-pink-600',
}

export interface SubjectCardProps {
  subject: Subject
  disabled?: boolean
  minGrade?: number
}

export function SubjectCard({ subject, disabled = false, minGrade }: SubjectCardProps) {
  const { t } = useTranslation()
  const Icon = subjectIcons[subject.id] || BookOpen
  const colorClass = subjectColors[subject.id] || 'bg-gray-500 hover:bg-gray-600'

  const content = (
    <Card className={`shadow-md transition-all duration-300 h-full overflow-hidden rounded-2xl ${
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:shadow-lg cursor-pointer hover:scale-[1.02]'
    }`}>
      <CardContent className={`h-full p-8 text-white ${
        disabled
          ? colorClass.split(' ')[0] // Remove hover class when disabled
          : colorClass
      } transition-colors duration-300`}>
        <Icon className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {t(`subjects.${subject.id}.label`, { defaultValue: subject.name })}
        </h2>
        <p className="text-white/90">
          {t(`subjects.${subject.id}.description`, { defaultValue: subject.description })}
        </p>
        {disabled && minGrade && (
          <p className="text-white/80 text-sm mt-4 italic">
            {t('subjects.availableFromGrade', { grade: minGrade, defaultValue: `Available from grade ${minGrade}` })}
          </p>
        )}
      </CardContent>
    </Card>
  )

  if (disabled) {
    return content
  }

  return (
    <Link to={`/subjects/${subject.id}`}>
      {content}
    </Link>
  )
}
