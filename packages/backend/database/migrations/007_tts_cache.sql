-- Migration: Add tts_cache table
-- Created: 2025-12-06
-- Description: Stores TTS audio cache to avoid redundant API calls

CREATE TABLE IF NOT EXISTS tts_cache (
  id SERIAL PRIMARY KEY,
  text_hash VARCHAR(64) NOT NULL UNIQUE,
  language VARCHAR(10) NOT NULL,
  audio BYTEA NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups by hash
CREATE INDEX IF NOT EXISTS idx_tts_cache_hash ON tts_cache(text_hash);

-- Comments for documentation
COMMENT ON TABLE tts_cache IS 'Caches TTS audio to avoid redundant Google Cloud TTS API calls';
COMMENT ON COLUMN tts_cache.text_hash IS 'SHA256 hash of text + language for cache key';
COMMENT ON COLUMN tts_cache.language IS 'Language code (e.g., de-DE, en-US)';
COMMENT ON COLUMN tts_cache.audio IS 'Audio data in MP3 format';
COMMENT ON COLUMN tts_cache.created_at IS 'Timestamp when cache entry was created';
