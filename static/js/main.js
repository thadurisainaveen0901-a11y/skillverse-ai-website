/* ============================================
   SkillVerse AI - Ultra Premium 3D Design
   Three.js + GSAP + Liquid Glass Animations
   ============================================ */

"use strict";

/* ============================================
   GLOBAL CONFIG
   ============================================ */

const SkillVerse = {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    qs(s, p = document) { return p.querySelector(s); },
    qsa(s, p = document) { return [...p.querySelectorAll(s)]; },
    exists(s, p = document) { return !!p.querySelector(s); },
    clamp(v, min, max) { return Math.min(Math.max(v, min), max); },
    debounce(fn, wait) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; }
};

/* ============================================
   1. THREE.JS 3D BACKGROUND - THEME MATCHED
   ============================================ */

class ThreeBackground {
    constructor() {
        if (SkillVerse.reducedMotion) return;
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.particles = [];
        this.geometries = [];
        this.time = 0;
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.createParticles();
        this.createGeometries();
        this.createLights();
        this.addEventListeners();
        this.animate();
    }

    createParticles() {
        const count = 120;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        // Theme-matched colors: purple, blue, cyan, green
        const themeColors = [
            new THREE.Color(0x5B5FEF), // Primary purple
            new THREE.Color(0x00C2FF), // Secondary cyan
            new THREE.Color(0x8B5CF6), // Purple variant
            new THREE.Color(0x34C759), // Success green
            new THREE.Color(0x5AC8FA), // Info blue
        ];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

            const color = themeColors[Math.floor(Math.random() * themeColors.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 0.3 + 0.1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    createGeometries() {
        // Floating orbs - theme matched colors
        const orbConfigs = [
            { color: 0x5B5FEF, pos: [-8, 5, -5], size: 1.2 },
            { color: 0x00C2FF, pos: [8, -3, -3], size: 0.8 },
            { color: 0x8B5CF6, pos: [5, 8, -8], size: 1.0 },
            { color: 0x34C759, pos: [-5, -8, -6], size: 0.6 },
            { color: 0x5AC8FA, pos: [0, 0, -10], size: 1.5 },
        ];

        orbConfigs.forEach((config, i) => {
            const geometry = new THREE.SphereGeometry(config.size, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.12,
                wireframe: true
            });
            const orb = new THREE.Mesh(geometry, material);
            orb.position.set(...config.pos);
            orb.userData = {
                speedX: (Math.random() - 0.5) * 0.008,
                speedY: (Math.random() - 0.5) * 0.008,
                speedZ: (Math.random() - 0.5) * 0.005,
                rotSpeed: Math.random() * 0.003,
                floatOffset: Math.random() * Math.PI * 2
            };
            this.scene.add(orb);
            this.geometries.push(orb);
        });

        // Torus rings - theme matched
        const torusConfigs = [
            { color: 0x5B5FEF, pos: [-6, 4, -4], size: 2.5, tube: 0.08 },
            { color: 0x00C2FF, pos: [7, -2, -6], size: 2.0, tube: 0.06 },
            { color: 0x8B5CF6, pos: [0, 6, -8], size: 3.0, tube: 0.1 },
        ];

        torusConfigs.forEach((config) => {
            const geometry = new THREE.TorusGeometry(config.size, config.tube, 16, 100);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.15,
                wireframe: true
            });
            const torus = new THREE.Mesh(geometry, material);
            torus.position.set(...config.pos);
            torus.rotation.x = Math.random() * Math.PI;
            torus.rotation.y = Math.random() * Math.PI;
            torus.userData = {
                rotX: (Math.random() - 0.5) * 0.004,
                rotY: (Math.random() - 0.5) * 0.004,
                floatOffset: Math.random() * Math.PI * 2
            };
            this.scene.add(torus);
            this.geometries.push(torus);
        });

        // Icosahedron shapes
        const icoConfigs = [
            { color: 0x34C759, pos: [-10, -5, -3], size: 0.8 },
            { color: 0x5AC8FA, pos: [10, 5, -5], size: 0.6 },
        ];

        icoConfigs.forEach((config) => {
            const geometry = new THREE.IcosahedronGeometry(config.size, 0);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.2,
                wireframe: true
            });
            const ico = new THREE.Mesh(geometry, material);
            ico.position.set(...config.pos);
            ico.userData = {
                rotX: (Math.random() - 0.5) * 0.006,
                rotY: (Math.random() - 0.5) * 0.006,
                floatOffset: Math.random() * Math.PI * 2
            };
            this.scene.add(ico);
            this.geometries.push(ico);
        });
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x5B5FEF, 1.5, 100);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00C2FF, 1.5, 100);
        pointLight2.position.set(-10, -10, 10);
        this.scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0x8B5CF6, 1, 100);
        pointLight3.position.set(0, 10, -10);
        this.scene.add(pointLight3);
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.targetRotation.x = this.mouse.x * 0.3;
            this.targetRotation.y = this.mouse.y * 0.3;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.008;

        // Rotate particle system
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.0003;
            this.particleSystem.rotation.x += 0.0001;
        }

        // Animate geometries with floating motion
        this.geometries.forEach((mesh) => {
            if (mesh.userData.speedX) {
                mesh.position.x += mesh.userData.speedX;
                mesh.position.y += mesh.userData.speedY;
                mesh.position.z += mesh.userData.speedZ;

                // Add floating motion
                mesh.position.y += Math.sin(this.time + mesh.userData.floatOffset) * 0.01;

                // Wrap around
                if (mesh.position.x > 15) mesh.position.x = -15;
                if (mesh.position.x < -15) mesh.position.x = 15;
                if (mesh.position.y > 15) mesh.position.y = -15;
                if (mesh.position.y < -15) mesh.position.y = 15;
                if (mesh.position.z > 10) mesh.position.z = -10;
                if (mesh.position.z < -15) mesh.position.z = 10;
            }
            if (mesh.userData.rotX) {
                mesh.rotation.x += mesh.userData.rotX;
                mesh.rotation.y += mesh.userData.rotY;
            }
        });

        // Smooth camera follow
        this.camera.position.x += (this.targetRotation.x - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.targetRotation.y - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(theme) {
        // Update particle colors based on theme
        if (this.particleSystem) {
            const colors = this.particleSystem.geometry.attributes.color;
            const themeColors = theme === 'dark' ? [
                new THREE.Color(0x7C80FF),
                new THREE.Color(0x5AC8FA),
                new THREE.Color(0xA78BFA),
                new THREE.Color(0x4ADE80),
                new THREE.Color(0x7DD3FC),
            ] : [
                new THREE.Color(0x5B5FEF),
                new THREE.Color(0x00C2FF),
                new THREE.Color(0x8B5CF6),
                new THREE.Color(0x34C759),
                new THREE.Color(0x5AC8FA),
            ];

            for (let i = 0; i < colors.count; i++) {
                const color = themeColors[Math.floor(Math.random() * themeColors.length)];
                colors.setXYZ(i, color.r, color.g, color.b);
            }
            colors.needsUpdate = true;
        }
    }
}

/* ============================================
   2. PARTICLE SYSTEM (Canvas fallback)
   ============================================ */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas || SkillVerse.reducedMotion) return;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 180 };
        this.animationId = null;
        this.time = 0;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    createParticles() {
        const area = this.width * this.height;
        const count = Math.min(Math.max(Math.floor(area / 14000), 25), 130);
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.35,
                speedY: (Math.random() - 0.5) * 0.35,
                opacity: Math.random() * 0.35 + 0.08,
                color: this.getRandomColor(),
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.015 + 0.008
            });
        }
    }

    getRandomColor() {
        const colors = ["91, 95, 239", "0, 194, 255", "139, 92, 246", "52, 199, 89", "255, 107, 107"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    addEventListeners() {
        window.addEventListener('resize', () => { this.resize(); this.createParticles(); });
        document.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
        document.addEventListener('mouseleave', () => { this.mouse.x = null; this.mouse.y = null; });
    }

    animate() {
        this.time += 0.008;
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.particles.forEach((p, i) => {
            p.x += p.speedX + Math.sin(this.time + p.pulse) * 0.25;
            p.y += p.speedY + Math.cos(this.time + p.pulse) * 0.25;
            p.pulse += p.pulseSpeed;

            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - p.x, dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.x -= Math.cos(angle) * force * 1.5;
                    p.y -= Math.sin(angle) * force * 1.5;
                }
            }

            if (p.x < -20) p.x = this.width + 20;
            if (p.x > this.width + 20) p.x = -20;
            if (p.y < -20) p.y = this.height + 20;
            if (p.y > this.height + 20) p.y = -20;

            const opacity = SkillVerse.clamp(p.opacity + Math.sin(this.time * 2 + p.pulse) * 0.12, 0.02, 0.7);

            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
            gradient.addColorStop(0, `rgba(${p.color}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${p.color}, 0)`);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${p.color}, ${opacity + 0.1})`;
            this.ctx.fill();

            for (let j = i + 1; j < this.particles.length; j++) {
                const o = this.particles[j];
                const dx = p.x - o.x, dy = p.y - o.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    const lineOpacity = 0.12 * (1 - dist / 110);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${p.color}, ${lineOpacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(o.x, o.y);
                    this.ctx.stroke();
                }
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() { if (this.animationId) cancelAnimationFrame(this.animationId); }
}

/* ============================================
   3. LIQUID GLASS TILT EFFECT
   ============================================ */

class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('[data-tilt]');
        if (!this.cards.length || SkillVerse.reducedMotion) return;
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', e => this.handleMove(e, card));
            card.addEventListener('mouseenter', () => this.handleEnter(card));
            card.addEventListener('mouseleave', () => this.handleLeave(card));
        });
    }

    handleMove(event, card) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -7, ry = ((x - cx) / cx) * 7;
        card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.025,1.025,1.025)`;
        card.style.transition = 'transform 0.08s ease-out';
    }

    handleEnter(card) { card.style.transition = 'transform 0.35s ease'; }

    handleLeave(card) {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.transition = 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
    }
}

/* ============================================
   4. NAVBAR SCROLL
   ============================================ */

class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        if (!this.navbar) return;
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    handleScroll() {
        if (window.scrollY > 30) this.navbar.classList.add('scrolled');
        else this.navbar.classList.remove('scrolled');
    }
}

/* ============================================
   5. MOBILE NAVIGATION
   ============================================ */

class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileToggle');
        this.navLinks = document.querySelector('.nav-links');
        if (!this.toggle || !this.navLinks) return;
        this.init();
    }

    init() {
        this.toggle.addEventListener('click', () => this.toggleMenu());
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.navLinks.classList.toggle('active');
        this.toggle.classList.toggle('active');
        const expanded = this.toggle.classList.contains('active');
        this.toggle.setAttribute('aria-expanded', expanded);
    }

    closeMenu() {
        this.navLinks.classList.remove('active');
        this.toggle.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
    }
}

/* ============================================
   6. COUNTER ANIMATION
   ============================================ */

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        if (!this.counters.length) return;
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.counters.forEach(c => this.setFinalValue(c));
            return;
        }
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        this.counters.forEach(c => observer.observe(c));
    }

    setFinalValue(el) {
        const target = parseInt(el.dataset.count, 10) || 0;
        el.textContent = target.toLocaleString();
    }

    animateCounter(el) {
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1800;
        const start = performance.now();
        const update = now => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
            else this.setFinalValue(el);
        };
        requestAnimationFrame(update);
    }
}

/* ============================================
   7. UPLOAD AREA
   ============================================ */

class UploadSystem {
    constructor() {
        this.uploadAreas = document.querySelectorAll('.upload-area');
        if (!this.uploadAreas.length) return;
        this.init();
    }

    init() {
        this.uploadAreas.forEach(area => this.setupArea(area));
    }

    setupArea(area) {
        const input = area.querySelector('input[type="file"]');
        if (!input) return;

        area.addEventListener('click', e => { if (e.target.tagName !== 'INPUT') input.click(); });
        ['dragenter', 'dragover'].forEach(evt => {
            area.addEventListener(evt, e => { e.preventDefault(); area.classList.add('dragover'); });
        });
        ['dragleave', 'drop'].forEach(evt => {
            area.addEventListener(evt, e => { e.preventDefault(); area.classList.remove('dragover'); });
        });
        area.addEventListener('drop', e => {
            const files = e.dataTransfer.files;
            if (files.length) { input.files = files; this.handleFile(files[0], area); }
        });
        input.addEventListener('change', () => {
            if (input.files.length) this.handleFile(input.files[0], area);
        });
    }

    handleFile(file, area) {
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) { this.showMessage(area, 'File size must be below 10 MB.'); return; }
        const fileName = area.querySelector('.file-name');
        if (fileName) fileName.textContent = file.name;
        area.classList.add('has-file');
        this.animateProgress(area);
    }

    showMessage(area, msg) {
        let el = area.querySelector('.upload-message');
        if (!el) { el = document.createElement('div'); el.className = 'upload-message'; area.appendChild(el); }
        el.textContent = msg;
    }

    animateProgress(area) {
        const progress = area.closest('.upload-container') || area.parentElement;
        const bar = progress.querySelector('.upload-progress');
        const fill = progress.querySelector('.progress-fill');
        const text = progress.querySelector('.progress-text');
        if (!bar || !fill) return;
        bar.style.display = 'block';
        let value = 0;
        const interval = setInterval(() => {
            value += Math.random() * 15;
            value = Math.min(value, 100);
            fill.style.width = `${value}%`;
            if (text) text.textContent = `${Math.round(value)}%`;
            if (value >= 100) clearInterval(interval);
        }, 120);
    }
}

/* ============================================
   8. SCORE RING
   ============================================ */

class ScoreRing {
    constructor() {
        this.rings = document.querySelectorAll('.score-fill');
        if (!this.rings.length) return;
        this.init();
    }

    init() {
        this.rings.forEach(ring => {
            const value = parseFloat(ring.dataset.score || ring.dataset.value || '0');
            this.animate(ring, SkillVerse.clamp(value, 0, 100));
        });
    }

    animate(ring, value) {
        const radius = parseFloat(ring.getAttribute('r'));
        if (!radius) return;
        const circumference = 2 * Math.PI * radius;
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;
        requestAnimationFrame(() => {
            ring.style.strokeDashoffset = circumference - (value / 100) * circumference;
        });
        const number = ring.closest('.score-ring')?.querySelector('.score-number');
        if (number) this.animateNumber(number, value);
    }

    animateNumber(el, target) {
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();
        const update = now => {
            const progress = Math.min((now - startTime) / duration, 1);
            el.textContent = `${Math.round(start + (target - start) * progress)}%`;
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }
}

/* ============================================
   9. INTERVIEW ROLE SELECTION
   ============================================ */

class InterviewSystem {
    constructor() {
        this.cards = document.querySelectorAll('.role-card');
        this.selectedRole = document.getElementById('selected-role');
        if (!this.cards.length) return;
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                this.cards.forEach(c => c.classList.remove('active', 'selected'));
                card.classList.add('active', 'selected');
                const role = card.dataset.role || card.getAttribute('data-role') || card.textContent.trim();
                if (this.selectedRole) this.selectedRole.value = role;
                document.dispatchEvent(new CustomEvent('skillverse:roleSelected', { detail: { role } }));
            });
        });
    }
}

/* ============================================
   10. CHARACTER COUNTER
   ============================================ */

class CharacterCounter {
    constructor() {
        this.textareas = document.querySelectorAll('.answer-area textarea, textarea[data-maxlength]');
        if (!this.textareas.length) return;
        this.init();
    }

    init() {
        this.textareas.forEach(textarea => {
            const counter = textarea.parentElement.querySelector('.character-count');
            const update = () => {
                const current = textarea.value.length;
                const max = textarea.maxLength > 0 ? textarea.maxLength : parseInt(textarea.dataset.maxlength || '5000', 10);
                if (counter) counter.textContent = `${current}/${max}`;
            };
            textarea.addEventListener('input', update);
            update();
        });
    }
}

/* ============================================
   11. SETTINGS TABS
   ============================================ */

class SettingsTabs {
    constructor() {
        this.buttons = document.querySelectorAll('.settings-nav-item, .settings-tab-button');
        this.tabs = document.querySelectorAll('.settings-tab');
        if (!this.buttons.length || !this.tabs.length) return;
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => this.activate(btn));
        });
    }

    activate(btn) {
        const target = btn.dataset.tab || btn.dataset.target || btn.getAttribute('data-tab');
        this.buttons.forEach(b => b.classList.remove('active'));
        this.tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        if (!target) return;
        const tab = document.getElementById(target) || document.querySelector(`[data-tab-content="${target}"]`);
        if (tab) tab.classList.add('active');
    }
}

/* ============================================
   12. TOGGLE SWITCHES
   ============================================ */

class ToggleSwitch {
    constructor() {
        this.toggles = document.querySelectorAll('.toggle');
        if (!this.toggles.length) return;
        this.init();
    }

    init() {
        this.toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const checkbox = toggle.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
                toggle.classList.toggle('active', checkbox ? checkbox.checked : !toggle.classList.contains('active'));
            });
        });
    }
}

/* ============================================
   13. SCROLL REVEAL
   ============================================ */

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.animate-fade-in-up, .animate-fade-in');
        if (!this.elements.length || SkillVerse.reducedMotion) return;
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.elements.forEach(el => el.classList.add('visible', 'show'));
            return;
        }
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        this.elements.forEach(el => observer.observe(el));
    }
}

/* ============================================
   14. BUTTON RIPPLE
   ============================================ */

class RippleEffect {
    constructor() {
        this.buttons = document.querySelectorAll('button, .btn, .button');
        if (!this.buttons.length || SkillVerse.reducedMotion) return;
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', e => {
                const rect = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                ripple.className = 'ripple-effect';
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
}

/* ============================================
   15. API DOCUMENTATION COPY
   ============================================ */

class APICopy {
    constructor() {
        this.blocks = document.querySelectorAll('.api-example pre, pre[data-copy]');
        if (!this.blocks.length) return;
        this.init();
    }

    init() {
        this.blocks.forEach(block => {
            const wrapper = block.parentElement;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'copy-code-btn';
            btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(block.innerText);
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied';
                    setTimeout(() => { btn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 1800);
                } catch (err) { console.error('Copy failed:', err); }
            });
            if (wrapper) { wrapper.style.position = 'relative'; wrapper.appendChild(btn); }
        });
    }
}

/* ============================================
   16. IMAGE FADE-IN
   ============================================ */

class ImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img');
        if (!this.images.length) return;
        this.init();
    }

    init() {
        this.images.forEach(img => {
            if (img.complete) img.classList.add('loaded');
            else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        });
    }
}

/* ============================================
   17. SMOOTH SCROLL
   ============================================ */

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        if (!this.links.length) return;
        this.init();
    }

    init() {
        this.links.forEach(anchor => {
            anchor.addEventListener('click', e => {
                const id = anchor.getAttribute('href');
                if (!id || id === '#') return;
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: SkillVerse.reducedMotion ? 'auto' : 'smooth', block: 'start' });
            });
        });
    }
}

/* ============================================
   18. GSAP ANIMATIONS
   ============================================ */

class GSAPAnimations {
    constructor() {
        if (SkillVerse.reducedMotion || typeof gsap === 'undefined') return;
        if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
        this.init();
    }

    init() {
        this.animateHero();
        this.animateFeatureCards();
        this.animateSectionHeaders();
        this.animateFloatingCards();
        this.animateStats();
        this.animateShowcaseItems();
    }

    animateHero() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const badge = document.querySelector('#heroBadge');
        const title = document.querySelectorAll('.title-line');
        const subtitle = document.querySelector('#heroSubtitle');
        const actions = document.querySelector('#heroActions');
        const stats = document.querySelector('#heroStats');
        const visual = document.querySelector('#heroVisual');
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (badge) tl.from(badge, { opacity: 0, y: 25, duration: 0.7 });
        if (title.length) tl.from(title, { opacity: 0, y: 45, duration: 0.7, stagger: 0.1 }, '-=0.35');
        if (subtitle) tl.from(subtitle, { opacity: 0, y: 25, duration: 0.7 }, '-=0.35');
        if (actions) tl.from(actions, { opacity: 0, y: 25, duration: 0.7 }, '-=0.35');
        if (stats) tl.from(stats, { opacity: 0, y: 25, duration: 0.7 }, '-=0.35');
        if (visual) tl.from(visual, { opacity: 0, x: 50, duration: 0.9 }, '-=0.65');
    }

    animateFeatureCards() {
        const cards = document.querySelectorAll('.feature-card');
        if (!cards.length) return;
        cards.forEach((card, i) => {
            gsap.from(card, {
                opacity: 0, y: 50, duration: 0.7, delay: i * 0.05,
                scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' }
            });
        });
    }

    animateSectionHeaders() {
        const headers = document.querySelectorAll('.section-header, .page-header, .tool-header');
        headers.forEach(header => {
            gsap.from(header, {
                opacity: 0, y: 35, duration: 0.7,
                scrollTrigger: { trigger: header, start: 'top 90%', toggleActions: 'play none none none' }
            });
        });
    }

    animateFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, i) => {
            gsap.to(card, {
                y: -18, rotation: 2, duration: 3 + i * 0.4,
                repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.25
            });
        });
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-card, .profile-stat-card');
        stats.forEach((stat, i) => {
            gsap.from(stat, {
                opacity: 0, y: 35, duration: 0.6, delay: i * 0.08,
                scrollTrigger: { trigger: stat, start: 'top 90%', toggleActions: 'play none none none' }
            });
        });
    }

    animateShowcaseItems() {
        const items = document.querySelectorAll('.feature-showcase-item');
        items.forEach((item, i) => {
            const content = item.querySelector('.showcase-content');
            const visual = item.querySelector('.showcase-visual');
            if (content) {
                gsap.from(content, {
                    opacity: 0, x: i % 2 === 0 ? -50 : 50, duration: 0.8,
                    scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
                });
            }
            if (visual) {
                gsap.from(visual, {
                    opacity: 0, x: i % 2 === 0 ? 50 : -50, duration: 0.8,
                    scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
                });
            }
        });
    }
}

/* ============================================
   19. FORM LOADING STATE
   ============================================ */

class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        if (!this.forms.length) return;
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', () => {
                const btn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (!btn) return;
                btn.dataset.originalText = btn.innerHTML;
                btn.disabled = true;
                if (btn.tagName === 'BUTTON') btn.innerHTML = '<span class="button-loader"></span> Processing...';
            });
        });
    }
}

/* ============================================
   20. PASSWORD VISIBILITY
   ============================================ */

class PasswordToggle {
    constructor() {
        this.buttons = document.querySelectorAll('[data-password-toggle]');
        if (!this.buttons.length) return;
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.passwordToggle;
                const input = document.getElementById(targetId);
                if (!input) return;
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                btn.classList.toggle('active', isPassword);
            });
        });
    }
}

/* ============================================
   21. SEARCH / FILTER
   ============================================ */

class SearchFilter {
    constructor() {
        this.inputs = document.querySelectorAll('[data-search]');
        if (!this.inputs.length) return;
        this.init();
    }

    init() {
        this.inputs.forEach(input => {
            const selector = input.dataset.search;
            const items = document.querySelectorAll(selector);
            input.addEventListener('input', () => {
                const query = input.value.toLowerCase().trim();
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(query) ? '' : 'none';
                });
            });
        });
    }
}

/* ============================================
   22. PROFILE ACTIVITY ANIMATION
   ============================================ */

class ActivityAnimation {
    constructor() {
        this.items = document.querySelectorAll('.activity-item');
        if (!this.items.length || SkillVerse.reducedMotion) return;
        this.init();
    }

    init() {
        this.items.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, i * 100);
        });
    }
}

/* ============================================
   23. BAR CHART ANIMATION
   ============================================ */

class BarChartAnimation {
    constructor() {
        this.bars = document.querySelectorAll('.bar .fill, .chart-bar');
        if (!this.bars.length || SkillVerse.reducedMotion) return;
        this.init();
    }

    init() {
        this.bars.forEach(bar => {
            const target = bar.dataset.value || bar.dataset.width || bar.style.width || '0%';
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = target; }, 300);
        });
    }
}

/* ============================================
   24. PROGRESS BARS
   ============================================ */

class ProgressBars {
    constructor() {
        this.bars = document.querySelectorAll('.progress-fill');
        if (!this.bars.length) return;
        this.init();
    }

    init() {
        this.bars.forEach(bar => {
            const target = bar.dataset.progress || bar.dataset.value || bar.style.width;
            if (!target) return;
            const finalWidth = target.toString().includes('%') ? target : `${target}%`;
            if (SkillVerse.reducedMotion) { bar.style.width = finalWidth; return; }
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1)';
                bar.style.width = finalWidth;
            }, 250);
        });
    }
}

/* ============================================
   25. LAZY IMAGE LOADING
   ============================================ */

class LazyImages {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        if (!this.images.length) return;
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.images.forEach(img => this.load(img));
            return;
        }
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { this.load(entry.target); observer.unobserve(entry.target); }
            });
        }, { rootMargin: '100px' });
        this.images.forEach(img => observer.observe(img));
    }

    load(img) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
}

/* ============================================
   26. ACTIVE API SIDEBAR LINK
   ============================================ */

class APISidebar {
    constructor() {
        this.links = document.querySelectorAll('.api-nav-link');
        if (!this.links.length) return;
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }
}

/* ============================================
   27. MODAL SYSTEM
   ============================================ */

class ModalSystem {
    constructor() {
        this.openButtons = document.querySelectorAll('[data-modal-open]');
        this.closeButtons = document.querySelectorAll('[data-modal-close]');
        if (!this.openButtons.length && !this.closeButtons.length) return;
        this.init();
    }

    init() {
        this.openButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.modalOpen;
                const modal = document.getElementById(id);
                if (modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
            });
        });
        this.closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) { modal.classList.remove('active'); document.body.classList.remove('modal-open'); }
            });
        });
        document.addEventListener('keydown', e => {
            if (e.key !== 'Escape') return;
            document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
            document.body.classList.remove('modal-open');
        });
    }
}

/* ============================================
   28. TOOLTIP
   ============================================ */

class Tooltips {
    constructor() {
        this.elements = document.querySelectorAll('[data-tooltip]');
        if (!this.elements.length) return;
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mouseenter', () => el.setAttribute('title', el.dataset.tooltip));
        });
    }
}

/* ============================================
   29. GSAP FALLBACK
   ============================================ */

class BasicAnimationFallback {
    constructor() {
        if (typeof gsap !== 'undefined' || SkillVerse.reducedMotion) return;
        this.elements = document.querySelectorAll('.animate-fade-in-up, .animate-fade-in');
        if (!this.elements.length) return;
        this.init();
    }

    init() {
        this.elements.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(25px)'; });
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        this.elements.forEach(el => observer.observe(el));
    }
}

/* ============================================
   30. PAGE LOADER
   ============================================ */

class PageLoader {
    constructor() {
        this.loader = document.querySelector('.page-loader, #pageLoader');
        if (!this.loader) return;
        window.addEventListener('load', () => {
            this.loader.classList.add('loaded');
            setTimeout(() => { this.loader.style.display = 'none'; }, 600);
        });
    }
}

/* ============================================
   31. THEME TOGGLE
   ============================================ */

class ThemeToggle {
    constructor() {
        this.toggle = document.getElementById('themeToggle');
        if (!this.toggle) return;
        this.init();
    }

    init() {
        this.updateIcon();
        this.toggle.addEventListener('click', () => this.toggleTheme());
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) this.setTheme(e.matches ? 'dark' : 'light');
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateIcon();
        if (typeof THREE !== 'undefined' && window.threeBackground) {
            window.threeBackground.updateTheme(theme);
        }
    }

    updateIcon() {
        const theme = document.documentElement.getAttribute('data-theme');
        const icon = this.toggle.querySelector('i');
        if (theme === 'dark') icon.className = 'fas fa-sun';
        else icon.className = 'fas fa-moon';
    }
}

/* ============================================
   32. INITIALIZE EVERYTHING
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof THREE !== 'undefined') {
            window.threeBackground = new ThreeBackground();
        } else {
            new ParticleSystem('particle-canvas');
        }

        new TiltEffect();
        new NavbarScroll();
        new MobileMenu();
        new CounterAnimation();
        new UploadSystem();
        new ScoreRing();
        new InterviewSystem();
        new CharacterCounter();
        new SettingsTabs();
        new ToggleSwitch();
        new ScrollReveal();
        new RippleEffect();
        new APICopy();
        new ImageLoader();
        new SmoothScroll();
        new GSAPAnimations();
        new FormHandler();
        new PasswordToggle();
        new SearchFilter();
        new ActivityAnimation();
        new BarChartAnimation();
        new ProgressBars();
        new LazyImages();
        new APISidebar();
        new ModalSystem();
        new Tooltips();
        new BasicAnimationFallback();
        new PageLoader();
        new ThemeToggle();

        document.dispatchEvent(new CustomEvent('skillverse:ready'));
        console.log('🚀 SkillVerse AI - Ultra Premium 3D systems initialized');
    } catch (error) {
        console.error('SkillVerse AI initialization error:', error);
    }
});

/* ============================================
   33. PAGE VISIBILITY
   ============================================ */

document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.body.classList.add('page-hidden');
    else document.body.classList.remove('page-hidden');
});

/* ============================================
   34. RESIZE PERFORMANCE
   ============================================ */

let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('is-resizing');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => document.body.classList.remove('is-resizing'), 250);
}, { passive: true });
