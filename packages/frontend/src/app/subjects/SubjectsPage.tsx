import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common'
import { SubjectCard } from './SubjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserData } from '@/app/account'
import { trpc } from '@/api/trpc'
import { SubjectInfo } from '@/api/logikids'

// School subject ordering (when they typically start in school)
const SUBJECT_ORDER = ['math', 'german', 'english', 'physics', 'logic', 'music']

// Extended type for internal use
type SubjectWithDisabled = SubjectInfo & { isDisabledForGrade?: boolean }

function sortSubjects(subjects: SubjectWithDisabled[]): SubjectWithDisabled[] {
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
  const userAge = userData?.settings.age

  // Fetch all subjects with metadata (for subjects with no concepts for user's grade)
  const { data: allSubjects } = trpc.subjects.getAll.useQuery({})

  // Fetch filtered subjects (concepts available for user's grade/age)
  const { data: filteredSubjects, isLoading, error } = trpc.subjects.getAll.useQuery(
    { grade: userGrade!, age: userAge },
    { enabled: !!userGrade }
  )

  // Create a map of filtered subjects for quick lookup
  const filteredSubjectIds = new Set(filteredSubjects?.subjects?.map(s => s.id) ?? [])

  // Merge: use all subjects but mark as disabled if not in filtered list
  const subjects = allSubjects?.subjects?.map(subject => {
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
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {t('subjects.pageTitle', { defaultValue: 'Choose Your Subject' })}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
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
