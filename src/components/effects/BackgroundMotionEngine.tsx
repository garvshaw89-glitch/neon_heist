import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleData {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  colorType: number; // 0 = cyan, 1 = electric blue, 2 = violet, 3 = amber security
  phase: number;
}

export const BackgroundMotionEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect capabilities and reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 120 : (window.innerWidth < 1200 ? 240 : 380);
    const maxLines = isMobile ? 40 : 100;
    const connectionDistSq = isMobile ? 14 : 22;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040609, 0.022);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 32);

    // High performance WebGLRenderer
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      });
    } catch {
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Mouse / Pointer State
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      speed: 0,
      lastX: 0,
      lastY: 0,
      lastTime: performance.now(),
      active: false,
    };

    // Touch Ripple effect state
    const touchRipple = {
      x: 0,
      y: 0,
      radius: 0,
      maxRadius: 18,
      active: false,
      opacity: 0,
    };

    // -------------------------------------------------------------
    // LAYER 1 & 2: MONOLITHIC CYBERPUNK CITY SILHOUETTES
    // -------------------------------------------------------------
    const cityGroup = new THREE.Group();
    cityGroup.position.set(0, -14, -18);

    const buildingBoxGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshBasicMaterial({
      color: 0x070b12,
      wireframe: false,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x112238,
      transparent: true,
      opacity: 0.45,
    });

    const buildingCount = isMobile ? 16 : 28;
    const windowColors = [0x00f0ff, 0x38bdf8, 0xf59e0b, 0x64748b];
    const windowGeo = new THREE.PlaneGeometry(0.18, 0.18);
    const windowMats = windowColors.map(
      (c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.7 })
    );

    for (let i = 0; i < buildingCount; i++) {
      const width = 2.2 + Math.random() * 3.4;
      const height = 10 + Math.random() * 22;
      const depth = 2.5 + Math.random() * 4;
      const xPos = (i - buildingCount / 2) * 3.4 + (Math.random() - 0.5) * 1.5;
      const zPos = -Math.random() * 12;

      const building = new THREE.Mesh(buildingBoxGeo, buildingMat);
      building.scale.set(width, height, depth);
      building.position.set(xPos, height / 2, zPos);
      cityGroup.add(building);

      // Edge outline
      const edges = new THREE.EdgesGeometry(buildingBoxGeo);
      const line = new THREE.LineSegments(edges, edgeMat);
      line.scale.set(width, height, depth);
      line.position.copy(building.position);
      cityGroup.add(line);

      // Rare illuminated windows on tower facades
      const winCount = Math.floor(Math.random() * 6);
      for (let w = 0; w < winCount; w++) {
        const mat = windowMats[Math.floor(Math.random() * windowMats.length)];
        const winMesh = new THREE.Mesh(windowGeo, mat);
        winMesh.position.set(
          xPos + (Math.random() - 0.5) * (width * 0.7),
          height * (0.3 + Math.random() * 0.65),
          zPos + depth / 2 + 0.05
        );
        cityGroup.add(winMesh);
      }
    }
    scene.add(cityGroup);

    // -------------------------------------------------------------
    // LAYER 3 & 4: HOLOGRAPHIC SCANNING PLANE & WIREFRAME GRID
    // -------------------------------------------------------------
    const gridHelper = new THREE.GridHelper(70, 36, 0x00f0ff, 0x0c2738);
    gridHelper.position.set(0, -11, 0);
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.18;
      });
    } else {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.18;
    }
    scene.add(gridHelper);

    // Moving Laser / Radar Scan Plane
    const scanPlaneGeo = new THREE.PlaneGeometry(80, 0.35);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = Math.PI / 2;
    scanPlane.position.set(0, -10.8, 0);
    scene.add(scanPlane);

    // Holographic Peripheral Floating Polyhedra
    const polyGroup = new THREE.Group();
    const polyGeo1 = new THREE.IcosahedronGeometry(1.6, 0);
    const polyMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const poly1 = new THREE.Mesh(polyGeo1, polyMat1);
    poly1.position.set(-18, 8, -6);
    polyGroup.add(poly1);

    const polyGeo2 = new THREE.OctahedronGeometry(1.2, 0);
    const polyMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const poly2 = new THREE.Mesh(polyGeo2, polyMat2);
    poly2.position.set(19, -3, -4);
    polyGroup.add(poly2);

    const polyGeo3 = new THREE.TetrahedronGeometry(1.4, 0);
    const polyMat3 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const poly3 = new THREE.Mesh(polyGeo3, polyMat3);
    poly3.position.set(16, 10, -10);
    polyGroup.add(poly3);

    scene.add(polyGroup);

    // -------------------------------------------------------------
    // LAYER 3 & 5: DYNAMIC REACTIVE PARTICLE SYSTEM
    // -------------------------------------------------------------
    const particles: ParticleData[] = [];
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color(0x00f0ff), // Cyan Ghost
      new THREE.Color(0x38bdf8), // Electric Sky
      new THREE.Color(0xa855f7), // Restrained Violet
      new THREE.Color(0xf59e0b), // Amber Sentinel Node
    ];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 48;
      const y = (Math.random() - 0.5) * 28;
      const z = (Math.random() - 0.5) * 26 + 4;

      const colorType =
        Math.random() < 0.65 ? 0 : Math.random() < 0.85 ? 1 : Math.random() < 0.96 ? 2 : 3;
      const baseColor = colorPalette[colorType];

      particles.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() - 0.5) * 0.012,
        vz: (Math.random() - 0.5) * 0.01,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 2.8 + 1.2,
        colorType,
        phase: Math.random() * Math.PI * 2,
      });

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;

      sizes[i] = particles[i].size;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture generator (soft circular glow)
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.25, 'rgba(0, 240, 255, 0.85)');
        gradient.addColorStop(0.65, 'rgba(0, 240, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createCircleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // -------------------------------------------------------------
    // INTER-PARTICLE NEURAL CONNECTION LINES
    // -------------------------------------------------------------
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMaterial);
    scene.add(lineSegments);

    // -------------------------------------------------------------
    // FOREGROUND ATMOSPHERIC PARTICLES (Cinematic depth)
    // -------------------------------------------------------------
    const fgCount = isMobile ? 12 : 32;
    const fgPositions = new Float32Array(fgCount * 3);
    const fgVelocities: { x: number; y: number; z: number; phase: number }[] = [];

    for (let i = 0; i < fgCount; i++) {
      const x = (Math.random() - 0.5) * 36;
      const y = (Math.random() - 0.5) * 20;
      const z = Math.random() * 12 + 20; // Close to camera (z = 32)
      fgPositions[i * 3] = x;
      fgPositions[i * 3 + 1] = y;
      fgPositions[i * 3 + 2] = z;
      fgVelocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.005,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const fgGeo = new THREE.BufferGeometry();
    fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPositions, 3));

    const fgMat = new THREE.PointsMaterial({
      size: 2.2,
      color: 0x38bdf8,
      map: particleTexture,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const fgSystem = new THREE.Points(fgGeo, fgMat);
    scene.add(fgSystem);

    // -------------------------------------------------------------
    // INTERACTION LISTENERS (Window Pointer & Touch)
    // -------------------------------------------------------------
    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      mouse.targetX = nx * 14;
      mouse.targetY = ny * 9;
      mouse.active = true;

      const now = performance.now();
      const dt = Math.max(1, now - mouse.lastTime);
      const dx = e.clientX - mouse.lastX;
      const dy = e.clientY - mouse.lastY;
      mouse.speed = Math.min(3.5, Math.sqrt(dx * dx + dy * dy) / dt);

      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
      mouse.lastTime = now;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.speed = 0;
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Trigger touch / click local energy ripple
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      touchRipple.x = nx * 14;
      touchRipple.y = ny * 9;
      touchRipple.radius = 0.5;
      touchRipple.active = true;
      touchRipple.opacity = 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      if (!renderer) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    };

    window.addEventListener('resize', handleResize);

    // Visibility Listener (Pause RAF loop when hidden to preserve GPU/battery)
    let isTabVisible = document.visibilityState === 'visible';
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // -------------------------------------------------------------
    // MAIN ANIMATION LOOP
    // -------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible || !renderer) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime() * (prefersReducedMotion ? 0.3 : 0.85);

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      mouse.speed *= 0.94;

      // Parallax on camera and background city
      camera.position.x = mouse.x * 0.18;
      camera.position.y = mouse.y * 0.15;
      camera.lookAt(0, 0, 0);

      cityGroup.position.x = -mouse.x * 0.12;
      cityGroup.position.y = -14 - mouse.y * 0.08;

      // Rotating holographic shapes
      poly1.rotation.x = time * 0.25;
      poly1.rotation.y = time * 0.32;
      poly2.rotation.y = -time * 0.35;
      poly2.rotation.z = time * 0.2;
      poly3.rotation.x = time * 0.18;
      poly3.rotation.z = -time * 0.22;

      // Scanning plane movement
      scanPlane.position.z = Math.sin(time * 0.45) * 22;
      scanPlaneMat.opacity = 0.15 + Math.sin(time * 1.8) * 0.1;

      // Expand touch ripple if active
      if (touchRipple.active) {
        touchRipple.radius += delta * 12;
        touchRipple.opacity -= delta * 1.5;
        if (touchRipple.opacity <= 0 || touchRipple.radius >= touchRipple.maxRadius) {
          touchRipple.active = false;
        }
      }

      // Update Particles
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      const mouseWorldX = mouse.x;
      const mouseWorldY = mouse.y;
      const mouseActive = mouse.active;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Ambient cybernetic floating drift
        p.phase += delta * 1.2;
        const driftX = Math.sin(p.phase + i * 0.3) * 0.008;
        const driftY = Math.cos(p.phase + i * 0.2) * 0.008;

        p.x += p.vx + driftX;
        p.y += p.vy + driftY;
        p.z += p.vz;

        // Restore toward base position (elastic lattice)
        p.vx += (p.baseX - p.x) * 0.0008;
        p.vy += (p.baseY - p.y) * 0.0008;
        p.vz += (p.baseZ - p.z) * 0.0008;

        // Interactive mouse repulsion & turbulence
        if (mouseActive) {
          const dx = p.x - mouseWorldX;
          const dy = p.y - mouseWorldY;
          const distSq = dx * dx + dy * dy;
          const repulsionRadiusSq = 36 + mouse.speed * 18;

          if (distSq < repulsionRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / Math.sqrt(repulsionRadiusSq)) * (0.08 + mouse.speed * 0.06);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            // Slight vortex curve
            p.vx += (-dy / dist) * force * 0.35;
            p.vy += (dx / dist) * force * 0.35;
          }
        }

        // Touch Ripple interaction
        if (touchRipple.active) {
          const dx = p.x - touchRipple.x;
          const dy = p.y - touchRipple.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - touchRipple.radius);
          if (diff < 3) {
            const rippleForce = (1 - diff / 3) * touchRipple.opacity * 0.12;
            p.vx += (dx / (dist || 1)) * rippleForce;
            p.vy += (dy / (dist || 1)) * rippleForce;
          }
        }

        // Friction damping
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vz *= 0.96;

        posArr[i * 3] = p.x;
        posArr[i * 3 + 1] = p.y;
        posArr[i * 3 + 2] = p.z;
      }
      posAttr.needsUpdate = true;

      // Update Inter-particle Neural Connection Lines
      const linePosAttr = lineGeo.attributes.position as THREE.BufferAttribute;
      const lineColAttr = lineGeo.attributes.color as THREE.BufferAttribute;
      const lPos = linePosAttr.array as Float32Array;
      const lCol = lineColAttr.array as Float32Array;

      let lineIdx = 0;
      // Stride checks to stay extremely performant
      const step = isMobile ? 4 : 2;
      for (let i = 0; i < particleCount && lineIdx < maxLines; i += step) {
        const p1 = particles[i];
        for (let j = i + 1; j < particleCount && lineIdx < maxLines; j += step * 2) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectionDistSq) {
            const alpha = 1 - Math.sqrt(distSq) / Math.sqrt(connectionDistSq);

            const vIdx = lineIdx * 6;
            lPos[vIdx] = p1.x;
            lPos[vIdx + 1] = p1.y;
            lPos[vIdx + 2] = p1.z;
            lPos[vIdx + 3] = p2.x;
            lPos[vIdx + 4] = p2.y;
            lPos[vIdx + 5] = p2.z;

            // Highlight connections near cursor
            const nearMouse =
              mouseActive &&
              ((p1.x - mouseWorldX) ** 2 + (p1.y - mouseWorldY) ** 2 < 25 ||
                (p2.x - mouseWorldX) ** 2 + (p2.y - mouseWorldY) ** 2 < 25);

            const lineBrightness = (nearMouse ? 0.8 : 0.28) * alpha;

            // Color based on particle types
            const isViolet = p1.colorType === 2 || p2.colorType === 2;
            const isAmber = p1.colorType === 3 || p2.colorType === 3;

            const r = isAmber ? lineBrightness : isViolet ? lineBrightness * 0.7 : 0.0;
            const g = isAmber ? lineBrightness * 0.6 : isViolet ? lineBrightness * 0.35 : lineBrightness * 0.95;
            const b = isAmber ? 0.0 : lineBrightness;

            lCol[vIdx] = r;
            lCol[vIdx + 1] = g;
            lCol[vIdx + 2] = b;
            lCol[vIdx + 3] = r;
            lCol[vIdx + 4] = g;
            lCol[vIdx + 5] = b;

            lineIdx++;
          }
        }
      }

      // Zero out unused line segments
      for (let k = lineIdx * 6; k < maxLines * 6; k++) {
        lPos[k] = 0;
        lCol[k] = 0;
      }
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      // Update Foreground Particles
      const fgPosAttr = fgGeo.attributes.position as THREE.BufferAttribute;
      const fgArr = fgPosAttr.array as Float32Array;
      for (let i = 0; i < fgCount; i++) {
        const vel = fgVelocities[i];
        vel.phase += delta * 0.6;
        fgArr[i * 3] += vel.x + Math.sin(vel.phase) * 0.005;
        fgArr[i * 3 + 1] += vel.y + Math.cos(vel.phase) * 0.005;
        fgArr[i * 3 + 2] += vel.z;

        // Wrap around foreground view volume
        if (fgArr[i * 3] > 20) fgArr[i * 3] = -20;
        if (fgArr[i * 3] < -20) fgArr[i * 3] = 20;
        if (fgArr[i * 3 + 1] > 14) fgArr[i * 3 + 1] = -14;
        if (fgArr[i * 3 + 1] < -14) fgArr[i * 3 + 1] = 14;
      }
      fgPosAttr.needsUpdate = true;

      // Render Scene
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // -------------------------------------------------------------
    // TEARDOWN / CLEANUP
    // -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Clean Three.js geometries and materials
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      lineGeo.dispose();
      lineMaterial.dispose();
      fgGeo.dispose();
      fgMat.dispose();
      gridHelper.dispose();
      scanPlaneGeo.dispose();
      scanPlaneMat.dispose();
      polyGeo1.dispose();
      polyMat1.dispose();
      polyGeo2.dispose();
      polyMat2.dispose();
      polyGeo3.dispose();
      polyMat3.dispose();
      buildingBoxGeo.dispose();
      buildingMat.dispose();
      edgeMat.dispose();
      windowGeo.dispose();
      windowMats.forEach((m) => m.dispose());

      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Cinematic Vignette Overlay (Obsidian depth & edge falloff) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(4, 6, 9, 0.45) 0%, rgba(4, 6, 9, 0.78) 65%, #040609 100%)',
        }}
      />
      {/* Subtle Scanline / CRT Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_1px,#040609_1px)] bg-[size:4px_4px] opacity-25" />
    </div>
  );
};
