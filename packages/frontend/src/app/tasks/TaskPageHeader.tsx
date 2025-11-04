import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useUserData } from '@/app/account'
import { logikids, SubjectsResponse } from '@/api/logikids'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { UnifiedSubjectConceptSelector } from './UnifiedSubjectConceptSelector'

const difficultyBadgeStyles: Record<string, string> = {
  easy: 'inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border-0',
  medium: 'inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border-0',
  hard: 'inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 border-0',
}

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
    return (
      <div className="flex gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* Unified Subject-Concept Selector */}
      <UnifiedSubjectConceptSelector
        subject={subject}
        concept={concept}
        subjects={subjectsData?.subjects ?? []}
        onSubjectChange={onSubjectChange}
        onConceptChange={onConceptChange}
      />

      {/* Difficulty Selector */}
      <Select value={difficulty} onValueChange={(v) => onDifficultyChange(v as 'easy' | 'medium' | 'hard')}>
        <SelectTrigger className="w-auto rounded-xl border-0 shadow-none hover:opacity-80">
          <SelectValue>
            <span className={difficultyBadgeStyles[difficulty]}>
              {t(`difficulty.${difficulty}`, { defaultValue: difficulty })}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-fit">
          <SelectItem value="easy">
            <span className={difficultyBadgeStyles.easy}>
              {t('difficulty.easy', { defaultValue: 'Easy' })}
            </span>
          </SelectItem>
          <SelectItem value="medium">
            <span className={difficultyBadgeStyles.medium}>
              {t('difficulty.medium', { defaultValue: 'Medium' })}
            </span>
          </SelectItem>
          <SelectItem value="hard">
            <span className={difficultyBadgeStyles.hard}>
              {t('difficulty.hard', { defaultValue: 'Hard' })}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
