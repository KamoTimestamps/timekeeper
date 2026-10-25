'use strict';

// Loaded in <head>, before the stylesheet paints, so a saved light/dark choice never flashes the
// other theme. Sets data-theme-mode (the choice: auto, light or dark) and data-theme (what it
// resolves to: auto follows the OS). app.js owns the toggle and keeps these in step afterwards.
(() => {
  const root = document.documentElement;
  let mode = 'auto';
  try {
    const saved = localStorage.getItem('tk-theme');
    if (saved === 'light' || saved === 'dark') mode = saved;
  } catch {
    // Storage blocked (private window, site data off): stay on auto.
  }
  root.dataset.themeMode = mode;
  root.dataset.theme = mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode;
})();
