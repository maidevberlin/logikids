import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface NumberInputAnswerProps {
  unit?: string              // Display-only unit
  unitOptions?: string[]     // Unit choices (overrides unit prop)
  selectedAnswer: { value: number | null; unit?: string } | null
  onAnswerSelect: (answer: { value: number | null; unit?: string }) => void
  isLoading?: boolean
  isLocked?: boolean
}

export function NumberInputAnswer({
  unit,
  unitOptions,
  selectedAnswer,
  onAnswerSelect,
  isLoading = false,
  isLocked = false,
}: NumberInputAnswerProps) {
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const answer = selectedAnswer || { value: null, unit: unitOptions?.[0] }
  const displayValue = answer.value !== null ? answer.value : ''

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

  const handleNumberClick = () => {
    if (isLocked) return
    setIsEditing(true)
    setInputValue(answer.value !== null ? String(answer.value) : '')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    setIsEditing(false)

    // Validate and parse the input
    const trimmed = inputValue.trim()
    if (trimmed === '' || trimmed === '-') {
      onAnswerSelect({ ...answer, value: null })
      return
    }

    const parsed = parseFloat(trimmed)
    if (!isNaN(parsed)) {
      onAnswerSelect({ ...answer, value: parsed })
    } else {
      // Invalid input - reset to current value
      setInputValue(answer.value !== null ? String(answer.value) : '')
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  const handleUnitChange = (newUnit: string) => {
    if (isLocked) return
    onAnswerSelect({ ...answer, unit: newUnit })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center my-6">
        <Skeleton className="h-64 w-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="flex justify-center my-6">
      <Card className="p-8 rounded-2xl shadow-md">
        <div className="flex flex-col items-center gap-6">
          {/* Number stepper with editable center */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={isLocked}
              className={cn(
                'h-16 w-16 rounded-full text-2xl border-gray-300 hover:border-gray-400',
                isLocked && 'cursor-not-allowed opacity-50'
              )}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {isEditing ? (
              <input
                type="text"
                inputMode="decimal"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                autoFocus
                className="h-28 w-28 rounded-3xl bg-primary text-5xl font-bold text-white text-center shadow-lg outline-none focus:ring-4 focus:ring-primary/50"
              />
            ) : (
              <div
                onClick={handleNumberClick}
                className={cn(
                  'flex h-28 w-28 items-center justify-center rounded-3xl bg-primary text-5xl font-bold text-white shadow-lg',
                  !isLocked && 'cursor-pointer hover:bg-primary/90 transition-colors'
                )}
              >
                {displayValue}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={isLocked}
              className={cn(
                'h-16 w-16 rounded-full text-2xl border-gray-300 hover:border-gray-400',
                isLocked && 'cursor-not-allowed opacity-50'
              )}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Unit display/selection */}
          {unitOptions && unitOptions.length > 0 ? (
            // Mode 3: Unit selection dropdown
            <div className="w-28">
              <Select
                value={answer.unit || unitOptions[0]}
                onValueChange={handleUnitChange}
                disabled={isLocked}
              >
                <SelectTrigger
                  className={cn(
                    'h-12 text-lg border-2 rounded-xl',
                    isLocked && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((unitOption) => (
                    <SelectItem key={unitOption} value={unitOption}>
                      {unitOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : unit ? (
            // Mode 2: Display-only unit
            <div className="text-lg font-semibold text-gray-700">
              {unit}
            </div>
          ) : null}
          {/* Mode 1: No unit - nothing shown */}
        </div>
      </Card>
    </div>
  )
}
