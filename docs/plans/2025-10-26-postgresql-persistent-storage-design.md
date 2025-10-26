# PostgreSQL Persistent Storage for Encrypted User Data

**Date:** 2025-10-26
**Status:** Design Approved
**Author:** Claude Code

## Overview

Replace file-based JSON storage with PostgreSQL for encrypted user sync data. This provides production-ready persistence while maintaining the existing zero-knowledge architecture.

## Requirements

### Primary Goals
- **Production readiness**: Move from file-based storage to industry-standard database
- **Strong persistence**: Bulletproof data durability guarantees
- **Simple operations**: Key-value access pattern (getById only)
- **Zero-knowledge preservation**: Continue storing only encrypted blobs without decryption keys

### Constraints
- Deployment: Docker Compose (separate DB container)
- Scale: Small (<1,000 users) in next 1-2 years
- No migration: Clean cut deployment, no need to preserve existing file data
- Keep existing API: StorageService interface unchanged

## Architecture

### System Overview

PostgreSQL database runs as separate container in Docker Compose alongside backend. Backend connects via internal Docker network using connection pooling. Data persists in named Docker volume.

**Connection Flow:**
```
Frontend → Backend API → StorageService → pg.Pool → PostgreSQL Container → postgres-data Volume
```

### Zero-Knowledge Guarantee

Database stores only encrypted blobs (base64 strings). No decryption happens server-side. Server cannot access user data without client-side encryption keys. Same zero-knowledge guarantee as current file system.

## Database Schema

### Table: `user_sync_data`

```sql
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
  CONSTRAINT blob_size_limit CHECK (blob_size <= 1000000),  -- 1MB max
  CONSTRAINT iv_format CHECK (iv ~ '^[A-Za-z0-9+/]{16}$'),
  CONSTRAINT checksum_format CHECK (checksum ~ '^[a-f0-9]{64}$')
);

-- Index for cleanup queries (find inactive accounts)
CREATE INDEX idx_last_accessed ON user_sync_data(last_accessed);
```

### Design Rationale

- **TEXT for encrypted_blob**: Efficiently handles large base64 strings
- **TIMESTAMPTZ**: Timezone-aware timestamps (important for global app)
- **CHECK constraints**: Enforce data integrity at database level
- **Index on last_accessed**: Optimizes GDPR cleanup queries
- **No foreign keys**: Simple key-value store, no complex relationships

### Capacity Planning

At 1,000 users with 1MB max per user = ~1GB maximum database size. PostgreSQL handles this trivially. Room for 10x growth without performance concerns.

## Implementation

### StorageService Adaptation

Current `StorageService` interface remains identical - same public methods:
- `store(userId, payload)`
- `get(userId)`
- `delete(userId)`
- `exists(userId)`
- `getAllUserIds()`
- `deleteInactive(inactiveDays)`

Internal implementation switches from file I/O to SQL queries:

```typescript
// Current: await fs.writeFile(filePath, JSON.stringify(record))
// Becomes: await pool.query('INSERT INTO user_sync_data ... ON CONFLICT (user_id) DO UPDATE ...')

// Current: await fs.readFile(filePath)
// Becomes: await pool.query('SELECT * FROM user_sync_data WHERE user_id = $1')
```

No changes needed in `SyncService` or `SyncController` - they use the same `StorageService` interface.

### Connection Management

Create new `packages/backend/src/sync/db.ts` module:

```typescript
import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                    // 10 connections (plenty for small scale)
  idleTimeoutMillis: 30000,   // 30 second idle timeout
})

// Health check on startup
export async function initializeDatabase(): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query('SELECT 1')
    console.log('[Database] Connection successful')
  } finally {
    client.release()
  }
}
```

### Error Handling

Map PostgreSQL errors to existing behavior:
- **Not found** (no rows returned) → return `null` (same as ENOENT file error)
- **Connection errors** → throw with clear message
- **Constraint violations** → validation error response

### Transaction Usage

Not needed for simple key-value operations. Single-statement operations are atomic by default in PostgreSQL.

## Docker Compose Setup

### New PostgreSQL Service

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: logikids-postgres
    environment:
      POSTGRES_DB: logikids
      POSTGRES_USER: logikids
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-development}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./packages/backend/src/sync/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U logikids"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

**Key Features:**
- Alpine image (lightweight)
- Named volume `postgres-data` for persistence
- `migrations` folder mounted to `/docker-entrypoint-initdb.d` - runs schema on first startup
- Health check ensures DB ready before backend connects
- Password from environment variable (`.env` file)

### Backend Configuration

Update backend service in docker-compose.yml:

```yaml
backend-dev:
  environment:
    DATABASE_URL: postgresql://logikids:${POSTGRES_PASSWORD:-development}@postgres:5432/logikids
  depends_on:
    postgres:
      condition: service_healthy
```

### Environment Variables

Add to `.env` file:

```
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://logikids:${POSTGRES_PASSWORD}@postgres:5432/logikids
```

## Deployment Strategy

### Clean Cut Deployment

**No migration needed.** Simply switch from file-based to PostgreSQL. Existing users will re-sync their data.

**Deployment Steps:**
1. Add postgres service to docker-compose.yml
2. Update backend StorageService to use PostgreSQL
3. Create migration SQL file in `packages/backend/src/sync/migrations/001_init.sql`
4. Deploy new version with `docker compose up --build`
5. Verify postgres is working
6. Delete old `data/sync/` directory (optional)

**User Impact:**

Users with existing synced data will see "no data found" and will re-upload. Since this is zero-knowledge encryption, they already have their data locally and can re-sync instantly. Acceptable for early-stage product.

**No Rollback Needed:**

Clean cut deployment means no rollback complexity. If issues arise, fix forward.

## Backup Strategy

### Manual Backups

```bash
# Backup database to SQL file
docker exec logikids-postgres pg_dump -U logikids logikids > backup-$(date +%Y%m%d).sql

# Restore from backup
cat backup-20251026.sql | docker exec -i logikids-postgres psql -U logikids logikids
```

### Automated Backups

Add to cron or scheduled task:
```bash
0 2 * * * /path/to/backup.sh  # Daily at 2 AM
```

### Docker Volume Backup

```bash
# Backup volume
docker run --rm -v logikids_postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-data-backup.tar.gz /data

# Restore volume
docker run --rm -v logikids_postgres-data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-data-backup.tar.gz -C /
```

## Testing Strategy

### Unit Tests

Update `StorageService` tests to use PostgreSQL test database:
- Use `testcontainers` or separate test database
- Test all CRUD operations
- Test constraint violations
- Test connection error handling

### Integration Tests

Test complete sync flow:
- Upload encrypted blob → verify stored in PostgreSQL
- Download blob → verify checksum matches
- Delete user → verify removed from database
- Cleanup inactive accounts → verify correct users deleted

### Manual Testing Checklist

- [ ] Upload data via frontend
- [ ] Verify data in postgres: `docker exec -it logikids-postgres psql -U logikids -c "SELECT user_id, blob_size FROM user_sync_data;"`
- [ ] Download data on second device (QR pairing)
- [ ] Delete account via frontend
- [ ] Verify deleted in postgres
- [ ] Restart containers → verify data persists

## Security Considerations

### Database Security

- **Connection string**: Stored in environment variable, not committed to git
- **Password strength**: Enforce strong password for production
- **Network isolation**: PostgreSQL only accessible via Docker internal network (port 5432 not exposed in production)
- **No query injection**: Use parameterized queries exclusively

### Data Security

- **Encryption**: All user data encrypted client-side before reaching server
- **No keys stored**: Server has no access to encryption keys
- **Transport security**: HTTPS for API communication (handled at reverse proxy level)
- **GDPR compliance**: DELETE endpoint for right to erasure

## Monitoring & Observability

### Health Checks

- PostgreSQL health check via `pg_isready`
- Backend startup verifies DB connection
- Log all connection errors

### Metrics to Monitor

- Database connection pool usage
- Query performance (should be <10ms for key-value lookups)
- Storage size growth
- Failed connection attempts

### Logging

- Log all storage operations (store, get, delete)
- Log connection pool events
- Log constraint violations
- No logging of encrypted blob contents (PII)

## Future Considerations

### If Scale Increases

- **Connection pooling**: Current 10 connections sufficient, can increase if needed
- **Read replicas**: Add if read traffic increases significantly
- **Partitioning**: Partition by user_id if table grows beyond millions of rows
- **Monitoring**: Add pgAdmin or other PostgreSQL monitoring tools

### Additional Features

- **Backup automation**: Implement automated backup service
- **Point-in-time recovery**: Enable WAL archiving if needed
- **Multi-region**: Add read replicas in other regions if user base globalizes

## Success Criteria

- [ ] PostgreSQL container runs successfully in Docker Compose
- [ ] All existing sync endpoints work identically (upload, download, verify, delete)
- [ ] Data persists across container restarts
- [ ] Performance <10ms for key-value operations
- [ ] Zero-knowledge guarantee maintained (no keys stored server-side)
- [ ] Backup process documented and tested
- [ ] No user complaints after deployment

## References

- Current implementation: `packages/backend/src/sync/`
- PostgreSQL Docker image: https://hub.docker.com/_/postgres
- `pg` library documentation: https://node-postgres.com/
- Zero-knowledge encryption design: `docs/plans/2025-10-26-zero-knowledge-encryption-design.md`
