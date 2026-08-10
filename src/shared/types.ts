export type MessageType =
  | 'update_axes'
  | 'update_config'
  | 'close_tab'
  | 'create_tab'
  | 'switch_to_previous_tab'
  | 'switch_to_next_tab'
  | 'duplicate_tab'
  | 'content_ready';

export interface AxesConfig {
  vertical: number;
  horizontal: number;
}

export type ActionType =
  | 'reload'
  | 'close_tab'
  | 'create_tab'
  | 'switch_to_previous_tab'
  | 'switch_to_next_tab'
  | 'history_back'
  | 'history_forward'
  | 'duplicate_tab'
  | 'toggle_cursor_mode'
  | 'toggle_scroll_mode'
  | 'focus_next'
  | 'focus_previous'
  | 'focus_left'
  | 'focus_right'
  | 'click_focused';

export interface UserConfig {
  axes: AxesConfig;
  buttonMap: Record<ActionType, number>;
  deadzone: number;
  scrollSpeed: number;
  scrollMode: 'smooth' | 'page';
  cursorSpeed: number;
}

export interface MessagePayload {
  type: MessageType;
  axes?: number[];
  config?: UserConfig;
}

export interface StoredConfig {
  selectedAxes?: number[];
  axes?: AxesConfig;
  buttonMap?: Record<ActionType, number>;
  deadzone?: number;
  scrollSpeed?: number;
  scrollMode?: 'smooth' | 'page';
  cursorSpeed?: number;
}
