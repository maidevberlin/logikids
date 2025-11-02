# Sync Module - Encrypted User Data Storage

## Overview

Zero-knowledge encrypted user data synchronization using PostgreSQL backend storage. The server stores only encrypted blobs and has no access to user encryption keys, ensuring complete client-side privacy.

## Architecture

- **Database**: PostgreSQL 16 (separate Docker container)
- **Storage**: Single table `user_sync_data` for encrypted blobs
- **Security**: All encryption happens client-side, server stores only encrypted data
- **Connection**: PostgreSQL connection pool (pg) with max 10 connections
- **Rate Limiting**: 100 requests per user per hour

## Files

- `storage.service.ts` - Storage layer (PostgreSQL implementation)
- `sync.service.ts` - Business logic for sync operations
- `sync.controller.ts` - HTTP endpoints
- `sync.schema.ts` - Zod validation schemas
- `router.ts` - Express router configuration

**Database Connection**: See `database/` module for database connection and migrations.

## Database Schema

```sql
CREATE TABLE user_sync_data (
  user_id UUID PRIMARY KEY,
  encrypted_blob TEXT NOT NULL,           -- Base64 encoded encrypted data
  iv VARCHAR(16) NOT NULL,                -- Initialization vector (12 bytes base64)
  timestamp BIGINT NOT NULL,              -- Client timestamp (epoch ms)
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
```

### Schema Notes

- **user_id**: UUID v4, client-generated, primary key
- **encrypted_blob**: Base64-encoded AES-GCM encrypted data (max 1MB)
- **iv**: Base64-encoded initialization vector (12 bytes = 16 chars)
- **timestamp**: Client-side timestamp for conflict resolution
- **checksum**: SHA-256 hex digest of decrypted data for integrity verification
- **created_at**: Server timestamp of first upload
- **last_accessed**: Server timestamp of last GET request
- **blob_size**: Byte size of decoded blob for monitoring

## API Endpoints

### Upload Encrypted Data

```http
PUT /api/sync/:userId
Content-Type: application/json

{
  "encryptedBlob": "base64-encoded-encrypted-data",
  "iv": "16-char-base64-iv",
  "timestamp": 1698765432000,
  "checksum": "64-char-sha256-hex"
}

Response 200: {"success": true}
Response 400: Validation error
Response 413: Payload too large (max 1MB)
Response 500: Server error
```

### Download Encrypted Data

```http
GET /api/sync/:userId

Response 200:
{
  "encryptedBlob": "base64-encoded-encrypted-data",
  "iv": "16-char-base64-iv",
  "timestamp": 1698765432000,
  "checksum": "64-char-sha256-hex"
}

Response 404: User not found
Response 500: Server error
```

### Verify User Exists

```http
POST /api/sync/:userId/verify

Response 200: {"exists": true|false}
Response 400: Invalid userId
Response 500: Server error
```

### Delete User Data (GDPR)

```http
DELETE /api/sync/:userId

Response 200: {"success": true}
Response 400: Invalid userId
Response 500: Server error
```

## Development Commands

### Start Services

```bash
# Start all services (database + backend)
docker compose up postgres backend-dev

# Or start individually
docker compose up postgres -d
docker compose up backend-dev
```

### Access Database

For database access and management commands, see `database/README.md`.

### Monitoring

```bash
# View all users and their data sizes
docker compose exec postgres psql -U logikids -d logikids -c "
  SELECT user_id, blob_size, created_at, last_accessed
  FROM user_sync_data
  ORDER BY last_accessed DESC;
"

# Find inactive accounts (not accessed in 90 days)
docker compose exec postgres psql -U logikids -d logikids -c "
  SELECT user_id, last_accessed
  FROM user_sync_data
  WHERE last_accessed < NOW() - INTERVAL '90 days';
"

# Database statistics
docker compose exec postgres psql -U logikids -d logikids -c "
  SELECT
    COUNT(*) as total_users,
    SUM(blob_size) as total_bytes,
    AVG(blob_size) as avg_blob_size,
    MAX(blob_size) as max_blob_size
  FROM user_sync_data;
"
```

## Testing

### Manual Test Flow

```bash
# 1. Upload test data
curl -X PUT http://localhost:5175/api/sync/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "encryptedBlob": "dGVzdCBibG9iIGRhdGE=",
    "iv": "MTIzNDU2Nzg5MGFi",
    "timestamp": 1698765432000,
    "checksum": "abc123def456abc123def456abc123def456abc123def456abc123def456abcd"
  }'

# Expected: {"success":true}

# 2. Verify data in database
docker compose exec postgres psql -U logikids -d logikids -c \
  "SELECT user_id, blob_size FROM user_sync_data;"

# Expected: Shows one row with the test UUID

# 3. Download data
curl http://localhost:5175/api/sync/550e8400-e29b-41d4-a716-446655440000

# Expected: Returns the same payload

# 4. Verify user exists
curl -X POST http://localhost:5175/api/sync/550e8400-e29b-41d4-a716-446655440000/verify

# Expected: {"exists":true}

# 5. Delete data
curl -X DELETE http://localhost:5175/api/sync/550e8400-e29b-41d4-a716-446655440000

# Expected: {"success":true}

# 6. Verify deletion
curl http://localhost:5175/api/sync/550e8400-e29b-41d4-a716-446655440000

# Expected: {"error":"User not found"}
```

### Testing Checklist

- [ ] Upload creates new record in database
- [ ] Upload updates existing record (upsert)
- [ ] Download returns correct encrypted data
- [ ] Download updates last_accessed timestamp
- [ ] Verify returns correct existence status
- [ ] Delete removes record from database
- [ ] Validation rejects invalid UUIDs
- [ ] Validation rejects oversized payloads (>1MB)
- [ ] Validation rejects invalid checksum format
- [ ] Validation rejects invalid IV format
- [ ] Rate limiting blocks excessive requests
- [ ] Data persists across container restarts

### Integration Testing

```bash
# Run backend test suite
docker compose run backend-test

# Run specific sync tests (when implemented)
docker compose exec backend-dev bun test sync
```

## Security

### Zero-Knowledge Architecture

- **Client-side encryption**: All user data encrypted in browser before upload
- **Server blind**: Server never has access to encryption keys
- **Encrypted blobs only**: Database contains only encrypted data
- **No logging**: Blob contents never logged (only metadata)
- **Integrity verification**: Checksums validate data integrity client-side

### Rate Limiting

- **100 requests per user per hour** (per endpoint)
- Applied at router level (see `router.ts`)
- Prevents abuse and DoS attacks
- Status code 429 when exceeded

### Constraints

- **Max payload size**: 1MB (enforced at application and database level)
- **UUID validation**: Only valid UUIDs accepted
- **Checksum format**: Must be 64-char SHA-256 hex
- **IV format**: Must be 16-char base64 (12 bytes)

### HTTPS Requirement

- **Production**: MUST use HTTPS to protect encrypted data in transit
- **Development**: HTTP acceptable for localhost testing
- **Never** deploy without TLS/SSL in production

## GDPR Compliance

### Right to Erasure

- DELETE endpoint permanently removes all user data
- No soft deletes - data immediately purged from database
- No backups of deleted data

### Data Portability

- GET endpoint provides all user data in standard JSON format
- User can download and transfer to another service

### Automatic Cleanup

- Inactive accounts (not accessed in 730+ days) automatically deleted
- Cleanup runs daily (see backend cron job)
- Users notified via email before deletion (if email available)

### Data Minimization

- Only essential data stored (encrypted blob + metadata)
- No PII stored by server (UUID is client-generated)
- No tracking of user behavior beyond access timestamps

## Troubleshooting

### Connection and Database Issues

For database troubleshooting, see `database/README.md`.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
  - See `database/README.md` for details

## References

- [Database Module](../database/README.md) - Database connection, migrations, and utilities
- [Zero-Knowledge Encryption Design Doc](../../../docs/plans/zero-knowledge-encryption-design.md)
- [PostgreSQL Implementation Plan](../../../docs/plans/2025-10-26-postgresql-storage-implementation.md)
