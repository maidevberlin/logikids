import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { Button } from '../base/Button/Button'
import { Shake } from '../base/Animations'
import { flex } from '../base/styles'

interface HintButtonProps {
  onClick: () => void
  disabled: boolean
  shouldShake: boolean
  isFirstHint: boolean
}

export function HintButton({ 
  onClick, 
  disabled,
  shouldShake,
  isFirstHint
}: HintButtonProps) {
  const { t } = useTranslation()

  return (
    <motion.div 
      animate={{ scale: shouldShake ? 1.05 : 1 }} 
      className={shouldShake ? 'animate-shake' : ''}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="primary"
      >
        <span className="inline-flex items-center gap-2">
          <LightBulbIcon className="h-5 w-5" />
          {isFirstHint ? t('task.getHint') : t('task.getAnotherHint')}
        </span>
      </Button>
    </motion.div>
  )
} 