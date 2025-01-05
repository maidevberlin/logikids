import { Interactive } from '../../../base/Animations'
import { Card } from '../../../base/Card'
import { MultipleChoiceAnswerProps } from './types'
import { styles } from './styles'

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
                : 'default'
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