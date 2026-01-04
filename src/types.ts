// Type definitions for Timekeeper

// YouTube Player types
export interface YouTubePlayer {
  getCurrentTime(): number;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  getPlayerState(): number;
  seekToLiveHead(): void;
  getVideoData(): YouTubeVideoData;
  getDuration(): number;
  getProgressState?(): {
    seekableEnd?: number;
    liveHead?: number;
    head?: number;
    duration?: number;
    current?: number;
  };
}

export interface YouTubeVideoData {
  video_id: string;
  isLive?: boolean;
  author?: string;
  title?: string;
}

// Window extensions
export interface TimekeeperWindow extends Window {
  recalculateTimestampsArea?: () => void;
}

// GoogleDrive module interface (for type-safe access)
export interface GoogleDriveModule {
  setLoadGlobalSettings?(fn: (key: string) => Promise<unknown>): void;
  setSaveGlobalSettings?(fn: (key: string, value: unknown) => Promise<void>): void;
  handleOAuthPopup?(): Promise<boolean>;
  loadGoogleAuthState?(): Promise<void>;
  setBuildExportPayload?(fn: () => Promise<{ json: string; filename: string; totalVideos: number; totalTimestamps: number }>): void;
  setBackupStatusIndicator?(element: HTMLSpanElement | null): void;
  updateBackupStatusIndicator?(): void;
  updateBackupStatusDisplay?(): void;
}

// DOM element extensions (for storing custom properties)
export interface HTMLElementWithDeleteHandler extends HTMLElement {
  __deleteHandler?: () => void;
}

export interface HTMLInputElementWithLi extends HTMLInputElement {
  __ytls_li?: HTMLLIElement;
}

// Position data
export interface PanePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}
