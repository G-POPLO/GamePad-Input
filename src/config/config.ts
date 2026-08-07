import { localizePage } from '../shared/i18n.js';

function init(): void {
  localizePage();
  updateGamepadStatus();

  window.addEventListener('gamepadconnected', updateGamepadStatus);
  window.addEventListener('gamepaddisconnected', updateGamepadStatus);
}

function updateGamepadStatus(): void {
  const statusEl = document.getElementById('gamepad-status');
  const listEl = document.getElementById('gamepad-list');
  if (!statusEl || !listEl) return;

  const gamepads = navigator.getGamepads();
  const connected = Array.from(gamepads).filter((gp): gp is Gamepad => gp !== null && gp.connected);

  if (connected.length === 0) {
    statusEl.textContent = chrome.i18n.getMessage('noGamepadConnected') || 'No gamepad connected';
    listEl.innerHTML = '';
    return;
  }

  statusEl.textContent =
    chrome.i18n.getMessage('gamepadConnectedCount', connected.length.toString()) ||
    `${connected.length} gamepad(s) connected`;

  listEl.innerHTML = connected.map((gp) => `<li>${escapeHtml(gp.id)}</li>`).join('');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

init();
