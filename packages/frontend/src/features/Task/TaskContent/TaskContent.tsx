import { TaskContentProps } from './types'
import { styles } from './styles'
import { MarkdownRenderer } from '../../../components/MarkdownRenderer'

export function TaskContent({ title, description }: TaskContentProps) {
  return (
    <div className={styles.base}>
      <h2 className={styles.title}>
        {title}
      </h2>
      <MarkdownRenderer
        content={description}
        className={styles.description}
        enableMath={true}
        enableMermaid={true}
        enableCode={true}
      />
    </div>
  )
} 