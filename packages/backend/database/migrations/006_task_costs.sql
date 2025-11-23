-- Migration: Add task_costs table
-- Created: 2025-11-17
-- Description: Stores AI API costs for task generation

CREATE TABLE IF NOT EXISTS task_costs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  concept TEXT NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  total_cost DECIMAL(10, 6) NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

-- Index for querying by user
CREATE INDEX IF NOT EXISTS idx_task_costs_user_id ON task_costs(user_id);

-- Index for querying by date
CREATE INDEX IF NOT EXISTS idx_task_costs_created_at ON task_costs(created_at);

-- Index for querying by subject
CREATE INDEX IF NOT EXISTS idx_task_costs_subject ON task_costs(subject);

-- Comments for documentation
COMMENT ON TABLE task_costs IS 'Tracks AI API costs for task generation';
COMMENT ON COLUMN task_costs.user_id IS 'User ID who requested the task';
COMMENT ON COLUMN task_costs.subject IS 'Subject of the generated task';
COMMENT ON COLUMN task_costs.concept IS 'Concept of the generated task';
COMMENT ON COLUMN task_costs.input_tokens IS 'Number of input tokens used';
COMMENT ON COLUMN task_costs.output_tokens IS 'Number of output tokens used';
COMMENT ON COLUMN task_costs.total_cost IS 'Total cost in USD';
COMMENT ON COLUMN task_costs.provider IS 'AI provider (anthropic, openai)';
COMMENT ON COLUMN task_costs.model IS 'Model used for generation';
COMMENT ON COLUMN task_costs.created_at IS 'Unix timestamp (ms) when cost was recorded';
