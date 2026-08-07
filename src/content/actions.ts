import { sendRuntimeMessage } from '../shared/messaging.js';
import type { ActionType } from '../shared/types.js';

export function performPageAction(action: ActionType): void {
  switch (action) {
    case 'reload':
      location.reload();
      break;

    case 'history_back':
      history.back();
      break;

    case 'history_forward':
      history.forward();
      break;

    default:
      // Actions handled by the background script.
      void sendBackgroundAction(action);
  }
}

async function sendBackgroundAction(action: ActionType): Promise<void> {
  const messageMap: Record<string, string> = {
    close_tab: 'close_tab',
    create_tab: 'create_tab',
    switch_to_previous_tab: 'switch_to_previous_tab',
    switch_to_next_tab: 'switch_to_next_tab',
    duplicate_tab: 'duplicate_tab',
  };

  const type = messageMap[action];
  if (!type) return;

  try {
    await sendRuntimeMessage({
      type: type as
        | 'close_tab'
        | 'create_tab'
        | 'switch_to_previous_tab'
        | 'switch_to_next_tab'
        | 'duplicate_tab',
    });
  } catch (error) {
    console.warn(`Failed to send action ${action}:`, error);
  }
}
