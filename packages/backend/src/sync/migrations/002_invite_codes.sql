-- Migration: Add invite_codes table
-- Created: 2025-11-01
-- Description: Stores invite codes for registration (one-time use)

CREATE TABLE IF NOT EXISTS invite_codes (
  code TEXT PRIMARY KEY,
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  note TEXT
);

-- Index for checking expired codes
CREATE INDEX IF NOT EXISTS idx_invite_codes_expires_at ON invite_codes(expires_at);

-- Comments for documentation
COMMENT ON TABLE invite_codes IS 'One-time use invite codes for user registration';
COMMENT ON COLUMN invite_codes.code IS 'Unique invite code (uppercase, trimmed)';
COMMENT ON COLUMN invite_codes.created_at IS 'Unix timestamp (ms) when code was created';
COMMENT ON COLUMN invite_codes.expires_at IS 'Unix timestamp (ms) when code expires';
COMMENT ON COLUMN invite_codes.note IS 'Optional note about this code';
