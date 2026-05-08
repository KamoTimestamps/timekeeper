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

/**
 * Show a custom text input modal that replaces window.prompt.
 * Returns a promise that resolves to the input value, or null if cancelled.
 */
export function showTextInputModal(
  title: string,
  defaultValue: string,
): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
     const overlay = document.createElement("div");
     overlay.id = "ytls-text-input-overlay";
     overlay.addEventListener("click", () => closeModal(null));

     const modal = document.createElement("div");
     modal.id = "ytls-text-input-modal";

     const titleEl = document.createElement("p");
     titleEl.textContent = title;
     titleEl.style.margin = "0 0 8px";

     const input = document.createElement("input");
     input.type = "text";
     input.value = defaultValue;
     input.style.cssText = "width:100%;box-sizing:border-box;padding:4px;";
     input.setAttribute("inputmode", "text");
     input.setAttribute("autocomplete", "off");

     const btnRow = document.createElement("div");
     btnRow.className = "ytls-modal-btn-row";

     const confirmBtn = document.createElement("button");
     confirmBtn.textContent = "OK";
     confirmBtn.style.cssText = "padding:4px 12px;";
     confirmBtn.addEventListener("click", () => closeModal(input.value));

     const cancelBtn = document.createElement("button");
     cancelBtn.textContent = "Cancel";
     cancelBtn.style.cssText = "padding:4px 12px;";
     cancelBtn.addEventListener("click", () => closeModal(null));

     btnRow.appendChild(confirmBtn);
     btnRow.appendChild(cancelBtn);

     modal.appendChild(titleEl);
     modal.appendChild(input);
     modal.appendChild(btnRow);

     document.body.appendChild(overlay);
     document.body.appendChild(modal);

       input.focus();
     input.select();

     input.addEventListener("keydown", (e: KeyboardEvent) => {
       if (e.key === "Enter") {
         e.preventDefault();
         closeModal(input.value);
         }
       if (e.key === "Escape") {
         e.preventDefault();
         closeModal(null);
         }
         });

     function closeModal(value: string | null): void {
       modal.classList.remove("ytls-fade-in");
       modal.classList.add("ytls-fade-out");
       overlay.classList.remove("ytls-fade-in");
       overlay.classList.add("ytls-fade-out");
       setTimeout(() => {
         if (document.body.contains(modal)) document.body.removeChild(modal);
         if (document.body.contains(overlay)) document.body.removeChild(overlay);
         }, 300);
       resolve(value);
        }
        });
}
