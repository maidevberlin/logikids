import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useUserData } from '@/features/UserData'
import { logikids, SubjectsResponse } from '@/api/logikids'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface TaskPageHeaderProps {
  subject: string
  concept?: string
  difficulty: 'easy' | 'medium' | 'hard'
  onSubjectChange: (subject: string) => void
  onConceptChange: (concept: string) => void
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void
}

export function TaskPageHeader({
  subject,
  concept,
  difficulty,
  onSubjectChange,
  onConceptChange,
  onDifficultyChange,
}: TaskPageHeaderProps) {
  const { t } = useTranslation()
  const { data: userData } = useUserData()

  // Fetch subjects and concepts
  const { data: subjectsData, isLoading } = useQuery<SubjectsResponse>({
    queryKey: ['subjects', userData?.settings.grade, userData?.settings.age],
    queryFn: ({ signal }) =>
      logikids.getSubjects(
        {
          grade: userData?.settings.grade ?? 5,
          age: userData?.settings.age ?? 10,
          difficulty,
        },
        signal
      ),
    enabled: !!userData,
  })

  const currentSubject = subjectsData?.subjects.find((s) => s.id === subject)
  const concepts = currentSubject?.concepts ?? []

  if (isLoading) {
    return (
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Subject Selector */}
      <Select value={subject} onValueChange={onSubjectChange}>
        <SelectTrigger className="w-48 rounded-xl">
          <SelectValue>
            {t(`subjects.${subject}.label`, { defaultValue: subject })}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {subjectsData?.subjects.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {t(`subjects.${s.id}.label`, { defaultValue: s.name })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Concept Selector */}
      <Select value={concept ?? 'random'} onValueChange={onConceptChange}>
        <SelectTrigger className="w-56 rounded-xl">
          <SelectValue>
            {concept && concept !== 'random'
              ? t(`subjects.${subject}.concepts.${concept}`, {
                  defaultValue: concept,
                })
              : t('task.randomConcept', { defaultValue: 'Random Concept' })}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="random">
            {t('task.randomConcept', { defaultValue: 'Random Concept' })}
          </SelectItem>
          {concepts.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {t(`subjects.${subject}.concepts.${c.id}`, {
                defaultValue: c.name,
              })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Difficulty Selector */}
      <Select value={difficulty} onValueChange={(v) => onDifficultyChange(v as 'easy' | 'medium' | 'hard')}>
        <SelectTrigger className="w-32 rounded-xl">
          <SelectValue>
            {t(`difficulty.${difficulty}`, { defaultValue: difficulty })}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">
            {t('difficulty.easy', { defaultValue: 'Easy' })}
          </SelectItem>
          <SelectItem value="medium">
            {t('difficulty.medium', { defaultValue: 'Medium' })}
          </SelectItem>
          <SelectItem value="hard">
            {t('difficulty.hard', { defaultValue: 'Hard' })}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
