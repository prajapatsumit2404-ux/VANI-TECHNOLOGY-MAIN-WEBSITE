/**
 * Vani Technologies - 3D Hero Background Engine (Three.js)
 * Digital Intelligence Core, Orbital Rings, Data Flow & Interactive Network
 */

(function () {
  'use strict';

  // State & Configuration
  const state = {
    canvas: null,
    renderer: null,
    scene: null,
    camera: null,
    coreGroup: null,
    networkLines: null,
    networkGeometry: null,
    particleSystem: null,
    burstParticles: [],
    orbitNodes: [],
    dataParticles: [],
    
    // Core Mesh references
    innerCore: null,
    wireCore: null,
    outerShell: null,
    ringMeshes: [],

    // Responsive particle count
    particleCount: 180,
    maxDistance: 6.8,

    // Motion & Interaction
    mouseX: 0,
    mouseY: 0,
    targetRotX: 0,
    targetRotY: 0,
    proximityFactor: 0, // 0 to 1 based on mouse distance to core
    scrollY: 0,
    isTabVisible: true,
    isHeroIntersecting: true,
    isBurstActive: false,
    burstProgress: 0,
    reducedMotion: false,

    animationFrameId: null,
    clock: null,
  };

  /**
   * Check WebGL support
   */
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  /**
   * Determine device profile (desktop, tablet, mobile)
   */
  function getDeviceProfile() {
    const width = window.innerWidth;
    if (width < 768) {
      return { type: 'mobile', particles: 45, rings: 2, scale: 0.62, posX: 0, posY: -2.4 };
    } else if (width < 1024) {
      return { type: 'tablet', particles: 110, rings: 3, scale: 0.85, posX: 2.2, posY: 0.2 };
    } else {
      return { type: 'desktop', particles: 200, rings: 3, scale: 1.0, posX: 4.4, posY: 0.3 };
    }
  }

  /**
   * Initialize 3D Hero Scene
   */
  function init() {
    state.canvas = document.getElementById('hero-three-canvas');
    if (!state.canvas) return;

    if (!isWebGLAvailable()) {
      console.warn('[Vani Technologies 3D] WebGL not available. Activating CSS fallback.');
      document.body.classList.add('no-webgl');
      return;
    }

    state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    state.clock = new THREE.Clock();

    const container = document.getElementById('hero-3d-scene-container') || state.canvas.parentElement;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    // 1. Scene & Camera
    state.scene = new THREE.Scene();
    state.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    state.camera.position.set(0, 0, 18);

    // 2. WebGL Renderer
    state.renderer = new THREE.WebGLRenderer({
      canvas: state.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    state.renderer.setSize(width, height);
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Lighting (Vani brand orange & cool blue accents)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    state.scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xe85827, 2.8, 25);
    coreLight.position.set(0, 0, 0);
    state.scene.add(coreLight);

    const blueRimLight = new THREE.PointLight(0x3b82f6, 1.8, 30);
    blueRimLight.position.set(-10, 8, 10);
    state.scene.add(blueRimLight);

    // 4. Build Digital Intelligence Core
    buildDigitalCore();

    // 5. Build Connected Digital Network & Particles
    buildConnectedNetwork();

    // 6. Build Data Flow System
    buildDataFlowSystem();

    // 7. Setup Event Listeners & Observers
    setupInteractions();
    setupObservers();

    // 8. Start Single Animation Loop
    animate();
  }

  /**
   * Build Multi-Layered Digital Intelligence Core
   */
  function buildDigitalCore() {
    const profile = getDeviceProfile();
    state.coreGroup = new THREE.Group();
    state.coreGroup.position.set(profile.posX, profile.posY, 0);
    state.coreGroup.scale.set(profile.scale, profile.scale, profile.scale);

    // Layer A: Central glowing icosphere
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xe85827,
      emissive: 0xda251d,
      emissiveIntensity: 0.65,
      roughness: 0.3,
      metalness: 0.7,
      wireframe: false,
    });
    state.innerCore = new THREE.Mesh(innerGeo, innerMat);
    state.coreGroup.add(state.innerCore);

    // Layer B: Wireframe icosphere
    const wireGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    state.wireCore = new THREE.Mesh(wireGeo, wireMat);
    state.coreGroup.add(state.wireCore);

    // Layer C: Transparent outer geometric shell
    const outerGeo = new THREE.IcosahedronGeometry(2.7, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      wireframe: false,
      transparent: true,
      opacity: 0.1,
      roughness: 0.2,
      metalness: 0.9,
      depthWrite: false,
    });
    state.outerShell = new THREE.Mesh(outerGeo, outerMat);
    state.coreGroup.add(state.outerShell);

    // Layer D: Multiple Orbital Rings
    buildOrbitalSystem(profile.rings);

    state.scene.add(state.coreGroup);
  }

  /**
   * Create 3 Orbital Rings with traveling nodes
   */
  function buildOrbitalSystem(ringCount) {
    state.ringMeshes = [];
    state.orbitNodes = [];

    const ringConfigs = [
      { radius: 3.8, rotX: Math.PI / 2, rotY: 0, rotZ: 0, speed: 0.65, color: 0x60697d },
      { radius: 4.4, rotX: Math.PI / 3.8, rotY: Math.PI / 6, rotZ: 0, speed: -0.45, color: 0xe85827 },
      { radius: 5.0, rotX: -Math.PI / 3.5, rotY: -Math.PI / 5, rotZ: Math.PI / 8, speed: 0.35, color: 0x38bdf8 },
    ];

    const count = Math.min(ringCount, ringConfigs.length);

    for (let i = 0; i < count; i++) {
      const cfg = ringConfigs[i];
      const ringGroup = new THREE.Group();
      ringGroup.rotation.set(cfg.rotX, cfg.rotY, cfg.rotZ);

      // Ring Geometry
      const ringGeo = new THREE.TorusGeometry(cfg.radius, 0.024, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.35,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringGroup.add(ringMesh);

      // Traveling Nodes on Ring
      const nodeCount = 2;
      for (let n = 0; n < nodeCount; n++) {
        const nodeGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const nodeMat = new THREE.MeshBasicMaterial({
          color: (n % 2 === 0) ? 0xe85827 : 0xfef08a,
          transparent: true,
          opacity: 0.9,
        });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        ringGroup.add(nodeMesh);

        state.orbitNodes.push({
          mesh: nodeMesh,
          radius: cfg.radius,
          angle: (n * Math.PI) + (i * 0.8),
          speed: cfg.speed * 0.8,
          ringGroup: ringGroup,
        });
      }

      state.ringMeshes.push({ group: ringGroup, speed: cfg.speed });
      state.coreGroup.add(ringGroup);
    }
  }

  /**
   * Build Connected Digital Network (Particles + Dynamic Lines)
   */
  function buildConnectedNetwork() {
    const profile = getDeviceProfile();
    state.particleCount = profile.particles;

    const positions = new Float32Array(state.particleCount * 3);
    const colors = new Float32Array(state.particleCount * 3);
    const particleData = [];

    const brandOrange = new THREE.Color(0xe85827);
    const brandGold = new THREE.Color(0xed8a0a);
    const brandSlate = new THREE.Color(0x60697d);
    const brandBlue = new THREE.Color(0x38bdf8);

    const rangeX = 26;
    const rangeY = 16;
    const rangeZ = 12;

    for (let i = 0; i < state.particleCount; i++) {
      const x = (Math.random() - 0.5) * rangeX;
      const y = (Math.random() - 0.5) * rangeY;
      const z = (Math.random() - 0.5) * rangeZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Assign brand color palette
      const rand = Math.random();
      let c = brandSlate;
      if (rand < 0.35) c = brandOrange;
      else if (rand < 0.55) c = brandGold;
      else if (rand < 0.70) c = brandBlue;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      particleData.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.01
        ),
        baseX: x,
        baseY: y,
        baseZ: z,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    state.particleSystem = new THREE.Points(geometry, material);
    state.particleSystem.userData.data = particleData;
    state.scene.add(state.particleSystem);

    // Network connection lines geometry
    const maxLines = state.particleCount * 6;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    state.networkGeometry = new THREE.BufferGeometry();
    state.networkGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    state.networkGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    state.networkLines = new THREE.LineSegments(state.networkGeometry, lineMaterial);
    state.scene.add(state.networkLines);
  }

  /**
   * Data Flow System: Particles traveling between outer network & core
   */
  function buildDataFlowSystem() {
    const dataCount = 20;
    state.dataParticles = [];

    const dataGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const dataMatOrange = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.9 });
    const dataMatBlue = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 });

    for (let i = 0; i < dataCount; i++) {
      const mesh = new THREE.Mesh(dataGeo, (i % 2 === 0) ? dataMatOrange : dataMatBlue);
      const isIngress = (i % 2 === 0); // outer -> core or core -> outer
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 7 + Math.random() * 8;
      const targetPos = new THREE.Vector3(
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 8,
        Math.sin(angle) * distance * 0.5
      );

      state.dataParticles.push({
        mesh: mesh,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.008,
        isIngress: isIngress,
        outerPoint: targetPos,
      });

      state.scene.add(mesh);
    }
  }

  /**
   * Setup Mouse, Scroll and Window Events
   */
  function setupInteractions() {
    window.addEventListener('mousemove', (e) => {
      state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Calculate proximity to core in screen space
      if (state.coreGroup) {
        const corePos = state.coreGroup.position.clone();
        corePos.project(state.camera);
        const dx = state.mouseX - corePos.x;
        const dy = state.mouseY - corePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        state.proximityFactor = THREE.MathUtils.clamp(1.0 - (dist / 1.1), 0, 1);
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      state.mouseX = 0;
      state.mouseY = 0;
      state.proximityFactor = 0;
    });

    window.addEventListener('scroll', () => {
      state.scrollY = window.scrollY;
    }, { passive: true });

    window.addEventListener('resize', onWindowResize, { passive: true });

    // Expose particle burst trigger globally
    window.triggerHeroCoreBurst = triggerParticleBurst;
  }

  /**
   * Particle burst reaction on "Explore Services" click
   */
  function triggerParticleBurst() {
    if (!state.coreGroup || state.burstParticles.length > 0) return;

    state.isBurstActive = true;
    state.burstProgress = 0;

    const burstCount = 36;
    const burstGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const burstMat = new THREE.MeshBasicMaterial({
      color: 0xfbd5c6,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
    });

    const origin = state.coreGroup.position.clone();

    for (let i = 0; i < burstCount; i++) {
      const mesh = new THREE.Mesh(burstGeo, burstMat);
      mesh.position.copy(origin);
      
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const speed = 0.12 + Math.random() * 0.18;

      const vel = new THREE.Vector3(
        Math.sin(theta) * Math.cos(phi) * speed,
        Math.sin(theta) * Math.sin(phi) * speed,
        Math.cos(theta) * speed
      );

      state.burstParticles.push({
        mesh: mesh,
        velocity: vel,
        life: 1.0,
      });

      state.scene.add(mesh);
    }

    // Core brief scale bounce
    state.coreGroup.scale.multiplyScalar(1.14);
    setTimeout(() => {
      const profile = getDeviceProfile();
      if (state.coreGroup) state.coreGroup.scale.set(profile.scale, profile.scale, profile.scale);
    }, 450);
  }

  /**
   * Handle Window Resizing
   */
  function onWindowResize() {
    if (!state.renderer || !state.camera) return;

    const container = document.getElementById('hero-3d-scene-container') || state.canvas.parentElement;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    state.camera.aspect = width / height;
    state.camera.updateProjectionMatrix();

    state.renderer.setSize(width, height);
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const profile = getDeviceProfile();
    if (state.coreGroup) {
      state.coreGroup.position.set(profile.posX, profile.posY, 0);
      state.coreGroup.scale.set(profile.scale, profile.scale, profile.scale);
    }
  }

  /**
   * Observers for Visibility and Scroll Intersection
   */
  function setupObservers() {
    document.addEventListener('visibilitychange', () => {
      state.isTabVisible = !document.hidden;
    });

    const heroSection = document.getElementById('home');
    if (heroSection && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          state.isHeroIntersecting = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    }

    // Dynamic reduced-motion preference updates
    try {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      motionQuery.addEventListener('change', (e) => {
        state.reducedMotion = e.matches;
      });
    } catch (e) {
      // Fallback for older browsers
    }
  }

  /**
   * Single Animation Loop
   */
  function animate() {
    state.animationFrameId = requestAnimationFrame(animate);

    // Pause rendering if tab hidden or hero scrolled off-screen
    if (!state.isTabVisible || !state.isHeroIntersecting) return;

    const delta = state.clock.getDelta();
    const time = state.clock.getElapsedTime();

    // 1. Mouse Interpolation (Subtle, max ~6-8 degrees)
    state.targetRotX = state.mouseY * 0.12;
    state.targetRotY = state.mouseX * 0.14;

    if (!state.reducedMotion && state.coreGroup) {
      state.coreGroup.rotation.x += (state.targetRotX - state.coreGroup.rotation.x) * 0.05;
      state.coreGroup.rotation.y += (state.targetRotY - state.coreGroup.rotation.y) * 0.05;

      // Continuous subtle rotation (boosted slightly by mouse proximity)
      const proximitySpeedBoost = 1.0 + (state.proximityFactor * 0.7);
      state.innerCore.rotation.y += delta * 0.35 * proximitySpeedBoost;
      state.innerCore.rotation.x += delta * 0.20 * proximitySpeedBoost;

      state.wireCore.rotation.y -= delta * 0.25 * proximitySpeedBoost;
      state.wireCore.rotation.z += delta * 0.15 * proximitySpeedBoost;

      state.outerShell.rotation.y += delta * 0.12;

      // 2. Orbital Rings & Traveling Nodes
      state.ringMeshes.forEach((item) => {
        item.group.rotation.z += delta * item.speed * 0.3 * proximitySpeedBoost;
      });

      state.orbitNodes.forEach((node) => {
        node.angle += delta * node.speed * proximitySpeedBoost;
        node.mesh.position.set(
          Math.cos(node.angle) * node.radius,
          Math.sin(node.angle) * node.radius,
          0
        );
      });
    }

    // 3. Scroll Reaction (Core moves slightly upward, scales down, fades)
    if (state.coreGroup && state.scrollY > 0) {
      const scrollFactor = THREE.MathUtils.clamp(state.scrollY / 600, 0, 1);
      const profile = getDeviceProfile();
      state.coreGroup.position.y = profile.posY + (scrollFactor * 1.5);
      const scrollScale = profile.scale * (1.0 - (scrollFactor * 0.25));
      state.coreGroup.scale.set(scrollScale, scrollScale, scrollScale);
    }

    // 4. Update Particle Network & Distance Connections
    updateNetworkParticles(time);

    // 5. Update Data Flow System
    updateDataFlow();

    // 6. Update Particle Burst
    updateBurstParticles();

    // Render Scene
    state.renderer.render(state.scene, state.camera);
  }

  /**
   * Update Network Particles & Dynamic Connecting Lines
   */
  function updateNetworkParticles(time) {
    if (!state.particleSystem || !state.networkLines) return;

    const positions = state.particleSystem.geometry.attributes.position.array;
    const particleData = state.particleSystem.userData.data;
    const count = state.particleCount;

    // Proximity brightness boost
    state.particleSystem.material.opacity = 0.75 + (state.proximityFactor * 0.25);

    // Move particles
    for (let i = 0; i < count; i++) {
      if (!state.reducedMotion) {
        positions[i * 3] += particleData[i].velocity.x;
        positions[i * 3 + 1] += particleData[i].velocity.y;
        positions[i * 3 + 2] += particleData[i].velocity.z;

        // Soft bounce boundaries
        if (Math.abs(positions[i * 3]) > 14) particleData[i].velocity.x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 9) particleData[i].velocity.y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 7) particleData[i].velocity.z *= -1;
      }
    }
    state.particleSystem.geometry.attributes.position.needsUpdate = true;

    // Connect nearby particles within distance threshold
    const linePositions = state.networkGeometry.attributes.position.array;
    const lineColors = state.networkGeometry.attributes.color.array;
    let lineIdx = 0;
    let colorIdx = 0;

    const maxDist = state.maxDistance;
    const thresholdSq = maxDist * maxDist;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < thresholdSq && lineIdx < linePositions.length - 6) {
          const alpha = 1.0 - (distSq / thresholdSq);

          linePositions[lineIdx++] = positions[i * 3];
          linePositions[lineIdx++] = positions[i * 3 + 1];
          linePositions[lineIdx++] = positions[i * 3 + 2];

          linePositions[lineIdx++] = positions[j * 3];
          linePositions[lineIdx++] = positions[j * 3 + 1];
          linePositions[lineIdx++] = positions[j * 3 + 2];

          // Color blend (slate to flame orange pulse)
          const pulse = (Math.sin(time * 2 + i) + 1) * 0.5;
          const r = 0.38 + (pulse * 0.5);
          const g = 0.41 + (pulse * 0.2);
          const b = 0.49;

          lineColors[colorIdx++] = r * alpha;
          lineColors[colorIdx++] = g * alpha;
          lineColors[colorIdx++] = b * alpha;

          lineColors[colorIdx++] = r * alpha;
          lineColors[colorIdx++] = g * alpha;
          lineColors[colorIdx++] = b * alpha;
        }
      }
    }

    state.networkGeometry.setDrawRange(0, lineIdx / 3);
    state.networkGeometry.attributes.position.needsUpdate = true;
    state.networkGeometry.attributes.color.needsUpdate = true;
    state.networkLines.material.opacity = 0.2 + (state.proximityFactor * 0.2);
  }

  /**
   * Update Data Flow Particles
   */
  function updateDataFlow() {
    if (!state.dataParticles.length || !state.coreGroup) return;

    const corePos = state.coreGroup.position;

    state.dataParticles.forEach((dp) => {
      dp.progress += dp.speed;
      if (dp.progress > 1.0) dp.progress = 0;

      const t = dp.isIngress ? dp.progress : (1.0 - dp.progress);
      dp.mesh.position.lerpVectors(dp.outerPoint, corePos, t);
      
      // Arc slightly above straight line
      dp.mesh.position.y += Math.sin(t * Math.PI) * 0.8;
      dp.mesh.material.opacity = Math.sin(t * Math.PI) * 0.85;
    });
  }

  /**
   * Update Click Particle Burst
   */
  function updateBurstParticles() {
    if (!state.burstParticles.length) return;

    for (let i = state.burstParticles.length - 1; i >= 0; i--) {
      const p = state.burstParticles[i];
      p.mesh.position.add(p.velocity);
      p.velocity.multiplyScalar(0.96); // Decelerate smoothly
      p.life -= 0.02;

      p.mesh.material.opacity = THREE.MathUtils.clamp(p.life, 0, 1);

      if (p.life <= 0) {
        state.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        state.burstParticles.splice(i, 1);
      }
    }

    if (state.burstParticles.length === 0) {
      state.isBurstActive = false;
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
