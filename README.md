# NEON HEIST

### THE GHOST PROTOCOL // TACTICAL STEALTH OPERATING SYSTEM

> A dark luxury cyberpunk stealth experience built around dynamic field-of-view acoustics, security AI subnets, cybernetic hacking, and high-risk classified extractions.

---

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12.2-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-slate?style=for-the-badge)](#license)

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                 NEON HEIST
                         OPERATING SYSTEM // REV 2.4
 
            INFILTRATION  •  SURVEILLANCE  •  CYBERNETIC HACKING
                     STEAL THE IMPOSSIBLE. LEAVE NO TRACE.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Overview

**NEON HEIST** is a single-player stealth simulation set within a heavily surveilled corporate megacity. The player operates as **THE GHOST**, an elite independent operative contracted to infiltrate sub-zero quantum facilities, bypass military-grade security perimeters, and exfiltrate classified corporate assets without triggering facility-wide lockdowns.

Unlike traditional action games, NEON HEIST prioritizes:
- **Acoustic Discipline**: Every surface material transmits audio waves with real physical dampening.
- **Line-of-Sight Geometry**: Guard vision cones calculate dynamic 2D raycast polygons against architectural walls and shadow volumes.
- **Diegetic Hardware Interaction**: Interactive security breaker boxes, camera sweep controllers, and optical scramblers modeled directly in-world.
- **Underground Black Market Economy**: Procurement of military-grade gear, neural implants, and biometric upgrades using corporate megacredits.

---

## Design Philosophy

The interface of NEON HEIST avoids generic SaaS dashboards and glowing neon clutter, establishing a bespoke fusion of three design disciplines:

| Discipline | Architectural Purpose | Execution in NEON HEIST |
|---|---|---|
| **Brutalism** | Structure, hierarchy, and industrial authority | Monolithic graphite chassis, bold typography (`Syne`), exposed structural lines, and technical classification stamps (`[OP-SYS 2.4]`). |
| **Glassmorphism** | Environmental depth, transparency, and atmosphere | Multi-layer smoked frosted glass (`rgba(8,12,22,0.72)`), multi-stage backdrop blurs, top-edge rim lighting, and subtle glass surface imperfections. |
| **Claymorphism** | Physicality, volume, and tactile micro-interactions | Soft 3D volumetric controls, beveled keycaps (`ClayKey`), physical depression on press (`active:translate-y-0.5`), and inner edge highlights. |

---

## Core Systems & Gameplay Mechanics

### 1. Raycast Vision & Shadow Occlusion Engine
- **Field of View (FOV)**: Patrol guards possess dynamic sight cones that react to player elevation, crouch profile, and ambient illumination.
- **Shadow Stealth**: Light sources dynamically illuminate the environment. Stepping into deep shadows drops player visibility to near zero, unlocking silent takedowns.
- **Acoustic Footprint Waveforms**: Running emits loud visual audio rings (`140px` radius) that alert nearby patrols; crouching reduces acoustic emissions to absolute silence.

### 2. Guard AI & Security Subnets
- **Multi-Tier Alert States**: Guards transition through `PATROL` → `INVESTIGATE` → `SUSPICIOUS` → `SEARCH` → `ALERT` → `COMBAT`.
- **Interconnected Security Grid**: If guards detect a dead terminal or camera loop anomaly, they broadcast over tactical radio channels, escalating the facility security level.
- **Distraction Decoys**: Operatives can deploy sound-emitter decoys (`F` key) to lure security officers away from locked checkpoints.

### 3. Cybernetic Terminals & Hacking Modals
- **Camera Loops & Power Switches**: Hack into security terminals to freeze camera telemetry feeds or manipulate camera pan angles.
- **Laser Matrix Breakers**: Physical circuit breaker panels can be re-routed to shut down high-voltage harmonic lasers blocking vault corridors.
- **Sub-Zero Quantum Vault Cracking**: Multi-layer cryptographic lock dials requiring real-time frequency alignment and key sequence entry.

### 4. Algorithmic Web Audio Synthesizer
- **Zero Audio Assets**: 100% of the game sound effects—footsteps, hydraulic pneumatic doors, flight case latches, terminal data chirps, alarm sirens, and heartbeat tension hums—are synthesized natively via the **Web Audio API**.

---

## Gameplay Loop

```
┌────────────────────────────────────────────────────────┐
│                   GHOSTNET MAINFRAME                   │
│        (Review Intel Dossier & Target Blueprint)       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                     LOADOUT PREP                       │
│    (Equip Optical Cloak, Decoys, EMP Disruptors)       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                   INFILTRATION RUN                     │
│    • Shadow Stalking   • Camera Hacking   • Decoys     │
│    • Guard Takedowns   • Laser Breakers   • Vault Crack│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                  EXTRACTION EXTRACTION                 │
│         (Evacuate to Rooftop Aerodyne Transit)         │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                   DEBRIEF & UPGRADES                   │
│  (Collect Megacredits, Acquire Black Market Hardware)  │
└────────────────────────────────────────────────────────┘
```

---

## Tutorial: Operation Zero — The Glass Vault

The introductory mission, **Operation Zero**, introduces stealth dynamics through active environmental challenges:
1. **Kinematics**: Calibrate movement with `W A S D` and sprint acceleration with `Shift`.
2. **Acoustic Low Profile**: Navigate low ventilation ducts using `C` or `Ctrl` to muffle acoustic signatures.
3. **Shadow Concealment**: Recognize lighting contrasts and utilize shadow zones to pass patrolling security units unseen.
4. **Augmented Scanner (`Q`)**: Engage AR telemetry overlay to reveal guards through walls and trace patrol pathways.
5. **Security Terminal Subversion (`E`)**: Override electronic door locks and disable harmonic laser tripwires.
6. **Flank Neutralization (`Space`)**: Execute silent takedowns when approaching oblivious guards from behind.
7. **Extraction Exfil**: Secure the classified flight case target and exfiltrate cleanly before alarms lock the sector.

---

## Technology Stack

The project uses clean, modern web engineering standards verified against production builds:

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Core Framework** | React | `^19.0.1` | Concurrent state management and component architecture |
| **Language** | TypeScript | `^7.0.2` | Strict end-to-end type safety (`tsc --noEmit`) |
| **Build Engine** | Vite | `^8.3.0` | High-performance ESM development server & bundling |
| **Styling** | Tailwind CSS | `^4.3.3` | Next-generation utility engine via `@import "tailwindcss";` |
| **Motion & Physics** | Motion | `^12.23.24` | Spring physics, tactical modals, and page transitions |
| **Icons & Symbols** | Lucide React | `^0.546.0` | Precision brutalist HUD and tactical interface iconography |
| **Audio Synthesis** | Web Audio API | *Native* | Real-time procedural synthesis with zero audio asset overhead |
| **Compiler** | esbuild | `^0.27.0` | Ultra-fast peer-compatible JavaScript/TypeScript transforms |

---

## UI Architecture & Layer Separation

To maintain strict gameplay immersion, the UI is architecturally segmented into three independent tiers:

```
┌─────────────────────────────────────────────────────────────────┐
│                      1. SYSTEM COMMAND LAYER                    │
│      TopBar Navigation • Main Dashboard • Black Market          │
│       Augment Tree • Dossier Archive • Save Crypt • Settings    │
│    (Full responsive drawers, 3D mouse parallax BrutalCards)     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        2. GAMEPLAY HUD LAYER                    │
│      Minimal Crosshair • Detection Meter • Context Prompts      │
│      Tactile Clay Keycaps • Vitality Bars • AR Telemetry        │
│        (Non-intrusive, diegetic, strictly context-aware)        │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     3. WORLD SIMULATION LAYER                   │
│      Hardware-Accelerated 2D Canvas Engine • Raycasting LOS     │
│        Guard Kinematics • Atmospheric Rain • Dynamic Shadows    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```text
neon-heist/
├── public/
│   ├── favicon.svg                # Brutalist vector cyber reticle favicon
│   └── site.webmanifest           # Progressive web app standalone manifest
├── src/
│   ├── components/
│   │   ├── achievements/          # Classified Commendations & Milestones modal
│   │   ├── archive/               # Megacorporation lore & classified intel
│   │   ├── cameras/               # Security camera monitoring terminal modal
│   │   ├── common/                # BrutalCard, ClayKey, TactileButton, CustomCursor, ToastSystem
│   │   ├── credits/               # Studio production crawl modal
│   │   ├── dashboard/             # Main command terminal & sector readiness
│   │   ├── dialogue/              # Radio communication transmission overlays
│   │   ├── game/                  # PauseMenu, FailureScreen, TouchControls
│   │   ├── hacking/               # Interactive terminal code override puzzles
│   │   ├── intro/                 # BootSequence, OpeningExperience (cinematic skyline)
│   │   ├── loadout/               # Equipment arsenal management & loadout slots
│   │   ├── market/                # Underworld Black Market broker terminal
│   │   ├── navigation/            # TopBar header, responsive drawer, GameFooter status bar
│   │   ├── operations/            # Tactical operations browser, ContractModal
│   │   ├── profile/               # Ghost operative radar polygon & telemetry stats
│   │   ├── results/               # Debrief score breakdown modal
│   │   ├── save/                  # 3-slot quantum memory crypt & JSON backup modal
│   │   ├── settings/              # Synthesizer audio calibration & graphics toggles
│   │   ├── upgrades/              # Biometric & neural augmentation skill tree
│   │   └── vault/                 # Multi-layer vault cracking interface
│   ├── game/
│   │   ├── StealthGame.tsx        # Core gameplay loop, HUD rendering, canvas controller
│   │   ├── audio.ts               # Algorithmic procedural Web Audio synthesis engine
│   │   ├── engine.ts              # Raycasting LOS, collision detection, guard AI state machine
│   │   └── missions.ts            # Campaign sectors, level geometry, and guard patrol paths
│   ├── hooks/
│   │   ├── useDevice.ts           # Dynamic input method & viewport detection
│   │   ├── useGamepad.ts          # Native Gamepad API thumbstick & trigger controller hook
│   │   └── useGameState.ts        # Persistent save state, loadout, credits, and upgrades
│   ├── types/
│   │   └── game.ts                # TypeScript domain models, interfaces, and enums
│   ├── App.tsx                    # Root routing controller & system modals
│   ├── index.css                  # Brutalist, glassmorphic, and claymorphic utility classes
│   └── main.tsx                   # Application DOM entry point
├── index.html                     # HTML5 shell with responsive metadata & font imports
├── metadata.json                  # AI Studio & applet capabilities manifest
├── package.json                   # Verified production dependencies & scripts
├── tsconfig.json                  # Strict TypeScript configuration
└── vite.config.ts                 # Vite bundler configuration with ESM path aliases
```

---

## Cross-Device & Input Matrix

NEON HEIST features an adaptive input system that dynamically switches interfaces based on active hardware:

| Input Method | Movement | Camera / Aim | Interaction | Special Abilities |
|---|---|---|---|---|
| **Keyboard & Mouse** | `W` `A` `S` `D` | Mouse Crosshair | `E` (Interact) | `Q` (Scanner), `F` (Decoy), `C` (Crouch), `Shift` (Sprint) |
| **Gamepad / Controller** | Left Thumbstick | Right Thumbstick | `A` / Cross | `Y` (Scanner), `X` (Decoy), `B` (Crouch), `RT` (Sprint) |
| **Mobile / Tablet** | Virtual Dual-Joystick | Radial Aiming | Tap Context | Dedicated radial clay buttons for crouch, sprint, scanner & decoys |

---

## Installation & Local Development

### Prerequisites
- **Node.js**: `22.x` or higher
- **npm**: `10.x` or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/neon-heist.git
   cd neon-heist
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Type check & lint**:
   ```bash
   npm run lint
   ```

5. **Create a production build**:
   ```bash
   npm run build
   ```

---

## Performance & Optimization

- **Zero Asset Latency**: No external audio files or heavy 3D asset downloads; initial page load occurs in `< 1.2s`.
- **Canvas Hardware Acceleration**: 60 FPS 2D canvas simulation utilizing delta-time kinematics (`dt`) and optimized vector arithmetic.
- **Micro-Interaction Feedback**: Hardware-accelerated CSS GPU transforms (`transform: translate3d`) for all clay key depressions and glass tilt effects.
- **Adaptive Quality Control**: Toggle graphics tiers in Settings (`ULTRA` / `HIGH` / `PERFORMANCE`) to dynamically calibrate blur intensity and particle density for low-power mobile devices.

---

## Credits & Attribution

- **Concept, Design & Direction**: GhostNet Creative Labs
- **Audio Synthesis Engine**: Native Web Audio API Procedural Synthesizer
- **Typography**: [Syne](https://fonts.google.com/specimen/Syne), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

---

## License

This project is licensed under the [MIT License](LICENSE).
