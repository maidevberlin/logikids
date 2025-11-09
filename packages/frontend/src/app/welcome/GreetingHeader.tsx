import { useTranslation } from 'react-i18next'
import { useRandomGreeting } from './greetings'

export interface GreetingHeaderProps {
  name: string
}

export function GreetingHeader({ name }: GreetingHeaderProps) {
  const { t } = useTranslation()
  const greeting = useRandomGreeting()

  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
        {greeting}, {name}!
      </h1>
      <p className="text-xl text-muted-foreground">
        {t('welcome.todayPrompt')}
      </p>
    </div>
  )
}
