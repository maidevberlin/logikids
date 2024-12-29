import { FadeInOut } from '../base/Animations/FadeInOut'
import { useTranslation } from 'react-i18next'

interface SolutionExplanationProps {
  explanation: string
}

export function SolutionExplanation({ explanation }: SolutionExplanationProps) {
  const { t } = useTranslation()

  return (
    <FadeInOut className="bg-green-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-green-800 mb-2">
        {t('task.solutionExplanation')}
      </h3>
      <div 
        className="prose prose-blue max-w-none text-green-700"
        dangerouslySetInnerHTML={{ __html: explanation }}
      />
    </FadeInOut>
  )
} 