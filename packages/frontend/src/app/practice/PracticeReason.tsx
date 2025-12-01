import { useTranslation } from 'react-i18next'
import { Star, Clock, Lightbulb, Target, AlertCircle } from 'lucide-react'

interface PracticeReasonProps {
  reason: string
}

type ReasonType =
  | 'buildingMastery'
  | 'lowSuccessRate'
  | 'takingTooLong'
  | 'usingManyHints'
  | 'mixed'

interface ReasonConfig {
  type: ReasonType
  icon: React.ReactNode
  colorClass: string
}

const reasonConfigs: Record<ReasonType, Omit<ReasonConfig, 'type'>> = {
  buildingMastery: {
    icon: <Star className="w-4 h-4 fill-current" />,
    colorClass: 'text-green-600',
  },
  lowSuccessRate: {
    icon: <Target className="w-4 h-4" />,
    colorClass: 'text-orange-600',
  },
  takingTooLong: {
    icon: <Clock className="w-4 h-4" />,
    colorClass: 'text-blue-600',
  },
  usingManyHints: {
    icon: <Lightbulb className="w-4 h-4" />,
    colorClass: 'text-yellow-600',
  },
  mixed: {
    icon: <AlertCircle className="w-4 h-4" />,
    colorClass: 'text-orange-600',
  },
}

export function PracticeReason({ reason }: PracticeReasonProps) {
  const { t } = useTranslation()

  const { text, config } = translateAndClassifyReason(reason, t)

  return (
    <p className={`text-sm mt-1 flex items-center gap-1 ${config.colorClass}`}>
      {config.icon}
      {text}
    </p>
  )
}

function translateAndClassifyReason(
  reason: string,
  t: (key: string, options?: Record<string, string>) => string
): { text: string; config: Omit<ReasonConfig, 'type'> } {
  if (reason === 'Building mastery') {
    return {
      text: t('practice.reasons.buildingMastery'),
      config: reasonConfigs.buildingMastery,
    }
  }

  // Parse "Needs work: ..." pattern
  const needsWorkMatch = reason.match(/^Needs work: (.+)$/)
  if (needsWorkMatch) {
    const issuesText = needsWorkMatch[1]

    // Determine the primary issue for icon selection
    const issues = issuesText.split(/,\s*| and /)
    const primaryIssue = issues[0]

    // Translate individual issues
    const translatedIssues = issuesText
      .replace(/low success rate/g, t('practice.reasons.lowSuccessRate'))
      .replace(/taking too long/g, t('practice.reasons.takingTooLong'))
      .replace(/using many hints/g, t('practice.reasons.usingManyHints'))

    const text = t('practice.reasons.needsWork', { issues: translatedIssues })

    // Select icon based on primary issue (or mixed if multiple)
    if (issues.length > 1) {
      return { text, config: reasonConfigs.mixed }
    }

    if (primaryIssue.includes('success rate')) {
      return { text, config: reasonConfigs.lowSuccessRate }
    }
    if (primaryIssue.includes('too long')) {
      return { text, config: reasonConfigs.takingTooLong }
    }
    if (primaryIssue.includes('hints')) {
      return { text, config: reasonConfigs.usingManyHints }
    }

    return { text, config: reasonConfigs.mixed }
  }

  // Fallback for unknown reasons
  return {
    text: reason,
    config: reasonConfigs.mixed,
  }
}
