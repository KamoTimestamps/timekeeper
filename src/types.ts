/**
 * Type definitions for Timekeeper
 * Provides comprehensive typing for model, view, and utilities
 */

// ============================================================================
// YouTube Player Types
// ============================================================================

export interface YouTubePlayer {
  getCurrentTime(): number;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  getPlayerState(): number;
  seekToLiveHead(): void;
  getVideoData(): YouTubeVideoData;
  getDuration(): number;
  getProgressState?(): ProgressState;
}

export interface YouTubeVideoData {
  video_id: string;
  isLive?: boolean;
  author?: string;
  title?: string;
}

export interface ProgressState {
  seekableEnd?: number;
  liveHead?: number;
  head?: number;
  duration?: number;
  current?: number;
}

// ============================================================================
// Window Extensions
// ============================================================================

export interface TimekeeperWindow extends Window {
  recalculateTimestampsArea?: () => void;
}

// ============================================================================
// Timestamp Model Types
// ============================================================================

export interface TimestampRecord {
  guid: string;
  start: number;
  comment: string;
}

export interface TimestampData {
  guid: string;
  start: number;
  comment: string;
  highlighted?: boolean;
  deleteConfirmed?: boolean;
}

// ============================================================================
// GoogleDrive Module Types
// ============================================================================

export interface GoogleDriveModule {
  setLoadGlobalSettings?(fn: (key: string) => Promise<unknown>): void;
  setSaveGlobalSettings?(fn: (key: string, value: unknown) => Promise<void>): void;
  handleOAuthPopup?(): Promise<boolean>;
  loadGoogleAuthState?(): Promise<void>;
  setBuildExportPayload?(fn: () => Promise<ExportPayload>): void;
  setBackupStatusIndicator?(element: HTMLSpanElement | null): void;
  updateBackupStatusIndicator?(): void;
  updateBackupStatusDisplay?(): void;
  googleAuthState?: GoogleAuthState;
  verifySignedIn?(): Promise<void>;
}

export interface ExportPayload {
  json: string;
  filename: string;
  totalVideos: number;
  totalTimestamps: number;
}

export interface GoogleAuthState {
  isSignedIn: boolean;
}

// ============================================================================
// DOM Element Extensions
// ============================================================================

export interface HTMLElementWithDeleteHandler extends HTMLElement {
  __deleteHandler?: () => void;
}

export interface HTMLInputElementWithLi extends HTMLInputElement {
  __ytls_li?: HTMLLIElement;
}

export interface HTMLElementWithTooltip extends HTMLElement {
  __tooltipObserver?: ResizeObserver;
  __tooltipCleanup?: () => void;
}

// ============================================================================
// Web Component Types
// ============================================================================

export interface TkTimestampElement extends HTMLElement {
  guid: string;
  start: number;
  comment: string;
  deleteConfirmed: boolean;
  highlighted: boolean;
  startTime: number;
  anchorElement?: HTMLAnchorElement;
  commentInputElement?: HTMLInputElement;
  timeDiffElement?: HTMLSpanElement;
  indentToggleElement?: HTMLSpanElement;
  setDeleteConfirmed(confirmed: boolean): void;
  setHighlighted(highlighted: boolean): void;
  syncFromModel(model: TimestampData): void;
}

// ============================================================================
// UI Types
// ============================================================================

export interface PanePosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface ButtonConfig {
  label: string;
  title: string;
  action: (this: HTMLButtonElement, e?: Event) => void | Promise<void>;
}

// ============================================================================
// Database Types
// ============================================================================

export type LogLevel = 'log' | 'debug' | 'info' | 'warn' | 'error';

export interface VideoData {
  video_id: string;
  timestamps: TimestampRecord[];
}

// ============================================================================
// Helper Types
// ============================================================================

export type Nullable<T> = T | null | undefined;

export type Optional<T> = T | undefined;

export interface Result<T, E = Error> {
  ok: boolean;
  value?: T;
  error?: E;
}

export type ValidationResult = Result<{ ok: true; videoId: string }, { ok: false; message: string }>;
// ============================================================================
// Callback Types
// ============================================================================

export type BuildExportPayloadFn = () => Promise<ExportPayload>;

export type SaveGlobalSettingsFn = (key: string, value: unknown) => Promise<void>;

export type LoadGlobalSettingsFn = (key: string) => Promise<unknown>;
