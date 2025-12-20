# Phase 2: Teacher Auth

## Goal

Enable teacher accounts via invite codes with account type, and add `teacherProcedure` for protected teacher endpoints.

## Prerequisites

- Phase 1 (Backend Restructure) completed

## Database Changes

### Migration: Add account_type and created_by to invite_codes

```sql
-- File: packages/backend/database/migrations/XXX_invite_code_account_type.sql

-- Account type for user role
ALTER TABLE invite_codes ADD COLUMN account_type TEXT DEFAULT 'student';

-- Track which teacher created the invite (NULL for admin-created codes)
ALTER TABLE invite_codes ADD COLUMN created_by TEXT;

-- Add check constraint for valid values
ALTER TABLE invite_codes ADD CONSTRAINT valid_account_type
  CHECK (account_type IN ('student', 'teacher'));

-- Foreign key to user_accounts (teacher who created the invite)
ALTER TABLE invite_codes ADD CONSTRAINT fk_created_by
  FOREIGN KEY (created_by) REFERENCES user_accounts(user_id);

-- Index for filtering by type and creator
CREATE INDEX idx_invite_codes_account_type ON invite_codes(account_type);
CREATE INDEX idx_invite_codes_created_by ON invite_codes(created_by);
```

## Implementation Steps

### Step 1: Update invite code types

**core/auth/types.ts:**

```typescript
export type AccountType = 'student' | 'teacher'

export interface InviteCodeRow {
  code: string
  created_at: number
  expires_at: number
  note: string | null
  used_by: string | null
  used_at: number | null
  account_type: AccountType // Add this
}

export interface JWTPayload {
  userId: string
  inviteCode: string
  accountType: AccountType // Add this
  iat?: number
  exp?: number
}
```

### Step 2: Update auth service

**core/auth/service.ts:**

```typescript
// In register method:
async register(userId: string, inviteCode: string) {
  // ... existing validation ...

  // Get account type from invite code
  const inviteRow = await this.getInviteCode(inviteCode)
  const accountType = inviteRow.account_type

  // Include account type in JWT
  const accessToken = this.generateToken({
    userId,
    inviteCode,
    accountType,
  })

  return { accessToken, account: { ...account, accountType } }
}

// In login method:
async login(userId: string) {
  // ... existing validation ...

  // Look up account type from invite code
  const account = await this.getAccount(userId)
  const inviteRow = await this.getInviteCode(account.invite_code)
  const accountType = inviteRow.account_type

  const accessToken = this.generateToken({
    userId,
    inviteCode: account.invite_code,
    accountType,
  })

  return { accessToken, account: { ...account, accountType } }
}
```

### Step 3: Add teacherProcedure

**trpc.ts:**

```typescript
// Extract account type from JWT in context
export async function createContext({ req }: CreateContextOptions) {
  let userId: string | undefined
  let accountType: AccountType | undefined

  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      userId = decoded.userId
      accountType = decoded.accountType
    } catch (error) {
      // Invalid token
    }
  }

  return { req, userId, accountType }
}

// Student procedure - requires student account
export const studentProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.accountType !== 'student') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Student account required',
    })
  }
  return next({ ctx })
})

// Teacher procedure - requires teacher account
export const teacherProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.accountType !== 'teacher') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Teacher account required',
    })
  }
  return next({ ctx })
})
```

### Step 4: Update invite CLI script

Update the `./invite` script to accept account type:

```bash
./invite create --type teacher --note "Teacher: John Smith"
./invite create --type student --note "Student batch 5"  # default
```

### Step 5: Update student routers (optional)

Consider whether student endpoints should use `studentProcedure` instead of `protectedProcedure`:

- **Strict:** Students can only access student endpoints, teachers only teacher endpoints
- **Permissive:** Teachers can also access student endpoints (for testing/demo)

Recommendation: **Permissive** - teachers might want to see what students see. Use `protectedProcedure` for student endpoints, `teacherProcedure` for teacher-only endpoints.

## API Response Changes

**auth.register and auth.login responses:**

```typescript
{
  accessToken: string
  account: {
    user_id: string
    invite_code: string
    created_at: number
    last_seen: number
    account_type: 'student' | 'teacher' // Add this
  }
}
```

## Frontend Changes

### Update auth context

**AuthContext.tsx:**

```typescript
export interface AuthContextValue {
  isAuthenticated: boolean
  currentUserId: string | null
  accountType: AccountType | null // Add this
  isTeacher: boolean // Convenience helper
  // ... rest
}
```

### Conditional routing

The frontend-student and frontend-teacher apps will be separate, so routing is handled by which app the user loads. But the shared auth logic should expose `accountType` for any conditional rendering.

## Teacher Invite Management

Teachers can create, view, and revoke invite codes for their students.

### New Endpoints

| Endpoint                 | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| `teacher.invites.create` | Create student invite code (sets `created_by` to teacher's userId) |
| `teacher.invites.list`   | List invite codes created by this teacher                          |
| `teacher.invites.revoke` | Mark an invite code as expired (sets `expires_at` to now)          |

### Router Structure

**teacher/invites/router.ts:**

```typescript
import { router, teacherProcedure } from '../../trpc'
import { z } from 'zod'

export const invitesRouter = router({
  create: teacherProcedure
    .input(
      z.object({
        note: z.string().optional(),
        expiresInDays: z.number().min(1).max(365).default(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate code, set created_by = ctx.userId, account_type = 'student'
    }),

  list: teacherProcedure.query(async ({ ctx }) => {
    // Return invite codes WHERE created_by = ctx.userId
    // Include: code, note, created_at, expires_at, used_by, used_at, status
  }),

  revoke: teacherProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify invite was created by this teacher
      // Set expires_at = now
    }),
})
```

### Invite Status Derivation

Status is derived, not stored:

```typescript
function getInviteStatus(invite: InviteCodeRow): 'active' | 'used' | 'expired' {
  if (invite.used_by) return 'used'
  if (invite.expires_at < Date.now()) return 'expired'
  return 'active'
}
```

### Frontend (Teacher Dashboard)

Add invite management section to teacher dashboard:

- List of created invites with status badges
- "Create Invite" button → generates code, shows copy-able link
- "Revoke" button on active invites
- Filter by status (all, active, used, expired)

## Testing

1. Create teacher invite code: `./invite create --type teacher`
2. Register with teacher code → verify JWT contains `accountType: 'teacher'`
3. Call teacher endpoint → should succeed
4. Create student invite code, register → verify `accountType: 'student'`
5. Call teacher endpoint with student token → should get 403
6. Verify existing student accounts still work (migration preserves defaults)
7. **Teacher creates student invite** → verify `created_by` is set
8. **Teacher lists invites** → only sees their own
9. **Teacher revokes invite** → verify student can't register with it

## Rollback Plan

1. Remove migration (ALTER TABLE DROP COLUMN)
2. Revert code changes
3. Existing tokens remain valid but won't have accountType (handle gracefully)
