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

export async function sendTabMessage(tabId: number, payload: MessagePayload): Promise<unknown> {
  try {
    return await chrome.tabs.sendMessage(tabId, payload);
  } catch {
    // Tabs that are not injectable (chrome://, etc.) will error here.
    // We resolve with undefined to keep the flow tolerant.
    return undefined;
  }
}

export async function broadcastToAllTabs(payload: MessagePayload): Promise<void> {
  let tabs: chrome.tabs.Tab[] = [];
  try {
    tabs = await chrome.tabs.query({});
  } catch (error) {
    console.warn('Failed to query tabs:', error);
    return;
  }

  const sends = tabs
    .filter((tab): tab is chrome.tabs.Tab & { id: number; url: string } => {
      return typeof tab.id === 'number' && isInjectableUrl(tab.url);
    })
    .map((tab) =>
      sendTabMessage(tab.id, payload).catch(() => {
        // Ignore per-tab errors to avoid noise.
      }),
    );

  await Promise.all(sends);
}

function isInjectableUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://');
}
