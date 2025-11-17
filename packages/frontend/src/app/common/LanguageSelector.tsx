import { SelectorButton } from '@/components/ui/SelectorButton'

interface LanguageOption {
  value: string
  label: string
  flag: string
}

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function LanguageSelector({ value, onChange, className = '' }: LanguageSelectorProps) {
  const languageOptions: LanguageOption[] = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ]

  return (
    <div className={`flex justify-center gap-6 ${className}`}>
      {languageOptions.map((option) => (
        <div key={option.value} className="flex flex-col items-center gap-2">
          <SelectorButton
            value={option.value}
            isSelected={value === option.value}
            onChange={onChange}
            variant="flag"
          >
            {option.flag}
          </SelectorButton>
          <span
            className={`text-sm font-medium transition-colors ${
              value === option.value ? 'text-primary' : 'text-foreground'
            }`}
          >
            {option.label}
          </span>
        </div>
      ))}
    </div>
  )
}
