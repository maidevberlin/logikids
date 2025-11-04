import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getSubjectNamespace } from '@/i18n/subjectNamespace'
import { ConceptListProps } from './types'

export const ConceptList = memo(function ConceptList({
  subject,
  concepts,
  currentConcept,
  onConceptClick,
}: ConceptListProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase px-3">
        {t('task.concepts')}
      </h3>
      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={t('task.concepts')}>
          {/* Random option */}
          <Button
            variant="ghost"
            role="option"
            aria-selected={!currentConcept || currentConcept === 'random'}
            className={`
              justify-start px-3 py-2.5 h-auto rounded-xl
              ${!currentConcept || currentConcept === 'random' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}
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
                  ${isActive ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}
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
        </div>
      </ScrollArea>
    </div>
  )
})
