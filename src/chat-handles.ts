/**
 * Removes the leading "@" from author names in YouTube live chat and live chat replay.
 *
 * Chat renders inside its own iframe (/live_chat and /live_chat_replay), so this must run
 * in that frame rather than the top-level watch page.
 */

const AUTHOR_NAME_SELECTOR = "#author-name";

export function isLiveChatFrame(): boolean {
  return (
    window.top !== window.self && window.location.pathname.startsWith("/live_chat")
  );
}

function stripAt(el: Element): void {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.startsWith("@")) {
      node.nodeValue = node.nodeValue.slice(1);
      return;
    }
  }
}

function processTree(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) {
    const parent = root.parentElement;
    if (parent?.matches(AUTHOR_NAME_SELECTOR)) stripAt(parent);
    return;
  }
  if (!(root instanceof Element)) return;
  if (root.matches(AUTHOR_NAME_SELECTOR)) stripAt(root);
  root.querySelectorAll(AUTHOR_NAME_SELECTOR).forEach(stripAt);
}

export function initializeChatHandleCleanup(): void {
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "characterData") {
        processTree(m.target);
      } else {
        m.addedNodes.forEach(processTree);
      }
    }
  });

  // Observe the document itself: documentElement doesn't exist yet at document-start
  if (document.documentElement) processTree(document.documentElement);
  observer.observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
