import type { UserConfig } from '../shared/types.js';

import { handleGamepadInput } from './input-handler.js';

let rafId: number | null = null;
let activeConfig: UserConfig | null = null;

export function startGamepadLoop(config: UserConfig): void {
  activeConfig = config;

  if (rafId !== null) return;

  function tick(): void {
    if (activeConfig) {
      handleGamepadInput(navigator.getGamepads(), activeConfig);
    }
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
}

export function updateConfig(config: UserConfig): void {
  activeConfig = config;
}

export function stopGamepadLoop(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}
