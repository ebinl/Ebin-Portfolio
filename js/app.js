// Core Portfolio Logic & 3D Interactive Controls
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D Canvas
    let cyberCanvas = null;
    if (typeof THREE !== 'undefined' && typeof Cyber3DCanvas !== 'undefined') {
        cyberCanvas = new Cyber3DCanvas('webgl-canvas-container');
    }

    // Initialize Simulator
    if (typeof FinTechSimulator !== 'undefined') {
        new FinTechSimulator();
    }

    // Initialize Audio Toggle
    initAudioControls();

    // Initialize 3D Tabs
    init3DTabs(cyberCanvas);

    // Initialize 3D Tilt Effect on interactive cards
    init3DTilt();

    // Initialize Custom Cursor
    initCyberCursor();

    // Initialize Skills Filtering & Spotlight
    initSkillMatrix();

    // Initialize Clinical NLP Demo
    initClinicalNLPDemo();

    // Initialize Resume Modal & Clipboard
    initResumeModal();

    // Initialize Avatar Photo Toggle
    initAvatarToggle();

    // Initialize Contact Form
    initContactConsole();
});

// ----------------------------------------------------
// 1. Audio Controls
// ----------------------------------------------------
function initAudioControls() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
        const isMuted = window.soundCtrl.toggleMute();
        audioBtn.classList.toggle('muted', isMuted);
        const icon = audioBtn.querySelector('.audio-icon');
        if (icon) {
            icon.innerHTML = isMuted 
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
        }
        showToast(isMuted ? 'Audio SFX Muted' : 'Audio SFX Enabled');
    });
}

// ----------------------------------------------------
// 2. Premium 3D Interactive Tabs
// ----------------------------------------------------
function init3DTabs(cyberCanvas) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabIndicator = document.getElementById('tab-active-indicator');
    const viewModeSelector = document.querySelectorAll('.view-mode-pill');
    const mainStage = document.getElementById('tabs-3d-stage');

    function updateIndicator(activeBtn) {
        if (!tabIndicator || !activeBtn) return;
        const rect = activeBtn.getBoundingClientRect();
        const parentRect = activeBtn.parentElement.getBoundingClientRect();
        tabIndicator.style.width = `${rect.width}px`;
        tabIndicator.style.left = `${rect.left - parentRect.left}px`;
    }

    function switchTab(tabId) {
        const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const targetPanel = document.getElementById(`panel-${tabId}`);
        if (!targetPanel || !targetBtn) return;

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            panel.classList.remove('entering');
        });

        targetBtn.classList.add('active');
        targetPanel.classList.add('active');
        targetPanel.classList.add('entering');
        
        // Remove entering after animation finishes
        setTimeout(() => {
            targetPanel.classList.remove('entering');
        }, 600);

        updateIndicator(targetBtn);
        window.soundCtrl?.tabSwitch();

        // Sync with Three.js Cyber background
        if (cyberCanvas) {
            cyberCanvas.setTabTheme(tabId);
        }

        // Scroll to top of panel smoothly
        targetPanel.scrollTop = 0;
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => window.soundCtrl?.hover());
        btn.addEventListener('click', (e) => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // View Mode Switcher (3D Stage vs Panoramic Fluid)
    viewModeSelector.forEach(modeBtn => {
        modeBtn.addEventListener('click', () => {
            viewModeSelector.forEach(b => b.classList.remove('active'));
            modeBtn.classList.add('active');
            const mode = modeBtn.getAttribute('data-mode');
            if (mainStage) {
                mainStage.setAttribute('data-view-mode', mode);
            }
            window.soundCtrl?.click();
            showToast(`Switched to ${mode.toUpperCase()} Perspective`);
        });
    });

    // Global quick tab jump links (e.g. from hero buttons)
    document.querySelectorAll('[data-goto-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-goto-tab');
            switchTab(tab);
        });
    });

    // Keyboard navigation (1 to 6 or arrow keys)
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        const keyMap = { '1': 'overview', '2': 'experience', '3': 'projects', '4': 'skills', '5': 'education', '6': 'connect' };
        if (keyMap[e.key]) {
            switchTab(keyMap[e.key]);
        }
    });

    // Initial positioning
    const initialActive = document.querySelector('.tab-btn.active');
    if (initialActive) {
        setTimeout(() => updateIndicator(initialActive), 100);
    }
    window.addEventListener('resize', () => {
        const curActive = document.querySelector('.tab-btn.active');
        if (curActive) updateIndicator(curActive);
    });
}

// ----------------------------------------------------
// 3. 3D Tilt Effect on Cards
// ----------------------------------------------------
function init3DTilt() {
    const tiltCards = document.querySelectorAll('.card-3d');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

            // Holographic glare
            const glare = card.querySelector('.glare-layer');
            if (glare) {
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`;
                glare.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            const glare = card.querySelector('.glare-layer');
            if (glare) {
                glare.style.opacity = '0';
            }
        });
    });
}

// ----------------------------------------------------
// 4. Custom Cyber Cursor
// ----------------------------------------------------
function initCyberCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function loop() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Hover scale on interactive elements
    const interactiveTargets = 'button, a, .tab-btn, .card-3d, .skill-tag, input, textarea, .clickable';
    document.querySelectorAll(interactiveTargets).forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('cursor-hover');
        });
    });
}

// ----------------------------------------------------
// 5. Skills Matrix Filtering & Deep-Dive Spotlight
// ----------------------------------------------------
function initSkillMatrix() {
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    const spotlightTitle = document.getElementById('skill-spotlight-title');
    const spotlightDesc = document.getElementById('skill-spotlight-desc');
    const spotlightImpact = document.getElementById('skill-spotlight-impact');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.soundCtrl?.click();
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Skill card selection for deep-dive spotlight
    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            window.soundCtrl?.hover();
            skillCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const name = card.getAttribute('data-skill-name') || card.querySelector('h4')?.textContent;
            const desc = card.getAttribute('data-skill-desc');
            const impact = card.getAttribute('data-skill-impact');

            if (spotlightTitle) spotlightTitle.textContent = name;
            if (spotlightDesc) spotlightDesc.textContent = desc;
            if (spotlightImpact) spotlightImpact.textContent = impact;
        });
    });
}

// ----------------------------------------------------
// 6. Clinical NLP Interactive Mini-Tool
// ----------------------------------------------------
function initClinicalNLPDemo() {
    const runBtn = document.getElementById('btn-run-clinical-nlp');
    const inputNote = document.getElementById('clinical-note-input');
    const outputContainer = document.getElementById('clinical-nlp-output');

    if (!runBtn || !outputContainer) return;

    const sampleNotes = [
        "Patient presents with severe acute dyspnea, resting pulse 118 bpm, ST-segment elevation noted on lead II, cardiac troponin elevated at 0.42 ng/mL. History of hypertension, currently on lisinopril.",
        "Clinical review: 62 y/o male with persistent bilateral chest tightness, SpO2 91% on room air, high sensitivity C-reactive protein (hs-CRP) 4.8 mg/L. Suggests high risk coronary event.",
        "Post-op oncology surveillance: MRI reveals no metastatic recurrence, liver enzymes normal, patient reports mild neuropathic tingling secondary to paclitaxel infusion."
    ];

    let noteIdx = 0;
    const sampleCycleBtn = document.getElementById('btn-sample-cycle');
    if (sampleCycleBtn && inputNote) {
        sampleCycleBtn.addEventListener('click', () => {
            window.soundCtrl?.click();
            noteIdx = (noteIdx + 1) % sampleNotes.length;
            inputNote.value = sampleNotes[noteIdx];
        });
    }

    runBtn.addEventListener('click', () => {
        window.soundCtrl?.click();
        outputContainer.innerHTML = `
            <div class="nlp-loading">
                <span class="spinner"></span>
                <span>Executing Python Clinical NLP Model & Healthcare Entity Extraction...</span>
            </div>
        `;

        setTimeout(() => {
            window.soundCtrl?.success();
            outputContainer.innerHTML = `
                <div class="nlp-results animate-fade-in">
                    <div class="nlp-badge-group">
                        <span class="nlp-tag red">High Cardiac Risk (Confidence: 94.2%)</span>
                        <span class="nlp-tag cyan">Entity: ST-Elevation & Troponin (0.42 ng/mL)</span>
                        <span class="nlp-tag purple">ICD-10 Match: I21.09 (Acute STEMI)</span>
                        <span class="nlp-tag green">HIPAA De-identification: PASSED</span>
                    </div>
                    <div class="nlp-action-box">
                        <strong>Automated Clinical Alert Dispatched:</strong>
                        <p>Real-time notification pushed to On-Duty Cardiologist console with sub-second Kafka stream.</p>
                    </div>
                </div>
            `;
        }, 750);
    });
}

// ----------------------------------------------------
// 7. Resume Modal & Clipboard Handlers
// ----------------------------------------------------
function initResumeModal() {
    const modal = document.getElementById('resume-modal');
    const openBtns = document.querySelectorAll('.open-resume-btn');
    const closeBtn = document.getElementById('close-resume-modal');
    const printBtn = document.getElementById('print-resume-btn');

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.soundCtrl?.click();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.soundCtrl?.click();
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.soundCtrl?.click();
            window.print();
        });
    }

    // Copy to clipboard triggers
    document.querySelectorAll('.copy-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    window.soundCtrl?.success();
                    showToast(`Copied to clipboard: ${textToCopy}`);
                });
            }
        });
    });
}

// ----------------------------------------------------
// 8. Avatar Photo Toggle (Studio AI Theme vs Original)
// ----------------------------------------------------
function initAvatarToggle() {
    const toggleBtn = document.getElementById('avatar-mode-toggle');
    const avatarImg = document.querySelector('.avatar-img');
    const toggleText = document.getElementById('avatar-toggle-text');
    if (!toggleBtn || !avatarImg) return;

    let isStudioMode = true;

    toggleBtn.addEventListener('click', () => {
        window.soundCtrl?.click();
        isStudioMode = !isStudioMode;

        if (isStudioMode) {
            avatarImg.src = 'assets/avatar.jpg';
            if (toggleText) toggleText.textContent = 'Photo: Studio AI Theme';
            showToast('Switched to Studio AI Theme Portrait');
        } else {
            avatarImg.src = 'assets/avatar_original.jpg';
            if (toggleText) toggleText.textContent = 'Photo: Original Snapshot';
            showToast('Switched to Original Photo Snapshot');
        }
    });
}

// ----------------------------------------------------
// 9. Contact Console, Project Intent Fast-Track & Toast
// ----------------------------------------------------
function initContactConsole() {
    const form = document.getElementById('contact-form');
    const intentPills = document.querySelectorAll('.intent-pill');
    const msgTextarea = document.getElementById('input-sender-message');

    // Intent Fast-Track Message Templates
    const templates = {
        'web-dev': "Hello Ebin,\n\nWe have a website / web application project and would like to consult with you on development, architecture, and timeline.\n\nProject details:",
        'marketing': "Hello Ebin,\n\nWe are looking to scale our digital presence through Technical SEO and performance marketing funnels.\n\nOur current goals:",
        'hiring': "Hi Ebin,\n\nWe came across your profile and IQVIA background. We have an engineering opening and would love to schedule an interview with you.\n\nRole & Company:",
        'freelance': "Hi Ebin,\n\nI have a freelance contracting opportunity and would love to discuss your availability and rates.\n\nOverview:"
    };

    intentPills.forEach(pill => {
        pill.addEventListener('click', () => {
            window.soundCtrl?.click();
            intentPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const intent = pill.getAttribute('data-intent');
            if (msgTextarea && templates[intent]) {
                msgTextarea.value = templates[intent];
                msgTextarea.focus();
            }
        });
    });

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.soundCtrl?.success();
        
        const name = form.querySelector('[name="name"]')?.value || 'Guest';
        const email = form.querySelector('[name="email"]')?.value || '';
        const message = form.querySelector('[name="message"]')?.value || '';
        const activeIntent = document.querySelector('.intent-pill.active')?.textContent?.trim() || 'Project Inquiry';

        const customWaMessage = `Hello Ebin! 👋\n\n*Category:* ${activeIntent}\n*From:* ${name}${email ? ' (' + email + ')' : ''}\n\n*Message:*\n${message}`;

        showToast('Opening WhatsApp with your message...');

        const waUrl = `https://wa.me/919633978698?text=${encodeURIComponent(customWaMessage)}`;
        
        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 300);
    });
}

// Toast Helper
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-bubble';
    toast.innerHTML = `
        <span class="toast-dot"></span>
        <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}
