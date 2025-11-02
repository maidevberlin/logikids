export interface GameStats {
  version: 1

  streaks: {
    currentDays: number
    bestDays: number
    lastActiveDate: string  // ISO date string (UTC)
  }

  perfectRun: {
    current: number
    allTimeBest: number
  }

  weekly: {
    noHintTasks: number
    weekStart: string  // ISO date of Monday
  }

  personalBests: {
    successRate: number
  }

  achievements: {
    [achievementId: string]: {
      unlocked: boolean
      date?: string  // ISO timestamp
    }
  }

  subjectMastery: {
    [subject: string]: {
      stars: number  // 0-5
      lastCalculated: string  // ISO timestamp
    }
  }
}

export function createDefaultGameStats(): GameStats {
  return {
    version: 1,
    streaks: {
      currentDays: 0,
      bestDays: 0,
      lastActiveDate: ''
    },
    perfectRun: {
      current: 0,
      allTimeBest: 0
    },
    weekly: {
      noHintTasks: 0,
      weekStart: getMonday(new Date()).toISOString().split('T')[0]
    },
    personalBests: {
      successRate: 0
    },
    achievements: {},
    subjectMastery: {}
  }
}

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d
}
