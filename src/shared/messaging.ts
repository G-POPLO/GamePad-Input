import type { MessagePayload } from './types.js';

export function sendRuntimeMessage(payload: MessagePayload): Promise<unknown> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

export function sendTabMessage(tabId: number, payload: MessagePayload): Promise<unknown> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, payload, (response) => {
      if (chrome.runtime.lastError) {
        // Tabs that are not injectable (chrome://, etc.) will error here.
        // We resolve with undefined to keep the flow tolerant.
        resolve(undefined);
      } else {
        resolve(response);
      }
    });
  });
}

export function broadcastToAllTabs(payload: MessagePayload): void {
  chrome.tabs.query({}, (tabs) => {
    if (chrome.runtime.lastError) {
      console.warn('Failed to query tabs:', chrome.runtime.lastError.message);
      return;
    }

    for (const tab of tabs) {
      if (typeof tab.id === 'number' && isInjectableUrl(tab.url)) {
        sendTabMessage(tab.id, payload).catch(() => {
          // Ignore per-tab errors to avoid noise.
        });
      }
    }
  });
}

function isInjectableUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://');
}
