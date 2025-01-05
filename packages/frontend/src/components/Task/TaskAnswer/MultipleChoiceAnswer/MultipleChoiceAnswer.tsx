import { Interactive } from '../../../base/Animations'
import { Card } from '../../../base/Card'
import { MultipleChoiceAnswerProps, MultipleChoiceVariant } from './types'
import { styles } from './styles'
import { cn } from '../../../../utils/cn'

const colorVariants: MultipleChoiceVariant[] = ['softBlue', 'softOrange', 'softPurple', 'softTeal']
const selectedVariants: MultipleChoiceVariant[] = ['selectedBlue', 'selectedOrange', 'selectedPurple', 'selectedTeal']

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
                ? selectedVariants[index % selectedVariants.length]
                : colorVariants[index % colorVariants.length]
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