import { Skeleton } from '@/app/common/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { ConceptCard } from './ConceptCard'
import { ShowAllConceptsButton } from './ShowAllConceptsButton'
import { Concept } from './types'

interface ConceptsTabContentProps {
  concepts: Concept[]
  isLoading: boolean
  showAll: boolean
  groupedByGrade: Array<{ grade: number | 'other'; concepts: Concept[] }> | null
  subjectId: string
  onToggleShowAll: () => void
  gradeFilteredIds: Set<string>
  isConceptAdvanced: (concept: Concept) => boolean
}

export function ConceptsTabContent({
  concepts,
  isLoading,
  showAll,
  groupedByGrade,
  subjectId,
  onToggleShowAll,
  gradeFilteredIds,
  isConceptAdvanced,
}: ConceptsTabContentProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!isLoading && concepts.length === 0) {
    return (
      <>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            {showAll
              ? t('concepts.noConcepts', { defaultValue: 'No concepts available for this subject.' })
              : t('concepts.noConceptsForGrade', {
                  defaultValue: 'No concepts available for your grade. Try "Show All Concepts".'
                })}
          </p>
        </div>
        {!showAll && <ShowAllConceptsButton showAll={showAll} onToggle={onToggleShowAll} />}
      </>
    )
  }

  if (groupedByGrade) {
    return (
      <>
        {groupedByGrade.map(({ grade: gradeKey, concepts }) => (
          <div key={gradeKey}>
            <h2 className={`text-2xl font-semibold text-foreground mb-4 ${gradeKey === groupedByGrade[0].grade ? '' : 'mt-8'}`}>
              {gradeKey === 'other'
                ? t('concepts.gradeGroup.other', { defaultValue: 'Other' })
                : t('concepts.gradeGroup.gradeN', { defaultValue: 'Grade {{grade}}', grade: gradeKey })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {concepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  subject={subjectId}
                  isAdvanced={isConceptAdvanced(concept)}
                />
              ))}
            </div>
          </div>
        ))}
        {concepts.length > 0 && <ShowAllConceptsButton showAll={showAll} onToggle={onToggleShowAll} />}
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {concepts.map((concept) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            subject={subjectId}
            isAdvanced={showAll && !gradeFilteredIds.has(concept.id)}
          />
        ))}
      </div>
      {concepts.length > 0 && <ShowAllConceptsButton showAll={showAll} onToggle={onToggleShowAll} />}
    </>
  )
}
