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

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const bubbles = document.querySelectorAll('.cursor-bubble');

const coords = { x: 0, y: 0 };
const bubbleCoords = [];

bubbles.forEach((bubble, index) => {
  const size = (bubbles.length - index) * 2;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubbleCoords.push({ x: 0, y: 0 });
  bubble.style.transitionDelay = `${index * 0.02}s`;
});

window.addEventListener('mousemove', function (e) {
    coords.x = e.clientX;
    coords.y = e.clientY;
});

let animationFrameId;

function animateBubbles() {
    let x = coords.x;
    let y = coords.y;

    cursorDot.style.left = `${x}px`;
    cursorDot.style.top = `${y}px`;

    cursorOutline.style.left = `${x}px`;
    cursorOutline.style.top = `${y}px`;

    bubbleCoords.unshift({x: x, y: y});
    if (bubbleCoords.length > bubbles.length) {
        bubbleCoords.pop();
    }

    bubbles.forEach((bubble, index) => {
        const coord = bubbleCoords[index];
        if (coord) {
            bubble.style.left = `${coord.x}px`;
            bubble.style.top = `${coord.y}px`;
            bubble.style.opacity = (bubbles.length - index) / bubbles.length;
        }
    });

    animationFrameId = requestAnimationFrame(animateBubbles);
}

// Stop the old animation if it's running
if (window.animationFrameId) {
    cancelAnimationFrame(window.animationFrameId);
}
animateBubbles();