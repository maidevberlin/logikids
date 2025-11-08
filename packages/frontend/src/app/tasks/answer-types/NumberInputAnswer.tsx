import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'

interface NumberInputAnswerProps {
  acceptedUnits?: string[]
  selectedAnswer: { value: number | null; unit?: string } | null
  onAnswerSelect: (answer: { value: number | null; unit?: string }) => void
  isLoading?: boolean
  isLocked?: boolean
}

export function NumberInputAnswer({
  acceptedUnits,
  selectedAnswer,
  onAnswerSelect,
  isLoading = false,
  isLocked = false,
}: NumberInputAnswerProps) {
  const { t } = useTranslation()

  const answer = selectedAnswer || { value: null, unit: acceptedUnits?.[0] }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseFloat(e.target.value)
    onAnswerSelect({ ...answer, value })
  }

  const handleUnitChange = (unit: string) => {
    onAnswerSelect({ ...answer, unit })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center my-6">
        <Skeleton className="h-32 w-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="flex justify-center my-6">
      <Card className="p-8 space-y-4 min-w-96">
        <div className="text-sm text-muted-foreground text-center">
          {t('task.enterNumber')}
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <Input
              type="number"
              inputMode="decimal"
              value={answer.value ?? ''}
              onChange={handleValueChange}
              disabled={isLocked}
              className={cn(
                'h-14 text-xl text-center border-2 rounded-xl',
                isLocked && 'cursor-not-allowed opacity-75',
                answer.value !== null && 'border-blue-400 bg-blue-50'
              )}
              placeholder="0"
              step="any"
            />
          </div>

          {acceptedUnits && acceptedUnits.length > 0 && (
            <div className="w-32">
              <Select
                value={answer.unit || acceptedUnits[0]}
                onValueChange={handleUnitChange}
                disabled={isLocked}
              >
                <SelectTrigger
                  className={cn(
                    'h-14 text-lg border-2 rounded-xl',
                    isLocked && 'cursor-not-allowed opacity-75'
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {acceptedUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {acceptedUnits && acceptedUnits.length > 1 && (
          <div className="text-xs text-muted-foreground text-center">
            {t('task.selectUnit')}
          </div>
        )}
      </Card>
    </div>
  )
}
