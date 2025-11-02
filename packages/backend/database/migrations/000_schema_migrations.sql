-- Create schema_migrations table to track applied migrations
-- This table allows the migration runner to know which migrations have been applied

CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  migration_name VARCHAR(255) NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_migration_name ON schema_migrations(migration_name);

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'schema_migrations table initialized successfully';
END $$;
