import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getSubjectTheme } from '@/app/common/subjectTheme'
import { SubjectListProps } from './types'

export const SubjectList = memo(function SubjectList({
  subjects,
  currentSubject: _currentSubject,
  previewSubject,
  onSubjectClick,
  onSubjectHover,
  showAll,
  hasMoreSubjects,
  onToggleShowAll,
}: SubjectListProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
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

          {/* Toggle link */}
          {hasMoreSubjects && (
            <button
              onClick={onToggleShowAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 text-center w-full"
            >
              {showAll ? t('task.showRecommended') : t('task.showAllSubjects')}
            </button>
          )}
        </div>
      </ScrollArea>
    </div>
  )
})
