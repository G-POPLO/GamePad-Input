import { COOLDOWN_TIME_MS } from '../shared/constants.js';

const cooldowns = {
  closeTab: 0,
  previousTab: 0,
  nextTab: 0,
};

function isCooldownReady(key: keyof typeof cooldowns): boolean {
  const now = Date.now();
  if (now - cooldowns[key] > COOLDOWN_TIME_MS) {
    cooldowns[key] = now;
    return true;
  }
  return false;
}

export async function closeTab(tabId: number): Promise<void> {
  if (!isCooldownReady('closeTab')) return;
  await chrome.tabs.remove(tabId);
}

export async function createTab(): Promise<void> {
  await chrome.tabs.create({});
}

export async function duplicateTab(tabId: number): Promise<void> {
  await chrome.tabs.duplicate(tabId);
}

export async function switchToPreviousTab(currentTabId: number): Promise<void> {
  if (!isCooldownReady('previousTab')) return;
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
  if (currentIndex >= 0) {
    const previousTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
    if (previousTab.id) {
      await chrome.tabs.update(previousTab.id, { active: true });
    }
  }
}

export async function switchToNextTab(currentTabId: number): Promise<void> {
  if (!isCooldownReady('nextTab')) return;
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
  if (currentIndex >= 0) {
    const nextTab = tabs[(currentIndex + 1) % tabs.length];
    if (nextTab.id) {
      await chrome.tabs.update(nextTab.id, { active: true });
    }
  }
}
