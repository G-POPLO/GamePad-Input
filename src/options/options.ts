import { DEFAULT_CONFIG } from '../shared/constants.js';
import { localizePage } from '../shared/i18n.js';
import { sendRuntimeMessage } from '../shared/messaging.js';
import { getStoredConfig, saveConfig } from '../shared/storage.js';
import type { ActionType, UserConfig, AxesConfig } from '../shared/types.js';

const buttonLabels: Record<ActionType, string> = {
  reload: 'Y Button',
  close_tab: 'B Button',
  create_tab: 'A Button',
  duplicate_tab: 'X Button',
  switch_to_previous_tab: 'LB',
  switch_to_next_tab: 'RB',
  history_back: 'LT',
  history_forward: 'RT',
  toggle_cursor_mode: 'Select',
  toggle_scroll_mode: 'Start',
  focus_next: 'D-Pad Down',
  focus_previous: 'D-Pad Up',
  click_focused: 'A Button (Focus)',
};

const stickOptions: Record<string, AxesConfig> = {
  left: { vertical: 1, horizontal: 0 },
  right: { vertical: 3, horizontal: 2 },
};

let currentConfig: UserConfig = { ...DEFAULT_CONFIG };

async function init(): Promise<void> {
  localizePage();
  currentConfig = await getStoredConfig();
  populateForm(currentConfig);
  bindEvents();
}

function populateForm(config: UserConfig): void {
  const stickSelection = document.getElementById('stick-selection') as HTMLSelectElement;
  const deadzoneInput = document.getElementById('deadzone') as HTMLInputElement;
  const scrollSpeedInput = document.getElementById('scroll-speed') as HTMLInputElement;
  const scrollModeInput = document.getElementById('scroll-mode') as HTMLSelectElement;

  if (config.axes.vertical === 1 && config.axes.horizontal === 0) {
    stickSelection.value = 'left';
  } else {
    stickSelection.value = 'right';
  }

  deadzoneInput.value = config.deadzone.toString();
  scrollSpeedInput.value = config.scrollSpeed.toString();
  scrollModeInput.value = config.scrollMode;

  renderButtonMapping(config);
}

function renderButtonMapping(config: UserConfig): void {
  const container = document.getElementById('button-mapping');
  if (!container) return;

  container.replaceChildren();

  for (const [action, label] of Object.entries(buttonLabels)) {
    const labelEl = document.createElement('label');
    labelEl.textContent = label;

    const select = document.createElement('select');
    select.dataset.action = action;

    for (let i = 0; i <= 15; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = i.toString();
      if (config.buttonMap[action as ActionType] === i) {
        option.selected = true;
      }
      select.appendChild(option);
    }

    container.appendChild(labelEl);
    container.appendChild(select);
  }
}

function bindEvents(): void {
  document.getElementById('save-settings')?.addEventListener('click', handleSave);
  document.getElementById('instructions-button')?.addEventListener('click', openInstructionsPage);
  document.getElementById('export-config')?.addEventListener('click', handleExport);
  document.getElementById('import-config')?.addEventListener('click', () => {
    document.getElementById('import-file')?.click();
  });
  document.getElementById('import-file')?.addEventListener('change', handleImport);
}

async function handleSave(): Promise<void> {
  const stickSelection = (document.getElementById('stick-selection') as HTMLSelectElement).value;
  const deadzone = parseFloat((document.getElementById('deadzone') as HTMLInputElement).value);
  const scrollSpeed = parseInt(
    (document.getElementById('scroll-speed') as HTMLInputElement).value,
    10,
  );
  const scrollMode = (document.getElementById('scroll-mode') as HTMLSelectElement).value as
    'smooth' | 'page';

  const buttonMap: Record<ActionType, number> = { ...currentConfig.buttonMap };
  for (const select of document.querySelectorAll<HTMLSelectElement>('#button-mapping select')) {
    const action = select.dataset.action as ActionType;
    buttonMap[action] = parseInt(select.value, 10);
  }

  const newConfig: UserConfig = {
    axes: stickOptions[stickSelection] ?? { ...DEFAULT_CONFIG.axes },
    buttonMap,
    deadzone: Number.isFinite(deadzone) ? deadzone : DEFAULT_CONFIG.deadzone,
    scrollSpeed: Number.isFinite(scrollSpeed) ? scrollSpeed : DEFAULT_CONFIG.scrollSpeed,
    scrollMode,
    cursorSpeed: currentConfig.cursorSpeed,
  };

  try {
    await saveConfig(newConfig);
    await sendRuntimeMessage({ type: 'update_config', config: newConfig });
    showStatus('Settingssaved', 'success');
  } catch (error) {
    console.error('Failed to save settings:', error);
    showStatus('Failedtosavesettings', 'error');
  }
}

function openInstructionsPage(): void {
  void chrome.tabs.create({ url: chrome.runtime.getURL('config.html') });
}

function handleExport(): void {
  const blob = new Blob([JSON.stringify(currentConfig, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gamepad-input-config.json';
  a.click();
  URL.revokeObjectURL(url);
  showStatus('exportSuccess', 'success');
}

async function handleImport(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const imported = JSON.parse(text) as UserConfig;
    await saveConfig(imported);
    await sendRuntimeMessage({ type: 'update_config', config: imported });
    currentConfig = imported;
    populateForm(currentConfig);
    showStatus('importSuccess', 'success');
  } catch (error) {
    console.error('Failed to import config:', error);
    showStatus('importError', 'error');
  } finally {
    input.value = '';
  }
}

function showStatus(messageKey: string, type: 'success' | 'error'): void {
  const statusEl = document.getElementById('status-message');
  if (!statusEl) return;

  statusEl.textContent = chrome.i18n.getMessage(messageKey) || messageKey;
  statusEl.className = `status-message ${type}`;

  setTimeout(() => {
    statusEl.textContent = '';
    statusEl.className = 'status-message';
  }, 3000);
}

void init();
