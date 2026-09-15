/* ==========================================================================
   SUPERPOWER — THE HEALTH GAP
   Interactive Longevity Engine & Telegram WebApp Integration
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 01. AUDIO SYNTHESIS ENGINE (Web Audio API)
    // --------------------------------------------------------------------------
    let audioCtx = null;
    let soundEnabled = true;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.04) {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context policy fallback
        }
    }

    function playClickSound() { playTone(880, 'sine', 0.05, 0.03); }
    function playToggleSound() { playTone(540, 'triangle', 0.09, 0.04); }
    function playCardOpenSound() { playTone(1200, 'sine', 0.12, 0.035); }
    function playAlertSound() { playTone(330, 'sawtooth', 0.15, 0.02); }

    // Telegram Haptics
    function triggerHaptic(type = 'light') {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            try {
                if (type === 'selection') {
                    window.Telegram.WebApp.HapticFeedback.selectionChanged();
                } else {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
                }
            } catch (e) {}
        }
    }

    // Sound toggle button
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            const iconOn = soundToggle.querySelector('.sound-icon-on');
            const iconOff = soundToggle.querySelector('.sound-icon-off');
            if (iconOn && iconOff) {
                iconOn.style.display = soundEnabled ? 'block' : 'none';
                iconOff.style.display = soundEnabled ? 'none' : 'block';
            }
            if (soundEnabled) {
                playTone(660, 'sine', 0.1, 0.05);
            }
            triggerHaptic('selection');
        });
    }

    // --------------------------------------------------------------------------
    // 02. TELEGRAM WEBAPP ADAPTATION
    // --------------------------------------------------------------------------
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        try {
            tg.setHeaderColor('#07080a');
            tg.setBackgroundColor('#07080a');
        } catch (e) {}

        // Configure MainButton
        tg.MainButton.setText('✦ TAKE LONGEVITY ACTION');
        tg.MainButton.setParams({
            color: '#00f5a0',
            text_color: '#050608'
        });
        tg.MainButton.onClick(() => {
            triggerHaptic('medium');
            showToast('✓ Longevity protocol exported to your Telegram chat');
            tg.sendData(JSON.stringify({
                action: 'health_gap_protocol',
                age: document.getElementById('ageSlider')?.value || 42,
                timestamp: new Date().toISOString()
            }));
        });
        tg.MainButton.show();
    }

    // --------------------------------------------------------------------------
    // 03. PARADIGM SWITCHER (Standard vs Superpower)
    // --------------------------------------------------------------------------
    const modeToggles = document.querySelectorAll('.mode-toggle-btn');
    const statWindow = document.getElementById('statWindow');
    const statDepth = document.getElementById('statDepth');
    const statThresholds = document.getElementById('statThresholds');
    const statSpan = document.getElementById('statSpan');
    const paradigmGrid = document.getElementById('paradigmGrid');

    function renderParadigmGrid(mode = 'superpower') {
        if (!paradigmGrid) return;
        paradigmGrid.innerHTML = '';
        const totalDots = 150;
        const activeCount = mode === 'superpower' ? 150 : 12;

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'matrix-dot';
            if (i < activeCount) {
                dot.classList.add('active-marker');
            } else {
                dot.classList.add('blind-spot');
            }
            paradigmGrid.appendChild(dot);
        }
    }

    modeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            initAudio();
            playToggleSound();
            triggerHaptic('light');

            modeToggles.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const mode = btn.dataset.mode;
            if (mode === 'standard') {
                statWindow.textContent = 'Only After Symptoms';
                statWindow.className = 'stat-val highlight-rose';
                statDepth.textContent = '10-12 Basic Blood Markers';
                statThresholds.textContent = 'Sick Population Average';
                statThresholds.className = 'stat-val highlight-amber';
                statSpan.textContent = '0 Years (16.2y in decline)';
                statSpan.className = 'stat-val highlight-rose';
                renderParadigmGrid('standard');
            } else {
                statWindow.textContent = '10-15 Years Early';
                statWindow.className = 'stat-val highlight-cyan';
                statDepth.textContent = '150+ Biomarkers Across 8 Systems';
                statThresholds.textContent = 'Optimal Peak Longevity';
                statThresholds.className = 'stat-val highlight-green';
                statSpan.textContent = '+14.2 Years Gained';
                statSpan.className = 'stat-val highlight-green';
                renderParadigmGrid('superpower');
            }
        });
    });

    renderParadigmGrid('superpower');

    // --------------------------------------------------------------------------
    // 04. LIFESPAN VS HEALTHSPAN VISUALIZER (AGE SLIDER)
    // --------------------------------------------------------------------------
    const ageSlider = document.getElementById('ageSlider');
    const currentAgeDisplay = document.getElementById('currentAgeDisplay');
    const protocolToggle = document.getElementById('protocolToggle');
    const superpowerFill = document.getElementById('superpowerFill');
    const compressedGap = document.getElementById('compressedGap');
    const ageDiagnosticGrid = document.getElementById('ageDiagnosticGrid');

    const ageDataMilestones = {
        20: {
            insulin: { title: "Metabolic Flexibility", status: "Optimal", desc: "Mitochondrial efficiency is high. Fasting insulin baseline is healthy." },
            cardio: { title: "Vascular Integrity", status: "Clean", desc: "No endothelial lipid accumulation. ApoB particles clearance is rapid." },
            hormones: { title: "Endocrine Output", status: "Peak", desc: "DHEA-S, growth hormone, and testosterone at lifetime maximums." },
            cellular: { title: "DNA Repair Rate", status: "100%", desc: "NAD+ abundance allows active sirtuin repair of oxidative damage." }
        },
        35: {
            insulin: { title: "Subclinical Resistance", status: "Elevated (Silent)", desc: "Fasting glucose normal, but insulin is quietly creeping up after meals." },
            cardio: { title: "Early Plaque Formation", status: "Hidden Risk", desc: "Oxidized LDL particles begin binding to arterial walls. Standard labs miss this." },
            hormones: { title: "Hormonal Taper", status: "-15% Drop", desc: "Testosterone & progesterone decline ~1-2% annually. Energy crashes begin." },
            cellular: { title: "NAD+ Depletion", status: "-30%", desc: "Mitochondrial turnover slows; cellular repair takes twice as long." }
        },
        50: {
            insulin: { title: "Insulin Resistance", status: "Moderate Deficit", desc: "Visceral fat accumulation accelerates. Leptin resistance causes late cravings." },
            cardio: { title: "Arterial Stiffening", status: "Elevated ApoB", desc: "Micro-calcification in coronary arteries begins. hs-CRP chronic inflammation." },
            hormones: { title: "Andropause / Perimenopause", status: "Deficient", desc: "Cortisol-to-DHEA ratio is skewed. Sleep architecture fragmented." },
            cellular: { title: "Senescent Cell Load", status: "Critical", desc: "Zombie cells secrete inflammatory cytokines (SASP), aging neighbor tissue." }
        },
        65: {
            insulin: { title: "Metabolic Syndrome", status: "High Vulnerability", desc: "Pancreatic beta-cells fatigue. HbA1c crosses standard lab thresholds." },
            cardio: { title: "Cardiovascular Risk", status: "Advanced", desc: "Elevated risk of ischemic events without aggressive lipid-lowering protocol." },
            hormones: { title: "Systemic Decline", status: "Impaired", desc: "Muscle mass loss (sarcopenia) accelerates without targeted amino-acid synthesis." },
            cellular: { title: "Telomere Shortening", status: "Late Stage", desc: "Cellular senescence peaks. Biological age divergence becomes permanent." }
        },
        80: {
            insulin: { title: "Chronic Dysregulation", status: "Severe", desc: "Requires comprehensive metabolic protocol to maintain cognitive glucose uptake." },
            cardio: { title: "Vascular Aging", status: "Needs Support", desc: "Endothelial nitric oxide production drops by over 75%." },
            hormones: { title: "Basal Support", status: "Sub-clinical", desc: "Cellular rejuvenation protocol critical to preserve neuromuscular reflex." },
            cellular: { title: "Morbidity Compression", status: "Superpower Goal", desc: "Remaining vital, active, and independent until final weeks of life." }
        }
    };

    function updateAgeVisualizer() {
        const age = parseInt(ageSlider.value, 10);
        if (currentAgeDisplay) currentAgeDisplay.textContent = age;

        const isOptimized = protocolToggle.checked;
        if (superpowerFill && compressedGap) {
            if (isOptimized) {
                superpowerFill.style.width = '84%';
                compressedGap.style.width = '5%';
                compressedGap.style.display = 'flex';
            } else {
                superpowerFill.style.width = '64%';
                compressedGap.style.width = '18%';
                compressedGap.style.display = 'flex';
            }
        }

        // Determine nearest age bracket
        let bracket = 20;
        if (age >= 75) bracket = 80;
        else if (age >= 58) bracket = 65;
        else if (age >= 43) bracket = 50;
        else if (age >= 28) bracket = 35;

        const data = ageDataMilestones[bracket];
        if (ageDiagnosticGrid && data) {
            ageDiagnosticGrid.innerHTML = `
                <div class="diag-card">
                    <span class="diag-pill">PILLAR 01 // METABOLISM</span>
                    <span class="diag-title">${data.insulin.title}</span>
                    <span class="diag-status ${bracket >= 50 ? 'highlight-rose' : 'highlight-amber'}">${data.insulin.status}</span>
                    <p class="diag-desc">${data.insulin.desc}</p>
                </div>
                <div class="diag-card">
                    <span class="diag-pill">PILLAR 02 // VASCULAR</span>
                    <span class="diag-title">${data.cardio.title}</span>
                    <span class="diag-status ${bracket >= 50 ? 'highlight-rose' : 'highlight-cyan'}">${data.cardio.status}</span>
                    <p class="diag-desc">${data.cardio.desc}</p>
                </div>
                <div class="diag-card">
                    <span class="diag-pill">PILLAR 03 // HORMONES</span>
                    <span class="diag-title">${data.hormones.title}</span>
                    <span class="diag-status ${bracket >= 50 ? 'highlight-amber' : 'highlight-green'}">${data.hormones.status}</span>
                    <p class="diag-desc">${data.hormones.desc}</p>
                </div>
                <div class="diag-card">
                    <span class="diag-pill">PILLAR 04 // CELLULAR</span>
                    <span class="diag-title">${data.cellular.title}</span>
                    <span class="diag-status ${isOptimized ? 'highlight-green' : 'highlight-rose'}">${isOptimized ? 'Targeted Protocol Active' : data.cellular.status}</span>
                    <p class="diag-desc">${data.cellular.desc}</p>
                </div>
            `;
        }
    }

    if (ageSlider) {
        ageSlider.addEventListener('input', () => {
            playClickSound();
            triggerHaptic('selection');
            updateAgeVisualizer();
        });
    }

    if (protocolToggle) {
        protocolToggle.addEventListener('change', () => {
            playToggleSound();
            triggerHaptic('medium');
            updateAgeVisualizer();
        });
    }

    updateAgeVisualizer();

    // --------------------------------------------------------------------------
    // 05. 150+ BIOMARKER DATABASE & MATRIX
    // --------------------------------------------------------------------------
    const biomarkersDB = [
        // Metabolic
        {
            code: "MET-01",
            category: "metabolic",
            categoryName: "Metabolic & Glucose",
            name: "Fasting Insulin",
            status: "blindspot",
            statusLabel: "Hidden Blindspot",
            stdRange: "2.6 – 24.9 µIU/mL (Blunt)",
            optRange: "2.0 – 5.5 µIU/mL (Longevity)",
            misses: "Blood glucose stays 'normal' for up to 15 years while insulin silently skyrockets to compensate. Standard physicals never test insulin until diabetic damage has already occurred.",
            impact: "Chronically elevated insulin locks fat cells, fuels arterial inflammation, increases brain fog, and drives metabolic aging.",
            protocol: ["High-Protein Morning Balance", "Chromium & Vanadyl Chelate", "Post-Meal 10m Walks", "Berberine / Polyphenols"]
        },
        {
            code: "MET-02",
            category: "metabolic",
            categoryName: "Metabolic & Glucose",
            name: "HOMA-IR Score",
            status: "warning",
            statusLabel: "Key Metric",
            stdRange: "< 2.0 (Generic)",
            optRange: "< 1.0 (Optimal Sensitivity)",
            misses: "Standard clinics evaluate glucose and HbA1c independently, missing the mathematical insulin resistance ratio.",
            impact: "Single most accurate predictor of future cardiovascular and metabolic disease.",
            protocol: ["Zero Refined Sugars", "Clean Protein Complex", "Circadian Fasting (14h)"]
        },
        {
            code: "MET-03",
            category: "metabolic",
            categoryName: "Metabolic & Glucose",
            name: "Adiponectin / Leptin Ratio",
            status: "blindspot",
            statusLabel: "Hidden Blindspot",
            stdRange: "Not Tested in Sickcare",
            optRange: "> 0.8 Ratio (Optimal)",
            misses: "Satiety hormone signaling is completely ignored in annual checkups, blaming patient lack of willpower.",
            impact: "Explains uncontrollable late-night cravings and sluggish basal metabolic rate.",
            protocol: ["Omega-3 High DHA/EPA", "Zinc & Magnesium RBC", "Fiber-Rich Probiotics"]
        },

        // Cardiovascular
        {
            code: "LIP-01",
            category: "cardio",
            categoryName: "Cardiovascular & Lipids",
            name: "Apolipoprotein B (ApoB)",
            status: "blindspot",
            statusLabel: "Number 1 Predictor",
            stdRange: "50 – 130 mg/dL (Blunt)",
            optRange: "< 60 mg/dL (Atheroprotective)",
            misses: "Standard physicals test total cholesterol and LDL-C. 50% of heart attack victims have 'normal' standard cholesterol. ApoB counts the actual particle number that penetrates arterial walls.",
            impact: "ApoB particle count is the root causal driver of atheroma formation and arterial plaque.",
            protocol: ["Plant Sterols & Soluble Fiber", "Clean Saturated Fat Ratio", "CoQ10 Ubiquinol 200mg", "Aerobic Zone 2 Cardio"]
        },
        {
            code: "LIP-02",
            category: "cardio",
            categoryName: "Cardiovascular & Lipids",
            name: "Lipoprotein(a) [Lp(a)]",
            status: "warning",
            statusLabel: "Genetic Factor",
            stdRange: "< 30 mg/dL (Standard)",
            optRange: "< 14 mg/dL (Low Risk)",
            misses: "A genetically determined, highly atherogenic and thrombogenic variant carried by 20% of humans. Most people never test it in their lifetime.",
            impact: "Triple risk of premature coronary heart disease and aortic stenosis.",
            protocol: ["Niacin Flush Protocol", "L-Carnitine & Vitamin C", "Strict Inflammation Control"]
        },
        {
            code: "LIP-03",
            category: "cardio",
            categoryName: "Cardiovascular & Lipids",
            name: "High-Sensitivity CRP (hs-CRP)",
            status: "optimal",
            statusLabel: "Inflammation",
            stdRange: "< 3.0 mg/L (Blunt)",
            optRange: "< 0.5 mg/L (Vascular Calm)",
            misses: "Doctors only treat hs-CRP if acute infection (>10). Low-grade smoldering inflammation (1.5-3.0) quietly erodes vessel walls.",
            impact: "Destabilizes plaques and triggers vascular thrombotic events.",
            protocol: ["Curcumin Bioactive Extract", "Deep Slow-Wave Sleep", "Gut Barrier Sealing"]
        },

        // Hormonal
        {
            code: "HOR-01",
            category: "hormones",
            categoryName: "Hormonal Vitality",
            name: "Free Testosterone & Bioavailable T",
            status: "warning",
            statusLabel: "Vitality Vector",
            stdRange: "8.7 – 25.1 pg/mL (Depressed)",
            optRange: "18.0 – 32.0 pg/mL (Peak)",
            misses: "Standard physicals only look at Total T, which includes bound/inactive hormone trapped by SHBG.",
            impact: "Governs lean muscle protein synthesis, bone density, ambition, and cognitive drive.",
            protocol: ["Zinc Bisglycinate 30mg", "Boron 6mg Cyclic", "Ashwagandha KSM-66", "Heavy Compound Lifts"]
        },
        {
            code: "HOR-02",
            category: "hormones",
            categoryName: "Hormonal Vitality",
            name: "Free Triiodothyronine (Free T3)",
            status: "blindspot",
            statusLabel: "Metabolic Engine",
            stdRange: "2.3 – 4.2 pg/mL (Wide)",
            optRange: "3.4 – 4.4 pg/mL (High Output)",
            misses: "Doctors only test TSH. If TSH is normal, they ignore whether your body actually converts inactive T4 to active T3 in the liver.",
            impact: "Free T3 controls body temperature, hair fullness, gut motility, and calorie burning.",
            protocol: ["Selenium 200mcg (Brazil Nut)", "Iodine Kelp Complex", "L-Tyrosine Support"]
        },
        {
            code: "HOR-03",
            category: "hormones",
            categoryName: "Hormonal Vitality",
            name: "DHEA-Sulfate (DHEA-S)",
            status: "optimal",
            statusLabel: "Longevity Hormone",
            stdRange: "80 – 350 µg/dL (Average)",
            optRange: "300 – 480 µg/dL (Youthful)",
            misses: "The 'mother hormone' of all adrenal steroids drops 80% from youth to age 70. Standard clinics consider low levels normal for age.",
            impact: "Supports immune resilience, mood stabilization, and cortisol buffering.",
            protocol: ["DHEA Micronized Therapy", "Cold Thermogenesis", "Adrenal Adaptogens"]
        },

        // Cellular
        {
            code: "CEL-01",
            category: "cellular",
            categoryName: "Cellular Longevity & DNA",
            name: "Intracellular NAD+ Pool",
            status: "blindspot",
            statusLabel: "Cellular Energy",
            stdRange: "Unmeasured in NHS / HMO",
            optRange: "> 40 µM (Optimal Respiration)",
            misses: "Primary coenzyme for DNA repair enzymes (PARPs) and longevity genes (Sirtuins 1-7). Halves every 20 years of life.",
            impact: "Mitochondrial decline, chronic cellular fatigue, and DNA damage accumulation.",
            protocol: ["NMN / NR Supplementation", "HIIT Sauna Protocols", "Circadian Sunlight Reset"]
        },
        {
            code: "CEL-02",
            category: "cellular",
            categoryName: "Cellular Longevity & DNA",
            name: "DNA Methylation Epigenetic Age",
            status: "warning",
            statusLabel: "True Bio Age",
            stdRange: "Chronological Calendar",
            optRange: "5-10 Years Younger than Age",
            misses: "Calendar years don't measure internal wear and tear. Epigenetic clocks measure true cellular degradation.",
            impact: "Identifies systemic biological acceleration before clinical symptoms appear.",
            protocol: ["Methylated Folate & B12", "Choline & Betaine (TMG)", "Caloric Modulation"]
        },

        // Nutrients
        {
            code: "NUT-01",
            category: "nutrients",
            categoryName: "Micronutrients & Minerals",
            name: "RBC Magnesium (Intracellular)",
            status: "blindspot",
            statusLabel: "Critical Deficit",
            stdRange: "Serum: 1.7 – 2.2 mg/dL",
            optRange: "RBC: 6.0 – 7.0 mg/dL (Tissues)",
            misses: "99% of magnesium is inside cells. Standard serum blood tests measure the 1% in serum and are virtually useless for detecting cellular depletion.",
            impact: "Cofactor in 300+ enzymatic reactions. Cellular deficit causes muscle cramps, palpitations, insomnia, and anxiety.",
            protocol: ["Magnesium Glycinate / Malate 400mg", "Epsom Salt Transdermal", "Pro Balance Mineral Complex"]
        },
        {
            code: "NUT-02",
            category: "nutrients",
            categoryName: "Micronutrients & Minerals",
            name: "Vitamin D3 (25-Hydroxy D)",
            status: "optimal",
            statusLabel: "Steroid Regulator",
            stdRange: "30 – 100 ng/mL (Blunt)",
            optRange: "60 – 85 ng/mL (Optimal Defense)",
            misses: "Standard guidelines consider 30 ng/mL 'sufficient' solely to prevent rickets, not for immune and hormonal optimization.",
            impact: "Regulates 5% of the human genome, immune cell activation, and serotonin synthesis.",
            protocol: ["Vitamin D3 5000 IU + K2 (MK-7)", "Daily Morning Solar Exposure", "Healthy Fats with Breakfast"]
        },

        // Immunity & Gut
        {
            code: "IMM-01",
            category: "inflammation",
            categoryName: "Immunity & Gut Health",
            name: "Zonulin & Gut Permeability",
            status: "blindspot",
            statusLabel: "Leaky Gut Trigger",
            stdRange: "Not Tested in Sickcare",
            optRange: "< 38 ng/mL (Sealed Epithelium)",
            misses: "Leaky gut allows bacterial lipopolysaccharides (LPS) to leak into the bloodstream, triggering whole-body inflammation.",
            impact: "Drives autoimmune flares, food sensitivities, skin eruptions, and cognitive fog.",
            protocol: ["L-Glutamine 5g Daily", "Zinc Carnosine", "Colostrum / Bone Broth Peptides"]
        },
        {
            code: "IMM-02",
            category: "inflammation",
            categoryName: "Immunity & Gut Health",
            name: "Homocysteine (Vascular Neurotoxin)",
            status: "warning",
            statusLabel: "Neuro-Vascular",
            stdRange: "< 15 µmol/L (High Ceiling)",
            optRange: "< 7.5 µmol/L (Protective)",
            misses: "Intermediate amino acid from methylation cycle. Excess homocysteine strips arterial lining and damages brain microvessels.",
            impact: "Associated with brain atrophy, stroke risk, and memory decline.",
            protocol: ["Active Methylfolate (5-MTHF)", "Methylcobalamin B12", "Pyridoxal-5-Phosphate B6"]
        }
    ];

    const biomarkerGrid = document.getElementById('biomarkerGrid');
    const biomarkerSearch = document.getElementById('biomarkerSearch');
    const catPills = document.querySelectorAll('.cat-pill');

    function renderBiomarkers(filterCat = 'all', searchQuery = '') {
        if (!biomarkerGrid) return;
        biomarkerGrid.innerHTML = '';

        const query = searchQuery.trim().toLowerCase();

        const filtered = biomarkersDB.filter(item => {
            const matchesCat = (filterCat === 'all' || item.category === filterCat);
            const matchesSearch = !query || 
                item.name.toLowerCase().includes(query) || 
                item.categoryName.toLowerCase().includes(query) ||
                item.code.toLowerCase().includes(query);
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            biomarkerGrid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
                    No biomarkers found matching "${searchQuery}".
                </div>
            `;
            return;
        }

        filtered.forEach(bio => {
            const card = document.createElement('div');
            card.className = 'bio-card';
            card.dataset.code = bio.code;

            let tagClass = 'status-optimal';
            if (bio.status === 'blindspot') tagClass = 'status-blindspot';
            if (bio.status === 'warning') tagClass = 'status-warning';

            card.innerHTML = `
                <div class="bio-card-header">
                    <span class="bio-code">${bio.code}</span>
                    <span class="bio-status-tag ${tagClass}">${bio.statusLabel}</span>
                </div>
                <div>
                    <h3 class="bio-name">${bio.name}</h3>
                    <div class="bio-category-label">${bio.categoryName}</div>
                </div>
                <div class="bio-ranges">
                    <div class="range-row">
                        <span class="range-label">Standard Lab:</span>
                        <span class="range-value" style="color: var(--text-muted);">${bio.stdRange}</span>
                    </div>
                    <div class="range-row">
                        <span class="range-label">Superpower Target:</span>
                        <span class="range-value highlight-green">${bio.optRange}</span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                openBiomarkerDrawer(bio);
            });

            biomarkerGrid.appendChild(card);
        });
    }

    catPills.forEach(pill => {
        pill.addEventListener('click', () => {
            playClickSound();
            triggerHaptic('selection');
            catPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderBiomarkers(pill.dataset.cat, biomarkerSearch ? biomarkerSearch.value : '');
        });
    });

    if (biomarkerSearch) {
        biomarkerSearch.addEventListener('input', (e) => {
            const activeCat = document.querySelector('.cat-pill.active')?.dataset.cat || 'all';
            renderBiomarkers(activeCat, e.target.value);
        });
    }

    renderBiomarkers();

    // --------------------------------------------------------------------------
    // 06. BIOMARKER DETAILS MODAL DRAWER
    // --------------------------------------------------------------------------
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerClose = document.getElementById('drawerClose');
    const drawerCat = document.getElementById('drawerCat');
    const drawerName = document.getElementById('drawerName');
    const drawerCode = document.getElementById('drawerCode');
    const drawerStdRange = document.getElementById('drawerStdRange');
    const drawerOptRange = document.getElementById('drawerOptRange');
    const drawerMisses = document.getElementById('drawerMisses');
    const drawerImpact = document.getElementById('drawerImpact');
    const drawerProtocol = document.getElementById('drawerProtocol');
    const drawerSelectBtn = document.getElementById('drawerSelectBtn');

    let currentSelectedBio = null;

    function openBiomarkerDrawer(bio) {
        currentSelectedBio = bio;
        playCardOpenSound();
        triggerHaptic('medium');

        if (drawerCat) drawerCat.textContent = bio.categoryName.toUpperCase();
        if (drawerName) drawerName.textContent = bio.name;
        if (drawerCode) drawerCode.textContent = bio.code;
        if (drawerStdRange) drawerStdRange.textContent = bio.stdRange;
        if (drawerOptRange) drawerOptRange.textContent = bio.optRange;
        if (drawerMisses) drawerMisses.textContent = bio.misses;
        if (drawerImpact) drawerImpact.textContent = bio.impact;

        if (drawerProtocol) {
            drawerProtocol.innerHTML = '';
            bio.protocol.forEach(item => {
                const tag = document.createElement('span');
                tag.className = 'proto-tag';
                tag.textContent = item;
                drawerProtocol.appendChild(tag);
            });
        }

        drawerOverlay.classList.add('active');
    }

    function closeBiomarkerDrawer() {
        playClickSound();
        drawerOverlay.classList.remove('active');
    }

    if (drawerClose) drawerClose.addEventListener('click', closeBiomarkerDrawer);
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', (e) => {
            if (e.target === drawerOverlay) closeBiomarkerDrawer();
        });
    }

    if (drawerSelectBtn) {
        drawerSelectBtn.addEventListener('click', () => {
            playToggleSound();
            triggerHaptic('light');
            showToast(`✓ ${currentSelectedBio?.name || 'Biomarker'} flagged in your clinical panel`);
            closeBiomarkerDrawer();
        });
    }

    // --------------------------------------------------------------------------
    // 07. INTERACTIVE DIAGNOSTIC QUIZ / GAP CALCULATOR
    // --------------------------------------------------------------------------
    const symptoms = [
        { id: "s1", title: "Afternoon Energy Crashes & Brain Fog", note: "Loss of mental sharpness between 2–5 PM; dependent on coffee", gapYears: 2.1, markers: ["Fasting Insulin", "Free T3 Thyroid", "RBC Magnesium"] },
        { id: "s2", title: "Visceral Fat & Slow Metabolism", note: "Waistline accumulation despite calorie restriction", gapYears: 2.8, markers: ["HOMA-IR Score", "Adiponectin / Leptin", "Cortisol Rhythm"] },
        { id: "s3", title: "Broken Sleep Architecture", note: "Waking between 2–4 AM with racing thoughts or morning fatigue", gapYears: 2.4, markers: ["Cortisol Rhythm", "Vitamin D3", "Magnesium Glycinate"] },
        { id: "s4", title: "Slow Workout Recovery & Muscle Soreness", note: "Takes 3+ days to recover from moderate exercise", gapYears: 1.6, markers: ["Free Testosterone", "hs-CRP", "Intracellular NAD+"] },
        { id: "s5", title: "Cardiovascular Family History & Stress", note: "Hypertension or early heart disease in immediate relatives", gapYears: 3.5, markers: ["Apolipoprotein B (ApoB)", "Lipoprotein(a)", "Homocysteine"] },
        { id: "s6", title: "Bloating & Food Intolerances", note: "Post-meal distension or unpredictable gut sensitivity", gapYears: 1.8, markers: ["Zonulin (Gut Barrier)", "hs-CRP", "Omega-3 Index"] }
    ];

    const symptomChecklist = document.getElementById('symptomChecklist');
    const selectedCounter = document.getElementById('selectedCounter');
    const gaugeNum = document.getElementById('gaugeNum');
    const reportTitle = document.getElementById('reportTitle');
    const resultBreakdown = document.getElementById('resultBreakdown');
    const alertMarkersList = document.getElementById('alertMarkersList');
    const interventionBox = document.getElementById('interventionBox');

    let selectedSymptoms = new Set();

    function renderSymptomChecklist() {
        if (!symptomChecklist) return;
        symptomChecklist.innerHTML = '';

        symptoms.forEach(sym => {
            const item = document.createElement('div');
            item.className = 'symptom-item';
            item.dataset.id = sym.id;

            item.innerHTML = `
                <div class="symptom-checkbox">✓</div>
                <div class="symptom-info">
                    <span class="symptom-title">${sym.title}</span>
                    <span class="symptom-note">${sym.note}</span>
                </div>
            `;

            item.addEventListener('click', () => {
                initAudio();
                playClickSound();
                triggerHaptic('selection');

                if (selectedSymptoms.has(sym.id)) {
                    selectedSymptoms.delete(sym.id);
                    item.classList.remove('selected');
                } else {
                    selectedSymptoms.add(sym.id);
                    item.classList.add('selected');
                }

                updateDiagnosis();
            });

            symptomChecklist.appendChild(item);
        });
    }

    function updateDiagnosis() {
        const count = selectedSymptoms.size;
        if (selectedCounter) selectedCounter.textContent = `${count} SELECTED`;

        if (count === 0) {
            if (gaugeNum) gaugeNum.textContent = "0.0";
            if (reportTitle) reportTitle.textContent = "Select indicators above to calculate risk profile";
            if (resultBreakdown) resultBreakdown.style.display = 'none';
            return;
        }

        let totalGapYears = 0;
        const allAlertMarkers = new Set();

        selectedSymptoms.forEach(id => {
            const sym = symptoms.find(s => s.id === id);
            if (sym) {
                totalGapYears += sym.gapYears;
                sym.markers.forEach(m => allAlertMarkers.add(m));
            }
        });

        // Cap gap years realistically
        const displayedGap = Math.min(14.8, totalGapYears).toFixed(1);

        if (gaugeNum) gaugeNum.textContent = displayedGap;
        if (reportTitle) {
            reportTitle.textContent = `${count} Critical Vulnerabilities Detected: ~${displayedGap} Years in Health Decline`;
        }

        if (resultBreakdown) {
            resultBreakdown.style.display = 'grid';
        }

        if (alertMarkersList) {
            alertMarkersList.innerHTML = '';
            allAlertMarkers.forEach(m => {
                const li = document.createElement('li');
                li.className = 'biomarker-alert-item';
                li.innerHTML = `
                    <span class="alert-name">${m}</span>
                    <span class="alert-tag">CRITICAL BLIND SPOT</span>
                `;
                alertMarkersList.appendChild(li);
            });
        }

        if (interventionBox) {
            interventionBox.innerHTML = `
                <p><strong>Primary Strategic Directive:</strong> Transition away from waiting for clinical symptoms. Implement early <strong>ApoB lipid control</strong>, stabilize <strong>fasting insulin</strong> with an optimal high-protein / low-glycemic breakfast formula, and replete <strong>intracellular magnesium</strong>.</p>
                <p style="margin-top: 10px; color: var(--accent-emerald);"><strong>Target Result:</strong> Reclaim ${displayedGap} healthy years and compress late-life morbidity into zero.</p>
            `;
        }
    }

    renderSymptomChecklist();

    // --------------------------------------------------------------------------
    // 08. TOAST NOTIFICATIONS
    // --------------------------------------------------------------------------
    const toastContainer = document.getElementById('toastContainer');
    function showToast(message) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // --------------------------------------------------------------------------
    // 09. GLOBAL ACTION BUTTONS
    // --------------------------------------------------------------------------
    const startDiagnosisBtn = document.getElementById('startDiagnosisBtn');
    if (startDiagnosisBtn) {
        startDiagnosisBtn.addEventListener('click', () => {
            playClickSound();
            triggerHaptic('light');
            document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const footerOrderBtn = document.getElementById('footerOrderBtn');
    if (footerOrderBtn) {
        footerOrderBtn.addEventListener('click', () => {
            playToggleSound();
            triggerHaptic('medium');
            showToast('✓ Superpower Longevity Panel reserved. Check Telegram bot.');
        });
    }

    // Ambient mouse follower for luxury glow on desktop
    window.addEventListener('mousemove', (e) => {
        const topGlow = document.getElementById('ambientGlowTop');
        if (topGlow && window.innerWidth > 900) {
            const x = (e.clientX / window.innerWidth - 0.5) * 60;
            const y = (e.clientY / window.innerHeight - 0.5) * 60;
            topGlow.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
});
