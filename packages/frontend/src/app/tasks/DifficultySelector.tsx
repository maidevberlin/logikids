import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const difficultyBadgeStyles: Record<string, string> = {
  easy: 'inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border-0',
  medium: 'inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border-0',
  hard: 'inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 border-0',
}

interface DifficultySelectorProps {
  difficulty: 'easy' | 'medium' | 'hard'
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void
}

export function DifficultySelector({
  difficulty,
  onDifficultyChange,
}: DifficultySelectorProps) {
  const { t } = useTranslation()

  return (
    <Select
      value={difficulty}
      onValueChange={(v) => onDifficultyChange(v as 'easy' | 'medium' | 'hard')}
    >
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
  )
}
