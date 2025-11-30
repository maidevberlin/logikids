import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/common/ui/select'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/app/common/ui/skeleton'

interface NumberInputAnswerProps {
  expectedAnswer: number     // The correct answer (for sizing)
  unit?: string              // Display-only unit
  unitOptions?: string[]     // Unit choices (overrides unit prop)
  selectedAnswer: { value: number | null; unit?: string } | null
  onAnswerSelect: (answer: { value: number | null; unit?: string }) => void
  isLoading?: boolean
  isLocked?: boolean
}

export function NumberInputAnswer({
  expectedAnswer,
  unit,
  unitOptions,
  selectedAnswer,
  onAnswerSelect,
  isLoading = false,
  isLocked = false,
}: NumberInputAnswerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const answer = selectedAnswer || { value: null, unit: unitOptions?.[0] }

  // Calculate width based on expected answer length + 1
  const expectedLength = String(expectedAnswer).length + 1
  const inputWidth = `${expectedLength}ch`

  const handleIncrement = () => {
    if (isLocked) return
    const newValue = (answer.value || 0) + 1
    onAnswerSelect({ ...answer, value: newValue })
  }

  const handleDecrement = () => {
    if (isLocked) return
    const newValue = (answer.value || 0) - 1
    onAnswerSelect({ ...answer, value: newValue })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return

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
  }, [answer.value, isLocked])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty or just minus sign
    if (value === '' || value === '-') {
      onAnswerSelect({ ...answer, value: null })
      return
    }

    const parsed = parseFloat(value)
    if (!isNaN(parsed)) {
      onAnswerSelect({ ...answer, value: parsed })
    }
  }

  const handleUnitChange = (newUnit: string) => {
    if (isLocked) return
    onAnswerSelect({ ...answer, unit: newUnit })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center my-6">
        <Skeleton className="h-24 w-96" />
      </div>
    )
  }

  return (
    <div className="flex justify-center my-6">
      <div ref={containerRef} tabIndex={0} className="space-y-3">
        {/* Number input with chevrons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isLocked}
            className={cn(
              "p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0",
              isLocked && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="flex items-center border-b-2 border-border focus-within:border-primary transition-colors bg-muted/50 px-2">
            <input
              type="text"
              inputMode="decimal"
              value={answer.value !== null ? String(answer.value) : ''}
              onChange={handleInputChange}
              disabled={isLocked}
              style={{ width: inputWidth }}
              className={cn(
                "bg-transparent border-0 outline-none text-4xl text-center py-4 text-foreground placeholder:text-muted-foreground",
                isLocked && "cursor-not-allowed opacity-75"
              )}
              placeholder="0"
            />

            {/* Unit display or selection - seamless on same line */}
            {unitOptions && unitOptions.length > 0 ? (
              <Select
                value={answer.unit || unitOptions[0]}
                onValueChange={handleUnitChange}
                disabled={isLocked}
              >
                <SelectTrigger className="border-0 text-3xl text-muted-foreground px-2 w-auto shadow-none focus:ring-0 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : unit ? (
              <span className="text-3xl text-muted-foreground px-2 shrink-0">
                {unit}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={isLocked}
            className={cn(
              "p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0",
              isLocked && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  )
}
