// WebGL Spacetime Particle Engine
const vertexShader = `
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_gravity_strength;
    
    attribute float a_size;
    attribute vec3 a_color;
    
    varying vec3 v_color;
    varying float v_distance;

    void main() {
        v_color = a_color;
        
        // Base position
        vec3 pos = position;
        
        // 1. Fluid Ocean Wave Motion
        // Create complex waves by combining sine waves of different frequencies
        float waveX = sin(pos.x * 0.5 + u_time * 0.5) * 0.2;
        float waveZ = cos(pos.z * 0.5 + u_time * 0.4) * 0.2;
        float waveY = sin(pos.x * 0.8 + pos.z * 0.8 + u_time * 0.8) * 0.3;
        
        pos.y += waveX + waveZ + waveY;
        
        // 2. Spacetime Gravity Bending (Cursor Interaction)
        // Convert mouse from normalized device coordinates (-1 to 1) to world space approx
        vec3 mousePos = vec3(u_mouse.x * 10.0, u_mouse.y * 10.0, 0.0);
        
        // Calculate distance from particle to mouse in XY plane
        float dist = distance(pos.xy, mousePos.xy);
        v_distance = dist;
        
        // Apply gravitational pull: stronger closer to the mouse
        // We use an exponential decay for a sharp, realistic gravity well
        float gravityEffect = exp(-dist * 0.5) * u_gravity_strength;
        
        // Pull towards mouse
        vec2 dir = normalize(mousePos.xy - pos.xy);
        pos.x += dir.x * gravityEffect;
        pos.y += dir.y * gravityEffect;
        // Bend Z space (pull forward towards viewer)
        pos.z += gravityEffect * 2.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Size attenuation based on depth
        gl_PointSize = a_size * (30.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    varying vec3 v_color;
    varying float v_distance;

    void main() {
        // Create a soft circular particle
        float distToCenter = distance(gl_PointCoord, vec2(0.5));
        if (distToCenter > 0.5) discard;
        
        // Soft edge gradient
        float alpha = (0.5 - distToCenter) * 2.0;
        
        // Enhance brightness near the gravity well (mouse)
        float glow = exp(-v_distance * 0.5) * 2.0;
        vec3 finalColor = v_color + vec3(glow * 0.2, glow * 0.5, glow);
        
        gl_FragColor = vec4(finalColor, alpha * 0.8);
    }
`;

class SpacetimeEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container || typeof THREE === 'undefined') return;

        this.scene = new THREE.Scene();
        // Dark space background
        this.scene.background = new THREE.Color(0x0a0510); 
        this.scene.fog = new THREE.FogExp2(0x0a0510, 0.05);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.position.y = 2;
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        this.container.appendChild(this.renderer.domElement);

        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);
        this.clock = new THREE.Clock();

        this.initParticles();
        this.addEventListeners();
        this.animate();
    }

    initParticles() {
        // Reduced density: 30,000 particles (was 60,000)
        const particleCount = 30000;
        const geometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Color palettes (Neon Cyan, Pink, Gold, Deep Purple)
        const palettes = [
            new THREE.Color(0x00f3ff), // Cyan
            new THREE.Color(0xff00ea), // Pink
            new THREE.Color(0xD4A843), // Gold
            new THREE.Color(0x4a00e0)  // Purple
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Spread particles across a wide 3D space
            positions[i3] = (Math.random() - 0.5) * 40;     // X
            positions[i3 + 1] = (Math.random() - 0.5) * 10; // Y (thinner layer)
            positions[i3 + 2] = (Math.random() - 0.5) * 40; // Z

            // Assign random color from palette, with bias towards cyan/purple
            let color;
            const rand = Math.random();
            if (rand < 0.4) color = palettes[0];
            else if (rand < 0.7) color = palettes[3];
            else if (rand < 0.9) color = palettes[1];
            else color = palettes[2];

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Varying sizes
            sizes[i] = Math.random() * 2.0 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('a_color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('a_size', new THREE.BufferAttribute(sizes, 1));

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_mouse: { value: new THREE.Vector2(0, 0) },
                u_gravity_strength: { value: 0.0 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.points = new THREE.Points(geometry, this.material);
        
        // Tilt the whole fabric slightly
        this.points.rotation.x = Math.PI * 0.1;
        this.scene.add(this.points);
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('mousemove', (event) => {
            // Normalize mouse coordinates to -1 to +1
            this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            // Increase gravity strength when mouse is active
            this.material.uniforms.u_gravity_strength.value = 3.0; 
        });

        document.addEventListener('mouseleave', () => {
            // Relax gravity when mouse leaves window
            this.material.uniforms.u_gravity_strength.value = 0.0;
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Smoothly interpolate mouse position for fluid gravity movement
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Update uniforms
        this.material.uniforms.u_time.value = elapsedTime;
        this.material.uniforms.u_mouse.value = this.mouse;

        // Slowly rotate the entire galaxy/fabric
        this.points.rotation.y = elapsedTime * 0.02;

        // Add subtle parallax to camera based on mouse
        this.camera.position.x = this.mouse.x * 1.5;
        this.camera.position.y = 2 + this.mouse.y * 1.5;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Only init if we are on a browser that supports WebGL
    try {
        window.spacetimeEngine = new SpacetimeEngine('bg-canvas');
    } catch (e) {
        console.error("WebGL Spacetime Engine failed to initialize:", e);
    }
});
