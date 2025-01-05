import { useTranslation } from 'react-i18next'
import { Interactive } from '../../../base/Animations'
import { Card } from '../../../base/Card'
import { YesNoAnswerProps } from './types'
import { styles } from './styles'

export function YesNoAnswer({
  selectedAnswer,
  onAnswerSelect,
  isLoading = false
}: YesNoAnswerProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[1, 2].map((_, index) => (
          <Card key={index} className={styles.option.base}>
            <div className={styles.loading.option} />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {[true, false].map((answer) => (
        <Interactive 
          key={answer.toString()}
          onClick={() => onAnswerSelect(answer)}
          className={styles.option.base}
        >
          <Card
            variant={
              selectedAnswer === answer
                ? 'primary'
                : 'default'
            }
          >
            <div className={styles.option.content}>
              {t(`task.${answer ? 'yes' : 'no'}`)}
            </div>
          </Card>
        </Interactive>
      ))}
    </div>
  )
} 