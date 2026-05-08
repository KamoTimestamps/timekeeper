/**
 * YouTube Player interface
 * Typed subset of the YouTube iframe/embedded player API used by Timekeeper.
 */

export interface VideoData {
  isLive?: boolean;
  video_id?: string;
  title?: string;
  [key: string]: unknown;
}

export interface ProgressState {
  seekableEnd?: number;
  liveHead?: number;
  head?: number;
  duration?: number;
  current?: number;
}

export interface Player {
  getCurrentTime(): number;
  getDuration(): number;
  getVideoData(): VideoData | null;
  seekTo(time: number): void;
  seekToLiveHead(): void;
  setPlaybackRate(rate: number): void;
  getProgressState?(): ProgressState | null;
}
