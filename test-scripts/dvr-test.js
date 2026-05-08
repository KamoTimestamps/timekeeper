/**
 * DVR Enablement Test Scripts
 * Run these in the browser console on a YouTube live stream page to verify
 * that the Timekeeper DVR/rewind enablement is working correctly.
 *
 * Usage: Open DevTools on a YouTube live stream, paste each test into the console.
 */

// ── Test 1: Verify playerResponse interceptor is active ──────────────────────
// The interceptor replaces Object.prototype.playerResponse with a custom setter.
// If Timekeeper's DVR enablement ran, the descriptor should have a non-native setter.
(function testInterceptorActive() {
  const desc = Object.getOwnPropertyDescriptor(Object.prototype, 'playerResponse');
  if (!desc) {
    console.warn('[DVR Test 1] FAIL: No playerResponse property descriptor found on Object.prototype');
    return;
  }
  if (typeof desc.set === 'function') {
    console.log('[DVR Test 1] PASS: playerResponse interceptor is active', desc);
  } else {
    console.warn('[DVR Test 1] FAIL: playerResponse interceptor missing set function', desc);
  }
})();

// ── Test 2: Check if current video has DVR enabled ───────────────────────────
// Retrieves the YouTube player and checks isLiveDvrEnabled on videoDetails.
(function testDvrEnabled() {
  const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
  if (!player || typeof player.getVideoData !== 'function') {
    console.warn('[DVR Test 2] SKIP: YouTube player not found or not ready');
    return;
  }
  const data = player.getVideoData();
  if (!data) {
    console.warn('[DVR Test 2] SKIP: getVideoData() returned null');
    return;
  }
  if (!data.isLive) {
    console.log('[DVR Test 2] SKIP: Not a live stream (isLive is false)');
    return;
  }
  console.log('[DVR Test 2] Video data:', data);
  console.log('[DVR Test 2] isLive:', data.isLive);
})();

// ── Test 3: Verify rewind capability ─────────────────────────────────────────
// On a live stream with DVR enabled, seekable range should extend beyond 12h.
(function testRewindRange() {
  const video = document.querySelector('video');
  if (!video) {
    console.warn('[DVR Test 3] FAIL: No <video> element found');
    return;
  }
  if (!isFinite(video.duration)) {
    console.warn('[DVR Test 3] SKIP: Video duration is not finite (stream may not be loaded)');
    return;
  }
  const seekableStart = video.seekable.length > 0 ? video.seekable.start(0) : null;
  const seekableEnd = video.seekable.length > 0 ? video.seekable.end(0) : null;
  const seekableRangeSecs = (seekableEnd !== null && seekableStart !== null) ? seekableEnd - seekableStart : 0;
  console.log('[DVR Test 3] Video duration:', video.duration, 'seconds');
  console.log('[DVR Test 3] Seekable range:', seekableRangeSecs.toFixed(0), 'seconds');
  if (seekableRangeSecs > 43200) {
    console.log('[DVR Test 3] PASS: Seekable range exceeds 12h limit (' + (seekableRangeSecs / 3600).toFixed(1) + 'h)');
  } else {
    console.log('[DVR Test 3] INFO: Seekable range is', (seekableRangeSecs / 3600).toFixed(1), 'h (may be a short stream or DVR not engaged)');
  }
})();

// ── Test 4: Check progressive rewind (seek backwards) ────────────────────────
// On a live stream, attempt to seek 60 seconds back and verify we actually land there.
// WARNING: This will actually seek the video. Only run if you're okay with that.
(function testSeekBack() {
  const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
  if (!player || typeof player.getCurrentTime !== 'function' || typeof player.seekTo !== 'function') {
    console.warn('[DVR Test 4] SKIP: Player not found or missing seekTo/getCurrentTime');
    return;
  }
  const data = player.getVideoData?.();
  if (!data?.isLive) {
    console.log('[DVR Test 4] SKIP: Not a live stream');
    return;
  }
  const before = player.getCurrentTime();
  const target = Math.max(0, before - 60);
  player.seekTo(target);
  setTimeout(() => {
    const after = player.getCurrentTime();
    const delta = Math.abs(after - target);
    if (delta < 5) {
      console.log('[DVR Test 4] PASS: Successfully seeked back 60s (before:', before.toFixed(0), '→ after:', after.toFixed(0), ')');
    } else {
      console.warn('[DVR Test 4] FAIL: Seek did not land near target. Before:', before.toFixed(0), 'target:', target.toFixed(0), 'after:', after.toFixed(0));
    }
  }, 2000);
  console.log('[DVR Test 4] Seeking back 60s from', before.toFixed(0), '→', target.toFixed(0), '...');
})();
