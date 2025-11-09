import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  label?: string
  className?: string
}

export function NumberInput({ value, onChange, min, max, label, className = '' }: NumberInputProps) {
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

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {label && <label className="text-lg font-semibold text-foreground">{label}</label>}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-16 w-16 rounded-full text-2xl"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-primary text-5xl font-bold text-white shadow-lg">
          {value}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-16 w-16 rounded-full text-2xl"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}
