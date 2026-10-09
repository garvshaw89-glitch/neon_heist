import { useState, useEffect } from 'react';
import { PlayerState, MissionResult, EquipmentItem, UpgradeNode } from '../types/game';
import { MISSIONS } from '../game/missions';

const STORAGE_KEY = 'neon_heist_save_v1';

export const INITIAL_PLAYER_STATE: PlayerState = {
  codename: 'THE GHOST',
  classTitle: 'INFILTRATOR',
  reputationLevel: 27,
  reputationXp: 18400,
  credits: 128450,
  stats: {
    missionsCompleted: 27,
    perfectInfiltrations: 19,
    detectionPercentage: 3.8,
    guardsNeutralized: 8,
    systemsHacked: 142,
    camerasDisabled: 68,
    totalEarnings: 684200,
    timePlayedMinutes: 284,
    highestContract: 68000,
    cleanExtractions: 25
  },
  activeLoadout: {
    infiltration: 'opt-cloak',
    hacking: 'neural-dec',
    surveillance: 'cam-analyzer',
    escape: 'emp-disruptor'
  },
  unlockedEquipment: ['opt-cloak', 'silent-boots', 'neural-dec', 'emp-disruptor', 'cam-analyzer'],
  upgrades: {
    'body-speed': 2,
    'body-stealth': 3,
    'tech-hack': 2,
    'tech-energy': 2,
    'equip-cloak': 2,
    'intel-radar': 1
  },
  completedMissionIds: ['op-01-silent-entry'],
  achievements: ['ach-first-heist', 'ach-perfect-ghost', 'ach-master-hacker'],
  hasSeenIntro: true
};

export const ALL_EQUIPMENT: EquipmentItem[] = [
  // INFILTRATION
  {
    id: 'opt-cloak',
    name: 'OPTICAL CLOAK',
    category: 'INFILTRATION',
    rarity: 'LEGENDARY',
    cost: 45000,
    reputationReq: 15,
    energyCost: 25,
    cooldown: 24,
    duration: 8.0,
    description: 'Bends visible and infrared light waves around the operative.',
    details: 'Temporarily renders the Ghost invisible to guards, drones, and cameras.',
    isUnlocked: true
  },
  {
    id: 'silent-boots',
    name: 'SILENT BOOTS',
    category: 'INFILTRATION',
    rarity: 'MIL-SPEC',
    cost: 18000,
    reputationReq: 8,
    energyCost: 0,
    cooldown: 0,
    description: 'Acoustic cancellation soles that absorb vibrations.',
    details: 'Reduces running noise signature by 65% and crouching noise to 0.',
    isUnlocked: true
  },
  {
    id: 'grapple-line',
    name: 'GRAPPLE LINE',
    category: 'INFILTRATION',
    rarity: 'TACTICAL',
    cost: 22000,
    reputationReq: 12,
    energyCost: 15,
    cooldown: 14,
    description: 'High-tensile carbon cable for rapid vertical scaling.',
    details: 'Instantly reposition across rooms and bypass ground-level laser trips.',
    isUnlocked: false
  },
  {
    id: 'mag-gloves',
    name: 'MAGNETIC GLOVES',
    category: 'INFILTRATION',
    rarity: 'MIL-SPEC',
    cost: 32000,
    reputationReq: 18,
    energyCost: 10,
    cooldown: 18,
    description: 'Micro-suction electromagnets for ceiling traverse.',
    details: 'Allows clinging to ventilation shafts and overhead conduits.',
    isUnlocked: false
  },

  // HACKING
  {
    id: 'neural-dec',
    name: 'NEURAL DECODER',
    category: 'HACKING',
    rarity: 'LEGENDARY',
    cost: 38000,
    reputationReq: 14,
    energyCost: 20,
    cooldown: 20,
    description: 'Cranial cipher coprocessor for quantum-grade encryption.',
    details: 'Reduces time required to solve code sequences and security grids by 40%.',
    isUnlocked: true
  },
  {
    id: 'signal-jam',
    name: 'SIGNAL JAMMER',
    category: 'HACKING',
    rarity: 'TACTICAL',
    cost: 26000,
    reputationReq: 16,
    energyCost: 30,
    cooldown: 35,
    description: 'Broadband frequency suppressor for local area sensors.',
    details: 'Prevents security guards from calling radio reinforcements.',
    isUnlocked: false
  },
  {
    id: 'remote-access',
    name: 'REMOTE ACCESS DEVICE',
    category: 'HACKING',
    rarity: 'MIL-SPEC',
    cost: 48000,
    reputationReq: 22,
    energyCost: 35,
    cooldown: 40,
    description: 'Directional microwave injector for remote hacking.',
    details: 'Interface with terminals from up to 8 meters away without direct contact.',
    isUnlocked: false
  },

  // SURVEILLANCE
  {
    id: 'cam-analyzer',
    name: 'CAMERA ANALYZER',
    category: 'SURVEILLANCE',
    rarity: 'TACTICAL',
    cost: 16000,
    reputationReq: 5,
    energyCost: 10,
    cooldown: 15,
    description: 'Optical telemetry scanner detailing vision sweeps.',
    details: 'Highlights camera blind spots and rotation paths in high-contrast cyan.',
    isUnlocked: true
  },
  {
    id: 'thermal-scan',
    name: 'THERMAL SCANNER',
    category: 'SURVEILLANCE',
    rarity: 'MIL-SPEC',
    cost: 34000,
    reputationReq: 18,
    energyCost: 25,
    cooldown: 30,
    description: 'Infrared wall-penetrating imaging array.',
    details: 'Detects guard heartbeats and patrol routes through solid walls.',
    isUnlocked: false
  },

  // ESCAPE
  {
    id: 'emp-disruptor',
    name: 'EMP PULSE DISRUPTOR',
    category: 'ESCAPE',
    rarity: 'LEGENDARY',
    cost: 42000,
    reputationReq: 20,
    energyCost: 30,
    cooldown: 18,
    duration: 10,
    description: 'Miniaturized electromagnetic pulse emitter.',
    details: 'Instantly stuns nearby guards, disables cameras, and shuts down laser grids.',
    isUnlocked: true
  },
  {
    id: 'smoke-device',
    name: 'AEROSOL SMOKE DEVICE',
    category: 'ESCAPE',
    rarity: 'STANDARD',
    cost: 12000,
    reputationReq: 6,
    energyCost: 15,
    cooldown: 25,
    description: 'Particulate dispersal canister obscuring line of sight.',
    details: 'Creates an opaque cloud blocking camera tracking and guard vision.',
    isUnlocked: false
  }
];

export const UPGRADE_NODES: UpgradeNode[] = [
  {
    id: 'body-speed',
    category: 'BODY',
    title: 'Kinetic Leg Servos',
    description: 'Enhances movement velocity while crouching and walking.',
    cost: 15000,
    level: 2,
    maxLevel: 4,
    statBonus: '+15% Sprint & Crouch Velocity'
  },
  {
    id: 'body-stealth',
    category: 'BODY',
    title: 'Acoustic Dampening Skin',
    description: 'Absorbs floor friction and movement vibrations.',
    cost: 20000,
    level: 3,
    maxLevel: 5,
    statBonus: '-35% Noise Radius'
  },
  {
    id: 'tech-hack',
    category: 'TECH',
    title: 'Quantum Buffer Overdrive',
    description: 'Accelerates mini-game decryption and circuit align times.',
    cost: 24000,
    level: 2,
    maxLevel: 4,
    statBonus: '+6s Decryption Window'
  },
  {
    id: 'tech-energy',
    category: 'TECH',
    title: 'Capacitor Regeneration Cell',
    description: 'Speeds up suit battery and gadget energy recovery.',
    cost: 18000,
    level: 2,
    maxLevel: 4,
    statBonus: '+25% Energy Recovery Rate'
  },
  {
    id: 'equip-cloak',
    category: 'EQUIPMENT',
    title: 'Refractive Prism Array',
    description: 'Extends Optical Cloak operational duration.',
    cost: 30000,
    level: 2,
    maxLevel: 3,
    statBonus: '+2.5s Cloak Duration'
  },
  {
    id: 'intel-radar',
    category: 'INTELLIGENCE',
    title: 'Sub-Grid Radar Synthesis',
    description: 'Broadens tactical vision and predictive guard routes.',
    cost: 22000,
    level: 1,
    maxLevel: 3,
    statBonus: 'Reveals full room layouts'
  }
];

export function useGameState() {
  const [player, setPlayer] = useState<PlayerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load save', e);
    }
    return INITIAL_PLAYER_STATE;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch (e) {
      console.error('Failed to persist save', e);
    }
  }, [player]);

  // Handle mission completion and payouts
  const recordMissionResult = (result: MissionResult) => {
    setPlayer(prev => {
      const isPerfect = result.playStyle === 'GHOST';
      const newStats = {
        ...prev.stats,
        missionsCompleted: prev.stats.missionsCompleted + 1,
        perfectInfiltrations: prev.stats.perfectInfiltrations + (isPerfect ? 1 : 0),
        cleanExtractions: prev.stats.cleanExtractions + 1,
        totalEarnings: prev.stats.totalEarnings + result.totalPayout,
        systemsHacked: prev.stats.systemsHacked + result.systemsHacked,
        guardsNeutralized: prev.stats.guardsNeutralized + result.guardsNeutralized,
        highestContract: Math.max(prev.stats.highestContract, result.totalPayout)
      };

      const newMissions = prev.completedMissionIds.includes(result.missionId)
        ? prev.completedMissionIds
        : [...prev.completedMissionIds, result.missionId];

      const newReputationXp = prev.reputationXp + (isPerfect ? 3500 : 2000);
      const newRepLevel = Math.floor(newReputationXp / 1000);

      // Automatic equipment unlocks upon completing campaign missions
      const newUnlockedEquipment = [...prev.unlockedEquipment];
      if (result.missionId === 'op-01-dead-drop' && !newUnlockedEquipment.includes('cam-analyzer')) {
        newUnlockedEquipment.push('cam-analyzer');
      }
      if (result.missionId === 'op-02-blind-spot' && !newUnlockedEquipment.includes('signal-jam')) {
        newUnlockedEquipment.push('signal-jam');
      }
      if (result.missionId === 'op-04-blackout' && !newUnlockedEquipment.includes('emp-disruptor')) {
        newUnlockedEquipment.push('emp-disruptor');
      }
      if (result.missionId === 'op-05-silent-frequency' && !newUnlockedEquipment.includes('remote-access')) {
        newUnlockedEquipment.push('remote-access');
      }
      if (result.missionId === 'op-07-redline' && !newUnlockedEquipment.includes('grapple-line')) {
        newUnlockedEquipment.push('grapple-line');
      }
      if (result.missionId === 'op-08-no-witnesses' && !newUnlockedEquipment.includes('mag-gloves')) {
        newUnlockedEquipment.push('mag-gloves');
      }

      // Achievement progress
      const newAchievements = [...prev.achievements];
      if (!newAchievements.includes('ach-first-heist')) {
        newAchievements.push('ach-first-heist');
      }
      if (isPerfect && !newAchievements.includes('ach-perfect-ghost')) {
        newAchievements.push('ach-perfect-ghost');
      }
      if (newMissions.length >= 9 && !newAchievements.includes('ach-ghost-protocol')) {
        newAchievements.push('ach-ghost-protocol');
      }

      return {
        ...prev,
        credits: prev.credits + result.totalPayout,
        stats: newStats,
        completedMissionIds: newMissions,
        unlockedEquipment: newUnlockedEquipment,
        achievements: newAchievements,
        reputationXp: newReputationXp,
        reputationLevel: newRepLevel
      };
    });
  };

  // Buy equipment
  const buyEquipment = (item: EquipmentItem) => {
    if (player.credits < item.cost) return false;
    if (player.unlockedEquipment.includes(item.id)) return false;

    setPlayer(prev => ({
      ...prev,
      credits: prev.credits - item.cost,
      unlockedEquipment: [...prev.unlockedEquipment, item.id]
    }));
    return true;
  };

  // Equip item
  const equipItem = (item: EquipmentItem) => {
    setPlayer(prev => {
      const catKey = item.category.toLowerCase() as keyof typeof prev.activeLoadout;
      return {
        ...prev,
        activeLoadout: {
          ...prev.activeLoadout,
          [catKey]: item.id
        }
      };
    });
  };

  // Upgrade node
  const upgradeNode = (nodeId: string, cost: number) => {
    if (player.credits < cost) return false;
    setPlayer(prev => {
      const curLvl = prev.upgrades[nodeId] || 1;
      return {
        ...prev,
        credits: prev.credits - cost,
        upgrades: {
          ...prev.upgrades,
          [nodeId]: curLvl + 1
        }
      };
    });
    return true;
  };

  // Reset progress
  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer(INITIAL_PLAYER_STATE);
  };

  return {
    player,
    setPlayer,
    recordMissionResult,
    buyEquipment,
    equipItem,
    upgradeNode,
    resetProgress
  };
}
