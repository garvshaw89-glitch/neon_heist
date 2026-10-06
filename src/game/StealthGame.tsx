import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Mission, Point, Guard, SecurityCamera, LaserGrid, Terminal, PlayStyle, MissionResult, Wall } from '../types/game';
import { sound } from './audio';
import {
  calculateVisionPolygon,
  resolveWallCollisions,
  updateGuardAI,
  hasLineOfSight
} from './engine';
import { HackModal } from '../components/hacking/HackModal';
import { CameraTerminalModal } from '../components/cameras/CameraTerminalModal';
import { VaultCrackModal } from '../components/vault/VaultCrackModal';
import { RadioDialogue, DialogueMessage } from '../components/dialogue/RadioDialogue';
import { Shield, Eye, Zap, Radio, AlertTriangle, ArrowLeft } from 'lucide-react';

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

  // Gameplay state
  const [playerPos, setPlayerPos] = useState<Point>({ ...mission.playerStart });
  const [playerAngle, setPlayerAngle] = useState(0);
  const [isCrouched, setIsCrouched] = useState(false);
  const [isCloaked, setIsCloaked] = useState(false);
  const [cloakTimer, setCloakTimer] = useState(0);
  const [cloakCooldown, setCloakCooldown] = useState(0);
  const [empCooldown, setEmpCooldown] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [health, setHealth] = useState(100);

  // Entities state
  const [guards, setGuards] = useState<Guard[]>(() => JSON.parse(JSON.stringify(mission.guards)));
  const [cameras, setCameras] = useState<SecurityCamera[]>(() => JSON.parse(JSON.stringify(mission.cameras)));
  const [lasers, setLasers] = useState<LaserGrid[]>(() => JSON.parse(JSON.stringify(mission.lasers)));
  const [terminals, setTerminals] = useState<Terminal[]>(() => JSON.parse(JSON.stringify(mission.terminals)));
  const [walls, setWalls] = useState<Wall[]>(() => JSON.parse(JSON.stringify(mission.walls)));
  
  // Heist progression
  const [targetAcquired, setTargetAcquired] = useState(false);
  const [alarmsActive, setAlarmsActive] = useState(false);
  const [detectionPercent, setDetectionPercent] = useState(0);
  const [highestDetection, setHighestDetection] = useState(0);
  const [guardsNeutralized, setGuardsNeutralized] = useState(0);
  const [systemsHacked, setSystemsHacked] = useState(0);
  const [missionStartTime] = useState(Date.now());

  // Interactive prompts
  const [activeTerminal, setActiveTerminal] = useState<Terminal | null>(null);
  const [showCameraTerminal, setShowCameraTerminal] = useState(false);
  const [showVaultCrack, setShowVaultCrack] = useState(false);
  const [nearbyPrompt, setNearbyPrompt] = useState<string | null>(null);
  const [takedownGuard, setTakedownGuard] = useState<Guard | null>(null);

  // Radio Dialogue
  const [currentDialogue, setCurrentDialogue] = useState<DialogueMessage | null>({
    speaker: 'VERA',
    role: 'TACTICAL OPERATOR',
    text: `You are inside ${mission.facilityName}. Avoid light cones and locate the terminal network.`
  });

  // Sound noise rings
  const noiseWavesRef = useRef<{ x: number; y: number; r: number; maxR: number; opacity: number }[]>([]);

  // Input keys
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mousePosRef = useRef<Point>({ x: 0, y: 0 });

  // Camera scroll offset
  const cameraOffsetRef = useRef<Point>({ x: 0, y: 0 });

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;

      if (e.key.toLowerCase() === 'c') {
        setIsCrouched(prev => !prev);
      }
      if (e.key.toLowerCase() === 'q') {
        activateCloak();
      }
      if (e.key.toLowerCase() === 'f') {
        activateEmp();
      }
      if (e.key === ' ' && takedownGuard) {
        performTakedown(takedownGuard.id);
      }
      if (e.key.toLowerCase() === 'e') {
        handleInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
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
  }, [takedownGuard, activeTerminal, showVaultCrack]);

  // Activate Cloak
  const activateCloak = () => {
    if (cloakCooldown > 0 || energy < 25) return;
    setIsCloaked(true);
    setCloakTimer(8.0);
    setCloakCooldown(24.0);
    setEnergy(prev => Math.max(0, prev - 25));
    sound.playCloak(true);
  };

  // Activate EMP / Distraction
  const activateEmp = () => {
    if (empCooldown > 0) return;
    setEmpCooldown(18.0);
    sound.playEmpPulse();

    // Disable nearby cameras and stun guards within 350px
    setGuards(prev => prev.map(g => {
      const dist = Math.hypot(g.x - playerPos.x, g.y - playerPos.y);
      if (dist < 380) {
        return { ...g, state: 'STUNNED', stunTimer: 9.0 };
      }
      return g;
    }));

    setCameras(prev => prev.map(c => {
      const dist = Math.hypot(c.x - playerPos.x, c.y - playerPos.y);
      if (dist < 420) {
        return { ...c, isPowerOff: true, disabledTimer: 10.0 };
      }
      return c;
    }));

    // Spawn massive noise wave
    noiseWavesRef.current.push({
      x: playerPos.x,
      y: playerPos.y,
      r: 10,
      maxR: 350,
      opacity: 0.8
    });
  };

  // Perform stealth takedown
  const performTakedown = (guardId: string) => {
    sound.playConfirm();
    setGuards(prev => prev.map(g => g.id === guardId ? { ...g, state: 'STUNNED', stunTimer: 999 } : g));
    setGuardsNeutralized(prev => prev + 1);
    setTakedownGuard(null);
  };

  // Interact trigger
  const handleInteract = () => {
    // 1. Terminal
    const term = terminals.find(t => !t.isHacked && Math.hypot(t.x - playerPos.x, t.y - playerPos.y) < 55);
    if (term) {
      sound.playUiClick();
      setActiveTerminal(term);
      return;
    }

    // 2. Vault
    const v = mission.vault;
    if (!targetAcquired && Math.hypot((v.x + v.width / 2) - playerPos.x, (v.y + v.height / 2) - playerPos.y) < 90) {
      sound.playUiClick();
      setShowVaultCrack(true);
      return;
    }

    // 3. Extraction
    const ext = mission.extraction;
    if (targetAcquired && Math.hypot(ext.x - playerPos.x, ext.y - playerPos.y) < ext.radius) {
      completeExtraction();
      return;
    }
  };

  // Successful terminal hack
  const handleTerminalSuccess = () => {
    if (!activeTerminal) return;
    setSystemsHacked(prev => prev + 1);
    setTerminals(prev => prev.map(t => t.id === activeTerminal.id ? { ...t, isHacked: true } : t));

    // Handle unlocks
    if (activeTerminal.unlocksDoorId) {
      const doorId = activeTerminal.unlocksDoorId;
      setWalls(prev => prev.map(w => w.doorId === doorId ? { ...w, isOpen: true } : w));
    }
    if (activeTerminal.disablesCameraId) {
      const camId = activeTerminal.disablesCameraId;
      setCameras(prev => prev.map(c => c.id === camId ? { ...c, isPowerOff: true } : c));
    }
    if (activeTerminal.disablesLaserId) {
      const laserId = activeTerminal.disablesLaserId;
      setLasers(prev => prev.map(l => l.id === laserId ? { ...l, isActive: false, isHacked: true } : l));
    }

    setActiveTerminal(null);
    setCurrentDialogue({
      speaker: 'VERA',
      role: 'TACTICAL OPERATOR',
      text: 'Sub-system overridden. Security perimeter updated.'
    });
  };

  // Complete Vault cracking
  const handleVaultComplete = () => {
    setTargetAcquired(true);
    setShowVaultCrack(false);
    setCurrentDialogue({
      speaker: 'VERA',
      role: 'TACTICAL OPERATOR',
      text: `Target secured: ${mission.targetName}. Emergency lockdown initiated. Extract immediately!`
    });

    // Make guards more alert
    setGuards(prev => prev.map(g => ({ ...g, speed: g.speed * 1.2 })));
  };

  // Extraction completion
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

  // Main simulation and render loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // 1. UPDATE TIMERS & COOLDOWNS
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
      if (cloakCooldown > 0) {
        setCloakCooldown(prev => Math.max(0, prev - dt));
      }
      if (empCooldown > 0) {
        setEmpCooldown(prev => Math.max(0, prev - dt));
      }
      // Regenerate energy slowly
      setEnergy(prev => Math.min(100, prev + 4 * dt));

      // 2. PLAYER MOVEMENT
      let moveX = 0;
      let moveY = 0;
      if (keysRef.current['w'] || keysRef.current['arrowup']) moveY -= 1;
      if (keysRef.current['s'] || keysRef.current['arrowdown']) moveY += 1;
      if (keysRef.current['a'] || keysRef.current['arrowleft']) moveX -= 1;
      if (keysRef.current['d'] || keysRef.current['arrowright']) moveX += 1;

      const isMoving = moveX !== 0 || moveY !== 0;
      let baseSpeed = isCrouched ? 2.2 : 3.8;
      if (isCloaked) baseSpeed *= 1.15;

      let newX = playerPos.x;
      let newY = playerPos.y;

      if (isMoving) {
        const len = Math.hypot(moveX, moveY);
        newX += (moveX / len) * baseSpeed * 60 * dt;
        newY += (moveY / len) * baseSpeed * 60 * dt;

        // Footstep sound & noise ripples
        if (Math.random() < 0.08) {
          sound.playFootstep(isCrouched);
          const noiseMaxR = isCrouched ? 30 : 95;
          noiseWavesRef.current.push({
            x: newX,
            y: newY,
            r: 5,
            maxR: noiseMaxR,
            opacity: 0.4
          });
        }
      }

      // Rotate towards mouse
      const aimAngle = Math.atan2(mousePosRef.current.y - playerPos.y, mousePosRef.current.x - playerPos.x);
      setPlayerAngle(aimAngle);

      // Resolve player collisions
      const resolvedPlayer = resolveWallCollisions({ x: newX, y: newY }, 16, walls);
      setPlayerPos(resolvedPlayer);

      // 3. NOISE WAVES EXPANSION & GUARD HEARING
      noiseWavesRef.current = noiseWavesRef.current
        .map(wave => ({
          ...wave,
          r: wave.r + 140 * dt,
          opacity: wave.opacity - 0.7 * dt
        }))
        .filter(w => w.opacity > 0);

      // Check if noise alerts guards
      noiseWavesRef.current.forEach(wave => {
        guards.forEach(g => {
          if (g.state === 'PATROL' || g.state === 'RETURN') {
            const dist = Math.hypot(g.x - wave.x, g.y - wave.y);
            if (dist < wave.r + 20) {
              g.state = 'INVESTIGATE';
              g.investigateTarget = { x: wave.x, y: wave.y };
              sound.playSuspicionAlert();
            }
          }
        });
      });

      // 4. CAMERAS SWEEP & DETECTION
      let cameraDetected = false;
      const updatedCameras = cameras.map(cam => {
        if (cam.isPowerOff || cam.isLooping) {
          if (cam.disabledTimer) {
            cam.disabledTimer -= dt;
            if (cam.disabledTimer <= 0) cam.isPowerOff = false;
          }
          return cam;
        }

        // Sweep angle
        const sweep = Math.sin(currentTime * 0.001 * cam.sweepSpeed) * (cam.sweepAngle / 2);
        const currentAngle = cam.baseAngle + sweep;

        // Check player in camera cone
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

      // 5. LASER GRIDS CYCLING
      const updatedLasers = lasers.map(laser => {
        if (laser.isHacked || !laser.cycleInterval) return laser;
        const totalCycle = laser.cycleInterval;
        const activeDuration = totalCycle * 0.65;
        const phase = (currentTime + (laser.cycleOffset || 0)) % totalCycle;
        const active = phase < activeDuration;

        // Check if player stepped through active laser
        if (active && !laser.isHacked) {
          const l1 = { x: laser.x1, y: laser.y1 };
          const l2 = { x: laser.x2, y: laser.y2 };
          const dist = Math.hypot(playerPos.x - l1.x, playerPos.y - l1.y); // simplified
          // If close to laser segment
          const lineDist = Math.abs((l2.y - l1.y) * playerPos.x - (l2.x - l1.x) * playerPos.y + l2.x * l1.y - l2.y * l1.x) /
            Math.hypot(l2.y - l1.y, l2.x - l1.x);
          if (lineDist < 12 && playerPos.x >= Math.min(l1.x, l2.x) - 10 && playerPos.x <= Math.max(l1.x, l2.x) + 10) {
            cameraDetected = true;
          }
        }
        return { ...laser, isActive: active };
      });
      setLasers(updatedLasers);

      // 6. GUARD AI UPDATE
      let anyGuardDetected = false;
      let maxAlert = 0;
      let nearestTakedownTarget: Guard | null = null;

      const updatedGuards = guards.map(guard => {
        const { guard: updated, detected } = updateGuardAI(
          guard,
          playerPos,
          isCloaked,
          isCrouched,
          walls,
          dt,
          () => sound.playSuspicionAlert(),
          () => {
            sound.startAlarm();
            setAlarmsActive(true);
          }
        );

        if (detected) anyGuardDetected = true;
        maxAlert = Math.max(maxAlert, updated.alertLevel);

        // Check takedown opportunity (behind guard, not alerted)
        const dist = Math.hypot(updated.x - playerPos.x, updated.y - playerPos.y);
        if (dist < 42 && updated.state !== 'ALERT' && updated.state !== 'STUNNED') {
          // Check if behind
          const angleToPlayer = Math.atan2(playerPos.y - updated.y, playerPos.x - updated.x);
          let diff = Math.abs(angleToPlayer - updated.angle);
          while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
          if (diff > Math.PI * 0.5) {
            nearestTakedownTarget = updated;
          }
        }

        return updated;
      });
      setGuards(updatedGuards);
      setTakedownGuard(nearestTakedownTarget);

      // Detection & Tension update
      const overallDetection = Math.max(maxAlert, cameraDetected ? 90 : 0);
      setDetectionPercent(overallDetection);
      setHighestDetection(prev => Math.max(prev, overallDetection));
      sound.setTensionLevel(overallDetection / 100);

      if ((anyGuardDetected || cameraDetected) && !alarmsActive) {
        setAlarmsActive(true);
        sound.startAlarm();
      }

      // Check nearby prompts
      checkNearbyPrompts();

      // 7. RENDER TO CANVAS
      renderCanvas();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      sound.stopAlarm();
      sound.stopTension();
    };
  }, [playerPos, isCrouched, isCloaked, cloakTimer, cloakCooldown, empCooldown, energy, guards, cameras, lasers, terminals, walls, alarmsActive, targetAcquired]);

  // Check nearby interactable prompts
  const checkNearbyPrompts = () => {
    // Terminal
    const term = terminals.find(t => !t.isHacked && Math.hypot(t.x - playerPos.x, t.y - playerPos.y) < 55);
    if (term) {
      setNearbyPrompt(`[E] HACK: ${term.name}`);
      return;
    }

    // Vault
    const v = mission.vault;
    if (!targetAcquired && Math.hypot((v.x + v.width / 2) - playerPos.x, (v.y + v.height / 2) - playerPos.y) < 90) {
      setNearbyPrompt(`[E] ACCESS QUANTUM VAULT`);
      return;
    }

    // Extraction
    const ext = mission.extraction;
    if (targetAcquired && Math.hypot(ext.x - playerPos.x, ext.y - playerPos.y) < ext.radius) {
      setNearbyPrompt(`[E] COMPLETE EXTRACTION`);
      return;
    }

    setNearbyPrompt(null);
  };

  // Render everything onto Canvas
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport follow camera
    const screenW = canvas.width;
    const screenH = canvas.height;
    const camX = Math.max(0, Math.min(mission.mapWidth - screenW, playerPos.x - screenW / 2));
    const camY = Math.max(0, Math.min(mission.mapHeight - screenH, playerPos.y - screenH / 2));
    cameraOffsetRef.current = { x: camX, y: camY };

    ctx.save();
    ctx.clearRect(0, 0, screenW, screenH);
    ctx.translate(-camX, -camY);

    // Floor texture: luxury dark carbon grid
    ctx.fillStyle = '#06080e';
    ctx.fillRect(0, 0, mission.mapWidth, mission.mapHeight);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < mission.mapWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mission.mapHeight);
      ctx.stroke();
    }
    for (let y = 0; y < mission.mapHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mission.mapWidth, y);
      ctx.stroke();
    }

    // Extraction Zone
    const ext = mission.extraction;
    ctx.beginPath();
    ctx.arc(ext.x, ext.y, ext.radius, 0, Math.PI * 2);
    ctx.fillStyle = targetAcquired ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.04)';
    ctx.fill();
    ctx.strokeStyle = targetAcquired ? '#22d3ee' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vault Area
    const v = mission.vault;
    ctx.fillStyle = targetAcquired ? 'rgba(16, 185, 129, 0.08)' : 'rgba(6, 182, 212, 0.08)';
    ctx.fillRect(v.x, v.y, v.width, v.height);
    ctx.strokeStyle = targetAcquired ? '#10b981' : '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(v.x, v.y, v.width, v.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('EXECUTIVE VAULT', v.x + 12, v.y + 24);

    // Render Laser Grids
    lasers.forEach(laser => {
      if (!laser.isActive || laser.isHacked) return;
      ctx.beginPath();
      ctx.moveTo(laser.x1, laser.y1);
      ctx.lineTo(laser.x2, laser.y2);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Emitter dots
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(laser.x1, laser.y1, 4, 0, Math.PI * 2);
      ctx.arc(laser.x2, laser.y2, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render Terminals
    terminals.forEach(term => {
      ctx.fillStyle = term.isHacked ? '#10b981' : '#22d3ee';
      ctx.beginPath();
      ctx.arc(term.x, term.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = term.isHacked ? 'rgba(16, 185, 129, 0.4)' : 'rgba(34, 211, 238, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(term.x, term.y, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(term.isHacked ? 'TERMINAL [BYPASSED]' : 'TERMINAL [ONLINE]', term.x - 45, term.y - 24);
    });

    // Render Guard Vision Cones (clipping against walls)
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

      // Color based on alert state
      let coneFill = 'rgba(6, 182, 212, 0.12)';
      let coneStroke = 'rgba(6, 182, 212, 0.35)';
      if (g.alertLevel > 30) {
        coneFill = 'rgba(245, 158, 11, 0.2)';
        coneStroke = 'rgba(245, 158, 11, 0.6)';
      }
      if (g.state === 'ALERT') {
        coneFill = 'rgba(239, 68, 68, 0.3)';
        coneStroke = 'rgba(239, 68, 68, 0.8)';
      }

      ctx.fillStyle = coneFill;
      ctx.fill();
      ctx.strokeStyle = coneStroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Render Camera Vision Cones
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

      ctx.fillStyle = 'rgba(34, 211, 238, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Camera base fixture
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cam.x, cam.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render Walls & Doors
    walls.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);

      if (w.type === 'DOOR') {
        ctx.strokeStyle = w.isOpen ? 'rgba(34, 211, 238, 0.2)' : '#0ea5e9';
        ctx.lineWidth = w.isOpen ? 2 : 5;
        ctx.setLineDash(w.isOpen ? [4, 4] : []);
      } else {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 8;
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Render Noise Waves
    noiseWavesRef.current.forEach(wave => {
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(34, 211, 238, ${wave.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Render Guards
    guards.forEach(g => {
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.angle);

      // Guard body
      ctx.fillStyle = g.state === 'STUNNED' ? '#475569' : g.state === 'ALERT' ? '#ef4444' : '#334155';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // Armor outline
      ctx.strokeStyle = g.alertLevel > 40 ? '#f59e0b' : '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Direction visor
      ctx.fillStyle = g.state === 'ALERT' ? '#f87171' : '#38bdf8';
      ctx.fillRect(8, -4, 6, 8);

      ctx.restore();

      // Overhead state mark
      if (g.state === 'SUSPICIOUS') {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillText('?', g.x - 4, g.y - 20);
      } else if (g.state === 'INVESTIGATE' || g.state === 'ALERT') {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillText('!', g.x - 4, g.y - 20);
      } else if (g.state === 'STUNNED') {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('ZZZ', g.x - 8, g.y - 20);
      }
    });

    // Render Player (The Ghost)
    ctx.save();
    ctx.translate(playerPos.x, playerPos.y);
    ctx.rotate(playerAngle);

    if (isCloaked) {
      // Cloaked shimmer effect
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Normal Ghost avatar
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();

      // Luxury cyan edge ring
      ctx.strokeStyle = isCrouched ? '#0284c7' : '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Direction indicator
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(8, -3, 6, 6);
    }

    ctx.restore();

    ctx.restore(); // Restore camera translation
  };

  // Detection signature text & color
  const signatureLabel = 
    detectionPercent >= 80 ? 'ALARM ACTIVE' :
    detectionPercent >= 40 ? 'WARNING' :
    detectionPercent >= 15 ? 'UNSTABLE' : 'LOW';

  const signatureColor =
    detectionPercent >= 80 ? 'text-rose-500' :
    detectionPercent >= 40 ? 'text-amber-400' :
    detectionPercent >= 15 ? 'text-yellow-300' : 'text-cyan-400';

  return (
    <div className="relative w-screen h-screen bg-[#05070b] overflow-hidden select-none">
      {/* Fullscreen Canvas */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Cyberpunk Scanlines & Vignette */}
      <div className="absolute inset-0 cyber-scanlines opacity-40 pointer-events-none" />
      <div className="absolute inset-0 cyber-vignette opacity-70 pointer-events-none" />

      {/* TOP LEFT HUD: Ghost Status & Energy */}
      <div className="absolute top-5 left-5 z-30 font-mono-tech flex flex-col gap-2">
        <div className="bg-[#090d18]/85 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3.5 shadow-lg min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-display font-bold text-white tracking-wider">THE GHOST</span>
            <span className="text-[10px] text-cyan-400 uppercase">
              {isCloaked ? 'CLOAKED' : isCrouched ? 'CROUCH' : 'WALK'}
            </span>
          </div>

          {/* Energy Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>ENERGY</span>
              <span className="text-cyan-300 font-bold">{Math.round(energy)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-150 shadow-[0_0_8px_#22d3ee]"
                style={{ width: `${energy}%` }}
              />
            </div>
          </div>

          {/* Signature Detection Bar */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">SIGNATURE</span>
              <span className={`font-bold ${signatureColor}`}>{signatureLabel}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  detectionPercent >= 80 ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' :
                  detectionPercent >= 40 ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
                style={{ width: `${detectionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Abort button */}
        <button
          onClick={onAbort}
          className="self-start px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white text-[11px] font-mono-tech flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> ABORT CONTRACT
        </button>
      </div>

      {/* TOP RIGHT HUD: Objective & Map Tracker */}
      <div className="absolute top-5 right-5 z-30 font-mono-tech">
        <div className="bg-[#090d18]/85 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3.5 shadow-lg min-w-[240px]">
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
            PRIMARY OBJECTIVE
          </span>
          <div className="text-sm font-display font-semibold text-white tracking-wide">
            {targetAcquired ? 'EXTRACTION REQUIRED' : `REACH ${mission.targetName}`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {targetAcquired ? 'EVACUATE TO HELIPAD' : 'BYPASS PERIMETER DEFENSES'}
          </div>
        </div>
      </div>

      {/* BOTTOM RIGHT HUD: Controls & Gadget Triggers */}
      <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2 font-mono-tech">
        {/* Cloak Key */}
        <button
          onClick={activateCloak}
          disabled={cloakCooldown > 0 || energy < 25}
          className={`p-3 rounded-xl border backdrop-blur-md flex flex-col items-center gap-1 transition-all ${
            isCloaked
              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_20px_#22d3ee]'
              : cloakCooldown > 0
              ? 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-60'
              : 'bg-slate-900/80 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span className="text-[10px] font-bold">
            [Q] CLOAK {cloakCooldown > 0 && `(${Math.ceil(cloakCooldown)}s)`}
          </span>
        </button>

        {/* EMP Key */}
        <button
          onClick={activateEmp}
          disabled={empCooldown > 0}
          className={`p-3 rounded-xl border backdrop-blur-md flex flex-col items-center gap-1 transition-all ${
            empCooldown > 0
              ? 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-60'
              : 'bg-slate-900/80 border-purple-500/40 text-purple-300 hover:border-purple-400'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="text-[10px] font-bold">
            [F] EMP {empCooldown > 0 && `(${Math.ceil(empCooldown)}s)`}
          </span>
        </button>

        {/* Crouch Key */}
        <button
          onClick={() => setIsCrouched(prev => !prev)}
          className={`p-3 rounded-xl border backdrop-blur-md flex flex-col items-center gap-1 transition-all ${
            isCrouched
              ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-400'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span className="text-[10px] font-bold">[C] CROUCH</span>
        </button>

        {/* Camera Terminal Key */}
        <button
          onClick={() => setShowCameraTerminal(true)}
          className="p-3 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 backdrop-blur-md flex flex-col items-center gap-1 transition-all"
        >
          <Radio className="w-4 h-4" />
          <span className="text-[10px] font-bold">[CAM] FEEDS</span>
        </button>
      </div>

      {/* CENTER INTERACTION PROMPT */}
      {nearbyPrompt && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-16 z-30 pointer-events-none">
          <div className="px-4 py-2 rounded-lg bg-black/80 border border-cyan-400 text-cyan-300 font-mono-tech text-xs tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse">
            {nearbyPrompt}
          </div>
        </div>
      )}

      {/* TAKEDOWN PROMPT */}
      {takedownGuard && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 z-30 pointer-events-none">
          <div className="px-4 py-2 rounded-lg bg-rose-950/90 border border-rose-500 text-rose-300 font-mono-tech text-xs tracking-wider shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-bounce">
            [SPACE] SILENT TAKEDOWN
          </div>
        </div>
      )}

      {/* ALARM SCREEN DISTORTION */}
      {alarmsActive && (
        <div className="absolute inset-0 border-4 border-rose-500/40 pointer-events-none animate-pulse" />
      )}

      {/* Radio Tactical Dialogue Overlay */}
      <RadioDialogue
        dialogue={currentDialogue}
        onDismiss={() => setCurrentDialogue(null)}
      />

      {/* Hacking Modal */}
      {activeTerminal && (
        <HackModal
          terminal={activeTerminal}
          onSuccess={handleTerminalSuccess}
          onClose={() => setActiveTerminal(null)}
        />
      )}

      {/* Camera Terminal Modal */}
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

      {/* Vault Decryption Modal */}
      {showVaultCrack && (
        <VaultCrackModal
          targetName={mission.targetName}
          securityLayers={mission.vault.securityLayers}
          onComplete={handleVaultComplete}
          onClose={() => setShowVaultCrack(false)}
        />
      )}
    </div>
  );
};
