import { z } from 'zod'
import { registerSchema, loginSchema, refreshSchema } from './schemas'

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshInput = z.infer<typeof refreshSchema>

export interface UserAccount {
  userId: string
  createdAt: Date
  inviteCode?: string
}

export interface RegisterResponse {
  accessToken: string
  account: UserAccount
}

export interface LoginResponse {
  accessToken: string
  account: UserAccount
}

export interface RefreshResponse {
  accessToken: string
}

export interface VerifyResponse {
  valid: boolean
  userId: string
}
