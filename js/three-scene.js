/* ==========================================================================
   MM PROPERTIES - THREE.JS 3D ARCHITECTURAL HERO SCENE
   Interactive geometric 3D floating structure with gold particle field
   ========================================================================== */

(function initThreeHeroScene() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined' || window.getComputedStyle(canvas).display === 'none') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 8.5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const goldPointLight = new THREE.PointLight(0xd4af37, 3.5, 50);
  goldPointLight.position.set(5, 5, 5);
  scene.add(goldPointLight);

  const cyanPointLight = new THREE.PointLight(0x38bdf8, 2, 50);
  cyanPointLight.position.set(-6, -4, 4);
  scene.add(cyanPointLight);

  // 1. Central Architectural Polyhedron (Faceted Luxury Core)
  const geomCore = new THREE.IcosahedronGeometry(3.2, 1);
  const matWireframe = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    roughness: 0.2,
    metalness: 0.8
  });
  const coreMesh = new THREE.Mesh(geomCore, matWireframe);
  scene.add(coreMesh);

  // 2. Inner Nested Crystal
  const innerGeom = new THREE.OctahedronGeometry(2, 0);
  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0x101b2b,
    emissive: 0xaa820a,
    emissiveIntensity: 0.2,
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.85
  });
  const innerMesh = new THREE.Mesh(innerGeom, innerMat);
  scene.add(innerMesh);

  // 3. Floating Architectural Rings (Rotational Orbital Elements)
  const ringGeom = new THREE.TorusGeometry(4.2, 0.02, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xf5df88,
    transparent: true,
    opacity: 0.4
  });
  const ring1 = new THREE.Mesh(ringGeom, ringMat);
  ring1.rotation.x = Math.PI / 3;
  scene.add(ring1);

  const ring2 = new THREE.Mesh(ringGeom, ringMat);
  ring2.rotation.y = Math.PI / 4;
  ring2.scale.set(1.15, 1.15, 1.15);
  scene.add(ring2);

  // 4. Ambient Luxury Golden Particle Field
  const particleCount = 280;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleScales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 25;
    particlePositions[i + 1] = (Math.random() - 0.5) * 20;
    particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    particleScales[i / 3] = Math.random();
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(particlePositions, 3)
  );

  // Create Gold Star Texture
  const canvasTexture = document.createElement('canvas');
  canvasTexture.width = 32;
  canvasTexture.height = 32;
  const ctx = canvasTexture.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(245, 223, 136, 1)');
  gradient.addColorStop(0.3, 'rgba(212, 175, 55, 0.7)');
  gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const pTexture = new THREE.CanvasTexture(canvasTexture);
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xf5df88,
    size: 0.35,
    map: pTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Mouse Interaction Variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.0012;
    mouseY = (e.clientY - windowHalfY) * 0.0012;
  });

  // Smooth Window Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop with Smooth Interpolation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Damping mouse movement
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate Meshes
    coreMesh.rotation.y = elapsedTime * 0.08 + targetX * 1.5;
    coreMesh.rotation.x = elapsedTime * 0.05 + targetY * 1.5;

    innerMesh.rotation.y = -elapsedTime * 0.12 - targetX;
    innerMesh.rotation.x = -elapsedTime * 0.09 - targetY;

    ring1.rotation.z = elapsedTime * 0.05;
    ring1.rotation.x = Math.PI / 3 + targetY * 0.8;
    ring2.rotation.y = elapsedTime * 0.07;

    particleSystem.rotation.y = elapsedTime * 0.02 + targetX * 0.5;
    particleSystem.rotation.x = elapsedTime * 0.01 + targetY * 0.5;

    // Floating subtle camera motion
    camera.position.x += (targetX * 2 - camera.position.x) * 0.03;
    camera.position.y += (-targetY * 2 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();
