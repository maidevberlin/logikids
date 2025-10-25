import { FadeInOut } from '../../../base/Animations/FadeInOut'
import { useTranslation } from 'react-i18next'
import { MarkdownRenderer } from '../../../../components/MarkdownRenderer'
import { SolutionExplanationProps } from './types'
import { styles } from './styles'

export function SolutionExplanation({ explanation }: SolutionExplanationProps) {
  const { t } = useTranslation()

  return (
    <FadeInOut className={styles.base}>
      <h3 className="text-lg font-medium text-success-800 mb-2">
        {t('task.solutionExplanation')}
      </h3>
      <MarkdownRenderer
        content={explanation}
        className={styles.content}
        enableMath={true}
        enableMermaid={false}
        enableCode={false}
      />
    </FadeInOut>
  )
} 