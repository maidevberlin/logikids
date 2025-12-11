// Database row type (snake_case fields from DB)
export interface InviteCode {
  code: string
  created_at: number
  expires_at: number
  note: string | null
  used_by: string | null
  used_at: number | null
}
