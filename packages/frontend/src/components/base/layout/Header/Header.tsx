import { SettingsButton } from '../../../Settings/SettingsButton'
import logoUrl from '../../../../assets/logo.svg'
import { styles } from './styles'

export function Header() {
  return (
    <header className={styles.base}>
      <img src={logoUrl} alt="Logo" className={styles.logo} />
      <SettingsButton />
    </header>
  )
} 