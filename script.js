// ===== CODER-DESIGN 3D ANIMATION ENGINE =====
let scene, camera, renderer;
let codeStream = [];
let brainNodes = [];
let connections;

function initThreeJS() {
  scene = new THREE.Scene();
  // Deep dark code-editor background
  scene.background = new THREE.Color(0x05080a);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 100;

  const canvas = document.getElementById("canvas-bg");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  createDigitalRain();
  createTechNodeMesh();

  window.addEventListener("resize", onResize);
  document.addEventListener("mousemove", onMouseMove);
  animate();
}

// 1. Digital "Matrix" Rain Effect
function createDigitalRain() {
  const chars = "01<>{}[]/\\+=!$";
  const count = 400;

  for (let i = 0; i < count; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#00ffcc";
    ctx.font = "bold 40px monospace";
    ctx.textAlign = "center";
    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], 32, 45);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.6 });
    const sprite = new THREE.Sprite(material);

    sprite.position.set(
      (Math.random() - 0.5) * 400,
      (Math.random() - 0.5) * 400,
      (Math.random() - 0.5) * 200
    );
    
    sprite.scale.set(4, 4, 1);
    sprite.userData.speed = 0.5 + Math.random() * 1.5;
    
    codeStream.push(sprite);
    scene.add(sprite);
  }
}

// 2. Central Geometric Node Mesh (Tech Brain)
function createTechNodeMesh() {
  const geometry = new THREE.IcosahedronGeometry(40, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffcc,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });

  const mainMesh = new THREE.Mesh(geometry, material);
  mainMesh.name = "core";
  scene.add(mainMesh);

  // Add glowing points at vertices
  const pointsMat = new THREE.PointsMaterial({
    color: 0x58a6ff,
    size: 1.5,
    transparent: true
  });
  const points = new THREE.Points(geometry, pointsMat);
  mainMesh.add(points);
}

// Global rotation variables for mouse tracking
let targetX = 0, targetY = 0;

function animate() {
  requestAnimationFrame(animate);

  // Animate Code Rain
  codeStream.forEach(p => {
    p.position.y -= p.userData.speed;
    if (p.position.y < -200) p.position.y = 200;
  });

  // Rotate Core Mesh based on mouse
  const core = scene.getObjectByName("core");
  if (core) {
    core.rotation.y += 0.002;
    core.rotation.x += (targetY - core.rotation.x) * 0.05;
    core.rotation.y += (targetX - core.rotation.y) * 0.05;
  }

  renderer.render(scene, camera);
}

function onMouseMove(e) {
  targetX = (e.clientX - window.innerWidth / 2) * 0.001;
  targetY = (e.clientY - window.innerHeight / 2) * 0.001;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
// Theme Toggle Logic
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  
  // Update icon and Three.js background colors
  if (body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
    if(scene) scene.background = new THREE.Color(0x05080a); // Deep Dark
  } else {
    themeToggle.textContent = "🌙";
    if(scene) scene.background = new THREE.Color(0xf0f2f5); // Light Gray
  }
});
window.addEventListener("load", initThreeJS);

