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

window.addEventListener("load", initThreeJS);

// ===== BUBBLE CURSOR IMPLEMENTATION =====

// Setup SVG filter for gooey effect
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.innerHTML = `
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
      <feBlend in="SourceGraphic" in2="goo" />
    </filter>
  </defs>`;
document.body.appendChild(svg);

const cursorDot = document.querySelector('.cursor-dot');
const bubbles = document.querySelectorAll('.cursor-bubble');

const coords = { x: 0, y: 0 };
const bubbleCoords = [];

// Initialize bubble sizes with variation
bubbles.forEach((bubble, index) => {
  const baseSize = (bubbles.length - index) * 3;
  const size = baseSize + Math.random() * 4 - 2;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubbleCoords.push({ x: 0, y: 0 });
});

// Add hover effect for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .menu-toggle');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hover');
  });
});

// Track mouse movement
window.addEventListener('mousemove', function (e) {
  coords.x = e.clientX;
  coords.y = e.clientY;
});

// Animate bubbles to follow cursor
function animateBubbles() {
  let x = coords.x;
  let y = coords.y;

  // Position main cursor dot
  cursorDot.style.left = `${x}px`;
  cursorDot.style.top = `${y}px`;

  // Update bubble trail
  bubbleCoords.unshift({ x: x, y: y });
  if (bubbleCoords.length > bubbles.length) {
    bubbleCoords.pop();
  }

  // Position each bubble with smooth trailing effect
  bubbles.forEach((bubble, index) => {
    const coord = bubbleCoords[index];
    if (coord) {
      bubble.style.left = `${coord.x}px`;
      bubble.style.top = `${coord.y}px`;

      // Fade out bubbles based on distance from cursor
      const baseOpacity = (bubbles.length - index) / bubbles.length * 0.6;
      const finalOpacity = cursorDot.classList.contains('hover') ? 0 : baseOpacity;

      bubble.style.opacity = finalOpacity;
    }
  });

  requestAnimationFrame(animateBubbles);
}

animateBubbles();

// ===== PORTFOLIO FUNCTIONALITY =====

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// Initialize EmailJS
(function () {
  emailjs.init('eJqILxJo73ChbBzKy');
})();

// Contact form submission
window.onload = function () {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const serviceID = 'service_w0y3dei';
      const templateID = 'template_p56ttwl';

      const submitButton = this.querySelector('.btn-submit');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = 'Sending...';
      submitButton.disabled = true;

      emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          submitButton.innerHTML = '✅ Message Sent!';
          alert('Your message has been sent successfully!');
          contactForm.reset();

          setTimeout(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
          }, 4000);

        }, (err) => {
          submitButton.innerHTML = '⚠️ Error';
          alert('Failed to send the message. Please try again. Error: ' + JSON.stringify(err));

          setTimeout(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
          }, 4000);
        });
    });
  }
};
