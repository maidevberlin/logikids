// TODO: Generate 50 variations per time period using subagent
// These are placeholder greetings - will be replaced with generated content

export interface TimeBasedGreetings {
  morning: string[]   // 5AM-12PM
  afternoon: string[] // 12PM-6PM
  evening: string[]   // 6PM-9PM
  night: string[]     // 9PM-5AM
}

export const greetings: TimeBasedGreetings = {
  morning: [
    'Good morning! ☀️',
    'Rise and shine! 🌅',
    'Ready to learn? 🌞',
    'Morning, learner! 🌤️',
    'Start your day bright! ⭐',
  ],
  afternoon: [
    'Good afternoon! 🌤️',
    'Time to learn! 📚',
    'Let\'s solve puzzles! 🧩',
    'Ready for challenges? 🎯',
    'Afternoon adventure! 🚀',
  ],
  evening: [
    'Good evening! 🌆',
    'Evening learner! 🌇',
    'Ready for challenges? 🌠',
    'Let\'s think! 🌃',
    'Evening brain time! 🧠',
  ],
  night: [
    'Good night! 🌙',
    'Night owl! 🦉',
    'Still learning? ⭐',
    'Midnight thinker! 🌟',
    'Night study session! 🌛',
  ],
}

export type TimeOfDay = keyof TimeBasedGreetings

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 21) return 'evening'
  return 'night'
}

export function getRandomGreeting(timeOfDay?: TimeOfDay): string {
  const time = timeOfDay || getTimeOfDay()
  const greetingList = greetings[time]
  return greetingList[Math.floor(Math.random() * greetingList.length)]
}
