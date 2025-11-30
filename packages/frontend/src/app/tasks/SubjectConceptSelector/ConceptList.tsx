import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/common/ui/button'
import { ScrollArea } from '@/app/common/ui/scroll-area'
import { ConceptListProps } from './types'

export const ConceptList = memo(function ConceptList({
  subject,
  concepts,
  currentConcept,
  onConceptClick,
  showAll,
  hasMoreConcepts,
  onToggleShowAll,
}: ConceptListProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={t('task.concepts')}>
          {/* Random option - only show if there are actual concepts */}
          {concepts.length > 0 && (
            <Button
              variant="ghost"
              role="option"
              aria-selected={!currentConcept || currentConcept === 'random'}
              className={`
                justify-start px-3 py-2.5 h-auto rounded-xl
                ${!currentConcept || currentConcept === 'random' ? 'bg-muted font-medium' : 'hover:bg-muted'}
              `}
              onClick={() => onConceptClick('random')}
            >
              <span className="text-sm">{t('task.randomConcept')}</span>
            </Button>
          )}

          {/* Concept list */}
          {concepts.map((concept) => {
            const isActive = currentConcept === concept.id

            return (
              <Button
                key={concept.id}
                variant="ghost"
                role="option"
                aria-selected={isActive}
                className={`
                  justify-start px-3 py-2.5 h-auto rounded-xl
                  ${isActive ? 'bg-muted font-medium' : 'hover:bg-muted'}
                `}
                onClick={() => onConceptClick(concept.id)}
              >
                <span className="text-sm">
                  {t(`subjects/${subject}:concepts.${concept.id}.name`, {
                    defaultValue: concept.name,
                  })}
                </span>
              </Button>
            )
          })}

          {/* Toggle link */}
          {hasMoreConcepts && (
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
