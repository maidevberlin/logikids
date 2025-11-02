-- Migration: Add revoked column to user_accounts
-- Description: Move revocation tracking from invite_codes to user_accounts
-- Date: 2025-11-02

ALTER TABLE user_accounts
  ADD COLUMN IF NOT EXISTS revoked BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_user_accounts_revoked ON user_accounts(revoked);
