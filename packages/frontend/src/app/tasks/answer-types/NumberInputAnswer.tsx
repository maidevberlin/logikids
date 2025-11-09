import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  const answer = selectedAnswer || { value: null, unit: unitOptions?.[0] }

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
      <div className="space-y-3 min-w-96">
        {/* Number input with chevrons */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isLocked}
            className={cn(
              "p-2 text-gray-600 hover:text-gray-900 transition-colors",
              isLocked && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="flex-1 flex items-center border-b-2 border-gray-300 focus-within:border-primary transition-colors">
            <input
              type="text"
              inputMode="decimal"
              value={answer.value !== null ? String(answer.value) : ''}
              onChange={handleInputChange}
              disabled={isLocked}
              className={cn(
                "flex-1 bg-transparent border-0 outline-none text-4xl text-center py-4 placeholder:text-gray-400",
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
                <SelectTrigger className="border-0 text-3xl text-gray-600 px-2 w-auto shadow-none focus:ring-0">
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
              <span className="text-3xl text-gray-600 px-2">
                {unit}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={isLocked}
            className={cn(
              "p-2 text-gray-600 hover:text-gray-900 transition-colors",
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
