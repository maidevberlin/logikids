import { Skeleton } from '@/app/common/ui/skeleton'

export interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="space-y-2 w-full max-w-md">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-12 w-5/6" />
      </div>
      {message && (
        <p className="text-sm text-muted-foreground mt-4">{message}</p>
      )}
    </div>
  )
}
