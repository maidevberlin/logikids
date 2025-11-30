import { useTranslation } from 'react-i18next'
import { Card } from '@/app/common/ui/card'
import { GameStats } from './gameTypes'

const SUBJECT_COLORS: Record<string, string> = {
  math: 'bg-blue-500',
  logic: 'bg-purple-500',
  physics: 'bg-emerald-500',
  german: 'bg-red-500',
  music: 'bg-pink-500',
  english: 'bg-yellow-500',
}

interface SubjectSkillBarsProps {
  gameStats: GameStats | undefined
}

export function SubjectSkillBars({ gameStats }: SubjectSkillBarsProps) {
  const { t } = useTranslation('stats')

  // Sort subjects by mastery, then alphabetically
  const subjects = gameStats
    ? Object.entries(gameStats.subjectMastery)
        .sort(([, a], [, b]) => {
          if (b.stars !== a.stars) return b.stars - a.stars
          return 0
        })
        .slice(0, 5) // Top 5 only
    : []

  if (subjects.length === 0) {
    return (
      <Card className="p-8 bg-card shadow-md rounded-2xl">
        <h3 className="text-lg font-medium text-foreground mb-4">
          {t('hero.skills', { defaultValue: 'Skills' })}
        </h3>
        <p className="text-muted-foreground text-center py-8">
          {t('empty.keepPracticing', { defaultValue: 'Complete tasks to level up your skills!' })}
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 bg-card shadow-md rounded-2xl">
      <h3 className="text-lg font-medium text-foreground mb-6">
        {t('hero.skills', { defaultValue: 'Skills' })}
      </h3>

      <div className="space-y-4">
        {subjects.map(([subject, mastery]) => {
          const subjectColor = SUBJECT_COLORS[subject] || 'bg-muted-foreground'

          return (
            <div key={subject} className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-foreground uppercase">
                {t(`subjects.${subject}.label`, { defaultValue: subject })}
              </div>

              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`h-4 flex-1 rounded transition-all duration-300 ${
                      star <= mastery.stars ? subjectColor : 'bg-muted'
                    }`}
                    style={{
                      transitionDelay: `${star * 100}ms`,
                    }}
                  />
                ))}
              </div>

              <div className="w-8 text-sm font-bold text-muted-foreground">{mastery.stars}/5</div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
