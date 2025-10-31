# Invite Code System

LogiKids uses an invite-only system during the closed beta phase to ensure quality control and parental verification.

## How It Works

1. **Admin generates invite codes** using the CLI tool
2. **Codes are shared** with trusted parents via secure channels
3. **Parents enter code** during onboarding
4. **Code is validated** against the database
5. **Code is marked as used** (one-time use)
6. **Codes expire** after 7 days if unused

## CLI Usage

Run commands inside the backend Docker container:

```bash
# List all invite codes
docker compose exec backend-dev bun run src/cli/invite-codes.ts list

# Create new invite code (with optional note)
docker compose exec backend-dev bun run src/cli/invite-codes.ts create "For Maria's family"

# Remove invite code
docker compose exec backend-dev bun run src/cli/invite-codes.ts remove ABCD-1234
```

## Code Format

- **8 characters**: Easy to type and remember
- **Formatted**: XXXX-XXXX (e.g., `AB3D-KL89`)
- **Alphabet**: No confusing characters (no 0, O, I, 1)
- **Case-insensitive**: Works in both uppercase and lowercase

## Database

Codes are stored in SQLite database at `packages/backend/data/invite-codes.db`

**Schema:**
```sql
CREATE TABLE invite_codes (
  code TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,           -- NULL if unused, timestamp if used
  note TEXT                  -- Optional admin note
)
```

## API Endpoints

### POST /api/invite/validate
Validate and mark invite code as used (one-time operation).

**Request:**
```json
{
  "code": "ABCD-1234"
}
```

**Response (success):**
```json
{
  "valid": true
}
```

**Response (error):**
```json
{
  "valid": false,
  "error": "Code already used" | "Code expired" | "Code not found"
}
```

### POST /api/invite/check
Check if code is valid without marking as used (preview only).

**Request:**
```json
{
  "code": "ABCD-1234"
}
```

**Response:**
```json
{
  "valid": true | false,
  "reason": "..." // Only if invalid
}
```

## Security Features

1. **One-time use**: Code becomes invalid after first successful use
2. **Time-limited**: 7-day expiration from creation
3. **No brute force**: Codes are long enough to prevent guessing
4. **Server-side validation**: Cannot be bypassed client-side
5. **Admin tracking**: Notes allow tracking who received which code

## Production Deployment

The invite database persists in Docker volume. To backup codes:

```bash
# Backup
docker compose exec backend-dev cat data/invite-codes.db > backup-invite-codes.db

# Restore
docker compose exec -T backend-dev sh -c 'cat > data/invite-codes.db' < backup-invite-codes.db
```

## Future: Transition to Public

When ready to go public, simply:
1. Remove invite code validation from `ParentalConsentStep.tsx`
2. Remove `/api/invite` routes from backend
3. Keep the database for historical records
