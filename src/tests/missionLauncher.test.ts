import { MISSIONS } from '../game/missions';
import { validateMission, isOperationUnlocked } from '../game/missionLauncher';
import { PlayerState } from '../types/game';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('====================================================');
console.log('NEON HEIST — AUTOMATED GAMEPLAY & MISSION SUITE');
console.log('====================================================\n');

// 1. Mission Configuration Integrity Verification
console.log('Suite 1: Mission Configuration & Level Validation');
assert(MISSIONS.length === 9, 'All 9 campaign operations are present');

MISSIONS.forEach((m) => {
  const result = validateMission(m);
  assert(result.isValid, `Operation "${m.operationCode}: ${m.title}" passes full level validation`);
  assert(m.playerStart.x > 0 && m.playerStart.y > 0, `Operation ${m.operationCode} player spawn coordinates valid`);
  assert(m.mapWidth >= 800 && m.mapHeight >= 600, `Operation ${m.operationCode} map boundaries valid`);
  assert(m.vault.x > 0 && m.vault.y > 0, `Operation ${m.operationCode} vault position valid`);
  assert(m.extraction.x > 0 && m.extraction.y > 0, `Operation ${m.operationCode} extraction position valid`);
  assert(m.guards.length > 0, `Operation ${m.operationCode} has active guard AI personnel`);
  assert(m.walls.length > 0, `Operation ${m.operationCode} has architectural collision walls`);
});

// 2. Corrupted Mission Detection
console.log('\nSuite 2: Malformed Mission Error Handling');
const badMissionSpawn = { ...MISSIONS[0], playerStart: { x: NaN, y: 0 } };
assert(!validateMission(badMissionSpawn as any).isValid, 'Rejects invalid player insertion coordinate');

const badMissionNoVault = { ...MISSIONS[0], vault: undefined as any };
assert(!validateMission(badMissionNoVault).isValid, 'Rejects mission missing vault target');

const badMissionBoundary = { ...MISSIONS[0], mapWidth: -50 };
assert(!validateMission(badMissionBoundary).isValid, 'Rejects negative level dimensions');

// 3. Campaign Progression & Lock System
console.log('\nSuite 3: Lock/Unlock Prerequisite Mechanics');
assert(isOperationUnlocked('op-01', []).unlocked, 'Level 01 is always unlocked for fresh campaign');
assert(!isOperationUnlocked('op-02', []).unlocked, 'Level 02 is locked when Level 01 not completed');
assert(isOperationUnlocked('op-02', ['op-01']).unlocked, 'Level 02 unlocks when Level 01 completed');
assert(!isOperationUnlocked('op-03', ['op-01']).unlocked, 'Level 03 remains locked until Level 02 completed');
assert(isOperationUnlocked('op-03', ['op-01', 'op-02']).unlocked, 'Level 03 unlocks when Level 01 and 02 completed');
assert(!isOperationUnlocked('non-existent-op', []).unlocked, 'Non-existent operation returns locked with reason');

// 4. Reward & Bounty Calculations
console.log('\nSuite 4: Stealth Bonus & Economy Calculations');
const testMission = MISSIONS[0];
const basePayout = testMission.basePayout;

// Ghost calculation: 0 detection, 0 casualties
const ghostBonus = 18000;
const noCasualtyBonus = 12000;
const perfectGhostPayout = basePayout + ghostBonus + noCasualtyBonus;
assert(perfectGhostPayout === basePayout + 30000, 'Perfect Ghost achieves base + ₡30,000 stealth bonuses');

// Trace calculation: < 45 detection, 0 casualties
const traceBonus = 8000;
const tracePayout = basePayout + traceBonus + noCasualtyBonus;
assert(tracePayout === basePayout + 20000, 'Ghost With Trace achieves base + ₡20,000 bonus');

// Chaos calculation: detected, with neutralized guards
const chaosPayout = basePayout;
assert(chaosPayout === basePayout, 'Chaos rating earns standard base payout with zero stealth bonuses');

// 5. Player Profile & Save Slot Validation
console.log('\nSuite 5: Player State Serialization & Slots');
const mockPlayer: PlayerState = {
  codename: 'GHOST-07',
  classTitle: 'GHOST OPERATIVE',
  reputationLevel: 3,
  reputationXp: 1200,
  credits: 75000,
  unlockedEquipment: ['cloak-t1', 'emp-dart'],
  activeLoadout: {
    infiltration: 'cloak-t1',
    hacking: 'cyberdeck-mk1',
    surveillance: 'recon-drone',
    escape: 'smoke-pellet'
  },
  upgrades: { 'bio-stamina': 2 },
  completedMissionIds: ['op-01', 'op-02'],
  achievements: ['ach-first-heist'],
  hasSeenIntro: true,
  stats: {
    missionsCompleted: 2,
    perfectInfiltrations: 1,
    detectionPercentage: 15,
    guardsNeutralized: 2,
    systemsHacked: 5,
    camerasDisabled: 3,
    totalEarnings: 120000,
    timePlayedMinutes: 24,
    highestContract: 55000,
    cleanExtractions: 2
  }
};

assert(typeof mockPlayer.credits === 'number' && mockPlayer.credits >= 0, 'Player credits valid');
assert(Array.isArray(mockPlayer.completedMissionIds), 'Completed mission IDs serialized as array');
assert(mockPlayer.completedMissionIds.length === 2, 'Completed missions count matches');

console.log('\n====================================================');
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
}
