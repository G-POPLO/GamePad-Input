import type { ActionType, UserConfig } from './types.js';

// Standard Gamepad button indices
export const StandardMapping = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  Select: 8,
  Start: 9,
  L3: 10,
  R3: 11,
  DPadUp: 12,
  DPadDown: 13,
  DPadLeft: 14,
  DPadRight: 15,
} as const;

// Default axis assignments: right stick
export const DEFAULT_AXES = {
  vertical: 3,
  horizontal: 2,
} as const;

// Default button mapping
export const DEFAULT_BUTTON_MAP: Record<ActionType, number> = {
  reload: StandardMapping.Y,
  close_tab: StandardMapping.B,
  create_tab: StandardMapping.A,
  duplicate_tab: StandardMapping.X,
  switch_to_previous_tab: StandardMapping.LB,
  switch_to_next_tab: StandardMapping.RB,
  history_back: StandardMapping.LT,
  history_forward: StandardMapping.RT,
  toggle_cursor_mode: StandardMapping.Select,
  toggle_scroll_mode: StandardMapping.Start,
  focus_next: StandardMapping.DPadDown,
  focus_previous: StandardMapping.DPadUp,
  focus_left: StandardMapping.DPadLeft,
  focus_right: StandardMapping.DPadRight,
  click_focused: StandardMapping.A,
};

export const DEFAULT_DEADZONE = 0.1;
export const DEFAULT_SCROLL_SPEED = 10;
export const DEFAULT_CURSOR_SPEED = 8;
export const COOLDOWN_TIME_MS = 300;

export const DEFAULT_CONFIG: UserConfig = {
  axes: { ...DEFAULT_AXES },
  buttonMap: { ...DEFAULT_BUTTON_MAP },
  deadzone: DEFAULT_DEADZONE,
  scrollSpeed: DEFAULT_SCROLL_SPEED,
  scrollMode: 'smooth',
  cursorSpeed: DEFAULT_CURSOR_SPEED,
};
