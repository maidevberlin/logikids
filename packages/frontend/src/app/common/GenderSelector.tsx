import { useTranslation } from 'react-i18next'
import { Mars, Venus, ShieldQuestion } from 'lucide-react'
import { SelectorButton } from '@/components/ui/SelectorButton'

interface GenderOption {
  value: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

interface GenderSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

// Custom icon component for non-binary (overlaid Mars + Venus)
const NonBinaryIcon = ({ className }: { className?: string }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    <Mars className={`absolute ${className}`} style={{ transform: 'translate(2px, -4px)' }} />
    <Venus className={`absolute ${className}`} style={{ transform: 'translate(-1px, 3px)' }} />
  </div>
)

export function GenderSelector({ value, onChange, className = '' }: GenderSelectorProps) {
  const { t } = useTranslation('profile')

  const genderOptions: GenderOption[] = [
    { value: 'male', icon: Mars, label: t('settings.gender.options.male') },
    { value: 'female', icon: Venus, label: t('settings.gender.options.female') },
    { value: 'non-binary', icon: NonBinaryIcon, label: t('settings.gender.options.non-binary') },
    { value: 'prefer-not-to-say', icon: ShieldQuestion, label: t('settings.gender.options.prefer-not-to-say') },
  ]

  return (
    <div className={`flex justify-center gap-6 ${className}`}>
      {genderOptions.map((option) => {
        const Icon = option.icon
        return (
          <div key={option.value} className="flex flex-col items-center gap-2">
            <SelectorButton
              value={option.value}
              isSelected={value === option.value}
              onChange={onChange}
              variant="icon"
            >
              <Icon className="w-8 h-8" />
            </SelectorButton>
            <span className="text-xs text-foreground text-center max-w-[80px]">
              {option.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
