# Zero-Knowledge Encryption & Cross-Device Sync Design

**Date**: 2025-10-26
**Status**: Design Approved
**Author**: Security Architecture Design Session

## Executive Summary

This design implements a zero-knowledge encryption architecture for Logikids that protects children's data with end-to-end encryption. The server stores encrypted user data but cryptographically cannot decrypt it, ensuring privacy even in the event of server compromise, legal requests, or administrative access.

**Key Features**:
- End-to-end encryption (AES-256-GCM)
- QR code device pairing for seamless multi-device sync
- Optional recovery kit for disaster recovery
- GDPR & COPPA compliant by design
- Import/export for data portability
- Last-write-wins synchronization strategy

## Requirements & Constraints

### Security Requirements
- **Zero-knowledge architecture**: Server cannot decrypt user data under any circumstances
- **Maximum privacy**: Protect against curious admins, data breaches, government requests
- **GDPR compliance**: Data minimization, right to erasure, data portability
- **COPPA compliance**: Children under 13, no personal info collection, no tracking
- **High security standards**: Cryptographic best practices throughout

### User Experience Requirements
- **Multi-device sync**: Children use multiple devices (school, home, mobile)
- **Simple onboarding**: Just name + age (no email, no passwords)
- **Kid-friendly pairing**: QR code scanning for adding devices
- **Data loss prevention**: Optional recovery kit, import/export capability
- **Online-only**: App requires internet connection (task generation needs AI backend)

### Target Users
- **Age**: 8-16 years old
- **Technical skill**: Cannot handle complex recovery procedures
- **Parental engagement**: Parents may not be actively involved
- **Usage pattern**: Multiple devices common, single user per device

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Device 1                       │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  localStorage  │  │  IndexedDB   │  │  Crypto Service │ │
│  │  (unencrypted) │  │ (encryption  │  │   (AES-256-GCM) │ │
│  │   user data    │  │     key)     │  │                 │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
│           │                  │                   │          │
│           └──────────────────┴───────────────────┘          │
│                              │                              │
│                    ┌─────────▼────────┐                     │
│                    │  Sync Service    │                     │
│                    │  (on focus/blur) │                     │
│                    └─────────┬────────┘                     │
└──────────────────────────────┼──────────────────────────────┘
                               │
                      HTTPS (encrypted)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     Backend Server                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Encrypted Blob Storage (Redis/Postgres)      │   │
│  │                                                       │   │
│  │  userId (UUID) → {                                   │   │
│  │    encryptedBlob: "AqP8x...",  ← Server cannot decrypt│  │
│  │    iv: "Kj9s...",                                    │   │
│  │    timestamp: 1234567890,                            │   │
│  │    checksum: "sha256..."                             │   │
│  │  }                                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                               │
                      HTTPS (encrypted)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                        Client Device 2                       │
│                    (paired via QR code)                      │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  localStorage  │  │  IndexedDB   │  │  Crypto Service │ │
│  │  (unencrypted) │  │ (encryption  │  │   (AES-256-GCM) │ │
│  │   user data    │  │     key)     │  │                 │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Cryptography Details

### Encryption Standard

**Algorithm**: AES-256-GCM (Advanced Encryption Standard, Galois/Counter Mode)
- **Key Size**: 256 bits (32 bytes)
- **Authentication**: GCM provides authenticated encryption (AEAD)
- **IV Generation**: Cryptographically random, unique per encryption operation
- **Implementation**: Web Crypto API (`crypto.subtle`)

**Why AES-256-GCM?**
- Industry standard for end-to-end encryption
- Hardware-accelerated on modern devices
- Authenticated encryption prevents tampering
- Native browser support (no external crypto libraries)
- Resistant to known attacks with proper implementation

### Key Generation

**First Device** (account creation):
```typescript
// Generate 256-bit encryption key
const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,  // extractable (needed for QR export)
  ['encrypt', 'decrypt']
)

// Generate unique user identifier
const userId = crypto.randomUUID()  // UUID v4
```

**Key Properties**:
- Cryptographically secure random generation
- Never derived from user input (no weak passwords)
- Extractable for device pairing
- Stored separately from user data

### Encryption/Decryption Flow

**Encryption** (before upload to server):
```typescript
// 1. Serialize user data
const plaintext = JSON.stringify({
  version: 1,
  settings: { name, age, language },
  progress: { /* stats */ }
})

// 2. Generate random IV (12 bytes for GCM)
const iv = crypto.getRandomValues(new Uint8Array(12))

// 3. Encrypt with AES-256-GCM
const ciphertext = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  key,
  new TextEncoder().encode(plaintext)
)

// 4. Create payload
const payload = {
  version: 1,
  userId,
  encryptedData: base64Encode(ciphertext),
  iv: base64Encode(iv),
  timestamp: Date.now(),
  checksum: await sha256(ciphertext)
}
```

**Decryption** (after download from server):
```typescript
// 1. Parse payload
const { encryptedData, iv, checksum } = payload

// 2. Verify integrity
if (await sha256(encryptedData) !== checksum) {
  throw new Error('Data corruption detected')
}

// 3. Decrypt with AES-256-GCM
const plaintext = await crypto.subtle.decrypt(
  { name: 'AES-GCM', iv: base64Decode(iv) },
  key,
  base64Decode(encryptedData)
)

// 4. Parse user data
const userData = JSON.parse(new TextDecoder().decode(plaintext))
```

### QR Code Format

**Device Pairing QR Code**:
```json
{
  "version": 1,
  "type": "logikids-pairing",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "key": "base64-encoded-256-bit-key",
  "createdAt": 1234567890
}
```

**Security Considerations**:
- QR code contains full credentials (treat as highly sensitive)
- Display only briefly during pairing
- Never log QR contents
- Clear from screen after successful pairing

### Recovery Kit Format

**Printable PDF** (generated client-side):
- **QR Code**: Contains same data as pairing QR
- **Backup Code**: Human-readable format
  ```
  User ID:    550e8400-e29b-41d4-a716-446655440000
  Backup Key: ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12-3456
  ```
- **Instructions**: "Save this to recover your Logikids account if you lose access to all devices"

**Generation**:
- Created client-side using `jspdf`
- Never uploaded to server
- Downloaded as `logikids-recovery-kit.pdf`

## Data Synchronization

### Sync Triggers

Since the app requires an internet connection (task generation needs AI backend), synchronization is **immediate and mandatory**:

1. **On Settings Change**: Immediate encrypt + upload
2. **On Task Completion**: Immediate encrypt + upload
3. **On Window Focus**: Fetch latest from server, merge if newer
4. **On Visibility Change**: Fetch latest from server, merge if newer

**No Offline Queue**: Connection required for all operations. If offline, show "No connection" banner and block changes.

### Conflict Resolution Strategy

**Last-Write-Wins** (simple, appropriate for single-user scenario):
```typescript
// On window focus
const serverData = await fetchEncryptedData(userId)
const decryptedServer = await decrypt(serverData)

if (decryptedServer.timestamp > localData.timestamp) {
  // Server is newer - overwrite local
  localStorage.setItem('logikids_data', JSON.stringify(decryptedServer))
} else if (localData.timestamp > decryptedServer.timestamp) {
  // Local is newer - upload to server
  await uploadEncryptedData(userId, await encrypt(localData))
}
// If timestamps equal, do nothing
```

**Why Last-Write-Wins?**
- Simple implementation
- Single user unlikely to use two devices simultaneously
- Immediate sync prevents conflicts in practice
- Edge case (both devices used offline) results in one session's progress winning (acceptable trade-off)

### Payload Format

**Server Storage**:
```typescript
interface SyncRecord {
  userId: string           // UUID v4 (indexed)
  encryptedBlob: string    // Base64-encoded ciphertext
  iv: string              // Base64-encoded initialization vector
  timestamp: number       // Unix timestamp (milliseconds)
  checksum: string        // SHA-256 hash of ciphertext
  createdAt: Date         // Account creation timestamp
  lastAccessed: Date      // Last sync operation
  blobSize: number        // Size in bytes (for quota monitoring)
}
```

**What Server Knows** (minimal metadata):
- Total number of users (count of UUIDs)
- Storage usage per user (blob size)
- Last access time (for inactive account cleanup)

**What Server CANNOT Know**:
- User's name, age, or any settings
- User's progress or task statistics
- Which devices belong to same user
- Any user behavior or analytics

## User Flows

### First Device Setup (New User)

```
1. Welcome Screen
   ├─ "Enter your name" (can be nickname)
   └─ "How old are you?" (age selection)

2. Background: Generate Credentials
   ├─ Generate encryption key (256-bit random)
   ├─ Generate userId (UUID v4)
   └─ Store in IndexedDB

3. Create Initial Data
   ├─ settings: { name, age, language: 'en' }
   ├─ progress: {} (empty)
   └─ version: 1

4. First Sync
   ├─ Encrypt data with key + random IV
   ├─ Upload to server: PUT /api/sync/:userId
   └─ Server stores encrypted blob

5. Success Screen
   ├─ "You're all set!"
   └─ "Want to use Logikids on other devices?"
       ├─ Yes → Show QR code for pairing
       └─ No → Continue to app
```

### Device Pairing (Adding Second Device)

**Device 1** (existing):
```
1. Settings → "Pair New Device"
2. Generate QR code (userId + encryption key)
3. Display QR with instructions: "Scan this on your other device"
4. QR shown until user dismisses or pairing confirmed
```

**Device 2** (new):
```
1. Welcome Screen → "Already have an account?"
2. "Scan QR Code from Another Device"
3. Open camera, scan QR
4. Parse QR: { userId, key }
5. Fetch encrypted data: GET /api/sync/:userId
6. Decrypt data with key from QR
7. Store key + userId in IndexedDB
8. Store decrypted data in localStorage
9. "Welcome back, [name]! Your progress is synced."
```

### Recovery Kit Flow

**Creating Recovery Kit**:
```
1. Settings → "Download Recovery Kit"
2. Generate PDF client-side (jspdf):
   ├─ QR code (userId + key)
   ├─ Backup code (formatted for readability)
   └─ Instructions
3. Download as: logikids-recovery-kit.pdf
4. Suggest: "Print this or save it somewhere safe"
```

**Using Recovery Kit**:
```
1. Welcome Screen → "Restore from Recovery Kit"
2. Choose:
   ├─ Scan recovery QR code
   └─ OR enter backup code manually
3. Parse credentials (userId + key)
4. Same flow as device pairing:
   ├─ Fetch encrypted data from server
   ├─ Decrypt with key
   └─ Restore to device
```

### Data Export/Import

**Export**:
```
1. Settings → "Export My Data"
2. Fetch current state from localStorage
3. Generate JSON file:
   {
     "version": 1,
     "exportedAt": 1234567890,
     "settings": { ... },
     "progress": { ... }
   }
4. Download as: logikids-export-YYYY-MM-DD.json
5. "Data exported! Save this file to backup your progress."
```

**Import**:
```
1. Settings → "Import Data"
2. File picker → select logikids-export-*.json
3. Read and parse JSON
4. Validate with Zod schema
5. Preview: "Import 45 completed tasks?"
6. User confirms
7. Merge data:
   ├─ Progress: Combine stats (additive, never lose progress)
   └─ Settings: Use imported if different (let user review)
8. Encrypt and sync to server
9. "Import complete! Data synced to all devices."
```

**Import Merge Strategy**:
```typescript
// Progress: Additive (never lose tasks)
mergedProgress[subject][difficulty] = {
  correct: local.correct + imported.correct,
  wrong: local.wrong + imported.wrong,
  hintsUsed: local.hintsUsed + imported.hintsUsed
}

// Settings: Use imported (user explicitly chose to import)
mergedSettings = importedSettings
```

## Backend Implementation

### API Endpoints

```typescript
// Upload encrypted user data
PUT /api/sync/:userId
Request Body: {
  encryptedBlob: string,
  iv: string,
  timestamp: number,
  checksum: string
}
Response: { success: true }

// Download encrypted user data
GET /api/sync/:userId
Response: {
  encryptedBlob: string,
  iv: string,
  timestamp: number,
  checksum: string
} | 404 if not found

// Verify userId exists (for pairing validation)
POST /api/sync/:userId/verify
Response: { exists: boolean }

// Delete account (GDPR right to erasure)
DELETE /api/sync/:userId
Response: { success: true }
```

### Storage Schema

**PostgreSQL** (recommended for production):
```sql
CREATE TABLE sync_records (
  user_id UUID PRIMARY KEY,
  encrypted_blob TEXT NOT NULL,
  iv VARCHAR(24) NOT NULL,
  timestamp BIGINT NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_accessed TIMESTAMP NOT NULL DEFAULT NOW(),
  blob_size INTEGER NOT NULL,

  INDEX idx_last_accessed (last_accessed),
  INDEX idx_created_at (created_at)
);
```

**Redis** (alternative for simpler deployment):
```typescript
// Key format: sync:{userId}
// Value: JSON-serialized SyncRecord
{
  "encryptedBlob": "...",
  "iv": "...",
  "timestamp": 1234567890,
  "checksum": "...",
  "createdAt": "2025-10-26T10:00:00Z",
  "lastAccessed": "2025-10-26T14:30:00Z",
  "blobSize": 4567
}
```

### Security Measures

**Rate Limiting**:
- Max 100 sync requests per userId per hour
- Prevents abuse and DoS attacks
- Returns 429 Too Many Requests if exceeded

**Size Limits**:
- Max 1MB encrypted blob per user
- Progress data is tiny (~10KB even after years)
- Returns 413 Payload Too Large if exceeded

**HTTPS Only**:
- Enforce TLS 1.3+
- Redirect HTTP → HTTPS
- HSTS header: `max-age=31536000; includeSubDomains`

**CORS Configuration**:
```typescript
cors({
  origin: [
    'https://logikids.com',
    'https://www.logikids.com',
    'http://localhost:5173',  // Dev only
    'http://localhost:5174'   // Dev only
  ],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true
})
```

**No Logging**:
- Never log request bodies (contain encrypted data)
- Never log userId in plain text (use hashed version for debugging)
- Minimal logging: timestamp, endpoint, status code only

**Data Retention** (GDPR compliance):
- Auto-delete accounts inactive for 2+ years
- Cron job runs weekly:
  ```sql
  DELETE FROM sync_records
  WHERE last_accessed < NOW() - INTERVAL '2 years';
  ```
- User can manually delete anytime (Settings → Delete Account)

### Controller Implementation Sketch

```typescript
// packages/backend/src/sync/sync.controller.ts

export class SyncController {
  async upload(req: Request, res: Response) {
    const { userId } = req.params
    const { encryptedBlob, iv, timestamp, checksum } = req.body

    // Validate UUID
    if (!isValidUUID(userId)) {
      return res.status(400).json({ error: 'Invalid userId' })
    }

    // Validate payload size
    if (encryptedBlob.length > 1_000_000) {
      return res.status(413).json({ error: 'Payload too large' })
    }

    // Validate schema
    const validated = SyncPayloadSchema.parse(req.body)

    // Store encrypted blob
    await this.syncService.store(userId, {
      encryptedBlob: validated.encryptedBlob,
      iv: validated.iv,
      timestamp: validated.timestamp,
      checksum: validated.checksum,
      lastAccessed: new Date(),
      blobSize: encryptedBlob.length
    })

    res.json({ success: true })
  }

  async download(req: Request, res: Response) {
    const { userId } = req.params

    const record = await this.syncService.get(userId)
    if (!record) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Update last accessed
    await this.syncService.updateAccessed(userId)

    res.json({
      encryptedBlob: record.encryptedBlob,
      iv: record.iv,
      timestamp: record.timestamp,
      checksum: record.checksum
    })
  }

  async delete(req: Request, res: Response) {
    const { userId } = req.params

    await this.syncService.delete(userId)

    res.json({ success: true })
  }
}
```

## Frontend Implementation

### New Feature Structure

```
packages/frontend/src/features/
  Auth/                           # New feature for encryption & sync
    services/
      crypto.service.ts           # Web Crypto API wrapper
        - generateKey()
        - encrypt(key, data)
        - decrypt(key, encryptedData)
        - exportKeyForQR(key)
        - importKeyFromQR(keyData)

      sync.service.ts             # Server synchronization
        - uploadEncrypted(userId, payload)
        - downloadEncrypted(userId)
        - syncOnFocus()
        - syncOnBlur()

      storage.service.ts          # Local storage management
        - storeKey(key, userId)
        - retrieveKey()
        - clearAll()

    hooks/
      useAuth.ts                  # Authentication state
        - isAuthenticated
        - userId
        - hasEncryptionKey

      useSync.ts                  # Auto-sync hooks
        - syncNow()
        - isSyncing
        - lastSyncTime

      useCrypto.ts                # Encryption operations
        - encrypt(data)
        - decrypt(encryptedData)

    components/
      Onboarding/
        WelcomeScreen.tsx         # Name + age input
        PairingPrompt.tsx         # "Want to pair devices?"

      QRPairing/
        QRDisplay.tsx             # Show QR for pairing
        QRScanner.tsx             # Scan QR on new device

      RecoveryKit/
        GenerateKit.tsx           # Create PDF recovery kit
        RestoreFromKit.tsx        # Restore using kit

      DataPortability/
        ExportData.tsx            # Export JSON
        ImportData.tsx            # Import JSON with preview

  Account/                        # Extend existing feature
    Settings/
      SecuritySettings.tsx        # Add to settings
        - Pair New Device button → QRDisplay
        - Download Recovery Kit button → GenerateKit
        - Export Data button → ExportData
        - Import Data button → ImportData
        - Delete Account button → confirm + API call
```

### Key Services Implementation Sketch

**crypto.service.ts**:
```typescript
class CryptoService {
  async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  async encrypt(key: CryptoKey, data: any): Promise<EncryptedPayload> {
    const plaintext = JSON.stringify(data)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(plaintext)
    )

    return {
      encryptedData: base64Encode(ciphertext),
      iv: base64Encode(iv),
      timestamp: Date.now()
    }
  }

  async decrypt(key: CryptoKey, payload: EncryptedPayload): Promise<any> {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64Decode(payload.iv) },
      key,
      base64Decode(payload.encryptedData)
    )

    return JSON.parse(new TextDecoder().decode(plaintext))
  }

  async exportKeyForQR(key: CryptoKey, userId: string): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key)
    const qrData = {
      version: 1,
      type: 'logikids-pairing',
      userId,
      key: base64Encode(exported),
      createdAt: Date.now()
    }
    return JSON.stringify(qrData)
  }

  async importKeyFromQR(qrData: string): Promise<{ key: CryptoKey, userId: string }> {
    const parsed = JSON.parse(qrData)
    const keyData = base64Decode(parsed.key)

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    )

    return { key, userId: parsed.userId }
  }
}
```

**sync.service.ts**:
```typescript
class SyncService {
  private cryptoService: CryptoService
  private isSyncing = false

  async syncToServer(userId: string, key: CryptoKey, data: any) {
    if (this.isSyncing) return
    this.isSyncing = true

    try {
      const encrypted = await this.cryptoService.encrypt(key, data)
      const checksum = await this.calculateChecksum(encrypted.encryptedData)

      await fetch(`/api/sync/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...encrypted,
          checksum
        })
      })
    } finally {
      this.isSyncing = false
    }
  }

  async syncFromServer(userId: string, key: CryptoKey): Promise<any> {
    const response = await fetch(`/api/sync/${userId}`)

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Sync failed')
    }

    const payload = await response.json()
    return await this.cryptoService.decrypt(key, payload)
  }

  setupAutoSync(userId: string, key: CryptoKey) {
    // Sync on window focus
    window.addEventListener('focus', async () => {
      const serverData = await this.syncFromServer(userId, key)
      if (serverData && serverData.timestamp > getLocalTimestamp()) {
        updateLocalStorage(serverData)
      }
    })

    // Sync on blur (upload local changes)
    window.addEventListener('blur', async () => {
      const localData = getLocalStorage()
      await this.syncToServer(userId, key, localData)
    })
  }
}
```

### Dependencies

**Frontend** (package.json):
```json
{
  "dependencies": {
    "qr-scanner": "^1.4.2",      // QR code scanning
    "qrcode": "^1.5.3",          // QR code generation
    "jspdf": "^2.5.1",           // PDF generation (recovery kit)
    "qrcode.react": "^3.1.0"     // React QR components
  }
}
```

**Backend** (package.json):
```json
{
  "dependencies": {
    "ioredis": "^5.3.2"          // Redis client (if using Redis)
    // OR
    "pg": "^8.11.0"              // PostgreSQL client (if using Postgres)
  }
}
```

## Migration Strategy

### Existing Users

**Goal**: Seamless upgrade without data loss or user action required.

**Migration Flow**:
```
1. Backend Deployment
   ├─ Deploy new sync endpoints
   └─ Start accepting encrypted uploads

2. Frontend Deployment
   ├─ Detect existing localStorage data
   ├─ If found:
   │   ├─ Generate encryption key + userId
   │   ├─ Encrypt existing data
   │   ├─ Upload to server
   │   ├─ Store key in IndexedDB
   │   └─ Show one-time notification:
   │       "Your data is now backed up securely.
   │        Want to add other devices?"
   │       [Yes - Show QR] [No - Dismiss]
   └─ If not found: New user flow
```

**Code Sketch**:
```typescript
async function migrateExistingUser() {
  const legacyData = localStorage.getItem('logikids_progress')
  const legacySettings = localStorage.getItem('logikids_settings')

  if (!legacyData && !legacySettings) {
    return false  // New user
  }

  // Generate credentials
  const key = await cryptoService.generateKey()
  const userId = crypto.randomUUID()

  // Migrate data
  const migratedData = {
    version: 1,
    settings: JSON.parse(legacySettings || '{}'),
    progress: JSON.parse(legacyData || '{}'),
    timestamp: Date.now()
  }

  // Encrypt and upload
  await syncService.syncToServer(userId, key, migratedData)

  // Store credentials
  await storageService.storeKey(key, userId)

  // Clean up legacy storage
  localStorage.removeItem('logikids_progress')
  localStorage.removeItem('logikids_settings')

  // Show success notification
  showMigrationSuccessNotification()

  return true  // Migration complete
}
```

**Rollback Plan**:
- If migration fails, keep legacy data intact
- User can continue using app with old storage
- Retry migration on next app load

## Privacy & Compliance

### GDPR Compliance

**Data Minimization**:
- ✅ Only collect: name (can be pseudonym), age, progress
- ✅ No email, phone, address, or identifiable information
- ✅ Server only stores encrypted blobs (cannot read contents)

**Right to Access**:
- ✅ Export button downloads complete data as JSON
- ✅ Human-readable format, includes all stored information

**Right to Erasure**:
- ✅ Delete Account button in Settings
- ✅ Deletes server blob + clears all local storage
- ✅ Permanent deletion, no recovery (true erasure)

**Data Portability**:
- ✅ Export/Import functionality
- ✅ Standard JSON format (portable to other systems)

**Consent**:
- ✅ Clear privacy notice shown on first launch
- ✅ Age-appropriate language for children
- ✅ No data collection without consent

**Privacy Notice** (shown during onboarding):
```
Logikids protects your privacy:
• Your name and progress are private
• We can't read your data (it's encrypted)
• Delete your account anytime in Settings
• No advertisements or tracking

By continuing, you agree to our privacy policy.
[Learn More] [I Understand]
```

### COPPA Compliance

**No Personal Information Collection**:
- ✅ Name can be nickname/pseudonym
- ✅ No email, phone, or contact information
- ✅ No location tracking
- ✅ Age stored encrypted on server (server can't read it)

**No Third-Party Sharing**:
- ✅ Zero data sharing (server can't even read it)
- ✅ No advertising networks
- ✅ No analytics or tracking pixels

**Parental Controls**:
- ✅ Recovery kit allows parent backup/oversight
- ✅ Export functionality for parent review
- ✅ No direct parent involvement required (reduces friction)

**No Behavioral Tracking**:
- ✅ No cookies (besides essential session)
- ✅ No analytics
- ✅ No user profiling

### Security Best Practices

**Encryption**:
- ✅ AES-256-GCM (industry standard, NIST approved)
- ✅ Random IV per encryption (prevents pattern analysis)
- ✅ Authenticated encryption (GCM mode prevents tampering)
- ✅ Web Crypto API (hardware-accelerated, secure implementation)

**Key Management**:
- ✅ Cryptographically secure random generation
- ✅ Keys never transmitted except during pairing (user-initiated)
- ✅ Stored in IndexedDB (more secure than localStorage)
- ✅ Never logged or exposed in debugging

**Transport Security**:
- ✅ HTTPS only (TLS 1.3+)
- ✅ HSTS headers
- ✅ Certificate pinning (consideration for production)

**Server Security**:
- ✅ Rate limiting (prevent abuse)
- ✅ Input validation (Zod schemas)
- ✅ No logging of sensitive data
- ✅ Regular security audits (recommendation)

## Error Handling

### Network Errors

**Connection Lost**:
```
User Action → Upload fails
├─ Show banner: "No connection - changes not saved"
├─ Block further changes (prevent data loss)
└─ On reconnect: Auto-retry sync
```

**Server Error (5xx)**:
```
Sync fails with server error
├─ Show: "Server error - try again in a moment"
├─ Retry with exponential backoff: 1s, 2s, 4s, 8s
└─ After 4 retries: "Unable to sync. Check back later."
```

### Decryption Errors

**Wrong Key**:
```
QR scan with wrong key
├─ Decryption fails
└─ Show: "This QR code doesn't match your account.
          Make sure you're scanning from the correct device."
```

**Corrupted Data**:
```
Checksum mismatch on download
├─ Integrity check fails
├─ Fall back to local copy
└─ Show: "Server data corrupted. Using local copy.
          If this persists, export your data as backup."
```

### Key Loss Scenarios

**All Devices Lost + No Recovery Kit**:
```
User has no way to retrieve key
├─ Data is unrecoverable (by design)
├─ Show: "Unable to recover account without key or recovery kit.
│         You'll need to create a new account."
└─ Allow: Start fresh with new account
```

**Has Recovery Kit**:
```
User lost all devices but saved recovery kit
├─ "Restore from Recovery Kit" on welcome screen
├─ Scan QR or enter backup code
├─ Download encrypted data from server
├─ Decrypt with key from kit
└─ Success: "Account restored!"
```

**At Least One Device Still Works**:
```
User has access to at least one paired device
├─ Settings → "Pair New Device"
├─ Display QR code
├─ Scan on new device
└─ New device paired successfully
```

### Browser Storage Errors

**Quota Exceeded** (unlikely):
```
localStorage/IndexedDB full
├─ Show: "Storage full. Export your data and free up space."
└─ Provide export button
```

**Private Browsing**:
```
IndexedDB not available in private mode
├─ Detect: !window.indexedDB || in private mode
└─ Show: "Logikids requires regular browsing mode.
          Please open in a normal browser window."
```

## Testing Strategy

### Unit Tests

**Crypto Service**:
- ✅ Key generation produces 256-bit keys
- ✅ Encryption produces different ciphertext each time (random IV)
- ✅ Decrypt(Encrypt(data)) === data (round-trip)
- ✅ Decryption with wrong key fails
- ✅ Tampered ciphertext fails authentication

**Sync Service**:
- ✅ Upload creates correct payload format
- ✅ Download parses server response correctly
- ✅ Last-write-wins merge logic works correctly
- ✅ Checksum validation catches corruption

**Storage Service**:
- ✅ Key storage/retrieval works
- ✅ Clear all removes everything
- ✅ Handles missing data gracefully

### Integration Tests

**End-to-End Encryption**:
- ✅ Create account → encrypt → upload → download → decrypt
- ✅ Data matches original after full round-trip
- ✅ Server cannot decrypt stored data

**Multi-Device Sync**:
- ✅ Device 1 creates account
- ✅ Device 2 pairs via QR
- ✅ Both devices have same data
- ✅ Change on Device 1 → syncs to Device 2
- ✅ Change on Device 2 → syncs to Device 1

**Recovery Flows**:
- ✅ Generate recovery kit → restore on new device
- ✅ Export data → import on new device
- ✅ Lost all devices → cannot recover (expected)

### Security Tests

**Penetration Testing**:
- ❓ Man-in-the-middle attack (should fail - HTTPS + encryption)
- ❓ Server admin tries to decrypt data (should fail - no key)
- ❓ Brute force key (should be infeasible - 256-bit keyspace)
- ❓ Tamper with ciphertext (should fail - GCM authentication)

**Privacy Audit**:
- ❓ Network traffic contains no plaintext user data
- ❓ Server logs contain no sensitive information
- ❓ Browser DevTools shows no exposed keys or plaintext

## Future Enhancements

**Post-MVP Considerations** (not in initial design):

1. **Passphrase Option**: Allow users to choose memorable passphrase instead of random key
   - Trade-off: Weaker security, but easier recovery
   - Implementation: PBKDF2 key derivation from passphrase

2. **Key Rotation**: Allow users to change encryption key
   - Decrypt all data with old key
   - Re-encrypt with new key
   - Update all paired devices

3. **Selective Sync**: Sync only settings, not progress (or vice versa)
   - Useful for shared devices (school computer)
   - Separate encryption for settings vs. progress

4. **End-to-End Encrypted Backup to Cloud**:
   - Optional Google Drive / iCloud integration
   - Upload encrypted blob to user's personal cloud
   - Logikids never has access

5. **Multi-User Support on Same Device**:
   - Fast user switching (classroom scenario)
   - Separate encrypted storage per user
   - QR scan to switch users quickly

6. **Audit Log** (client-side only):
   - Track when devices were paired
   - Track when data was exported
   - Stored encrypted, visible to user only

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **User loses all devices + no recovery kit** | High (data loss) | Low | Educate users about recovery kit during onboarding; make export/import easy |
| **Implementation bug in crypto** | Critical (security breach) | Medium | Use Web Crypto API (battle-tested); extensive unit tests; security audit |
| **Server compromise** | None (zero-knowledge) | Low | Data is encrypted; server has no keys; regular security updates |
| **Browser compatibility issues** | Medium (app broken) | Low | Web Crypto API widely supported; polyfill for old browsers; feature detection |
| **User privacy confusion** | Medium (trust issues) | Medium | Clear privacy notice; age-appropriate language; transparent documentation |
| **Sync conflicts cause data loss** | Medium | Low | Last-write-wins is simple; immediate sync reduces conflicts; export as safety net |
| **COPPA/GDPR violation** | Critical (legal) | Low | Design compliant by default; legal review before launch; regular audits |

## Success Metrics

**Security** (Zero-Knowledge Guarantees):
- [ ] Server cannot decrypt any user data (verified via security audit)
- [ ] No plaintext data transmitted over network (verified via packet inspection)
- [ ] No sensitive data in server logs (verified via log audit)

**Privacy** (Compliance):
- [ ] GDPR compliance verified by legal review
- [ ] COPPA compliance verified by legal review
- [ ] Privacy policy approved and published

**User Experience** (Adoption):
- [ ] 90%+ of users successfully complete onboarding
- [ ] 50%+ of multi-device users successfully pair devices
- [ ] <5% support requests about lost data

**Technical** (Reliability):
- [ ] 99.9% sync success rate
- [ ] <2 second average sync latency
- [ ] Zero data corruption incidents

## Open Questions

1. **Storage Backend**: Redis (simpler) or PostgreSQL (more robust)?
   - Recommendation: Start with PostgreSQL for durability, easier backups

2. **Recovery Kit UX**: Mandatory or optional during onboarding?
   - Recommendation: Optional, but strongly encouraged with clear benefits

3. **Sync Frequency**: Focus/blur only, or add periodic background sync?
   - Recommendation: Focus/blur is sufficient given online-only requirement

4. **Account Deletion**: Immediate or delayed (30-day grace period)?
   - Recommendation: Immediate (true right to erasure), but add "Are you sure?" confirmation

5. **Analytics**: How to track usage without compromising privacy?
   - Recommendation: Server-side aggregate metrics only (total users, sync requests/day)

## References

- **Web Crypto API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- **AES-GCM**: NIST SP 800-38D (GCM Mode Specification)
- **GDPR**: https://gdpr.eu/
- **COPPA**: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- **Zero-Knowledge Encryption**: https://blog.cryptographyengineering.com/2012/04/05/zero-knowledge-password-proofs/

---

**Next Steps**:
1. Legal review of GDPR/COPPA compliance
2. Security audit of cryptography implementation
3. Create worktree for implementation
4. Write detailed implementation plan
5. Begin development in phases (backend → frontend migration → pairing → recovery)
