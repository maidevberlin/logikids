import { useTranslation } from 'react-i18next'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 21) return 'evening'
  return 'night'
}

export function useRandomGreeting(timeOfDay?: TimeOfDay): string {
  const { t } = useTranslation()
  const time = timeOfDay || getTimeOfDay()

  // Get the array of greetings for this time period
  const greetings = t(`greetings.${time}`, { returnObjects: true }) as string[]

  // Return random greeting
  return greetings[Math.floor(Math.random() * greetings.length)]
}
