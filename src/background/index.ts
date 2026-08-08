import { sendTabMessage, broadcastToAllTabs } from '../shared/messaging.js';
import { getStoredConfig, saveConfig } from '../shared/storage.js';
import type { MessagePayload } from '../shared/types.js';

import { setConfig, getConfig } from './state.js';
import {
  closeTab,
  createTab,
  duplicateTab,
  switchToPreviousTab,
  switchToNextTab,
} from './tab-operations.js';

export function initBackground(): void {
  async function initialize(): Promise<void> {
    const config = await getStoredConfig();
    setConfig(config);

    // Notify all tabs about the current axes.
    broadcastToAllTabs({ type: 'update_axes', axes: [config.axes.vertical, config.axes.horizontal] });
  }

  void initialize();

  chrome.runtime.onMessage.addListener((request: MessagePayload, sender, sendResponse) => {
    void handleMessage(request, sender).then(sendResponse).catch(sendResponse);
    return true; // Keep channel open for async response.
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
      const config = getConfig();
      if (config) {
        sendTabMessage(tabId, {
          type: 'update_axes',
          axes: [config.axes.vertical, config.axes.horizontal],
        }).catch(() => {
          // Ignore errors for non-injectable tabs.
        });
      }
    }
  });
}

async function handleMessage(
  request: MessagePayload,
  sender: chrome.runtime.MessageSender,
): Promise<unknown> {
  const tabId = sender.tab?.id;

  switch (request.type) {
    case 'update_axes': {
      if (!request.axes || request.axes.length < 2) {
        return { status: 'error', message: 'Invalid axes' };
      }

      const [vertical, horizontal] = request.axes;
      if (vertical === undefined || horizontal === undefined) {
        return { status: 'error', message: 'Invalid axes' };
      }

      const config = getConfig() ?? (await getStoredConfig());
      config.axes = { vertical, horizontal };
      await saveConfig(config);
      setConfig(config);

      broadcastToAllTabs({ type: 'update_axes', axes: request.axes });
      return { status: 'success' };
    }

    case 'update_config': {
      if (!request.config) {
        return { status: 'error', message: 'Missing config' };
      }
      await saveConfig(request.config);
      setConfig(request.config);
      broadcastToAllTabs({ type: 'update_config', config: request.config });
      return { status: 'success' };
    }

    case 'close_tab': {
      if (typeof tabId === 'number') await closeTab(tabId);
      return { status: 'success' };
    }

    case 'create_tab': {
      await createTab();
      return { status: 'success' };
    }

    case 'switch_to_previous_tab': {
      if (typeof tabId === 'number') await switchToPreviousTab(tabId);
      return { status: 'success' };
    }

    case 'switch_to_next_tab': {
      if (typeof tabId === 'number') await switchToNextTab(tabId);
      return { status: 'success' };
    }

    case 'duplicate_tab': {
      if (typeof tabId === 'number') await duplicateTab(tabId);
      return { status: 'success' };
    }

    case 'content_ready': {
      const config = getConfig() ?? (await getStoredConfig());
      return {
        type: 'update_config',
        config,
      };
    }

    default: {
      return { status: 'unknown' };
    }
  }
}
