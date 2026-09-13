// ============================================================
// PRO BALANCE • Editorial Luxury Experience Engine
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    soundEnabled: true,
    pulsingEnabled: true,
    selectedFlavor: 'Ванільний крем',
    selectedFormat: '3-Денний Тест',
    activeProduct: 'Формула 1 (Ванільний крем)'
  };

  // Telegram Web App SDK Initialization
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    // Match colors if in Telegram
    try {
      tg.setHeaderColor('#f8f7f4');
      tg.setBackgroundColor('#f8f7f4');
    } catch(e) {}
  }

  function triggerHaptic(type = 'light') {
    try {
      if (tg?.HapticFeedback) {
        if (type === 'medium') tg.HapticFeedback.impactOccurred('medium');
        else if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
        else tg.HapticFeedback.impactOccurred('light');
      }
    } catch(e) {}
  }
  const soundEngine = {
    ctx: null,

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    },

    // Delicate camera shutter / luxury dial micro-tick
    playTick() {
      if (!state.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    },

    // Gentle warm acoustic chord on modal opening
    playChime() {
      if (!state.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      // Soft major triad (F-sharp minor / ambient warmth)
      [440, 554.37, 659.25].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.035, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.35);
      });
    },

    // Minimalist success confirmation tone
    playConfirm() {
      if (!state.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      [587.33, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.05, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    }
  };

  // Modals
  const modalShake = document.getElementById('modalShake');
  const modalAloe = document.getElementById('modalAloe');
  const modalDiet = document.getElementById('modalDiet');
  const modalCheckout = document.getElementById('modalCheckout');

  const closeShakeBtn = document.getElementById('closeShakeBtn');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');

  // Hotspot Elements
  const spotShake = document.getElementById('spotShake');
  const spotAloe = document.getElementById('spotAloe');
  const spotDiet = document.getElementById('spotDiet');

  // Interactive controls
  const quickOpenShake = document.getElementById('quickOpenShake');
  const btnQuickOrder = document.getElementById('btnQuickOrder');
  const bookConsultBtn = document.getElementById('bookConsultBtn');
  const soundToggle = document.getElementById('soundToggle');
  const pulseControlBtn = document.getElementById('pulseControlBtn');

  // 3D Canvas
  const studioCanvas = document.getElementById('studioCanvas');
  const studioCanister = document.getElementById('studioCanister');

  // Flavor Swatches
  const swatchBtns = document.querySelectorAll('.swatch-btn');
  const selectedFlavorDisplay = document.getElementById('selectedFlavorDisplay');

  // Format cards
  const formatCards = document.querySelectorAll('.format-card');

  // Modal CTAs
  const openCheckoutFromShake = document.getElementById('openCheckoutFromShake');
  const openChatConsult = document.getElementById('openChatConsult');
  const orderAloeAction = document.getElementById('orderAloeAction');
  const orderDietAction = document.getElementById('orderDietAction');

  // Checkout Elements
  const checkoutTargetSummary = document.getElementById('checkoutTargetSummary');
  const orderForm = document.getElementById('orderForm');
  const checkoutFormBlock = document.getElementById('checkoutFormBlock');
  const checkoutSuccessBlock = document.getElementById('checkoutSuccessBlock');
  const successDetailsBox = document.getElementById('successDetailsBox');
  const btnFinishSuccess = document.getElementById('btnFinishSuccess');

  // -------------------------------------------------------------
  // MODAL MANAGEMENT
  // -------------------------------------------------------------
  function openModal(modal) {
    if (!modal) return;
    soundEngine.playChime();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    if (!document.querySelector('.luxury-modal-overlay.active')) {
      document.body.style.overflow = '';
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.luxury-modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  // Close when clicking outside modal box
  document.querySelectorAll('.luxury-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // Generic close buttons
  document.querySelectorAll('[data-close-generic]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.luxury-modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  if (closeShakeBtn) closeShakeBtn.addEventListener('click', () => closeModal(modalShake));
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => closeModal(modalCheckout));

  // -------------------------------------------------------------
  // HOTSPOT ATTACHMENTS
  // -------------------------------------------------------------
  if (spotShake) {
    spotShake.addEventListener('click', () => openModal(modalShake));
    spotShake.addEventListener('mouseenter', () => soundEngine.playTick());
  }

  if (spotAloe) {
    spotAloe.addEventListener('click', () => openModal(modalAloe));
    spotAloe.addEventListener('mouseenter', () => soundEngine.playTick());
  }

  if (spotDiet) {
    spotDiet.addEventListener('click', () => openModal(modalDiet));
    spotDiet.addEventListener('mouseenter', () => soundEngine.playTick());
  }

  if (quickOpenShake) {
    quickOpenShake.addEventListener('click', () => openModal(modalShake));
  }

  // -------------------------------------------------------------
  // AUDIO & PULSE TOGGLES
  // -------------------------------------------------------------
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      soundToggle.classList.toggle('muted', !state.soundEnabled);
      const label = soundToggle.querySelector('.tool-label');
      if (label) label.textContent = state.soundEnabled ? 'SOUND: ON' : 'SOUND: OFF';
      if (state.soundEnabled) soundEngine.playTick();
    });
  }

  if (pulseControlBtn) {
    pulseControlBtn.addEventListener('click', () => {
      state.pulsingEnabled = !state.pulsingEnabled;
      document.querySelectorAll('.quiet-pulse-ring').forEach(ring => {
        ring.style.display = state.pulsingEnabled ? '' : 'none';
      });
      pulseControlBtn.textContent = state.pulsingEnabled ? 'Вимкнути маркери' : 'Увімкнути маркери';
      soundEngine.playTick();
    });
  }

  // -------------------------------------------------------------
  // 3D STUDIO PERSPECTIVE TILT
  // -------------------------------------------------------------
  if (studioCanvas && studioCanister) {
    studioCanvas.addEventListener('mousemove', (e) => {
      const rect = studioCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = (y / (rect.height / 2)) * -14;
      const rotY = (x / (rect.width / 2)) * 16;

      studioCanister.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
    });

    studioCanvas.addEventListener('mouseleave', () => {
      studioCanister.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // -------------------------------------------------------------
  // FLAVOR SELECTION
  // -------------------------------------------------------------
  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const flavor = btn.getAttribute('data-flavor');
      state.selectedFlavor = flavor;
      if (selectedFlavorDisplay) selectedFlavorDisplay.textContent = flavor;
      soundEngine.playTick();
    });
  });

  // -------------------------------------------------------------
  // FORMAT SELECTION
  // -------------------------------------------------------------
  formatCards.forEach(card => {
    card.addEventListener('click', () => {
      formatCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const priceTag = card.querySelector('.format-price');
      if (priceTag) state.selectedFormat = priceTag.textContent.trim();
      soundEngine.playTick();
    });
  });

  // -------------------------------------------------------------
  // CHECKOUT ROUTING
  // -------------------------------------------------------------
  function launchCheckout(summaryText) {
    state.activeProduct = summaryText || `Формула 1 (${state.selectedFlavor}) • ${state.selectedFormat}`;

    if (checkoutTargetSummary) {
      checkoutTargetSummary.innerHTML = `Обрана позиція: <strong>${state.activeProduct}</strong>`;
    }

    // Auto-fill from Telegram if available
    const tgUser = tg?.initDataUnsafe?.user;
    if (tgUser) {
      const nameField = document.getElementById('clientName');
      const phoneField = document.getElementById('clientPhone');
      if (nameField && !nameField.value) {
        nameField.value = `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim();
      }
      if (phoneField && !phoneField.value && tgUser.username) {
        phoneField.value = `@${tgUser.username}`;
      }
    }

    checkoutFormBlock.style.display = 'block';
    checkoutSuccessBlock.style.display = 'none';

    closeModal(modalShake);
    closeModal(modalAloe);
    closeModal(modalDiet);

    openModal(modalCheckout);
  }

  if (openCheckoutFromShake) {
    openCheckoutFromShake.addEventListener('click', () => {
      launchCheckout(`Формула 1 «${state.selectedFlavor}» • ${state.selectedFormat}`);
    });
  }

  if (openChatConsult) {
    openChatConsult.addEventListener('click', () => {
      launchCheckout(`Індивідуальна консультація: підбір смаку та дозування (${state.selectedFlavor})`);
    });
  }

  if (orderAloeAction) {
    orderAloeAction.addEventListener('click', () => {
      launchCheckout('Рослинний напій Алое Вера (Гідратація та Детокс)');
    });
  }

  if (orderDietAction) {
    orderDietAction.addEventListener('click', () => {
      launchCheckout('Розрахунок персонального раціону Pro Balance');
    });
  }

  if (btnQuickOrder) {
    btnQuickOrder.addEventListener('click', () => {
      launchCheckout('Стартовий набір «3-Денний Тест-Драйв»');
    });
  }

  if (bookConsultBtn) {
    bookConsultBtn.addEventListener('click', () => {
      launchCheckout('Персональна консультація з нутриціологом');
    });
  }

  // Communication Channel Radios
  const channelCards = document.querySelectorAll('.channel-card');
  channelCards.forEach(card => {
    card.addEventListener('click', () => {
      channelCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      soundEngine.playTick();
    });
  });

  // Form Submit
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const channel = document.querySelector('input[name="commChannel"]:checked')?.value || 'Telegram';

      soundEngine.playConfirm();

      checkoutFormBlock.style.display = 'none';
      checkoutSuccessBlock.style.display = 'block';

      if (successDetailsBox) {
        successDetailsBox.innerHTML = `
          <div><strong>Клієнт:</strong> ${name}</div>
          <div><strong>Канал:</strong> ${phone} (${channel})</div>
          <div><strong>Продукт:</strong> ${state.activeProduct}</div>
        `;
      }
    });
  }

  if (btnFinishSuccess) {
    btnFinishSuccess.addEventListener('click', () => {
      closeModal(modalCheckout);
    });
  }

  // Scene Tabs Switching (Visual demo)
  const sceneTabs = document.querySelectorAll('.scene-tab');
  sceneTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sceneTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      soundEngine.playTick();
    });
  });

  // Escape key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
});
