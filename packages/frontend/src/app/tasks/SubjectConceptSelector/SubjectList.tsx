import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Grid2x2 } from 'lucide-react'
import { getSubjectTheme } from '@/app/common/subjectTheme'
import { SubjectListProps } from './types'

export const SubjectList = memo(function SubjectList({
  subjects,
  currentSubject: _currentSubject,
  previewSubject,
  onSubjectClick,
  onSubjectHover,
}: SubjectListProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-2">
      {/* Header with navigation */}
      <div className="flex items-center justify-between px-1 pb-2 border-b border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t('task.subjects')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs hover:bg-muted"
          onClick={() => navigate('/subjects')}
        >
          <Grid2x2 className="w-3.5 h-3.5 mr-1" />
          {t('task.viewAll', { defaultValue: 'View All' })}
        </Button>
      </div>

      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={t('task.subjects')}>
          {subjects.map((subject) => {
            const theme = getSubjectTheme(subject.id)
            const Icon = theme.icon
            const isActive = previewSubject === subject.id

            // Build dynamic class names based on state
            let stateClasses = ''
            if (isActive) {
              stateClasses = `${theme.colors.active} font-medium`
            } else {
              stateClasses = 'hover:bg-muted'
            }

            return (
              <Button
                key={subject.id}
                variant="ghost"
                role="option"
                aria-selected={isActive}
                className={`justify-start gap-2 px-3 py-2.5 h-auto rounded-xl ${stateClasses}`}
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
