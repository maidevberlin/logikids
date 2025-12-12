// Input types are defined in schemas.ts using z.infer
export type { RegisterInput, LoginInput, RefreshInput } from './schemas'

// JWT payload structure
export interface JWTPayload {
  userId: string
  inviteCode: string
  iat?: number
  exp?: number
}

// Database row type (snake_case fields from DB)
export interface UserAccountRow {
  user_id: string
  invite_code: string
  created_at: number
  last_seen: number
}

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
