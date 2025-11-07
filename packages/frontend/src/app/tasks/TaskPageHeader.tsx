import { useQuery } from '@tanstack/react-query'
import { useUserData } from '@/app/account'
import { logikids, SubjectsResponse } from '@/api/logikids'
import { Skeleton } from '@/components/ui/skeleton'
import { UnifiedSubjectConceptSelector } from './UnifiedSubjectConceptSelector'

interface TaskPageHeaderProps {
  subject: string
  concept?: string
  onSubjectChange: (subject: string) => void
  onConceptChange: (concept: string, subject: string) => void
}

export function TaskPageHeader({
  subject,
  concept,
  onSubjectChange,
  onConceptChange,
}: TaskPageHeaderProps) {
  const { data: userData } = useUserData()

  // Fetch subjects and concepts
  // Note: We don't filter by difficulty here to show all concepts for the grade
  // The difficulty selector only affects task generation, not which concepts are shown
  const { data: subjectsData, isLoading } = useQuery<SubjectsResponse>({
    queryKey: ['subjects', userData?.settings.grade],
    queryFn: ({ signal }) =>
      logikids.getSubjects(
        {
          grade: userData?.settings.grade ?? 5,
        },
        signal
      ),
    enabled: !!userData,
  })

  if (isLoading) {
    return <Skeleton className="h-10 w-48" />
  }

  return (
    <UnifiedSubjectConceptSelector
      subject={subject}
      concept={concept}
      subjects={subjectsData?.subjects ?? []}
      onSubjectChange={onSubjectChange}
      onConceptChange={onConceptChange}
    />
  )
}
