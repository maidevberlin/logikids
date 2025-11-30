import { useMemo } from 'react'
import { useUserData } from '@/app/account'
import { trpc } from '@/api/trpc'
import { SubjectConceptSelector } from './SubjectConceptSelector'

interface TaskPageHeaderProps {
  subject: string
  concept?: string
  onConceptChange: (concept: string, subject: string) => void
}

export function TaskPageHeader({ subject, concept, onConceptChange }: TaskPageHeaderProps) {
  const { data: userData } = useUserData()

  // Fetch filtered subjects (by grade)
  const { data: filteredSubjects } = trpc.subjects.getAll.useQuery(
    { grade: userData?.settings.grade ?? 5 },
    { enabled: !!userData }
  )

  // Fetch all subjects (no grade filter)
  const { data: allSubjects } = trpc.subjects.getAll.useQuery({}, { enabled: !!userData })

  // Detect if current concept is in filtered list
  const showAllByDefault = useMemo(() => {
    if (!concept || !filteredSubjects) return false
    const subj = filteredSubjects.subjects.find((s) => s.id === subject)
    const conceptExists = subj?.concepts?.some((c) => c.id === concept) ?? false
    return !conceptExists
  }, [concept, subject, filteredSubjects])

  // Render immediately - we have subject/concept from URL params
  // The SubjectConceptSelector will handle loading state for dropdown content
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
