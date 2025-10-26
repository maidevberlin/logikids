# UserData Refactor: Simplified Data Handling

**Date:** 2025-10-26
**Status:** Design Approved
**Goal:** Replace complex, multi-path data handling with a simple, atomic, plugin-based architecture

---

## Problem Statement

The current frontend data handling system has grown complex:

- **8 files, ~1200 lines** of state management code
- **Dual authentication paths** with duplicated logic (authenticated vs. offline users)
- **Multiple storage schemas** (3 different formats for the same data)
- **Event-based sync** with potential race conditions
- **No clear separation** between core data operations and optional features

**Key pain points:**
- Code duplication in settings updates (updateName, updateAge, updateLanguage, updateGender)
- Multiple storage layers (IndexedDB + 4 localStorage keys + custom events)
- Difficult to add features without breaking sync/storage chain

---

## Design Principles

1. **Single source of truth** - One data model, one storage strategy
2. **Atomic operations** - Independent, composable functions with no hidden side effects
3. **Minimal abstractions** - Direct function calls, thin React wrapper
4. **Clear separation** - Core + optional plugins, no interdependencies
5. **Always encrypted** - No dual paths, everyone gets the same treatment

---

## Core Requirements

**Keep these features:**
- ✅ End-to-end encryption (AES-256-GCM, keys in IndexedDB)
- ✅ Cloud sync across devices (with graceful offline fallback)
- ✅ Offline-first local storage
- ✅ Export/Import/QR pairing for manual data portability

**Simplifications:**
- ✅ No legacy migration (clean slate, no old users)
- ✅ No dual auth paths (always encrypted, always try to sync)
- ✅ Auto-create encryption key + userId on first access

---

## Architecture: Core + Plugins

### Data Model (Single Source of Truth)

```typescript
interface UserData {
  userId: string              // UUID, generated once on first access
  settings: {
    name: string
    age: number
    language: string
    gender: string
  }
  progress: Record<string, any>  // Subject → difficulty → stats
  lastTask: {
    subject: string
    concept: string
  }
  timestamp: number           // For sync conflict resolution (last-write-wins)
}
```

### Storage Strategy

- **IndexedDB** (`logikids_secure_storage`): CryptoKey only (can't serialize to JSON)
- **localStorage** (`logikids_data`): Encrypted UserData blob
- **No other storage keys** (clean, single location)

### Module Structure

```
features/UserData/
  ├── core/
  │   ├── types.ts        # TypeScript interfaces
  │   ├── storage.ts      # IndexedDB + localStorage abstraction
  │   ├── crypto.ts       # Encrypt/decrypt primitives
  │   └── userData.ts     # Core CRUD operations
  ├── plugins/
  │   ├── sync.ts         # Server sync (optional)
  │   ├── export.ts       # JSON export/import (optional)
  │   └── qr.ts           # QR pairing (optional)
  ├── context/
  │   └── UserDataContext.tsx  # Thin React wrapper
  └── index.ts            # Public API
```

**Key principle:** Core has ZERO dependencies on plugins. Plugins depend on core.

---

## Core API (Atomic Operations)

### Initialization
```typescript
async function initialize(): Promise<UserData>
```
- Checks if userId exists in storage
- If not: generates CryptoKey + userId, stores both
- Loads encrypted data from localStorage
- Returns decrypted UserData
- **Auto-runs on first access** (no manual setup)

### Read
```typescript
async function getData(): Promise<UserData>
```
- Load key from IndexedDB
- Load encrypted blob from localStorage
- Decrypt and return

### Write
```typescript
async function setData(updates: Partial<UserData>): Promise<void>
```
- Load current data
- Merge updates: `{ ...current, ...updates, timestamp: Date.now() }`
- Encrypt merged data
- Save to localStorage
- Dispatch `data-changed` event (for React reactivity)

### Convenience Methods
```typescript
async function updateSettings(settings: Partial<Settings>): Promise<void>
  → Calls setData({ settings: { ...current.settings, ...settings } })

async function updateProgress(progress: Record<string, any>): Promise<void>
  → Calls setData({ progress: { ...current.progress, ...progress } })
```

### Key Properties
- **No side effects** - Each function does ONE thing
- **Composable** - Convenience methods call core operations
- **Synchronous feel** - Returns promises, no callbacks in signatures
- **Event-based reactivity** - Internal events for React, not part of API

---

## Plugin Architecture

### Sync Plugin (`plugins/sync.ts`)

```typescript
interface SyncPlugin {
  upload(data: UserData): Promise<void>
  download(): Promise<UserData | null>
  sync(): Promise<void>
}

async function sync() {
  const local = await getData()
  const remote = await download()

  if (!remote) {
    await upload(local)
    return
  }

  // Last-write-wins based on timestamp
  if (remote.timestamp > local.timestamp) {
    await setData(remote)  // Uses core operation
  } else {
    await upload(local)
  }
}

// Auto-sync (opt-in)
function enableAutoSync() {
  window.addEventListener('focus', () => sync())
  window.addEventListener('blur', () => upload(getData()))
  window.addEventListener('beforeunload', () => upload(getData()))
}
```

**Error handling:** Swallow network errors (app works offline)

### Export Plugin (`plugins/export.ts`)

```typescript
async function exportData(): Promise<string> {
  const data = await getData()
  return JSON.stringify(data, null, 2)  // Unencrypted for portability
}

async function importData(json: string): Promise<void> {
  const imported = JSON.parse(json)
  const current = await getData()

  // Additive merge - never lose data
  const merged = {
    ...imported,
    progress: mergeProgress(current.progress, imported.progress),
    timestamp: Date.now()
  }

  await setData(merged)
}
```

### QR Plugin (`plugins/qr.ts`)

```typescript
async function generateQRData(): Promise<QRPayload> {
  const userId = (await getData()).userId
  const key = await loadKey()
  const exportedKey = await crypto.subtle.exportKey('jwk', key)

  return {
    userId,
    key: JSON.stringify(exportedKey),
    timestamp: Date.now()
  }
}

async function scanQR(payload: QRPayload): Promise<void> {
  const importedKey = await crypto.subtle.importKey(...)
  await storeKey(importedKey)
  await setData({ userId: payload.userId })

  // Trigger sync to download paired data
  await sync()
}
```

---

## React Integration (Simplified Context)

### UserDataContext (Thin Wrapper)

```typescript
interface UserDataContextValue {
  data: UserData | null
  isLoading: boolean
  error: Error | null

  // Core operations (always available)
  updateSettings: (settings: Partial<Settings>) => Promise<void>
  updateProgress: (progress: Record<string, any>) => Promise<void>
  refresh: () => Promise<void>

  // Plugin operations (conditional)
  sync?: () => Promise<void>
  exportData?: () => Promise<string>
  importData?: (json: string) => Promise<void>
}

function UserDataProvider({ children, plugins = [] }) {
  const [data, setData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize once
  useEffect(() => {
    initialize()
      .then(d => setData(d))
      .catch(e => setError(e))
      .finally(() => setIsLoading(false))
  }, [])

  // Listen for data changes
  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('data-changed', handler)
    return () => window.removeEventListener('data-changed', handler)
  }, [])

  // Pass-through to core (NO business logic in context)
  const updateSettings = async (settings: Partial<Settings>) => {
    await core.updateSettings(settings)
    await refresh()
  }

  const refresh = async () => {
    const updated = await getData()
    setData(updated)
  }

  // Conditionally add plugin methods
  const value = {
    data, isLoading, error,
    updateSettings, updateProgress, refresh,
    ...(plugins.includes('sync') && { sync: syncPlugin.sync }),
    ...(plugins.includes('export') && {
      exportData: exportPlugin.exportData,
      importData: exportPlugin.importData
    })
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}
```

### Usage in Components

**Before (complicated):**
```typescript
const { name, updateName, isAuthenticated, sync } = useUserData()
await updateName('Alice')  // Hidden complexity
```

**After (simple):**
```typescript
const { data, updateSettings } = useUserData()
await updateSettings({ name: 'Alice' })  // Clear and atomic
```

**Key simplifications:**
- Context is just React wrapper, no business logic
- All operations delegate to core
- No dual authentication paths
- Single `updateSettings` instead of 4 separate functions
- Plugins opt-in at provider level

---

## Error Handling Strategy

### Fail Gracefully, Never Block

**Core operations:**
- Throw on critical failures (can't save data)
- Return defaults on corruption (with console warning)

**Plugin operations:**
- Swallow errors (sync failure shouldn't break app)
- Log warnings for debugging

### Examples

```typescript
// Storage error → reset to defaults
async function getData(): Promise<UserData> {
  try {
    const encrypted = localStorage.getItem('logikids_data')
    if (!encrypted) return createDefaultData()

    const key = await loadKey()
    return await decrypt(key, encrypted)
  } catch (error) {
    console.error('Failed to load data, resetting:', error)
    return createDefaultData()
  }
}

// Sync error → log and continue
async function sync(): Promise<void> {
  try {
    // ... sync logic ...
  } catch (error) {
    console.warn('Sync failed, continuing offline:', error)
    // Don't throw - sync is optional
  }
}
```

### Concurrent Updates

**Simple model:** Last-write-wins at operation level

- All updates go through `setData()`
- `setData()` loads current → merges → saves (atomic within event loop)
- Race conditions resolve naturally (last caller wins)
- Optional: Add pending promise queue if strict ordering needed

---

## Rollout Strategy (Clean Slate)

### Files to Delete
```
✗ Auth/hooks/useAuth.ts
✗ Auth/services/sync.service.ts
✗ Auth/services/storage.service.ts
✗ Auth/services/crypto.service.ts
✗ Auth/context/UserDataContext.tsx
✗ Profile/useUserProfile.ts
✗ Task/useLastTask.ts
✗ Stats/progressService.ts
```

### Files to Create
```
✓ UserData/core/types.ts
✓ UserData/core/storage.ts
✓ UserData/core/crypto.ts
✓ UserData/core/userData.ts
✓ UserData/plugins/sync.ts
✓ UserData/plugins/export.ts
✓ UserData/plugins/qr.ts
✓ UserData/context/UserDataContext.tsx
✓ UserData/index.ts
```

### Implementation Steps
1. Build new `UserData/` feature (all files above)
2. Update `Providers.tsx` to use new `UserDataProvider`
3. Update all components to use new API (search for `useUserData()` calls)
4. Delete entire old `Auth/`, `Profile/`, legacy hooks
5. Clear old localStorage keys on app load (fresh start)

**No migration needed** - No old users, clean slate

### Code Reduction
- **Current:** ~1200 lines across 8 files
- **New:** ~500-600 lines across 9 files
- **Reduction:** ~50% less code, better organized

---

## Testing Strategy

### Unit Tests
- Each core function: `getData`, `setData`, `encrypt`, `decrypt`
- Storage operations: `loadKey`, `storeKey`
- Data merging: `updateSettings`, `updateProgress`

### Integration Tests
- Plugin interactions: sync, export, import
- Error scenarios: corrupted data, network failures
- Event system: `data-changed` events trigger React updates

### E2E Tests
1. Create account → save settings → refresh page → verify persistence
2. Generate data → export → clear storage → import → verify restoration
3. Device A generates QR → Device B scans → verify data syncs
4. Offline mode → make changes → go online → verify sync

---

## Benefits

### For Developers
- **50% less code** to maintain
- **Clear mental model** - core + plugins pattern
- **Easy to extend** - add plugin without touching core
- **Easy to test** - atomic operations, pure functions

### For Users
- **Same features** - encryption, sync, export, QR pairing
- **More reliable** - simpler code = fewer bugs
- **Better performance** - less overhead, clearer data flow

### For Future Features
- Add new plugins without core changes
- Experiment with alternative sync strategies
- A/B test features by toggling plugins
- Easy to add undo/redo (track deltas in setData)

---

## Open Questions / Future Enhancements

1. **Conflict resolution:** Currently last-write-wins. Could add CRDTs for complex merges.
2. **Offline queue:** Could queue sync operations when offline, replay when online.
3. **Compression:** Large progress data could be gzip-compressed before encryption.
4. **Versioning:** Add schema version to UserData for future migrations.
5. **Undo/redo:** Track operation history in setData() for rollback.

---

## Conclusion

This refactor transforms a complex, multi-path system into a clean, plugin-based architecture. By embracing "always encrypted" and eliminating dual authentication paths, we reduce code by 50% while maintaining all features. The core + plugin pattern provides a robust foundation for future enhancements without increasing complexity.

**Next steps:** Set up worktree → create implementation plan → begin development
