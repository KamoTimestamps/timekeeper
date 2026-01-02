/**
 * Custom tooltip system for Timekeeper
 * Creates styled tooltips that appear after a delay
 */

let tooltipElement: HTMLDivElement | null = null;
let tooltipTimeout: ReturnType<typeof setTimeout> | null = null;
const TOOLTIP_DELAY = 500; // milliseconds

/**
 * Initialize the tooltip element
 */
function ensureTooltipElement(): HTMLDivElement {
  if (!tooltipElement || !document.body.contains(tooltipElement)) {
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'ytls-tooltip';
    document.body.appendChild(tooltipElement);
  }
  return tooltipElement;
}

/**
 * Position the tooltip near the mouse cursor
 */
function positionTooltip(tooltip: HTMLDivElement, mouseX: number, mouseY: number) {
  const offset = 10;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Get tooltip dimensions
  const rect = tooltip.getBoundingClientRect();
  const tooltipWidth = rect.width;
  const tooltipHeight = rect.height;

  // Default position: below and to the right of cursor
  let left = mouseX + offset;
  let top = mouseY + offset;

  // Adjust if tooltip would go off right edge
  if (left + tooltipWidth > viewportWidth - offset) {
    left = mouseX - tooltipWidth - offset;
  }

  // Adjust if tooltip would go off bottom edge
  if (top + tooltipHeight > viewportHeight - offset) {
    top = mouseY - tooltipHeight - offset;
  }

  // Ensure tooltip stays within viewport
  left = Math.max(offset, Math.min(left, viewportWidth - tooltipWidth - offset));
  top = Math.max(offset, Math.min(top, viewportHeight - tooltipHeight - offset));

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

/**
 * Show tooltip with delay
 */
function showTooltip(content: string | HTMLElement, mouseX: number, mouseY: number, immediate = false) {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  }

  const doShow = () => {
    const tooltip = ensureTooltipElement();
    // Set content (string or HTMLElement) without using innerHTML
    if (typeof content === 'string') {
      tooltip.textContent = content;
    } else {
      // Remove children safely
      while (tooltip.firstChild) {
        tooltip.removeChild(tooltip.firstChild);
      }
      tooltip.appendChild(content.cloneNode(true) as Node);
    }
    tooltip.classList.remove('ytls-tooltip-visible');

    // Position first (with opacity 0) to get correct dimensions
    positionTooltip(tooltip, mouseX, mouseY);

    // Then show with fade-in
    requestAnimationFrame(() => {
      tooltip.classList.add('ytls-tooltip-visible');
    });
  };

  if (immediate) {
    // Show immediately
    doShow();
  } else {
    tooltipTimeout = setTimeout(doShow, TOOLTIP_DELAY);
  }
}

/**
 * Hide tooltip immediately
 */
function hideTooltip() {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  }

  if (tooltipElement) {
    tooltipElement.classList.remove('ytls-tooltip-visible');
  }
}

/**
 * Add tooltip to an element
 * @param element - The element to add tooltip to
 * @param getText - Function that returns tooltip text, or a string
 */
export function addTooltip(element: HTMLElement, getText: string | HTMLElement | (() => string | HTMLElement)) {
  let lastMouseX = 0;
  let lastMouseY = 0;

  // Store getText and last mouse coordinates on the element so it can be refreshed externally
  (element as any).__tooltipGetText = getText;
  (element as any).__tooltipLastMouseX = lastMouseX;
  (element as any).__tooltipLastMouseY = lastMouseY;

  const handleMouseEnter = (e: MouseEvent) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    (element as any).__tooltipLastMouseX = lastMouseX;
    (element as any).__tooltipLastMouseY = lastMouseY;
    const content = typeof getText === 'function' ? getText() : getText;
    if (content) {
      showTooltip(content, lastMouseX, lastMouseY);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    (element as any).__tooltipLastMouseX = lastMouseX;
    (element as any).__tooltipLastMouseY = lastMouseY;
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  // Store cleanup function on element for later removal if needed
  (element as any).__tooltipCleanup = () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Remove tooltip from an element
 */
export function removeTooltip(element: HTMLElement) {
  if ((element as any).__tooltipCleanup) {
    (element as any).__tooltipCleanup();
    delete (element as any).__tooltipCleanup;
  }
}

/**
 * Refresh tooltip content for an element that has a tooltip attached.
 * If the tooltip is currently visible, the new content will be shown immediately.
 */
export function refreshTooltip(element: HTMLElement) {
  const getText = (element as any).__tooltipGetText;
  if (!getText) return;
  const lastX = (element as any).__tooltipLastMouseX ?? Math.floor(window.innerWidth / 2);
  const lastY = (element as any).__tooltipLastMouseY ?? Math.floor(window.innerHeight / 2);
  const content = typeof getText === 'function' ? getText() : getText;
  if (!content) return;
  const isVisible = tooltipElement && tooltipElement.classList.contains('ytls-tooltip-visible');
  showTooltip(content, lastX, lastY, !!isVisible);
}
