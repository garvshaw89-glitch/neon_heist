import { Mission } from '../types/game';
import { MISSIONS } from './missions';

export interface MissionValidationResult {
  isValid: boolean;
  error?: string;
  mission?: Mission;
}

/**
 * Validates mission integrity and required configuration prerequisites.
 */
export function validateMission(missionIdOrObject: string | Mission): MissionValidationResult {
  let mission: Mission | undefined;

  if (typeof missionIdOrObject === 'string') {
    mission = MISSIONS.find(m => m.id === missionIdOrObject || m.id.startsWith(missionIdOrObject));
  } else {
    mission = missionIdOrObject;
  }

  if (!mission) {
    return {
      isValid: false,
      error: `Operation "${typeof missionIdOrObject === 'string' ? missionIdOrObject : 'unknown'}" does not exist in campaign registry.`
    };
  }

  // Validate player spawn
  if (
    !mission.playerStart ||
    typeof mission.playerStart.x !== 'number' ||
    typeof mission.playerStart.y !== 'number' ||
    isNaN(mission.playerStart.x) ||
    isNaN(mission.playerStart.y)
  ) {
    return {
      isValid: false,
      error: `Operation "${mission.title}" has an invalid player insertion coordinate.`
    };
  }

  // Validate level boundary
  if (!mission.mapWidth || !mission.mapHeight || mission.mapWidth <= 0 || mission.mapHeight <= 0) {
    return {
      isValid: false,
      error: `Operation "${mission.title}" has invalid boundary dimensions (${mission.mapWidth}x${mission.mapHeight}).`
    };
  }

  // Validate vault / target asset
  if (!mission.vault || !mission.targetName) {
    return {
      isValid: false,
      error: `Operation "${mission.title}" is missing target asset or vault credentials.`
    };
  }

  // Validate extraction coordinates
  if (!mission.extraction || typeof mission.extraction.x !== 'number' || typeof mission.extraction.y !== 'number') {
    return {
      isValid: false,
      error: `Operation "${mission.title}" is missing evacuation aerodyne coordinates.`
    };
  }

  // Validate guards and routes
  if (!Array.isArray(mission.guards)) {
    return {
      isValid: false,
      error: `Operation "${mission.title}" security personnel grid is corrupted.`
    };
  }

  // Validate walls & environment
  if (!Array.isArray(mission.walls)) {
    return {
      isValid: false,
      error: `Operation "${mission.title}" architectural collision map is corrupted.`
    };
  }

  return {
    isValid: true,
    mission
  };
}

/**
 * Checks if a mission is unlocked for the player based on completed mission IDs.
 */
export function isOperationUnlocked(missionId: string, completedMissionIds: string[]): { unlocked: boolean; reason?: string } {
  const index = MISSIONS.findIndex(m => m.id === missionId || m.id.startsWith(missionId));
  if (index === -1) {
    return { unlocked: false, reason: 'Operation not found' };
  }

  // Level 1 is always unlocked
  if (index === 0) {
    return { unlocked: true };
  }

  const targetMission = MISSIONS[index];

  // Already completed is unlocked
  if (completedMissionIds.some(id => id === targetMission.id || targetMission.id.startsWith(id))) {
    return { unlocked: true };
  }

  // Previous mission completed
  const prevMission = MISSIONS[index - 1];
  if (completedMissionIds.some(id => id === prevMission.id || prevMission.id.startsWith(id))) {
    return { unlocked: true };
  }

  return {
    unlocked: false,
    reason: `Requires completion of ${prevMission.operationCode}: ${prevMission.title}`
  };
}
