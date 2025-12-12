import { createContext, useContext, useCallback, useRef, ReactNode } from 'react'
import type { TTSUsage } from '@/app/common/useTTS'

interface TTSCostContextValue {
  reportCost: (usage: TTSUsage) => void
}

const TTSCostContext = createContext<TTSCostContextValue | null>(null)

interface TTSCostProviderProps {
  children: ReactNode
  onCostReceived?: (usage: TTSUsage) => void
}

/**
 * Provider for TTS cost tracking
 *
 * Wraps components that use PlayButton and collects TTS costs.
 * Reports costs to the provided callback.
 */
export function TTSCostProvider({ children, onCostReceived }: TTSCostProviderProps) {
  const callbackRef = useRef(onCostReceived)
  callbackRef.current = onCostReceived

  const reportCost = useCallback((usage: TTSUsage) => {
    if (callbackRef.current) {
      callbackRef.current(usage)
    }
  }, [])

  return <TTSCostContext.Provider value={{ reportCost }}>{children}</TTSCostContext.Provider>
}

/**
 * Hook to access TTS cost reporting
 */
export function useTTSCostReporter(): ((usage: TTSUsage) => void) | undefined {
  const context = useContext(TTSCostContext)
  return context?.reportCost
}
