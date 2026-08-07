import { DEFAULT_DEADZONE } from './constants.js';

export function applyDeadzone(value: number, threshold = DEFAULT_DEADZONE): number {
  const abs = Math.abs(value);
  if (abs < threshold) return 0;

  const sign = Math.sign(value);
  // Scaled deadzone: remap the remaining range back to [0, 1]
  return sign * ((abs - threshold) / (1 - threshold));
}

export function isButtonPressed(button: GamepadButton | undefined): boolean {
  if (!button) return false;
  return typeof button.value === 'number' ? button.value > 0.5 || button.pressed : button.pressed;
}

export function getAxisValue(gamepad: Gamepad | undefined, index: number): number {
  if (!gamepad) return 0;
  return gamepad.axes[index] ?? 0;
}
