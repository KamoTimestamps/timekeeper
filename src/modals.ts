/**
 * Modal Utilities
 * Pure helper functions for creating, showing, and closing modal dialogs.
 */

/**
 * Create a close handler that fades out and removes a modal from the DOM.
 * Optionally calls an onClose callback after removal.
 */
export function createModalCloseHandler(
  modal: HTMLElement,
  onClose?: () => void,
): () => void {
  return () => {
    modal.classList.remove("ytls-fade-in");
    modal.classList.add("ytls-fade-out");
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
      if (onClose) {
        onClose();
      }
    }, 300);
  };
}

/**
 * Create a keyboard handler that closes a modal on Escape key.
 */
export function createEscapeKeyHandler(closeHandler: () => void): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeHandler();
    }
  };
}

/**
 * Register an escape key handler on the document (deferred one tick to avoid
 * immediately catching the keypress that opened the modal).
 */
export function registerModalEscapeHandler(
  escapeHandler: (event: KeyboardEvent) => void,
): void {
  setTimeout(() => {
    document.addEventListener("keydown", escapeHandler);
  }, 0);
}

/**
 * Create a click-outside handler that closes a modal when clicking outside it.
 */
export function createClickOutsideHandler(
  modal: HTMLElement,
  closeHandler: () => void,
): (event: MouseEvent) => void {
  return (event: MouseEvent) => {
    if (!modal.contains(event.target as Node)) {
      closeHandler();
    }
  };
}

/**
 * Register a click-outside handler on the document (deferred one tick).
 */
export function registerModalClickOutsideHandler(
  clickOutsideHandler: (event: MouseEvent) => void,
): void {
  setTimeout(() => {
    document.addEventListener("click", clickOutsideHandler, true);
  }, 0);
}
