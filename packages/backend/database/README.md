# Database Module

PostgreSQL database connection, migrations, and utilities for Logikids backend.

## Structure

```
packages/backend/database/
├── db.ts              # PostgreSQL connection pool
├── migrate.ts         # Migration runner CLI
└── migrations/        # SQL migration files
    ├── 000_schema_migrations.sql
    ├── 001_init.sql
    ├── 002_invite_codes.sql
    ├── 003_user_accounts.sql
    ├── 004_refresh_tokens.sql
    └── 005_add_revoked_to_accounts.sql
```

## Database Connection

```typescript
import { pool } from '../../database/db'

// Query database
const result = await pool.query('SELECT * FROM user_accounts WHERE user_id = $1', [userId])

// Use client for transactions
const client = await pool.connect()
try {
  await client.query('BEGIN')
  await client.query('INSERT INTO ...')
  await client.query('COMMIT')
} finally {
  client.release()
}
```

## Migrations

### Running Migrations

```bash
# Development (inside Docker)
docker compose exec backend-dev bun run migrate

# Production
docker compose exec backend-prod bun run migrate
```

### How Migrations Work

1. **Tracking**: The `schema_migrations` table tracks which migrations have been applied
2. **Ordering**: Migrations run in alphabetical order (use numbered prefixes: `001_`, `002_`)
3. **Idempotent**: All migrations use `IF NOT EXISTS` and can safely run multiple times
4. **Atomic**: Each migration runs in a transaction (rolls back on failure)

### Creating New Migrations

1. Create a new SQL file in `database/migrations/` with the next number:
   ```
   database/migrations/006_add_new_feature.sql
   ```

2. Use idempotent SQL:
   ```sql
   -- Migration: Add new_table
   -- Description: Description of what this migration does
   -- Date: 2025-11-02

   CREATE TABLE IF NOT EXISTS new_table (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL
   );

   CREATE INDEX IF NOT EXISTS idx_new_table_name ON new_table(name);
   ```

3. Run the migration:
   ```bash
   docker compose exec backend-dev bun run migrate
   ```

### Migration Best Practices

1. **Always use IF NOT EXISTS**: Makes migrations idempotent
   ```sql
   CREATE TABLE IF NOT EXISTS ...
   CREATE INDEX IF NOT EXISTS ...
   ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...
   ```

2. **Add comments**: Include migration metadata
   ```sql
   -- Migration: Brief title
   -- Description: What this migration does
   -- Date: YYYY-MM-DD
   ```

3. **Use transactions**: Wrap complex migrations in BEGIN/COMMIT (automatically handled by runner)

4. **Test rollback safety**: Ensure migrations can be re-run without errors

5. **Separate concerns**: One migration per logical change

### First-Time Setup vs. Migrations

The system uses a **dual approach**:

1. **New databases**: Migrations run automatically via `docker-entrypoint-initdb.d` when PostgreSQL starts for the first time
2. **Existing databases**: Use `bun run migrate` to apply new migrations

This ensures:
- Fresh installs get the full schema immediately
- Production deployments can incrementally apply new migrations
- No migration is ever applied twice (tracked in `schema_migrations`)

## Database Schema

### Core Tables

- `schema_migrations` - Tracks applied migrations
- `user_sync_data` - Encrypted user data blobs
- `invite_codes` - Invite codes for registration
- `user_accounts` - User account records
- `refresh_tokens` - JWT refresh tokens

See individual migration files in `database/migrations/` for detailed schemas.

## Connection Configuration

Set via environment variable:

```bash
DATABASE_URL=postgresql://logikids:password@postgres:5432/logikids
```

**Default (dev)**: `postgresql://logikids:development@postgres:5432/logikids`

## Production Deployment

### Before Deployment

1. **Backup database**:
   ```bash
   docker exec logikids-postgres pg_dump -U logikids logikids > backup-$(date +%Y%m%d).sql
   ```

2. **Test migrations** in staging environment

### Deploy Process

1. Deploy new code
2. Run migrations:
   ```bash
   docker compose exec backend-prod bun run migrate
   ```
3. Verify all services are healthy

### Rollback Strategy

If a migration fails:
1. Check error message
2. Fix migration SQL
3. Migration runner automatically uses transactions, so failed migrations are rolled back
4. Re-run `bun run migrate` after fixing

## Development Commands

```bash
# Run migrations
docker compose exec backend-dev bun run migrate

# Check migration status (connect to DB)
docker compose exec postgres psql -U logikids -d logikids -c "SELECT * FROM schema_migrations ORDER BY applied_at;"

# View all tables
docker compose exec postgres psql -U logikids -d logikids -c "\dt"

# Describe table structure
docker compose exec postgres psql -U logikids -d logikids -c "\d user_accounts"
```

## Troubleshooting

### Migration fails with "relation already exists"

This is normal if tables were created by `docker-entrypoint-initdb.d`. The migration runner will now track them properly and skip on subsequent runs.

### How to reset database (DANGER: loses all data)

```bash
docker compose down postgres
docker volume rm logikids_postgres-data
docker compose up postgres -d
docker compose exec backend-dev bun run migrate
```

### Connection refused errors

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Test connection from backend
docker compose exec backend-dev bun -e "import {pool} from './database/db'; const r = await pool.query('SELECT NOW()'); console.log(r.rows[0])"
```

## References

- [PostgreSQL 16 Documentation](https://www.postgresql.org/docs/16/)
- [node-postgres (pg)](https://node-postgres.com/)
- For sync-specific documentation, see `src/sync/README.md`
