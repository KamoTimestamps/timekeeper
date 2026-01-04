/**
 * Custom tooltip system for Timekeeper
 * Creates styled tooltips that appear after a delay
 */

let tooltipElement: HTMLDivElement | null = null;
let tooltipTimeout: ReturnType<typeof setTimeout> | null = null;
const TOOLTIP_DELAY = 250; // milliseconds

// Active tooltip state
let activeTarget: HTMLElement | null = null;
let elementHovered = false;
let pendingHideTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Initialize the tooltip element
 */
function ensureTooltipElement(): HTMLDivElement {
  if (!tooltipElement || !document.body.contains(tooltipElement)) {
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'ytls-tooltip';
    // Make tooltip non-interactive so clicks pass through to underlying elements
    tooltipElement.style.pointerEvents = 'none';
    document.body.appendChild(tooltipElement);

    // Reposition tooltip on scroll/resize to stay anchored to the element
    window.addEventListener('scroll', repositionActiveTooltip, true);
    window.addEventListener('resize', repositionActiveTooltip, true);
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
 * Position tooltip relative to an element (preferred: above, else below)
 */
function positionTooltipNearElement(tooltip: HTMLDivElement, element: HTMLElement) {
  const offset = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const elRect = element.getBoundingClientRect();
  const rect = tooltip.getBoundingClientRect();
  const tooltipWidth = rect.width;
  const tooltipHeight = rect.height;

  // Prefer above the element, centered horizontally
  let left = Math.round(elRect.left + (elRect.width / 2) - (tooltipWidth / 2));
  let top = Math.round(elRect.top - tooltipHeight - offset);

  // If tooltip would go off top edge, place below instead
  if (top < offset) {
    top = Math.round(elRect.bottom + offset);
  }

  // If tooltip would go off left edge, align to left side of element
  if (left < offset) {
    left = Math.round(elRect.left);
  }

  // If tooltip would go off right edge, align to right side of element
  if (left + tooltipWidth > viewportWidth - offset) {
    left = Math.round(elRect.right - tooltipWidth);
  }

  // Final clamps to ensure tooltip stays within viewport
  left = Math.max(offset, Math.min(left, viewportWidth - tooltipWidth - offset));
  top = Math.max(offset, Math.min(top, viewportHeight - tooltipHeight - offset));

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function repositionActiveTooltip() {
  if (!tooltipElement || !activeTarget) return;
  if (!tooltipElement.classList.contains('ytls-tooltip-visible')) return;
  try {
    positionTooltipNearElement(tooltipElement, activeTarget);
  } catch (_) {}
}

function scheduleHideIfNeeded(delay = 50) {
  if (pendingHideTimeout) {
    clearTimeout(pendingHideTimeout);
    pendingHideTimeout = null;
  }
  // If the element is hovered, don't hide; tooltip itself is non-interactive so we don't track its hover
  if (elementHovered) return;
  pendingHideTimeout = setTimeout(() => {
    hideTooltip();
    pendingHideTimeout = null;
  }, delay);
}

/**
 * Show tooltip with delay
 */
function showTooltip(text: string, mouseX: number, mouseY: number, target?: HTMLElement) {
  // Cancel any pending hide operations since we're showing a new tooltip
  if (pendingHideTimeout) {
    clearTimeout(pendingHideTimeout);
    pendingHideTimeout = null;
  }

  // If there's already a visible tooltip for a different target, hide it immediately
  // to allow the new tooltip to show without confusion
  if (activeTarget && target && activeTarget !== target && tooltipElement?.classList.contains('ytls-tooltip-visible')) {
    tooltipElement.classList.remove('ytls-tooltip-visible');
  }

  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }

  // Mark the active target and hover state
  if (target) {
    activeTarget = target;
    elementHovered = true;
  }

  tooltipTimeout = setTimeout(() => {
    const tooltip = ensureTooltipElement();
    tooltip.textContent = text;
    tooltip.classList.remove('ytls-tooltip-visible');

    // Position first (with opacity 0) to get correct dimensions. If target is provided,
    // anchor the tooltip near the element; otherwise use the mouse position.
    if (target) {
      // Ensure layout has run so we can measure tooltip size correctly
      requestAnimationFrame(() => {
        positionTooltipNearElement(tooltip, target);
        // Then show with fade-in
        requestAnimationFrame(() => {
          tooltip.classList.add('ytls-tooltip-visible');
        });
      });
    } else {
      // Position using mouse coordinates
      positionTooltip(tooltip, mouseX, mouseY);
      // Then show with fade-in
      requestAnimationFrame(() => {
        tooltip.classList.add('ytls-tooltip-visible');
      });
    }
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

  if (pendingHideTimeout) {
    clearTimeout(pendingHideTimeout);
    pendingHideTimeout = null;
  }

  if (tooltipElement) {
    tooltipElement.classList.remove('ytls-tooltip-visible');
  }

  activeTarget = null;
  elementHovered = false;
}

export function hideActiveTooltip() {
  hideTooltip();
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

    // Cancel any pending hide operations immediately
    if (pendingHideTimeout) {
      clearTimeout(pendingHideTimeout);
      pendingHideTimeout = null;
    }

    elementHovered = true;
    activeTarget = element;
    const text = typeof getText === 'function' ? getText() : getText;
    if (text) {
      showTooltip(text, lastMouseX, lastMouseY, element);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    // Do not reposition tooltip to follow cursor; tooltip is anchored to element.
  };

  const handleMouseLeave = () => {
    // Only mark as not hovered if we're still the active target
    // This prevents race conditions when quickly moving between adjacent elements
    if (activeTarget === element) {
      elementHovered = false;
      scheduleHideIfNeeded();
    }
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  // Hide tooltip when the element is clicked, even if the mouse remains over it
  const handleClick = (e: Event) => {
    // Prevent default hide-suppression by mouse hover
    elementHovered = false;
    if (activeTarget === element) {
      hideTooltip();
    }
  };
  element.addEventListener('click', handleClick, true);

  // Also observe for element being removed or hidden so we can hide tooltip
  const observer = new MutationObserver(() => {
    // If element is removed from the document or becomes hidden, hide tooltip
    try {
      if (!document.body.contains(element)) {
        if (activeTarget === element) hideTooltip();
      } else {
        const cs = window.getComputedStyle(element);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') {
          if (activeTarget === element) hideTooltip();
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
    element.removeEventListener('click', handleClick, true);
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
