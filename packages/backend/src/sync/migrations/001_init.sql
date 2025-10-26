-- Initialize user_sync_data table for encrypted blob storage
-- This file runs automatically on first PostgreSQL startup via docker-entrypoint-initdb.d

CREATE TABLE user_sync_data (
  user_id UUID PRIMARY KEY,
  encrypted_blob TEXT NOT NULL,           -- Base64 encoded encrypted data
  iv VARCHAR(16) NOT NULL,                -- Initialization vector
  timestamp BIGINT NOT NULL,              -- Client timestamp
  checksum VARCHAR(64) NOT NULL,          -- SHA-256 hex
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blob_size INTEGER NOT NULL,             -- Bytes (for monitoring)

  -- Constraints
  CONSTRAINT blob_size_limit CHECK (blob_size <= 1000000),
  CONSTRAINT iv_format CHECK (iv ~ '^[A-Za-z0-9+/]{16}$'),
  CONSTRAINT checksum_format CHECK (checksum ~ '^[a-f0-9]{64}$')
);

-- Index for cleanup queries (find inactive accounts)
CREATE INDEX idx_last_accessed ON user_sync_data(last_accessed);

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'user_sync_data table initialized successfully';
END $$;
