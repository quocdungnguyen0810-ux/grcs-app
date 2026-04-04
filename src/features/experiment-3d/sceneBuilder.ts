// ===================================================================
// Three.js Scene Builder — VLHR Experiment 3D Model
// ===================================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ModelConfig, LayerVisibility, AssemblyStep } from './types';
import { GROUP_COLUMN_CONFIG } from './types';

// Scale: 1mm in real = 0.01 units in scene (so 1000mm = 10 units)
const SCALE = 0.01;

function s(mm: number) {
  return mm * SCALE;
}

/** Color palette matching the app design system */
const COLORS = {
  soil: 0x78350f,
  soilTop: 0x92400e,
  column: 0x9ca3af,
  columnInner: 0x6b7280,
  geogrid: 0x10b981,
  sand: 0xfbbf24,
  sandDark: 0xd97706,
  gauge: 0xef4444,
  gaugeGlow: 0xff6b6b,
  loading: 0x64748b,
  loadingPlate: 0x475569,
  tank: 0x334155,
  tankEdge: 0x475569,
  floor: 0x0f172a,
  label: 0xf1f5f9,
  arrow: 0x3b82f6,
  stress: 0xf59e0b,
};

export interface SceneRefs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  groups: Record<string, THREE.Group>;
  animationId: number | null;
  dispose: () => void;
}

export function createScene(
  container: HTMLElement,
  config: ModelConfig = GROUP_COLUMN_CONFIG
): SceneRefs {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1628);
  scene.fog = new THREE.FogExp2(0x0a1628, 0.03);

  // Camera
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
  camera.position.set(12, 10, 14);
  camera.lookAt(0, 3, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 40;
  controls.maxPolarAngle = Math.PI / 2 + 0.1;
  controls.target.set(0, 3, 0);
  controls.update();

  // Lighting
  setupLighting(scene);

  // Floor grid
  setupFloor(scene);

  // Create layer groups
  const groups: Record<string, THREE.Group> = {
    tank: new THREE.Group(),
    baseSand: new THREE.Group(),
    soil: new THREE.Group(),
    columns: new THREE.Group(),
    geogrid: new THREE.Group(),
    topSand: new THREE.Group(),
    gauges: new THREE.Group(),
    loadingSystem: new THREE.Group(),
    loading: new THREE.Group(),
    labels: new THREE.Group(),
  };

  Object.values(groups).forEach((g) => scene.add(g));

  // Build model components
  buildTank(groups.tank, config);
  buildBaseSand(groups.baseSand, config);
  buildSoil(groups.soil, config);
  buildColumns(groups.columns, config);
  buildGeogrid(groups.geogrid, config);
  buildGauges(groups.gauges, config);
  buildTopSand(groups.topSand, config);
  buildLoadingSystem(groups.loadingSystem, config);

  // Animation loop
  let animationId: number | null = null;
  function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();

    // Subtle gauge pulse
    const t = Date.now() * 0.003;
    groups.gauges.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.userData.isGaugeSphere) {
        const scaleFactor = 1.0 + 0.15 * Math.sin(t + i * 1.5);
        child.scale.setScalar(scaleFactor);
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  return {
    scene,
    camera,
    renderer,
    controls,
    groups,
    animationId,
    dispose: () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    },
  };
}

function setupLighting(scene: THREE.Scene) {
  // Ambient
  const ambient = new THREE.AmbientLight(0x8899bb, 0.5);
  scene.add(ambient);

  // Main directional
  const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
  dirLight.position.set(8, 15, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.setScalar(2048);
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -15;
  dirLight.shadow.camera.right = 15;
  dirLight.shadow.camera.top = 15;
  dirLight.shadow.camera.bottom = -15;
  scene.add(dirLight);

  // Fill light
  const fillLight = new THREE.DirectionalLight(0x6699cc, 0.4);
  fillLight.position.set(-6, 8, -4);
  scene.add(fillLight);

  // Accent light (warm yellow from UTC brand)
  const accentLight = new THREE.PointLight(0xf5b731, 0.3, 30);
  accentLight.position.set(0, 12, 0);
  scene.add(accentLight);
}

function setupFloor(scene: THREE.Scene) {
  const gridHelper = new THREE.GridHelper(30, 30, 0x1e3a6e, 0x0f2744);
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  const floorGeo = new THREE.PlaneGeometry(40, 40);
  const floorMat = new THREE.MeshStandardMaterial({
    color: COLORS.floor,
    roughness: 0.9,
    metalness: 0,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  floor.receiveShadow = true;
  scene.add(floor);
}

function buildTank(group: THREE.Group, config: ModelConfig) {
  const w = s(config.tankWidth);
  const d = s(config.tankDepth);
  const h = s(config.tankHeight);

  // Transparent walls
  const wallMat = new THREE.MeshPhysicalMaterial({
    color: COLORS.tank,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    roughness: 0.1,
    metalness: 0.3,
  });

  // Edge wireframe
  const edgeMat = new THREE.LineBasicMaterial({
    color: COLORS.tankEdge,
    transparent: true,
    opacity: 0.5,
  });

  const boxGeo = new THREE.BoxGeometry(w, h, d);
  const wireGeo = new THREE.EdgesGeometry(boxGeo);
  const wireframe = new THREE.LineSegments(wireGeo, edgeMat);
  wireframe.position.set(0, h / 2, 0);
  group.add(wireframe);

  // Semi-transparent sides (back + bottom)
  const backGeo = new THREE.PlaneGeometry(w, h);
  const back = new THREE.Mesh(backGeo, wallMat);
  back.position.set(0, h / 2, -d / 2);
  group.add(back);

  const sideGeo = new THREE.PlaneGeometry(d, h);
  const leftSide = new THREE.Mesh(sideGeo, wallMat);
  leftSide.position.set(-w / 2, h / 2, 0);
  leftSide.rotation.y = Math.PI / 2;
  group.add(leftSide);

  const bottomGeo = new THREE.PlaneGeometry(w, d);
  const bottom = new THREE.Mesh(bottomGeo, wallMat.clone());
  bottom.material.opacity = 0.15;
  bottom.position.set(0, 0.01, 0);
  bottom.rotation.x = -Math.PI / 2;
  bottom.receiveShadow = true;
  group.add(bottom);
}

function buildBaseSand(group: THREE.Group, config: ModelConfig) {
  const h = s(config.baseSandThickness);
  const w = s(config.tankWidth) * 0.98;
  const d = s(config.tankDepth) * 0.98;

  const sandGeo = new THREE.BoxGeometry(w, h, d);
  const sandMat = new THREE.MeshStandardMaterial({
    color: COLORS.sand,
    roughness: 0.95,
    metalness: 0,
    transparent: true,
    opacity: 0.8,
  });

  const sand = new THREE.Mesh(sandGeo, sandMat);
  sand.position.set(0, h / 2, 0);
  sand.castShadow = true;
  sand.receiveShadow = true;
  group.add(sand);
}

function buildSoil(group: THREE.Group, config: ModelConfig) {
  const w = s(config.tankWidth) * 0.98;
  const d = s(config.tankDepth) * 0.98;
  const h = s(config.soilBedThickness);
  const baseY = s(config.baseSandThickness);

  const soilGeo = new THREE.BoxGeometry(w, h, d);
  const soilMat = new THREE.MeshStandardMaterial({
    color: COLORS.soil,
    roughness: 0.95,
    metalness: 0,
    transparent: true,
    opacity: 0.7,
  });

  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.set(0, baseY + h / 2, 0);
  soil.castShadow = true;
  soil.receiveShadow = true;
  group.add(soil);

  // Top surface with slightly different color
  const topGeo = new THREE.PlaneGeometry(w, d);
  const topMat = new THREE.MeshStandardMaterial({
    color: COLORS.soilTop,
    roughness: 0.85,
    metalness: 0,
    transparent: true,
    opacity: 0.5,
  });
  const topSurface = new THREE.Mesh(topGeo, topMat);
  topSurface.rotation.x = -Math.PI / 2;
  topSurface.position.y = baseY + h + 0.01;
  group.add(topSurface);
}

function buildColumns(group: THREE.Group, config: ModelConfig) {
  const radius = s(config.columnDiameter / 2);
  const height = s(config.columnHeight);
  const baseY = s(config.baseSandThickness);
  const colGeo = new THREE.CylinderGeometry(radius, radius, height, 24);

  config.columnPositions.forEach((pos) => {
    const colMat = new THREE.MeshStandardMaterial({
      color: COLORS.column,
      roughness: 0.6,
      metalness: 0.3,
    });

    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(s(pos[0]), baseY + height / 2, s(pos[1]));
    col.castShadow = true;
    col.receiveShadow = true;
    group.add(col);

    // Inner fill texture (gravel dots)
    const innerGeo = new THREE.CylinderGeometry(
      radius * 0.85,
      radius * 0.85,
      height * 0.98,
      24
    );
    const innerMat = new THREE.MeshStandardMaterial({
      color: COLORS.columnInner,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.4,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.set(s(pos[0]), baseY + height / 2, s(pos[1]));
    group.add(inner);

    // Column head highlight ring
    const ringGeo = new THREE.TorusGeometry(radius * 1.1, radius * 0.08, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: COLORS.stress,
      emissive: COLORS.stress,
      emissiveIntensity: 0.3,
      roughness: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(s(pos[0]), baseY + height, s(pos[1]));
    group.add(ring);
  });
}

function buildGeogrid(group: THREE.Group, config: ModelConfig) {
  const y = s(config.geogridLevel);
  const gridSize = s(config.gridSpacing);
  const extent = gridSize * 3; // 3x3 grid cells

  const gridMat = new THREE.MeshStandardMaterial({
    color: COLORS.geogrid,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
    roughness: 0.3,
    metalness: 0.1,
    emissive: COLORS.geogrid,
    emissiveIntensity: 0.15,
  });

  const wireMat = new THREE.MeshStandardMaterial({
    color: COLORS.geogrid,
    roughness: 0.3,
    metalness: 0.2,
  });

  const colRadius = s(config.columnDiameter / 2);
  const wireRadius = 0.015; // visual wire radius

  // Create grid strands in X direction
  for (let i = -3; i <= 3; i++) {
    const z = i * gridSize;
    const strandGeo = new THREE.CylinderGeometry(
      wireRadius,
      wireRadius,
      extent * 2,
      6
    );
    strandGeo.rotateZ(Math.PI / 2);
    const strand = new THREE.Mesh(strandGeo, wireMat);
    strand.position.set(0, y, z);
    group.add(strand);
  }

  // Create grid strands in Z direction
  for (let i = -3; i <= 3; i++) {
    const x = i * gridSize;
    const strandGeo = new THREE.CylinderGeometry(
      wireRadius,
      wireRadius,
      extent * 2,
      6
    );
    const strand = new THREE.Mesh(strandGeo, wireMat);
    strand.position.set(x, y, 0);
    group.add(strand);
  }

  // Grid intersection nodes
  for (let ix = -3; ix <= 3; ix++) {
    for (let iz = -3; iz <= 3; iz++) {
      const x = ix * gridSize;
      const z = iz * gridSize;

      // Check if this position has a column — make opening visible
      const hasColumn = config.columnPositions.some(
        (p) => Math.abs(s(p[0]) - x) < colRadius && Math.abs(s(p[1]) - z) < colRadius
      );

      if (!hasColumn) {
        // Flat mesh cell to represent grid sheet
        const cellSize = gridSize * 0.85;
        const cellGeo = new THREE.PlaneGeometry(cellSize, cellSize);
        const cell = new THREE.Mesh(cellGeo, gridMat);
        cell.rotation.x = -Math.PI / 2;
        cell.position.set(x, y, z);
        group.add(cell);
      } else {
        // Ring around column opening
        const openingRingGeo = new THREE.TorusGeometry(
          colRadius * 1.3,
          wireRadius * 1.5,
          8,
          24
        );
        const openingRing = new THREE.Mesh(openingRingGeo, wireMat);
        openingRing.rotation.x = Math.PI / 2;
        openingRing.position.set(x, y, z);
        group.add(openingRing);
      }

      // Node sphere at grid intersection
      const nodeGeo = new THREE.SphereGeometry(wireRadius * 2, 8, 8);
      const node = new THREE.Mesh(nodeGeo, wireMat);
      node.position.set(x, y, z);
      group.add(node);
    }
  }
}

function buildGauges(group: THREE.Group, config: ModelConfig) {
  const y = s(config.geogridLevel);

  config.gaugePositions.forEach((pos) => {
    // Small rectangular strain gauge body
    const gaugeBodyGeo = new THREE.BoxGeometry(0.12, 0.03, 0.06);
    const gaugeBodyMat = new THREE.MeshStandardMaterial({
      color: COLORS.gauge,
      emissive: COLORS.gauge,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.5,
    });
    const gaugeBody = new THREE.Mesh(gaugeBodyGeo, gaugeBodyMat);
    gaugeBody.position.set(s(pos[0]) + 0.08, y + 0.025, s(pos[1]));
    gaugeBody.castShadow = true;
    group.add(gaugeBody);

    // Gauge indicator sphere (pulsing)
    const sphereGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: COLORS.gaugeGlow,
      emissive: COLORS.gaugeGlow,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(s(pos[0]) + 0.08, y + 0.06, s(pos[1]));
    sphere.userData.isGaugeSphere = true;
    group.add(sphere);

    // Wire from gauge
    const wirePath = new THREE.LineCurve3(
      new THREE.Vector3(s(pos[0]) + 0.15, y + 0.025, s(pos[1])),
      new THREE.Vector3(s(pos[0]) + 0.5, y + 0.3, s(pos[1]))
    );
    const wireGeo = new THREE.TubeGeometry(wirePath, 8, 0.005, 4, false);
    const wireMat = new THREE.MeshStandardMaterial({
      color: COLORS.gauge,
      roughness: 0.5,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);
  });
}

function buildTopSand(group: THREE.Group, config: ModelConfig) {
  const y = s(config.geogridLevel);
  const h = s(config.sandLayerThickness);
  const w = s(config.tankWidth) * 0.95;
  const d = s(config.tankDepth) * 0.95;

  const sandGeo = new THREE.BoxGeometry(w, h, d);
  const sandMat = new THREE.MeshStandardMaterial({
    color: COLORS.sand,
    transparent: true,
    opacity: 0.35,
    roughness: 0.9,
    metalness: 0,
  });

  const sand = new THREE.Mesh(sandGeo, sandMat);
  sand.position.set(0, y + h / 2, 0);
  sand.castShadow = true;
  group.add(sand);

  // Sand surface — slightly brighter
  const surfGeo = new THREE.PlaneGeometry(w, d);
  const surfMat = new THREE.MeshStandardMaterial({
    color: COLORS.sand,
    transparent: true,
    opacity: 0.5,
    roughness: 0.8,
    side: THREE.DoubleSide,
  });
  const surf = new THREE.Mesh(surfGeo, surfMat);
  surf.rotation.x = -Math.PI / 2;
  surf.position.y = y + h;
  group.add(surf);

  // Particle hints for sand texture
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * w;
    positions[i * 3 + 1] = y + Math.random() * h;
    positions[i * 3 + 2] = (Math.random() - 0.5) * d;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: COLORS.sandDark,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);
}

function buildLoadingSystem(group: THREE.Group, config: ModelConfig) {
  const sandTop = s(config.geogridLevel + config.sandLayerThickness);

  // Loading plate
  const plateGeo = new THREE.BoxGeometry(
    s(config.tankWidth) * 0.4,
    0.08,
    s(config.tankDepth) * 0.6
  );
  const plateMat = new THREE.MeshStandardMaterial({
    color: COLORS.loadingPlate,
    roughness: 0.4,
    metalness: 0.6,
  });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.set(0, sandTop + 0.04, 0);
  plate.castShadow = true;
  group.add(plate);

  // Hydraulic load point indicator (Thesis: no hydraulic jack, just load transfer point)
  const plateGeo2 = new THREE.BoxGeometry(0.15, 0.1, 0.15);
  const plateMat2 = new THREE.MeshStandardMaterial({
    color: COLORS.loading,
    roughness: 0.3,
    metalness: 0.7,
  });
  const plate2 = new THREE.Mesh(plateGeo2, plateMat2);
  plate2.position.set(0, sandTop + 0.08 + 0.05, 0);
  plate2.castShadow = true;
  group.add(plate2);

  // Reaction beam
  const beamGeo = new THREE.BoxGeometry(
    s(config.tankWidth) * 0.7,
    0.12,
    0.2
  );
  const beamMat = new THREE.MeshStandardMaterial({
    color: COLORS.loading,
    roughness: 0.4,
    metalness: 0.5,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.set(0, sandTop + 0.5, 0);
  beam.castShadow = true;
  group.add(beam);

  // Load arrow indicator
  const arrowDir = new THREE.Vector3(0, -1, 0);
  const arrowOrigin = new THREE.Vector3(0, sandTop + 1.0, 0);
  const arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, 0.4, COLORS.arrow, 0.12, 0.08);
  group.add(arrow);

  // "P" label at arrow top
  // We'll handle text labels from the React side
}

// ===================================================================
// Layer Visibility Control
// ===================================================================
export function setLayerVisibility(
  groups: Record<string, THREE.Group>,
  visibility: LayerVisibility
) {
  Object.entries(visibility).forEach(([key, visible]) => {
    if (groups[key]) {
      groups[key].visible = visible;
    }
  });
}

// ===================================================================
// Assembly Animation Helpers
// ===================================================================
export function setAssemblyStep(
  groups: Record<string, THREE.Group>,
  stepIndex: number
) {
  const stepOrder: AssemblyStep[] = [
    'tank',
    'baseSand',
    'soil',
    'columns',
    'geogrid',
    'topSand',
    'gauges',
    'loadingSystem',
    'loading',
  ];

  stepOrder.forEach((step, i) => {
    if (groups[step]) {
      groups[step].visible = i <= stepIndex;
      // Fade effect: recently appearing step is fully opaque
      groups[step].traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          if (i === stepIndex) {
            child.material.opacity = Math.min(child.material.opacity + 0.1, child.userData.originalOpacity ?? child.material.opacity);
          }
        }
      });
    }
  });
}

/** Smoothly move camera to a predefined view */
export function setCameraView(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  view: 'default' | 'top' | 'front' | 'side' | 'detail'
) {
  const positions: Record<string, [number, number, number]> = {
    default: [12, 10, 14],
    top: [0, 20, 0.01],
    front: [0, 4, 18],
    side: [18, 4, 0],
    detail: [4, 7, 5],
  };
  const targets: Record<string, [number, number, number]> = {
    default: [0, 3, 0],
    top: [0, 3, 0],
    front: [0, 3, 0],
    side: [0, 3, 0],
    detail: [0, 5, 0],
  };

  const pos = positions[view] || positions.default;
  const tar = targets[view] || targets.default;

  camera.position.set(...pos);
  controls.target.set(...tar);
  controls.update();
}

// ===================================================================
// Stress Visualization — Experiment Mode
// ===================================================================

/**
 * stressLevel: 0 (no load) → 1 (max load)
 * Updates column colors, adds animated stress glows, and
 * animates load transfer arrows / soil deformation.
 */
export interface StressOverlayRefs {
  particleSystem: THREE.Points;
  stressCones: THREE.Group;
  soilPressureIndicators: THREE.Group;
  update: (time: number, stressLevel: number) => void;
  dispose: () => void;
}

function stressColor(t: number): THREE.Color {
  // t: 0→1 maps blue→cyan→yellow→red
  const low  = new THREE.Color(0x3b82f6); // blue
  const mid  = new THREE.Color(0xf59e0b); // amber
  const high = new THREE.Color(0xef4444); // red
  if (t < 0.5) return low.clone().lerp(mid, t * 2);
  return mid.clone().lerp(high, (t - 0.5) * 2);
}

export function buildStressOverlay(
  scene: THREE.Scene,
  config: ModelConfig
): StressOverlayRefs {
  const stressCones = new THREE.Group();
  const soilPressureIndicators = new THREE.Group();
  scene.add(stressCones);
  scene.add(soilPressureIndicators);

  const baseY = s(config.baseSandThickness);
  const geogridY = s(config.geogridLevel);
  const colHeight = s(config.columnHeight);
  const colRadius = s(config.columnDiameter / 2);

  // Column stress cylinders (overlay on each column, colored by stress)
  const stressOverlayCylinders: { mesh: THREE.Mesh; pos: [number, number] }[] = [];
  config.columnPositions.forEach((pos) => {
    const geo = new THREE.CylinderGeometry(colRadius * 1.05, colRadius * 1.05, colHeight, 20);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0,
      emissive: 0x3b82f6,
      emissiveIntensity: 0,
      roughness: 0.4,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(s(pos[0]), baseY + colHeight / 2, s(pos[1]));
    stressCones.add(mesh);
    stressOverlayCylinders.push({ mesh, pos });
  });

  // Soil pressure discs (show σs on surrounding soil)
  const soilDiscs: THREE.Mesh[] = [];
  const discPositions = [
    [-1.5, 0], [1.5, 0], [0, -1.2], [0, 1.2],
    [-1.5, -1.2], [1.5, 1.2],
  ] as [number, number][];
  discPositions.forEach((pos) => {
    const geo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0,
      emissive: 0xf97316,
      emissiveIntensity: 0,
    });
    const disc = new THREE.Mesh(geo, mat);
    disc.position.set(pos[0], geogridY + 0.02, pos[1]);
    soilPressureIndicators.add(disc);
    soilDiscs.push(disc);
  });

  // Load transfer particles (falling from geogrid → soil & column tops)
  const PARTICLE_COUNT = 120;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT);  // y velocity
  const particlePhase = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * s(config.tankWidth) * 0.5;
    positions[i * 3 + 1] = geogridY + Math.random() * 1.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * s(config.tankDepth) * 0.5;
    velocities[i] = 0.3 + Math.random() * 0.5;
    particlePhase[i] = Math.random() * Math.PI * 2;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xfbbf24,
    size: 0.06,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;

  function update(time: number, stressLevel: number) {
    // 1. Column stress overlay (color + opacity based on stressLevel)
    stressOverlayCylinders.forEach(({ mesh }, i) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const variation = 0.9 + 0.1 * Math.sin(time * 1.5 + i); // subtle pulse
      const effective = Math.min(stressLevel * variation, 1);
      const col = stressColor(effective * 0.85 + 0.15); // column stress is higher → warmer
      mat.color = col;
      mat.emissive = col;
      mat.emissiveIntensity = 0.2 + effective * 0.5;
      mat.opacity = effective * 0.55;
    });

    // 2. Soil pressure discs (orange, lower intensity)
    soilDiscs.forEach((disc, i) => {
      const mat = disc.material as THREE.MeshStandardMaterial;
      const variation = 0.85 + 0.15 * Math.sin(time * 1.2 + i * 0.8);
      const effective = stressLevel * variation * 0.6; // soil pressure is less
      mat.opacity = effective * 0.5;
      mat.emissiveIntensity = effective * 0.3;
    });

    // 3. Particles — animated downward flow (load transfer)
    particleMat.opacity = stressLevel * 0.7;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posAttr.setY(i, posAttr.getY(i) - velocities[i] * 0.018 * stressLevel);
      // Reset when below column bottom
      if (posAttr.getY(i) < baseY + 0.05) {
        posAttr.setX(i, (Math.random() - 0.5) * s(config.tankWidth) * 0.5);
        posAttr.setY(i, geogridY + 0.5 + Math.random() * 0.8);
        posAttr.setZ(i, (Math.random() - 0.5) * s(config.tankDepth) * 0.5);
      }
    }
    posAttr.needsUpdate = true;
  }

  function dispose() {
    scene.remove(stressCones);
    scene.remove(soilPressureIndicators);
    scene.remove(particleSystem);
    particleGeo.dispose();
    particleMat.dispose();
    stressCones.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
    soilPressureIndicators.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
  }

  return { particleSystem, stressCones, soilPressureIndicators, update, dispose };
}
