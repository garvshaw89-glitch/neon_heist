import { useState, useEffect } from 'react';
import { InputManager } from '../game/input/InputManager';
import { InputMethod, ControlSettings } from '../game/input/inputTypes';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type QualityTier = 'ULTRA' | 'HIGH' | 'MEDIUM' | 'LOW';
export type { InputMethod };

export interface DeviceInfo {
  isTouch: boolean;
  deviceType: DeviceType;
  orientation: 'portrait' | 'landscape';
  qualityTier: QualityTier;
  width: number;
  height: number;
  activeInputMethod: InputMethod;
  hasGamepad: boolean;
  controlSettings: ControlSettings;
}

export function useDevice(): DeviceInfo {
  const getInitialDeviceType = (): DeviceType => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  };

  const getInitialQuality = (): QualityTier => {
    if (typeof window === 'undefined') return 'HIGH';
    const w = window.innerWidth;
    const cores = navigator.hardwareConcurrency || 4;
    if (w < 768 || cores <= 2) return 'LOW';
    if (w < 1024 || cores <= 4) return 'MEDIUM';
    if (cores >= 8 && w >= 1440) return 'ULTRA';
    return 'HIGH';
  };

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    InputManager.init();
    const isTouch = 
      typeof window !== 'undefined' &&
      (('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

    return {
      isTouch,
      deviceType: getInitialDeviceType(),
      orientation: typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      qualityTier: getInitialQuality(),
      width: typeof window !== 'undefined' ? window.innerWidth : 1280,
      height: typeof window !== 'undefined' ? window.innerHeight : 800,
      activeInputMethod: InputManager.getActiveMethod(),
      hasGamepad: false,
      controlSettings: InputManager.getSettings()
    };
  });

  useEffect(() => {
    InputManager.init();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const deviceType: DeviceType = w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
      const orientation = w > h ? 'landscape' : 'portrait';

      setDeviceInfo(prev => ({
        ...prev,
        width: w,
        height: h,
        deviceType,
        orientation
      }));
    };

    const unsubscribeInput = InputManager.subscribe((activeMethod) => {
      setDeviceInfo(prev => ({
        ...prev,
        activeInputMethod: activeMethod,
        controlSettings: InputManager.getSettings()
      }));
    });

    const handleGamepadConnected = () => {
      setDeviceInfo(prev => ({ ...prev, hasGamepad: true }));
    };

    const handleGamepadDisconnected = () => {
      setDeviceInfo(prev => ({ ...prev, hasGamepad: false }));
    };

    const handleControlsChanged = () => {
      setDeviceInfo(prev => ({
        ...prev,
        activeInputMethod: InputManager.getActiveMethod(),
        controlSettings: InputManager.getSettings()
      }));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
    window.addEventListener('neon_heist_controls_changed', handleControlsChanged);

    return () => {
      unsubscribeInput();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      window.removeEventListener('neon_heist_controls_changed', handleControlsChanged);
    };
  }, []);

  return deviceInfo;
}
