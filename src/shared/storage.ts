import { DEFAULT_CONFIG, DEFAULT_AXES } from './constants.js';
import type { StoredConfig, UserConfig } from './types.js';

const STORAGE_KEY = 'gamepadInputConfig';
const LEGACY_AXES_KEY = 'selectedAxes';

export async function getStoredConfig(): Promise<UserConfig> {
  const result = await chrome.storage.local.get([STORAGE_KEY, LEGACY_AXES_KEY]);

  const stored: StoredConfig = result[STORAGE_KEY] ?? {};

  // Migrate legacy selectedAxes format
  if (!stored.axes && result[LEGACY_AXES_KEY]) {
    // @types/chrome 0.2+ 将 storage.get 返回类型改为 unknown，需显式断言
    const legacyAxes = result[LEGACY_AXES_KEY] as number[];
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
    buttonMap: { ...DEFAULT_CONFIG.buttonMap, ...stored.buttonMap },
    deadzone: stored.deadzone ?? DEFAULT_CONFIG.deadzone,
    scrollSpeed: stored.scrollSpeed ?? DEFAULT_CONFIG.scrollSpeed,
    scrollMode: stored.scrollMode ?? DEFAULT_CONFIG.scrollMode,
    cursorSpeed: stored.cursorSpeed ?? DEFAULT_CONFIG.cursorSpeed,
  };
}
