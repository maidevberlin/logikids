import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Calculator,
  Brain,
  Atom,
  Languages,
  Music,
  BookOpen,
  Grid2x2
} from 'lucide-react'
import { SubjectListProps } from './types'

const subjectIcons: Record<string, typeof Calculator> = {
  math: Calculator,
  logic: Brain,
  physics: Atom,
  german: Languages,
  english: BookOpen,
  music: Music,
}

const subjectBgStyles: Record<string, string> = {
  math: 'bg-blue-50 hover:bg-blue-100',
  logic: 'bg-purple-50 hover:bg-purple-100',
  physics: 'bg-emerald-50 hover:bg-emerald-100',
  german: 'bg-red-50 hover:bg-red-100',
  english: 'bg-amber-50 hover:bg-amber-100',
  music: 'bg-pink-50 hover:bg-pink-100',
}

const subjectActiveStyles: Record<string, string> = {
  math: 'bg-blue-100 text-blue-800 font-medium',
  logic: 'bg-purple-100 text-purple-800 font-medium',
  physics: 'bg-emerald-100 text-emerald-800 font-medium',
  german: 'bg-red-100 text-red-800 font-medium',
  english: 'bg-amber-100 text-amber-800 font-medium',
  music: 'bg-pink-100 text-pink-800 font-medium',
}

export const SubjectList = memo(function SubjectList({
  subjects,
  currentSubject,
  previewSubject,
  onSubjectClick,
  onSubjectHover,
}: SubjectListProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-2">
      {/* Header with navigation */}
      <div className="flex items-center justify-between px-1 pb-2 border-b">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {t('task.subjects')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs hover:bg-gray-100"
          onClick={() => navigate('/subjects')}
        >
          <Grid2x2 className="w-3.5 h-3.5 mr-1" />
          {t('task.viewAll', { defaultValue: 'View All' })}
        </Button>
      </div>

      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={t('task.subjects')}>
          {subjects.map((subject) => {
            const Icon = subjectIcons[subject.id] || BookOpen
            const isActive = currentSubject === subject.id
            const isPreviewing = previewSubject === subject.id

            return (
              <Button
                key={subject.id}
                variant="ghost"
                role="option"
                aria-selected={isActive}
                className={`
                  justify-start gap-2 px-3 py-2.5 h-auto rounded-xl
                  ${isActive ? subjectActiveStyles[subject.id] : ''}
                  ${!isActive && isPreviewing ? subjectBgStyles[subject.id] : ''}
                  ${!isActive && !isPreviewing ? 'hover:bg-gray-50' : ''}
                `}
                onClick={() => onSubjectClick(subject.id)}
                onMouseEnter={() => onSubjectHover(subject.id)}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  {t(`subjects.${subject.id}.label`, { defaultValue: subject.name })}
                </span>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
})
