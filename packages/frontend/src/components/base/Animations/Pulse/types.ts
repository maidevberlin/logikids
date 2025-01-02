import { ReactNode } from 'react'

export interface PulseProps {
  children: ReactNode
  isPulsing?: boolean
  scale?: number
  className?: string
}

export type UsePulseReturn = [boolean, () => void] 