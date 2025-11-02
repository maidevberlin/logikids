import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common'
import { getSubjectTheme } from '@/app/common/subjectTheme'
import { ConceptCard } from './ConceptCard'
import { Concept } from './types'
import { useUserData } from '@/app/account'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

interface SubjectWithConcepts {
  id: string
  name: string
  description: string
  concepts: Concept[]
}

async function fetchConcepts(grade?: number): Promise<SubjectWithConcepts[]> {
  const url = grade
    ? `/api/task/subjects?grade=${grade}`
    : '/api/task/subjects'

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch concepts')
  }
  const data = await response.json()
  return data.subjects
}

export default function ConceptsPage() {
  const { subject: subjectId } = useParams<{ subject: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: userData } = useUserData()
  const [showAll, setShowAll] = useState(false)

  const grade = userData?.settings.grade

  // Fetch filtered concepts
  const { data: filteredSubjects, isLoading: isLoadingFiltered } = useQuery({
    queryKey: ['concepts', subjectId, grade],
    queryFn: () => fetchConcepts(grade),
    enabled: !!grade && !showAll,
  })

  // Fetch all concepts (when user clicks "show all" OR when no grade is set)
  const { data: allSubjects, isLoading: isLoadingAll } = useQuery({
    queryKey: ['concepts', subjectId, 'all'],
    queryFn: () => fetchConcepts(),
    enabled: showAll || !grade,
  })

  // Use filtered subjects only when we have a grade and not showing all
  // Otherwise use all subjects (for users without grade or when showing all)
  const subjects = (grade && !showAll) ? filteredSubjects : allSubjects
  const isLoading = (grade && !showAll) ? isLoadingFiltered : isLoadingAll
  const subject = subjects?.find((s) => s.id === subjectId)

  if (!subjectId) {
    return (
      <PageLayout showBack showGameStats showAccount>
        <div className="text-center py-12">
          <p className="text-red-600">Invalid subject</p>
        </div>
      </PageLayout>
    )
  }

  // Get concepts to display (subject is already from the correct source)
  const filteredConcepts = subject?.concepts || []
  // Get grade-filtered concepts (to mark which ones are advanced)
  const gradeFilteredConcepts = filteredSubjects?.find(s => s.id === subjectId)?.concepts || []

  // Determine which concepts are advanced (not in grade-filtered list)
  const gradeFilteredIds = new Set(gradeFilteredConcepts.map(c => c.id))

  const handleSurpriseMe = () => {
    if (filteredConcepts.length === 0) return

    // Pick a random concept from the filtered list
    const randomConcept = filteredConcepts[Math.floor(Math.random() * filteredConcepts.length)]

    // Navigate to tasks for that concept
    navigate(`/subjects/${subjectId}/${randomConcept.id}/tasks`)
  }

  // Get subject theme
  const theme = getSubjectTheme(subjectId || '')
  const SubjectIcon = theme.icon
  const colors = theme.colors

  return (
    <PageLayout
      showBack
      showGameStats
      showAccount
    >
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
          </>
        ) : subject ? (
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-6 flex-1">
              <div className={`${colors.bg} ${colors.hover} transition-colors duration-300 p-6 rounded-2xl shadow-md`}>
                <SubjectIcon className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {t(`subjects.${subjectId}.label`, { defaultValue: subject.name })}
                </h1>
                <p className="text-xl text-gray-600">
                  {t(`subjects.${subjectId}.description`, { defaultValue: subject.description })}
                </p>
              </div>
            </div>
            {filteredConcepts.length > 0 && (
              <Button
                onClick={handleSurpriseMe}
                size="lg"
                className={`ml-6 ${colors.bg} ${colors.hover} text-white gap-2 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl`}
              >
                <Sparkles className="w-5 h-5" />
                {t('concepts.surpriseMe.title', { defaultValue: 'Surprise Me!' })}
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">
              {t('concepts.subjectNotFound', { defaultValue: 'Subject not found' })}
            </p>
          </div>
        )}

        {!isLoading && filteredConcepts.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              {showAll
                ? t('concepts.noConcepts', { defaultValue: 'No concepts available for this subject.' })
                : t('concepts.noConceptsForGrade', {
                    defaultValue: 'No concepts available for your grade. Try "Show Advanced Concepts".'
                  })}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {filteredConcepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  subject={subjectId}
                  isAdvanced={showAll && !gradeFilteredIds.has(concept.id)}
                />
              ))}
            </div>

            {!showAll && filteredConcepts.length > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAll(true)}
                  className="gap-2"
                >
                  {t('concepts.showAdvanced', { defaultValue: 'Show Advanced Concepts' })}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}

            {showAll && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAll(false)}
                  className="gap-2"
                >
                  {t('concepts.hideAdvanced', { defaultValue: 'Show Grade-Appropriate Only' })}
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
