import { sendRuntimeMessage } from '../shared/messaging.js';
import { getStoredConfig } from '../shared/storage.js';
import type { MessagePayload } from '../shared/types.js';

import { startGamepadLoop, updateConfig } from './gamepad-loop.js';

export function initContentScript(): void {
  async function initialize(): Promise<void> {
    const config = await getStoredConfig();
    startGamepadLoop(config);

    try {
      const response = (await sendRuntimeMessage({ type: 'content_ready' })) as
        MessagePayload | undefined;
      if (response?.config) {
        updateConfig(response.config);
      }
    } catch {
      // If the background script is unavailable, continue with local config.
    }
  }

  void initialize();

  chrome.runtime.onMessage.addListener((request: MessagePayload, _sender, sendResponse) => {
    if (request.type === 'update_axes' && request.axes) {
      void getStoredConfig().then((config) => {
        const [vertical, horizontal] = request.axes!;
        if (vertical !== undefined && horizontal !== undefined) {
          config.axes = { vertical, horizontal };
        }
        updateConfig(config);
        sendResponse({ status: 'updated' });
      });
      return true;
    }

    if (request.type === 'update_config' && request.config) {
      updateConfig(request.config);
      sendResponse({ status: 'updated' });
      return false;
    }

    return false;
  });

  window.addEventListener('gamepadconnected', (event) => {
    console.log(`Gamepad connected: ${event.gamepad.id}`);
  });

  window.addEventListener('gamepaddisconnected', (event) => {
    console.log(`Gamepad disconnected: ${event.gamepad.id}`);
  });
}
