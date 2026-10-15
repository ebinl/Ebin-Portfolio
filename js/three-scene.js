// Three.js Interactive 3D Cyber Background Scene - Ultra-High Fidelity
class Cyber3DCanvas {
    constructor(containerId = 'webgl-canvas-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particlePositions = null;
        this.particleOriginals = null;
        this.particleCount = 420;

        // Core holographic objects
        this.coreGroup = null;
        this.coreMesh = null;
        this.coreWireframe = null;
        this.torusKnot = null;
        this.coreNucleus = null;
        this.rings = [];
        this.satellites = [];

        // Undulating Cyber Matrix Terrain Grid
        this.terrainGrid = null;
        this.terrainGeometry = null;

        // Interactive shockwaves & sparks
        this.shockwaves = [];
        this.sparks = [];

        // Lighting
        this.pointLight = null;
        this.rimLight1 = null;
        this.rimLight2 = null;

        // Mouse & Orbiting physics
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.orbitRotX = 0;
        this.orbitRotY = 0;
        this.targetOrbitRotX = 0;
        this.targetOrbitRotY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;

        // Color theme & visual FX mode
        this.currentColor = new THREE.Color(0x6366f1);
        this.targetColor = new THREE.Color(0x6366f1);
        this.clock = new THREE.Clock();
        
        // 3D FX Modes: 0 = 'Cyber Core', 1 = 'Hyperspace Warp', 2 = 'Quantum Matrix'
        this.fxModes = ['Cyber Core', 'Hyperspace Warp', 'Quantum Matrix'];
        this.currentModeIndex = 0;

        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x060913, 0.0016);

        // Perspective Camera
        this.camera = new THREE.PerspectiveCamera(
            58,
            window.innerWidth / window.innerHeight,
            0.1,
            1200
        );
        this.camera.position.set(0, 0, 120);

        // WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Add 3D Lighting
        this.setupLights();

        // Build 3D Cyber Universe
        this.createParticleConstellation();
        this.createCyberCore();
        this.createOrbitalSatellites();
        this.createCyberMatrixTerrain();

        // Event Listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Mobile touch move
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.targetMouseX = (touch.clientX - window.innerWidth / 2) * 0.06;
                this.targetMouseY = (touch.clientY - window.innerHeight / 2) * 0.06;
            }
        }, { passive: true });

        // Interactive 3D Click Shockwaves
        window.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        window.addEventListener('pointermove', (e) => this.onPointerDrag(e));
        window.addEventListener('pointerup', () => this.onPointerUp());

        // Start 60fps Animation Loop
        this.animate();
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x0f172a, 1.4);
        this.scene.add(ambientLight);

        // Interactive cursor point light
        this.pointLight = new THREE.PointLight(0x6366f1, 2.8, 280);
        this.pointLight.position.set(0, 0, 60);
        this.scene.add(this.pointLight);

        // Dual chromatic rim lights
        this.rimLight1 = new THREE.DirectionalLight(0x06b6d4, 1.3);
        this.rimLight1.position.set(-80, 70, 40);
        this.scene.add(this.rimLight1);

        this.rimLight2 = new THREE.DirectionalLight(0xf43f5e, 1.0);
        this.rimLight2.position.set(80, -60, -30);
        this.scene.add(this.rimLight2);
    }

    createParticleConstellation() {
        const geometry = new THREE.BufferGeometry();
        this.particlePositions = new Float32Array(this.particleCount * 3);
        this.particleOriginals = new Float32Array(this.particleCount * 3);
        const scales = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount * 3; i += 3) {
            const x = (Math.random() - 0.5) * 420;
            const y = (Math.random() - 0.5) * 360;
            const z = (Math.random() - 0.5) * 280;

            this.particlePositions[i] = x;
            this.particlePositions[i + 1] = y;
            this.particlePositions[i + 2] = z;

            this.particleOriginals[i] = x;
            this.particleOriginals[i + 1] = y;
            this.particleOriginals[i + 2] = z;

            scales[i / 3] = Math.random() * 2.5 + 1.0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        const material = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 2.4,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createCyberCore() {
        this.coreGroup = new THREE.Group();
        this.coreGroup.position.set(45, -5, -20);
        this.scene.add(this.coreGroup);
        this.coreMesh = this.coreGroup; // Backwards compatibility for tab positioning

        // 1. Holographic Outer Icosahedron
        const coreGeo = new THREE.IcosahedronGeometry(23, 1);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x1e1b4b,
            wireframe: false,
            transparent: true,
            opacity: 0.2
        });
        const solidCore = new THREE.Mesh(coreGeo, coreMat);
        this.coreGroup.add(solidCore);

        // Outer wireframe with glowing cyan/indigo edges
        const wireframeMat = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
        });
        this.coreWireframe = new THREE.Mesh(coreGeo, wireframeMat);
        this.coreGroup.add(this.coreWireframe);

        // 2. High-Tech Inner Torus Knot (Awwwards 3D signature element)
        const knotGeo = new THREE.TorusKnotGeometry(12, 3.2, 100, 16, 2, 3);
        const knotMat = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            wireframe: true,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending
        });
        this.torusKnot = new THREE.Mesh(knotGeo, knotMat);
        this.coreGroup.add(this.torusKnot);

        // 3. Central Pulsing Nucleus Octahedron
        const nucleusGeo = new THREE.OctahedronGeometry(6.5, 0);
        const nucleusMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        this.coreNucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
        this.coreGroup.add(this.coreNucleus);

        // 4. Multi-Axis Orbital Rings
        const ringConfigs = [
            { radius: 34, tube: 0.22, color: 0x06b6d4, rotX: 1.2, rotY: 0.5 },
            { radius: 40, tube: 0.18, color: 0x8b5cf6, rotX: 0.7, rotY: 1.1 },
            { radius: 46, tube: 0.20, color: 0x10b981, rotX: 2.1, rotY: 0.8 }
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
            this.coreGroup.add(ring);
            this.rings.push({ mesh: ring, speed: (Math.random() - 0.5) * 0.015 });
        });
    }

    createOrbitalSatellites() {
        // Orbiting polyhedra cluster (Octahedron, Dodecahedron, Tetrahedron)
        const satelliteDefs = [
            { geo: new THREE.OctahedronGeometry(3.5), radius: 52, speed: 0.012, color: 0x38bdf8, yOffset: 12 },
            { geo: new THREE.TetrahedronGeometry(3.2), radius: 60, speed: -0.015, color: 0xa855f7, yOffset: -14 },
            { geo: new THREE.DodecahedronGeometry(3.8), radius: 68, speed: 0.009, color: 0x10b981, yOffset: 8 },
            { geo: new THREE.OctahedronGeometry(2.8), radius: 76, speed: -0.011, color: 0xf43f5e, yOffset: -10 }
        ];

        satelliteDefs.forEach(def => {
            const mat = new THREE.MeshBasicMaterial({
                color: def.color,
                wireframe: true,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            const mesh = new THREE.Mesh(def.geo, mat);
            this.coreGroup.add(mesh);
            this.satellites.push({
                mesh,
                radius: def.radius,
                speed: def.speed,
                angle: Math.random() * Math.PI * 2,
                yOffset: def.yOffset
            });
        });
    }

    createCyberMatrixTerrain() {
        // Undulating Tron-like 3D Wireframe Wave Plane
        const width = 360;
        const height = 360;
        const segments = 36;
        this.terrainGeometry = new THREE.PlaneGeometry(width, height, segments, segments);

        const terrainMat = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            wireframe: true,
            transparent: true,
            opacity: 0.16,
            blending: THREE.AdditiveBlending
        });

        this.terrainGrid = new THREE.Mesh(this.terrainGeometry, terrainMat);
        this.terrainGrid.rotation.x = -Math.PI / 2.3;
        this.terrainGrid.position.set(0, -52, -20);
        this.scene.add(this.terrainGrid);
    }

    // Trigger 3D Holographic Shockwave on Click
    createShockwaveAt(x, y) {
        // Convert screen coordinates to normalized device coordinates
        const mouseNorm = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );

        const shockGeo = new THREE.TorusGeometry(3, 0.4, 8, 48);
        const shockMat = new THREE.MeshBasicMaterial({
            color: this.currentColor,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        const shockMesh = new THREE.Mesh(shockGeo, shockMat);
        shockMesh.position.set(mouseNorm.x * 60, mouseNorm.y * 40, 20);
        shockMesh.rotation.x = Math.PI / 3;
        this.scene.add(shockMesh);

        this.shockwaves.push({
            mesh: shockMesh,
            scale: 1,
            opacity: 0.9
        });

        // Spawn 14 burst spark particles in 3D
        for (let i = 0; i < 14; i++) {
            const sparkGeo = new THREE.BufferGeometry();
            sparkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
            const sparkMat = new THREE.PointsMaterial({
                color: this.currentColor,
                size: 3.5,
                transparent: true,
                opacity: 1,
                blending: THREE.AdditiveBlending
            });
            const spark = new THREE.Points(sparkGeo, sparkMat);
            spark.position.copy(shockMesh.position);
            this.scene.add(spark);

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.5 + 0.8;
            this.sparks.push({
                mesh: spark,
                velX: Math.cos(angle) * speed,
                velY: Math.sin(angle) * speed,
                velZ: (Math.random() - 0.5) * speed * 2,
                opacity: 1
            });
        }
    }

    onMouseMove(event) {
        this.targetMouseX = (event.clientX - window.innerWidth / 2) * 0.08;
        this.targetMouseY = (event.clientY - window.innerHeight / 2) * 0.08;
    }

    onPointerDown(event) {
        // Only trigger shockwaves if clicking canvas or open area
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            this.createShockwaveAt(event.clientX, event.clientY);
        }
        this.isDragging = true;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
    }

    onPointerDrag(event) {
        if (!this.isDragging) return;
        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;
        this.targetOrbitRotY += deltaX * 0.003;
        this.targetOrbitRotX += deltaY * 0.003;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
    }

    onPointerUp() {
        this.isDragging = false;
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    cycleMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.fxModes.length;
        const mode = this.fxModes[this.currentModeIndex];

        if (mode === 'Hyperspace Warp') {
            gsap.to(this.camera.position, { z: 90, duration: 1.2, ease: "power3.out" });
        } else if (mode === 'Quantum Matrix') {
            gsap.to(this.camera.position, { y: -20, z: 105, duration: 1.2, ease: "power3.out" });
            if (this.terrainGrid) {
                gsap.to(this.terrainGrid.material, { opacity: 0.35, duration: 1 });
            }
        } else {
            // Cyber Core
            gsap.to(this.camera.position, { y: 0, z: 120, duration: 1.2, ease: "power3.out" });
            if (this.terrainGrid) {
                gsap.to(this.terrainGrid.material, { opacity: 0.16, duration: 1 });
            }
        }

        return mode;
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

        // Tab Camera Choreography & Position shifts
        if (this.coreGroup) {
            const positions = {
                'overview': { x: 45, y: -5, z: -20, camZ: 120, camY: 0 },
                'experience': { x: -45, y: 10, z: -15, camZ: 110, camY: 5 },
                'projects': { x: 50, y: -10, z: -25, camZ: 115, camY: -5 },
                'skills': { x: -40, y: -15, z: -10, camZ: 125, camY: -10 },
                'education': { x: 40, y: 15, z: -30, camZ: 120, camY: 8 },
                'connect': { x: 0, y: -25, z: -10, camZ: 100, camY: -12 }
            };
            const targetPos = positions[tabName] || { x: 45, y: -5, z: -20, camZ: 120, camY: 0 };
            
            gsap.to(this.coreGroup.position, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                duration: 1.3,
                ease: "power2.out"
            });

            gsap.to(this.camera.position, {
                z: targetPos.camZ,
                duration: 1.4,
                ease: "power2.out"
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();
        const currentMode = this.fxModes[this.currentModeIndex];

        // Smooth mouse and drag orbit damping
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.06;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.06;
        this.orbitRotX += (this.targetOrbitRotX - this.orbitRotX) * 0.08;
        this.orbitRotY += (this.targetOrbitRotY - this.orbitRotY) * 0.08;

        // Camera position with mouse sway & orbit controls
        this.camera.position.x = this.mouseX * 0.35 + Math.sin(this.orbitRotY) * 20;
        this.camera.position.y = -this.mouseY * 0.35 + Math.sin(this.orbitRotX) * 15;
        this.camera.lookAt(0, 0, 0);

        // Update point light position to follow mouse
        if (this.pointLight) {
            this.pointLight.position.x = this.mouseX * 1.5;
            this.pointLight.position.y = -this.mouseY * 1.5;
        }

        // 1. Rotate & Animate Cyber Core
        if (this.coreGroup) {
            this.coreGroup.rotation.y += 0.006;
            this.coreGroup.rotation.x = Math.sin(time * 0.4) * 0.15 + this.orbitRotX;
            this.coreGroup.rotation.z = Math.cos(time * 0.3) * 0.1;
        }

        // Inner Torus Knot independent multi-axis rotation
        if (this.torusKnot) {
            this.torusKnot.rotation.x += 0.014;
            this.torusKnot.rotation.y -= 0.018;
            this.torusKnot.rotation.z += 0.008;
        }

        // Central Nucleus heartbeat pulse
        if (this.coreNucleus) {
            const scale = 1.0 + Math.sin(time * 4) * 0.18;
            this.coreNucleus.scale.set(scale, scale, scale);
            this.coreNucleus.rotation.y += 0.02;
        }

        // Rotate orbital rings
        this.rings.forEach(item => {
            item.mesh.rotation.z += item.speed;
        });

        // 2. Animate Orbiting Satellites
        this.satellites.forEach(sat => {
            sat.angle += sat.speed;
            sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
            sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
            sat.mesh.position.y = sat.yOffset + Math.sin(time * 2 + sat.radius) * 6;
            sat.mesh.rotation.x += 0.02;
            sat.mesh.rotation.y += 0.03;
        });

        // 3. Undulate Cyber Matrix Wave Terrain Grid
        if (this.terrainGeometry) {
            const posAttr = this.terrainGeometry.attributes.position;
            const vertex = new THREE.Vector3();
            for (let i = 0; i < posAttr.count; i++) {
                vertex.fromBufferAttribute(posAttr, i);
                const wave1 = Math.sin(vertex.x * 0.035 + time * 1.8) * Math.cos(vertex.y * 0.035 + time * 1.2) * 5.0;
                const wave2 = Math.sin(Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y) * 0.04 - time * 2) * 2.8;
                posAttr.setZ(i, wave1 + wave2);
            }
            posAttr.needsUpdate = true;
        }

        // 4. Animate Particle Field (Hyperspace Warp vs Cosmic Drift)
        if (this.particles && this.particlePositions) {
            const positions = this.particles.geometry.attributes.position.array;
            const warpSpeed = currentMode === 'Hyperspace Warp' ? 6.5 : 0.4;

            for (let i = 0; i < this.particleCount * 3; i += 3) {
                if (currentMode === 'Hyperspace Warp') {
                    positions[i + 2] += warpSpeed;
                    if (positions[i + 2] > 140) {
                        positions[i + 2] = -220;
                        positions[i] = (Math.random() - 0.5) * 420;
                        positions[i + 1] = (Math.random() - 0.5) * 360;
                    }
                } else {
                    // Subtle orbital float
                    positions[i + 1] += Math.sin(time + positions[i] * 0.02) * 0.08;
                }
            }
            this.particles.geometry.attributes.position.needsUpdate = true;

            if (currentMode !== 'Hyperspace Warp') {
                this.particles.rotation.y += 0.0006;
                this.particles.rotation.x += 0.0003;
            }
        }

        // 5. Animate Shockwaves & Sparks
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const s = this.shockwaves[i];
            s.scale += 0.8;
            s.opacity -= 0.025;
            s.mesh.scale.set(s.scale, s.scale, s.scale);
            s.mesh.material.opacity = s.opacity;

            if (s.opacity <= 0) {
                this.scene.remove(s.mesh);
                s.mesh.geometry.dispose();
                s.mesh.material.dispose();
                this.shockwaves.splice(i, 1);
            }
        }

        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const sp = this.sparks[i];
            sp.mesh.position.x += sp.velX;
            sp.mesh.position.y += sp.velY;
            sp.mesh.position.z += sp.velZ;
            sp.opacity -= 0.035;
            sp.mesh.material.opacity = sp.opacity;

            if (sp.opacity <= 0) {
                this.scene.remove(sp.mesh);
                sp.mesh.geometry.dispose();
                sp.mesh.material.dispose();
                this.sparks.splice(i, 1);
            }
        }

        // Color interpolation
        this.currentColor.lerp(this.targetColor, 0.05);
        if (this.coreWireframe) {
            this.coreWireframe.material.color.copy(this.currentColor);
        }
        if (this.terrainGrid) {
            this.terrainGrid.material.color.copy(this.currentColor);
        }
        if (this.pointLight) {
            this.pointLight.color.copy(this.currentColor);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.Cyber3DCanvas = Cyber3DCanvas;
