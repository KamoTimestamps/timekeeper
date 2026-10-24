/**
 * Removes the leading "@" from author names in YouTube live chat, live chat replay and comments.
 *
 * Chat renders inside its own iframe (/live_chat and /live_chat_replay), so the cleanup must
 * also run in that frame; comments live on the top-level watch page.
 */

// #author-name: live chat. #author-text: comments (name is in a child span).
const AUTHOR_NAME_SELECTOR = "#author-name, #author-text";

export function isLiveChatFrame(): boolean {
  return (
    window.top !== window.self && window.location.pathname.startsWith("/live_chat")
  );
}

function stripAt(el: Element): void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue ?? "";
    if (!text.trim()) continue;
    if (/^\s*@/.test(text)) node.nodeValue = text.replace(/^(\s*)@/, "$1");
    return;
  }
}

function processTree(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) {
    const author = root.parentElement?.closest(AUTHOR_NAME_SELECTOR);
    if (author) stripAt(author);
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
