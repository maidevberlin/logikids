import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common'
import { SubjectCard } from './SubjectCard'
import { Subject } from './types'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserData } from '@/app/account'

// School subject ordering (when they typically start in school)
const SUBJECT_ORDER = ['math', 'german', 'english', 'physics', 'logic', 'music']

async function fetchAllSubjects(): Promise<Subject[]> {
  const response = await fetch('/api/task/subjects')
  if (!response.ok) {
    throw new Error('Failed to fetch subjects')
  }
  const data = await response.json()
  return data.subjects
}

async function fetchFilteredSubjects(grade: number): Promise<Subject[]> {
  const response = await fetch(`/api/task/subjects?grade=${grade}`)
  if (!response.ok) {
    throw new Error('Failed to fetch subjects')
  }
  const data = await response.json()
  return data.subjects
}

function sortSubjects(subjects: Subject[]): Subject[] {
  return [...subjects].sort((a, b) => {
    const indexA = SUBJECT_ORDER.indexOf(a.id)
    const indexB = SUBJECT_ORDER.indexOf(b.id)

    // If both are in the order list, sort by order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    // If only A is in the order list, A comes first
    if (indexA !== -1) return -1

    // If only B is in the order list, B comes first
    if (indexB !== -1) return 1

    // If neither is in the order list, sort alphabetically
    return a.name.localeCompare(b.name)
  })
}

export default function SubjectsPage() {
  const { t } = useTranslation()
  const { data: userData } = useUserData()
  const userGrade = userData?.settings.grade

  // Fetch all subjects with metadata (for subjects with no concepts for user's grade)
  const { data: allSubjects } = useQuery({
    queryKey: ['subjects', 'all'],
    queryFn: fetchAllSubjects,
  })

  // Fetch filtered subjects (concepts available for user's grade)
  const { data: filteredSubjects, isLoading, error } = useQuery({
    queryKey: ['subjects', 'filtered', userGrade],
    queryFn: () => fetchFilteredSubjects(userGrade!),
    enabled: !!userGrade,
  })

  // Create a map of filtered subjects for quick lookup
  const filteredSubjectIds = new Set(filteredSubjects?.map(s => s.id) ?? [])

  // Merge: use all subjects but mark as disabled if not in filtered list
  const subjects = allSubjects?.map(subject => {
    const hasConceptsForGrade = filteredSubjectIds.has(subject.id)
    return {
      ...subject,
      // Subject is disabled if it has no concepts for the user's grade
      isDisabledForGrade: !hasConceptsForGrade && subject.conceptCount > 0,
    }
  }) ?? []

  const sortedSubjects = sortSubjects(subjects)

  return (
    <PageLayout
      showHome
      showGameStats
      showAccount
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('subjects.pageTitle', { defaultValue: 'Choose Your Subject' })}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('subjects.pageDescription', {
            defaultValue: 'Select a subject to start learning'
          })}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">
              {t('subjects.error', { defaultValue: 'Failed to load subjects. Please try again.' })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSubjects.map((subject) => {
              const disabled = subject.conceptCount === 0 || subject.isDisabledForGrade

              return (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  disabled={disabled}
                  minGrade={subject.minGrade}
                />
              )
            })}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
