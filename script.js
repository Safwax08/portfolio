// ===== MERGED 3D TUNNEL + FLOATING OBJECTS + CODE PARTICLES =====
let scene, camera, renderer;
let tunnelParticles = [];
let floatingCubes = [];
let codeParticles = [];

let mouseX = 0, mouseY = 0;

function initThreeJS() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000b14);

  const width = window.innerWidth;
  const height = window.innerHeight;

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
  camera.position.z = 80;

  const canvas = document.getElementById("canvas-bg");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  createTunnelParticles();
  createFloatingCubes();
  createCodeParticles();

  window.addEventListener("resize", onResize);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("touchstart", onTouchMove, { passive: false });
  document.addEventListener("touchmove", onTouchMove, { passive: false });

  animate();
}

// ======================= TUNNEL PARTICLES =======================

function createTunnelParticles() {
  const symbols = "01<>$#@%";

  for (let i = 0; i < 600; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    const char = symbols[Math.floor(Math.random() * symbols.length)];
    ctx.fillStyle = "#00ff99";
    ctx.shadowColor = "#00ffaa";
    ctx.shadowBlur = 20;
    ctx.font = "bold 48px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
      })
    );

    const angle = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * 45;

    sprite.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      -i * 5
    );

    sprite.scale.set(3, 3, 1);
    sprite.userData.speed = 1.5 + Math.random() * 2;

    tunnelParticles.push(sprite);
    scene.add(sprite);
  }
}

// ======================= FLOATING CUBES =======================

function generateCodeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(0,255,180,0.9)";
  ctx.shadowColor = "#00ffaa";
  ctx.shadowBlur = 20;
  ctx.font = "bold 28px monospace";

  const symbols = "01<>#@$%";
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const char = symbols[Math.floor(Math.random() * symbols.length)];
    ctx.fillText(char, x, y);
  }

  return new THREE.CanvasTexture(canvas);
}

function createFloatingCubes() {
  const texture = generateCodeTexture();

  for (let i = 0; i < 5; i++) {
    const geo = new THREE.IcosahedronGeometry(12, 0); // Star-like polyhedral shape
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      emissive: 0x00ffaa,
      emissiveIntensity: 1.2, // Increased glow for stars
      metalness: 0.8,
      roughness: 0.1
    });

    const star = new THREE.Mesh(geo, mat);

    star.position.set(
      (Math.random() - 0.5) * 180,
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 250
    );

    star.userData.rotateX = 0.003 + Math.random() * 0.01;
    star.userData.rotateY = 0.003 + Math.random() * 0.01;

    floatingCubes.push(star);
    scene.add(star);
  }

  const light = new THREE.PointLight(0x00ffaa, 2, 500);
  light.position.set(0, 0, 100);
  scene.add(light);
}

// ======================= CODE SPRITE PARTICLES =======================

function createCodeParticles() {
  for (let i = 0; i < 300; i++) {
    const texture = generateCodeTexture();
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        opacity: 0.8,
        transparent: true
      })
    );

    sprite.position.set(
      (Math.random() - 0.5) * 350,
      (Math.random() - 0.5) * 350,
      (Math.random() - 0.5) * 350
    );

    sprite.scale.set(5, 5, 1);
    sprite.userData.speed = 0.3 + Math.random();

    codeParticles.push(sprite);
    scene.add(sprite);
  }
}

// ======================= ANIMATION LOOP =======================

function animate() {
  requestAnimationFrame(animate);

  // Tunnel motion
  tunnelParticles.forEach(p => {
    p.position.z += p.userData.speed;
    if (p.position.z > 80) p.position.z = -3000;
  });

  // Floating cubes rotation
  floatingCubes.forEach(cube => {
    cube.rotation.x += cube.userData.rotateX;
    cube.rotation.y += cube.userData.rotateY;
  });

  // Code particles drifting downward
  codeParticles.forEach(p => {
    p.position.y -= p.userData.speed;
    if (p.position.y < -200) p.position.y = 200;
  });

  // Camera motion based on mouse
  camera.rotation.x = mouseY * 0.0002;
  camera.rotation.y = mouseX * 0.0002;

  renderer.render(scene, camera);
}

// ======================= EVENTS =======================

function onMouseMove(e) {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = e.clientY - window.innerHeight / 2;
}

function onTouchMove(e) {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    mouseX = touch.clientX - window.innerWidth / 2;
    mouseY = touch.clientY - window.innerHeight / 2;

    // Sync custom cursor coordinates for mobile
    coords.x = touch.clientX;
    coords.y = touch.clientY;
  }
}

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("load", initThreeJS);


// ===== ORIGINAL PORTFOLIO FUNCTIONALITY =====

// Dark/Light mode toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// Initialize EmailJS with your Public Key
(function () {
  emailjs.init('eJqILxJo73ChbBzKy');
})();

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

// --- Gooey Cursor Setup ---
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

bubbles.forEach((bubble, index) => {
  const baseSize = (bubbles.length - index) * 2.0;
  const size = baseSize + Math.random() * 4 - 2;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubbleCoords.push({ x: 0, y: 0 });
});

const interactiveElements = document.querySelectorAll('a, button, .menu-toggle');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => { cursorDot.classList.add('hover'); });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hover');
  });
});

window.addEventListener('mousemove', function (e) {
  coords.x = e.clientX;
  coords.y = e.clientY;
});

function animateBubbles() {
  let x = coords.x;
  let y = coords.y;

  cursorDot.style.left = `${x}px`;
  cursorDot.style.top = `${y}px`;

  bubbleCoords.unshift({ x: x, y: y });
  if (bubbleCoords.length > bubbles.length) {
    bubbleCoords.pop();
  }

  bubbles.forEach((bubble, index) => {
    const coord = bubbleCoords[index];
    if (coord) {
      bubble.style.left = `${coord.x}px`;
      bubble.style.top = `${coord.y}px`;

      const baseOpacity = (bubbles.length - index) / bubbles.length;
      const finalOpacity = cursorDot.classList.contains('hover') ? 0 : baseOpacity;

      bubble.style.opacity = finalOpacity;
    }
  });

  requestAnimationFrame(animateBubbles);
}

animateBubbles();