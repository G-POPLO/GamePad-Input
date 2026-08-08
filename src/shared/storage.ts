import { DEFAULT_CONFIG, DEFAULT_AXES } from './constants.js';
import type { StoredConfig, UserConfig } from './types.js';

const STORAGE_KEY = 'gamepadInputConfig';
const LEGACY_AXES_KEY = 'selectedAxes';

export async function getStoredConfig(): Promise<UserConfig> {
  const result = await chrome.storage.local.get([STORAGE_KEY, LEGACY_AXES_KEY]);

  const stored: StoredConfig = result[STORAGE_KEY] ?? {};

  // Migrate legacy selectedAxes format
  if (!stored.axes && result[LEGACY_AXES_KEY]) {
    const legacyAxes: number[] = result[LEGACY_AXES_KEY];
    if (legacyAxes.length >= 2) {
      const [vertical, horizontal] = legacyAxes;
      if (vertical !== undefined && horizontal !== undefined) {
        stored.axes = { vertical, horizontal };
      }
    }
  }

  return mergeWithDefaults(stored);
}

export async function saveConfig(config: UserConfig): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: config });
}

function mergeWithDefaults(stored: StoredConfig): UserConfig {
  return {
    axes: stored.axes ?? { ...DEFAULT_AXES },
    buttonMap: stored.buttonMap ?? { ...DEFAULT_CONFIG.buttonMap },
    deadzone: stored.deadzone ?? DEFAULT_CONFIG.deadzone,
    scrollSpeed: stored.scrollSpeed ?? DEFAULT_CONFIG.scrollSpeed,
    scrollMode: stored.scrollMode ?? DEFAULT_CONFIG.scrollMode,
    cursorSpeed: stored.cursorSpeed ?? DEFAULT_CONFIG.cursorSpeed,
  };
}
