/**
 * Toast Notifications
 * Non-blocking replacement for alert() calls.
 */

type ToastType = 'error' | 'warn' | 'info';

export function showToast(message: string, type: ToastType = 'error', durationMs = 4000): void {
  const toast = document.createElement('div');
  toast.className = `ytls-toast ytls-toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger fade-in on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('ytls-toast-visible');
    });
  });

  setTimeout(() => {
    toast.classList.remove('ytls-toast-visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, durationMs);
}
