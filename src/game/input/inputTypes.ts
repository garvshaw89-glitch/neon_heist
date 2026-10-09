export type InputMethod = 'KEYBOARD' | 'TOUCH' | 'GAMEPAD';
export type InputPreference = 'AUTO' | 'TOUCH' | 'KEYBOARD' | 'GAMEPAD';

export interface ControlSettings {
  preference: InputPreference;
  touchSensitivity: number; // 0.5 to 2.5, default 1.0
  cameraSensitivity: number; // 0.5 to 2.5, default 1.0
  joystickSize: 'sm' | 'md' | 'lg'; // default 'md'
  buttonSize: 'sm' | 'md' | 'lg'; // default 'md'
  controlOpacity: number; // 0.3 to 1.0, default 0.85
  leftHanded: boolean; // default false (swaps joystick and buttons)
  invertVerticalLook: boolean; // default false
  crouchMode: 'TOGGLE' | 'HOLD'; // default 'TOGGLE'
  sprintMode: 'HOLD' | 'TOGGLE'; // default 'HOLD'
}

export const DEFAULT_CONTROL_SETTINGS: ControlSettings = {
  preference: 'AUTO',
  touchSensitivity: 1.0,
  cameraSensitivity: 1.0,
  joystickSize: 'md',
  buttonSize: 'md',
  controlOpacity: 0.85,
  leftHanded: false,
  invertVerticalLook: false,
  crouchMode: 'TOGGLE',
  sprintMode: 'HOLD'
};

const STORAGE_KEY = 'neon_heist_control_settings_v2';

export function loadControlSettings(): ControlSettings {
  if (typeof window === 'undefined') return DEFAULT_CONTROL_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTROL_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONTROL_SETTINGS,
      ...parsed
    };
  } catch {
    return DEFAULT_CONTROL_SETTINGS;
  }
}

export function saveControlSettings(settings: ControlSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('neon_heist_controls_changed', { detail: settings }));
  } catch {
    // Ignore storage quota errors
  }
}
