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
function showTooltip(text: string, mouseX: number, mouseY: number) {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }

  tooltipTimeout = setTimeout(() => {
    const tooltip = ensureTooltipElement();
    tooltip.textContent = text;
    tooltip.classList.remove('ytls-tooltip-visible');

    // Position first (with opacity 0) to get correct dimensions
    positionTooltip(tooltip, mouseX, mouseY);

    // Then show with fade-in
    requestAnimationFrame(() => {
      tooltip.classList.add('ytls-tooltip-visible');
    });
  }, TOOLTIP_DELAY);
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
export function addTooltip(element: HTMLElement, getText: string | (() => string)) {
  let lastMouseX = 0;
  let lastMouseY = 0;

  const handleMouseEnter = (e: MouseEvent) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    const text = typeof getText === 'function' ? getText() : getText;
    if (text) {
      showTooltip(text, lastMouseX, lastMouseY);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  // Also observe for element being removed or hidden so we can hide tooltip
  const observer = new MutationObserver(() => {
    // If element is removed from the document or becomes hidden, hide tooltip
    try {
      if (!document.body.contains(element)) {
        hideTooltip();
      } else {
        const cs = window.getComputedStyle(element);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') {
          hideTooltip();
        }
      }
    } catch (e) {
      // ignore
    }
  });
  // Observe attribute changes on the element (class/style) and DOM changes under body
  try {
    observer.observe(element, { attributes: true, attributeFilter: ['class', 'style'] });
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {
    // ignore if observer cannot be created
  }

  // Store cleanup function on element for later removal if needed
  (element as any).__tooltipCleanup = () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    try { observer.disconnect(); } catch (_) {}
    delete (element as any).__tooltipObserver;
  };
  (element as any).__tooltipObserver = observer;
}

/**
 * Remove tooltip from an element
 */
export function removeTooltip(element: HTMLElement) {
  if ((element as any).__tooltipCleanup) {
    (element as any).__tooltipCleanup();
    delete (element as any).__tooltipCleanup;
  }
  // Ensure tooltip is hidden when tooltip is explicitly removed
  hideTooltip();
}
