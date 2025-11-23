import { useMemo } from 'react'
import { useUserData } from '@/app/account'
import { trpc } from '@/api/trpc'
import { Skeleton } from '@/components/ui/skeleton'
import { SubjectConceptSelector } from './SubjectConceptSelector'

interface TaskPageHeaderProps {
  subject: string
  concept?: string
  onConceptChange: (concept: string, subject: string) => void
}

export function TaskPageHeader({
  subject,
  concept,
  onConceptChange,
}: TaskPageHeaderProps) {
  const { data: userData } = useUserData()

  // Fetch filtered subjects (by grade)
  const { data: filteredSubjects, isLoading: isLoadingFiltered } = trpc.subjects.getAll.useQuery(
    { grade: userData?.settings.grade ?? 5 },
    { enabled: !!userData }
  )

  // Fetch all subjects (no grade filter)
  const { data: allSubjects, isLoading: isLoadingAll } = trpc.subjects.getAll.useQuery(
    {},
    { enabled: !!userData }
  )

  // Detect if current concept is in filtered list
  const showAllByDefault = useMemo(() => {
    if (!concept || !filteredSubjects) return false
    const subj = filteredSubjects.subjects.find((s) => s.id === subject)
    const conceptExists = subj?.concepts?.some((c) => c.id === concept) ?? false
    return !conceptExists
  }, [concept, subject, filteredSubjects])

  if (isLoadingFiltered || isLoadingAll) {
    return <Skeleton className="h-10 w-48" />
  }

  return (
    <SubjectConceptSelector
      subject={subject}
      concept={concept}
      filteredSubjects={filteredSubjects?.subjects ?? []}
      allSubjects={allSubjects?.subjects ?? []}
      showAllByDefault={showAllByDefault}
      onConceptChange={onConceptChange}
    />
  )
}
