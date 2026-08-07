import type { UserConfig } from '../shared/types.js';

let cursor: HTMLDivElement | null = null;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let isActive = false;

export function isCursorModeActive(): boolean {
  return isActive;
}

export function toggleCursorMode(): boolean {
  isActive = !isActive;

  if (isActive) {
    ensureCursor();
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  return isActive;
}

export function moveCursor(deltaX: number, deltaY: number, config: UserConfig): void {
  if (!isActive || !cursor) return;

  cursorX = clamp(cursorX + deltaX * config.cursorSpeed, 0, window.innerWidth);
  cursorY = clamp(cursorY + deltaY * config.cursorSpeed, 0, window.innerHeight);

  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
}

export function clickAtCursor(): void {
  if (!isActive) return;

  const element = document.elementFromPoint(cursorX, cursorY);
  if (element) {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: cursorX,
      clientY: cursorY,
    });
    element.dispatchEvent(clickEvent);
  }
}

function ensureCursor(): void {
  if (cursor) {
    cursor.style.display = 'block';
    return;
  }

  cursor = document.createElement('div');
  cursor.id = 'gamepad-cursor';
  cursor.style.cssText = [
    'position: fixed',
    'z-index: 2147483647',
    'width: 16px',
    'height: 16px',
    'border-radius: 50%',
    'background: rgba(37, 99, 235, 0.9)',
    'border: 2px solid white',
    'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3)',
    'pointer-events: none',
    'transform: translate(-50%, -50%)',
  ].join(';');

  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  document.body.appendChild(cursor);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
