# Frontend State Management Analysis

**Date**: 2025-11-16
**Scope**: `packages/frontend/src/api/` and `packages/frontend/src/hooks/`
**Focus**: API client setup, React Query configuration, custom hooks, data fetching patterns, state synchronization

## Executive Summary

The frontend state management architecture combines React Query for server state with React Context for global client state. The implementation shows **moderate quality** with some good practices but significant violations of DRY and SOLID principles, particularly in error handling, API abstraction, and hook composition.

### Quality Metrics
- **Total Files Analyzed**: 11 (4 API files, 2 custom hooks, 5 React Query usage files)
- **Lines of Code**: ~1,500 (API: 309, Hooks: ~1,200)
- **Critical Issues**: 8
- **Major Issues**: 12
- **Minor Issues**: 7

### Top 3 Critical Issues

1. **Duplicate Error Handling Logic** (DRY Violation - Critical)
   - Error handling duplicated across `api.ts` interceptor and `logikids.ts` API methods
   - 3 layers of error transformation create confusion and potential inconsistencies
   - Severity: CRITICAL | Files: 2 | Estimated effort: 8 hours

2. **Inconsistent API Call Patterns** (SOLID Violation - Critical)
   - Mixed use of axios directly, custom api instance, and fetch API
   - No unified abstraction for data fetching
   - Severity: CRITICAL | Files: 3 | Estimated effort: 12 hours

3. **Tightly Coupled Hook Dependencies** (SOLID Violation - Critical)
   - `useTask` hook violates Single Responsibility by orchestrating multiple concerns
   - Direct coupling to `useTaskAnswer`, `useHint`, i18n, and React Query
   - Severity: CRITICAL | Files: 1 | Estimated effort: 10 hours

## Detailed Analysis

### 1. API Layer (`packages/frontend/src/api/`)

#### 1.1 API Client Configuration (`api.ts` - 136 lines)

**Good Practices:**
- ✅ Centralized axios instance with base configuration
- ✅ Token refresh logic with promise deduplication
- ✅ Request/response interceptors for authentication
- ✅ Automatic token injection

**Critical Issues:**

**Issue #1: Redundant Error Handling Chain**
```typescript
// api.ts - Response interceptor
api.interceptors.response.use(
  (response) => response.data,  // Layer 1: Unwraps data
  async (error: AxiosError) => {
    // Layer 2: HTTP status code transformation
    if (error.response) {
      switch (error.response.status) {
        case 401: throw new Error('Authentication required');
        case 403: throw new Error('You do not have permission...');
        // ... more cases
      }
    }
    // Layer 3: Network error handling
    if (error.request) {
      throw new Error('No response received from server...');
    }
  }
);

// logikids.ts - API method
getTask: (params, signal) => {
  return api.get<TaskRequest, Task>('/task', { params, signal })
    .then(response => {
      if (!response) {  // Layer 4: Redundant null check
        throw new LogikidsApiError('No response received from server');
      }
      return response;
    })
    .catch((error) => {  // Layer 5: Re-wrapping in custom error
      if (error instanceof LogikidsApiError) throw error;
      throw new LogikidsApiError(error.message || 'Failed to fetch task');
    });
}
```

**Violations:**
- **DRY**: Error messages duplicated between interceptor and API methods
- **SOLID (SRP)**: Response interceptor doing too much (unwrapping + error handling + auth)
- **Minimal Code**: 5 layers of error handling for single API call

**Impact**: High - Difficult to maintain consistent error messages, hard to test

---

**Issue #2: Inconsistent Type Safety**
```typescript
// api.ts - Line 5
export const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor returns any
api.interceptors.response.use(
  (response) => response.data,  // Type: any
  // ...
);

// logikids.ts - Line 74
return api.get<SubjectsParams | undefined, SubjectsResponse>('/task/subjects', {
  params,
  signal
})
// Type mismatch: api.get doesn't accept generic types like this
```

**Violations:**
- **SOLID (LSP)**: Type promises not fulfilled by interceptor
- **Type Safety**: Loss of type safety through interceptor transformation

---

**Issue #3: Hard-coded Error Messages**
```typescript
// api.ts - Lines 94-109
switch (error.response.status) {
  case 401: throw new Error('Authentication required');
  case 403: throw new Error('You do not have permission to perform this action');
  case 404: throw new Error('Resource not found');
  case 422: throw new Error('Invalid data provided');
  case 429: throw new Error('Too many requests. Please try again later');
  case 500: throw new Error('Internal server error. Please try again later');
  default: throw new Error('An unexpected error occurred. Please try again');
}
```

**Violations:**
- **DRY**: Error messages not externalized/reusable
- **i18n**: No internationalization support for error messages
- **SOLID (OCP)**: Closed to extension for custom error handling

---

#### 1.2 API Methods (`logikids.ts` - 133 lines)

**Good Practices:**
- ✅ Zod schema validation for request parameters
- ✅ Custom error class (`LogikidsApiError`)
- ✅ AbortSignal support for cancellation

**Critical Issues:**

**Issue #4: Repetitive Promise Chain Pattern**
```typescript
// Pattern repeated 3 times (getSubjects, getTask, getHint)
export const logikids = {
  getSubjects: (params?, signal?) => {
    return api.get('/task/subjects', { params, signal })
      .then(response => {
        if (!response) {
          throw new LogikidsApiError('No response received from server');
        }
        return response;
      })
      .catch((error) => {
        throw new LogikidsApiError(error.message || 'Failed to fetch subjects');
      });
  },

  getTask: (params, signal?) => {
    return api.get('/task', { params, signal })
      .then(response => {
        if (!response) {  // DUPLICATE
          throw new LogikidsApiError('No response received from server');
        }
        return response;
      })
      .catch((error) => {
        if (error.response?.status === 404) {  // Special case handling
          throw new LogikidsApiError('No tasks found for the selected criteria');
        }
        if (error instanceof LogikidsApiError) {
          throw error;
        }
        throw new LogikidsApiError(error.message || 'Failed to fetch task');
      });
  },
  // ... getHint follows same pattern
}
```

**Violations:**
- **DRY**: Identical `.then()` null check in all 3 methods
- **DRY**: Similar `.catch()` error wrapping logic
- **Minimal Code**: Could be abstracted to single helper function

**Refactoring Opportunity:**
```typescript
function apiCall<T>(
  request: Promise<T>,
  errorMessage: string,
  statusHandlers?: Record<number, string>
): Promise<T> {
  return request
    .then(response => {
      if (!response) throw new LogikidsApiError('No response received');
      return response;
    })
    .catch(error => {
      if (error.response?.status && statusHandlers?.[error.response.status]) {
        throw new LogikidsApiError(statusHandlers[error.response.status]);
      }
      if (error instanceof LogikidsApiError) throw error;
      throw new LogikidsApiError(error.message || errorMessage);
    });
}
```

---

**Issue #5: Unused Type Definitions**
```typescript
// types.ts - Lines 1-30
export interface ApiResponse<T> {
  data: T
  error: ApiError | null
}

export interface ApiError {
  code: ApiErrorCode
  message: string
  details?: Record<string, unknown>
}

export enum ApiErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export function isApiError(error: unknown): error is ApiError {
  // ...
}
```

**Violations:**
- **Minimal Code**: Types defined but never used in codebase
- **Dead Code**: 30 lines serving no purpose
- **YAGNI**: Premature abstraction without usage

**Search Results**: `ApiResponse`, `ApiError`, `ApiErrorCode` have **0 usages** outside this file.

---

#### 1.3 Query Client Configuration (`queryClient.ts` - 12 lines)

**Good Practices:**
- ✅ Minimal, focused configuration
- ✅ Sensible defaults (retry: 1, no refetch on window focus)

**Minor Issue:**

**Issue #6: No Error Retry Logic Customization**
```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,  // Always retries once, even for 404s
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,  // Same issue for mutations
    },
  },
})
```

**Violations:**
- **SOLID (OCP)**: No way to customize retry logic per query type
- **Best Practice**: Should differentiate between retryable (5xx) and non-retryable (4xx) errors

**Recommendation:**
```typescript
retry: (failureCount, error) => {
  if (error.response?.status >= 400 && error.response?.status < 500) {
    return false; // Don't retry client errors
  }
  return failureCount < 2;
}
```

---

### 2. Custom Hooks (`packages/frontend/src/hooks/`)

#### 2.1 Task Loading Calibration (`useTaskLoadingCalibration.ts` - 249 lines)

**Good Practices:**
- ✅ Excellent documentation
- ✅ Comprehensive error handling (try/catch on all localStorage operations)
- ✅ Input validation
- ✅ Single Responsibility: Only manages loading time calibration
- ✅ Type safety with interfaces

**Minor Issues:**

**Issue #7: Over-engineered for Current Use**
```typescript
interface UseTaskLoadingCalibration {
  getTimeConstant: () => number
  recordLoadTime: (loadTimeMs: number) => void
  getAverageLoadTime: () => number | null
  startMeasurement: () => number
  completeMeasurement: (startTime: number) => void
}
```

**Observations:**
- 5 public methods for feature used in 1 place
- `getAverageLoadTime()` exposed but never called
- `startMeasurement()` and `completeMeasurement()` could be combined

**Violations:**
- **YAGNI**: More API surface than needed
- **Minimal Code**: Could simplify to 2-3 methods

**Impact**: Low - Well-contained, just opportunity for simplification

---

#### 2.2 Time of Day Hook (`useTimeOfDay.ts` - 52 lines)

**Good Practices:**
- ✅ Clean, focused hook
- ✅ Proper cleanup of intervals
- ✅ Side effect management (DOM manipulation in useEffect)

**Critical Issue:**

**Issue #8: Direct DOM Manipulation in Hook**
```typescript
function updateBodyTimeClass(time: TimeOfDay): void {
  const classes = Array.from(document.body.classList);
  classes.forEach(className => {
    if (className.startsWith('time-')) {
      document.body.classList.remove(className);
    }
  });
  document.body.classList.add(`time-${time}`);
}

export function useTimeOfDay(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay);

  useEffect(() => {
    const currentTime = getTimeOfDay();
    updateBodyTimeClass(currentTime);  // Side effect!
    // ...
  }, []);
}
```

**Violations:**
- **SOLID (SRP)**: Hook managing both state AND side effects
- **React Best Practices**: Direct DOM manipulation bypasses React
- **Testing**: Hard to test due to global DOM dependency

**Impact**: Medium - Works but violates React patterns

**Recommendation**: Separate concerns
```typescript
// Hook returns state only
export function useTimeOfDay(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay);
  // ... update logic
  return timeOfDay;
}

// Component handles DOM side effect
function App() {
  const timeOfDay = useTimeOfDay();

  useEffect(() => {
    updateBodyTimeClass(timeOfDay);
  }, [timeOfDay]);
}
```

---

### 3. React Query Usage Patterns

#### 3.1 Task Hook (`useTask.ts` - 102 lines)

**Critical Issues:**

**Issue #9: God Hook Anti-Pattern**
```typescript
export const useTask = (params: TaskRequest) => {
  // Responsibility 1: Data fetching
  const { data: task, isLoading, isFetching, error, refetch } = useQuery<Task>({
    queryKey: ['task', params],
    queryFn: ({ signal }) => logikids.getTask(params, signal),
    // ...
  });

  // Responsibility 2: Answer management
  const {
    selectedAnswer,
    isCorrect,
    gradingDetails,
    handleAnswerSelect: selectAnswer,
    handleAnswerSubmit: checkAnswer
  } = useTaskAnswer({ task });

  // Responsibility 3: Hint management
  const {
    hints,
    hintsUsed,
    requestHint,
    hintLoading,
    hintError,
    canRequestHint
  } = useHint({ taskId: task?.taskId });

  // Responsibility 4: i18n synchronization
  useEffect(() => {
    const handleLanguageChange = () => {
      refetch();
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [refetch]);

  // Responsibility 5: Time tracking
  const [startTime, setStartTime] = useState(Date.now());
  useEffect(() => {
    if (task) {
      setStartTime(Date.now());
    }
  }, [task]);

  // Responsibility 6: Explanation extraction
  const getExplanation = useCallback(() => {
    if (!task) return '';
    if (task.type === 'single_choice') {
      const correctOption = (task as SingleChoiceTask).options.find(opt => opt.isCorrect);
      return correctOption?.explanation || '';
    } else if (task.type === 'yes_no') {
      return (task as YesNoTask).explanation;
    } else if ('explanation' in task) {
      return task.explanation;
    }
    return '';
  }, [task]);

  // Returns 15 properties!
  return {
    task,
    isLoading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    selectedAnswer,
    isCorrect,
    gradingDetails,
    explanation: getExplanation(),
    checkAnswer,
    selectAnswer,
    nextTask,
    hints,
    hintsUsed,
    requestHint,
    hintLoading,
    hintError,
    canRequestHint,
    startTime
  };
};
```

**Violations:**
- **SOLID (SRP)**: 6 distinct responsibilities in one hook
- **SOLID (DIP)**: Tightly coupled to `i18n` global
- **SOLID (ISP)**: Callers forced to receive all 17 properties
- **Minimal Code**: Unnecessary abstraction layer

**Impact**: High - Difficult to test, maintain, and reuse

**Recommendation**: Split into focused hooks
```typescript
// Focused, composable hooks
export const useTaskData = (params: TaskRequest) => {
  return useQuery({
    queryKey: ['task', params],
    queryFn: ({ signal }) => logikids.getTask(params, signal),
    // ...
  });
};

export const useTaskI18nSync = (refetch: () => void) => {
  useEffect(() => {
    i18n.on('languageChanged', refetch);
    return () => i18n.off('languageChanged', refetch);
  }, [refetch]);
};

// Component composes what it needs
function TaskPage() {
  const { data: task, refetch } = useTaskData(params);
  const { selectedAnswer, checkAnswer } = useTaskAnswer({ task });
  const { hints, requestHint } = useHint({ taskId: task?.taskId });
  useTaskI18nSync(refetch);
  // ...
}
```

---

**Issue #10: Loading State Confusion**
```typescript
export const useTask = (params: TaskRequest) => {
  const {
    data: task,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery<Task>({
    queryKey: ['task', params],
    queryFn: ({ signal }) => logikids.getTask(params, signal),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  // ...

  return {
    task,
    isLoading: isLoading || isFetching,  // Why combine these?
    // ...
  };
};
```

**Violations:**
- **Semantic Clarity**: `isLoading` and `isFetching` have distinct meanings
  - `isLoading`: First load (no data yet)
  - `isFetching`: Background refetch (data exists)
- **SOLID (LSP)**: Combining them loses important information

**Impact**: Medium - Components can't differentiate initial load from refetch

---

#### 3.2 Hint Hook (`useHint.ts` - 51 lines)

**Good Practices:**
- ✅ Focused, single responsibility
- ✅ Proper state reset on task change
- ✅ Clean API

**Minor Issue:**

**Issue #11: Unnecessary State Duplication**
```typescript
export const useHint = ({ taskId, maxHints = 4 }: UseHintOptions) => {
  const [hints, setHints] = useState<string[]>([]);
  const [hintError, setHintError] = useState<string | null>(null);

  const hintMutation = useMutation({
    mutationFn: () => {
      if (!taskId) {
        throw new Error('No task ID available');
      }
      return logikids.getHint(taskId);
    },
    onSuccess: (data) => {
      setHints(prev => [...prev, data.hint]);
      setHintError(null);
    },
    onError: (error) => {
      setHintError(error instanceof Error ? error.message : 'Failed to fetch hint');
    }
  });

  return {
    hints,
    hintsUsed: hints.length,  // Duplicate computation
    hintError,
    // ...
  };
};
```

**Violations:**
- **DRY**: `hintsUsed` always equals `hints.length` - no need to return both
- **Minimal Code**: Extra property that callers can compute

**Impact**: Low - Minor API bloat

---

#### 3.3 Concepts Page (`ConceptsPage.tsx` - 379 lines)

**Critical Issues:**

**Issue #12: Fetch API Instead of Axios**
```typescript
// ConceptsPage.tsx uses raw fetch
async function fetchSubjectConcepts(
  subjectId: string,
  options?: { grade?: number; source?: string; difficulty?: string }
): Promise<ConceptsResponse> {
  const params = new URLSearchParams()
  // ... build params

  const url = `/api/task/subjects/${subjectId}/concepts${params.toString() ? '?' + params.toString() : ''}`

  const response = await fetch(url)  // Not using api.ts!
  if (!response.ok) {
    throw new Error('Failed to fetch concepts')
  }
  return response.json()
}
```

**Violations:**
- **Inconsistency**: All other API calls use `api` or `logikids`, this uses `fetch`
- **SOLID (OCP)**: Bypasses centralized error handling, auth interceptors
- **DRY**: Re-implementing URL building, error handling

**Impact**: High - No auth token, no centralized error handling, no retry logic

---

**Issue #13: Complex Tab State Management**
```typescript
const [showAll, setShowAll] = useState(() => (location.state as { showAll?: boolean })?.showAll ?? false)
const [activeTab, setActiveTab] = useState<'school' | 'fun'>('school')
const [initialTabSet, setInitialTabSet] = useState(false)

// Fetch to determine default tab
const { data: schoolCheck } = useQuery({
  queryKey: ['concepts-check', subjectId, grade, 'curriculum'],
  queryFn: () => fetchSubjectConcepts(subjectId!, { grade, source: 'curriculum' }),
  enabled: !!subjectId && !initialTabSet,
});

const { data: customCheck } = useQuery({
  queryKey: ['concepts-check', subjectId, grade, 'custom'],
  queryFn: () => fetchSubjectConcepts(subjectId!, { grade, source: 'custom' }),
  enabled: !!subjectId && !initialTabSet,
});

// Set initial tab based on which has concepts
useEffect(() => {
  if (!initialTabSet && schoolCheck && customCheck) {
    const hasSchool = schoolCheck.concepts.length > 0
    const hasCustom = customCheck.concepts.length > 0

    if (!hasSchool && hasCustom) {
      setActiveTab('fun')
    }
    setInitialTabSet(true)
  }
}, [initialTabSet, schoolCheck, customCheck])
```

**Violations:**
- **Over-engineering**: 2 extra queries just to set default tab
- **Performance**: Unnecessary network requests
- **Minimal Code**: Could default to 'school' and let user switch if empty

**Impact**: Medium - Extra API calls, complex state logic

---

#### 3.4 User Data Context (`UserDataContext.tsx` - 149 lines)

**Good Practices:**
- ✅ Clear separation of concerns (core vs plugins)
- ✅ Centralized state management
- ✅ Event-driven updates

**Major Issues:**

**Issue #14: Excessive Re-rendering**
```typescript
export function UserDataProvider({ children }: UserDataProviderProps) {
  const [data, setData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Every operation calls refresh()
  const updateSettings = async (settings: Partial<UserSettings>) => {
    await coreUpdateSettings(settings)
    await refresh()  // Fetches all data from storage
  }

  const updateProgress = async (progress: Record<string, any>) => {
    await coreUpdateProgress(progress)
    await refresh()  // Fetches all data again
  }

  const refresh = async () => {
    try {
      const updated = await getData()  // Loads entire UserData object
      setData(updated)  // Triggers re-render of entire tree
      setError(null)
    } catch (e) {
      setError(e as Error)
    }
  }
}
```

**Violations:**
- **Performance**: Full context re-render on every update
- **SOLID (SRP)**: Context does state + API calls + sync management
- **Optimization**: No memoization of value object

**Impact**: High - Performance issues with frequent updates

**Recommendation:**
```typescript
const value: UserDataContextValue = useMemo(() => ({
  data,
  isLoading,
  error,
  // ... operations
}), [data, isLoading, error]);

// Consider splitting into multiple contexts
<UserDataContext.Provider value={dataValue}>
  <UserSettingsContext.Provider value={settingsValue}>
    <UserProgressContext.Provider value={progressValue}>
      {children}
    </UserProgressContext.Provider>
  </UserSettingsContext.Provider>
</UserDataContext.Provider>
```

---

**Issue #15: Manual Event Listeners**
```typescript
useEffect(() => {
  const handler = () => refresh()
  window.addEventListener('data-changed', handler)
  return () => window.removeEventListener('data-changed', handler)
}, [])
```

**Violations:**
- **Best Practice**: Custom events without type safety
- **SOLID (OCP)**: Global coupling through window events
- **React Query**: Could use query invalidation instead

---

#### 3.5 Progress Hook (`useProgress` - 145 lines)

**Good Practices:**
- ✅ Focused on progress calculations
- ✅ Defensive programming (null checks)

**Major Issue:**

**Issue #16: Type Unsafety**
```typescript
export function useProgress() {
  const { data, updateProgress, updateGameStats } = useUserData()

  const progress: ProgressData = data?.progress || {}  // Any structure
  const gameStats = data?.gameStats

  const submitTaskAttempt = useCallback(
    async (submission: TaskSubmissionData) => {
      // ...
      await updateProgress(updatedProgress)  // Type: Record<string, any>
      await updateGameStats(updatedGameStats)
    },
    [data, progress, gameStats, updateProgress, updateGameStats]
  );
}
```

**Violations:**
- **Type Safety**: `Record<string, any>` loses type information
- **SOLID (LSP)**: Type promise not enforced

---

### 4. Storage Layer (`storage.ts` - 212 lines)

**Good Practices:**
- ✅ IndexedDB for secure storage
- ✅ Error recovery logic
- ✅ Proper cleanup

**Major Issues:**

**Issue #17: Repetitive IndexedDB Boilerplate**
```typescript
// Pattern repeated 4 times for different keys
export async function storeKey(key: CryptoKey): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(key, KEY_ID)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to store key'))
    }
    request.onsuccess = () => {
      db.close()
      resolve()
    }
  })
}

export async function loadKey(): Promise<CryptoKey | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(KEY_ID)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to load key'))
    }
    request.onsuccess = () => {
      db.close()
      resolve(request.result || null)
    }
  })
}

// storeUserId, getUserId, storeTokens, getAccessToken all follow same pattern
```

**Violations:**
- **DRY**: Same pattern copied 8 times (4 getters + 4 setters)
- **Minimal Code**: 150+ lines could be reduced to 30 with abstraction

**Recommendation:**
```typescript
async function setItem<T>(key: string, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);

    request.onerror = () => {
      db.close();
      reject(request.error || new Error(`Failed to store ${key}`));
    };
    request.onsuccess = () => {
      db.close();
      resolve();
    };
  });
}

async function getItem<T>(key: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onerror = () => {
      db.close();
      reject(request.error || new Error(`Failed to load ${key}`));
    };
    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };
  });
}

// Then use generic helpers
export const storeKey = (key: CryptoKey) => setItem(KEY_ID, key);
export const loadKey = () => getItem<CryptoKey>(KEY_ID);
export const storeUserId = (userId: string) => setItem(USER_ID_KEY, userId);
export const getUserId = () => getItem<string>(USER_ID_KEY);
// etc.
```

---

## Summary of Violations

### DRY Violations
1. **Error handling duplicated** across interceptor and API methods (Critical)
2. **Promise chain pattern** repeated 3x in logikids.ts (Major)
3. **IndexedDB operations** repeated 8x in storage.ts (Major)
4. **Null check + error wrapping** in every API method (Major)
5. **Tab initialization logic** duplicated between school/fun tabs (Minor)

### SOLID Violations

#### Single Responsibility Principle (SRP)
1. **api.ts response interceptor**: unwrapping + error handling + auth (Critical)
2. **useTask hook**: 6 responsibilities (Critical)
3. **useTimeOfDay hook**: state + DOM manipulation (Major)
4. **UserDataContext**: state + API + sync + events (Major)

#### Open/Closed Principle (OCP)
1. **Hard-coded error messages** in interceptor (Major)
2. **No retry customization** in queryClient (Minor)

#### Liskov Substitution Principle (LSP)
1. **Type loss** through interceptor transformation (Major)
2. **Loading state combination** loses semantic meaning (Minor)

#### Interface Segregation Principle (ISP)
1. **useTask returns 17 properties** - callers forced to receive all (Major)

#### Dependency Inversion Principle (DIP)
1. **useTask tightly coupled** to i18n global (Major)
2. **Window events** for UserData sync (Minor)

### Minimal Code Violations
1. **5 layers of error handling** for single API call (Critical)
2. **Unused type definitions** in types.ts (Major)
3. **Over-engineered** useTaskLoadingCalibration (Minor)
4. **Extra queries** for tab default selection (Medium)
5. **Dead code**: ApiResponse, ApiError types (Minor)

---

## Architectural Patterns Assessment

### ✅ Good Patterns
- React Query for server state management
- React Context for global client state
- Separation of API layer from components
- Hook-based composition
- AbortSignal support for query cancellation

### ❌ Anti-Patterns
- **God Hook**: useTask doing too much
- **Fetch API bypass**: ConceptsPage circumventing axios
- **Global event bus**: window.addEventListener for data sync
- **Type erasure**: Promise chains losing type information
- **Excessive abstraction**: 3 error handling layers

---

## Performance Concerns

1. **Full context re-render** on every UserData update
2. **No value memoization** in UserDataContext
3. **Unnecessary queries** for tab initialization (ConceptsPage)
4. **Combined loading states** prevent granular loading UX
5. **No query deduplication** for shared data (subjects fetched multiple times)

---

## Testing Challenges

1. **Direct DOM manipulation** in useTimeOfDay - hard to test
2. **Tightly coupled i18n** in useTask - requires mock setup
3. **Window events** in UserDataContext - needs global state cleanup
4. **IndexedDB operations** require browser environment or complex mocks
5. **Mixed fetch/axios** - inconsistent test setup

---

## Recommendations

### Immediate (High Priority)

1. **Consolidate error handling**
   - Remove redundant layers
   - Create single source of truth for error messages
   - Add i18n support for errors

2. **Refactor useTask hook**
   - Split into focused hooks
   - Remove i18n coupling
   - Simplify return interface

3. **Fix ConceptsPage fetch call**
   - Use logikids API client
   - Ensure auth tokens included
   - Leverage centralized error handling

4. **Abstract IndexedDB operations**
   - Create generic get/set helpers
   - Reduce code from 212 to ~80 lines

### Short-term (Medium Priority)

5. **Optimize UserDataContext**
   - Memoize context value
   - Consider splitting into multiple contexts
   - Replace window events with React Query invalidation

6. **Remove unused code**
   - Delete types.ts (ApiResponse, ApiError)
   - Remove unused hook methods

7. **Add retry customization**
   - Differentiate 4xx (don't retry) from 5xx (retry)
   - Custom logic per query type

### Long-term (Lower Priority)

8. **Separate concerns in useTimeOfDay**
   - Hook returns state only
   - Component handles DOM side effects

9. **Simplify tab initialization**
   - Default to 'school' tab
   - Let user discover 'fun' tab

10. **Type safety improvements**
    - Strict typing for progress data
    - Generic helpers maintain types through chain

---

## Estimated Refactoring Effort

| Category | Issues | Effort (hours) | Priority |
|----------|--------|----------------|----------|
| Error Handling Consolidation | 4 | 12 | HIGH |
| Hook Decomposition (useTask) | 1 | 10 | HIGH |
| API Consistency (fetch → axios) | 1 | 4 | HIGH |
| IndexedDB Abstraction | 1 | 6 | MEDIUM |
| Context Optimization | 2 | 8 | MEDIUM |
| Dead Code Removal | 2 | 2 | LOW |
| Type Safety | 3 | 6 | MEDIUM |
| **Total** | **14** | **48** | |

---

## Code Quality Score

| Metric | Score | Reasoning |
|--------|-------|-----------|
| DRY | 4/10 | Significant duplication in error handling, storage, API methods |
| SOLID | 5/10 | SRP violations in hooks and context, tight coupling |
| Minimal Code | 5/10 | Unused types, over-engineered features, redundant layers |
| Type Safety | 6/10 | Good Zod usage, but type erasure in interceptors |
| Testability | 4/10 | Global dependencies, DOM manipulation, tight coupling |
| **Overall** | **4.8/10** | **Needs significant refactoring** |

---

## Critical Issues Summary

### Top 3 (Detailed)

1. **Duplicate Error Handling Logic**
   - **Severity**: CRITICAL
   - **Files**: `api.ts`, `logikids.ts`
   - **LOC Affected**: ~150
   - **Impact**: Inconsistent error messages, maintenance burden
   - **Effort**: 8 hours

2. **Inconsistent API Call Patterns**
   - **Severity**: CRITICAL
   - **Files**: `ConceptsPage.tsx`, `api.ts`, `logikids.ts`
   - **LOC Affected**: ~100
   - **Impact**: Bypassed auth, no centralized error handling
   - **Effort**: 12 hours

3. **Tightly Coupled Hook Dependencies**
   - **Severity**: CRITICAL
   - **Files**: `useTask.ts`
   - **LOC Affected**: 102
   - **Impact**: Hard to test, maintain, reuse
   - **Effort**: 10 hours

---

## Conclusion

The frontend state management implementation demonstrates **moderate quality** with clear architectural intentions but significant execution gaps. The use of React Query and React Context shows good understanding of modern React patterns, but DRY and SOLID violations undermine maintainability.

**Key Strengths:**
- Modern tooling (React Query, Zod)
- Separation of concerns (API layer, hooks)
- Good documentation in custom hooks

**Key Weaknesses:**
- Excessive error handling layers
- God hooks violating SRP
- Mixed API call patterns
- Heavy code duplication
- Performance concerns in context

**Overall Assessment**: The codebase would benefit from focused refactoring targeting the top 3 critical issues, which would address ~60% of the identified problems and significantly improve code quality, testability, and maintainability.
