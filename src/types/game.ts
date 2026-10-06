export type PlayStyle = 'GHOST' | 'GHOST_WITH_TRACE' | 'CHAOS';

export type GuardState = 
  | 'PATROL' 
  | 'INVESTIGATE' 
  | 'SUSPICIOUS' 
  | 'SEARCH' 
  | 'ALERT' 
  | 'COMBAT' 
  | 'RETURN'
  | 'STUNNED';

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type?: 'SOLID' | 'GLASS' | 'DOOR';
  doorId?: string;
  isOpen?: boolean;
}

export interface Guard {
  id: string;
  x: number;
  y: number;
  angle: number; // in radians
  speed: number;
  state: GuardState;
  patrolPath: Point[];
  currentPathIndex: number;
  alertLevel: number; // 0 to 100
  sightRadius: number;
  fov: number; // field of view in radians (e.g. Math.PI * 0.4)
  investigateTarget?: Point;
  investigateTimer?: number;
  searchTimer?: number;
  stunTimer?: number;
  radioTimer?: number;
}

export interface SecurityCamera {
  id: string;
  x: number;
  y: number;
  angle: number;
  baseAngle: number;
  sweepAngle: number;
  sweepSpeed: number;
  range: number;
  fov: number;
  isHacked: boolean;
  isLooping: boolean;
  isPowerOff: boolean;
  disabledTimer?: number;
}

export interface Drone {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  patrolPath: Point[];
  currentPathIndex: number;
  range: number;
  isHacked: boolean;
  disabledTimer?: number;
}

export interface LaserGrid {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive: boolean;
  cycleInterval?: number; // e.g. 3000ms on, 2000ms off
  cycleOffset?: number;
  isHacked?: boolean;
}

export type HackType = 'SIGNAL' | 'CODE' | 'NETWORK' | 'OVERRIDE';

export interface Terminal {
  id: string;
  x: number;
  y: number;
  type: HackType;
  name: string;
  isHacked: boolean;
  unlocksDoorId?: string;
  disablesCameraId?: string;
  disablesLaserId?: string;
  grantsIntelligence?: string;
  description: string;
}

export interface Vault {
  x: number;
  y: number;
  width: number;
  height: number;
  targetName: string;
  isCracked: boolean;
  securityLayers: number;
}

export interface ExtractionPoint {
  x: number;
  y: number;
  radius: number;
  name: string;
}

export interface NoiseWave {
  id: string;
  x: number;
  y: number;
  maxRadius: number;
  currentRadius: number;
  opacity: number;
}

export interface DistractionDevice {
  x: number;
  y: number;
  activeTimer: number;
  duration: number;
}

export interface Mission {
  id: string;
  sectorId: string;
  sectorName: string;
  operationCode: string;
  title: string;
  facilityName: string;
  targetName: string;
  difficulty: 'RECRUIT' | 'OPERATIVE' | 'GHOST' | 'NIGHTMARE';
  basePayout: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  securityRating: number; // e.g. 8.4
  briefing: string;
  secondaryObjectives: string[];
  recommendedEquipment: string[];
  intel: {
    guards: number;
    cameras: number;
    drones: number;
    securityTier: string;
  };
  mapWidth: number;
  mapHeight: number;
  playerStart: Point;
  vault: Vault;
  extraction: ExtractionPoint;
  walls: Wall[];
  guards: Guard[];
  cameras: SecurityCamera[];
  drones: Drone[];
  lasers: LaserGrid[];
  terminals: Terminal[];
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'INFILTRATION' | 'HACKING' | 'SURVEILLANCE' | 'ESCAPE';
  rarity: 'STANDARD' | 'TACTICAL' | 'MIL-SPEC' | 'LEGENDARY';
  cost: number;
  reputationReq: number;
  energyCost: number;
  cooldown: number; // seconds
  duration?: number;
  description: string;
  details: string;
  isUnlocked: boolean;
}

export interface UpgradeNode {
  id: string;
  category: 'BODY' | 'TECH' | 'EQUIPMENT' | 'INTELLIGENCE';
  title: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  statBonus: string;
}

export interface PlayerStats {
  missionsCompleted: number;
  perfectInfiltrations: number;
  detectionPercentage: number;
  guardsNeutralized: number;
  systemsHacked: number;
  camerasDisabled: number;
  totalEarnings: number;
  timePlayedMinutes: number;
  highestContract: number;
  cleanExtractions: number;
}

export interface PlayerState {
  codename: string;
  classTitle: string;
  reputationLevel: number;
  reputationXp: number;
  credits: number;
  stats: PlayerStats;
  activeLoadout: {
    infiltration: string;
    hacking: string;
    surveillance: string;
    escape: string;
  };
  unlockedEquipment: string[];
  upgrades: Record<string, number>;
  completedMissionIds: string[];
  achievements: string[];
  hasSeenIntro: boolean;
}

export interface MissionResult {
  missionId: string;
  missionTitle: string;
  facilityName: string;
  playStyle: PlayStyle;
  ratingStars: number;
  detectionPercent: number;
  timeSeconds: number;
  guardsNeutralized: number;
  systemsHacked: number;
  alarmsTriggered: number;
  basePayout: number;
  stealthBonus: number;
  noCasualtyBonus: number;
  totalPayout: number;
  unlockedStoryLog?: string;
}
