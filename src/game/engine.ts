import { Point, Wall, Guard, SecurityCamera, Drone, LaserGrid, LightSource } from '../types/game';

// Check if player point is in shadow (not directly illuminated by any active light)
export function isPointInShadow(pos: Point, lights: LightSource[] = [], walls: Wall[] = []): boolean {
  if (!lights || lights.length === 0) return true;
  for (const light of lights) {
    if (!light.isOn) continue;
    const dist = Math.hypot(pos.x - light.x, pos.y - light.y);
    if (dist < light.radius) {
      if (hasLineOfSight({ x: light.x, y: light.y }, pos, walls)) {
        return false; // Point is in light
      }
    }
  }
  return true; // Point is in shadow
}

// Check if segment AB intersects segment CD
export function getLineIntersection(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): Point | null {
  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
  if (Math.abs(d) < 0.0001) return null;

  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / d;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / d;

  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    return {
      x: p1.x + ua * (p2.x - p1.x),
      y: p1.y + ua * (p2.y - p1.y)
    };
  }
  return null;
}

// Distance from point to line segment
export function distToSegment(p: Point, v: Point, w: Point): number {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

// Check line of sight blocking
export function hasLineOfSight(
  from: Point,
  to: Point,
  walls: Wall[]
): boolean {
  for (const wall of walls) {
    if (wall.type === 'DOOR' && wall.isOpen) continue;
    const w1: Point = { x: wall.x1, y: wall.y1 };
    const w2: Point = { x: wall.x2, y: wall.y2 };
    if (getLineIntersection(from, to, w1, w2)) {
      return false;
    }
  }
  return true;
}

// Compute vision cone boundary polygon clipped against walls
export function calculateVisionPolygon(
  origin: Point,
  centerAngle: number,
  fov: number,
  range: number,
  walls: Wall[],
  numRays: number = 32
): Point[] {
  const points: Point[] = [origin];
  const halfFov = fov / 2;
  const startAngle = centerAngle - halfFov;
  const step = fov / numRays;

  for (let i = 0; i <= numRays; i++) {
    const angle = startAngle + i * step;
    const rayEnd: Point = {
      x: origin.x + Math.cos(angle) * range,
      y: origin.y + Math.sin(angle) * range
    };

    let closestHit: Point = rayEnd;
    let closestDistSq = range * range;

    for (const wall of walls) {
      if (wall.type === 'DOOR' && wall.isOpen) continue;
      const w1 = { x: wall.x1, y: wall.y1 };
      const w2 = { x: wall.x2, y: wall.y2 };
      const hit = getLineIntersection(origin, rayEnd, w1, w2);
      if (hit) {
        const distSq = (hit.x - origin.x) ** 2 + (hit.y - origin.y) ** 2;
        if (distSq < closestDistSq) {
          closestDistSq = distSq;
          closestHit = hit;
        }
      }
    }
    points.push(closestHit);
  }

  return points;
}

// Collision resolution for a circular entity against walls
export function resolveWallCollisions(
  pos: Point,
  radius: number,
  walls: Wall[]
): Point {
  let { x, y } = pos;

  for (const wall of walls) {
    if (wall.type === 'DOOR' && wall.isOpen) continue;

    const w1 = { x: wall.x1, y: wall.y1 };
    const w2 = { x: wall.x2, y: wall.y2 };

    const dist = distToSegment({ x, y }, w1, w2);
    if (dist < radius) {
      // Find normal vector
      const dx = w2.x - w1.x;
      const dy = w2.y - w1.y;
      const len = Math.hypot(dx, dy);
      if (len === 0) continue;

      let nx = -dy / len;
      let ny = dx / len;

      // Project point onto line
      let t = ((x - w1.x) * dx + (y - w1.y) * dy) / (len * len);
      t = Math.max(0, Math.min(1, t));
      const projX = w1.x + t * dx;
      const projY = w1.y + t * dy;

      const pushX = x - projX;
      const pushY = y - projY;
      const pushDist = Math.hypot(pushX, pushY);

      if (pushDist > 0.001) {
        const overlap = radius - pushDist;
        x += (pushX / pushDist) * overlap;
        y += (pushY / pushDist) * overlap;
      } else {
        x += nx * (radius - dist);
        y += ny * (radius - dist);
      }
    }
  }

  return { x, y };
}

// Check if player is inside a vision cone
export function isPointInCone(
  point: Point,
  origin: Point,
  angle: number,
  fov: number,
  range: number
): boolean {
  const dist = Math.hypot(point.x - origin.x, point.y - origin.y);
  if (dist > range) return false;

  const targetAngle = Math.atan2(point.y - origin.y, point.x - origin.x);
  let angleDiff = Math.abs(targetAngle - angle);
  while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

  return angleDiff <= fov / 2;
}

// Update Guard AI state machine
export function updateGuardAI(
  guard: Guard,
  playerPos: Point,
  isCloaked: boolean,
  isCrouched: boolean,
  walls: Wall[],
  dt: number, // in seconds
  inShadow: boolean = false,
  onSuspicion?: () => void,
  onAlert?: () => void
): { guard: Guard; detected: boolean } {
  const g = { ...guard };
  let detected = false;

  // Update voice line timer
  if (g.voiceLine) {
    g.voiceLine = {
      ...g.voiceLine,
      timer: g.voiceLine.timer - dt
    };
    if (g.voiceLine.timer <= 0) {
      delete g.voiceLine;
    }
  }

  if (g.stunTimer && g.stunTimer > 0) {
    g.stunTimer -= dt;
    if (g.stunTimer <= 0) {
      g.state = 'INVESTIGATE';
      g.investigateTarget = { ...playerPos };
      g.voiceLine = { text: "Ugh... head hurts. What happened?", timer: 3.5 };
    }
    return { guard: g, detected: false };
  }

  // Vision detection check
  const inVision = !isCloaked && isPointInCone(playerPos, { x: g.x, y: g.y }, g.angle, g.fov, g.sightRadius);
  const clearSight = inVision && hasLineOfSight({ x: g.x, y: g.y }, playerPos, walls);

  const distToPlayer = Math.hypot(playerPos.x - g.x, playerPos.y - g.y);

  if (clearSight) {
    // Alert builds up rapidly when visible; shadows drastically slow detection!
    let alertRate = isCrouched ? 45 : 75; // points per sec
    if (inShadow) {
      alertRate *= 0.32; // In dark shadow, guard takes 3x longer to recognize silhouette
    }
    const proximityMultiplier = Math.max(1, (g.sightRadius / Math.max(40, distToPlayer)) * 1.5);
    g.alertLevel = Math.min(100, g.alertLevel + alertRate * proximityMultiplier * dt);

    // Guard turns towards player
    const desiredAngle = Math.atan2(playerPos.y - g.y, playerPos.x - g.x);
    g.angle = turnTowards(g.angle, desiredAngle, 4 * dt);

    if (g.alertLevel > 30 && g.state === 'PATROL') {
      g.state = 'SUSPICIOUS';
      g.voiceLine = { text: "Who's over there?", timer: 3.0 };
      onSuspicion?.();
    }
    if (g.alertLevel > 60 && g.state !== 'ALERT') {
      g.state = 'INVESTIGATE';
      g.investigateTarget = { ...playerPos };
      g.voiceLine = { text: "Hold up, saw movement.", timer: 3.0 };
    }
    if (g.alertLevel >= 95) {
      g.state = 'ALERT';
      g.voiceLine = { text: "INTRUDER! SOUND THE ALARM!", timer: 4.0 };
      detected = true;
      onAlert?.();
    }
  } else {
    // Decay alert level slowly
    if (g.state !== 'ALERT') {
      g.alertLevel = Math.max(0, g.alertLevel - 15 * dt);
    }
  }

  // State actions
  if (g.state === 'PATROL') {
    if (g.patrolPath.length > 0) {
      const target = g.patrolPath[g.currentPathIndex];
      const dist = Math.hypot(target.x - g.x, target.y - g.y);

      if (dist < 15) {
        g.currentPathIndex = (g.currentPathIndex + 1) % g.patrolPath.length;
      } else {
        const moveAngle = Math.atan2(target.y - g.y, target.x - g.x);
        g.angle = turnTowards(g.angle, moveAngle, 3 * dt);
        g.x += Math.cos(g.angle) * g.speed * 60 * dt;
        g.y += Math.sin(g.angle) * g.speed * 60 * dt;
      }
    }
  } else if (g.state === 'SUSPICIOUS') {
    // Pauses and scans area
    if (g.alertLevel <= 10) {
      g.state = 'PATROL';
    }
  } else if (g.state === 'INVESTIGATE') {
    if (g.investigateTarget) {
      const dist = Math.hypot(g.investigateTarget.x - g.x, g.investigateTarget.y - g.y);
      if (dist < 25) {
        // Arrived at investigation spot
        g.state = 'SEARCH';
        g.searchTimer = 4.0; // search for 4 seconds
      } else {
        const moveAngle = Math.atan2(g.investigateTarget.y - g.y, g.investigateTarget.x - g.x);
        g.angle = turnTowards(g.angle, moveAngle, 3.5 * dt);
        g.x += Math.cos(g.angle) * (g.speed * 1.3) * 60 * dt;
        g.y += Math.sin(g.angle) * (g.speed * 1.3) * 60 * dt;
      }
    } else {
      g.state = 'PATROL';
    }
  } else if (g.state === 'SEARCH') {
    if (g.searchTimer && g.searchTimer > 0) {
      g.searchTimer -= dt;
      g.angle += Math.sin(Date.now() * 0.003) * 0.03;
    } else {
      g.state = 'RETURN';
    }
  } else if (g.state === 'RETURN') {
    // Walk back to closest patrol node
    if (g.patrolPath.length > 0) {
      const target = g.patrolPath[g.currentPathIndex];
      const dist = Math.hypot(target.x - g.x, target.y - g.y);
      if (dist < 20) {
        g.state = 'PATROL';
      } else {
        const moveAngle = Math.atan2(target.y - g.y, target.x - g.x);
        g.angle = turnTowards(g.angle, moveAngle, 3 * dt);
        g.x += Math.cos(g.angle) * g.speed * 60 * dt;
        g.y += Math.sin(g.angle) * g.speed * 60 * dt;
      }
    } else {
      g.state = 'PATROL';
    }
  } else if (g.state === 'ALERT') {
    // Rush towards player
    const moveAngle = Math.atan2(playerPos.y - g.y, playerPos.x - g.x);
    g.angle = turnTowards(g.angle, moveAngle, 5 * dt);
    g.x += Math.cos(g.angle) * (g.speed * 1.8) * 60 * dt;
    g.y += Math.sin(g.angle) * (g.speed * 1.8) * 60 * dt;
    detected = true;
  }

  // Prevent walking through walls
  const resolved = resolveWallCollisions({ x: g.x, y: g.y }, 18, walls);
  g.x = resolved.x;
  g.y = resolved.y;

  return { guard: g, detected };
}

// Helper to smoothly interpolate angles
function turnTowards(current: number, target: number, maxStep: number): number {
  let diff = target - current;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  if (Math.abs(diff) <= maxStep) return target;
  return current + Math.sign(diff) * maxStep;
}
