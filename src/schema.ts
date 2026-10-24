// Minimal runtime validation. Mirrors the small slice of zod we used:
// objects strip unknown keys, `catchWith` swaps in a fallback on any failure,
// and `safeParse` never throws.

export class SchemaError extends Error {}

// Not a discriminated union: narrowing on `success` doesn't work with strictNullChecks off.
export interface SafeParseResult<T> {
  success: boolean;
  data?: T;
  error?: SchemaError;
}

type Parser<T> = (value: unknown, path: string) => T;

export interface Schema<T> {
  /** Path-aware parser used by combinators; prefer parse/safeParse elsewhere. */
  run: Parser<T>;
  parse(value: unknown): T;
  safeParse(value: unknown): SafeParseResult<T>;
  array(): Schema<T[]>;
}

export interface ObjectSchema<T> extends Schema<T> {
  extend<U>(shape: Shape<U>): ObjectSchema<T & U>;
  partial(): ObjectSchema<Partial<T>>;
}

type Shape<T> = { [K in keyof T]-?: Schema<T[K]> };

const fail = (path: string, expected: string): never => {
  throw new SchemaError(`${path || 'value'}: expected ${expected}`);
};

function define<T>(run: Parser<T>): Schema<T> {
  const self: Schema<T> = {
    run,
    parse: (value) => run(value, ''),
    safeParse: (value) => {
      try {
        return { success: true, data: run(value, '') };
      } catch (err) {
        if (err instanceof SchemaError) return { success: false, error: err };
        throw err;
      }
    },
    array: () => array(self),
  };
  return self;
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export function string(): Schema<string> {
  return define((v, p) => (typeof v === 'string' ? v : fail(p, 'string')));
}

export function boolean(): Schema<boolean> {
  return define((v, p) => (typeof v === 'boolean' ? v : fail(p, 'boolean')));
}

export function number(opts: {
  finite?: boolean;
  int?: boolean;
  nonnegative?: boolean;
  positive?: boolean;
  min?: number;
  max?: number;
} = {}): Schema<number> {
  return define((v, p) => {
    if (typeof v !== 'number' || Number.isNaN(v)) return fail(p, 'number');
    if (opts.finite && !Number.isFinite(v)) fail(p, 'finite number');
    if (opts.int && !Number.isInteger(v)) fail(p, 'integer');
    if (opts.nonnegative && v < 0) fail(p, 'number >= 0');
    if (opts.positive && v <= 0) fail(p, 'number > 0');
    if (opts.min !== undefined && v < opts.min) fail(p, `number >= ${opts.min}`);
    if (opts.max !== undefined && v > opts.max) fail(p, `number <= ${opts.max}`);
    return v;
  });
}

export function optional<T>(s: Schema<T>): Schema<T | undefined> {
  return define((v, p) => (v === undefined ? undefined : s.run(v, p)));
}

export function nullable<T>(s: Schema<T>): Schema<T | null> {
  return define((v, p) => (v === null ? null : s.run(v, p)));
}

/** Returns `fallback` whenever `s` rejects the value. */
export function catchWith<T>(s: Schema<T>, fallback: T): Schema<T> {
  return define((v, p) => {
    try {
      return s.run(v, p);
    } catch (err) {
      if (err instanceof SchemaError) return fallback;
      throw err;
    }
  });
}

export function array<T>(item: Schema<T>): Schema<T[]> {
  return define((v, p) => {
    if (!Array.isArray(v)) return fail(p, 'array');
    return v.map((el, i) => item.run(el, `${p}[${i}]`));
  });
}

export function record<T>(item: Schema<T>): Schema<Record<string, T>> {
  return define((v, p) => {
    if (!isPlainObject(v)) return fail(p, 'object');
    const out: Record<string, T> = {};
    for (const key of Object.keys(v)) out[key] = item.run(v[key], p ? `${p}.${key}` : key);
    return out;
  });
}

export function object<T>(shape: Shape<T>): ObjectSchema<T> {
  const base = define<T>((v, p) => {
    if (!isPlainObject(v)) return fail(p, 'object');
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(shape)) {
      const parsed = (shape as Record<string, Schema<unknown>>)[key].run(v[key], p ? `${p}.${key}` : key);
      if (parsed !== undefined) out[key] = parsed;
    }
    return out as T;
  });
  return Object.assign(base, {
    extend: <U>(extra: Shape<U>) => object<T & U>({ ...shape, ...extra } as Shape<T & U>),
    partial: () => {
      const loose: Record<string, Schema<unknown>> = {};
      for (const key of Object.keys(shape)) loose[key] = optional((shape as Record<string, Schema<unknown>>)[key]);
      return object<Partial<T>>(loose as Shape<Partial<T>>);
    },
  });
}

// ---------------------------------------------------------------------------
// Application schemas
// ---------------------------------------------------------------------------

// Accepts any non-empty string as a GUID (UUIDs and legacy formats).
// Rejects missing or empty values — callers are responsible for generating
// GUIDs before calling save functions.
const GuidSchema = define<string>((v, p) =>
  typeof v === 'string' && v.length > 0 ? v : fail(p, 'non-empty string'),
);

export interface TimestampRecord {
  guid: string;
  start: number;
  comment: string;
  write_counter?: number;
  deleted_at?: number;
}

export const TimestampRecordSchema = object<TimestampRecord>({
  guid: GuidSchema,
  start: number({ finite: true, nonnegative: true }),
  comment: string(),
  write_counter: optional(number({ int: true, positive: true })),
  deleted_at: catchWith(optional(number()), undefined), // soft-deletion state for backup/restore sync
  // device_id is storage-only (TimestampRowSchema) and is intentionally excluded
  // from the export format.  write_counter and deleted_at cannot be excluded:
  // the merge comparison needs both to determine which version is newer and
  // whether the remote side considers the record deleted.
});

export const TimestampRecordArraySchema = TimestampRecordSchema.array();

export interface TimestampRow extends TimestampRecord {
  video_id: string;
  device_id?: string; // storage-only, not exported
}

export const TimestampRowSchema = TimestampRecordSchema.extend<{
  video_id: string;
  device_id?: string;
}>({
  video_id: string(),
  device_id: optional(string()),
}) as ObjectSchema<TimestampRow>;

export interface PanePosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export const PanePositionSchema = object<PanePosition>({
  x: number({ finite: true }),
  y: number({ finite: true }),
  width: optional(number({ finite: true, positive: true })),
  height: optional(number({ finite: true, positive: true })),
});

export const VideoEntrySchema = object<{ video_id: string; timestamps: TimestampRecord[] }>({
  video_id: string(),
  timestamps: TimestampRecordArraySchema,
});
export const ExportDataSchema = record(VideoEntrySchema);

export interface GoogleAuthStateParsed {
  isSignedIn: boolean;
  accessToken: string | null;
  userName: string | null;
  email: string | null;
}

const GoogleAuthStateObjectSchema = object<GoogleAuthStateParsed>({
  isSignedIn: catchWith(boolean(), false),
  accessToken: catchWith(nullable(string()), null),
  userName: catchWith(nullable(string()), null),
  email: catchWith(nullable(string()), null),
});

// Accepts either the state object or its JSON-encoded string; anything else
// (or malformed JSON) falls back to a signed-out state, so parsing never fails.
export const GoogleAuthStateSchema = catchWith(
  define<GoogleAuthStateParsed>((v, p) => {
    if (typeof v === 'string') {
      let parsed: unknown;
      try {
        parsed = JSON.parse(v);
      } catch {
        return fail(p, 'valid JSON string for auth state');
      }
      return GoogleAuthStateObjectSchema.run(parsed, p);
    }
    return GoogleAuthStateObjectSchema.run(v, p);
  }),
  { isSignedIn: false, accessToken: null, userName: null, email: null },
);

export interface AutoBackupSettings {
  autoBackupEnabled: boolean;
  autoBackupIntervalMinutes: number;
  lastAutoBackupAt?: number | null;
}

export const AutoBackupSettingsSchema = object<AutoBackupSettings>({
  autoBackupEnabled: boolean(),
  autoBackupIntervalMinutes: number({ int: true, min: 5, max: 1440 }),
  lastAutoBackupAt: optional(nullable(number({ int: true, positive: true }))),
});

export const BackupSettingsSchema = AutoBackupSettingsSchema;
export type BackupSettings = AutoBackupSettings;
