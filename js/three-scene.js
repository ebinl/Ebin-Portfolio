// Three.js Interactive 3D Cyber Background Scene
class Cyber3DCanvas {
    constructor(containerId = 'webgl-canvas-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.coreMesh = null;
        this.coreWireframe = null;
        this.rings = [];
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        
        this.currentColor = new THREE.Color(0x6366f1); // Indigo
        this.targetColor = new THREE.Color(0x6366f1);

        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x060913, 0.0018);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 120;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Create elements
        this.createParticleConstellation();
        this.createCyberCore();
        this.createOrbitalRings();

        // Listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Touch move for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.targetMouseX = (touch.clientX - window.innerWidth / 2) * 0.05;
                this.targetMouseY = (touch.clientY - window.innerHeight / 2) * 0.05;
            }
        }, { passive: true });

        // Start render loop
        this.animate();
    }

    createParticleConstellation() {
        const particleCount = 280;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 360;
            positions[i + 1] = (Math.random() - 0.5) * 360;
            positions[i + 2] = (Math.random() - 0.5) * 220;
            scales[i / 3] = Math.random() * 2 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        const material = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 2.2,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createCyberCore() {
        // Holographic Icosahedron
        const coreGeo = new THREE.IcosahedronGeometry(22, 1);
        
        // Semi-transparent solid interior
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x1e1b4b,
            wireframe: false,
            transparent: true,
            opacity: 0.25
        });
        this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
        this.coreMesh.position.set(45, -5, -20);
        this.scene.add(this.coreMesh);

        // Glowing outer wireframe cage
        const wireframeMat = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
        });
        this.coreWireframe = new THREE.Mesh(coreGeo, wireframeMat);
        this.coreMesh.add(this.coreWireframe);
    }

    createOrbitalRings() {
        const ringConfigs = [
            { radius: 32, tube: 0.2, color: 0x06b6d4, rotX: 1.2, rotY: 0.5 },
            { radius: 38, tube: 0.15, color: 0x8b5cf6, rotX: 0.7, rotY: 1.1 },
            { radius: 44, tube: 0.18, color: 0x10b981, rotX: 2.1, rotY: 0.8 }
        ];

        ringConfigs.forEach(cfg => {
            const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 8, 80);
            const ringMat = new THREE.MeshBasicMaterial({
                color: cfg.color,
                wireframe: true,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = cfg.rotX;
            ring.rotation.y = cfg.rotY;
            this.coreMesh.add(ring);
            this.rings.push({ mesh: ring, speed: (Math.random() - 0.5) * 0.015 });
        });
    }

    onMouseMove(event) {
        this.targetMouseX = (event.clientX - window.innerWidth / 2) * 0.08;
        this.targetMouseY = (event.clientY - window.innerHeight / 2) * 0.08;
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setTabTheme(tabName) {
        const colorMap = {
            'overview': 0x6366f1,    // Indigo / Cyber
            'experience': 0xa855f7,  // Violet
            'projects': 0x06b6d4,    // Cyan
            'skills': 0x10b981,      // Emerald
            'education': 0x3b82f6,   // Sky Blue
            'connect': 0xf43f5e      // Neon Rose
        };
        const hex = colorMap[tabName] || 0x6366f1;
        this.targetColor.setHex(hex);

        // Adjust core mesh position slightly for dynamic feel
        if (this.coreMesh) {
            const positions = {
                'overview': { x: 45, y: -5, z: -20 },
                'experience': { x: -45, y: 10, z: -15 },
                'projects': { x: 50, y: -10, z: -25 },
                'skills': { x: -40, y: -15, z: -10 },
                'education': { x: 40, y: 15, z: -30 },
                'connect': { x: 0, y: -25, z: -10 }
            };
            const targetPos = positions[tabName] || { x: 45, y: -5, z: -20 };
            gsap.to(this.coreMesh.position, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                duration: 1.2,
                ease: "power2.out"
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth mouse lag
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // Camera subtle sway
        this.camera.position.x = this.mouseX * 0.35;
        this.camera.position.y = -this.mouseY * 0.35;
        this.camera.lookAt(0, 0, 0);

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y += 0.0008;
            this.particles.rotation.x += 0.0004;
        }

        // Rotate core
        if (this.coreMesh) {
            this.coreMesh.rotation.y += 0.007;
            this.coreMesh.rotation.x += 0.004;
        }

        // Rotate rings
        this.rings.forEach(item => {
            item.mesh.rotation.z += item.speed;
        });

        // Color interpolation
        this.currentColor.lerp(this.targetColor, 0.05);
        if (this.coreWireframe) {
            this.coreWireframe.material.color.copy(this.currentColor);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.Cyber3DCanvas = Cyber3DCanvas;
