import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useUserData } from '@/app/account'
import { logikids, SubjectsResponse } from '@/api/logikids'
import { getSubjectNamespace } from '@/i18n/subjectNamespace'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Calculator,
  Brain,
  Atom,
  Languages,
  Music,
  BookOpen
} from 'lucide-react'

const subjectIcons: Record<string, typeof Calculator> = {
  math: Calculator,
  logic: Brain,
  physics: Atom,
  german: Languages,
  english: BookOpen,
  music: Music,
}

const subjectBadgeStyles: Record<string, string> = {
  math: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border-0',
  logic: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border-0',
  physics: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border-0',
  german: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border-0',
  english: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border-0',
  music: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800 border-0',
}

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

  const currentSubject = subjectsData?.subjects.find((s) => s.id === subject);
  const concepts = currentSubject?.concepts ?? []

  if (isLoading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
    )
  }

  const SubjectIcon = subjectIcons[subject] || BookOpen

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* Subject Selector */}
      <Select value={subject} onValueChange={onSubjectChange}>
        <SelectTrigger className="w-auto rounded-xl border-0 shadow-none hover:opacity-80">
          <SelectValue>
            <span className={subjectBadgeStyles[subject] || subjectBadgeStyles.math}>
              <SubjectIcon className="w-4 h-4" />
              {t(`subjects.${subject}.label`, { defaultValue: subject })}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-fit">
          {subjectsData?.subjects.map((s) => {
            const Icon = subjectIcons[s.id] || BookOpen
            return (
              <SelectItem key={s.id} value={s.id}>
                <span className={subjectBadgeStyles[s.id] || subjectBadgeStyles.math}>
                  <Icon className="w-4 h-4" />
                  {t(`subjects.${s.id}.label`, { defaultValue: s.name })}
                </span>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {/* Concept Selector */}
      <Select value={concept ?? 'random'} onValueChange={onConceptChange}>
        <SelectTrigger className="w-56 rounded-xl">
          <SelectValue>
            {concept && concept !== 'random'
              ? (() => {
                  const c = concepts.find((c) => c.id === concept)
                  const namespace = c ? getSubjectNamespace(subject, c.grade) : `subjects/${subject}`
                  return t(`${namespace}:concepts.${concept}.name`, {
                    defaultValue: c?.name || concept,
                  })
                })()
              : t('task.randomConcept')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="random">
            {t('task.randomConcept')}
          </SelectItem>
          {concepts.map((c) => {
            const namespace = getSubjectNamespace(subject, c.grade)
            return (
              <SelectItem key={c.id} value={c.id}>
                {t(`${namespace}:concepts.${c.id}.name`, {
                  defaultValue: c.name,
                })}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

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
