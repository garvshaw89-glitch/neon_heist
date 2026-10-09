import { Mission } from '../types/game';

export const MISSIONS: Mission[] = [
  // =========================================================================
  // ACT I — BECOMING THE GHOST
  // =========================================================================

  // -------------------------------------------------------------------------
  // LEVEL 01 — THE DIAMOND CROWN
  // -------------------------------------------------------------------------
  {
    id: 'op-01-diamond-crown',
    actNumber: 1,
    actTitle: 'BECOMING THE GHOST',
    levelNumber: 1,
    environmentType: 'Rain-soaked futuristic luxury casino & resort',
    sectorId: 'sector-01',
    sectorName: 'SECTOR 01 · DIAMOND CROWN STRIP',
    operationCode: 'OP // 01',
    title: 'THE DIAMOND CROWN',
    facilityName: 'DIAMOND CROWN CASINO & RESORT',
    targetName: 'CLASSIFIED DATA CORE',
    difficulty: 'OPERATIVE',
    basePayout: 32000,
    risk: 'MEDIUM',
    securityRating: 3.5,
    briefing: 'Infiltrate the Diamond Crown Casino & Resort across its 7 interconnected sectors: Main Entrance, Casino Lobby, VIP Lounge, Staff Area, Security Room, Parking Garage, and the subterranean Diamond Vault. Your primary objective: crack the vault and extract with the syndicate\'s classified data core. Optional objective: recover the VIP guest list from the private Velvet Lounge salon. Maintain the Ghost standard: zero alarms.',
    secondaryObjectives: [
      'Recover the VIP guest list from the Velvet Lounge salon',
      'Override surveillance monitoring grid in the Security Room',
      'Complete extraction without triggering casino alarms',
      'Maintain Ghost standard: Zero casualties'
    ],
    recommendedEquipment: [
      'SILENT BOOTS',
      'NEURAL SCANNER',
      'ACOUSTIC DISTRACTOR'
    ],
    entryRoutes: [
      'Vector Alpha: Grand Entrance foyer (High surveillance)',
      'Vector Bravo: Staff Delivery corridor (Restricted credentials)',
      'Vector Gamma: Parking Garage sublevel transit'
    ],
    unlockReward: 'BLACK MARKET ACCESS & SECTOR 02 CLEARANCE',
    estimatedDuration: '06:30',
    intel: {
      guards: 6,
      cameras: 4,
      drones: 0,
      securityTier: 'TIER 2 PRIVATE CASINO SYNDICATE SECURITY'
    },
    isTutorial: true,
    mapWidth: 2600,
    mapHeight: 1800,
    playerStart: { x: 380, y: 1680 },
    vault: {
      x: 2260,
      y: 340,
      width: 140,
      height: 140,
      targetName: 'CLASSIFIED DATA CORE',
      isCracked: false,
      securityLayers: 3
    },
    extraction: {
      x: 1420,
      y: 150,
      radius: 90,
      name: 'SKY-CRANE HELIPAD EXTRACTION'
    },
    lights: [
      // Main Entrance lights
      { id: 'l-ent-foyer', x: 540, y: 1520, radius: 240, isOn: true, color: '#fef08a' },
      { id: 'l-ent-west', x: 260, y: 1460, radius: 200, isOn: true, color: '#94a3b8' },

      // Casino Lobby chandeliers (Warm Gold & Cyan)
      { id: 'l-lobby-center', x: 1200, y: 1040, radius: 320, isOn: true, color: '#fbbf24' },
      { id: 'l-lobby-west', x: 880, y: 980, radius: 260, isOn: true, color: '#fef08a' },
      { id: 'l-lobby-east', x: 1560, y: 1060, radius: 280, isOn: true, color: '#38bdf8' },

      // VIP Lounge (Velvet Magenta & Rose)
      { id: 'l-vip-salon', x: 1100, y: 480, radius: 290, isOn: true, color: '#fb7185' },
      { id: 'l-vip-bar', x: 1480, y: 480, radius: 270, isOn: true, color: '#f43f5e' },

      // Staff Area & Kitchens (Fluorescent Industrial)
      { id: 'l-staff-kitchen', x: 340, y: 520, radius: 240, isOn: true, color: '#cbd5e1' },
      { id: 'l-staff-storage', x: 340, y: 980, radius: 220, isOn: true, color: '#94a3b8' },

      // Security Monitoring Room (Cool High-Tech Cyan)
      { id: 'l-sec-hub', x: 2150, y: 1040, radius: 260, isOn: true, color: '#22d3ee' },

      // Diamond Vault (High-Intensity Blue & White)
      { id: 'l-vault-anteroom', x: 1980, y: 380, radius: 220, isOn: true, color: '#38bdf8' },
      { id: 'l-vault-chamber', x: 2320, y: 340, radius: 250, isOn: true, color: '#e0f2fe' },

      // Parking Garage (Sodium Amber & Shadows)
      { id: 'l-garage-west', x: 1150, y: 1550, radius: 260, isOn: true, color: '#ca8a04' },
      { id: 'l-garage-east', x: 1950, y: 1550, radius: 260, isOn: true, color: '#ca8a04' },

      // Rooftop Helipad
      { id: 'l-helipad', x: 1420, y: 150, radius: 220, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-staff-breaker',
        x: 480,
        y: 420,
        width: 28,
        height: 28,
        type: 'CIRCUIT_BREAKER',
        name: 'STAFF CORRIDOR CIRCUIT BREAKER',
        isInteracted: false,
        targetId: 'l-staff-kitchen'
      },
      {
        id: 'env-staff-vent',
        x: 640,
        y: 740,
        width: 32,
        height: 32,
        type: 'MAINTENANCE_VENT',
        name: 'HVAC CONDUIT TO SECURITY HUB',
        isInteracted: false,
        targetId: 'door-sec-hub'
      }
    ],
    walls: [
      // Outer Map Perimeter
      { x1: 50, y1: 50, x2: 2550, y2: 50, type: 'SOLID' },
      { x1: 2550, y1: 50, x2: 2550, y2: 1750, type: 'SOLID' },
      { x1: 2550, y1: 1750, x2: 50, y2: 1750, type: 'SOLID' },
      { x1: 50, y1: 1750, x2: 50, y2: 50, type: 'SOLID' },

      // 1. MAIN ENTRANCE & EXTERIOR COURTYARD
      { x1: 50, y1: 1300, x2: 180, y2: 1300, type: 'SOLID' },
      { x1: 180, y1: 1300, x2: 260, y2: 1300, type: 'DOOR', doorId: 'door-staff-service', isOpen: false },
      { x1: 260, y1: 1300, x2: 500, y2: 1300, type: 'SOLID' },
      { x1: 500, y1: 1300, x2: 660, y2: 1300, type: 'DOOR', doorId: 'door-main-entrance', isOpen: true },
      { x1: 660, y1: 1300, x2: 800, y2: 1300, type: 'SOLID' },
      { x1: 800, y1: 1300, x2: 800, y2: 1750, type: 'SOLID' },

      // Entrance Decorative Pillars / Cover
      { x1: 300, y1: 1500, x2: 360, y2: 1500, type: 'SOLID' },
      { x1: 360, y1: 1500, x2: 360, y2: 1560, type: 'SOLID' },
      { x1: 360, y1: 1560, x2: 300, y2: 1560, type: 'SOLID' },
      { x1: 300, y1: 1560, x2: 300, y2: 1500, type: 'SOLID' },

      { x1: 580, y1: 1500, x2: 640, y2: 1500, type: 'SOLID' },
      { x1: 640, y1: 1500, x2: 640, y2: 1560, type: 'SOLID' },
      { x1: 640, y1: 1560, x2: 580, y2: 1560, type: 'SOLID' },
      { x1: 580, y1: 1560, x2: 580, y2: 1500, type: 'SOLID' },

      // 2. STAFF AREA & KITCHENS (West Wing)
      { x1: 680, y1: 50, x2: 680, y2: 850, type: 'SOLID' },
      { x1: 680, y1: 850, x2: 680, y2: 950, type: 'DOOR', doorId: 'door-lobby-staff', isOpen: false },
      { x1: 680, y1: 950, x2: 680, y2: 1300, type: 'SOLID' },
      { x1: 50, y1: 720, x2: 380, y2: 720, type: 'SOLID' },
      { x1: 460, y1: 720, x2: 680, y2: 720, type: 'SOLID' },

      // 3. CASINO LOBBY & GAMING FLOOR (Central Core)
      // Dividing wall to VIP Lounge
      { x1: 680, y1: 780, x2: 1120, y2: 780, type: 'SOLID' },
      { x1: 1120, y1: 780, x2: 1240, y2: 780, type: 'DOOR', doorId: 'door-lobby-vip', isOpen: false },
      { x1: 1240, y1: 780, x2: 1750, y2: 780, type: 'SOLID' },

      // Dividing wall to Parking Garage
      { x1: 800, y1: 1300, x2: 1350, y2: 1300, type: 'SOLID' },
      { x1: 1350, y1: 1300, x2: 1450, y2: 1300, type: 'DOOR', doorId: 'door-lobby-garage', isOpen: false },
      { x1: 1450, y1: 1300, x2: 1750, y2: 1300, type: 'SOLID' },

      // Dividing wall to Security Corridor
      { x1: 1750, y1: 780, x2: 1750, y2: 980, type: 'SOLID' },
      { x1: 1750, y1: 980, x2: 1750, y2: 1080, type: 'DOOR', doorId: 'door-lobby-security', isOpen: false },
      { x1: 1750, y1: 1080, x2: 1750, y2: 1300, type: 'SOLID' },

      // Central Reception Desk
      { x1: 1060, y1: 1000, x2: 1260, y2: 1000, type: 'SOLID' },
      { x1: 1260, y1: 1000, x2: 1260, y2: 1080, type: 'SOLID' },
      { x1: 1260, y1: 1080, x2: 1060, y2: 1080, type: 'SOLID' },
      { x1: 1060, y1: 1080, x2: 1060, y2: 1000, type: 'SOLID' },

      // 4. VIP LOUNGE ("VELVET ROOM")
      { x1: 1750, y1: 240, x2: 1750, y2: 780, type: 'SOLID' },
      { x1: 680, y1: 240, x2: 1340, y2: 240, type: 'SOLID' },
      { x1: 1340, y1: 240, x2: 1460, y2: 240, type: 'DOOR', doorId: 'door-vip-rooftop', isOpen: false },
      { x1: 1460, y1: 240, x2: 1750, y2: 240, type: 'SOLID' },
      { x1: 900, y1: 460, x2: 1140, y2: 460, type: 'GLASS' },
      { x1: 1360, y1: 460, x2: 1600, y2: 460, type: 'GLASS' },

      // 5. SECURITY ROOM & SURVEILLANCE HUB
      { x1: 2050, y1: 780, x2: 2050, y2: 950, type: 'SOLID' },
      { x1: 2050, y1: 950, x2: 2050, y2: 1050, type: 'DOOR', doorId: 'door-sec-hub', isOpen: true },
      { x1: 2050, y1: 1050, x2: 2050, y2: 1300, type: 'SOLID' },
      { x1: 1750, y1: 1300, x2: 2550, y2: 1300, type: 'SOLID' },

      // 6. DIAMOND VAULT & DEPOSITORY
      { x1: 1750, y1: 520, x2: 2100, y2: 520, type: 'SOLID' },
      { x1: 2100, y1: 520, x2: 2200, y2: 520, type: 'DOOR', doorId: 'door-vault-outer', isOpen: false },
      { x1: 2200, y1: 520, x2: 2550, y2: 520, type: 'SOLID' },
      { x1: 2150, y1: 240, x2: 2500, y2: 240, type: 'SOLID' },
      { x1: 2150, y1: 240, x2: 2150, y2: 380, type: 'SOLID' },
      { x1: 2150, y1: 380, x2: 2150, y2: 480, type: 'DOOR', doorId: 'door-vault-blast', isOpen: false },
      { x1: 2150, y1: 480, x2: 2500, y2: 480, type: 'SOLID' },

      // 7. PARKING GARAGE
      { x1: 2360, y1: 1750, x2: 2500, y2: 1750, type: 'DOOR', doorId: 'door-garage-exit', isOpen: false },
      // Garage Concrete Pillars
      { x1: 1100, y1: 1480, x2: 1150, y2: 1480, type: 'SOLID' },
      { x1: 1150, y1: 1480, x2: 1150, y2: 1530, type: 'SOLID' },
      { x1: 1150, y1: 1530, x2: 1100, y2: 1530, type: 'SOLID' },
      { x1: 1100, y1: 1530, x2: 1100, y2: 1480, type: 'SOLID' },

      { x1: 1600, y1: 1480, x2: 1650, y2: 1480, type: 'SOLID' },
      { x1: 1650, y1: 1480, x2: 1650, y2: 1530, type: 'SOLID' },
      { x1: 1650, y1: 1530, x2: 1600, y2: 1530, type: 'SOLID' },
      { x1: 1600, y1: 1530, x2: 1600, y2: 1480, type: 'SOLID' },

      { x1: 2000, y1: 1480, x2: 2050, y2: 1480, type: 'SOLID' },
      { x1: 2050, y1: 1480, x2: 2050, y2: 1530, type: 'SOLID' },
      { x1: 2050, y1: 1530, x2: 2000, y2: 1530, type: 'SOLID' },
      { x1: 2000, y1: 1530, x2: 2000, y2: 1480, type: 'SOLID' },

      // ROOFTOP HELIPAD BALCONY BARRIERS
      { x1: 1250, y1: 50, x2: 1250, y2: 240, type: 'SOLID' },
      { x1: 1650, y1: 50, x2: 1650, y2: 240, type: 'SOLID' }
    ],
    guards: [
      {
        id: 'g-entrance-01',
        x: 480,
        y: 1450,
        angle: 0,
        speed: 1.05,
        state: 'PATROL',
        patrolPath: [
          { x: 440, y: 1420 },
          { x: 720, y: 1420 },
          { x: 720, y: 1620 },
          { x: 440, y: 1620 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 280,
        fov: Math.PI * 0.4
      },
      {
        id: 'g-lobby-01',
        x: 880,
        y: 950,
        angle: 0,
        speed: 1.1,
        state: 'PATROL',
        patrolPath: [
          { x: 850, y: 920 },
          { x: 1450, y: 920 },
          { x: 1450, y: 1150 },
          { x: 850, y: 1150 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 290,
        fov: Math.PI * 0.4
      },
      {
        id: 'g-lobby-02',
        x: 1600,
        y: 900,
        angle: Math.PI * 0.5,
        speed: 1.1,
        state: 'PATROL',
        patrolPath: [
          { x: 1550, y: 880 },
          { x: 1720, y: 880 },
          { x: 1720, y: 1220 },
          { x: 1550, y: 1220 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 280,
        fov: Math.PI * 0.42
      },
      {
        id: 'g-vip-01',
        x: 1000,
        y: 380,
        angle: 0,
        speed: 1.05,
        state: 'PATROL',
        patrolPath: [
          { x: 950, y: 350 },
          { x: 1550, y: 350 },
          { x: 1550, y: 650 },
          { x: 950, y: 650 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 300,
        fov: Math.PI * 0.42
      },
      {
        id: 'g-staff-01',
        x: 260,
        y: 450,
        angle: Math.PI * 0.5,
        speed: 1.15,
        state: 'PATROL',
        patrolPath: [
          { x: 220, y: 400 },
          { x: 550, y: 400 },
          { x: 550, y: 1150 },
          { x: 220, y: 1150 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 270,
        fov: Math.PI * 0.38
      },
      {
        id: 'g-sec-01',
        x: 1900,
        y: 1050,
        angle: 0,
        speed: 1.1,
        state: 'PATROL',
        patrolPath: [
          { x: 1850, y: 1020 },
          { x: 2250, y: 1020 },
          { x: 2250, y: 1180 },
          { x: 1850, y: 1180 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 300,
        fov: Math.PI * 0.4
      },
      {
        id: 'g-garage-01',
        x: 1300,
        y: 1450,
        angle: 0,
        speed: 1.1,
        state: 'PATROL',
        patrolPath: [
          { x: 1200, y: 1420 },
          { x: 2200, y: 1420 },
          { x: 2200, y: 1650 },
          { x: 1200, y: 1650 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 280,
        fov: Math.PI * 0.4
      }
    ],
    cameras: [
      {
        id: 'cam-entrance',
        x: 640,
        y: 1320,
        angle: 1.57,
        baseAngle: 1.57,
        sweepAngle: 1.2,
        sweepSpeed: 0.65,
        range: 330,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-lobby-01',
        x: 1680,
        y: 800,
        angle: 2.3,
        baseAngle: 2.3,
        sweepAngle: 1.1,
        sweepSpeed: 0.7,
        range: 340,
        fov: Math.PI * 0.36,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-vault-corridor',
        x: 2180,
        y: 540,
        angle: -1.57,
        baseAngle: -1.57,
        sweepAngle: 0.9,
        sweepSpeed: 0.8,
        range: 340,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-garage-01',
        x: 1800,
        y: 1320,
        angle: 1.57,
        baseAngle: 1.57,
        sweepAngle: 1.3,
        sweepSpeed: 0.6,
        range: 330,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [
      {
        id: 'laser-vault-01',
        x1: 1850,
        y1: 340,
        x2: 1850,
        y2: 480,
        isActive: true,
        cycleInterval: 3500,
        isHacked: false
      },
      {
        id: 'laser-vault-02',
        x1: 2020,
        y1: 340,
        x2: 2020,
        y2: 480,
        isActive: true,
        cycleInterval: 4000,
        isHacked: false
      }
    ],
    terminals: [
      {
        id: 'term-entrance-bypass',
        x: 240,
        y: 1360,
        type: 'SIGNAL',
        name: 'SERVICE ENTRY MAGNETIC BUS',
        isHacked: false,
        unlocksDoorId: 'door-staff-service',
        description: 'Bypass service delivery door to infiltrate the Staff Area.'
      },
      {
        id: 'term-reception',
        x: 1150,
        y: 980,
        type: 'CODE',
        name: 'LOBBY RECEPTION CONSOLE',
        isHacked: false,
        unlocksDoorId: 'door-lobby-vip',
        description: 'Disengage security magnetic seals to access the VIP Velvet Lounge.'
      },
      {
        id: 'term-vip-guestlist',
        x: 1280,
        y: 320,
        type: 'NETWORK',
        name: 'VIP PRIVATE GUEST REGISTER',
        isHacked: false,
        unlocksDoorId: 'door-vip-rooftop',
        grantsIntelligence: 'VIP_GUEST_LIST',
        description: 'OPTIONAL OBJECTIVE: Extract syndicate VIP attendee registry & unlock rooftop access stairs.'
      },
      {
        id: 'term-sec-corridor',
        x: 1710,
        y: 1030,
        type: 'CODE',
        name: 'SECURITY CORRIDOR KEYPAD',
        isHacked: false,
        unlocksDoorId: 'door-lobby-security',
        description: 'Bypass biometric keypad to access Security Sector corridor.'
      },
      {
        id: 'term-sec-master',
        x: 2320,
        y: 920,
        type: 'OVERRIDE',
        name: 'SECURITY HUB',
        isHacked: false,
        unlocksDoorId: 'door-vault-outer',
        disablesCameraId: 'cam-lobby-01',
        disablesLaserId: 'laser-vault-01',
        description: 'Central security terminal controlling casino surveillance, lasers, alarms, and access control.'
      },
      {
        id: 'term-vault-terminal',
        x: 2120,
        y: 440,
        type: 'CODE',
        name: 'DIAMOND VAULT BLAST CIPHER',
        isHacked: false,
        unlocksDoorId: 'door-vault-blast',
        description: 'Crack high-security encryption to unlock Diamond Vault blast doors.'
      },
      {
        id: 'term-garage-gate',
        x: 2280,
        y: 1680,
        type: 'SIGNAL',
        name: 'GARAGE TRANSIT GATE MOTOR',
        isHacked: false,
        unlocksDoorId: 'door-garage-exit',
        description: 'Disengage hydraulic roll-up gate for ground-level vehicular extraction.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // LEVEL 02 — BLIND SPOT
  // -------------------------------------------------------------------------
  {
    id: 'op-02-blind-spot',
    actNumber: 1,
    actTitle: 'BECOMING THE GHOST',
    levelNumber: 2,
    environmentType: 'Corporate parking structure',
    sectorId: 'sector-01',
    sectorName: 'SECTOR 01 · AURELION PARKING COMPLEX',
    operationCode: 'OP // 02',
    title: 'BLIND SPOT',
    facilityName: 'AURELION PARKING COMPLEX - SUB-LEVEL 3',
    targetName: 'FLEET TELEMETRY CORE',
    difficulty: 'RECRUIT',
    basePayout: 28000,
    risk: 'LOW',
    securityRating: 2.0,
    briefing: 'Sub-level 3 is heavily surveilled by overlapping Aurora-7 cameras. Use the blind spots between armored corporate transports, slip through the ventilation ducts, loop camera feeds at the security terminal, and secure the fleet telemetry core.',
    secondaryObjectives: [
      'Remain completely undetected throughout infiltration',
      'Disable or loop all security cameras',
      'Extract in under 3 minutes'
    ],
    recommendedEquipment: [
      'CAMERA LOOP DEVICE',
      'OPTICAL CLOAK',
      'SILENT BOOTS'
    ],
    entryRoutes: [
      'Vector Alpha: South vehicle ramp (Wide sightlines)',
      'Vector Bravo: Air duct intake pipe (Restricted stealth channel)'
    ],
    unlockReward: 'CAMERA LOOP TOOL & EXPANDED SCANNER',
    estimatedDuration: '04:00',
    intel: {
      guards: 2,
      cameras: 2,
      drones: 0,
      securityTier: 'TIER 2 PARKING SECURITY'
    },
    mapWidth: 1800,
    mapHeight: 1100,
    playerStart: { x: 140, y: 920 },
    vault: {
      x: 1480,
      y: 260,
      width: 140,
      height: 140,
      targetName: 'FLEET TELEMETRY CORE',
      isCracked: false,
      securityLayers: 2
    },
    extraction: {
      x: 160,
      y: 180,
      radius: 75,
      name: 'NORTH STAIRWELL EMERGENCY RISER'
    },
    lights: [
      { id: 'l2-bay1', x: 260, y: 880, radius: 210, isOn: true, color: '#cbd5e1' },
      { id: 'l2-aisle', x: 740, y: 750, radius: 240, isOn: true, color: '#f8fafc' },
      { id: 'l2-booth', x: 1200, y: 750, radius: 220, isOn: true, color: '#38bdf8' },
      { id: 'l2-vault', x: 1540, y: 320, radius: 210, isOn: true, color: '#a855f7' },
      { id: 'l2-extract', x: 160, y: 180, radius: 180, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-l2-vent',
        x: 480,
        y: 600,
        width: 32,
        height: 32,
        type: 'MAINTENANCE_VENT',
        name: 'VENTILATION BYPASS CONDUIT',
        isInteracted: false,
        targetId: 'door-l2-vent'
      },
      {
        id: 'env-l2-switch',
        x: 1050,
        y: 680,
        width: 24,
        height: 24,
        type: 'LIGHT_SWITCH',
        name: 'PARKING BAY STROBE SWITCH',
        isInteracted: false,
        targetId: 'l2-booth'
      }
    ],
    walls: [
      // Outer
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 1050, type: 'SOLID' },
      { x1: 1750, y1: 1050, x2: 50, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 1050, x2: 50, y2: 50, type: 'SOLID' },

      // West loading lane
      { x1: 320, y1: 700, x2: 320, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 700, x2: 240, y2: 700, type: 'SOLID' },

      // Transport pillar blockers (creating blind spots)
      { x1: 500, y1: 780, x2: 600, y2: 780, type: 'SOLID' },
      { x1: 600, y1: 780, x2: 600, y2: 950, type: 'SOLID' },
      { x1: 600, y1: 950, x2: 500, y2: 950, type: 'SOLID' },
      { x1: 500, y1: 950, x2: 500, y2: 780, type: 'SOLID' },

      { x1: 850, y1: 780, x2: 950, y2: 780, type: 'SOLID' },
      { x1: 950, y1: 780, x2: 950, y2: 950, type: 'SOLID' },
      { x1: 950, y1: 950, x2: 850, y2: 950, type: 'SOLID' },
      { x1: 850, y1: 950, x2: 850, y2: 780, type: 'SOLID' },

      // Central divider wall with doorway
      { x1: 320, y1: 600, x2: 700, y2: 600, type: 'SOLID' },
      { x1: 800, y1: 600, x2: 1400, y2: 600, type: 'SOLID' },

      // Security Booth
      { x1: 1100, y1: 600, x2: 1100, y2: 850, type: 'SOLID' },
      { x1: 1100, y1: 850, x2: 1400, y2: 850, type: 'SOLID' },
      { x1: 1400, y1: 600, x2: 1400, y2: 720, type: 'SOLID' },
      { x1: 1400, y1: 720, x2: 1400, y2: 800, type: 'DOOR', doorId: 'door-l2-booth', isOpen: false },
      { x1: 1400, y1: 800, x2: 1400, y2: 850, type: 'SOLID' },

      // North Vault chamber
      { x1: 1350, y1: 150, x2: 1750, y2: 150, type: 'SOLID' },
      { x1: 1350, y1: 150, x2: 1350, y2: 480, type: 'SOLID' },
      { x1: 1350, y1: 480, x2: 1500, y2: 480, type: 'SOLID' },
      { x1: 1500, y1: 480, x2: 1580, y2: 480, type: 'DOOR', doorId: 'door-l2-vault', isOpen: false },
      { x1: 1580, y1: 480, x2: 1750, y2: 480, type: 'SOLID' },

      // North escape wing
      { x1: 50, y1: 480, x2: 1350, y2: 480, type: 'SOLID' },
      { x1: 320, y1: 50, x2: 320, y2: 480, type: 'SOLID' },
      { x1: 220, y1: 480, x2: 320, y2: 480, type: 'DOOR', doorId: 'door-l2-vent', isOpen: false }
    ],
    guards: [
      {
        id: 'g2-01',
        x: 720,
        y: 860,
        angle: 0,
        speed: 1.15,
        state: 'PATROL',
        patrolPath: [
          { x: 420, y: 860 },
          { x: 780, y: 860 },
          { x: 780, y: 980 },
          { x: 420, y: 980 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 280,
        fov: Math.PI * 0.42
      },
      {
        id: 'g2-02',
        x: 1250,
        y: 720,
        angle: Math.PI,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 1250, y: 720 },
          { x: 1020, y: 720 },
          { x: 1020, y: 950 },
          { x: 1250, y: 950 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 280,
        fov: Math.PI * 0.42
      }
    ],
    cameras: [
      {
        id: 'cam-l2-01',
        x: 760,
        y: 620,
        angle: 1.2,
        baseAngle: 1.2,
        sweepAngle: 1.3,
        sweepSpeed: 0.8,
        range: 320,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l2-02',
        x: 1420,
        y: 500,
        angle: 2.1,
        baseAngle: 2.1,
        sweepAngle: 1.2,
        sweepSpeed: 0.75,
        range: 310,
        fov: Math.PI * 0.36,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [],
    terminals: [
      {
        id: 'term-l2-loop',
        x: 1250,
        y: 640,
        type: 'CODE',
        name: 'SURVEILLANCE LOOP TERMINAL',
        isHacked: false,
        disablesCameraId: 'cam-l2-01',
        description: 'Inject continuous loop sequence into sub-level camera matrix.'
      },
      {
        id: 'term-l2-vault',
        x: 1280,
        y: 800,
        type: 'NETWORK',
        name: 'PARKING SECURITY GATE BUS',
        isHacked: false,
        unlocksDoorId: 'door-l2-vault',
        description: 'Bypass magnetic interlock to courier security cage.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // LEVEL 03 — GLASS HOUSE
  // -------------------------------------------------------------------------
  {
    id: 'op-03-glass-house',
    actNumber: 1,
    actTitle: 'BECOMING THE GHOST',
    levelNumber: 3,
    environmentType: 'Luxury corporate office',
    sectorId: 'sector-02',
    sectorName: 'SECTOR 02 · EXECUTIVE ATRIUM',
    operationCode: 'OP // 03',
    title: 'GLASS HOUSE',
    facilityName: 'ORION SYNDICATE PENTHOUSE OFFICES',
    targetName: 'FINANCIAL EXTORTION DOSSIER',
    difficulty: 'OPERATIVE',
    basePayout: 38000,
    risk: 'MEDIUM',
    securityRating: 3.0,
    briefing: 'A penthouse complex encased in tempered glass partitions and reflective marble. Sightlines are exceptionally long. Pick your moments carefully, bypass executive keycard doors, hack the syndicate workstation, and extract the extortion dossier.',
    secondaryObjectives: [
      'Do not break stealth or trigger executive lockdown',
      'Neutralize zero syndicate guards',
      'Collect all decrypted intelligence files'
    ],
    recommendedEquipment: [
      'OPTICAL CLOAK',
      'NEURAL DECODER',
      'SILENT BOOTS'
    ],
    entryRoutes: [
      'Vector Alpha: Service elevator conduit',
      'Vector Bravo: Exterior window wash gantry'
    ],
    unlockReward: 'ADVANCED ACCESS CREDENTIALS & INTELLIGENCE DOSSIER',
    estimatedDuration: '04:45',
    intel: {
      guards: 3,
      cameras: 2,
      drones: 0,
      securityTier: 'TIER 3 SYNDICATE GUARDS'
    },
    mapWidth: 1800,
    mapHeight: 1100,
    playerStart: { x: 140, y: 920 },
    vault: {
      x: 1520,
      y: 240,
      width: 140,
      height: 140,
      targetName: 'FINANCIAL EXTORTION DOSSIER',
      isCracked: false,
      securityLayers: 3
    },
    extraction: {
      x: 180,
      y: 200,
      radius: 80,
      name: 'EXECUTIVE SKYDECK BALCONY'
    },
    lights: [
      { id: 'l3-entry', x: 220, y: 900, radius: 220, isOn: true, color: '#fef08a' },
      { id: 'l3-atrium', x: 750, y: 750, radius: 260, isOn: true, color: '#f8fafc' },
      { id: 'l3-glass-hall', x: 1200, y: 750, radius: 250, isOn: true, color: '#e0f2fe' },
      { id: 'l3-boardroom', x: 1540, y: 300, radius: 230, isOn: true, color: '#fef3c7' },
      { id: 'l3-balcony', x: 180, y: 200, radius: 200, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-l3-switch',
        x: 950,
        y: 650,
        width: 24,
        height: 24,
        type: 'LIGHT_SWITCH',
        name: 'ATRIUM CHANDELIER SWITCH',
        isInteracted: false,
        targetId: 'l3-atrium'
      },
      {
        id: 'env-l3-vent',
        x: 1350,
        y: 540,
        width: 32,
        height: 32,
        type: 'MAINTENANCE_VENT',
        name: 'CEILING HVAC DUCT',
        isInteracted: false,
        targetId: 'door-l3-ceo'
      }
    ],
    walls: [
      // Outer
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 1050, type: 'SOLID' },
      { x1: 1750, y1: 1050, x2: 50, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 1050, x2: 50, y2: 50, type: 'SOLID' },

      // Entry Lobby
      { x1: 300, y1: 750, x2: 300, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 750, x2: 220, y2: 750, type: 'SOLID' },

      // Glass Conference Rooms (transparent dividers)
      { x1: 450, y1: 650, x2: 900, y2: 650, type: 'GLASS' },
      { x1: 450, y1: 650, x2: 450, y2: 950, type: 'GLASS' },
      { x1: 900, y1: 650, x2: 900, y2: 950, type: 'GLASS' },
      { x1: 450, y1: 950, x2: 620, y2: 950, type: 'GLASS' },
      { x1: 720, y1: 950, x2: 900, y2: 950, type: 'GLASS' }, // Door gap 620-720

      // Main Atrium East Wall
      { x1: 980, y1: 550, x2: 980, y2: 1050, type: 'SOLID' },

      // Executive Suite Wing
      { x1: 980, y1: 550, x2: 1350, y2: 550, type: 'SOLID' },
      { x1: 1350, y1: 550, x2: 1350, y2: 720, type: 'SOLID' },
      { x1: 1350, y1: 720, x2: 1350, y2: 820, type: 'DOOR', doorId: 'door-l3-exec', isOpen: false },
      { x1: 1350, y1: 820, x2: 1350, y2: 1050, type: 'SOLID' },

      // Boardroom Vault Room (top right)
      { x1: 1300, y1: 100, x2: 1750, y2: 100, type: 'SOLID' },
      { x1: 1300, y1: 100, x2: 1300, y2: 450, type: 'SOLID' },
      { x1: 1300, y1: 450, x2: 1450, y2: 450, type: 'SOLID' },
      { x1: 1450, y1: 450, x2: 1550, y2: 450, type: 'DOOR', doorId: 'door-l3-ceo', isOpen: false },
      { x1: 1550, y1: 450, x2: 1750, y2: 450, type: 'SOLID' },

      // Balcony escape partition (top left)
      { x1: 50, y1: 450, x2: 1300, y2: 450, type: 'SOLID' },
      { x1: 350, y1: 50, x2: 350, y2: 450, type: 'SOLID' },
      { x1: 220, y1: 450, x2: 350, y2: 450, type: 'DOOR', doorId: 'door-l3-balcony', isOpen: true }
    ],
    guards: [
      {
        id: 'g3-01',
        x: 650,
        y: 800,
        angle: 0,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 520, y: 800 },
          { x: 820, y: 800 },
          { x: 820, y: 900 },
          { x: 520, y: 900 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 290,
        fov: Math.PI * 0.44
      },
      {
        id: 'g3-02',
        x: 1150,
        y: 850,
        angle: -Math.PI * 0.5,
        speed: 1.25,
        state: 'PATROL',
        patrolPath: [
          { x: 1150, y: 950 },
          { x: 1150, y: 680 },
          { x: 1280, y: 680 },
          { x: 1280, y: 950 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 300,
        fov: Math.PI * 0.42
      },
      {
        id: 'g3-03',
        x: 1550,
        y: 750,
        angle: Math.PI,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 1550, y: 750 },
          { x: 1400, y: 750 },
          { x: 1400, y: 920 },
          { x: 1650, y: 920 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 290,
        fov: Math.PI * 0.42
      }
    ],
    cameras: [
      {
        id: 'cam-l3-01',
        x: 960,
        y: 580,
        angle: 1.5,
        baseAngle: 1.5,
        sweepAngle: 1.4,
        sweepSpeed: 0.85,
        range: 330,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l3-02',
        x: 1330,
        y: 480,
        angle: 2.2,
        baseAngle: 2.2,
        sweepAngle: 1.2,
        sweepSpeed: 0.9,
        range: 320,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [],
    terminals: [
      {
        id: 'term-l3-dossier',
        x: 850,
        y: 690,
        type: 'NETWORK',
        name: 'SYNDICATE FINANCE DESK',
        isHacked: false,
        unlocksDoorId: 'door-l3-exec',
        description: 'Extract confidential offshore balance sheets and unlock suite wing.'
      },
      {
        id: 'term-l3-ceo',
        x: 1250,
        y: 600,
        type: 'SIGNAL',
        name: 'CEO SUITE BIOMETRIC HUB',
        isHacked: false,
        unlocksDoorId: 'door-l3-ceo',
        description: 'Bypass executive iris scanner to grant vault access.'
      }
    ]
  },

  // =========================================================================
  // ACT II — CORPORATE INFILTRATION
  // =========================================================================

  // -------------------------------------------------------------------------
  // LEVEL 04 — BLACKOUT
  // -------------------------------------------------------------------------
  {
    id: 'op-04-blackout',
    actNumber: 2,
    actTitle: 'CORPORATE INFILTRATION',
    levelNumber: 4,
    environmentType: 'Underground power station',
    sectorId: 'sector-03',
    sectorName: 'SECTOR 03 · SUBTERRANEAN GRID',
    operationCode: 'OP // 04',
    title: 'BLACKOUT',
    facilityName: 'HELIOS GENERATOR STATION 09',
    targetName: 'GRID BYPASS HARDWARE',
    difficulty: 'OPERATIVE',
    basePayout: 50000,
    risk: 'MEDIUM',
    securityRating: 4.0,
    briefing: 'Helios Station powers the entire district. Deep underground, thermal generators hum under armed guard. Trigger the central circuit breaker to kill the primary lighting, navigate the dark under emergency strobes, depower the laser grid, and claim the bypass hardware.',
    secondaryObjectives: [
      'Trip the main breaker to initiate total blackout',
      'Disable the turbine laser grid via terminal override',
      'Evade detection with zero guard casualties'
    ],
    recommendedEquipment: [
      'NEURAL SCANNER',
      'EMP DISRUPTOR',
      'OPTICAL CLOAK'
    ],
    entryRoutes: [
      'Vector Alpha: Hydro-cooling intake tunnel',
      'Vector Bravo: High-voltage cable riser'
    ],
    unlockReward: 'POWER-GRID MANIPULATION PROTOCOLS',
    estimatedDuration: '05:00',
    intel: {
      guards: 3,
      cameras: 2,
      drones: 0,
      securityTier: 'TIER 3 GENERATOR SECURITY'
    },
    mapWidth: 1800,
    mapHeight: 1100,
    playerStart: { x: 140, y: 900 },
    vault: {
      x: 1540,
      y: 280,
      width: 140,
      height: 140,
      targetName: 'GRID BYPASS HARDWARE',
      isCracked: false,
      securityLayers: 3
    },
    extraction: {
      x: 160,
      y: 180,
      radius: 80,
      name: 'COOLING TOWER EXHAUST VENT'
    },
    lights: [
      { id: 'l4-intake', x: 220, y: 900, radius: 200, isOn: true, color: '#fef08a' },
      { id: 'l4-turbines', x: 750, y: 780, radius: 260, isOn: true, color: '#e2e8f0' },
      { id: 'l4-generator', x: 1200, y: 780, radius: 240, isOn: true, color: '#fbbf24' },
      { id: 'l4-vault', x: 1540, y: 320, radius: 220, isOn: true, color: '#38bdf8' },
      { id: 'l4-extract', x: 160, y: 180, radius: 200, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-l4-breaker',
        x: 480,
        y: 720,
        width: 30,
        height: 30,
        type: 'CIRCUIT_BREAKER',
        name: 'STATION PRIMARY MASTER BREAKER',
        isInteracted: false,
        targetId: 'l4-turbines'
      },
      {
        id: 'env-l4-switch',
        x: 1350,
        y: 650,
        width: 24,
        height: 24,
        type: 'LIGHT_SWITCH',
        name: 'AUXILIARY WORKSHOP LIGHTS',
        isInteracted: false,
        targetId: 'l4-generator'
      }
    ],
    walls: [
      // Outer boundaries
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 1050, type: 'SOLID' },
      { x1: 1750, y1: 1050, x2: 50, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 1050, x2: 50, y2: 50, type: 'SOLID' },

      // Intake shaft wall
      { x1: 300, y1: 750, x2: 300, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 750, x2: 200, y2: 750, type: 'SOLID' },

      // Main Turbine Hall Lower Walls
      { x1: 300, y1: 750, x2: 800, y2: 750, type: 'SOLID' },
      { x1: 900, y1: 750, x2: 1400, y2: 750, type: 'SOLID' },

      // Generator Core Wall
      { x1: 850, y1: 520, x2: 850, y2: 750, type: 'SOLID' },
      { x1: 850, y1: 520, x2: 1400, y2: 520, type: 'SOLID' },
      { x1: 1400, y1: 520, x2: 1400, y2: 700, type: 'SOLID' },
      { x1: 1400, y1: 700, x2: 1400, y2: 800, type: 'DOOR', doorId: 'door-l4-gen', isOpen: false },
      { x1: 1400, y1: 800, x2: 1400, y2: 1050, type: 'SOLID' },

      // High-Voltage Vault Room
      { x1: 1350, y1: 120, x2: 1750, y2: 120, type: 'SOLID' },
      { x1: 1350, y1: 120, x2: 1350, y2: 460, type: 'SOLID' },
      { x1: 1350, y1: 460, x2: 1520, y2: 460, type: 'SOLID' },
      { x1: 1520, y1: 460, x2: 1600, y2: 460, type: 'DOOR', doorId: 'door-l4-vault', isOpen: false },
      { x1: 1600, y1: 460, x2: 1750, y2: 460, type: 'SOLID' },

      // Northern exhaust partition
      { x1: 50, y1: 460, x2: 1350, y2: 460, type: 'SOLID' },
      { x1: 340, y1: 50, x2: 340, y2: 460, type: 'SOLID' },
      { x1: 220, y1: 460, x2: 340, y2: 460, type: 'DOOR', doorId: 'door-l4-exhaust', isOpen: true }
    ],
    guards: [
      {
        id: 'g4-01',
        x: 620,
        y: 840,
        angle: 0,
        speed: 1.15,
        state: 'PATROL',
        patrolPath: [
          { x: 420, y: 840 },
          { x: 800, y: 840 },
          { x: 800, y: 960 },
          { x: 420, y: 960 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 280,
        fov: Math.PI * 0.4
      },
      {
        id: 'g4-02',
        x: 1100,
        y: 820,
        angle: Math.PI,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 1100, y: 820 },
          { x: 920, y: 820 },
          { x: 920, y: 980 },
          { x: 1300, y: 980 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 290,
        fov: Math.PI * 0.42
      },
      {
        id: 'g4-03',
        x: 1150,
        y: 620,
        angle: 0,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 950, y: 620 },
          { x: 1320, y: 620 },
          { x: 1320, y: 700 },
          { x: 950, y: 700 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 300,
        fov: Math.PI * 0.42
      }
    ],
    cameras: [
      {
        id: 'cam-l4-01',
        x: 820,
        y: 540,
        angle: 1.2,
        baseAngle: 1.2,
        sweepAngle: 1.3,
        sweepSpeed: 0.8,
        range: 320,
        fov: Math.PI * 0.36,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l4-02',
        x: 1380,
        y: 480,
        angle: 2.2,
        baseAngle: 2.2,
        sweepAngle: 1.2,
        sweepSpeed: 0.85,
        range: 330,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [
      {
        id: 'laser-l4-turbine',
        x1: 900,
        y1: 750,
        x2: 900,
        y2: 880,
        isActive: true,
        cycleInterval: 3500,
        cycleOffset: 0
      }
    ],
    terminals: [
      {
        id: 'term-l4-laser',
        x: 750,
        y: 710,
        type: 'OVERRIDE',
        name: 'TURBINE LASER OVERRIDE',
        isHacked: false,
        disablesLaserId: 'laser-l4-turbine',
        description: 'Depower high-voltage laser barrier across generator access corridor.'
      },
      {
        id: 'term-l4-vault',
        x: 1250,
        y: 560,
        type: 'CODE',
        name: 'CAPACITOR VAULT LOGIC BUS',
        isHacked: false,
        unlocksDoorId: 'door-l4-vault',
        description: 'Bypass electromagnetic isolation seal guarding grid bypass hardware.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // LEVEL 05 — SILENT FREQUENCY
  // -------------------------------------------------------------------------
  {
    id: 'op-05-silent-frequency',
    actNumber: 2,
    actTitle: 'CORPORATE INFILTRATION',
    levelNumber: 5,
    environmentType: 'Communications facility',
    sectorId: 'sector-04',
    sectorName: 'SECTOR 04 · BROADCAST ARRAY',
    operationCode: 'OP // 05',
    title: 'SILENT FREQUENCY',
    facilityName: 'VOX-NET SATELLITE RELAY TOWER',
    targetName: 'QUANTUM FREQUENCY CIPHER',
    difficulty: 'OPERATIVE',
    basePayout: 62000,
    risk: 'MEDIUM',
    securityRating: 5.0,
    briefing: 'Vox-Net operates the megacity communications spine. Guards here are equipped with auditory surveillance headgear. Footstep noise will alert them from extreme distances. Maintain crouch stealth, deploy noise decoys, intercept the comms signal, and extract the quantum cipher.',
    secondaryObjectives: [
      'Maintain strict crouch discipline in sound-sensitive zones',
      'Deploy distraction decoy to divert security patrol',
      'Zero alarms triggered'
    ],
    recommendedEquipment: [
      'SILENT BOOTS',
      'ACOUSTIC DISTRACTOR',
      'SIGNAL JAMMER'
    ],
    entryRoutes: [
      'Vector Alpha: Maintenance antenna ladder',
      'Vector Bravo: Fiber-optic cable conduit'
    ],
    unlockReward: 'SIGNAL INTERCEPTOR & ACOUSTIC VISUALIZER',
    estimatedDuration: '05:15',
    intel: {
      guards: 3,
      cameras: 2,
      drones: 0,
      securityTier: 'TIER 3 AUDIO-SENSITIVE SECURITY'
    },
    mapWidth: 1800,
    mapHeight: 1100,
    playerStart: { x: 140, y: 880 },
    vault: {
      x: 1520,
      y: 220,
      width: 140,
      height: 140,
      targetName: 'QUANTUM FREQUENCY CIPHER',
      isCracked: false,
      securityLayers: 3
    },
    extraction: {
      x: 160,
      y: 160,
      radius: 80,
      name: 'PARABOLIC DISH SERVICE GANTRY'
    },
    lights: [
      { id: 'l5-cable-room', x: 220, y: 880, radius: 210, isOn: true, color: '#fef08a' },
      { id: 'l5-server-farm', x: 750, y: 750, radius: 260, isOn: true, color: '#e0f2fe' },
      { id: 'l5-relay-hall', x: 1200, y: 750, radius: 250, isOn: true, color: '#38bdf8' },
      { id: 'l5-transmitter', x: 1540, y: 260, radius: 220, isOn: true, color: '#818cf8' },
      { id: 'l5-extract', x: 160, y: 160, radius: 190, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-l5-vent',
        x: 600,
        y: 620,
        width: 32,
        height: 32,
        type: 'MAINTENANCE_VENT',
        name: 'ACOUSTIC BAFFLE BYPASS DUCT',
        isInteracted: false,
        targetId: 'door-l5-server'
      },
      {
        id: 'env-l5-switch',
        x: 1100,
        y: 680,
        width: 24,
        height: 24,
        type: 'LIGHT_SWITCH',
        name: 'BROADCAST BAY HALOGEN SWITCH',
        isInteracted: false,
        targetId: 'l5-relay-hall'
      }
    ],
    walls: [
      // Outer
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 1050, type: 'SOLID' },
      { x1: 1750, y1: 1050, x2: 50, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 1050, x2: 50, y2: 50, type: 'SOLID' },

      // Entry Cable Room
      { x1: 300, y1: 720, x2: 300, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 720, x2: 220, y2: 720, type: 'SOLID' },

      // Acoustic Server Farm Room
      { x1: 420, y1: 620, x2: 900, y2: 620, type: 'SOLID' },
      { x1: 420, y1: 620, x2: 420, y2: 950, type: 'SOLID' },
      { x1: 900, y1: 620, x2: 900, y2: 760, type: 'SOLID' },
      { x1: 900, y1: 760, x2: 900, y2: 860, type: 'DOOR', doorId: 'door-l5-server', isOpen: false },
      { x1: 900, y1: 860, x2: 900, y2: 1050, type: 'SOLID' },

      // Central Corridor Wall
      { x1: 900, y1: 620, x2: 1400, y2: 620, type: 'SOLID' },
      { x1: 1400, y1: 620, x2: 1400, y2: 740, type: 'SOLID' },
      { x1: 1400, y1: 740, x2: 1400, y2: 840, type: 'DOOR', doorId: 'door-l5-transmitter', isOpen: false },
      { x1: 1400, y1: 840, x2: 1400, y2: 1050, type: 'SOLID' },

      // Transmitter Vault Chamber (top right)
      { x1: 1320, y1: 100, x2: 1750, y2: 100, type: 'SOLID' },
      { x1: 1320, y1: 100, x2: 1320, y2: 460, type: 'SOLID' },
      { x1: 1320, y1: 460, x2: 1480, y2: 460, type: 'SOLID' },
      { x1: 1480, y1: 460, x2: 1560, y2: 460, type: 'DOOR', doorId: 'door-l5-vault', isOpen: false },
      { x1: 1560, y1: 460, x2: 1750, y2: 460, type: 'SOLID' },

      // North antenna gantry escape wing
      { x1: 50, y1: 460, x2: 1320, y2: 460, type: 'SOLID' },
      { x1: 340, y1: 50, x2: 340, y2: 460, type: 'SOLID' },
      { x1: 220, y1: 460, x2: 340, y2: 460, type: 'DOOR', doorId: 'door-l5-antenna', isOpen: true }
    ],
    guards: [
      {
        id: 'g5-01',
        x: 650,
        y: 780,
        angle: 0,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 480, y: 780 },
          { x: 820, y: 780 },
          { x: 820, y: 920 },
          { x: 480, y: 920 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 280,
        fov: Math.PI * 0.4
      },
      {
        id: 'g5-02',
        x: 1150,
        y: 820,
        angle: -Math.PI * 0.5,
        speed: 1.25,
        state: 'PATROL',
        patrolPath: [
          { x: 1150, y: 920 },
          { x: 1150, y: 700 },
          { x: 1320, y: 700 },
          { x: 1320, y: 920 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 290,
        fov: Math.PI * 0.42
      },
      {
        id: 'g5-03',
        x: 1550,
        y: 680,
        angle: Math.PI,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 1550, y: 680 },
          { x: 1420, y: 680 },
          { x: 1420, y: 920 },
          { x: 1680, y: 920 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 300,
        fov: Math.PI * 0.42
      }
    ],
    cameras: [
      {
        id: 'cam-l5-01',
        x: 880,
        y: 640,
        angle: 1.3,
        baseAngle: 1.3,
        sweepAngle: 1.3,
        sweepSpeed: 0.85,
        range: 320,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l5-02',
        x: 1380,
        y: 500,
        angle: 2.3,
        baseAngle: 2.3,
        sweepAngle: 1.2,
        sweepSpeed: 0.8,
        range: 310,
        fov: Math.PI * 0.36,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [],
    terminals: [
      {
        id: 'term-l5-signal',
        x: 820,
        y: 660,
        type: 'SIGNAL',
        name: 'COMMS INTERCEPTION CONSOLE',
        isHacked: false,
        unlocksDoorId: 'door-l5-server',
        description: 'Intercept encrypted carrier frequency and unlock server farm.'
      },
      {
        id: 'term-l5-vault',
        x: 1250,
        y: 660,
        type: 'NETWORK',
        name: 'TRANSMITTER CORE MATRIX',
        isHacked: false,
        unlocksDoorId: 'door-l5-vault',
        description: 'Disengage transmitter radiation shroud to access cipher core.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // LEVEL 06 — THE ARCHIVE
  // -------------------------------------------------------------------------
  {
    id: 'op-06-the-archive',
    actNumber: 2,
    actTitle: 'CORPORATE INFILTRATION',
    levelNumber: 6,
    environmentType: 'Classified data vault',
    sectorId: 'sector-05',
    sectorName: 'SECTOR 05 · SECURE ARCHIVES',
    operationCode: 'OP // 06',
    title: 'THE ARCHIVE',
    facilityName: 'CHRONOS DEEP DATA SANCTUM',
    targetName: 'PROJECT GHOST CIPHER ARCHIVE',
    difficulty: 'GHOST',
    basePayout: 75000,
    risk: 'HIGH',
    securityRating: 6.0,
    briefing: 'Chronos Sanctum stores centuries of classified black projects. A layered authentication grid protects the central data vault. Solve the multi-stage terminal challenges, outmaneuver the elite patrolling guards, retrieve the Project Ghost files, and vanish without a trace.',
    secondaryObjectives: [
      'Complete all 3 security layer authentication hacks',
      'Neutralize zero elite archive guards',
      'Recover the classified Project Ghost dossier fragment'
    ],
    recommendedEquipment: [
      'NEURAL DECODER',
      'OPTICAL CLOAK',
      'REMOTE ACCESS DEVICE'
    ],
    entryRoutes: [
      'Vector Alpha: Cryo-coolant intake valve',
      'Vector Bravo: Pneumatic archive delivery tube'
    ],
    unlockReward: 'ADVANCED HACKING TOOLS & PREMIUM CONTRACTS',
    estimatedDuration: '05:45',
    intel: {
      guards: 4,
      cameras: 2,
      drones: 0,
      securityTier: 'TIER 4 ELITE ARCHIVE GUARDS'
    },
    mapWidth: 1800,
    mapHeight: 1100,
    playerStart: { x: 140, y: 920 },
    vault: {
      x: 1520,
      y: 220,
      width: 140,
      height: 140,
      targetName: 'PROJECT GHOST CIPHER ARCHIVE',
      isCracked: false,
      securityLayers: 3
    },
    extraction: {
      x: 140,
      y: 200,
      radius: 80,
      name: 'DEEP SERVICE CONDUIT SHUTTLE'
    },
    lights: [
      { id: 'l6-airlock', x: 220, y: 920, radius: 210, isOn: true, color: '#fef08a' },
      { id: 'l6-sector-a', x: 650, y: 780, radius: 240, isOn: true, color: '#e2e8f0' },
      { id: 'l6-sector-b', x: 1100, y: 780, radius: 250, isOn: true, color: '#a855f7' },
      { id: 'l6-cryocore', x: 1540, y: 280, radius: 230, isOn: true, color: '#38bdf8' },
      { id: 'l6-extract', x: 140, y: 200, radius: 200, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-l6-switch',
        x: 880,
        y: 680,
        width: 24,
        height: 24,
        type: 'LIGHT_SWITCH',
        name: 'ARCHIVE STACK A LIGHT SWITCH',
        isInteracted: false,
        targetId: 'l6-sector-a'
      },
      {
        id: 'env-l6-vent',
        x: 1300,
        y: 520,
        width: 32,
        height: 32,
        type: 'MAINTENANCE_VENT',
        name: 'CRYO-CONDUIT ACCESS VENT',
        isInteracted: false,
        targetId: 'door-l6-sanctum'
      }
    ],
    walls: [
      // Outer
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 1050, type: 'SOLID' },
      { x1: 1750, y1: 1050, x2: 50, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 1050, x2: 50, y2: 50, type: 'SOLID' },

      // Airlock
      { x1: 300, y1: 750, x2: 300, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 750, x2: 200, y2: 750, type: 'SOLID' },

      // Sector Alpha Partition
      { x1: 300, y1: 750, x2: 850, y2: 750, type: 'SOLID' },
      { x1: 850, y1: 750, x2: 850, y2: 860, type: 'SOLID' },
      { x1: 850, y1: 860, x2: 850, y2: 960, type: 'DOOR', doorId: 'door-l6-alpha', isOpen: false },
      { x1: 850, y1: 960, x2: 850, y2: 1050, type: 'SOLID' },

      // Sector Beta Partition
      { x1: 850, y1: 550, x2: 1350, y2: 550, type: 'SOLID' },
      { x1: 1350, y1: 550, x2: 1350, y2: 740, type: 'SOLID' },
      { x1: 1350, y1: 740, x2: 1350, y2: 840, type: 'DOOR', doorId: 'door-l6-beta', isOpen: false },
      { x1: 1350, y1: 840, x2: 1350, y2: 1050, type: 'SOLID' },

      // Cryo Sanctum Vault (top right)
      { x1: 1300, y1: 100, x2: 1750, y2: 100, type: 'SOLID' },
      { x1: 1300, y1: 100, x2: 1300, y2: 450, type: 'SOLID' },
      { x1: 1300, y1: 450, x2: 1480, y2: 450, type: 'SOLID' },
      { x1: 1480, y1: 450, x2: 1560, y2: 450, type: 'DOOR', doorId: 'door-l6-sanctum', isOpen: false },
      { x1: 1560, y1: 450, x2: 1750, y2: 450, type: 'SOLID' },

      // North extraction wing
      { x1: 50, y1: 450, x2: 1300, y2: 450, type: 'SOLID' },
      { x1: 320, y1: 50, x2: 320, y2: 450, type: 'SOLID' },
      { x1: 200, y1: 450, x2: 320, y2: 450, type: 'DOOR', doorId: 'door-l6-extract', isOpen: true }
    ],
    guards: [
      {
        id: 'g6-01',
        x: 580,
        y: 850,
        angle: 0,
        speed: 1.25,
        state: 'PATROL',
        patrolPath: [
          { x: 380, y: 850 },
          { x: 780, y: 850 },
          { x: 780, y: 980 },
          { x: 380, y: 980 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 300,
        fov: Math.PI * 0.44
      },
      {
        id: 'g6-02',
        x: 1050,
        y: 840,
        angle: -Math.PI * 0.5,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 1050, y: 960 },
          { x: 1050, y: 680 },
          { x: 1250, y: 680 },
          { x: 1250, y: 960 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 300,
        fov: Math.PI * 0.44
      },
      {
        id: 'g6-03',
        x: 1540,
        y: 750,
        angle: Math.PI,
        speed: 1.25,
        state: 'PATROL',
        patrolPath: [
          { x: 1540, y: 750 },
          { x: 1400, y: 750 },
          { x: 1400, y: 950 },
          { x: 1680, y: 950 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.44
      },
      {
        id: 'g6-04',
        x: 1100,
        y: 350,
        angle: 0,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 900, y: 350 },
          { x: 1250, y: 350 },
          { x: 1250, y: 420 },
          { x: 900, y: 420 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 300,
        fov: Math.PI * 0.42
      }
    ],
    cameras: [
      {
        id: 'cam-l6-01',
        x: 830,
        y: 570,
        angle: 1.4,
        baseAngle: 1.4,
        sweepAngle: 1.3,
        sweepSpeed: 0.9,
        range: 330,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l6-02',
        x: 1330,
        y: 470,
        angle: 2.2,
        baseAngle: 2.2,
        sweepAngle: 1.3,
        sweepSpeed: 0.9,
        range: 340,
        fov: Math.PI * 0.4,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [],
    terminals: [
      {
        id: 'term-l6-alpha',
        x: 750,
        y: 720,
        type: 'CODE',
        name: 'SECTOR ALPHA CIPHER BUS',
        isHacked: false,
        unlocksDoorId: 'door-l6-alpha',
        description: 'Reconstruct cryptographic hash to release Sector Alpha security door.'
      },
      {
        id: 'term-l6-beta',
        x: 1200,
        y: 720,
        type: 'SIGNAL',
        name: 'SECTOR BETA RESONANCE TERMINAL',
        isHacked: false,
        unlocksDoorId: 'door-l6-beta',
        description: 'Harmonize RF frequencies to unlock Sector Beta cryogenic gateway.'
      },
      {
        id: 'term-l6-sanctum',
        x: 1250,
        y: 380,
        type: 'OVERRIDE',
        name: 'CHRONOS MASTER ARCHIVE VAULT',
        isHacked: false,
        unlocksDoorId: 'door-l6-sanctum',
        description: 'Disengage deep cryogenic seal guarding Project Ghost archives.'
      }
    ]
  },

  // =========================================================================
  // ACT III — THE GHOST PROTOCOL
  // =========================================================================

  // -------------------------------------------------------------------------
  // LEVEL 07 — REDLINE
  // -------------------------------------------------------------------------
  {
    id: 'op-07-redline',
    actNumber: 3,
    actTitle: 'THE GHOST PROTOCOL',
    levelNumber: 7,
    environmentType: 'High-security research laboratory',
    sectorId: 'sector-06',
    sectorName: 'SECTOR 06 · BIOMECH LABS',
    operationCode: 'OP // 07',
    title: 'REDLINE',
    facilityName: 'CYBERDYNAMICS ADVANCED LABS',
    targetName: 'EXPERIMENTAL CLOAKING MATRIX',
    difficulty: 'GHOST',
    basePayout: 90000,
    risk: 'HIGH',
    securityRating: 7.0,
    briefing: 'Cyberdynamics is building next-generation military invisibility rigs. The facility is protected by synchronized mil-spec patrols and automated laser trip-grids. Avoid tripping the lasers, override the cleanroom containment terminal, and extract the experimental matrix.',
    secondaryObjectives: [
      'Bypass all cleanroom lasers without touching beams',
      'Neutralize zero research security officers',
      'Secure experimental telemetry file'
    ],
    recommendedEquipment: [
      'OPTICAL CLOAK',
      'GRAPPLE LINE',
      'NEURAL DECODER'
    ],
    entryRoutes: [
      'Vector Alpha: Nitrogen ventilation shaft',
      'Vector Bravo: Decontamination chamber airlock'
    ],
    unlockReward: 'MIL-SPEC TACTICAL GEAR & ELITE CONTRACTS',
    estimatedDuration: '06:00',
    intel: {
      guards: 4,
      cameras: 3,
      drones: 0,
      securityTier: 'TIER 4 MIL-SPEC GUARDS'
    },
    mapWidth: 1800,
    mapHeight: 1100,
    playerStart: { x: 140, y: 900 },
    vault: {
      x: 1500,
      y: 240,
      width: 140,
      height: 140,
      targetName: 'EXPERIMENTAL CLOAKING MATRIX',
      isCracked: false,
      securityLayers: 3
    },
    extraction: {
      x: 160,
      y: 200,
      radius: 80,
      name: 'NITROGEN VENT SHAFT AERODYNE'
    },
    lights: [
      { id: 'l7-airlock', x: 220, y: 900, radius: 210, isOn: true, color: '#fef08a' },
      { id: 'l7-lab1', x: 720, y: 750, radius: 260, isOn: true, color: '#e0f2fe' },
      { id: 'l7-lab2', x: 1180, y: 750, radius: 250, isOn: true, color: '#f8fafc' },
      { id: 'l7-stasis', x: 1520, y: 280, radius: 240, isOn: true, color: '#38bdf8' },
      { id: 'l7-extract', x: 160, y: 200, radius: 200, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-l7-switch',
        x: 950,
        y: 650,
        width: 24,
        height: 24,
        type: 'LIGHT_SWITCH',
        name: 'LAB 1 UV DECONTAMINATION LIGHTS',
        isInteracted: false,
        targetId: 'l7-lab1'
      },
      {
        id: 'env-l7-vent',
        x: 1320,
        y: 520,
        width: 32,
        height: 32,
        type: 'MAINTENANCE_VENT',
        name: 'STASIS LAB CEILING FLUE',
        isInteracted: false,
        targetId: 'door-l7-stasis'
      }
    ],
    walls: [
      // Outer
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 1050, type: 'SOLID' },
      { x1: 1750, y1: 1050, x2: 50, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 1050, x2: 50, y2: 50, type: 'SOLID' },

      // Decon entry
      { x1: 300, y1: 750, x2: 300, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 750, x2: 200, y2: 750, type: 'SOLID' },

      // Cleanroom corridor 1
      { x1: 300, y1: 750, x2: 750, y2: 750, type: 'SOLID' },
      { x1: 850, y1: 750, x2: 1400, y2: 750, type: 'SOLID' },

      // Laser chamber partition
      { x1: 850, y1: 550, x2: 850, y2: 750, type: 'GLASS' },
      { x1: 850, y1: 550, x2: 1400, y2: 550, type: 'SOLID' },
      { x1: 1400, y1: 550, x2: 1400, y2: 720, type: 'SOLID' },
      { x1: 1400, y1: 720, x2: 1400, y2: 820, type: 'DOOR', doorId: 'door-l7-cleanroom', isOpen: false },
      { x1: 1400, y1: 820, x2: 1400, y2: 1050, type: 'SOLID' },

      // Stasis Vault Room (top right)
      { x1: 1280, y1: 100, x2: 1750, y2: 100, type: 'SOLID' },
      { x1: 1280, y1: 100, x2: 1280, y2: 450, type: 'SOLID' },
      { x1: 1280, y1: 450, x2: 1450, y2: 450, type: 'SOLID' },
      { x1: 1450, y1: 450, x2: 1550, y2: 450, type: 'DOOR', doorId: 'door-l7-stasis', isOpen: false },
      { x1: 1550, y1: 450, x2: 1750, y2: 450, type: 'SOLID' },

      // North extraction wing
      { x1: 50, y1: 450, x2: 1280, y2: 450, type: 'SOLID' },
      { x1: 340, y1: 50, x2: 340, y2: 450, type: 'SOLID' },
      { x1: 220, y1: 450, x2: 340, y2: 450, type: 'DOOR', doorId: 'door-l7-vent', isOpen: true }
    ],
    guards: [
      {
        id: 'g7-01',
        x: 550,
        y: 850,
        angle: 0,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 380, y: 850 },
          { x: 750, y: 850 },
          { x: 750, y: 980 },
          { x: 380, y: 980 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.45
      },
      {
        id: 'g7-02',
        x: 1100,
        y: 840,
        angle: -Math.PI * 0.5,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 1100, y: 950 },
          { x: 1100, y: 680 },
          { x: 1280, y: 680 },
          { x: 1280, y: 950 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.45
      },
      {
        id: 'g7-03',
        x: 1550,
        y: 720,
        angle: Math.PI,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 1550, y: 720 },
          { x: 1420, y: 720 },
          { x: 1420, y: 950 },
          { x: 1680, y: 950 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.45
      },
      {
        id: 'g7-04',
        x: 1050,
        y: 360,
        angle: 0,
        speed: 1.25,
        state: 'PATROL',
        patrolPath: [
          { x: 850, y: 360 },
          { x: 1200, y: 360 },
          { x: 1200, y: 420 },
          { x: 850, y: 420 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.42
      }
    ],
    cameras: [
      {
        id: 'cam-l7-01',
        x: 820,
        y: 570,
        angle: 1.3,
        baseAngle: 1.3,
        sweepAngle: 1.3,
        sweepSpeed: 0.95,
        range: 340,
        fov: Math.PI * 0.4,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l7-02',
        x: 1380,
        y: 470,
        angle: 2.2,
        baseAngle: 2.2,
        sweepAngle: 1.3,
        sweepSpeed: 0.95,
        range: 340,
        fov: Math.PI * 0.4,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l7-03',
        x: 1260,
        y: 120,
        angle: 1.8,
        baseAngle: 1.8,
        sweepAngle: 1.2,
        sweepSpeed: 0.9,
        range: 320,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [
      {
        id: 'laser-l7-cleanroom',
        x1: 750,
        y1: 750,
        x2: 750,
        y2: 880,
        isActive: true,
        cycleInterval: 3000,
        cycleOffset: 0
      }
    ],
    terminals: [
      {
        id: 'term-l7-laser',
        x: 700,
        y: 710,
        type: 'OVERRIDE',
        name: 'CLEANROOM LASER BUS',
        isHacked: false,
        disablesLaserId: 'laser-l7-cleanroom',
        description: 'Disable automated biometric laser sensors.'
      },
      {
        id: 'term-l7-stasis',
        x: 1200,
        y: 600,
        type: 'NETWORK',
        name: 'STASIS LAB LOCKDOWN TERMINAL',
        isHacked: false,
        unlocksDoorId: 'door-l7-stasis',
        description: 'Disengage hermetic seal on prototype containment room.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // LEVEL 08 — NO WITNESSES
  // -------------------------------------------------------------------------
  {
    id: 'op-08-no-witnesses',
    actNumber: 3,
    actTitle: 'THE GHOST PROTOCOL',
    levelNumber: 8,
    environmentType: 'Corporate tower under lockdown',
    sectorId: 'sector-07',
    sectorName: 'SECTOR 07 · LOCKDOWN SPIRE',
    operationCode: 'OP // 08',
    title: 'NO WITNESSES',
    facilityName: 'KUROSHIO HEAVY CITADEL - 88TH FLOOR',
    targetName: 'COMMAND LOCKDOWN OVERRIDE',
    difficulty: 'NIGHTMARE',
    basePayout: 110000,
    risk: 'EXTREME',
    securityRating: 8.5,
    briefing: 'Kuroshio Citadel has declared an internal lockdown. Armed shock teams patrol every junction, red emergency beacons flash, and automated kill-lasers block key choke points. Navigate through service elevators and maintenance shafts to crack the command terminal.',
    secondaryObjectives: [
      'Bypass all corporate lockdown barriers without detection',
      'Neutralize zero shock team guards',
      'Complete mission in under 5 minutes'
    ],
    recommendedEquipment: [
      'OPTICAL CLOAK',
      'SIGNAL JAMMER',
      'NEURAL DECODER'
    ],
    entryRoutes: [
      'Vector Alpha: Exterior window washer gantry',
      'Vector Bravo: Elevator counterweight shaft'
    ],
    unlockReward: 'ELITE PROTOCOL LOADOUT & FINAL BRIEFING',
    estimatedDuration: '06:30',
    intel: {
      guards: 5,
      cameras: 3,
      drones: 0,
      securityTier: 'TIER 5 KUROSHIO SHOCK TEAM'
    },
    mapWidth: 1800,
    mapHeight: 1100,
    playerStart: { x: 140, y: 920 },
    vault: {
      x: 1540,
      y: 200,
      width: 140,
      height: 140,
      targetName: 'COMMAND LOCKDOWN OVERRIDE',
      isCracked: false,
      securityLayers: 3
    },
    extraction: {
      x: 140,
      y: 160,
      radius: 80,
      name: 'WEST HELIPAD SKYDUCT'
    },
    lights: [
      { id: 'l8-entry', x: 220, y: 920, radius: 210, isOn: true, color: '#ef4444', flicker: true },
      { id: 'l8-lobby', x: 750, y: 780, radius: 260, isOn: true, color: '#ef4444', flicker: true },
      { id: 'l8-security', x: 1200, y: 780, radius: 250, isOn: true, color: '#f8fafc' },
      { id: 'l8-command', x: 1550, y: 260, radius: 240, isOn: true, color: '#38bdf8' },
      { id: 'l8-extract', x: 140, y: 160, radius: 200, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-l8-switch',
        x: 900,
        y: 680,
        width: 24,
        height: 24,
        type: 'LIGHT_SWITCH',
        name: 'LOCKDOWN STROBE CONTROLLER',
        isInteracted: false,
        targetId: 'l8-lobby'
      },
      {
        id: 'env-l8-vent',
        x: 1300,
        y: 500,
        width: 32,
        height: 32,
        type: 'MAINTENANCE_VENT',
        name: 'COMMAND SPIRE ELEVATOR SHAFT',
        isInteracted: false,
        targetId: 'door-l8-command'
      }
    ],
    walls: [
      // Outer
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 1050, type: 'SOLID' },
      { x1: 1750, y1: 1050, x2: 50, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 1050, x2: 50, y2: 50, type: 'SOLID' },

      // Entry Gantry
      { x1: 300, y1: 750, x2: 300, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 750, x2: 200, y2: 750, type: 'SOLID' },

      // Main Lockdown Corridor
      { x1: 300, y1: 750, x2: 800, y2: 750, type: 'SOLID' },
      { x1: 900, y1: 750, x2: 1400, y2: 750, type: 'SOLID' },

      // Security Office Wing
      { x1: 850, y1: 520, x2: 850, y2: 750, type: 'SOLID' },
      { x1: 850, y1: 520, x2: 1400, y2: 520, type: 'SOLID' },
      { x1: 1400, y1: 520, x2: 1400, y2: 720, type: 'SOLID' },
      { x1: 1400, y1: 720, x2: 1400, y2: 820, type: 'DOOR', doorId: 'door-l8-security', isOpen: false },
      { x1: 1400, y1: 820, x2: 1400, y2: 1050, type: 'SOLID' },

      // Command Chamber Vault (top right)
      { x1: 1300, y1: 100, x2: 1750, y2: 100, type: 'SOLID' },
      { x1: 1300, y1: 100, x2: 1300, y2: 440, type: 'SOLID' },
      { x1: 1300, y1: 440, x2: 1480, y2: 440, type: 'SOLID' },
      { x1: 1480, y1: 440, x2: 1560, y2: 440, type: 'DOOR', doorId: 'door-l8-command', isOpen: false },
      { x1: 1560, y1: 440, x2: 1750, y2: 440, type: 'SOLID' },

      // North Helipad wing
      { x1: 50, y1: 440, x2: 1300, y2: 440, type: 'SOLID' },
      { x1: 320, y1: 50, x2: 320, y2: 440, type: 'SOLID' },
      { x1: 200, y1: 440, x2: 320, y2: 440, type: 'DOOR', doorId: 'door-l8-helipad', isOpen: true }
    ],
    guards: [
      {
        id: 'g8-01',
        x: 550,
        y: 860,
        angle: 0,
        speed: 1.35,
        state: 'PATROL',
        patrolPath: [
          { x: 380, y: 860 },
          { x: 780, y: 860 },
          { x: 780, y: 980 },
          { x: 380, y: 980 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.46
      },
      {
        id: 'g8-02',
        x: 1100,
        y: 850,
        angle: -Math.PI * 0.5,
        speed: 1.35,
        state: 'PATROL',
        patrolPath: [
          { x: 1100, y: 960 },
          { x: 1100, y: 680 },
          { x: 1300, y: 680 },
          { x: 1300, y: 960 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.46
      },
      {
        id: 'g8-03',
        x: 1560,
        y: 720,
        angle: Math.PI,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 1560, y: 720 },
          { x: 1420, y: 720 },
          { x: 1420, y: 950 },
          { x: 1680, y: 950 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.46
      },
      {
        id: 'g8-04',
        x: 1100,
        y: 350,
        angle: 0,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 900, y: 350 },
          { x: 1250, y: 350 },
          { x: 1250, y: 420 },
          { x: 900, y: 420 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.44
      },
      {
        id: 'g8-05',
        x: 1520,
        y: 350,
        angle: -Math.PI * 0.5,
        speed: 1.25,
        state: 'PATROL',
        patrolPath: [
          { x: 1520, y: 350 },
          { x: 1520, y: 150 },
          { x: 1680, y: 150 },
          { x: 1680, y: 350 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.44
      }
    ],
    cameras: [
      {
        id: 'cam-l8-01',
        x: 820,
        y: 550,
        angle: 1.3,
        baseAngle: 1.3,
        sweepAngle: 1.4,
        sweepSpeed: 1.0,
        range: 350,
        fov: Math.PI * 0.4,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l8-02',
        x: 1380,
        y: 470,
        angle: 2.2,
        baseAngle: 2.2,
        sweepAngle: 1.3,
        sweepSpeed: 0.95,
        range: 350,
        fov: Math.PI * 0.4,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l8-03',
        x: 1280,
        y: 120,
        angle: 1.8,
        baseAngle: 1.8,
        sweepAngle: 1.2,
        sweepSpeed: 0.9,
        range: 330,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [
      {
        id: 'laser-l8-aisle',
        x1: 850,
        y1: 750,
        x2: 850,
        y2: 890,
        isActive: true,
        cycleInterval: 2800,
        cycleOffset: 0
      }
    ],
    terminals: [
      {
        id: 'term-l8-laser',
        x: 740,
        y: 710,
        type: 'OVERRIDE',
        name: 'LOCKDOWN LASER OVERRIDE',
        isHacked: false,
        disablesLaserId: 'laser-l8-aisle',
        description: 'Bypass emergency laser fence across central corridor.'
      },
      {
        id: 'term-l8-command',
        x: 1250,
        y: 560,
        type: 'CODE',
        name: 'COMMAND SPIRE CIPHER BUS',
        isHacked: false,
        unlocksDoorId: 'door-l8-command',
        description: 'Disengage emergency blast bulkhead protecting command suite.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // LEVEL 09 — GHOST PROTOCOL
  // -------------------------------------------------------------------------
  {
    id: 'op-09-ghost-protocol',
    actNumber: 3,
    actTitle: 'THE GHOST PROTOCOL',
    levelNumber: 9,
    environmentType: 'Secret underground corporate command center',
    sectorId: 'sector-08',
    sectorName: 'SECTOR 08 · THE BLACK VAULT',
    operationCode: 'OP // 09',
    title: 'GHOST PROTOCOL',
    facilityName: 'PROJECT GHOST ZERO-POINT COMMAND',
    targetName: 'THE GHOST PROTOCOL MASTER CORE',
    difficulty: 'NIGHTMARE',
    basePayout: 150000,
    risk: 'EXTREME',
    securityRating: 10.0,
    briefing: 'The finale. Deep beneath the tectonic bedrock lies Project Ghost Zero-Point Command. Every system you have encountered is active: multi-layer laser grids, mil-spec guards with overlapping sectors, biometric quantum locks, and total surveillance. Infiltrate, crack the Master Core, discover the truth of your own identity, and disappear.',
    secondaryObjectives: [
      'Maintain ghost stealth rating throughout the operation',
      'Neutralize zero mil-spec guards',
      'Crack all 3 quantum encryption firewalls'
    ],
    recommendedEquipment: [
      'OPTICAL CLOAK',
      'NEURAL DECODER',
      'REMOTE ACCESS DEVICE'
    ],
    entryRoutes: [
      'Vector Alpha: Sub-aquatic turbine intake',
      'Vector Bravo: Geothermal heat sink riser'
    ],
    unlockReward: 'CAMPAIGN COMPLETION & ELITE REPLAY MODIFIERS',
    estimatedDuration: '07:30',
    intel: {
      guards: 6,
      cameras: 3,
      drones: 0,
      securityTier: 'TIER 5 ZERO-POINT BLACK OPERATIVES'
    },
    mapWidth: 1800,
    mapHeight: 1100,
    playerStart: { x: 120, y: 920 },
    vault: {
      x: 1550,
      y: 200,
      width: 150,
      height: 150,
      targetName: 'THE GHOST PROTOCOL MASTER CORE',
      isCracked: false,
      securityLayers: 3
    },
    extraction: {
      x: 160,
      y: 180,
      radius: 85,
      name: 'SUB-AQUATIC AERODYNE DOCK'
    },
    lights: [
      { id: 'l9-intake', x: 200, y: 920, radius: 210, isOn: true, color: '#fef08a' },
      { id: 'l9-hall-alpha', x: 700, y: 800, radius: 260, isOn: true, color: '#38bdf8' },
      { id: 'l9-hall-beta', x: 1180, y: 800, radius: 260, isOn: true, color: '#a855f7' },
      { id: 'l9-core', x: 1560, y: 260, radius: 250, isOn: true, color: '#22d3ee' },
      { id: 'l9-extract', x: 160, y: 180, radius: 210, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-l9-breaker',
        x: 480,
        y: 720,
        width: 32,
        height: 32,
        type: 'CIRCUIT_BREAKER',
        name: 'GEOTHERMAL PRIMARY BREAKER',
        isInteracted: false,
        targetId: 'l9-hall-alpha'
      },
      {
        id: 'env-l9-vent',
        x: 1300,
        y: 480,
        width: 32,
        height: 32,
        type: 'MAINTENANCE_VENT',
        name: 'CRYOGENIC CORE CONDUIT',
        isInteracted: false,
        targetId: 'door-l9-core'
      }
    ],
    walls: [
      // Outer
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 1050, type: 'SOLID' },
      { x1: 1750, y1: 1050, x2: 50, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 1050, x2: 50, y2: 50, type: 'SOLID' },

      // Infiltration intake
      { x1: 280, y1: 750, x2: 280, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 750, x2: 180, y2: 750, type: 'SOLID' },

      // Perimeter Hall Alpha
      { x1: 280, y1: 750, x2: 780, y2: 750, type: 'SOLID' },
      { x1: 880, y1: 750, x2: 1400, y2: 750, type: 'SOLID' },

      // Zero-Point Central Partition
      { x1: 820, y1: 520, x2: 820, y2: 750, type: 'SOLID' },
      { x1: 820, y1: 520, x2: 1400, y2: 520, type: 'SOLID' },
      { x1: 1400, y1: 520, x2: 1400, y2: 700, type: 'SOLID' },
      { x1: 1400, y1: 700, x2: 1400, y2: 800, type: 'DOOR', doorId: 'door-l9-alpha', isOpen: false },
      { x1: 1400, y1: 800, x2: 1400, y2: 1050, type: 'SOLID' },

      // Master Core Vault Room (top right)
      { x1: 1300, y1: 100, x2: 1750, y2: 100, type: 'SOLID' },
      { x1: 1300, y1: 100, x2: 1300, y2: 440, type: 'SOLID' },
      { x1: 1300, y1: 440, x2: 1480, y2: 440, type: 'SOLID' },
      { x1: 1480, y1: 440, x2: 1560, y2: 440, type: 'DOOR', doorId: 'door-l9-core', isOpen: false },
      { x1: 1560, y1: 440, x2: 1750, y2: 440, type: 'SOLID' },

      // North Aerodyne extraction wing
      { x1: 50, y1: 440, x2: 1300, y2: 440, type: 'SOLID' },
      { x1: 340, y1: 50, x2: 340, y2: 440, type: 'SOLID' },
      { x1: 220, y1: 440, x2: 340, y2: 440, type: 'DOOR', doorId: 'door-l9-dock', isOpen: true }
    ],
    guards: [
      {
        id: 'g9-01',
        x: 520,
        y: 860,
        angle: 0,
        speed: 1.35,
        state: 'PATROL',
        patrolPath: [
          { x: 350, y: 860 },
          { x: 750, y: 860 },
          { x: 750, y: 980 },
          { x: 350, y: 980 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.46
      },
      {
        id: 'g9-02',
        x: 1080,
        y: 860,
        angle: -Math.PI * 0.5,
        speed: 1.4,
        state: 'PATROL',
        patrolPath: [
          { x: 1080, y: 980 },
          { x: 1080, y: 680 },
          { x: 1320, y: 680 },
          { x: 1320, y: 980 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.46
      },
      {
        id: 'g9-03',
        x: 1560,
        y: 740,
        angle: Math.PI,
        speed: 1.35,
        state: 'PATROL',
        patrolPath: [
          { x: 1560, y: 740 },
          { x: 1420, y: 740 },
          { x: 1420, y: 960 },
          { x: 1680, y: 960 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.46
      },
      {
        id: 'g9-04',
        x: 1050,
        y: 350,
        angle: 0,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 880, y: 350 },
          { x: 1240, y: 350 },
          { x: 1240, y: 420 },
          { x: 880, y: 420 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.44
      },
      {
        id: 'g9-05',
        x: 1500,
        y: 340,
        angle: -Math.PI * 0.5,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 1500, y: 340 },
          { x: 1500, y: 150 },
          { x: 1680, y: 150 },
          { x: 1680, y: 340 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.44
      },
      {
        id: 'g9-06',
        x: 600,
        y: 300,
        angle: 0,
        speed: 1.25,
        state: 'PATROL',
        patrolPath: [
          { x: 420, y: 300 },
          { x: 780, y: 300 },
          { x: 780, y: 380 },
          { x: 420, y: 380 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.42
      }
    ],
    cameras: [
      {
        id: 'cam-l9-01',
        x: 800,
        y: 550,
        angle: 1.3,
        baseAngle: 1.3,
        sweepAngle: 1.4,
        sweepSpeed: 1.05,
        range: 360,
        fov: Math.PI * 0.42,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l9-02',
        x: 1380,
        y: 470,
        angle: 2.2,
        baseAngle: 2.2,
        sweepAngle: 1.4,
        sweepSpeed: 1.05,
        range: 360,
        fov: Math.PI * 0.42,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-l9-03',
        x: 1280,
        y: 120,
        angle: 1.8,
        baseAngle: 1.8,
        sweepAngle: 1.3,
        sweepSpeed: 1.0,
        range: 340,
        fov: Math.PI * 0.4,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [
      {
        id: 'laser-l9-core',
        x1: 820,
        y1: 750,
        x2: 820,
        y2: 890,
        isActive: true,
        cycleInterval: 2600,
        cycleOffset: 0
      }
    ],
    terminals: [
      {
        id: 'term-l9-laser',
        x: 720,
        y: 710,
        type: 'OVERRIDE',
        name: 'FIREWALL ZERO LASER BUS',
        isHacked: false,
        disablesLaserId: 'laser-l9-core',
        description: 'Bypass quantum laser barrier across Zero-Point corridor.'
      },
      {
        id: 'term-l9-core',
        x: 1240,
        y: 560,
        type: 'CODE',
        name: 'MASTER PROTOCOL CIPHER MATRIX',
        isHacked: false,
        unlocksDoorId: 'door-l9-core',
        description: 'Disengage quantum isolation seal guarding the Master Core.'
      }
    ]
  }
];
