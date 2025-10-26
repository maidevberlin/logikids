# PostgreSQL Storage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace file-based JSON storage with PostgreSQL database for encrypted user sync data.

**Architecture:** PostgreSQL runs as separate Docker container. Backend connects via pg connection pool. StorageService interface remains unchanged, internal implementation switches from fs operations to SQL queries.

**Tech Stack:** PostgreSQL 16 Alpine, pg (node-postgres), Docker Compose

---

## Task 1: Add PostgreSQL Dependency

**Files:**
- Modify: `packages/backend/package.json`

**Step 1: Add pg dependency**

```bash
cd packages/backend
docker compose exec backend-dev bun add pg
docker compose exec backend-dev bun add -D @types/pg
```

Expected: Dependencies added to package.json

**Step 2: Verify installation**

```bash
docker compose exec backend-dev bun pm ls | grep pg
```

Expected: Shows pg@^8.x.x and @types/pg@^8.x.x

---

## Task 2: Create Database Schema Migration

**Files:**
- Create: `packages/backend/src/sync/migrations/001_init.sql`

**Step 1: Create migrations directory**

```bash
mkdir -p packages/backend/src/sync/migrations
```

**Step 2: Create schema file**

File: `packages/backend/src/sync/migrations/001_init.sql`

```sql
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
```

**Step 3: Verify file created**

```bash
ls -la packages/backend/src/sync/migrations/
```

Expected: Shows 001_init.sql

---

## Task 3: Create Database Connection Module

**Files:**
- Create: `packages/backend/src/sync/db.ts`

**Step 1: Create database connection module**

File: `packages/backend/src/sync/db.ts`

```typescript
import { Pool } from 'pg'

/**
 * PostgreSQL connection pool for user sync data storage
 *
 * Configuration via DATABASE_URL environment variable:
 * postgresql://user:password@host:port/database
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                    // Maximum 10 connections in pool
  idleTimeoutMillis: 30000,   // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000,  // Fail fast if can't connect in 5 seconds
})

// Log pool errors
pool.on('error', (err) => {
  console.error('[Database] Unexpected pool error:', err)
})

/**
 * Initialize database connection and verify connectivity
 * Throws error if connection fails
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT NOW()')
      console.log('[Database] Connection successful, server time:', result.rows[0].now)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('[Database] Connection failed:', error)
    throw new Error('Failed to connect to PostgreSQL database')
  }
}

/**
 * Close all connections in the pool
 * Call on server shutdown
 */
export async function closeDatabase(): Promise<void> {
  await pool.end()
  console.log('[Database] Connection pool closed')
}
```

**Step 2: Verify file created**

```bash
cat packages/backend/src/sync/db.ts | head -n 20
```

Expected: Shows file content

---

## Task 4: Update StorageService to Use PostgreSQL

**Files:**
- Modify: `packages/backend/src/sync/storage.service.ts`

**Step 1: Backup current implementation**

```bash
cp packages/backend/src/sync/storage.service.ts packages/backend/src/sync/storage.service.ts.backup
```

**Step 2: Replace StorageService implementation**

File: `packages/backend/src/sync/storage.service.ts`

```typescript
import { pool } from './db'
import { SyncRecord, SyncPayload } from './sync.schema'

/**
 * PostgreSQL-based storage for encrypted user data
 * Each user gets a row: user_sync_data table
 *
 * SECURITY NOTE: Database contains encrypted data only.
 * Server cannot decrypt without user's encryption key.
 */
export class StorageService {
  /**
   * Initialize storage (no-op for PostgreSQL, kept for interface compatibility)
   */
  async init(): Promise<void> {
    console.log('[StorageService] Using PostgreSQL storage')
  }

  /**
   * Store or update encrypted user data
   */
  async store(userId: string, payload: SyncPayload): Promise<void> {
    const now = new Date()

    // Get existing record to preserve createdAt
    let createdAt = now
    try {
      const existing = await this.get(userId)
      if (existing) {
        createdAt = existing.createdAt
      }
    } catch {
      // New record, use now as createdAt
    }

    const blobSize = Buffer.from(payload.encryptedBlob, 'base64').length

    // Upsert query (INSERT or UPDATE if exists)
    const query = `
      INSERT INTO user_sync_data (
        user_id, encrypted_blob, iv, timestamp, checksum,
        created_at, last_accessed, blob_size
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) DO UPDATE SET
        encrypted_blob = EXCLUDED.encrypted_blob,
        iv = EXCLUDED.iv,
        timestamp = EXCLUDED.timestamp,
        checksum = EXCLUDED.checksum,
        last_accessed = EXCLUDED.last_accessed,
        blob_size = EXCLUDED.blob_size
    `

    const values = [
      userId,
      payload.encryptedBlob,
      payload.iv,
      payload.timestamp,
      payload.checksum,
      createdAt,
      now,
      blobSize,
    ]

    await pool.query(query, values)
  }

  /**
   * Retrieve encrypted user data
   */
  async get(userId: string): Promise<SyncRecord | null> {
    // Fetch record
    const selectQuery = 'SELECT * FROM user_sync_data WHERE user_id = $1'
    const result = await pool.query(selectQuery, [userId])

    if (result.rows.length === 0) {
      return null // User not found
    }

    const row = result.rows[0]

    // Update last accessed timestamp
    const updateQuery = 'UPDATE user_sync_data SET last_accessed = NOW() WHERE user_id = $1'
    await pool.query(updateQuery, [userId])

    // Map database row to SyncRecord
    return {
      userId: row.user_id,
      encryptedBlob: row.encrypted_blob,
      iv: row.iv,
      timestamp: row.timestamp,
      checksum: row.checksum,
      createdAt: row.created_at,
      lastAccessed: row.last_accessed,
      blobSize: row.blob_size,
    }
  }

  /**
   * Delete user data (GDPR right to erasure)
   */
  async delete(userId: string): Promise<void> {
    const query = 'DELETE FROM user_sync_data WHERE user_id = $1'
    await pool.query(query, [userId])
  }

  /**
   * Check if user exists
   */
  async exists(userId: string): Promise<boolean> {
    const query = 'SELECT 1 FROM user_sync_data WHERE user_id = $1 LIMIT 1'
    const result = await pool.query(query, [userId])
    return result.rows.length > 0
  }

  /**
   * Get all user IDs (for cleanup tasks)
   */
  async getAllUserIds(): Promise<string[]> {
    const query = 'SELECT user_id FROM user_sync_data'
    const result = await pool.query(query)
    return result.rows.map(row => row.user_id)
  }

  /**
   * Delete inactive accounts (GDPR compliance)
   * Deletes accounts not accessed in specified days
   */
  async deleteInactive(inactiveDays: number): Promise<number> {
    const query = `
      DELETE FROM user_sync_data
      WHERE last_accessed < NOW() - INTERVAL '1 day' * $1
    `
    const result = await pool.query(query, [inactiveDays])
    return result.rowCount || 0
  }
}
```

**Step 3: Verify no syntax errors**

```bash
docker compose exec backend-dev bunx tsc --noEmit packages/backend/src/sync/storage.service.ts
```

Expected: No errors

---

## Task 5: Update Docker Compose Configuration

**Files:**
- Modify: `docker-compose.yml`
- Create: `.env.example` (update)

**Step 1: Add PostgreSQL service to docker-compose.yml**

Add this service to `docker-compose.yml` after the existing services:

```yaml
  postgres:
    image: postgres:16-alpine
    container_name: logikids-postgres
    environment:
      POSTGRES_DB: logikids
      POSTGRES_USER: logikids
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-development}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./packages/backend/src/sync/migrations:/docker-entrypoint-initdb.d:ro
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U logikids"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - logikids-network
```

Add volume definition at the bottom of docker-compose.yml:

```yaml
volumes:
  postgres-data:
```

**Step 2: Update backend services to depend on postgres**

Modify `backend-dev` service in docker-compose.yml:

```yaml
  backend-dev:
    # ... existing config ...
    environment:
      NODE_ENV: development
      PORT: 5175
      DATABASE_URL: postgresql://logikids:${POSTGRES_PASSWORD:-development}@postgres:5432/logikids
    depends_on:
      postgres:
        condition: service_healthy
    # ... rest of config ...
```

Modify `backend-prod` service similarly:

```yaml
  backend-prod:
    # ... existing config ...
    environment:
      NODE_ENV: production
      PORT: 5176
      DATABASE_URL: postgresql://logikids:${POSTGRES_PASSWORD:-development}@postgres:5432/logikids
    depends_on:
      postgres:
        condition: service_healthy
    # ... rest of config ...
```

**Step 3: Add network definition if not exists**

At the bottom of docker-compose.yml:

```yaml
networks:
  logikids-network:
    driver: bridge
```

**Step 4: Update .env.example file**

Add to `.env.example`:

```
# PostgreSQL Database
POSTGRES_PASSWORD=change_me_in_production
DATABASE_URL=postgresql://logikids:${POSTGRES_PASSWORD}@postgres:5432/logikids
```

**Step 5: Create local .env file**

```bash
echo "POSTGRES_PASSWORD=development" >> .env
```

**Step 6: Verify docker-compose syntax**

```bash
docker compose config > /dev/null
```

Expected: No errors

---

## Task 6: Initialize Database on Backend Startup

**Files:**
- Modify: `packages/backend/src/index.ts`

**Step 1: Import database initialization**

Add import at top of `packages/backend/src/index.ts`:

```typescript
import { initializeDatabase, closeDatabase } from './sync/db';
```

**Step 2: Initialize database in startup sequence**

Modify the `initializeRegistries` function to include database initialization:

```typescript
async function initializeRegistries() {
  console.log('Initializing registries and database...');
  await Promise.all([
    subjectRegistry.init(),
    taskTypeRegistry.init(),
    initializeDatabase(),  // Add this line
  ]);
  console.log('All registries and database initialized');
}
```

**Step 3: Add graceful shutdown handler**

Add at the bottom of `packages/backend/src/index.ts`, before server start:

```typescript
// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});
```

**Step 4: Verify TypeScript compilation**

```bash
docker compose exec backend-dev bunx tsc --noEmit
```

Expected: No errors

---

## Task 7: Start PostgreSQL and Test Connection

**Files:**
- None (runtime testing)

**Step 1: Stop current backend containers**

```bash
docker compose down
```

Expected: All containers stopped

**Step 2: Start PostgreSQL container**

```bash
docker compose up postgres -d
```

Expected: postgres container starts and becomes healthy

**Step 3: Verify postgres is running**

```bash
docker compose ps postgres
```

Expected: Shows STATUS as "healthy"

**Step 4: Verify schema was created**

```bash
docker compose exec postgres psql -U logikids -d logikids -c "\dt"
```

Expected: Shows `user_sync_data` table

**Step 5: Verify table structure**

```bash
docker compose exec postgres psql -U logikids -d logikids -c "\d user_sync_data"
```

Expected: Shows all columns (user_id, encrypted_blob, iv, timestamp, checksum, created_at, last_accessed, blob_size)

---

## Task 8: Start Backend and Verify Integration

**Files:**
- None (runtime testing)

**Step 1: Start backend in development mode**

```bash
docker compose up backend-dev -d
```

Expected: backend-dev starts successfully

**Step 2: Check backend logs for database connection**

```bash
docker compose logs backend-dev | grep -i database
```

Expected: Shows "[Database] Connection successful"

**Step 3: Test sync upload endpoint**

```bash
curl -X PUT http://localhost:5175/api/sync/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "encryptedBlob": "dGVzdCBibG9iIGRhdGE=",
    "iv": "MTIzNDU2Nzg5MGFi",
    "timestamp": 1698765432000,
    "checksum": "abc123def456abc123def456abc123def456abc123def456abc123def456abcd"
  }'
```

Expected: `{"success":true}`

**Step 4: Verify data was stored in postgres**

```bash
docker compose exec postgres psql -U logikids -d logikids -c "SELECT user_id, blob_size FROM user_sync_data;"
```

Expected: Shows one row with the test user_id

**Step 5: Test sync download endpoint**

```bash
curl http://localhost:5175/api/sync/550e8400-e29b-41d4-a716-446655440000
```

Expected: Returns JSON with encrypted_blob, iv, timestamp, checksum

**Step 6: Test sync delete endpoint**

```bash
curl -X DELETE http://localhost:5175/api/sync/550e8400-e29b-41d4-a716-446655440000
```

Expected: `{"success":true}`

**Step 7: Verify data was deleted**

```bash
docker compose exec postgres psql -U logikids -d logikids -c "SELECT COUNT(*) FROM user_sync_data;"
```

Expected: Shows count = 0

---

## Task 9: Add README Documentation

**Files:**
- Create: `packages/backend/src/sync/README.md`

**Step 1: Create sync module README**

File: `packages/backend/src/sync/README.md`

```markdown
# Sync Module - Encrypted User Data Storage

## Overview

Zero-knowledge encrypted user data synchronization using PostgreSQL backend storage.

## Architecture

- **Database**: PostgreSQL 16 (separate Docker container)
- **Storage**: One table `user_sync_data` for encrypted blobs
- **Security**: All encryption happens client-side, server stores only encrypted data

## Files

- `db.ts` - PostgreSQL connection pool and initialization
- `storage.service.ts` - Storage layer (PostgreSQL implementation)
- `sync.service.ts` - Business logic for sync operations
- `sync.controller.ts` - HTTP endpoints
- `sync.schema.ts` - Zod validation schemas
- `router.ts` - Express router configuration
- `migrations/001_init.sql` - Database schema

## Database Schema

```sql
CREATE TABLE user_sync_data (
  user_id UUID PRIMARY KEY,
  encrypted_blob TEXT NOT NULL,
  iv VARCHAR(16) NOT NULL,
  timestamp BIGINT NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blob_size INTEGER NOT NULL
);
```

## API Endpoints

- `PUT /api/sync/:userId` - Upload encrypted data
- `GET /api/sync/:userId` - Download encrypted data
- `POST /api/sync/:userId/verify` - Check if user exists
- `DELETE /api/sync/:userId` - Delete user data (GDPR)

## Development

### Start services

```bash
docker compose up postgres backend-dev
```

### Access database

```bash
docker compose exec postgres psql -U logikids -d logikids
```

### Backup database

```bash
docker exec logikids-postgres pg_dump -U logikids logikids > backup.sql
```

### Restore database

```bash
cat backup.sql | docker exec -i logikids-postgres psql -U logikids logikids
```

## Testing

### Manual test flow

```bash
# Upload
curl -X PUT http://localhost:5175/api/sync/TEST-USER-ID \
  -H "Content-Type: application/json" \
  -d '{"encryptedBlob":"...","iv":"...","timestamp":123,"checksum":"..."}'

# Download
curl http://localhost:5175/api/sync/TEST-USER-ID

# Delete
curl -X DELETE http://localhost:5175/api/sync/TEST-USER-ID
```

## Security

- Server never has access to encryption keys
- All user data encrypted client-side before upload
- Database contains only encrypted blobs
- No logging of blob contents
- Rate limiting: 100 requests per user per hour

## GDPR Compliance

- Right to erasure: DELETE endpoint
- Automatic cleanup: Accounts inactive for 2+ years deleted
- Data portability: GET endpoint provides all user data
```

**Step 2: Verify README created**

```bash
cat packages/backend/src/sync/README.md | head -n 20
```

Expected: Shows README content

---

## Task 10: Update CLAUDE.md Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update Backend Architecture section**

Replace the Storage section in CLAUDE.md Backend Architecture:

Find and update:

```markdown
**Key Components**:

1. **Task Generation System** (`packages/backend/src/tasks/`)
   ... existing content ...

2. **AI Integration** (`packages/backend/src/common/ai/`)
   ... existing content ...

3. **User Data Sync** (`packages/backend/src/sync/`)
   - `db.ts` - PostgreSQL connection pool
   - `storage.service.ts` - Storage layer with PostgreSQL backend
   - `sync.service.ts` - Business logic for encrypted data sync
   - `sync.controller.ts` - HTTP endpoints (PUT, GET, POST verify, DELETE)
   - `sync.schema.ts` - Zod validation schemas
   - `migrations/001_init.sql` - Database schema initialization
   - Zero-knowledge architecture: Server stores only encrypted blobs
   - Rate limiting: 100 requests per user per hour

4. **API Routes**
```

**Step 2: Update Development Commands section**

Add PostgreSQL commands:

```markdown
### Database Commands

```bash
# Access PostgreSQL
docker compose exec postgres psql -U logikids -d logikids

# View sync data
docker compose exec postgres psql -U logikids -d logikids -c "SELECT user_id, blob_size, last_accessed FROM user_sync_data;"

# Backup database
docker exec logikids-postgres pg_dump -U logikids logikids > backup-$(date +%Y%m%d).sql

# Restore database
cat backup.sql | docker exec -i logikids-postgres psql -U logikids logikids
```
```

**Step 3: Verify changes**

```bash
grep -A 5 "User Data Sync" CLAUDE.md
```

Expected: Shows updated sync section

---

## Task 11: Clean Up Old File Storage (Optional)

**Files:**
- Remove: `packages/backend/data/sync/` directory (optional, can keep as archive)

**Step 1: Archive old sync data**

```bash
mkdir -p packages/backend/data/archive
mv packages/backend/data/sync packages/backend/data/archive/sync-file-storage-$(date +%Y%m%d)
```

**Step 2: Update .gitignore if needed**

Verify `packages/backend/data/` is in .gitignore:

```bash
grep "data/" packages/backend/.gitignore
```

Expected: Should see data/ or similar pattern

---

## Verification Checklist

After completing all tasks, verify:

- [ ] PostgreSQL container runs and is healthy
- [ ] Backend connects to database successfully on startup
- [ ] Upload endpoint stores data in PostgreSQL
- [ ] Download endpoint retrieves data from PostgreSQL
- [ ] Delete endpoint removes data from PostgreSQL
- [ ] Data persists across container restarts
- [ ] TypeScript compilation has no errors
- [ ] All existing sync endpoints work identically
- [ ] README documentation is complete
- [ ] CLAUDE.md is updated

## Success Criteria

- All sync endpoints (PUT, GET, POST verify, DELETE) work correctly
- Data persists in PostgreSQL volume across container restarts
- Backend logs show successful database connection
- No TypeScript errors
- Response times < 100ms for sync operations
- Zero-knowledge architecture maintained (no keys stored)

## Rollback Plan

If issues arise:
1. Restore `storage.service.ts.backup`
2. Remove postgres from docker-compose.yml
3. Restart backend
4. File-based storage resumes working

## Notes

- No unit tests in this plan (existing integration tests will validate functionality)
- Frontend changes handled by separate agent
- No git commits (will be reviewed before committing)
- PostgreSQL data persists in Docker volume `postgres-data`
- Old file-based data can be safely deleted after verifying PostgreSQL works
