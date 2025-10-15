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
// Add this code to your script.js file

// Initialize EmailJS with your Public Key
(function() {
    emailjs.init('eJqILxJo73ChbBzKy'); // <--- Replace with your Public Key
})();

window.onload = function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevents the default form submission

            const serviceID = 'service_w0y3dei'; // <--- Replace with your Service ID
            const templateID = 'template_p56ttwl'; // <--- Replace with your Template ID
            
            // Get the form button and update its text
            const submitButton = this.querySelector('.btn-submit');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;

            // Send the email
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    // Success
                    submitButton.innerHTML = '✅ Message Sent!';
                    alert('Your message has been sent successfully!');
                    contactForm.reset(); // Clear the form fields
                    
                    // Reset button after a few seconds
                    setTimeout(() => {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                    }, 4000);

                }, (err) => {
                    // Error
                    submitButton.innerHTML = '⚠️ Error';
                    alert('Failed to send the message. Please try again. Error: ' + JSON.stringify(err));
                    
                    // Reset button after a few seconds
                    setTimeout(() => {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                    }, 4000);
                });
        });
    }
}

// --- Gooey Cursor Setup ---

// 1. Create the SVG filter for the gooey effect
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
  // Base size decreases along the trail
  const baseSize = (bubbles.length - index) * 2.0;
  // Add a random variation to the size for a more organic feel
  const size = baseSize + Math.random() * 4 - 2; 
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubbleCoords.push({ x: 0, y: 0 });

  if (index > 0) {
    // We don't need the 'light' class for this design
  }
});

// --- Cursor Hover Effect ---
const interactiveElements = document.querySelectorAll('a, button, .menu-toggle');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.classList.add('hover'); });
    el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
    });
});


// --- Animation Loop ---
window.addEventListener('mousemove', function (e) {
    coords.x = e.clientX;
    coords.y = e.clientY;
});

function animateBubbles() {
    let x = coords.x;
    let y = coords.y;

    // Move the main dot and outline
    cursorDot.style.left = `${x}px`;
    cursorDot.style.top = `${y}px`;

    // Store a history of cursor positions
    bubbleCoords.unshift({x: x, y: y});
    // Remove the oldest position if the array is longer than the number of bubbles
    if (bubbleCoords.length > bubbles.length) {
        bubbleCoords.pop();
    }

    // Assign each bubble to a historical cursor position
    bubbles.forEach((bubble, index) => {
        const coord = bubbleCoords[index];
        if (coord) {
            bubble.style.left = `${coord.x}px`;
            bubble.style.top = `${coord.y}px`;
            
            // Set opacity based on its position in the trail
            const baseOpacity = (bubbles.length - index) / bubbles.length;
            // Hide bubbles when the main cursor is hovering over an element
            const finalOpacity = cursorDot.classList.contains('hover') ? 0 : baseOpacity;

            bubble.style.opacity = finalOpacity;
        }
    });

    requestAnimationFrame(animateBubbles);
}

animateBubbles();