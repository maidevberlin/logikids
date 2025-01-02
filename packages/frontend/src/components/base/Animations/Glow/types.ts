import { ReactNode } from 'react'

export interface GlowProps {
  children: ReactNode
  isGlowing?: boolean
  className?: string
  glowColor?: string
}

export type UseGlowReturn = [boolean, () => void, () => void] 