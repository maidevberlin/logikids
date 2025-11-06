import { useState, useMemo, useEffect } from 'react'
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ChevronDown, ChevronUp, Sparkles, GraduationCap } from 'lucide-react'

interface ConceptsResponse {
  subject: {
    id: string
    name: string
    description: string
  }
  concepts: Concept[]
  totalResults: number
}

async function fetchSubjectConcepts(
  subjectId: string,
  options?: {
    grade?: number
    source?: 'curriculum' | 'custom'
    difficulty?: 'easy' | 'medium' | 'hard'
  }
): Promise<ConceptsResponse> {
  const params = new URLSearchParams()

  if (options?.grade !== undefined) {
    params.append('grade', options.grade.toString())
  }

  if (options?.source) {
    params.append('source', options.source)
  }

  if (options?.difficulty) {
    params.append('difficulty', options.difficulty)
  }

  const url = `/api/task/subjects/${subjectId}/concepts${params.toString() ? '?' + params.toString() : ''}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch concepts')
  }
  return response.json()
}

export default function ConceptsPage() {
  const { subject: subjectId } = useParams<{ subject: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: userData } = useUserData()
  const [showAll, setShowAll] = useState(false)
  const [activeTab, setActiveTab] = useState<'school' | 'fun'>('school')

  const grade = userData?.settings.grade

  // Reset showAll when switching tabs
  useEffect(() => {
    setShowAll(false)
  }, [activeTab])

  // Determine current source filter
  const currentSource = activeTab === 'school' ? 'curriculum' : 'custom'

  // Fetch grade-filtered concepts for current tab
  const { data: filteredData, isLoading: isLoadingFiltered } = useQuery({
    queryKey: ['concepts', subjectId, grade, currentSource],
    queryFn: () => fetchSubjectConcepts(subjectId!, { grade, source: currentSource }),
    enabled: !!subjectId && !!grade && !showAll,
  })

  // Fetch all concepts for current tab (when user clicks "show all" OR when no grade is set)
  const { data: allData, isLoading: isLoadingAll } = useQuery({
    queryKey: ['concepts', subjectId, 'all', currentSource],
    queryFn: () => fetchSubjectConcepts(subjectId!, { source: currentSource }),
    enabled: !!subjectId && (showAll || !grade),
  })

  // Determine which data to use
  const data = (grade && !showAll) ? filteredData : allData
  const isLoading = (grade && !showAll) ? isLoadingFiltered : isLoadingAll
  const subject = data?.subject

  if (!subjectId) {
    return (
      <PageLayout showBack showGameStats showAccount>
        <div className="text-center py-12">
          <p className="text-red-600">Invalid subject</p>
        </div>
      </PageLayout>
    )
  }

  // Get concepts from current data
  const concepts = data?.concepts || []

  // Group concepts by grade for "show all" view
  const groupedByGrade = useMemo(() => {
    if (!showAll) return null

    const groups = new Map<number | 'other', Concept[]>()

    concepts.forEach(concept => {
      const key = concept.grade ?? 'other'
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(concept)
    })

    // Sort grades ascending
    const sortedGrades = Array.from(groups.keys()).sort((a, b) => {
      if (a === 'other') return 1
      if (b === 'other') return -1
      return a - b
    })

    return sortedGrades.map(gradeKey => ({
      grade: gradeKey,
      concepts: groups.get(gradeKey)!
    }))
  }, [concepts, showAll])

  // Get grade-filtered IDs to mark advanced concepts
  const gradeFilteredIds = useMemo(() => {
    if (!filteredData) return new Set<string>()
    return new Set(filteredData.concepts.map(c => c.id))
  }, [filteredData])

  const handleSurpriseMe = () => {
    if (concepts.length === 0) return
    navigate(`/subjects/${subjectId}/tasks`)
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
        {isLoading && !subject ? (
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
            {concepts.length > 0 && (
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

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'school' | 'fun')} className="w-full">
          <TabsList className="mb-6 h-14 p-1.5">
            <TabsTrigger value="school" className="flex items-center gap-2 text-base px-6 h-full data-[state=active]:shadow-md">
              <GraduationCap className="w-5 h-5" />
              {t('concepts.tabs.school', { defaultValue: 'School' })}
            </TabsTrigger>
            <TabsTrigger value="fun" className="flex items-center gap-2 text-base px-6 h-full data-[state=active]:shadow-md">
              <Sparkles className="w-5 h-5" />
              {t('concepts.tabs.fun', { defaultValue: 'Fun' })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            ) : !isLoading && concepts.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  {showAll
                    ? t('concepts.noConcepts', { defaultValue: 'No concepts available for this subject.' })
                    : t('concepts.noConceptsForGrade', {
                        defaultValue: 'No concepts available for your grade. Try "Show All Concepts".'
                      })}
                </p>
              </div>
            ) : groupedByGrade ? (
              <>
                {groupedByGrade.map(({ grade: gradeKey, concepts }) => (
                  <div key={gradeKey}>
                    <h2 className={`text-2xl font-semibold text-gray-800 mb-4 ${gradeKey === groupedByGrade[0].grade ? '' : 'mt-8'}`}>
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
                          isAdvanced={false}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
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
            )}

            {!showAll && concepts.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAll(true)}
                  className="gap-2"
                >
                  {t('concepts.showAdvanced', { defaultValue: 'Show All Concepts' })}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}

            {showAll && (
              <div className="flex justify-center mt-6">
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
          </TabsContent>

          <TabsContent value="fun">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            ) : !isLoading && concepts.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  {showAll
                    ? t('concepts.noConcepts', { defaultValue: 'No concepts available for this subject.' })
                    : t('concepts.noConceptsForGrade', {
                        defaultValue: 'No concepts available for your grade. Try "Show All Concepts".'
                      })}
                </p>
              </div>
            ) : groupedByGrade ? (
              <>
                {groupedByGrade.map(({ grade: gradeKey, concepts }) => (
                  <div key={gradeKey}>
                    <h2 className={`text-2xl font-semibold text-gray-800 mb-4 ${gradeKey === groupedByGrade[0].grade ? '' : 'mt-8'}`}>
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
                          isAdvanced={false}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
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
            )}

            {!showAll && concepts.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAll(true)}
                  className="gap-2"
                >
                  {t('concepts.showAdvanced', { defaultValue: 'Show All Concepts' })}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}

            {showAll && (
              <div className="flex justify-center mt-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
