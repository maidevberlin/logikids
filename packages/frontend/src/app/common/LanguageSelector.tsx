import ReactCountryFlag from 'react-country-flag'
import { SelectorButton } from '@/app/common/ui/SelectorButton'
import { Language, LANGUAGES, SUPPORTED_LANGUAGES } from '@logikids/content/languages'

interface LanguageSelectorProps {
  value: Language
  onChange: (value: Language) => void
  className?: string
}

export function LanguageSelector({ value, onChange, className = '' }: LanguageSelectorProps) {
  return (
    <div className={`flex justify-center gap-6 ${className}`}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <div key={lang} className="flex flex-col items-center gap-2">
          <SelectorButton
            value={lang}
            isSelected={value === lang}
            onChange={onChange}
            variant="flag"
          >
            <ReactCountryFlag
              countryCode={LANGUAGES[lang].countryCode}
              svg
              style={{ width: '2em', height: '2em' }}
            />
          </SelectorButton>
          <span
            className={`text-sm font-medium transition-colors ${
              value === lang ? 'text-primary' : 'text-foreground'
            }`}
          >
            {LANGUAGES[lang].label}
          </span>
        </div>
      ))}
    </div>
  )
}
