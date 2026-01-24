document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 60; // Number of stars
    const connectionDistance = 150; // Max distance to connect
    const mouseDistance = 200; // Max distance to connect to mouse

    // Theme Colors
    let particleColor = 'rgba(0, 0, 0, 0.5)';
    let lineColor = 'rgba(0, 0, 0, 0.05)';

    // Mouse State
    const mouse = { x: null, y: null };

    // Update dimensions
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // Check Theme
    function updateTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            particleColor = 'rgba(255, 255, 255, 0.5)';
            lineColor = 'rgba(255, 255, 255, 0.05)';
        } else {
            particleColor = 'rgba(0, 0, 0, 0.5)';
            lineColor = 'rgba(0, 0, 0, 0.05)';
        }
    }

    // Initial Setup
    resize();
    updateTheme();
    window.addEventListener('resize', resize);

    // Watch for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Track Mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Velocity X
            this.vy = (Math.random() - 0.5) * 0.5; // Velocity Y
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect particles
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Connect to mouse
            if (mouse.x != null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    // Stronger line for mouse connection
                    ctx.strokeStyle = particleColor;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
});
