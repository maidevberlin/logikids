import ReactCountryFlag from 'react-country-flag'
import { useRef, useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SelectorButton } from '@/app/common/ui/SelectorButton'
import { Button } from '@/app/common/ui/button'
import { Language, LANGUAGES, SUPPORTED_LANGUAGES } from '@logikids/content/languages'

interface LanguageSelectorProps {
  value: Language
  onChange: (value: Language) => void
  className?: string
}

export function LanguageSelector({ value, onChange, className = '' }: LanguageSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  // Scroll selected language into view on mount
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
    // Small delay to let scroll complete before checking state
    setTimeout(updateScrollState, 100)
  }, [updateScrollState])

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (scrollEl) {
      scrollEl.addEventListener('scroll', updateScrollState)
      window.addEventListener('resize', updateScrollState)
      updateScrollState()
      return () => {
        scrollEl.removeEventListener('scroll', updateScrollState)
        window.removeEventListener('resize', updateScrollState)
      }
    }
  }, [updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Left gradient + chevron */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <button
        type="button"
        onClick={() => scroll('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 transition-all duration-200 text-muted-foreground hover:text-primary ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-12 py-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <div
            key={lang}
            ref={value === lang ? selectedRef : undefined}
            className="flex flex-col items-center gap-2 shrink-0"
          >
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

      {/* Right gradient + chevron */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <button
        type="button"
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 transition-all duration-200 text-muted-foreground hover:text-primary ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight className="h-8 w-8" />
      </button>
    </div>
  )
}
