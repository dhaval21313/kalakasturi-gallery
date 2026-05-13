// Gradient Cursor Implementation

document.addEventListener('DOMContentLoaded', () => {
    const cursorContainer = document.getElementById('cursor-container');
    const cursorMain = document.getElementById('cursor-main');
    
    if (!cursorContainer || !cursorMain) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isVisible = false;
    let hue = 0;
    
    // Add mouse event listeners
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isVisible) {
            cursorMain.style.display = 'block';
            isVisible = true;
        }

        // Update main cursor position immediately (with slight CSS transition for smoothness)
        cursorMain.style.left = `${mouseX}px`;
        cursorMain.style.top = `${mouseY}px`;
        
        // Calculate hue based on X position
        hue = mouseX % 360;
        
        // Update main cursor styles
        cursorMain.style.background = `radial-gradient(circle at center, hsl(${hue}, 100%, 70%), hsl(${(hue + 60) % 360}, 100%, 60%))`;
        cursorMain.style.boxShadow = `0 0 20px hsl(${hue}, 100%, 50%, 0.5)`;

        // Spawn particles
        spawnParticles();
    });

    document.addEventListener('mouseleave', () => {
        cursorMain.style.display = 'none';
        isVisible = false;
    });

    function spawnParticles() {
        // Spawn 3 particles per move
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            
            // Randomize position around mouse
            const pX = mouseX + (Math.random() - 0.5) * 20;
            const pY = mouseY + (Math.random() - 0.5) * 20;
            
            // Randomize size and intensity
            const size = Math.random() * 3 + 2;
            const intensity = Math.random() * 0.5 + 0.5;
            const pColorHue = (hue + i * 10) % 360;
            
            particle.style.position = 'absolute';
            particle.style.left = `${pX}px`;
            particle.style.top = `${pY}px`;
            particle.style.width = '0px';
            particle.style.height = '0px';
            particle.style.borderRadius = '50%';
            particle.style.mixBlendMode = 'screen';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.pointerEvents = 'none';
            particle.style.transition = 'width 1s ease-out, height 1s ease-out, opacity 1s ease-out';
            
            particle.style.background = `radial-gradient(circle at center, hsl(${pColorHue}, 100%, ${70 + intensity * 30}%), transparent)`;
            particle.style.filter = 'blur(2px)';
            particle.style.boxShadow = `0 0 ${size * 2}px hsla(${pColorHue}, 100%, 50%, ${intensity})`;
            
            // Initial state
            particle.style.opacity = intensity.toString();
            
            cursorContainer.appendChild(particle);
            
            // Trigger animation in next frame
            requestAnimationFrame(() => {
                particle.style.width = `${size * 4}px`;
                particle.style.height = `${size * 4}px`;
                particle.style.opacity = '0';
            });
            
            // Clean up particle after animation (1s)
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
});
