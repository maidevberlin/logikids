import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProgress } from '@/data/progress/hooks.ts'
import { generatePracticeRecommendations } from './practice.ts'
import { PageLayout } from '@/app/common/PageLayout'
import { Card } from '@/app/common/ui/card.tsx'
import { Button } from '@/app/common/ui/button.tsx'
import { Target, TrendingUp, Clock, Lightbulb, ArrowRight } from 'lucide-react'
import { trpc } from '@/api/trpc.ts'

export function PracticePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { progress } = useProgress()

  const { data: subjectsData } = trpc.subjects.getAll.useQuery({})

  const subjects = subjectsData?.subjects ?? []

  const recommendations = generatePracticeRecommendations(progress, 5)

  // Helper function to get translated subject name
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId)
    return t(`subjects.${subjectId}.label`, { defaultValue: subject?.name || subjectId })
  }

  // Helper function to get translated concept name
  const getConceptName = (subjectId: string, conceptId: string) => {
    const subject = subjects.find(s => s.id === subjectId)
    const concept = subject?.concepts?.find(c => c.id === conceptId)

    if (!concept) {
      return formatConceptName(conceptId)
    }

    return t(`subjects/${subjectId}:concepts.${conceptId}.name`, {
      defaultValue: concept.name || formatConceptName(conceptId)
    })
  }

  // Helper function to translate practice reasons
  const translateReason = (reason: string) => {
    if (reason === 'Building mastery') {
      return t('practice.reasons.buildingMastery')
    }

    // Parse "Needs work: ..." pattern
    const needsWorkMatch = reason.match(/^Needs work: (.+)$/)
    if (needsWorkMatch) {
      const issuesText = needsWorkMatch[1]

      // Translate individual issues
      const translatedIssues = issuesText
        .replace(/low success rate/g, t('practice.reasons.lowSuccessRate'))
        .replace(/taking too long/g, t('practice.reasons.takingTooLong'))
        .replace(/using many hints/g, t('practice.reasons.usingManyHints'))

      return t('practice.reasons.needsWork', { issues: translatedIssues })
    }

    return reason
  }

  if (recommendations.length === 0) {
    return (
      <PageLayout showBack showHome showGameStats showAccount>
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
          <div className="w-full max-w-2xl text-center space-y-6">
            <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <Target className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t('practice.empty.title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('practice.empty.description')}
            </p>
            <Button onClick={() => navigate('/subjects')} className="mt-4">
              {t('practice.empty.button')}
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showBack showHome showGameStats showAccount>
      <div className="min-h-screen py-12 px-4">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="bg-orange-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <Target className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">{t('practice.title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('practice.subtitle')}
            </p>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card
                key={`${rec.subject}-${rec.conceptId}`}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() =>
                  navigate(
                    `/subjects/${rec.subject}/${rec.conceptId}/tasks?difficulty=${rec.suggestedDifficulty}`
                  )
                }
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Priority Badge */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        rec.priority >= 70
                          ? 'bg-red-500'
                          : rec.priority >= 50
                          ? 'bg-orange-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      #{index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {getSubjectName(rec.subject)} - {getConceptName(rec.subject, rec.conceptId)}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{translateReason(rec.reason)}</p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricBadge
                        icon={<TrendingUp className="w-4 h-4" />}
                        label={t('practice.metrics.success')}
                        value={`${Math.round(rec.metrics.successRate * 100)}%`}
                        color={rec.metrics.successRate >= 0.7 ? 'green' : 'orange'}
                      />
                      <MetricBadge
                        icon={<Clock className="w-4 h-4" />}
                        label={t('practice.metrics.avgTime')}
                        value={formatTime(rec.metrics.avgTimeSeconds)}
                        color="blue"
                      />
                      <MetricBadge
                        icon={<Lightbulb className="w-4 h-4" />}
                        label={t('practice.metrics.hintsPerTask')}
                        value={rec.metrics.hintRate.toFixed(1)}
                        color={rec.metrics.hintRate < 0.5 ? 'green' : 'orange'}
                      />
                      <MetricBadge
                        icon={<Target className="w-4 h-4" />}
                        label={t('practice.metrics.attempts')}
                        value={rec.metrics.totalAttempts.toString()}
                        color="purple"
                      />
                    </div>

                    {/* Difficulty Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t('practice.suggested')}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rec.suggestedDifficulty === 'easy'
                            ? 'bg-green-100 text-green-800'
                            : rec.suggestedDifficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {t(`difficulty.${rec.suggestedDifficulty}`)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Browse All */}
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/subjects')}
              className="text-muted-foreground"
            >
              {t('practice.browseAll')}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

interface MetricBadgeProps {
  icon: React.ReactNode
  label: string
  value: string
  color: 'green' | 'orange' | 'blue' | 'purple'
}

function MetricBadge({ icon, label, value, color }: MetricBadgeProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700'
  }

  return (
    <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  )
}

function formatConceptName(conceptId: string): string {
  return conceptId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
}
