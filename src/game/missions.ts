import { Mission } from '../types/game';

export const MISSIONS: Mission[] = [
  {
    id: 'op-00-operation-zero',
    sectorId: 'sector-00',
    sectorName: 'SECTOR 00 · UNDERGROUND SAFEHOUSE',
    operationCode: 'OPERATION ZERO',
    title: 'FIRST GHOST',
    facilityName: 'NEXUS COLD STORAGE FACILITY',
    targetName: 'NEURAL ENCRYPTION PROTOTYPE',
    difficulty: 'RECRUIT',
    basePayout: 20000,
    risk: 'LOW',
    securityRating: 2.0,
    briefing: 'A subterranean live-fire test arranged by Vera. Infiltrate the decommissioned Nexus facility, bypass maintenance checkpoints, avoid detection by local patrols, and secure the prototype telemetry drive.',
    secondaryObjectives: [
      'Complete without triggering facility alarms',
      'Neutralize zero guards (Ghost standard)',
      'Locate and decrypt all security nodes'
    ],
    recommendedEquipment: [
      'ACOUSTIC DISTRACTOR',
      'NEURAL SCANNER',
      'SILENT SOLES'
    ],
    intel: {
      guards: 2,
      cameras: 1,
      drones: 0,
      securityTier: 'DECOMMISSIONED FACILITY'
    },
    isTutorial: true,
    mapWidth: 1800,
    mapHeight: 1000,
    playerStart: { x: 120, y: 820 },
    vault: {
      x: 1550,
      y: 280,
      width: 130,
      height: 130,
      targetName: 'NEURAL ENCRYPTION PROTOTYPE',
      isCracked: false,
      securityLayers: 2
    },
    extraction: {
      x: 160,
      y: 220,
      radius: 75,
      name: 'ROOFTOP EXTRACTION AERODYNE'
    },
    lights: [
      { id: 'light-safehouse', x: 180, y: 820, radius: 180, isOn: true, color: '#fef08a' },
      { id: 'light-patrol-room', x: 800, y: 750, radius: 220, isOn: true, color: '#e2e8f0' },
      { id: 'light-cam-corridor', x: 1200, y: 750, radius: 200, isOn: true, color: '#e2e8f0' },
      { id: 'light-switch-room', x: 1520, y: 750, radius: 220, isOn: true, color: '#fbbf24' },
      { id: 'light-vault', x: 1610, y: 340, radius: 190, isOn: true, color: '#38bdf8' },
      { id: 'light-rooftop', x: 160, y: 220, radius: 200, isOn: true, color: '#22d3ee' }
    ],
    envObjects: [
      {
        id: 'env-light-switch',
        x: 1400,
        y: 690,
        width: 24,
        height: 24,
        type: 'LIGHT_SWITCH',
        name: 'ROOM 4 MAIN LIGHT SWITCH',
        isInteracted: false,
        targetId: 'light-switch-room'
      },
      {
        id: 'env-vent-escape',
        x: 1350,
        y: 280,
        width: 32,
        height: 32,
        type: 'MAINTENANCE_VENT',
        name: 'ROOFTOP VENT CONDUIT',
        isInteracted: false,
        targetId: 'vent-escape-door'
      }
    ],
    walls: [
      // Outer boundaries
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 950, type: 'SOLID' },
      { x1: 1750, y1: 950, x2: 50, y2: 950, type: 'SOLID' },
      { x1: 50, y1: 950, x2: 50, y2: 50, type: 'SOLID' },

      // Room 1 (Safehouse) Partition
      { x1: 280, y1: 700, x2: 280, y2: 950, type: 'SOLID' },
      { x1: 50, y1: 700, x2: 280, y2: 700, type: 'SOLID' },

      // Low Duct obstacle between safehouse and patrol corridor
      { x1: 280, y1: 700, x2: 450, y2: 700, type: 'SOLID' },
      { x1: 280, y1: 880, x2: 550, y2: 880, type: 'SOLID' },
      { x1: 450, y1: 700, x2: 550, y2: 700, type: 'SOLID' },

      // Shadow Chamber & Patrol room
      { x1: 550, y1: 650, x2: 980, y2: 650, type: 'SOLID' },
      { x1: 550, y1: 650, x2: 550, y2: 880, type: 'SOLID' },
      { x1: 980, y1: 650, x2: 980, y2: 730, type: 'SOLID' },
      { x1: 980, y1: 730, x2: 980, y2: 830, type: 'DOOR', doorId: 'tutorial-door-01', isOpen: false },
      { x1: 980, y1: 830, x2: 980, y2: 950, type: 'SOLID' },

      // Camera corridor
      { x1: 980, y1: 650, x2: 1380, y2: 650, type: 'SOLID' },
      { x1: 1380, y1: 650, x2: 1380, y2: 740, type: 'SOLID' },
      { x1: 1380, y1: 820, x2: 1380, y2: 950, type: 'SOLID' }, // Door gap 740-820

      // Distraction room to Vault stairwell
      { x1: 1380, y1: 450, x2: 1750, y2: 450, type: 'SOLID' },
      { x1: 1480, y1: 450, x2: 1480, y2: 200, type: 'SOLID' },
      { x1: 1480, y1: 200, x2: 1750, y2: 200, type: 'SOLID' },

      // Upper floor / Escape rooftop partition
      { x1: 50, y1: 450, x2: 1380, y2: 450, type: 'SOLID' },
      { x1: 350, y1: 50, x2: 350, y2: 450, type: 'SOLID' },
      { x1: 250, y1: 450, x2: 350, y2: 450, type: 'DOOR', doorId: 'vent-escape-door', isOpen: false }
    ],
    guards: [
      {
        id: 'tut-guard-01',
        x: 820,
        y: 780,
        angle: 0,
        speed: 1.0,
        state: 'PATROL',
        patrolPath: [
          { x: 680, y: 780 },
          { x: 920, y: 780 },
          { x: 920, y: 880 },
          { x: 680, y: 880 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 260,
        fov: Math.PI * 0.4
      },
      {
        id: 'tut-guard-02',
        x: 1560,
        y: 800,
        angle: -Math.PI * 0.5,
        speed: 1.1,
        state: 'PATROL',
        patrolPath: [
          { x: 1560, y: 820 },
          { x: 1560, y: 680 },
          { x: 1680, y: 680 },
          { x: 1680, y: 820 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 270,
        fov: Math.PI * 0.42
      }
    ],
    cameras: [
      {
        id: 'tut-cam-01',
        x: 1020,
        y: 670,
        angle: 0.8,
        baseAngle: 0.8,
        sweepAngle: 1.1,
        sweepSpeed: 0.7,
        range: 300,
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
        id: 'term-tut-door',
        x: 930,
        y: 700,
        type: 'SIGNAL',
        name: 'SECURITY CHECKPOINT BUS',
        isHacked: false,
        unlocksDoorId: 'tutorial-door-01',
        description: 'Rotate waveguide nodes to disengage physical magnetic seal.'
      },
      {
        id: 'term-tut-cam',
        x: 1220,
        y: 680,
        type: 'CODE',
        name: 'AURORA-7 CAMERA INTERFACE',
        isHacked: false,
        disablesCameraId: 'tut-cam-01',
        description: 'Bypass optic bus buffer to disable or loop surveillance sweep.'
      }
    ]
  },
  {
    id: 'op-01-silent-entry',
    sectorId: 'sector-01',
    sectorName: 'SECTOR 01 · FINANCIAL DISTRICT',
    operationCode: 'OPERATION 01',
    title: 'SILENT ENTRY',
    facilityName: 'AURELION DATA TOWER',
    targetName: 'NEURAL ENCRYPTION KEY',
    difficulty: 'RECRUIT',
    basePayout: 25000,
    risk: 'LOW',
    securityRating: 3.5,
    briefing: 'Aurelion Corporation has completed development of a prototype quantum-proof neural key. Infiltrate their 42nd-floor data sanctum, bypass perimeter lasers, disable the local surveillance hub, and extract the key without alerting corporate security.',
    secondaryObjectives: [
      'Disable central surveillance terminal',
      'Do not trigger any security alarms',
      'Neutralize zero guards (Ghost standard)'
    ],
    recommendedEquipment: [
      'OPTICAL CLOAK',
      'NEURAL DECODER',
      'SILENT BOOTS'
    ],
    intel: {
      guards: 2,
      cameras: 2,
      drones: 0,
      securityTier: 'TIER 2 PRIVATE SECURITY'
    },
    mapWidth: 1600,
    mapHeight: 1100,
    playerStart: { x: 120, y: 920 },
    vault: {
      x: 1380,
      y: 240,
      width: 140,
      height: 140,
      targetName: 'NEURAL ENCRYPTION KEY',
      isCracked: false,
      securityLayers: 2
    },
    extraction: {
      x: 120,
      y: 920,
      radius: 70,
      name: 'WEST HELIPAD SKYDUCT'
    },
    walls: [
      // Outer boundaries
      { x1: 50, y1: 50, x2: 1550, y2: 50, type: 'SOLID' },
      { x1: 1550, y1: 50, x2: 1550, y2: 1050, type: 'SOLID' },
      { x1: 1550, y1: 1050, x2: 50, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 1050, x2: 50, y2: 50, type: 'SOLID' },

      // Entrance corridor
      { x1: 250, y1: 750, x2: 250, y2: 1050, type: 'SOLID' },
      { x1: 50, y1: 750, x2: 200, y2: 750, type: 'SOLID' }, // Door gap at 200-250

      // Main hallway lower wall
      { x1: 250, y1: 750, x2: 750, y2: 750, type: 'SOLID' },
      { x1: 850, y1: 750, x2: 1550, y2: 750, type: 'SOLID' },

      // Security Office Room (left middle)
      { x1: 250, y1: 400, x2: 700, y2: 400, type: 'SOLID' },
      { x1: 700, y1: 400, x2: 700, y2: 750, type: 'SOLID' },
      { x1: 250, y1: 400, x2: 250, y2: 650, type: 'SOLID' }, // Door gap 650-750

      // Server Farm Room (center)
      { x1: 780, y1: 200, x2: 1200, y2: 200, type: 'SOLID' },
      { x1: 780, y1: 200, x2: 780, y2: 550, type: 'SOLID' },
      { x1: 1200, y1: 200, x2: 1200, y2: 550, type: 'SOLID' },
      { x1: 780, y1: 550, x2: 950, y2: 550, type: 'SOLID' },
      { x1: 1050, y1: 550, x2: 1200, y2: 550, type: 'SOLID' }, // Door gap 950-1050

      // Vault Room (top right)
      { x1: 1280, y1: 100, x2: 1550, y2: 100, type: 'SOLID' },
      { x1: 1280, y1: 100, x2: 1280, y2: 450, type: 'SOLID' },
      { x1: 1280, y1: 450, x2: 1420, y2: 450, type: 'SOLID' },
      { x1: 1420, y1: 450, x2: 1500, y2: 450, type: 'DOOR', doorId: 'vault-outer-door', isOpen: false },
      { x1: 1500, y1: 450, x2: 1550, y2: 450, type: 'SOLID' },

      // Server pillars (interior cover)
      { x1: 880, y1: 300, x2: 940, y2: 300, type: 'SOLID' },
      { x1: 940, y1: 300, x2: 940, y2: 450, type: 'SOLID' },
      { x1: 940, y1: 450, x2: 880, y2: 450, type: 'SOLID' },
      { x1: 880, y1: 450, x2: 880, y2: 300, type: 'SOLID' },

      { x1: 1040, y1: 300, x2: 1100, y2: 300, type: 'SOLID' },
      { x1: 1100, y1: 300, x2: 1100, y2: 450, type: 'SOLID' },
      { x1: 1100, y1: 450, x2: 1040, y2: 450, type: 'SOLID' },
      { x1: 1040, y1: 450, x2: 1040, y2: 300, type: 'SOLID' },
    ],
    guards: [
      {
        id: 'guard-01',
        x: 480,
        y: 850,
        angle: 0,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 320, y: 850 },
          { x: 800, y: 850 },
          { x: 1200, y: 850 },
          { x: 800, y: 850 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 280,
        fov: Math.PI * 0.45
      },
      {
        id: 'guard-02',
        x: 1000,
        y: 650,
        angle: Math.PI * 0.5,
        speed: 1.1,
        state: 'PATROL',
        patrolPath: [
          { x: 1000, y: 650 },
          { x: 1350, y: 650 },
          { x: 1350, y: 350 },
          { x: 1000, y: 650 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 270,
        fov: Math.PI * 0.42
      }
    ],
    cameras: [
      {
        id: 'cam-01',
        x: 260,
        y: 760,
        angle: 0.3,
        baseAngle: 0.3,
        sweepAngle: 1.0,
        sweepSpeed: 0.8,
        range: 300,
        fov: Math.PI * 0.35,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'cam-02',
        x: 1270,
        y: 460,
        angle: -1.8,
        baseAngle: -1.8,
        sweepAngle: 0.9,
        sweepSpeed: 0.7,
        range: 320,
        fov: Math.PI * 0.35,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [],
    lasers: [
      {
        id: 'laser-01',
        x1: 750,
        y1: 750,
        x2: 850,
        y2: 750,
        isActive: true,
        cycleInterval: 4000,
        cycleOffset: 0,
        isHacked: false
      }
    ],
    terminals: [
      {
        id: 'term-security-01',
        x: 350,
        y: 450,
        type: 'SIGNAL',
        name: 'CENTRAL SURVEILLANCE OVERRIDE',
        isHacked: false,
        disablesCameraId: 'cam-01',
        description: 'Align optical frequency to disable entrance surveillance feed.'
      },
      {
        id: 'term-laser-breaker',
        x: 850,
        y: 250,
        type: 'CODE',
        name: 'CORRIDOR POWER GRID',
        isHacked: false,
        disablesLaserId: 'laser-01',
        description: 'Bypass breaker code sequence to deactivate hallway laser matrix.'
      },
      {
        id: 'term-vault-access',
        x: 1350,
        y: 500,
        type: 'NETWORK',
        name: 'VAULT SANCTUM ACCESS',
        isHacked: false,
        unlocksDoorId: 'vault-outer-door',
        description: 'Decrypt node architecture to release magnetic security lock on the vault.'
      }
    ]
  },
  {
    id: 'op-02-cold-cipher',
    sectorId: 'sector-02',
    sectorName: 'SECTOR 02 · CORPORATE ZONE',
    operationCode: 'OPERATION 02',
    title: 'COLD CIPHER',
    facilityName: 'ORION DYNAMICS',
    targetName: 'QUANTUM ACCESS KEY',
    difficulty: 'OPERATIVE',
    basePayout: 42000,
    risk: 'HIGH',
    securityRating: 8.4,
    briefing: 'Extract the Quantum Access Key from Orion Dynamics executive research vault. The facility is equipped with synchronized sweeping CCTV sensors, armed automated security guards, and bi-directional laser barriers. Infiltrate undetected.',
    secondaryObjectives: [
      'Disable central surveillance node',
      'Do not trigger facility lockdown',
      'Extract without casualties or trace'
    ],
    recommendedEquipment: [
      'OPTICAL CLOAK',
      'EMP PULSE',
      'REMOTE ACCESS DEVICE',
      'DECIBEL DAMPENER'
    ],
    intel: {
      guards: 4,
      cameras: 3,
      drones: 1,
      securityTier: 'TIER 3 CORPORATE DEFENSE'
    },
    mapWidth: 1800,
    mapHeight: 1200,
    playerStart: { x: 120, y: 1050 },
    vault: {
      x: 1600,
      y: 200,
      width: 150,
      height: 150,
      targetName: 'QUANTUM ACCESS KEY',
      isCracked: false,
      securityLayers: 3
    },
    extraction: {
      x: 120,
      y: 1050,
      radius: 80,
      name: 'VENTILATION ROOF EXHAUST'
    },
    walls: [
      // Outer
      { x1: 50, y1: 50, x2: 1750, y2: 50, type: 'SOLID' },
      { x1: 1750, y1: 50, x2: 1750, y2: 1150, type: 'SOLID' },
      { x1: 1750, y1: 1150, x2: 50, y2: 1150, type: 'SOLID' },
      { x1: 50, y1: 1150, x2: 50, y2: 50, type: 'SOLID' },

      // Ingress corridor
      { x1: 250, y1: 850, x2: 250, y2: 1150, type: 'SOLID' },
      { x1: 250, y1: 850, x2: 600, y2: 850, type: 'SOLID' },
      { x1: 700, y1: 850, x2: 1150, y2: 850, type: 'SOLID' },

      // Main lab wall
      { x1: 450, y1: 450, x2: 450, y2: 850, type: 'SOLID' },
      { x1: 450, y1: 450, x2: 1000, y2: 450, type: 'SOLID' },

      // Camera control room (lower right)
      { x1: 1150, y1: 700, x2: 1650, y2: 700, type: 'SOLID' },
      { x1: 1150, y1: 700, x2: 1150, y2: 1150, type: 'SOLID' },
      { x1: 1350, y1: 700, x2: 1450, y2: 700, type: 'DOOR', doorId: 'cam-room-door', isOpen: false },

      // Cryo storage center
      { x1: 650, y1: 150, x2: 1250, y2: 150, type: 'SOLID' },
      { x1: 650, y1: 150, x2: 650, y2: 400, type: 'SOLID' },
      { x1: 1250, y1: 150, x2: 1250, y2: 400, type: 'SOLID' },

      // Vault inner walls
      { x1: 1450, y1: 50, x2: 1450, y2: 400, type: 'SOLID' },
      { x1: 1450, y1: 400, x2: 1620, y2: 400, type: 'SOLID' },
      { x1: 1620, y1: 400, x2: 1700, y2: 400, type: 'DOOR', doorId: 'orion-vault-gate', isOpen: false },
      { x1: 1700, y1: 400, x2: 1750, y2: 400, type: 'SOLID' },

      // Lab central consoles / pillars
      { x1: 750, y1: 600, x2: 850, y2: 600, type: 'SOLID' },
      { x1: 850, y1: 600, x2: 850, y2: 720, type: 'SOLID' },
      { x1: 850, y1: 720, x2: 750, y2: 720, type: 'SOLID' },
      { x1: 750, y1: 720, x2: 750, y2: 600, type: 'SOLID' },

      { x1: 950, y1: 220, x2: 1050, y2: 220, type: 'SOLID' },
      { x1: 1050, y1: 220, x2: 1050, y2: 320, type: 'SOLID' },
      { x1: 1050, y1: 320, x2: 950, y2: 320, type: 'SOLID' },
      { x1: 950, y1: 320, x2: 950, y2: 220, type: 'SOLID' }
    ],
    guards: [
      {
        id: 'orion-g1',
        x: 400,
        y: 950,
        angle: 0,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 300, y: 950 },
          { x: 750, y: 950 },
          { x: 750, y: 800 },
          { x: 300, y: 950 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 310,
        fov: Math.PI * 0.44
      },
      {
        id: 'orion-g2',
        x: 900,
        y: 500,
        angle: Math.PI * 0.5,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 900, y: 500 },
          { x: 1350, y: 500 },
          { x: 1350, y: 300 },
          { x: 900, y: 300 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 300,
        fov: Math.PI * 0.45
      },
      {
        id: 'orion-g3',
        x: 1300,
        y: 900,
        angle: Math.PI,
        speed: 1.2,
        state: 'PATROL',
        patrolPath: [
          { x: 1200, y: 900 },
          { x: 1600, y: 900 },
          { x: 1600, y: 1050 },
          { x: 1200, y: 1050 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.45
      },
      {
        id: 'orion-g4',
        x: 1550,
        y: 480,
        angle: -Math.PI * 0.5,
        speed: 1.0,
        state: 'PATROL',
        patrolPath: [
          { x: 1550, y: 550 },
          { x: 1700, y: 550 },
          { x: 1550, y: 480 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 330,
        fov: Math.PI * 0.4
      }
    ],
    cameras: [
      {
        id: 'orion-cam-01',
        x: 260,
        y: 860,
        angle: 0.5,
        baseAngle: 0.5,
        sweepAngle: 1.1,
        sweepSpeed: 0.7,
        range: 330,
        fov: Math.PI * 0.36,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'orion-cam-02',
        x: 1020,
        y: 460,
        angle: 1.9,
        baseAngle: 1.9,
        sweepAngle: 1.2,
        sweepSpeed: 0.65,
        range: 350,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'orion-cam-03',
        x: 1460,
        y: 390,
        angle: -2.3,
        baseAngle: -2.3,
        sweepAngle: 0.8,
        sweepSpeed: 0.9,
        range: 340,
        fov: Math.PI * 0.35,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [
      {
        id: 'drone-orion-01',
        x: 1100,
        y: 250,
        angle: 0,
        speed: 1.6,
        patrolPath: [
          { x: 750, y: 250 },
          { x: 1200, y: 250 },
          { x: 1200, y: 350 },
          { x: 750, y: 350 }
        ],
        currentPathIndex: 0,
        range: 220,
        isHacked: false
      }
    ],
    lasers: [
      {
        id: 'laser-orion-01',
        x1: 600,
        y1: 850,
        x2: 700,
        y2: 850,
        isActive: true,
        cycleInterval: 3500,
        cycleOffset: 500,
        isHacked: false
      },
      {
        id: 'laser-orion-02',
        x1: 1450,
        y1: 250,
        x2: 1450,
        y2: 380,
        isActive: true,
        cycleInterval: 4500,
        cycleOffset: 0,
        isHacked: false
      }
    ],
    terminals: [
      {
        id: 'term-orion-sec',
        x: 1250,
        y: 800,
        type: 'SIGNAL',
        name: 'SECURITY DESK HUB',
        isHacked: false,
        disablesCameraId: 'orion-cam-01',
        description: 'Synchronize optical frequency to isolate surveillance node 01.'
      },
      {
        id: 'term-orion-bypass',
        x: 550,
        y: 500,
        type: 'OVERRIDE',
        name: 'POWER DISTRIBUTION MATRIX',
        isHacked: false,
        disablesLaserId: 'laser-orion-01',
        description: 'Balance transformer frequency to trip laser perimeter breaker.'
      },
      {
        id: 'term-orion-vault',
        x: 1380,
        y: 350,
        type: 'CODE',
        name: 'CRYO VAULT LOCK REGISTRY',
        isHacked: false,
        unlocksDoorId: 'orion-vault-gate',
        disablesLaserId: 'laser-orion-02',
        description: 'Bypass cryogenic lock registers to open primary vault blast doors.'
      }
    ]
  },
  {
    id: 'op-03-apex-protocol',
    sectorId: 'sector-03',
    sectorName: 'SECTOR 03 · INDUSTRIAL CORE',
    operationCode: 'OPERATION 03',
    title: 'APEX PROTOCOL',
    facilityName: 'KUROSHIO ORBITAL CITADEL',
    targetName: 'SOVEREIGN AI CORE',
    difficulty: 'GHOST',
    basePayout: 68000,
    risk: 'HIGH',
    securityRating: 9.1,
    briefing: 'Kuroshio Heavy Industries is secretly training an untethered sovereign military AI. Extraction must occur before their scheduled memory wipe in 15 minutes. Heavy drone patrol coverage, triple-locked neural server chamber, and biometric laser walls.',
    secondaryObjectives: [
      'Disable both patrol drones with EMP or terminal override',
      'Maintain undetected signature status throughout',
      'Zero alarms triggered'
    ],
    recommendedEquipment: [
      'OPTICAL CLOAK',
      'EMP PULSE',
      'SIGNAL JAMMER',
      'LOCK DECODER'
    ],
    intel: {
      guards: 5,
      cameras: 4,
      drones: 2,
      securityTier: 'MIL-SPEC CITADEL PROTOCOL'
    },
    mapWidth: 2000,
    mapHeight: 1300,
    playerStart: { x: 120, y: 1100 },
    vault: {
      x: 1800,
      y: 200,
      width: 160,
      height: 160,
      targetName: 'SOVEREIGN AI CORE',
      isCracked: false,
      securityLayers: 4
    },
    extraction: {
      x: 120,
      y: 1100,
      radius: 90,
      name: 'UNDERGROUND FREIGHT CONDUIT'
    },
    walls: [
      { x1: 50, y1: 50, x2: 1950, y2: 50, type: 'SOLID' },
      { x1: 1950, y1: 50, x2: 1950, y2: 1250, type: 'SOLID' },
      { x1: 1950, y1: 1250, x2: 50, y2: 1250, type: 'SOLID' },
      { x1: 50, y1: 1250, x2: 50, y2: 50, type: 'SOLID' },

      // Perimeter wall
      { x1: 300, y1: 900, x2: 300, y2: 1250, type: 'SOLID' },
      { x1: 300, y1: 900, x2: 800, y2: 900, type: 'SOLID' },
      { x1: 900, y1: 900, x2: 1600, y2: 900, type: 'SOLID' },

      // Factory bay divider
      { x1: 550, y1: 450, x2: 550, y2: 900, type: 'SOLID' },
      { x1: 550, y1: 450, x2: 1100, y2: 450, type: 'SOLID' },
      { x1: 1200, y1: 450, x2: 1650, y2: 450, type: 'SOLID' },

      // Vault high-security bunker
      { x1: 1650, y1: 50, x2: 1650, y2: 450, type: 'SOLID' },
      { x1: 1650, y1: 450, x2: 1780, y2: 450, type: 'SOLID' },
      { x1: 1780, y1: 450, x2: 1880, y2: 450, type: 'DOOR', doorId: 'kuroshio-core-gate', isOpen: false },
      { x1: 1880, y1: 450, x2: 1950, y2: 450, type: 'SOLID' },

      // Central server arrays
      { x1: 750, y1: 600, x2: 900, y2: 600, type: 'SOLID' },
      { x1: 900, y1: 600, x2: 900, y2: 750, type: 'SOLID' },
      { x1: 900, y1: 750, x2: 750, y2: 750, type: 'SOLID' },
      { x1: 750, y1: 750, x2: 750, y2: 600, type: 'SOLID' },

      { x1: 1150, y1: 600, x2: 1300, y2: 600, type: 'SOLID' },
      { x1: 1300, y1: 600, x2: 1300, y2: 750, type: 'SOLID' },
      { x1: 1300, y1: 750, x2: 1150, y2: 750, type: 'SOLID' },
      { x1: 1150, y1: 750, x2: 1150, y2: 600, type: 'SOLID' },

      { x1: 1000, y1: 150, x2: 1200, y2: 150, type: 'SOLID' },
      { x1: 1200, y1: 150, x2: 1200, y2: 320, type: 'SOLID' },
      { x1: 1200, y1: 320, x2: 1000, y2: 320, type: 'SOLID' },
      { x1: 1000, y1: 320, x2: 1000, y2: 150, type: 'SOLID' }
    ],
    guards: [
      {
        id: 'k-g1',
        x: 450,
        y: 1050,
        angle: 0,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 380, y: 1050 },
          { x: 820, y: 1050 },
          { x: 820, y: 950 },
          { x: 380, y: 1050 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.45
      },
      {
        id: 'k-g2',
        x: 1000,
        y: 800,
        angle: 1.5,
        speed: 1.25,
        state: 'PATROL',
        patrolPath: [
          { x: 1000, y: 800 },
          { x: 1500, y: 800 },
          { x: 1500, y: 550 },
          { x: 1000, y: 550 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.45
      },
      {
        id: 'k-g3',
        x: 750,
        y: 350,
        angle: 0,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 650, y: 350 },
          { x: 950, y: 350 },
          { x: 950, y: 200 },
          { x: 650, y: 200 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 330,
        fov: Math.PI * 0.45
      },
      {
        id: 'k-g4',
        x: 1400,
        y: 350,
        angle: -1.2,
        speed: 1.35,
        state: 'PATROL',
        patrolPath: [
          { x: 1350, y: 350 },
          { x: 1600, y: 350 },
          { x: 1600, y: 150 },
          { x: 1350, y: 150 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 330,
        fov: Math.PI * 0.45
      },
      {
        id: 'k-g5',
        x: 1750,
        y: 550,
        angle: -Math.PI * 0.5,
        speed: 1.0,
        state: 'PATROL',
        patrolPath: [
          { x: 1720, y: 550 },
          { x: 1900, y: 550 },
          { x: 1720, y: 550 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 340,
        fov: Math.PI * 0.4
      }
    ],
    cameras: [
      {
        id: 'k-cam-01',
        x: 310,
        y: 910,
        angle: 0.6,
        baseAngle: 0.6,
        sweepAngle: 1.2,
        sweepSpeed: 0.75,
        range: 350,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'k-cam-02',
        x: 1190,
        y: 460,
        angle: 2.1,
        baseAngle: 2.1,
        sweepAngle: 1.0,
        sweepSpeed: 0.8,
        range: 360,
        fov: Math.PI * 0.36,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'k-cam-03',
        x: 1660,
        y: 440,
        angle: -2.4,
        baseAngle: -2.4,
        sweepAngle: 0.9,
        sweepSpeed: 0.85,
        range: 360,
        fov: Math.PI * 0.35,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'k-cam-04',
        x: 1640,
        y: 100,
        angle: 2.8,
        baseAngle: 2.8,
        sweepAngle: 0.8,
        sweepSpeed: 0.7,
        range: 340,
        fov: Math.PI * 0.35,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [
      {
        id: 'drone-k-01',
        x: 700,
        y: 750,
        angle: 0,
        speed: 1.8,
        patrolPath: [
          { x: 600, y: 750 },
          { x: 1050, y: 750 },
          { x: 1050, y: 550 },
          { x: 600, y: 550 }
        ],
        currentPathIndex: 0,
        range: 240,
        isHacked: false
      },
      {
        id: 'drone-k-02',
        x: 1400,
        y: 250,
        angle: 1.0,
        speed: 1.9,
        patrolPath: [
          { x: 1300, y: 250 },
          { x: 1600, y: 250 },
          { x: 1600, y: 380 },
          { x: 1300, y: 380 }
        ],
        currentPathIndex: 0,
        range: 240,
        isHacked: false
      }
    ],
    lasers: [
      {
        id: 'laser-k-01',
        x1: 800,
        y1: 900,
        x2: 900,
        y2: 900,
        isActive: true,
        cycleInterval: 3000,
        cycleOffset: 0,
        isHacked: false
      },
      {
        id: 'laser-k-02',
        x1: 1100,
        y1: 450,
        x2: 1200,
        y2: 450,
        isActive: true,
        cycleInterval: 3500,
        cycleOffset: 1000,
        isHacked: false
      }
    ],
    terminals: [
      {
        id: 'term-k-substation',
        x: 400,
        y: 650,
        type: 'SIGNAL',
        name: 'GRID SUBSTATION A-4',
        isHacked: false,
        disablesLaserId: 'laser-k-01',
        description: 'Realign optic circuit lines to discharge perimeter laser 01.'
      },
      {
        id: 'term-k-network',
        x: 1050,
        y: 680,
        type: 'NETWORK',
        name: 'INTERNAL SURVEILLANCE ROUTER',
        isHacked: false,
        disablesCameraId: 'k-cam-02',
        description: 'Infiltrate network routing nodes to shut down central hallway camera.'
      },
      {
        id: 'term-k-core-auth',
        x: 1500,
        y: 200,
        type: 'CODE',
        name: 'AI CORE BIOMETRIC OVERRIDE',
        isHacked: false,
        unlocksDoorId: 'kuroshio-core-gate',
        disablesLaserId: 'laser-k-02',
        description: 'Bypass sovereign neural cryptography to release AI chamber blast door.'
      }
    ]
  },
  {
    id: 'op-04-ghost-protocol',
    sectorId: 'sector-05',
    sectorName: 'SECTOR 05 · BLACK DISTRICT',
    operationCode: 'OPERATION 04',
    title: 'GHOST PROTOCOL',
    facilityName: 'BLACK DISTRICT ARCHIVE',
    targetName: 'GHOSTNET BLACK BOX',
    difficulty: 'NIGHTMARE',
    basePayout: 95000,
    risk: 'EXTREME',
    securityRating: 9.8,
    briefing: 'Classified: Vera has pinpointed the repository holding the decommissioned black boxes of previous Ghost operatives. Director Kade has fortified the site with black-budget contractors and synchronized biometric tripwires. Extract the truth.',
    secondaryObjectives: [
      'Extract the Black Box without causing a single security alarm',
      'Zero casualties / zero guard engagements',
      'Complete extraction within 7 minutes'
    ],
    recommendedEquipment: [
      'OPTICAL CLOAK',
      'EMP PULSE',
      'SIGNAL JAMMER',
      'SILENT BOOTS'
    ],
    intel: {
      guards: 6,
      cameras: 4,
      drones: 2,
      securityTier: 'BLACK OPS COVERT COMPLEX'
    },
    mapWidth: 2100,
    mapHeight: 1400,
    playerStart: { x: 120, y: 1200 },
    vault: {
      x: 1900,
      y: 220,
      width: 160,
      height: 160,
      targetName: 'GHOSTNET BLACK BOX',
      isCracked: false,
      securityLayers: 4
    },
    extraction: {
      x: 120,
      y: 1200,
      radius: 90,
      name: 'DECOMMISSIONED SUBWAY VENT'
    },
    walls: [
      { x1: 50, y1: 50, x2: 2050, y2: 50, type: 'SOLID' },
      { x1: 2050, y1: 50, x2: 2050, y2: 1350, type: 'SOLID' },
      { x1: 2050, y1: 1350, x2: 50, y2: 1350, type: 'SOLID' },
      { x1: 50, y1: 1350, x2: 50, y2: 50, type: 'SOLID' },

      // Checkpoint 1
      { x1: 350, y1: 950, x2: 350, y2: 1350, type: 'SOLID' },
      { x1: 350, y1: 950, x2: 850, y2: 950, type: 'SOLID' },
      { x1: 950, y1: 950, x2: 1700, y2: 950, type: 'SOLID' },

      // Bunker partition
      { x1: 600, y1: 500, x2: 600, y2: 950, type: 'SOLID' },
      { x1: 600, y1: 500, x2: 1200, y2: 500, type: 'SOLID' },
      { x1: 1300, y1: 500, x2: 1750, y2: 500, type: 'SOLID' },

      // Black Vault Chamber
      { x1: 1750, y1: 50, x2: 1750, y2: 500, type: 'SOLID' },
      { x1: 1750, y1: 500, x2: 1880, y2: 500, type: 'SOLID' },
      { x1: 1880, y1: 500, x2: 1980, y2: 500, type: 'DOOR', doorId: 'blackbox-vault-door', isOpen: false },
      { x1: 1980, y1: 500, x2: 2050, y2: 500, type: 'SOLID' },

      // Pillar clusters
      { x1: 850, y1: 650, x2: 1000, y2: 650, type: 'SOLID' },
      { x1: 1000, y1: 650, x2: 1000, y2: 800, type: 'SOLID' },
      { x1: 1000, y1: 800, x2: 850, y2: 800, type: 'SOLID' },
      { x1: 850, y1: 800, x2: 850, y2: 650, type: 'SOLID' },

      { x1: 1250, y1: 650, x2: 1400, y2: 650, type: 'SOLID' },
      { x1: 1400, y1: 650, x2: 1400, y2: 800, type: 'SOLID' },
      { x1: 1400, y1: 800, x2: 1250, y2: 800, type: 'SOLID' },
      { x1: 1250, y1: 800, x2: 1250, y2: 650, type: 'SOLID' },

      { x1: 1100, y1: 200, x2: 1350, y2: 200, type: 'SOLID' },
      { x1: 1350, y1: 200, x2: 1350, y2: 360, type: 'SOLID' },
      { x1: 1350, y1: 360, x2: 1100, y2: 360, type: 'SOLID' },
      { x1: 1100, y1: 360, x2: 1100, y2: 200, type: 'SOLID' }
    ],
    guards: [
      {
        id: 'bg-1',
        x: 500,
        y: 1150,
        angle: 0,
        speed: 1.35,
        state: 'PATROL',
        patrolPath: [
          { x: 420, y: 1150 },
          { x: 880, y: 1150 },
          { x: 880, y: 1020 },
          { x: 420, y: 1150 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 330,
        fov: Math.PI * 0.45
      },
      {
        id: 'bg-2',
        x: 1100,
        y: 880,
        angle: 1.5,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 1050, y: 880 },
          { x: 1600, y: 880 },
          { x: 1600, y: 600 },
          { x: 1050, y: 600 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 330,
        fov: Math.PI * 0.45
      },
      {
        id: 'bg-3',
        x: 800,
        y: 400,
        angle: 0,
        speed: 1.3,
        state: 'PATROL',
        patrolPath: [
          { x: 700, y: 400 },
          { x: 1050, y: 400 },
          { x: 1050, y: 220 },
          { x: 700, y: 220 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 340,
        fov: Math.PI * 0.45
      },
      {
        id: 'bg-4',
        x: 1550,
        y: 400,
        angle: -1.5,
        speed: 1.4,
        state: 'PATROL',
        patrolPath: [
          { x: 1450, y: 400 },
          { x: 1700, y: 400 },
          { x: 1700, y: 200 },
          { x: 1450, y: 200 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 340,
        fov: Math.PI * 0.45
      },
      {
        id: 'bg-5',
        x: 1850,
        y: 600,
        angle: -Math.PI * 0.5,
        speed: 1.1,
        state: 'PATROL',
        patrolPath: [
          { x: 1800, y: 600 },
          { x: 2000, y: 600 },
          { x: 1800, y: 600 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 350,
        fov: Math.PI * 0.42
      },
      {
        id: 'bg-6',
        x: 1450,
        y: 1100,
        angle: Math.PI,
        speed: 1.25,
        state: 'PATROL',
        patrolPath: [
          { x: 1300, y: 1100 },
          { x: 1750, y: 1100 },
          { x: 1300, y: 1100 }
        ],
        currentPathIndex: 0,
        alertLevel: 0,
        sightRadius: 320,
        fov: Math.PI * 0.45
      }
    ],
    cameras: [
      {
        id: 'bg-cam-01',
        x: 360,
        y: 960,
        angle: 0.7,
        baseAngle: 0.7,
        sweepAngle: 1.2,
        sweepSpeed: 0.8,
        range: 360,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'bg-cam-02',
        x: 1290,
        y: 510,
        angle: 2.2,
        baseAngle: 2.2,
        sweepAngle: 1.1,
        sweepSpeed: 0.85,
        range: 370,
        fov: Math.PI * 0.38,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'bg-cam-03',
        x: 1760,
        y: 490,
        angle: -2.3,
        baseAngle: -2.3,
        sweepAngle: 0.9,
        sweepSpeed: 0.9,
        range: 380,
        fov: Math.PI * 0.36,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      },
      {
        id: 'bg-cam-04',
        x: 1740,
        y: 80,
        angle: 2.6,
        baseAngle: 2.6,
        sweepAngle: 0.8,
        sweepSpeed: 0.8,
        range: 360,
        fov: Math.PI * 0.36,
        isHacked: false,
        isLooping: false,
        isPowerOff: false
      }
    ],
    drones: [
      {
        id: 'bg-drone-01',
        x: 800,
        y: 800,
        angle: 0,
        speed: 2.0,
        patrolPath: [
          { x: 700, y: 800 },
          { x: 1200, y: 800 },
          { x: 1200, y: 600 },
          { x: 700, y: 600 }
        ],
        currentPathIndex: 0,
        range: 250,
        isHacked: false
      },
      {
        id: 'bg-drone-02',
        x: 1500,
        y: 300,
        angle: 1.0,
        speed: 2.1,
        patrolPath: [
          { x: 1400, y: 300 },
          { x: 1700, y: 300 },
          { x: 1700, y: 450 },
          { x: 1400, y: 450 }
        ],
        currentPathIndex: 0,
        range: 250,
        isHacked: false
      }
    ],
    lasers: [
      {
        id: 'bg-laser-01',
        x1: 850,
        y1: 950,
        x2: 950,
        y2: 950,
        isActive: true,
        cycleInterval: 2800,
        cycleOffset: 0,
        isHacked: false
      },
      {
        id: 'bg-laser-02',
        x1: 1200,
        y1: 500,
        x2: 1300,
        y2: 500,
        isActive: true,
        cycleInterval: 3200,
        cycleOffset: 1200,
        isHacked: false
      }
    ],
    terminals: [
      {
        id: 'term-bg-grid',
        x: 450,
        y: 700,
        type: 'SIGNAL',
        name: 'SECURITY ARCHIVE POWER RELAY',
        isHacked: false,
        disablesLaserId: 'bg-laser-01',
        description: 'Synchronize optical frequency to drop ingress laser gate.'
      },
      {
        id: 'term-bg-cams',
        x: 1150,
        y: 720,
        type: 'OVERRIDE',
        name: 'MILITARY FEED COMMUTATOR',
        isHacked: false,
        disablesCameraId: 'bg-cam-02',
        description: 'Harmonize channel waves to blind corridor surveillance camera.'
      },
      {
        id: 'term-bg-vault',
        x: 1600,
        y: 250,
        type: 'NETWORK',
        name: 'BLACK VAULT ROOT CONTROLLER',
        isHacked: false,
        unlocksDoorId: 'blackbox-vault-door',
        disablesLaserId: 'bg-laser-02',
        description: 'Navigate quantum encryption maze to retract vault blast shielding.'
      }
    ]
  }
];
