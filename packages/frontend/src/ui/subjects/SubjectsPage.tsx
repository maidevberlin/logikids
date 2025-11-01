import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/ui/common'
import { SubjectCard } from './SubjectCard'
import { Subject } from './types'
import { Skeleton } from '@/components/ui/skeleton'

async function fetchSubjects(): Promise<Subject[]> {
  const response = await fetch('/api/task/subjects')
  if (!response.ok) {
    throw new Error('Failed to fetch subjects')
  }
  const data = await response.json()
  return data.subjects
}

export default function SubjectsPage() {
  const { t } = useTranslation()
  const { data: subjects, isLoading, error } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  })

  return (
    <PageLayout
      showHome
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
            {subjects?.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
