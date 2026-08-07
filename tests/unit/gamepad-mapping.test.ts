import { describe, it, expect } from 'vitest';

import { isButtonPressed, getAxisValue } from '../../src/shared/gamepad-mapping.js';

function createButton(pressed: boolean, value = pressed ? 1 : 0): GamepadButton {
  return {
    pressed,
    value,
    touched: pressed,
  } as GamepadButton;
}

function createGamepad(axes: number[], buttons: GamepadButton[]): Gamepad {
  return {
    id: 'test-gamepad',
    index: 0,
    connected: true,
    timestamp: performance.now(),
    mapping: 'standard',
    axes,
    buttons,
    vibrationActuator: undefined as unknown as GamepadHapticActuator,
  } as Gamepad;
}

describe('isButtonPressed', () => {
  it('returns true when the button is pressed', () => {
    expect(isButtonPressed(createButton(true))).toBe(true);
  });

  it('returns false when the button is not pressed', () => {
    expect(isButtonPressed(createButton(false))).toBe(false);
  });

  it('returns false for undefined buttons', () => {
    expect(isButtonPressed(undefined)).toBe(false);
  });
});

describe('getAxisValue', () => {
  it('returns the axis value at the given index', () => {
    const gamepad = createGamepad([0.1, 0.2, 0.3], []);
    expect(getAxisValue(gamepad, 1)).toBe(0.2);
  });

  it('returns 0 for missing axes', () => {
    const gamepad = createGamepad([0.1], []);
    expect(getAxisValue(gamepad, 5)).toBe(0);
  });

  it('returns 0 when the gamepad is undefined', () => {
    expect(getAxisValue(undefined, 0)).toBe(0);
  });
});
