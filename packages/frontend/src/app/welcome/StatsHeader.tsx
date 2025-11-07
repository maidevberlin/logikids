import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Flame, Star, Sparkles } from 'lucide-react'
import { useWelcomeStats } from './useWelcomeStats'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function StatsHeader() {
  const { t } = useTranslation()
  const { streak, level, achievement } = useWelcomeStats()

  return (
    <Link to="/stats" className="block">
      <div className="bg-gradient-to-r from-primary/5 to-purple-50 border border-gray-200 rounded-2xl py-4 px-6 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
        <TooltipProvider delayDuration={200}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {/* Streak */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{streak}</div>
                    <div className="text-sm text-gray-600">{t('welcome.stats.streak')}</div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('welcome.stats.streakTooltip')}</p>
              </TooltipContent>
            </Tooltip>

            {/* Level */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {level > 0 ? `${level} ${t('welcome.stats.stars')}` : '-'}
                    </div>
                    <div className="text-sm text-gray-600">{t('welcome.stats.level')}</div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('welcome.stats.levelTooltip')}</p>
              </TooltipContent>
            </Tooltip>

            {/* Achievement */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {achievement ? t(achievement) : t('welcome.stats.noAchievement')}
                    </div>
                    <div className="text-sm text-gray-600">{t('welcome.stats.achievement')}</div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('welcome.stats.achievementTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </Link>
  )
}
