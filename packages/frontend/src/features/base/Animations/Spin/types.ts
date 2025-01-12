import { ReactNode } from 'react'

export interface SpinProps {
  children: ReactNode
  isSpinning?: boolean
  duration?: number
  className?: string
}

export type UseSpinReturn = [boolean, () => void, () => void] 