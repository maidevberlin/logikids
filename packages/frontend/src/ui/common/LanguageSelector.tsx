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
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className="flex flex-col items-center gap-2"
        >
          <div
            className={`flex items-center justify-center w-20 h-20 rounded-2xl text-4xl transition-all duration-200 ${
              value === option.value
                ? 'bg-primary/10 shadow-md scale-110 ring-2 ring-primary'
                : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            {option.flag}
          </div>
          <span
            className={`text-sm font-medium transition-colors ${
              value === option.value ? 'text-primary' : 'text-gray-700'
            }`}
          >
            {option.label}
          </span>
        </button>
      ))}
    </div>
  )
}
