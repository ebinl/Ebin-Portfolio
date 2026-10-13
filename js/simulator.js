// Interactive FinTech AML Simulator & ML Fraud Prediction Engine
class FinTechSimulator {
    constructor() {
        this.streamInterval = null;
        this.isStreaming = false;
        this.txCount = 142850;
        this.fraudBlocked = 1842;
        this.tps = 5240;
        this.avgLatency = 68; // ms

        this.init();
    }

    init() {
        this.setupAMLControls();
        this.setupMLSandbox();
    }

    setupAMLControls() {
        const sendCleanBtn = document.getElementById('btn-sim-clean');
        const sendSusBtn = document.getElementById('btn-sim-sus');
        const autoStreamBtn = document.getElementById('btn-sim-autostream');

        if (sendCleanBtn) {
            sendCleanBtn.addEventListener('click', () => {
                window.soundCtrl?.click();
                this.processTransaction({
                    id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
                    amount: '$84.50',
                    origin: 'Starbucks Coffee, San Jose',
                    risk: 'Low',
                    score: 0.08,
                    account: 'ACC-394812',
                    status: 'APPROVED'
                });
            });
        }

        if (sendSusBtn) {
            sendSusBtn.addEventListener('click', () => {
                window.soundCtrl?.fraudAlert();
                this.processTransaction({
                    id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
                    amount: '$14,250.00',
                    origin: 'Offshore Swift Wire (Unknown IP: 185.220.101.5)',
                    risk: 'CRITICAL',
                    score: 0.94,
                    account: 'ACC-891024 [Blacklist Flag]',
                    status: 'FLAGGED / AML INTERCEPTED'
                });
            });
        }

        if (autoStreamBtn) {
            autoStreamBtn.addEventListener('click', () => {
                window.soundCtrl?.click();
                this.toggleAutoStream(autoStreamBtn);
            });
        }
    }

    toggleAutoStream(btn) {
        this.isStreaming = !this.isStreaming;
        if (this.isStreaming) {
            btn.innerHTML = `<span class="pulse-dot"></span> Streaming Live (5,000+ TPS)`;
            btn.classList.add('active');
            this.streamInterval = setInterval(() => {
                this.txCount += Math.floor(45 + Math.random() * 20);
                this.tps = Math.floor(5100 + Math.random() * 300);
                this.avgLatency = Math.floor(62 + Math.random() * 15);
                
                // Randomly block fraud
                if (Math.random() > 0.85) {
                    this.fraudBlocked += 1;
                }

                this.updateMetricsUI();
                
                // Randomly add quick stream item
                if (Math.random() > 0.6) {
                    const isFraud = Math.random() > 0.88;
                    this.appendLogEntry({
                        id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
                        amount: isFraud ? '$' + (3000 + Math.floor(Math.random() * 12000)) : '$' + (10 + Math.floor(Math.random() * 250)),
                        score: isFraud ? (0.85 + Math.random() * 0.14).toFixed(2) : (0.02 + Math.random() * 0.15).toFixed(2),
                        status: isFraud ? 'FLAGGED' : 'PASSED',
                        time: new Date().toLocaleTimeString().split(' ')[0]
                    });
                }
            }, 500);
        } else {
            clearInterval(this.streamInterval);
            btn.innerHTML = `Start Live Stream Simulation`;
            btn.classList.remove('active');
        }
    }

    updateMetricsUI() {
        const tpsEl = document.getElementById('stat-sim-tps');
        const latencyEl = document.getElementById('stat-sim-latency');
        const totalEl = document.getElementById('stat-sim-total');
        const blockedEl = document.getElementById('stat-sim-blocked');

        if (tpsEl) tpsEl.textContent = this.tps.toLocaleString() + ' /s';
        if (latencyEl) latencyEl.textContent = this.avgLatency + ' ms';
        if (totalEl) totalEl.textContent = this.txCount.toLocaleString();
        if (blockedEl) blockedEl.textContent = this.fraudBlocked.toLocaleString();
    }

    processTransaction(txn) {
        const pipelineStages = [
            { id: 'stage-kafka', text: 'Kafka Ingest (5k/sec partition broker)' },
            { id: 'stage-java', text: 'Spring Boot Transaction Engine (Java)' },
            { id: 'stage-redis', text: 'Redis Hot Cache (Profile & Blacklist check)' },
            { id: 'stage-fastapi', text: 'FastAPI ML Model Scoring (Python)' }
        ];

        // Animate stages sequentially
        pipelineStages.forEach((stage, idx) => {
            const el = document.getElementById(stage.id);
            if (el) {
                setTimeout(() => {
                    el.classList.add('processing');
                    setTimeout(() => {
                        el.classList.remove('processing');
                        el.classList.add('done');
                    }, 280);
                }, idx * 160);
            }
        });

        setTimeout(() => {
            // Reset stages done
            pipelineStages.forEach(s => {
                const el = document.getElementById(s.id);
                if (el) el.classList.remove('done');
            });

            // Update result badge
            const resultBox = document.getElementById('aml-result-output');
            if (resultBox) {
                const isCrit = txn.score > 0.6;
                resultBox.className = `aml-result-card ${isCrit ? 'is-danger' : 'is-success'}`;
                resultBox.innerHTML = `
                    <div class="result-header">
                        <span class="status-indicator"></span>
                        <strong>${txn.status}</strong>
                        <span class="result-badge">${(txn.score * 100).toFixed(1)}% Risk</span>
                    </div>
                    <div class="result-details">
                        <p><strong>Txn ID:</strong> ${txn.id} | <strong>Amount:</strong> ${txn.amount}</p>
                        <p><strong>Route:</strong> ${txn.origin}</p>
                        <p><strong>Target:</strong> ${txn.account} | <strong>Latency:</strong> ${64 + Math.floor(Math.random() * 20)}ms</p>
                    </div>
                `;

                if (isCrit) {
                    window.soundCtrl?.fraudAlert();
                } else {
                    window.soundCtrl?.success();
                }
            }

            // Append to log
            this.appendLogEntry({
                id: txn.id,
                amount: txn.amount,
                score: txn.score.toFixed(2),
                status: txn.status.includes('FLAGGED') ? 'FLAGGED' : 'PASSED',
                time: new Date().toLocaleTimeString().split(' ')[0]
            });
        }, 700);
    }

    appendLogEntry(item) {
        const logBody = document.getElementById('sim-log-entries');
        if (!logBody) return;

        const row = document.createElement('div');
        row.className = `sim-log-row ${item.status === 'FLAGGED' ? 'threat' : 'safe'}`;
        row.innerHTML = `
            <span>${item.time}</span>
            <span class="mono">${item.id}</span>
            <span>${item.amount}</span>
            <span class="score-pill">${item.score}</span>
            <span class="tag-status">${item.status}</span>
        `;

        logBody.insertBefore(row, logBody.firstChild);
        if (logBody.children.length > 8) {
            logBody.removeChild(logBody.lastChild);
        }
    }

    // ML Fraud Detection Sandbox
    setupMLSandbox() {
        const amtInput = document.getElementById('ml-slider-amount');
        const distInput = document.getElementById('ml-slider-dist');
        const velInput = document.getElementById('ml-slider-velocity');
        const hourInput = document.getElementById('ml-slider-hour');

        const inputs = [amtInput, distInput, velInput, hourInput];
        inputs.forEach(inp => {
            if (inp) {
                inp.addEventListener('input', () => this.calculateMLRisk());
            }
        });

        this.calculateMLRisk();
    }

    calculateMLRisk() {
        const amt = parseFloat(document.getElementById('ml-slider-amount')?.value || 500);
        const dist = parseFloat(document.getElementById('ml-slider-dist')?.value || 10);
        const vel = parseFloat(document.getElementById('ml-slider-velocity')?.value || 1);
        const hour = parseFloat(document.getElementById('ml-slider-hour')?.value || 14);

        // Update display values
        const lblAmt = document.getElementById('val-slider-amount');
        const lblDist = document.getElementById('val-slider-dist');
        const lblVel = document.getElementById('val-slider-velocity');
        const lblHour = document.getElementById('val-slider-hour');

        if (lblAmt) lblAmt.textContent = '$' + amt.toLocaleString();
        if (lblDist) lblDist.textContent = dist + ' km';
        if (lblVel) lblVel.textContent = vel + ' tx / 10m';
        if (lblHour) lblHour.textContent = hour.toString().padStart(2, '0') + ':00 hrs';

        // Logistic Regression Model Weights (Simulating trained Scikit-Learn weights)
        // Normalized weights:
        const normAmt = Math.min(amt / 10000, 3.5);
        const normDist = Math.min(dist / 2500, 3.0);
        const normVel = Math.min(vel / 15, 3.0);
        // Odd hours (1 AM to 4 AM) increase risk
        const oddHourPenalty = (hour >= 1 && hour <= 4) ? 0.85 : 0.05;

        // Logit calculation: z = w0 + w1*amt + w2*dist + w3*vel + w4*oddHour
        const z = -3.2 + (normAmt * 1.8) + (normDist * 1.5) + (normVel * 2.1) + oddHourPenalty;
        
        // Sigmoid function: 1 / (1 + e^-z)
        const probability = 1 / (1 + Math.exp(-z));
        const riskPct = Math.min(Math.max(probability * 100, 1.2), 99.4);

        // Render gauge and verdict
        const gaugeFill = document.getElementById('ml-gauge-bar');
        const riskScoreText = document.getElementById('ml-risk-score');
        const riskVerdict = document.getElementById('ml-verdict');
        const riskBadge = document.getElementById('ml-verdict-badge');

        if (gaugeFill) gaugeFill.style.width = `${riskPct}%`;
        if (riskScoreText) riskScoreText.textContent = `${riskPct.toFixed(1)}%`;

        if (riskVerdict && riskBadge) {
            if (riskPct < 30) {
                gaugeFill.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
                riskBadge.textContent = 'LOW RISK';
                riskBadge.className = 'verdict-badge safe';
                riskVerdict.textContent = 'Transaction cleared. Logistic model confidence 97.4%. Normal behavioral profile.';
            } else if (riskPct < 70) {
                gaugeFill.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
                riskBadge.textContent = 'SUSPICIOUS (STEP-UP 2FA)';
                riskBadge.className = 'verdict-badge warning';
                riskVerdict.textContent = 'Elevated anomaly score. Triggering SMS / biometric step-up authentication.';
            } else {
                gaugeFill.style.background = 'linear-gradient(90deg, #ef4444, #f43f5e)';
                riskBadge.textContent = 'CRITICAL FRAUD DETECTED';
                riskBadge.className = 'verdict-badge critical';
                riskVerdict.textContent = 'High probability fraud. Account temporarily locked, transaction denied via automated rule engine.';
            }
        }
    }
}

window.FinTechSimulator = FinTechSimulator;
