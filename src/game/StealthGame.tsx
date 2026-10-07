import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Mission,
  Point,
  Guard,
  SecurityCamera,
  LaserGrid,
  Terminal,
  PlayStyle,
  MissionResult,
  Wall,
  LightSource,
  EnvironmentalObject,
  TutorialStep
} from '../types/game';
import { sound } from './audio';
import {
  calculateVisionPolygon,
  resolveWallCollisions,
  updateGuardAI,
  hasLineOfSight,
  isPointInShadow
} from './engine';
import { HackModal } from '../components/hacking/HackModal';
import { CameraTerminalModal } from '../components/cameras/CameraTerminalModal';
import { VaultCrackModal } from '../components/vault/VaultCrackModal';
import { RadioDialogue, DialogueMessage } from '../components/dialogue/RadioDialogue';
import { PauseMenu } from '../components/game/PauseMenu';
import { FailureScreen } from '../components/game/FailureScreen';
import { Shield, Eye, Zap, Radio, ArrowLeft, Scan, Volume2, CloudRain, Crosshair, Pause } from 'lucide-react';
import { ClayKey } from '../components/common/ClayKey';
import { TactileButton } from '../components/common/TactileButton';
import { useDevice } from '../hooks/useDevice';
import { useGamepad } from '../hooks/useGamepad';
import { TouchControls } from '../components/game/TouchControls';

interface StealthGameProps {
  mission: Mission;
  onMissionComplete: (result: MissionResult) => void;
  onAbort: () => void;
}

export const StealthGame: React.FC<StealthGameProps> = ({
  mission,
  onMissionComplete,
  onAbort
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player Kinematics & States
  const [playerPos, setPlayerPos] = useState<Point>({ ...mission.playerStart });
  const [playerAngle, setPlayerAngle] = useState(0);
  const [isCrouched, setIsCrouched] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannerEnergy, setScannerEnergy] = useState(100);
  const [isCloaked, setIsCloaked] = useState(false);
  const [cloakTimer, setCloakTimer] = useState(0);
  const [cloakCooldown, setCloakCooldown] = useState(0);
  const [distractionCooldown, setDistractionCooldown] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [inShadow, setInShadow] = useState(false);

  // Level Entities
  const [guards, setGuards] = useState<Guard[]>(() => JSON.parse(JSON.stringify(mission.guards)));
  const [cameras, setCameras] = useState<SecurityCamera[]>(() => JSON.parse(JSON.stringify(mission.cameras)));
  const [lasers, setLasers] = useState<LaserGrid[]>(() => JSON.parse(JSON.stringify(mission.lasers)));
  const [terminals, setTerminals] = useState<Terminal[]>(() => JSON.parse(JSON.stringify(mission.terminals)));
  const [walls, setWalls] = useState<Wall[]>(() => JSON.parse(JSON.stringify(mission.walls)));
  const [lights, setLights] = useState<LightSource[]>(() => JSON.parse(JSON.stringify(mission.lights || [])));
  const [envObjects, setEnvObjects] = useState<EnvironmentalObject[]>(() => JSON.parse(JSON.stringify(mission.envObjects || [])));

  // Heist Progression & Tutorial State
  const [targetAcquired, setTargetAcquired] = useState(false);
  const [alarmsActive, setAlarmsActive] = useState(false);
  const [detectionPercent, setDetectionPercent] = useState(0);
  const [highestDetection, setHighestDetection] = useState(0);
  const [guardsNeutralized, setGuardsNeutralized] = useState(0);
  const [systemsHacked, setSystemsHacked] = useState(0);
  const [missionStartTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isMutedInGame, setIsMutedInGame] = useState(false);
  const criticalAlarmTimerRef = useRef<number>(0);

  // Restart Mission function
  const handleRestartMission = useCallback(() => {
    setPlayerPos({ ...mission.playerStart });
    setPlayerAngle(0);
    setIsCrouched(false);
    setIsSprinting(false);
    setIsScannerActive(false);
    setIsCloaked(false);
    setGuards(JSON.parse(JSON.stringify(mission.guards)));
    setCameras(JSON.parse(JSON.stringify(mission.cameras)));
    setLasers(JSON.parse(JSON.stringify(mission.lasers)));
    setTerminals(JSON.parse(JSON.stringify(mission.terminals)));
    setWalls(JSON.parse(JSON.stringify(mission.walls)));
    setLights(JSON.parse(JSON.stringify(mission.lights || [])));
    setEnvObjects(JSON.parse(JSON.stringify(mission.envObjects || [])));
    setTargetAcquired(false);
    setAlarmsActive(false);
    setDetectionPercent(0);
    setHighestDetection(0);
    setGuardsNeutralized(0);
    setSystemsHacked(0);
    setIsPaused(false);
    setIsFailed(false);
    criticalAlarmTimerRef.current = 0;
    sound.stopAlarm();
    sound.stopTension();
  }, [mission]);

  // Tutorial Progression Step
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>(
    mission.isTutorial ? 'WAKEUP' : 'MOVE'
  );
  const [tutorialHint, setTutorialHint] = useState<string | null>(
    mission.isTutorial ? 'W A S D · MOVE' : null
  );

  // Dialogues & Modals
  const [currentDialogue, setCurrentDialogue] = useState<DialogueMessage | null>(() => {
    if (mission.isTutorial) {
      return {
        speaker: 'VERA',
        role: 'REMOTE OPERATOR',
        text: "You're awake. Good. Tonight is simple: get inside, take the package, get out. No alarms. No bodies. No mistakes."
      };
    }
    return {
      speaker: 'VERA',
      role: 'REMOTE OPERATOR',
      text: `Infiltration vector confirmed at ${mission.facilityName}. Maintain stealth discipline.`
    };
  });

  const [activeTerminal, setActiveTerminal] = useState<Terminal | null>(null);
  const [showCameraTerminal, setShowCameraTerminal] = useState(false);
  const [showVaultCrack, setShowVaultCrack] = useState(false);
  const [nearbyPrompt, setNearbyPrompt] = useState<string | null>(null);
  const [takedownGuard, setTakedownGuard] = useState<Guard | null>(null);

  // Noise & Decoy Arrays
  const noiseWavesRef = useRef<{ x: number; y: number; r: number; maxR: number; opacity: number }[]>([]);
  const distractionDecoysRef = useRef<{ x: number; y: number; timer: number }[]>([]);

  // Rain Particles & Lightning
  const rainDropsRef = useRef<{ x: number; y: number; l: number; v: number }[]>([]);
  const lightningRef = useRef<{ alpha: number; timer: number }>({ alpha: 0, timer: 12 });

  // Camera scroll offset & recoil shake
  const cameraOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const cameraShakeRef = useRef<number>(0);

  // Device & Cross-Platform Inputs
  const device = useDevice();
  const touchMoveRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchAimAngleRef = useRef<number | null>(null);

  // Resize canvas dynamically on window/viewport resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Input states
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const [pressedKeys, setPressedKeys] = useState<{ [key: string]: boolean }>({});
  const mousePosRef = useRef<Point>({ x: 0, y: 0 });
  const movedDistanceRef = useRef<number>(0);

  // Initialize Rain drops
  useEffect(() => {
    const drops = [];
    for (let i = 0; i < 90; i++) {
      drops.push({
        x: Math.random() * mission.mapWidth,
        y: Math.random() * mission.mapHeight,
        l: Math.random() * 18 + 10,
        v: Math.random() * 14 + 16
      });
    }
    rainDropsRef.current = drops;
  }, [mission.mapWidth, mission.mapHeight]);

  // Keyboard and Mouse input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;
      setPressedKeys(prev => ({ ...prev, [key]: true }));

      if (e.key === 'Escape' || key === 'p') {
        setIsPaused(prev => {
          const next = !prev;
          if (next) {
            sound.playPause();
          } else {
            sound.playResume();
          }
          return next;
        });
        return;
      }

      if (e.key === 'Shift') {
        setIsSprinting(true);
        if (mission.isTutorial && tutorialStep === 'SPRINT') {
          setTutorialStep('CROUCH');
          setTutorialHint('C OR CTRL · CROUCH');
          setCurrentDialogue({
            speaker: 'VERA',
            role: 'REMOTE OPERATOR',
            text: "Low maintenance duct ahead. Stay low."
          });
        }
      }

      if (key === 'c' || e.key === 'Control') {
        setIsCrouched(prev => {
          const next = !prev;
          if (next && mission.isTutorial && tutorialStep === 'CROUCH') {
            setTutorialStep('SHADOWS');
            setTutorialHint(null);
            setCurrentDialogue({
              speaker: 'VERA',
              role: 'REMOTE OPERATOR',
              text: "Quiet. Keep moving. Watch the shadows."
            });
          }
          return next;
        });
      }

      if (key === 'q') {
        toggleScanner();
      }

      if (key === 'f') {
        throwDistractionDecoy();
      }

      if (key === ' ' && takedownGuard) {
        performTakedown(takedownGuard.id);
      }

      if (key === 'e') {
        handleInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;
      setPressedKeys(prev => ({ ...prev, [key]: false }));
      if (e.key === 'Shift') {
        setIsSprinting(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left + cameraOffsetRef.current.x,
        y: e.clientY - rect.top + cameraOffsetRef.current.y
      };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tutorialStep, takedownGuard, mission.isTutorial, scannerEnergy, isScannerActive]);

  // Toggle Realistic AR Scanner
  const toggleScanner = () => {
    if (scannerEnergy <= 5 && !isScannerActive) return;
    setIsScannerActive(prev => {
      const next = !prev;
      sound.playScannerMode(next);
      if (next && mission.isTutorial && tutorialStep === 'SCANNER') {
        setTutorialStep('HACK_DOOR');
        setTutorialHint('E · INTERFACE TERMINAL');
        setCurrentDialogue({
          speaker: 'VERA',
          role: 'REMOTE OPERATOR',
          text: "Terminal located. Interface with it and bypass the magnetic seal."
        });
      }
      return next;
    });
  };

  // Throw Acoustic Distraction Device
  const throwDistractionDecoy = () => {
    if (distractionCooldown > 0) return;
    setDistractionCooldown(10.0);
    sound.playLightSwitch();

    // Aim target toward mouse (clamped to 300px distance)
    const dx = mousePosRef.current.x - playerPos.x;
    const dy = mousePosRef.current.y - playerPos.y;
    const dist = Math.hypot(dx, dy);
    const targetDist = Math.min(260, dist);
    const targetX = playerPos.x + (dist > 0 ? (dx / dist) * targetDist : 100);
    const targetY = playerPos.y + (dist > 0 ? (dy / dist) * targetDist : 0);

    distractionDecoysRef.current.push({ x: targetX, y: targetY, timer: 3.5 });

    // Spawn sound wave at target
    setTimeout(() => {
      sound.playUiHover();
      noiseWavesRef.current.push({
        x: targetX,
        y: targetY,
        r: 6,
        maxR: 240,
        opacity: 0.75
      });

      // Alert guards in radius with chatter
      setGuards(prev => prev.map(g => {
        const d = Math.hypot(g.x - targetX, g.y - targetY);
        if (d < 300 && g.state !== 'ALERT' && g.state !== 'STUNNED') {
          return {
            ...g,
            state: 'INVESTIGATE',
            investigateTarget: { x: targetX, y: targetY },
            voiceLine: { text: "You hear that? Checking it out.", timer: 3.0 }
          };
        }
        return g;
      }));

      if (mission.isTutorial && tutorialStep === 'DISTRACTION') {
        setTutorialStep('LIGHT_SWITCH');
        setTutorialHint('E · FLIP ROOM LIGHT SWITCH');
        setCurrentDialogue({
          speaker: 'VERA',
          role: 'REMOTE OPERATOR',
          text: "He took the bait. There's a light switch by the partition. Cut the power."
        });
      }
    }, 280);
  };

  // Perform non-lethal sleeper takedown
  const performTakedown = (guardId: string) => {
    sound.playConfirm();
    cameraShakeRef.current = 6;
    setGuards(prev => prev.map(g => {
      if (g.id === guardId) {
        return {
          ...g,
          state: 'STUNNED',
          stunTimer: 999,
          voiceLine: { text: "Urgh...", timer: 2.0 }
        };
      }
      return g;
    }));
    setGuardsNeutralized(prev => prev + 1);
    setTakedownGuard(null);
  };

  // Interact trigger (Terminals, Light switches, Vents, Vault, Extraction)
  const handleInteract = () => {
    // 1. Environmental Objects (Light switch, Maintenance vent)
    const nearbyEnv = envObjects.find(
      obj => Math.hypot(obj.x + obj.width / 2 - playerPos.x, obj.y + obj.height / 2 - playerPos.y) < 55
    );
    if (nearbyEnv) {
      if (nearbyEnv.type === 'LIGHT_SWITCH') {
        sound.playLightSwitch();
        setLights(prev => prev.map(l => l.id === nearbyEnv.targetId ? { ...l, isOn: !l.isOn } : l));
        setEnvObjects(prev => prev.map(o => o.id === nearbyEnv.id ? { ...o, isInteracted: !o.isInteracted } : o));

        if (mission.isTutorial && tutorialStep === 'LIGHT_SWITCH') {
          setTutorialStep('TARGET_CASE');
          setTutorialHint('E · SECURE ASSET FLIGHT CASE');
          setCurrentDialogue({
            speaker: 'VERA',
            role: 'REMOTE OPERATOR',
            text: "Lights out. Pitch black gives you the advantage. Proceed to the vault."
          });
        }
        return;
      }
      if (nearbyEnv.type === 'MAINTENANCE_VENT') {
        sound.playHydraulicDoor();
        setWalls(prev => prev.map(w => w.doorId === nearbyEnv.targetId ? { ...w, isOpen: true } : w));
        return;
      }
    }

    // 2. Terminal Hack
    const term = terminals.find(t => !t.isHacked && Math.hypot(t.x - playerPos.x, t.y - playerPos.y) < 55);
    if (term) {
      sound.playUiClick();
      setActiveTerminal(term);
      return;
    }

    // 3. Vault Case
    const v = mission.vault;
    if (!targetAcquired && Math.hypot(v.x + v.width / 2 - playerPos.x, v.y + v.height / 2 - playerPos.y) < 85) {
      sound.playFlightCaseOpen();
      setShowVaultCrack(true);
      return;
    }

    // 4. Extraction
    const ext = mission.extraction;
    if (targetAcquired && Math.hypot(ext.x - playerPos.x, ext.y - playerPos.y) < ext.radius) {
      completeExtraction();
      return;
    }
  };

  // Gamepad button trigger handler
  const handleGamepadButton = useCallback((btn: 'A' | 'B' | 'X' | 'Y' | 'LB' | 'START') => {
    if (btn === 'A') {
      if (takedownGuard) {
        performTakedown(takedownGuard.id);
      } else {
        handleInteract();
      }
    } else if (btn === 'B') {
      setIsCrouched(prev => !prev);
    } else if (btn === 'X') {
      throwDistractionDecoy();
    } else if (btn === 'Y') {
      toggleScanner();
    } else if (btn === 'LB') {
      setIsSprinting(prev => !prev);
    } else if (btn === 'START') {
      onAbort();
    }
  }, [takedownGuard, isScannerActive, scannerEnergy, distractionCooldown, playerPos, envObjects, terminals, targetAcquired]);

  const gamepad = useGamepad(handleGamepadButton);

  // Terminal hack complete
  const handleTerminalSuccess = () => {
    if (!activeTerminal) return;
    setSystemsHacked(prev => prev + 1);
    setTerminals(prev => prev.map(t => t.id === activeTerminal.id ? { ...t, isHacked: true } : t));

    if (activeTerminal.unlocksDoorId) {
      sound.playHydraulicDoor();
      setWalls(prev => prev.map(w => w.doorId === activeTerminal.unlocksDoorId ? { ...w, isOpen: true } : w));
    }
    if (activeTerminal.disablesCameraId) {
      setCameras(prev => prev.map(c => c.id === activeTerminal.disablesCameraId ? { ...c, isPowerOff: true } : c));
    }
    if (activeTerminal.disablesLaserId) {
      setLasers(prev => prev.map(l => l.id === activeTerminal.disablesLaserId ? { ...l, isActive: false, isHacked: true } : l));
    }

    // Tutorial advancement
    if (mission.isTutorial && tutorialStep === 'HACK_DOOR') {
      setTutorialStep('CAMERA');
      setTutorialHint(null);
      setCurrentDialogue({
        speaker: 'VERA',
        role: 'REMOTE OPERATOR',
        text: "Magnetic seal disengaged. Aurora-7 camera in the next corridor. Don't let its sweep touch you."
      });
    }

    setActiveTerminal(null);
  };

  // Vault cracked & The Twist sequence trigger
  const handleVaultComplete = () => {
    setTargetAcquired(true);
    setShowVaultCrack(false);

    if (mission.isTutorial) {
      // The Twist!
      setAlarmsActive(true);
      sound.startAlarm();
      cameraShakeRef.current = 15;
      setTutorialStep('ROOFTOP_ESCAPE');
      setTutorialHint('ESCAPE THROUGH ROOFTOP VENT TO EXTRACTION');

      // Unlock rooftop escape vent door
      setWalls(prev => prev.map(w => w.doorId === 'vent-escape-door' ? { ...w, isOpen: true } : w));

      // Guards go into search mode
      setGuards(prev => prev.map(g => ({
        ...g,
        state: 'SEARCH',
        speed: g.speed * 1.3,
        voiceLine: { text: "Lockdown initiated! Search the sector!", timer: 4.0 }
      })));

      setCurrentDialogue({
        speaker: 'VERA',
        role: 'REMOTE OPERATOR',
        text: "...That's not supposed to happen! System has your signature! Run! Rooftop vent opened!"
      });
    } else {
      setCurrentDialogue({
        speaker: 'VERA',
        role: 'REMOTE OPERATOR',
        text: `Target secured: ${mission.targetName}. Lockdown initiated. Proceed to extraction zone immediately!`
      });
    }
  };

  // Complete Extraction
  const completeExtraction = () => {
    sound.playConfirm();
    sound.stopAlarm();
    sound.stopTension();

    const timeSeconds = Math.round((Date.now() - missionStartTime) / 1000);
    const playStyle: PlayStyle =
      highestDetection === 0 && guardsNeutralized === 0 ? 'GHOST' :
      highestDetection < 45 ? 'GHOST_WITH_TRACE' : 'CHAOS';

    const stars = playStyle === 'GHOST' ? 5 : playStyle === 'GHOST_WITH_TRACE' ? 4 : 3;
    const stealthBonus = playStyle === 'GHOST' ? 18000 : playStyle === 'GHOST_WITH_TRACE' ? 8000 : 0;
    const noCasualtyBonus = guardsNeutralized === 0 ? 12000 : 0;
    const totalPayout = mission.basePayout + stealthBonus + noCasualtyBonus;

    onMissionComplete({
      missionId: mission.id,
      missionTitle: mission.title,
      facilityName: mission.facilityName,
      playStyle,
      ratingStars: stars,
      detectionPercent: highestDetection,
      timeSeconds,
      guardsNeutralized,
      systemsHacked,
      alarmsTriggered: alarmsActive ? 1 : 0,
      basePayout: mission.basePayout,
      stealthBonus,
      noCasualtyBonus,
      totalPayout
    });
  };

  // Main Simulation & Rendering Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const elapsed = (currentTime - lastTime) / 1000;
      const dt = Math.max(0.001, Math.min(0.05, isNaN(elapsed) || elapsed < 0 ? 0.016 : elapsed));
      lastTime = currentTime;

      if (isPaused || isFailed) {
        renderRealisticCanvas();
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      // Camera Shake decay
      if (cameraShakeRef.current > 0) {
        cameraShakeRef.current = Math.max(0, cameraShakeRef.current - 12 * dt);
      }

      // Scanner Energy Drain / Recharge
      if (isScannerActive) {
        setScannerEnergy(prev => {
          const next = prev - 15 * dt;
          if (next <= 0) {
            setIsScannerActive(false);
            sound.playScannerMode(false);
            return 0;
          }
          return next;
        });
      } else {
        setScannerEnergy(prev => Math.min(100, prev + 8 * dt));
      }

      // Lightning Thunder Cycle
      lightningRef.current.timer -= dt;
      if (lightningRef.current.timer <= 0) {
        lightningRef.current.alpha = 0.85;
        lightningRef.current.timer = Math.random() * 16 + 10;
        sound.playThunder();
      }
      if (lightningRef.current.alpha > 0) {
        lightningRef.current.alpha = Math.max(0, lightningRef.current.alpha - 2.5 * dt);
      }

      // Cooldowns
      if (cloakTimer > 0) {
        setCloakTimer(prev => {
          const next = prev - dt;
          if (next <= 0) {
            setIsCloaked(false);
            sound.playCloak(false);
            return 0;
          }
          return next;
        });
      }
      if (cloakCooldown > 0) setCloakCooldown(prev => Math.max(0, prev - dt));
      if (distractionCooldown > 0) setDistractionCooldown(prev => Math.max(0, prev - dt));
      setEnergy(prev => Math.min(100, prev + 5 * dt));

      // 1. KINEMATIC PLAYER MOVEMENT (Keyboard, Virtual Touch Joystick, Gamepad)
      let moveX = 0;
      let moveY = 0;

      // Touch joystick vector
      if (touchMoveRef.current.x !== 0 || touchMoveRef.current.y !== 0) {
        moveX += touchMoveRef.current.x;
        moveY += touchMoveRef.current.y;
      }

      // Gamepad Left Thumbstick
      if (gamepad.connected) {
        if (Math.abs(gamepad.leftStick.x) > 0.1) moveX += gamepad.leftStick.x;
        if (Math.abs(gamepad.leftStick.y) > 0.1) moveY += gamepad.leftStick.y;
      }

      // Keyboard
      if (keysRef.current['w'] || keysRef.current['arrowup']) moveY -= 1;
      if (keysRef.current['s'] || keysRef.current['arrowdown']) moveY += 1;
      if (keysRef.current['a'] || keysRef.current['arrowleft']) moveX -= 1;
      if (keysRef.current['d'] || keysRef.current['arrowright']) moveX += 1;

      const isMoving = moveX !== 0 || moveY !== 0;
      let speed = isCrouched ? 2.0 : isSprinting ? 4.8 : 3.2;
      if (isCloaked) speed *= 1.1;

      let newX = playerPos.x;
      let newY = playerPos.y;

      if (isMoving) {
        const len = Math.hypot(moveX, moveY);
        const stepX = (moveX / len) * speed * 60 * dt;
        const stepY = (moveY / len) * speed * 60 * dt;
        newX += stepX;
        newY += stepY;

        movedDistanceRef.current += Math.hypot(stepX, stepY);

        // Tutorial trigger for movement
        if (mission.isTutorial && tutorialStep === 'WAKEUP' && movedDistanceRef.current > 40) {
          setTutorialStep('SPRINT');
          setTutorialHint('HOLD SHIFT · SPRINT');
          setCurrentDialogue({
            speaker: 'VERA',
            role: 'REMOTE OPERATOR',
            text: "Good. Now run. Use SHIFT to sprint."
          });
        }

        // Realistic Footstep Acoustics
        if (Math.random() < (isSprinting ? 0.16 : 0.08)) {
          sound.playFootstep(isCrouched);
          const noiseMaxR = isCrouched ? 18 : isSprinting ? 140 : 65;
          noiseWavesRef.current.push({
            x: newX,
            y: newY,
            r: 5,
            maxR: noiseMaxR,
            opacity: isSprinting ? 0.6 : 0.3
          });
        }
      }

      // Smooth aim rotation (Touch, Gamepad Right Stick, or Mouse)
      if (touchAimAngleRef.current !== null) {
        setPlayerAngle(touchAimAngleRef.current);
      } else if (gamepad.connected && (Math.abs(gamepad.rightStick.x) > 0.15 || Math.abs(gamepad.rightStick.y) > 0.15)) {
        setPlayerAngle(Math.atan2(gamepad.rightStick.y, gamepad.rightStick.x));
      } else {
        const aimAngle = Math.atan2(mousePosRef.current.y - playerPos.y, mousePosRef.current.x - playerPos.x);
        setPlayerAngle(aimAngle);
      }

      // Collision against walls
      const resolved = resolveWallCollisions({ x: newX, y: newY }, 15, walls);
      setPlayerPos(resolved);

      // Check shadow state
      const playerInShadow = isPointInShadow(resolved, lights, walls);
      setInShadow(playerInShadow);

      // 2. NOISE WAVES EXPANSION & GUARDS REACTION
      noiseWavesRef.current = noiseWavesRef.current
        .map(wave => ({
          ...wave,
          r: Math.max(0, wave.r + 140 * dt),
          opacity: wave.opacity - 0.7 * dt
        }))
        .filter(w => w.opacity > 0 && w.r > 0);

      noiseWavesRef.current.forEach(wave => {
        guards.forEach(g => {
          if (g.state === 'PATROL' || g.state === 'RETURN') {
            const d = Math.hypot(g.x - wave.x, g.y - wave.y);
            if (d < wave.r + 20) {
              g.state = 'INVESTIGATE';
              g.investigateTarget = { x: wave.x, y: wave.y };
              g.voiceLine = { text: "Did you hear that?", timer: 2.5 };
              sound.playSuspicionAlert();
            }
          }
        });
      });

      // 3. CAMERAS SWEEP & LINE OF SIGHT
      let cameraDetected = false;
      const updatedCameras = cameras.map(cam => {
        if (cam.isPowerOff || cam.isLooping) {
          if (cam.disabledTimer) {
            cam.disabledTimer -= dt;
            if (cam.disabledTimer <= 0) cam.isPowerOff = false;
          }
          return cam;
        }

        const sweep = Math.sin(currentTime * 0.001 * cam.sweepSpeed) * (cam.sweepAngle / 2);
        const currentAngle = cam.baseAngle + sweep;

        if (!isCloaked) {
          const inCone = Math.hypot(playerPos.x - cam.x, playerPos.y - cam.y) < cam.range;
          if (inCone) {
            const targetAngle = Math.atan2(playerPos.y - cam.y, playerPos.x - cam.x);
            let diff = Math.abs(targetAngle - currentAngle);
            while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);

            if (diff < cam.fov / 2) {
              const clear = hasLineOfSight({ x: cam.x, y: cam.y }, playerPos, walls);
              if (clear) {
                cameraDetected = true;
              }
            }
          }
        }

        return { ...cam, angle: currentAngle };
      });
      setCameras(updatedCameras);

      // 4. GUARD AI UPDATE (WITH SHADOW DAMPENING)
      let anyGuardDetected = false;
      let maxAlert = 0;
      let nearestTakedown: Guard | null = null;

      const updatedGuards = guards.map(guard => {
        const { guard: updated, detected } = updateGuardAI(
          guard,
          playerPos,
          isCloaked,
          isCrouched,
          walls,
          dt,
          playerInShadow,
          () => sound.playSuspicionAlert(),
          () => {
            sound.startAlarm();
            setAlarmsActive(true);
            cameraShakeRef.current = 10;
          }
        );

        if (detected) anyGuardDetected = true;
        maxAlert = Math.max(maxAlert, updated.alertLevel);

        // Flanking Takedown Opportunity (behind guard within 42px)
        const dist = Math.hypot(updated.x - playerPos.x, updated.y - playerPos.y);
        if (dist < 42 && updated.state !== 'ALERT' && updated.state !== 'STUNNED') {
          const angleToPlayer = Math.atan2(playerPos.y - updated.y, playerPos.x - updated.x);
          let diff = Math.abs(angleToPlayer - updated.angle);
          while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
          if (diff > Math.PI * 0.5) {
            nearestTakedown = updated;
          }
        }

        return updated;
      });
      setGuards(updatedGuards);
      setTakedownGuard(nearestTakedown);

      // Overall Detection Calculation
      const overall = Math.max(maxAlert, cameraDetected ? 90 : 0);
      setDetectionPercent(overall);
      setHighestDetection(prev => Math.max(prev, overall));
      sound.setTensionLevel(overall / 100);

      if ((anyGuardDetected || cameraDetected) && !alarmsActive) {
        setAlarmsActive(true);
        sound.startAlarm();
      }

      if (overall >= 98) {
        criticalAlarmTimerRef.current += dt;
        if (criticalAlarmTimerRef.current > 4.5 && !isFailed) {
          setIsFailed(true);
          sound.playSuspicionAlert();
        }
      } else {
        criticalAlarmTimerRef.current = Math.max(0, criticalAlarmTimerRef.current - dt);
      }

      // Check context prompts
      checkPrompts();

      // Render physical scene to canvas
      renderRealisticCanvas();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      sound.stopAlarm();
      sound.stopTension();
    };
  }, [
    playerPos,
    isCrouched,
    isSprinting,
    isScannerActive,
    scannerEnergy,
    isCloaked,
    cloakTimer,
    cloakCooldown,
    distractionCooldown,
    energy,
    guards,
    cameras,
    lasers,
    terminals,
    walls,
    lights,
    envObjects,
    alarmsActive,
    targetAcquired,
    tutorialStep
  ]);

  // Contextual Prompts Check
  const checkPrompts = () => {
    // Environmental object (switch)
    const nearbyEnv = envObjects.find(
      o => Math.hypot(o.x + o.width / 2 - playerPos.x, o.y + o.height / 2 - playerPos.y) < 55
    );
    if (nearbyEnv) {
      setNearbyPrompt(`[E] TOGGLE ${nearbyEnv.name}`);
      return;
    }

    // Terminal
    const term = terminals.find(t => !t.isHacked && Math.hypot(t.x - playerPos.x, t.y - playerPos.y) < 55);
    if (term) {
      setNearbyPrompt(`[E] INTERFACE: ${term.name}`);
      return;
    }

    // Vault
    const v = mission.vault;
    if (!targetAcquired && Math.hypot(v.x + v.width / 2 - playerPos.x, v.y + v.height / 2 - playerPos.y) < 85) {
      setNearbyPrompt(`[E] SECURE PROTOTYPE FLIGHT CASE`);
      return;
    }

    // Extraction
    const ext = mission.extraction;
    if (targetAcquired && Math.hypot(ext.x - playerPos.x, ext.y - playerPos.y) < ext.radius) {
      setNearbyPrompt(`[E] BOARD EXTRACTION AERODYNE`);
      return;
    }

    setNearbyPrompt(null);
  };

  // Render Realistic Physical World
  const renderRealisticCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const screenW = canvas.width;
    const screenH = canvas.height;

    // Smooth follow camera with slight screen shake on alarms
    const shakeX = (Math.random() - 0.5) * cameraShakeRef.current;
    const shakeY = (Math.random() - 0.5) * cameraShakeRef.current;

    const camX = Math.max(0, Math.min(mission.mapWidth - screenW, playerPos.x - screenW / 2 + shakeX));
    const camY = Math.max(0, Math.min(mission.mapHeight - screenH, playerPos.y - screenH / 2 + shakeY));
    cameraOffsetRef.current = { x: camX, y: camY };

    ctx.save();
    ctx.clearRect(0, 0, screenW, screenH);
    ctx.translate(-camX, -camY);

    // 1. REALISTIC CONCRETE & BRUSHED TILES FLOOR
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, mission.mapWidth, mission.mapHeight);

    // Physical slab seams (60px)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let x = 0; x < mission.mapWidth; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mission.mapHeight);
      ctx.stroke();
    }
    for (let y = 0; y < mission.mapHeight; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mission.mapWidth, y);
      ctx.stroke();
    }

    // Surface Puddles in outdoor/skylight zones
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.beginPath();
    ctx.ellipse(160, 220, 60, 35, 0.2, 0, Math.PI * 2);
    ctx.ellipse(820, 780, 45, 25, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // 2. EXTRACTION ZONE (HELIPAD MARKINGS)
    const ext = mission.extraction;
    ctx.beginPath();
    ctx.arc(ext.x, ext.y, Math.max(0, ext.radius), 0, Math.PI * 2);
    ctx.fillStyle = targetAcquired ? 'rgba(34, 211, 238, 0.08)' : 'rgba(255, 255, 255, 0.03)';
    ctx.fill();
    ctx.strokeStyle = targetAcquired ? '#22d3ee' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Helipad 'H' Marking
    ctx.fillStyle = targetAcquired ? '#22d3ee' : 'rgba(255, 255, 255, 0.15)';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', ext.x, ext.y);

    // 3. SECURE FLIGHT CASE VAULT
    const v = mission.vault;
    ctx.fillStyle = '#111827';
    ctx.fillRect(v.x, v.y, v.width, v.height);
    ctx.strokeStyle = targetAcquired ? '#10b981' : '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(v.x, v.y, v.width, v.height);

    // Flight Case Texture
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(v.x + 12, v.y + 12, v.width - 24, v.height - 24);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('ASSET CONTAINER', v.x + v.width / 2, v.y + v.height / 2);

    // 4. ENVIRONMENTAL OBJECTS (SWITCHES & VENTS)
    envObjects.forEach(obj => {
      ctx.fillStyle = obj.isInteracted ? '#334155' : '#0284c7';
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);

      if (isScannerActive) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`[CIRCUIT] ${obj.name}`, obj.x, obj.y - 8);
      }
    });

    // 5. SECURITY TERMINALS
    terminals.forEach(term => {
      ctx.fillStyle = term.isHacked ? '#10b981' : '#0ea5e9';
      ctx.fillRect(term.x - 8, term.y - 8, 16, 16);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(term.x - 8, term.y - 8, 16, 16);

      // Terminal status light
      ctx.fillStyle = term.isHacked ? '#34d399' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(term.x, term.y - 12, 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (isScannerActive) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`[TERMINAL] ${term.name}`, term.x, term.y - 16);
      }
    });

    // 6. REALISTIC PHYSICAL LIGHTING (LIGHT SOURCES)
    lights.forEach(l => {
      if (!l.isOn) return;
      const grad = ctx.createRadialGradient(l.x, l.y, 10, l.x, l.y, l.radius);
      const baseCol = alarmsActive ? '#ef4444' : (l.color || '#e2e8f0');
      grad.addColorStop(0, `${baseCol}26`);
      grad.addColorStop(0.6, `${baseCol}0f`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2);
      ctx.fill();

      // Ceiling fixture lamp bulb
      ctx.fillStyle = alarmsActive ? '#f87171' : '#fef08a';
      ctx.beginPath();
      ctx.arc(l.x, l.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // 7. GUARDS FLASHLIGHT BEAMS (REALISTIC LIGHT CONES)
    guards.forEach(g => {
      if (g.state === 'STUNNED') return;

      const poly = calculateVisionPolygon(
        { x: g.x, y: g.y },
        g.angle,
        g.fov,
        g.sightRadius,
        walls
      );

      ctx.beginPath();
      ctx.moveTo(poly[0].x, poly[0].y);
      for (let i = 1; i < poly.length; i++) {
        ctx.lineTo(poly[i].x, poly[i].y);
      }
      ctx.closePath();

      // Radial gradient for flashlight falloff
      const grad = ctx.createRadialGradient(g.x, g.y, 10, g.x, g.y, g.sightRadius);
      if (g.state === 'ALERT') {
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
      } else if (g.alertLevel > 30) {
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0.05)');
      } else {
        grad.addColorStop(0, 'rgba(226, 232, 240, 0.22)');
        grad.addColorStop(1, 'rgba(226, 232, 240, 0.02)');
      }

      ctx.fillStyle = grad;
      ctx.fill();
    });

    // 8. CAMERA SWEEP VOLUMETRIC BEAMS
    cameras.forEach(cam => {
      if (cam.isPowerOff || cam.isLooping) return;

      const poly = calculateVisionPolygon(
        { x: cam.x, y: cam.y },
        cam.angle,
        cam.fov,
        cam.range,
        walls
      );

      ctx.beginPath();
      ctx.moveTo(poly[0].x, poly[0].y);
      for (let i = 1; i < poly.length; i++) {
        ctx.lineTo(poly[i].x, poly[i].y);
      }
      ctx.closePath();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Physical camera chassis
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(cam.x, cam.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Lens LED
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cam.x, cam.y, 2, 0, Math.PI * 2);
      ctx.fill();

      if (isScannerActive) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`[AURORA-7 CAMERA]`, cam.x - 30, cam.y - 12);
      }
    });

    // 9. SOLID ARCHITECTURAL WALLS & DOORS
    walls.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);

      if (w.type === 'DOOR') {
        ctx.strokeStyle = w.isOpen ? 'rgba(56, 189, 248, 0.2)' : '#0284c7';
        ctx.lineWidth = w.isOpen ? 2 : 6;
        ctx.setLineDash(w.isOpen ? [4, 4] : []);
      } else {
        // Physical textured concrete / steel bulkhead
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 8;
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Metal rim highlights on walls
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 10. NOISE & ACOUSTIC RIPPLES
    noiseWavesRef.current.forEach(wave => {
      if (wave.r <= 0) return;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, Math.max(0, wave.r), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, wave.opacity)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Distraction Decoy Objects
    distractionDecoysRef.current.forEach(d => {
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(d.x, d.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // 11. GUARDS & VOICE CHATTER BUBBLES
    guards.forEach(g => {
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.angle);

      // Guard physical body
      ctx.fillStyle = g.state === 'STUNNED' ? '#475569' : '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();

      // Tactical harness
      ctx.strokeStyle = g.state === 'ALERT' ? '#ef4444' : '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Weapon / flashlight mount
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(6, -3, 8, 6);

      ctx.restore();

      // Guard Voice Line Speech Bubble
      if (g.voiceLine) {
        ctx.save();
        ctx.font = '10px "JetBrains Mono", monospace';
        const txt = g.voiceLine.text;
        const textWidth = ctx.measureText(txt).width;
        ctx.fillStyle = 'rgba(10, 15, 26, 0.88)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.roundRect(g.x - textWidth / 2 - 8, g.y - 34, textWidth + 16, 20, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(txt, g.x, g.y - 24);
        ctx.restore();
      }

      if (isScannerActive) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`[PERSONNEL: ${g.state}]`, g.x - 30, g.y + 24);
      }
    });

    // 12. PLAYER CHARACTER (THE GHOST)
    ctx.save();
    ctx.translate(playerPos.x, playerPos.y);
    ctx.rotate(playerAngle);

    if (isCloaked) {
      // Optical Cloak light refraction
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Infiltrator Technical Suit
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      // Tactical rim light
      ctx.strokeStyle = isCrouched ? '#0284c7' : '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tactical visor/goggles
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(6, -2.5, 5, 5);
    }
    ctx.restore();

    // 13. RAIN STREAKS & LIGHTNING FLASH OVERLAY
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    rainDropsRef.current.forEach(drop => {
      drop.y += drop.v;
      if (drop.y > mission.mapHeight) {
        drop.y = -20;
        drop.x = Math.random() * mission.mapWidth;
      }
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 2, drop.y + drop.l);
      ctx.stroke();
    });

    // Lightning Flash
    if (lightningRef.current.alpha > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${lightningRef.current.alpha * 0.3})`;
      ctx.fillRect(0, 0, mission.mapWidth, mission.mapHeight);
    }

    ctx.restore(); // Restore camera translation
  };

  return (
    <div className={`relative w-screen h-screen bg-[#06080e] overflow-hidden select-none font-mono-tech ${isScannerActive ? 'grayscale-[35%]' : ''}`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Atmospheric Vignette & Emergency Alarm Sweep */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
        alarmsActive ? 'bg-red-950/20 shadow-[inset_0_0_90px_rgba(239,68,68,0.35)]' : 'cyber-vignette opacity-70'
      }`} />

      {/* DIEGETIC MINIMAL CENTER CROSSHAIR */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-40">
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-cyan-400" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-cyan-400" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-cyan-400" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-cyan-400" />
        </div>
      </div>

      {/* TOP-LEFT DIEGETIC BRUTALIST GLASS HUD */}
      <div className="absolute top-5 left-5 z-30 flex flex-col gap-2">
        <div className="brutal-frame glass-hud rounded-2xl p-4 shadow-2xl min-w-[230px] terminal-glass surface-imperfections space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="brutal-stamp text-[9px] text-cyan-400 border-cyan-500/30">
                GHOST // 07
              </span>
              <div className="text-sm font-display font-extrabold text-white tracking-wide mt-1">
                OPERATIVE 07
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              inShadow 
                ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30' 
                : 'text-amber-400 bg-amber-950/60 border border-amber-500/30'
            }`}>
              {inShadow ? 'CONCEALED' : 'EXPOSED'}
            </span>
          </div>

          {/* Energy & Scanner Battery */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono-tech">
              <span>SCANNER / AUX</span>
              <span className="text-cyan-300 font-bold">{Math.round(scannerEnergy)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-150 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                style={{ width: `${scannerEnergy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2">
          <TactileButton
            variant="glass"
            size="sm"
            icon={<Pause className="w-3 h-3" />}
            onClick={() => {
              sound.playPause();
              setIsPaused(true);
            }}
            className="text-[10px]"
          >
            PAUSE
          </TactileButton>

          <TactileButton
            variant="glass"
            size="sm"
            icon={<ArrowLeft className="w-3 h-3" />}
            onClick={onAbort}
            className="text-[10px]"
          >
            ABORT
          </TactileButton>
        </div>
      </div>

      {/* TOP-RIGHT OVERSIZED BRUTALIST SECURITY HUD */}
      <div className="absolute top-5 right-5 z-30 flex flex-col items-end gap-2">
        <div className="brutal-frame glass-hud rounded-2xl p-4 shadow-2xl min-w-[240px] terminal-glass surface-imperfections text-right space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className={`brutal-stamp text-[9px] ${
              detectionPercent >= 80 ? 'text-rose-400 border-rose-500/40 animate-pulse' :
              detectionPercent >= 40 ? 'text-amber-400 border-amber-500/40' :
              'text-cyan-400 border-cyan-500/30'
            }`}>
              SECURITY GRID
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono-tech">
              {detectionPercent >= 80 ? 'ALARM LEVEL' : 'DETECTION'}
            </span>
          </div>

          {/* Oversized Detection Number */}
          <div className="flex items-baseline justify-end gap-2">
            <span className={`text-4xl font-display font-black tracking-tight ${
              detectionPercent >= 80 ? 'text-rose-500 animate-pulse' :
              detectionPercent >= 40 ? 'text-amber-400' : 'text-slate-100'
            }`}>
              {detectionPercent >= 90 ? 'CRITICAL' : `${Math.round(detectionPercent)}%`}
            </span>
          </div>

          {/* Objective Directive */}
          <div className="pt-2 border-t border-white/10 text-left">
            <span className="text-[9px] text-cyan-400 uppercase tracking-widest block">
              DIRECTIVE
            </span>
            <div className="text-xs font-display font-bold text-white mt-0.5">
              {targetAcquired ? 'EVACUATE TO ROOFTOP AERODYNE' : `SECURE ${mission.targetName}`}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM-LEFT DIEGETIC HEALTH & STAMINA */}
      <div className="absolute bottom-5 left-5 z-30">
        <div className="brutal-frame glass-hud rounded-2xl p-4 shadow-2xl min-w-[220px] terminal-glass surface-imperfections space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">HEALTH VITALITY</span>
            <span className="text-xs font-mono-tech text-cyan-300 font-bold">100%</span>
          </div>

          {/* Diegetic Block Bar */}
          <div className="flex gap-1 py-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-2 flex-1 rounded-xs bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.4)]"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
            <span>SIGNATURE</span>
            <span className={`font-bold ${
              isCrouched ? 'text-emerald-400' : isSprinting ? 'text-rose-400' : 'text-cyan-400'
            }`}>
              {isCrouched ? 'SILENT (CROUCH)' : isSprinting ? 'NOISY (SPRINT)' : 'STANDARD'}
            </span>
          </div>
        </div>
      </div>

      {/* TUTORIAL CONTEXTUAL PHYSICAL CLAY KEYS */}
      {mission.isTutorial && tutorialHint && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="brutal-frame glass-primary px-5 py-3 rounded-2xl flex items-center gap-3 terminal-glass shadow-2xl">
            <span className="text-xs font-display font-bold text-white tracking-wider">
              {tutorialHint}
            </span>
            {tutorialStep === 'MOVE' && (
              <div className="flex items-center gap-1.5 ml-2">
                <ClayKey keyLabel="W" isPressed={!!pressedKeys['w']} size="sm" />
                <ClayKey keyLabel="A" isPressed={!!pressedKeys['a']} size="sm" />
                <ClayKey keyLabel="S" isPressed={!!pressedKeys['s']} size="sm" />
                <ClayKey keyLabel="D" isPressed={!!pressedKeys['d']} size="sm" />
              </div>
            )}
            {tutorialStep === 'CROUCH' && (
              <div className="flex items-center gap-1.5 ml-2">
                <ClayKey keyLabel="C" isPressed={!!pressedKeys['c'] || isCrouched} size="sm" />
                <span className="text-[10px] text-slate-400">OR</span>
                <ClayKey keyLabel="CTRL" isPressed={!!pressedKeys['control']} size="sm" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM-RIGHT TACTICAL EQUIPMENT CONTROLS (Desktop & Non-touch) */}
      {!device.isTouch && device.deviceType === 'desktop' && (
        <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2.5">
          {/* Scanner Keycap */}
          <button
            onClick={toggleScanner}
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
              isScannerActive
                ? 'bg-gradient-to-b from-cyan-400 to-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)] translate-y-0.5'
                : 'bg-[#0a0f1d]/80 hover:bg-[#121a2f] border-white/10 text-slate-200'
            }`}
          >
            <ClayKey keyLabel={device.activeInputMethod === 'GAMEPAD' ? 'Y' : 'Q'} isPressed={!!pressedKeys['q'] || isScannerActive} size="sm" />
            <span className="text-xs font-mono-tech tracking-wider">SCANNER</span>
          </button>

          {/* Decoy Keycap */}
          <button
            onClick={throwDistractionDecoy}
            disabled={distractionCooldown > 0}
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
              distractionCooldown > 0
                ? 'bg-black/50 border-white/5 text-slate-600 opacity-60 cursor-not-allowed'
                : 'bg-[#0a0f1d]/80 hover:bg-[#121a2f] border-white/10 text-purple-300'
            }`}
          >
            <ClayKey keyLabel={device.activeInputMethod === 'GAMEPAD' ? 'X' : 'F'} isPressed={!!pressedKeys['f']} size="sm" />
            <span className="text-xs font-mono-tech tracking-wider">
              DECOY {distractionCooldown > 0 && `(${Math.ceil(distractionCooldown)}s)`}
            </span>
          </button>

          {/* Crouch Keycap */}
          <button
            onClick={() => setIsCrouched(prev => !prev)}
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
              isCrouched
                ? 'bg-gradient-to-b from-[#182438] to-[#0f1725] border-cyan-400 text-cyan-300 font-bold translate-y-0.5 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                : 'bg-[#0a0f1d]/80 hover:bg-[#121a2f] border-white/10 text-slate-200'
            }`}
          >
            <ClayKey keyLabel={device.activeInputMethod === 'GAMEPAD' ? 'B' : 'C'} isPressed={!!pressedKeys['c'] || isCrouched} size="sm" />
            <span className="text-xs font-mono-tech tracking-wider">CROUCH</span>
          </button>
        </div>
      )}

      {/* ADAPTIVE VIRTUAL TOUCH CONTROLS FOR TOUCH/MOBILE DEVICES */}
      {(device.isTouch || device.deviceType !== 'desktop') && (
        <TouchControls
          onMove={(vec) => { touchMoveRef.current = vec; }}
          onAim={(angle) => { touchAimAngleRef.current = angle; }}
          onInteract={handleInteract}
          onToggleCrouch={() => setIsCrouched(prev => !prev)}
          isCrouched={isCrouched}
          onToggleSprint={(sprinting) => setIsSprinting(sprinting)}
          isSprinting={isSprinting}
          onTriggerScanner={toggleScanner}
          isScannerActive={isScannerActive}
          onThrowDecoy={throwDistractionDecoy}
          decoyCooldown={distractionCooldown}
          onTakedown={() => takedownGuard && performTakedown(takedownGuard.id)}
          hasTakedownPrompt={!!takedownGuard}
          hasNearbyPrompt={!!nearbyPrompt}
        />
      )}

      {/* CONTEXTUAL IN-WORLD INTERACTION PROMPT */}
      {nearbyPrompt && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-16 z-30 pointer-events-none">
          <div className="brutal-frame glass-primary px-4 py-2.5 rounded-xl flex items-center gap-2.5 border-cyan-400 shadow-xl animate-pulse">
            <ClayKey keyLabel={device.activeInputMethod === 'GAMEPAD' ? 'A' : device.activeInputMethod === 'TOUCH' ? 'TAP' : 'E'} size="sm" />
            <span className="text-xs font-bold text-cyan-300 tracking-wider">
              {nearbyPrompt}
            </span>
          </div>
        </div>
      )}

      {/* TAKEDOWN PROMPT */}
      {takedownGuard && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 z-30 pointer-events-none">
          <div className="brutal-frame-danger glass-primary px-5 py-2.5 rounded-xl flex items-center gap-2.5 border-rose-500 shadow-xl animate-bounce">
            <ClayKey keyLabel={device.activeInputMethod === 'GAMEPAD' ? 'A' : device.activeInputMethod === 'TOUCH' ? 'TAP' : 'SPACE'} size="sm" />
            <span className="text-xs font-bold text-rose-300 tracking-wider">
              SILENT TAKEDOWN
            </span>
          </div>
        </div>
      )}

      {/* VERA TACTICAL RADIO TRANSMISSION */}
      <RadioDialogue
        dialogue={currentDialogue}
        onDismiss={() => setCurrentDialogue(null)}
      />

      {/* HACKING MODAL */}
      {activeTerminal && (
        <HackModal
          terminal={activeTerminal}
          onSuccess={handleTerminalSuccess}
          onClose={() => setActiveTerminal(null)}
        />
      )}

      {/* CAMERA TERMINAL MODAL */}
      {showCameraTerminal && (
        <CameraTerminalModal
          cameras={cameras}
          onLoopCamera={(id) => {
            setCameras(prev => prev.map(c => c.id === id ? { ...c, isLooping: !c.isLooping } : c));
          }}
          onDisableCamera={(id) => {
            setCameras(prev => prev.map(c => c.id === id ? { ...c, isPowerOff: !c.isPowerOff } : c));
          }}
          onRotateCamera={(id) => {
            setCameras(prev => prev.map(c => c.id === id ? { ...c, baseAngle: c.baseAngle + Math.PI / 4 } : c));
          }}
          onClose={() => setShowCameraTerminal(false)}
        />
      )}

      {/* VAULT CRACK MODAL */}
      {showVaultCrack && (
        <VaultCrackModal
          targetName={mission.targetName}
          securityLayers={mission.vault.securityLayers}
          onComplete={handleVaultComplete}
          onClose={() => setShowVaultCrack(false)}
        />
      )}

      {/* PAUSE MENU MODAL */}
      {isPaused && (
        <PauseMenu
          missionTitle={mission.title}
          facilityName={mission.facilityName}
          timeElapsedSeconds={Math.floor((Date.now() - missionStartTime) / 1000)}
          detectionPercent={highestDetection}
          isMuted={isMutedInGame}
          onResume={() => setIsPaused(false)}
          onRestart={handleRestartMission}
          onToggleMute={() => {
            const next = !isMutedInGame;
            setIsMutedInGame(next);
            sound.setMuted(next);
          }}
          onAbort={onAbort}
        />
      )}

      {/* FAILURE SCREEN MODAL */}
      {isFailed && (
        <FailureScreen
          missionTitle={mission.title}
          facilityName={mission.facilityName}
          detectionPercent={highestDetection}
          onRetry={handleRestartMission}
          onAbort={onAbort}
        />
      )}
    </div>
  );
};
