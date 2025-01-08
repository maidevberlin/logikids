import { SettingsButton } from '../../../Account/Settings/SettingsButton'
import { StatsButton } from '../../../Stats/StatsButton'
import { TaskButton } from '../../../Task/TaskCard/TaskButton'
import { HeaderProps } from './types'
import { styles } from './styles'

export function Header({ 
  navigation
}: HeaderProps) {
  return (
    <header className={styles.base}>
      <div className={styles.content}>
        <div className={styles.left}>
          {navigation}
        </div>
        <div className={styles.right}>
          <TaskButton className={styles.button} />
          <StatsButton className={styles.button} />
          <SettingsButton className={styles.button} />
        </div>
      </div>
    </header>
  )
} 