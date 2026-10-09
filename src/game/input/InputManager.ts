import { InputMethod, InputPreference, ControlSettings, loadControlSettings, saveControlSettings } from './inputTypes';

export type GameplayAction =
  | 'MOVE'
  | 'AIM'
  | 'SPRINT'
  | 'CROUCH'
  | 'INTERACT'
  | 'SCANNER'
  | 'DECOY'
  | 'TAKEDOWN'
  | 'PAUSE'
  | 'CANCEL';

export type ActionHandler = (payload?: any) => void;

class InputManagerClass {
  private settings: ControlSettings;
  private activeMethod: InputMethod = 'KEYBOARD';
  private methodListeners: Set<(method: InputMethod) => void> = new Set();
  private actionListeners: Map<GameplayAction, Set<ActionHandler>> = new Map();
  private isInitialized = false;

  // Active keyboard tracking for continuous actions
  private pressedKeys: Record<string, boolean> = {};
  private currentMoveVector = { x: 0, y: 0 };
  private touchVector = { x: 0, y: 0 };
  private isSprinting = false;

  constructor() {
    this.settings = loadControlSettings();
    if (typeof window !== 'undefined') {
      const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
      if (this.settings.preference === 'TOUCH') {
        this.activeMethod = 'TOUCH';
      } else if (this.settings.preference === 'KEYBOARD') {
        this.activeMethod = 'KEYBOARD';
      } else if (this.settings.preference === 'GAMEPAD') {
        this.activeMethod = 'GAMEPAD';
      } else {
        this.activeMethod = isTouch ? 'TOUCH' : 'KEYBOARD';
      }
    }
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Listen for storage / custom settings change events
    window.addEventListener('neon_heist_controls_changed', (e: any) => {
      if (e.detail) {
        this.settings = e.detail;
        this.updateActiveMethodFromSettings();
      }
    });

    // Touch detection
    const onTouch = () => {
      if (this.settings.preference === 'AUTO' && this.activeMethod !== 'TOUCH') {
        this.setActiveMethod('TOUCH');
      }
    };

    // Keyboard event mapping to standardized actions
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in text inputs
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') {
        return;
      }

      if (this.settings.preference === 'AUTO' && this.activeMethod !== 'KEYBOARD') {
        this.setActiveMethod('KEYBOARD');
      }

      const code = e.code;
      const key = e.key.toLowerCase();
      this.pressedKeys[key] = true;

      // Handle Instant Action Triggers
      if (code === 'KeyE' || key === 'e') {
        this.triggerAction('INTERACT');
      } else if (code === 'KeyC' || key === 'c' || code === 'ControlLeft' || code === 'ControlRight') {
        this.triggerAction('CROUCH');
      } else if (code === 'KeyQ' || key === 'q') {
        this.triggerAction('SCANNER');
      } else if (code === 'KeyF' || key === 'f') {
        this.triggerAction('DECOY');
      } else if (code === 'Space') {
        e.preventDefault();
        this.triggerAction('TAKEDOWN');
      } else if (code === 'Escape') {
        this.triggerAction('PAUSE');
      }

      // Handle Sprint (Shift)
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        if (!this.isSprinting) {
          this.isSprinting = true;
          this.triggerAction('SPRINT', true);
        }
      }

      // Update Movement Vector
      this.updateKeyboardMovement();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      const key = e.key.toLowerCase();
      this.pressedKeys[key] = false;

      // Handle Sprint release
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        this.isSprinting = false;
        this.triggerAction('SPRINT', false);
      }

      // Update Movement Vector
      this.updateKeyboardMovement();
    };

    const onGamepadConnected = () => {
      if (this.settings.preference === 'AUTO') {
        this.setActiveMethod('GAMEPAD');
      }
    };

    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('pointerdown', (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        onTouch();
      } else if (e.pointerType === 'mouse' && this.settings.preference === 'AUTO' && this.activeMethod === 'TOUCH') {
        this.setActiveMethod('KEYBOARD');
      }
    }, { passive: true });

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('gamepadconnected', onGamepadConnected);

    window.addEventListener('blur', () => {
      this.pressedKeys = {};
      this.currentMoveVector = { x: 0, y: 0 };
      this.triggerAction('MOVE', { x: 0, y: 0 });
      if (this.isSprinting) {
        this.isSprinting = false;
        this.triggerAction('SPRINT', false);
      }
    });
  }

  private updateKeyboardMovement() {
    let dx = 0;
    let dy = 0;

    if (this.pressedKeys['w'] || this.pressedKeys['arrowup']) dy -= 1;
    if (this.pressedKeys['s'] || this.pressedKeys['arrowdown']) dy += 1;
    if (this.pressedKeys['a'] || this.pressedKeys['arrowleft']) dx -= 1;
    if (this.pressedKeys['d'] || this.pressedKeys['arrowright']) dx += 1;

    // Normalize diagonal velocity
    if (dx !== 0 && dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
    }

    if (dx !== this.currentMoveVector.x || dy !== this.currentMoveVector.y) {
      this.currentMoveVector = { x: dx, y: dy };
      this.triggerAction('MOVE', this.currentMoveVector);
    }
  }

  // --- ACTION BUS INTERFACE ---
  public onAction(action: GameplayAction, handler: ActionHandler): () => void {
    if (!this.actionListeners.has(action)) {
      this.actionListeners.set(action, new Set());
    }
    this.actionListeners.get(action)!.add(handler);
    return () => {
      this.actionListeners.get(action)?.delete(handler);
    };
  }

  public triggerAction(action: GameplayAction, payload?: any) {
    const handlers = this.actionListeners.get(action);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[InputManager] Error in action handler for ${action}:`, err);
        }
      });
    }
  }

  public isKeyPressed(key: string): boolean {
    return !!this.pressedKeys[key.toLowerCase()];
  }

  public getPressedKeys(): Record<string, boolean> {
    return { ...this.pressedKeys };
  }

  public setTouchMove(vec: { x: number; y: number }) {
    this.touchVector = { ...vec };
    if (this.settings.preference === 'AUTO' && (vec.x !== 0 || vec.y !== 0) && this.activeMethod !== 'TOUCH') {
      this.setActiveMethod('TOUCH');
    }
    this.triggerAction('MOVE', this.getMoveVector());
  }

  public getMoveVector(): { x: number; y: number } {
    if (this.touchVector.x !== 0 || this.touchVector.y !== 0) {
      return { ...this.touchVector };
    }
    return { ...this.currentMoveVector };
  }

  public resetInputs() {
    this.pressedKeys = {};
    this.currentMoveVector = { x: 0, y: 0 };
    this.touchVector = { x: 0, y: 0 };
    this.isSprinting = false;
    this.triggerAction('MOVE', { x: 0, y: 0 });
    this.triggerAction('SPRINT', false);
  }

  // --- SETTINGS & METHOD INTERFACE ---
  public getSettings(): ControlSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<ControlSettings>) {
    this.settings = { ...this.settings, ...partial };
    saveControlSettings(this.settings);
    this.updateActiveMethodFromSettings();
  }

  private updateActiveMethodFromSettings() {
    if (this.settings.preference === 'TOUCH') {
      this.setActiveMethod('TOUCH');
    } else if (this.settings.preference === 'KEYBOARD') {
      this.setActiveMethod('KEYBOARD');
    } else if (this.settings.preference === 'GAMEPAD') {
      this.setActiveMethod('GAMEPAD');
    } else {
      const isTouch = typeof window !== 'undefined' && (('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);
      this.setActiveMethod(isTouch ? 'TOUCH' : 'KEYBOARD');
    }
  }

  public getActiveMethod(): InputMethod {
    if (this.settings.preference !== 'AUTO') {
      return this.settings.preference;
    }
    return this.activeMethod;
  }

  private setActiveMethod(method: InputMethod) {
    if (this.activeMethod !== method) {
      this.activeMethod = method;
      this.methodListeners.forEach(cb => cb(method));
    }
  }

  public subscribe(cb: (method: InputMethod) => void): () => void {
    this.methodListeners.add(cb);
    return () => this.methodListeners.delete(cb);
  }

  public triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'light') navigator.vibrate(10);
        else if (type === 'medium') navigator.vibrate(25);
        else if (type === 'heavy') navigator.vibrate([30, 20, 30]);
      } catch {
        // Ignore devices where vibration is blocked
      }
    }
  }
}

export const InputManager = new InputManagerClass();
