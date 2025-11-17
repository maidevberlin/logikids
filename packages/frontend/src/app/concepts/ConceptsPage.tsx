import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common'
import { getSubjectTheme } from '@/app/common/subjectTheme'
import { ConceptsTabContent } from './ConceptsTabContent'
import { Concept } from './types'
import { useUserData } from '@/app/account'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Sparkles, GraduationCap } from 'lucide-react'

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
  const location = useLocation()
  const { data: userData } = useUserData()

  // Initialize showAll from location state (e.g., from disabled subject click) or default to false
  const [showAll, setShowAll] = useState(() => (location.state as { showAll?: boolean })?.showAll ?? false)
  const [activeTab, setActiveTab] = useState<'school' | 'fun'>('school')
  const [initialTabSet, setInitialTabSet] = useState(false)

  const grade = userData?.settings.grade

  // Fetch both official and custom concepts to determine default tab
  const { data: schoolCheck } = useQuery({
    queryKey: ['concepts-check', subjectId, grade, 'curriculum'],
    queryFn: () => fetchSubjectConcepts(subjectId!, { grade, source: 'curriculum' }),
    enabled: !!subjectId && !initialTabSet,
  })

  const { data: customCheck } = useQuery({
    queryKey: ['concepts-check', subjectId, grade, 'custom'],
    queryFn: () => fetchSubjectConcepts(subjectId!, { grade, source: 'custom' }),
    enabled: !!subjectId && !initialTabSet,
  })

  // Set initial tab based on which has concepts
  useEffect(() => {
    if (!initialTabSet && schoolCheck && customCheck) {
      const hasSchool = schoolCheck.concepts.length > 0
      const hasCustom = customCheck.concepts.length > 0

      // If no official concepts but there are custom ones, default to fun tab
      if (!hasSchool && hasCustom) {
        setActiveTab('fun')
      }
      setInitialTabSet(true)
    }
  }, [initialTabSet, schoolCheck, customCheck])

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

  // Get concepts from current data and sort them
  const concepts = useMemo(() => {
    const rawConcepts = data?.concepts || []

    // Sort by grade desc (higher grades first), then by name asc (alphabetical)
    return [...rawConcepts].sort((a, b) => {
      // Handle undefined grades - put them last
      const gradeA = a.grade ?? -1
      const gradeB = b.grade ?? -1

      // Sort by grade descending
      if (gradeA !== gradeB) {
        return gradeB - gradeA
      }

      // If same grade, sort by name ascending
      return a.name.localeCompare(b.name)
    })
  }, [data?.concepts])

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

    // Sort grades descending (higher grades first)
    const sortedGrades = Array.from(groups.keys()).sort((a, b) => {
      if (a === 'other') return 1
      if (b === 'other') return -1
      return b - a  // Changed from a - b to b - a for descending
    })

    return sortedGrades.map(gradeKey => ({
      grade: gradeKey,
      concepts: groups.get(gradeKey)!.sort((a, b) => a.name.localeCompare(b.name))  // Sort concepts within each grade by name
    }))
  }, [concepts, showAll])

  // Get grade-filtered IDs to mark advanced concepts (only concepts ABOVE user's grade)
  const gradeFilteredIds = useMemo(() => {
    if (!filteredData) return new Set<string>()
    return new Set(filteredData.concepts.map(c => c.id))
  }, [filteredData])

  // Helper to determine if a concept is advanced (above user's grade)
  const isConceptAdvanced = (concept: Concept) => {
    if (!showAll || !grade) return false
    if (!concept.grade) return false
    return concept.grade > grade
  }

  const handleSurpriseMe = () => {
    if (concepts.length === 0) return
    navigate(`/subjects/${subjectId}/random/tasks`)
  }

  // Get subject theme
  const theme = getSubjectTheme(subjectId || '')
  const SubjectIcon = theme.icon
  const colors = theme.colors

  return (
    <PageLayout
      showBack
      showHome
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8 gap-6">
            <div className="flex items-start gap-6 flex-1">
              <div className={`${colors.bg} ${colors.hover} transition-colors duration-300 p-6 rounded-2xl shadow-md`}>
                <SubjectIcon className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {t(`subjects.${subjectId}.label`, { defaultValue: subject.name })}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {t(`subjects.${subjectId}.description`, { defaultValue: subject.description })}
                </p>
              </div>
            </div>
            {concepts.length > 0 && (
              <Button
                onClick={handleSurpriseMe}
                size="lg"
                className={`${colors.bg} ${colors.hover} text-white gap-2 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl w-full lg:w-auto lg:ml-6 lg:shrink-0`}
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
            <ConceptsTabContent
              concepts={concepts}
              isLoading={isLoading}
              showAll={showAll}
              groupedByGrade={groupedByGrade}
              subjectId={subjectId}
              onToggleShowAll={() => setShowAll(!showAll)}
              gradeFilteredIds={gradeFilteredIds}
              isConceptAdvanced={isConceptAdvanced}
            />
          </TabsContent>

          <TabsContent value="fun">
            <ConceptsTabContent
              concepts={concepts}
              isLoading={isLoading}
              showAll={showAll}
              groupedByGrade={groupedByGrade}
              subjectId={subjectId}
              onToggleShowAll={() => setShowAll(!showAll)}
              gradeFilteredIds={gradeFilteredIds}
              isConceptAdvanced={isConceptAdvanced}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
