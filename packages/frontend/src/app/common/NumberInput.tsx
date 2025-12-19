import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  label?: string
  className?: string
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  label,
  className = '',
}: NumberInputProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault()
        handleIncrement()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault()
        handleDecrement()
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('keydown', handleKeyDown)
      return () => container.removeEventListener('keydown', handleKeyDown)
    }
  }, [value, min, max])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`flex flex-col items-center gap-3 ${className}`}
    >
      {label && <label className="text-lg font-semibold text-foreground">{label}</label>}
      <div className="flex items-center justify-center gap-2 h-28 px-4 rounded-3xl bg-primary text-white shadow-lg">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="transition-opacity hover:opacity-70 disabled:opacity-30"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div className="w-20 text-center text-5xl font-bold">{value}</div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="transition-opacity hover:opacity-70 disabled:opacity-30"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </div>
  )
}
