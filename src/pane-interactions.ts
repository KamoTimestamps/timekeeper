/**
 * Pane Interactions
 * Drag, resize, and scrollbar behavior for the Timekeeper floating pane.
 */

import { setMouseOverTimestamps } from './timestamp-view';
import { hideActiveTooltip } from './tooltip';

export interface PaneInteractionDeps {
  clampAndSavePanePosition: (save?: boolean) => void;
  savePanePosition: () => void;
  loadPanePosition: () => void;
  clampPaneToViewport: () => void;
  getTimestampItems: () => HTMLLIElement[];
  setMinPaneHeight: (h: number) => void;
  getMinPaneHeight: () => number;
  autoHighlightNearest: (scroll?: boolean) => void;
  setIsMouseOverTimestamps: (v: boolean) => void;
}

export interface PaneInteractionResult {
  documentMousemoveHandler: (e: MouseEvent) => void;
  documentMouseupHandler: () => void;
  windowResizeHandler: () => void;
  paneResizeObserver: ResizeObserver;
  recalculateTimestampsArea: () => void;
  scrollbarTrack: HTMLDivElement;
  scrollbarThumb: HTMLDivElement;
  resizeHandles: { tl: HTMLDivElement; tr: HTMLDivElement; bl: HTMLDivElement; br: HTMLDivElement };
}

type ResizeEdge = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export function setupPaneInteractions(
  pane: HTMLDivElement,
  header: HTMLDivElement,
  list: HTMLUListElement,
  btns: HTMLDivElement,
  deps: PaneInteractionDeps,
): PaneInteractionResult {
  const {
    clampAndSavePanePosition,
    savePanePosition,
    loadPanePosition,
    clampPaneToViewport,
    getTimestampItems,
    setMinPaneHeight,
    getMinPaneHeight,
    autoHighlightNearest,
    setIsMouseOverTimestamps,
  } = deps;

  // Initial pane positioning
  pane.style.position = "fixed";
  pane.style.bottom = "0";
  pane.style.right = "0";
  pane.style.transition = "none";
  loadPanePosition();
  setTimeout(() => clampPaneToViewport(), 10);

  // ── Drag ─────────────────────────────────────────────────────────────────

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let dragCachedPaneWidth = 0;
  let dragCachedPaneHeight = 0;
  let dragCachedViewportWidth = 0;
  let dragCachedViewportHeight = 0;
  let dragRafId: number | null = null;
  let dragOccurredSinceLastMouseDown = false;

  pane.addEventListener("mousedown", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
    if (target.closest("#ytls-playback-speed-group") || target.closest("#ytls-playback-speed")) return;
    if (target !== header && !header.contains(target) && window.getComputedStyle(target).cursor === "pointer") return;

    isDragging = true;
    dragOccurredSinceLastMouseDown = false;
    const rect = pane.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    dragCachedPaneWidth = rect.width;
    dragCachedPaneHeight = rect.height;
    dragCachedViewportWidth = document.documentElement.clientWidth;
    dragCachedViewportHeight = document.documentElement.clientHeight;
    pane.style.transition = "none";
  });

  const documentMousemoveHandler = (e: MouseEvent) => {
    if (isDragging) {
      dragOccurredSinceLastMouseDown = true;
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (dragRafId !== null) return;
      dragRafId = requestAnimationFrame(() => {
        dragRafId = null;
        if (!isDragging) return;
        const x = Math.max(0, Math.min(clientX - offsetX, dragCachedViewportWidth - dragCachedPaneWidth));
        const y = Math.max(0, Math.min(clientY - offsetY, dragCachedViewportHeight - dragCachedPaneHeight));
        pane.style.left = `${x}px`;
        pane.style.top = `${y}px`;
        pane.style.right = "auto";
        pane.style.bottom = "auto";
      });
    }

    if (isResizing && pane && resizeEdge) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (resizeRafId !== null) return;
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        if (!isResizing || !pane || !resizeEdge) return;
        const deltaX = clientX - resizeStartX;
        const deltaY = clientY - resizeStartY;
        const vw = resizeCachedViewportWidth;
        const vh = resizeCachedViewportHeight;
        let newWidth = resizeStartWidth;
        let newHeight = resizeStartHeight;
        let newLeft = resizeStartLeft;
        let newTop = resizeStartTop;
        if (resizeEdge === "bottom-right") {
          newWidth = Math.max(200, Math.min(800, resizeStartWidth + deltaX));
          newHeight = Math.max(250, Math.min(vh, resizeStartHeight + deltaY));
        } else if (resizeEdge === "top-left") {
          newWidth = Math.max(200, Math.min(800, resizeStartWidth - deltaX));
          newLeft = resizeStartLeft + deltaX;
          newHeight = Math.max(250, Math.min(vh, resizeStartHeight - deltaY));
          newTop = resizeStartTop + deltaY;
        } else if (resizeEdge === "top-right") {
          newWidth = Math.max(200, Math.min(800, resizeStartWidth + deltaX));
          newHeight = Math.max(250, Math.min(vh, resizeStartHeight - deltaY));
          newTop = resizeStartTop + deltaY;
        } else if (resizeEdge === "bottom-left") {
          newWidth = Math.max(200, Math.min(800, resizeStartWidth - deltaX));
          newLeft = resizeStartLeft + deltaX;
          newHeight = Math.max(250, Math.min(vh, resizeStartHeight + deltaY));
        }
        newLeft = Math.max(0, Math.min(newLeft, vw - newWidth));
        newTop = Math.max(0, Math.min(newTop, vh - newHeight));
        pane.style.width = `${newWidth}px`;
        pane.style.height = `${newHeight}px`;
        pane.style.left = `${newLeft}px`;
        pane.style.top = `${newTop}px`;
        pane.style.right = "auto";
        pane.style.bottom = "auto";
      });
    }
  };

  const documentMouseupHandler = () => {
    if (isDragging) {
      isDragging = false;
      if (dragRafId !== null) { cancelAnimationFrame(dragRafId); dragRafId = null; }
      const didDrag = dragOccurredSinceLastMouseDown;
      setTimeout(() => { dragOccurredSinceLastMouseDown = false; }, 50);
      clampPaneToViewport();
      setTimeout(() => { if (didDrag) savePanePosition(); }, 200);
    }
    if (isResizing) {
      isResizing = false;
      if (resizeRafId !== null) { cancelAnimationFrame(resizeRafId); resizeRafId = null; }
      resizeEdge = null;
      document.body.style.cursor = "";
      clampAndSavePanePosition(true);
    }
  };

  document.addEventListener("mousemove", documentMousemoveHandler);
  document.addEventListener("mouseup", documentMouseupHandler);
  pane.addEventListener("dragstart", (e) => e.preventDefault());

  // ── Resize ───────────────────────────────────────────────────────────────

  const resizeTL = document.createElement("div");
  const resizeTR = document.createElement("div");
  const resizeBL = document.createElement("div");
  const resizeBR = document.createElement("div");
  resizeTL.id = "ytls-resize-tl";
  resizeTR.id = "ytls-resize-tr";
  resizeBL.id = "ytls-resize-bl";
  resizeBR.id = "ytls-resize-br";

  let isResizing = false;
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeStartWidth = 0;
  let resizeStartHeight = 0;
  let resizeStartLeft = 0;
  let resizeStartTop = 0;
  let resizeCachedViewportWidth = 0;
  let resizeCachedViewportHeight = 0;
  let resizeRafId: number | null = null;
  let resizeEdge: ResizeEdge | null = null;

  function setupCorner(handle: HTMLElement, edge: ResizeEdge) {
    handle.addEventListener("dblclick", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      pane.style.width = "300px";
      pane.style.height = "300px";
      savePanePosition();
      recalculateTimestampsArea();
    });
    handle.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      isResizing = true;
      resizeEdge = edge;
      resizeStartX = ev.clientX;
      resizeStartY = ev.clientY;
      const rect = pane.getBoundingClientRect();
      resizeStartWidth = rect.width;
      resizeStartHeight = rect.height;
      resizeStartLeft = rect.left;
      resizeStartTop = rect.top;
      resizeCachedViewportWidth = document.documentElement.clientWidth;
      resizeCachedViewportHeight = document.documentElement.clientHeight;
      document.body.style.cursor = (edge === "top-left" || edge === "bottom-right") ? "nwse-resize" : "nesw-resize";
    });
  }

  setupCorner(resizeTL, "top-left");
  setupCorner(resizeTR, "top-right");
  setupCorner(resizeBL, "bottom-left");
  setupCorner(resizeBR, "bottom-right");

  // Debounced window resize handler
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  const windowResizeHandler = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      clampAndSavePanePosition(true);
      recalculateTimestampsArea();
      resizeTimeout = null;
    }, 200);
  };
  window.addEventListener("resize", windowResizeHandler);

  // Show diagonal cursor near corners
  let lastPaneCursor = "";
  pane.addEventListener("mousemove", (ev) => {
    if (isDragging || isResizing) return;
    const rect = pane.getBoundingClientRect();
    const threshold = 20;
    const x = ev.clientX;
    const y = ev.clientY;
    const inLeft = x - rect.left <= threshold;
    const inRight = rect.right - x <= threshold;
    const inTop = y - rect.top <= threshold;
    const inBottom = rect.bottom - y <= threshold;
    let c = "";
    if ((inTop && inLeft) || (inBottom && inRight)) c = "nwse-resize";
    else if ((inTop && inRight) || (inBottom && inLeft)) c = "nesw-resize";
    if (c !== lastPaneCursor) {
      lastPaneCursor = c;
      document.body.style.cursor = c;
    }
  });

  // ── Custom Scrollbar ─────────────────────────────────────────────────────

  const scrollbarTrack = document.createElement("div");
  scrollbarTrack.className = "ytls-scrollbar-track";
  const scrollbarThumb = document.createElement("div");
  scrollbarThumb.className = "ytls-scrollbar-thumb";
  scrollbarTrack.append(scrollbarThumb);

  let scrollThumbRafId: number | null = null;
  let isScrollbarDragging = false;
  let scrollbarHideTimeoutId: ReturnType<typeof setTimeout> | null = null;

  function updateScrollbarThumb() {
    const { scrollTop, scrollHeight, clientHeight } = list;
    if (scrollHeight <= clientHeight) return;
    const thumbHeight = Math.max(30, (clientHeight / scrollHeight) * clientHeight);
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbHeight);
    scrollbarThumb.style.height = `${thumbHeight}px`;
    scrollbarThumb.style.top = `${thumbTop}px`;
  }

  function showScrollbar() {
    if (scrollThumbRafId === null) {
      scrollThumbRafId = requestAnimationFrame(() => {
        scrollThumbRafId = null;
        updateScrollbarThumb();
      });
    }
    scrollbarTrack.classList.add("ytls-scrollbar-visible");
    if (scrollbarHideTimeoutId) clearTimeout(scrollbarHideTimeoutId);
    scrollbarHideTimeoutId = setTimeout(() => {
      scrollbarTrack.classList.remove("ytls-scrollbar-visible");
      scrollbarHideTimeoutId = null;
    }, 500);
  }

  scrollbarTrack.addEventListener("mouseenter", () => {
    if (scrollbarHideTimeoutId) { clearTimeout(scrollbarHideTimeoutId); scrollbarHideTimeoutId = null; }
    scrollbarTrack.classList.add("ytls-scrollbar-visible");
  });
  scrollbarTrack.addEventListener("mouseleave", () => {
    if (isScrollbarDragging) return;
    scrollbarHideTimeoutId = setTimeout(() => {
      scrollbarTrack.classList.remove("ytls-scrollbar-visible");
      scrollbarHideTimeoutId = null;
    }, 500);
  });

  scrollbarThumb.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    isScrollbarDragging = true;
    const startY = e.clientY;
    const startScrollTop = list.scrollTop;
    const { scrollHeight, clientHeight } = list;
    const thumbHeight = Math.max(30, (clientHeight / scrollHeight) * clientHeight);
    const scrollRange = scrollHeight - clientHeight;
    const thumbRange = clientHeight - thumbHeight;

    function onMouseMove(ev: MouseEvent) {
      const delta = ev.clientY - startY;
      list.scrollTop = Math.max(0, Math.min(scrollRange, startScrollTop + delta * (scrollRange / thumbRange)));
      updateScrollbarThumb();
    }
    function onMouseUp() {
      isScrollbarDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      if (!scrollbarTrack.matches(":hover")) {
        scrollbarHideTimeoutId = setTimeout(() => {
          scrollbarTrack.classList.remove("ytls-scrollbar-visible");
          scrollbarHideTimeoutId = null;
        }, 500);
      }
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // ── Pane hover state ─────────────────────────────────────────────────────

  pane.addEventListener("mouseenter", () => {
    setIsMouseOverTimestamps(true);
    setMouseOverTimestamps(true);
    showScrollbar();
  });

  list.addEventListener("scroll", showScrollbar);

  pane.addEventListener("mouseleave", () => {
    if (!isResizing && !isDragging) document.body.style.cursor = "";
    setIsMouseOverTimestamps(false);
    setMouseOverTimestamps(false);
    try { hideActiveTooltip(); } catch (_) { }
    try { autoHighlightNearest(false); } catch (_) { }
  });

  // ── Layout recalculation ─────────────────────────────────────────────────

  function recalculateTimestampsArea() {
    const paneRect = pane.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const btnsRect = btns.getBoundingClientRect();
    const available = paneRect.height - (headerRect.height + btnsRect.height);
    list.style.maxHeight = available > 0 ? `${available}px` : "0px";
    list.style.overflowY = available > 0 ? "auto" : "hidden";
  }

  setTimeout(() => {
    recalculateTimestampsArea();
    let liH = 40;
    const itemsForSize = getTimestampItems();
    if (itemsForSize.length > 0) {
      liH = (itemsForSize[0] as HTMLElement).offsetHeight;
    } else {
      const tempLi = document.createElement("li");
      tempLi.style.visibility = "hidden";
      tempLi.style.position = "absolute";
      tempLi.textContent = "00:00 Example";
      list.appendChild(tempLi);
      liH = tempLi.offsetHeight;
      list.removeChild(tempLi);
    }
    setMinPaneHeight(header.offsetHeight + btns.offsetHeight + liH);
    pane.style.minHeight = `${getMinPaneHeight()}px`;
  }, 0);

  const paneResizeObserver = new ResizeObserver(recalculateTimestampsArea);
  paneResizeObserver.observe(pane);

  return {
    documentMousemoveHandler,
    documentMouseupHandler,
    windowResizeHandler,
    paneResizeObserver,
    recalculateTimestampsArea,
    scrollbarTrack,
    scrollbarThumb,
    resizeHandles: { tl: resizeTL, tr: resizeTR, bl: resizeBL, br: resizeBR },
  };
}
