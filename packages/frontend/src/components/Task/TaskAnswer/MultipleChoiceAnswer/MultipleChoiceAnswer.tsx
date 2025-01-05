import { Interactive } from '../../../base/Animations'
import { Card } from '../../../base/Card'
import { MultipleChoiceAnswerProps, MultipleChoiceVariant } from './types'
import { styles } from './styles'

const colorVariants: MultipleChoiceVariant[] = ['softBlue', 'softOrange', 'softPurple', 'softTeal']

export function MultipleChoiceAnswer({
  options,
  selectedAnswer,
  onAnswerSelect,
  isLoading = false
}: MultipleChoiceAnswerProps) {

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4].map((_, index) => (
          <Card key={index} className={styles.option.base}>
            <div className={styles.loading.option} />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {options.map((option, index) => (
        <Interactive 
          key={index}
          onClick={() => onAnswerSelect(index)}
          className={styles.option.base}
        >
          <Card
            variant={
              selectedAnswer === index
                ? 'primary'
                : colorVariants[index % colorVariants.length]
            }
          >
            <div 
              className={styles.option.content}
              dangerouslySetInnerHTML={{ __html: option.text }} 
            />
          </Card>
        </Interactive>
      ))}
    </div>
  )
} 