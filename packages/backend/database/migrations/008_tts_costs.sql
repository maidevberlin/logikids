-- Migration: Add tts_costs table
-- Created: 2025-12-12
-- Description: Stores TTS API costs for text-to-speech synthesis

CREATE TABLE IF NOT EXISTS tts_costs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  concept TEXT NOT NULL,
  character_count INTEGER NOT NULL,
  language TEXT NOT NULL,
  voice_type TEXT NOT NULL,
  total_cost DECIMAL(10, 6) NOT NULL,
  cached BOOLEAN NOT NULL DEFAULT false,
  created_at BIGINT NOT NULL
);

-- Index for querying by user
CREATE INDEX IF NOT EXISTS idx_tts_costs_user_id ON tts_costs(user_id);

-- Index for querying by date
CREATE INDEX IF NOT EXISTS idx_tts_costs_created_at ON tts_costs(created_at);

-- Index for querying by subject
CREATE INDEX IF NOT EXISTS idx_tts_costs_subject ON tts_costs(subject);

-- Comments for documentation
COMMENT ON TABLE tts_costs IS 'Tracks TTS API costs for text-to-speech synthesis';
COMMENT ON COLUMN tts_costs.user_id IS 'User ID who requested the TTS';
COMMENT ON COLUMN tts_costs.subject IS 'Subject context of the TTS request';
COMMENT ON COLUMN tts_costs.concept IS 'Concept context of the TTS request';
COMMENT ON COLUMN tts_costs.character_count IS 'Number of characters synthesized';
COMMENT ON COLUMN tts_costs.language IS 'Language code for the voice';
COMMENT ON COLUMN tts_costs.voice_type IS 'Voice type (standard, wavenet, neural2)';
COMMENT ON COLUMN tts_costs.total_cost IS 'Total cost in USD';
COMMENT ON COLUMN tts_costs.cached IS 'Whether the response was served from cache';
COMMENT ON COLUMN tts_costs.created_at IS 'Unix timestamp (ms) when cost was recorded';
