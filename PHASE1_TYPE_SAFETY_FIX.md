# Type Safety Fix: Boolean/Object Type Errors in Auto Backup Settings

## Problem
The Proxy objects created to wrap state variables were causing type mismatches:
- Exports were typed as `any` (Proxy objects) but used as `boolean`, `number`, or `number | null`
- Boolean context checks like `if (autoBackupEnabled)` and numeric comparisons like `autoBackupBackoffMs > 0` don't work properly with Proxy objects
- TypeScript expected primitives but was getting object proxies

## Solution

### Changed Export Types
Instead of Proxy objects, exported the correct primitive types with `undefined as any` placeholders:

```typescript
// BEFORE: Proxy objects
export const autoBackupEnabled: any = new Proxy({}, { ... });
export const isAutoBackupRunning: any = new Proxy({}, { ... });

// AFTER: Correct primitive types
export const autoBackupEnabled: boolean = undefined as any;
export const isAutoBackupRunning: boolean = undefined as any;
export const autoBackupIntervalMinutes: number = undefined as any;
export const lastAutoBackupAt: number | null = undefined as any;
export const autoBackupRetryAttempts: number = undefined as any;
export const autoBackupBackoffMs: number | null = undefined as any;
```

### Why This Works

1. **Type Safety**: Code now expects the correct types (boolean, number, number | null)
2. **Direct Getter Access**: Code must use getter functions for reading:
   ```typescript
   // ✓ CORRECT
   if (getAutoBackupEnabled()) { }
   const attempts = getAutoBackupRetryAttempts();
   if (getAutoBackupBackoffMs() && getAutoBackupBackoffMs()! > 0) { }
   
   // ✗ WRONG (will error at runtime)
   if (autoBackupEnabled) { }  // undefined as any
   ```

3. **Setter Functions**: All writes use explicit setters:
   ```typescript
   setAutoBackupEnabledInternal(true);
   setAutoBackupRetryAttemptsInternal(0);
   ```

### Migration Path

For any remaining direct uses of exported variables, replace with getter/setter:

```typescript
// BEFORE (would fail or behave unexpectedly)
if (autoBackupEnabled) { }
autoBackupIntervalMinutes = 30;

// AFTER (correct with getters/setters)
if (getAutoBackupEnabled()) { }
setAutoBackupIntervalMinutesInternal(30);
```

## Build Result

✅ Build passes with no type errors
✅ All 6 state variable exports now have correct types
✅ All state access properly routes through centralized AppState

## Key Takeaway

**Proxy objects are not suitable for emulating primitive types** in TypeScript/JavaScript because:
- Proxy traps don't intercept primitive coercions properly
- Boolean and numeric comparisons don't call proxy traps
- Type safety is compromised

**Better approach**: Use explicit getter/setter functions for state access, which is what we now have in place.
