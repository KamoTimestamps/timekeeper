'use strict';

// Loaded in <head>, before the stylesheet paints, so a saved light/dark choice never flashes the
// other theme. "Auto" is the absence of the attribute: the stylesheet then follows the OS setting.
(() => {
  try {
    const theme = localStorage.getItem('tk-theme');
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  } catch {
    // Storage blocked (private window, site data off): stay on auto.
  }
})();
