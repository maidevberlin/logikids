import { TaskContentProps } from './types'
import { styles } from './styles'

export function TaskContent({ title, description }: TaskContentProps) {
  return (
    <div className={styles.base}>
      <h2 className={styles.title}>
        {title}
      </h2>
      <div 
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  )
} 