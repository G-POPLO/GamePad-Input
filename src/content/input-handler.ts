import { applyDeadzone, isButtonPressed } from '../shared/gamepad-mapping.js';
import type { ActionType, UserConfig } from '../shared/types.js';

import { performPageAction } from './actions.js';
import { isCursorModeActive, toggleCursorMode, moveCursor, clickAtCursor } from './cursor-mode.js';
import {
  focusNext,
  focusPrevious,
  focusLeft,
  focusRight,
  clickFocused,
} from './focus-navigation.js';
import { handleScroll } from './scroll-handler.js';

const buttonStates = new Map<number, boolean>();

export function handleGamepadInput(gamepads: (Gamepad | null)[], config: UserConfig): void {
  for (const gamepad of gamepads) {
    if (!gamepad) continue;

    const vertical = applyDeadzone(gamepad.axes[config.axes.vertical] ?? 0, config.deadzone);
    const horizontal = applyDeadzone(gamepad.axes[config.axes.horizontal] ?? 0, config.deadzone);

    if (isCursorModeActive()) {
      moveCursor(horizontal, vertical, config);
    } else {
      handleScroll(vertical, horizontal, config);
    }

    handleButtons(gamepad, config);
  }
}

function handleButtons(gamepad: Gamepad, config: UserConfig): void {
  for (const [action, buttonIndex] of Object.entries(config.buttonMap)) {
    const isPressed = isButtonPressed(gamepad.buttons[buttonIndex]);
    const wasPressed = buttonStates.get(buttonIndex) ?? false;

    if (isPressed && !wasPressed) {
      executeAction(action as ActionType, config);
    }

    buttonStates.set(buttonIndex, isPressed);
  }
}

function executeAction(action: ActionType, config: UserConfig): void {
  switch (action) {
    case 'toggle_cursor_mode':
      toggleCursorMode();
      break;

    case 'toggle_scroll_mode':
      config.scrollMode = config.scrollMode === 'smooth' ? 'page' : 'smooth';
      break;

    case 'focus_next':
      if (!isCursorModeActive()) focusNext();
      break;

    case 'focus_previous':
      if (!isCursorModeActive()) focusPrevious();
      break;

    case 'focus_left':
      if (!isCursorModeActive()) focusLeft();
      break;

    case 'focus_right':
      if (!isCursorModeActive()) focusRight();
      break;

    case 'click_focused':
      if (isCursorModeActive()) {
        clickAtCursor();
      } else {
        clickFocused();
      }
      break;

    default:
      performPageAction(action);
  }
}
