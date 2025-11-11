import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { List } from 'lucide-react'
import { getSubjectNamespace } from '@/i18n/subjectNamespace'
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
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-2">
      {/* Header with navigation */}
      <div className="flex items-center justify-between px-1 pb-2 border-b border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t('task.concepts')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs hover:bg-muted"
          onClick={() => navigate(`/subjects/${subject}`)}
        >
          <List className="w-3.5 h-3.5 mr-1" />
          {t('task.viewAll', { defaultValue: 'View All' })}
        </Button>
      </div>

      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={t('task.concepts')}>
          {/* Random option */}
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

          {/* Concept list */}
          {concepts.map((concept) => {
            const isActive = currentConcept === concept.id
            const namespace = getSubjectNamespace(subject, concept.grade)

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
                  {t(`${namespace}:concepts.${concept.id}.name`, {
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
