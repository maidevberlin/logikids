import { useTranslation } from 'react-i18next'
import { Difficulty } from '@logikids/backend/tasks/types'
import { BaseSelect, SelectOption } from './BaseSelect'

interface DifficultySelectProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
}

export function DifficultySelect({ difficulty, onDifficultyChange }: DifficultySelectProps) {
  const { t } = useTranslation()

  const difficulties: SelectOption<Difficulty>[] = [
    { value: 'easy', label: t('difficulty.easy'), color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: t('difficulty.medium'), color: 'bg-yellow-100 text-yellow-800' },
    { value: 'hard', label: t('difficulty.hard'), color: 'bg-red-100 text-red-800' },
  ]

  return (
    <BaseSelect
      value={difficulty}
      options={difficulties}
      onChange={onDifficultyChange}
      align="right"
    />
  )
} 