import { Interactive } from '../../../base/Animations'
import { Card } from '../../../base/Card'
import { SOFT_VARIANTS, SELECTED_VARIANTS } from '../../../base/types'
import { MultipleChoiceAnswerProps } from './types'
import { styles } from './styles'
import { cn } from '../../../../utils/cn'

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
                ? SELECTED_VARIANTS[index % SELECTED_VARIANTS.length]
                : SOFT_VARIANTS[index % SOFT_VARIANTS.length]
            }
          >
            <div 
              className={cn(
                selectedAnswer === index ? styles.option.selected : styles.option.content
              )}
              dangerouslySetInnerHTML={{ __html: option.text }} 
            />
          </Card>
        </Interactive>
      ))}
    </div>
  )
} 