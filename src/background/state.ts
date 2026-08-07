import type { UserConfig } from '../shared/types.js';

let currentConfig: UserConfig | null = null;

export function setConfig(config: UserConfig): void {
  currentConfig = config;
}

export function getConfig(): UserConfig | null {
  return currentConfig;
}
