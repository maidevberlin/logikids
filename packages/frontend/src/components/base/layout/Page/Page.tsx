import { useLocation } from 'react-router-dom'
import { cn } from '../../../../utils/cn'
import { Header } from '../Header'
import { PageProps } from './types'
import { styles } from './styles'

export function Page({ 
  children, 
  className = '',
  background = 'white',
  navigation
}: PageProps) {
  const location = useLocation()
  const currentRoute = location.pathname.split('/').pop() || 'home'

  return (
    <>
      <Header 
        currentPage={currentRoute}
        navigation={navigation}
      />
      <main className={cn(
        styles.base,
        styles.variants[background],
        className
      )}>
        {children}
      </main>
    </>
  )
} 