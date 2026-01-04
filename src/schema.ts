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

export const GoogleAuthStateSchema = z.object({
  isSignedIn: z.boolean(),
  accessToken: z.string().nullable(),
  userName: z.string().nullable(),
  email: z.string().nullable(),
});
export type GoogleAuthStateParsed = z.infer<typeof GoogleAuthStateSchema>;

export const AutoBackupSettingsSchema = z.object({
  autoBackupEnabled: z.boolean(),
  autoBackupIntervalMinutes: z.number().positive(),
  lastAutoBackupAt: z.number().int().positive().nullable().optional(),
});
export type AutoBackupSettings = z.infer<typeof AutoBackupSettingsSchema>;
