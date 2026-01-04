import { z } from 'zod';

const GuidSchema = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return crypto.randomUUID();
}, z.string());

export const TimestampRecordSchema = z.object({
  guid: GuidSchema,
  start: z.number().finite().nonnegative(),
  comment: z.string(),
});

export const TimestampRecordArraySchema = TimestampRecordSchema.array();
export type TimestampRecord = z.infer<typeof TimestampRecordSchema>;

export const TimestampRowSchema = TimestampRecordSchema.extend({
  video_id: z.string(),
});
export type TimestampRow = z.infer<typeof TimestampRowSchema>;

export const PanePositionSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite().positive().optional(),
  height: z.number().finite().positive().optional(),
});
export type PanePosition = z.infer<typeof PanePositionSchema>;

export const LegacyVideoEntrySchema = z.object({
  video_id: z.string(),
  timestamps: TimestampRecordArraySchema,
});
export const LegacyExportDataSchema = z.record(LegacyVideoEntrySchema);
export type LegacyVideoEntry = z.infer<typeof LegacyVideoEntrySchema>;

const GoogleAuthStateObjectSchema = z.object({
  isSignedIn: z.boolean().catch(false),
  accessToken: z.string().nullable().catch(null),
  userName: z.string().nullable().catch(null),
  email: z.string().nullable().catch(null),
});

export const GoogleAuthStateSchema = z.union([
  GoogleAuthStateObjectSchema,
  z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      return GoogleAuthStateObjectSchema.parse(parsed);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid JSON string for auth state',
      });
      return z.NEVER;
    }
  }),
]).catch({
  isSignedIn: false,
  accessToken: null,
  userName: null,
  email: null,
});

export type GoogleAuthStateParsed = z.infer<typeof GoogleAuthStateObjectSchema>;

export const AutoBackupSettingsSchema = z.object({
  autoBackupEnabled: z.boolean(),
  autoBackupIntervalMinutes: z.number().positive(),
  lastAutoBackupAt: z.number().int().positive().nullable().optional(),
});
export type AutoBackupSettings = z.infer<typeof AutoBackupSettingsSchema>;

// OAuth message schemas
export const OAuthTokenMessageSchema = z.object({
  type: z.literal('timekeeper_oauth_token'),
  token: z.string().min(1),
  timestamp: z.number().optional(),
});

export const OAuthErrorMessageSchema = z.object({
  type: z.literal('timekeeper_oauth_error'),
  error: z.string(),
  timestamp: z.number().optional(),
});

export const OAuthMessageSchema = z.union([
  OAuthTokenMessageSchema,
  OAuthErrorMessageSchema,
]);

export type OAuthMessage = z.infer<typeof OAuthMessageSchema>;

// Google API user info response schema
export const GoogleUserInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  id: z.string().optional(),
  picture: z.string().url().optional(),
});

export type GoogleUserInfo = z.infer<typeof GoogleUserInfoSchema>;
