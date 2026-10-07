import { useEffect, useRef, useState } from 'react';

export interface GamepadState {
  connected: boolean;
  leftStick: { x: number; y: number };
  rightStick: { x: number; y: number };
  buttonA: boolean; // Interact / Takedown
  buttonB: boolean; // Crouch
  buttonX: boolean; // Decoy
  buttonY: boolean; // Scanner
  buttonLB: boolean; // Sprint
  buttonStart: boolean; // Abort / Menu
  gamepadName?: string;
}

export function useGamepad(onButtonPress?: (button: 'A' | 'B' | 'X' | 'Y' | 'LB' | 'START') => void) {
  const [gamepadState, setGamepadState] = useState<GamepadState>({
    connected: false,
    leftStick: { x: 0, y: 0 },
    rightStick: { x: 0, y: 0 },
    buttonA: false,
    buttonB: false,
    buttonX: false,
    buttonY: false,
    buttonLB: false,
    buttonStart: false
  });

  const prevButtonsRef = useRef<{ [key: string]: boolean }>({});
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const deadzone = 0.18;

    const poll = () => {
      if (typeof navigator !== 'undefined' && navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0] || gamepads[1];

        if (gp && gp.connected) {
          // Normalize Left Stick
          let lx = gp.axes[0] || 0;
          let ly = gp.axes[1] || 0;
          if (Math.abs(lx) < deadzone) lx = 0;
          if (Math.abs(ly) < deadzone) ly = 0;

          // Normalize Right Stick
          let rx = gp.axes[2] || 0;
          let ry = gp.axes[3] || 0;
          if (Math.abs(rx) < deadzone) rx = 0;
          if (Math.abs(ry) < deadzone) ry = 0;

          const buttonA = !!gp.buttons[0]?.pressed;
          const buttonB = !!gp.buttons[1]?.pressed;
          const buttonX = !!gp.buttons[2]?.pressed;
          const buttonY = !!gp.buttons[3]?.pressed;
          const buttonLB = !!gp.buttons[4]?.pressed || !!gp.buttons[10]?.pressed;
          const buttonStart = !!gp.buttons[9]?.pressed;

          // Detect edge presses
          if (buttonA && !prevButtonsRef.current.buttonA) onButtonPress?.('A');
          if (buttonB && !prevButtonsRef.current.buttonB) onButtonPress?.('B');
          if (buttonX && !prevButtonsRef.current.buttonX) onButtonPress?.('X');
          if (buttonY && !prevButtonsRef.current.buttonY) onButtonPress?.('Y');
          if (buttonLB && !prevButtonsRef.current.buttonLB) onButtonPress?.('LB');
          if (buttonStart && !prevButtonsRef.current.buttonStart) onButtonPress?.('START');

          prevButtonsRef.current = { buttonA, buttonB, buttonX, buttonY, buttonLB, buttonStart };

          setGamepadState({
            connected: true,
            leftStick: { x: lx, y: ly },
            rightStick: { x: rx, y: ry },
            buttonA,
            buttonB,
            buttonX,
            buttonY,
            buttonLB,
            buttonStart,
            gamepadName: gp.id
          });
        } else {
          setGamepadState(prev => prev.connected ? { ...prev, connected: false } : prev);
        }
      }
      rafRef.current = requestAnimationFrame(poll);
    };

    rafRef.current = requestAnimationFrame(poll);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onButtonPress]);

  return gamepadState;
}
