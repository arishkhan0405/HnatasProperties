/* ==========================================================================
   MM PROPERTIES - MASTER CLIENT INTERACTIVITY & UI CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Smooth Magnetic Cursor
  initCustomCursor();

  // 2. Navigation Header Scroll Effect & Mobile Drawer
  initNavigation();

  // 3. 3D Tilt Effect on Property & Visual Cards
  init3DTiltCards();

  // 4. Property Grid Filtering
  initPropertyFilters();

  // 5. Currency Converter System
  initCurrencyConverter();

  // 6. Interactive 360 Showcase Viewer & Hotspots
  init360Showcase();

  // 7. Modals (VIP Booking, 360 Tour, Quick Details)
  initModals();

  // 8. Bookmark & Favorites System with Toast Notifications
  initFavoritesSystem();

  // 9. IntersectionObserver Scroll Reveal & Animated Metrics Counter
  initScrollAnimations();

  // 10. Contact & Newsletter Form Handling
  initFormHandlers();

  // 11. Hero Background Estate Switcher
  initHeroEstateSwitcher();

  // 12. Maximalist Theme Switcher Engine
  initMaximalistThemeEngine();

  // 13. Soundscape Audio Synthesizer
  initSoundscapeEngine();

  // 14. Property Comparison Engine & Matrix
  initPropertyComparisonEngine();

  // 15. Interactive WhatsApp VIP Chatbot Engine
  initWhatsAppChatbot();
});

/* ==========================================================================
   0. HERO ESTATE BACKGROUND SWITCHER
   ========================================================================== */
function initHeroEstateSwitcher() {
  const switcherBtns = document.querySelectorAll('.hero-switcher-btn');
  const heroBgImg = document.getElementById('hero-bg-image');
  if (!switcherBtns.length || !heroBgImg) return;

  switcherBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      switcherBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const newBg = btn.getAttribute('data-bg');
      const title = btn.getAttribute('data-title');
      const price = btn.getAttribute('data-price');

      if (newBg) {
        heroBgImg.style.opacity = '0.3';
        heroBgImg.style.transform = 'scale(1.15)';
        setTimeout(() => {
          heroBgImg.src = newBg;
          heroBgImg.style.opacity = '1';
          heroBgImg.style.transform = 'scale(1.05)';
        }, 250);
      }

      if (title && price) {
        showToast(`Hero Featured: ${title} (${price})`);
      }
    });
  });
}

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover states on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, .property-card, .service-card, .hotspot-pin');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => ring.classList.add('active'));
    target.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ==========================================================================
   2. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      toggleBtn.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
      });
    });
  }

  // Back to Top button
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   3. 3D TILT EFFECT
   ========================================================================== */
function init3DTiltCards() {
  const tiltElements = document.querySelectorAll('.tilt-card, .property-card, .about-image-card-3d, .why-interactive-card');

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   4. PROPERTY GRID FILTERING
   ========================================================================== */
function initPropertyFilters() {
  const filterBtns = document.querySelectorAll('.prop-filter-btn');
  const propertyCards = document.querySelectorAll('.property-card-wrapper');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      propertyCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   5. CURRENCY CONVERTER
   ========================================================================== */
const propertyBaseUSD = {
  prop1: 18500000,
  prop2: 34000000,
  prop3: 12800000,
  prop4: 26500000,
  prop5: 45000000,
  prop6: 15200000
};

function initCurrencyConverter() {
  const currencySelector = document.getElementById('currency-selector');
  if (!currencySelector) return;

  currencySelector.addEventListener('change', (e) => {
    const currency = e.target.value;
    updateAllPrices(currency);
    showToast(`Currency updated to ${currency}`);
  });
}

function updateAllPrices(currency) {
  let rate = 1;
  let symbol = '$';

  if (currency === 'EUR') {
    symbol = '€';
    rate = 0.92;
  } else if (currency === 'GBP') {
    symbol = '£';
    rate = 0.79;
  } else if (currency === 'AED') {
    symbol = 'AED ';
    rate = 3.67;
  }

  document.querySelectorAll('[data-base-price]').forEach((priceEl) => {
    const base = parseFloat(priceEl.getAttribute('data-base-price'));
    const converted = base * rate;
    priceEl.textContent = symbol + (converted / 1000000).toFixed(1) + 'M';
  });
}

/* ==========================================================================
   6. INTERACTIVE 360 SHOWCASE
   ========================================================================== */
function init360Showcase() {
  const panoramicImg = document.querySelector('.showcase-bg-panoramic');
  const container = document.querySelector('.showcase-viewer-container');
  if (!panoramicImg || !container) return;

  let isDown = false;
  let startX;
  let scrollLeft = 0;
  let currentPos = 50;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 0.08;
    currentPos = Math.max(0, Math.min(100, currentPos - walk));
    panoramicImg.style.objectPosition = `${currentPos}% center`;
    startX = x;
  });

  // Hotspot click modal triggers
  const hotspots = document.querySelectorAll('.hotspot-pin');
  hotspots.forEach((spot) => {
    spot.addEventListener('click', () => {
      const room = spot.getAttribute('data-room-name') || 'Master Suite';
      showToast(`Viewing 360° Spotlight: ${room}`);
    });
  });
}

/* ==========================================================================
   7. MODAL SYSTEM (VIP BOOKING, 360 TOUR, PROPERTY DETAILS)
   ========================================================================== */
function initModals() {
  const bookingModal = document.getElementById('vip-booking-modal');
  const tourModal = document.getElementById('virtual-tour-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
  const backdrops = document.querySelectorAll('.modal-backdrop');

  // Trigger VIP Booking Modal
  document.querySelectorAll('.open-booking-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const propTitle = btn.getAttribute('data-prop-name') || 'Signature Collection';
      const propInput = document.getElementById('modal-booking-prop-name');
      if (propInput) propInput.value = propTitle;
      if (bookingModal) bookingModal.classList.add('active');
    });
  });

  // Trigger 360 Tour Modal
  document.querySelectorAll('.property-tour-360-btn, .hero-explore-tour-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (tourModal) tourModal.classList.add('active');
    });
  });

  // Close handlers
  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      backdrops.forEach((b) => b.classList.remove('active'));
    });
  });

  backdrops.forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });

  // Escape key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      backdrops.forEach((b) => b.classList.remove('active'));
    }
  });
}

/* ==========================================================================
   8. FAVORITES & TOAST NOTIFICATIONS
   ========================================================================== */
function initFavoritesSystem() {
  const favBtns = document.querySelectorAll('.property-favorite-btn');

  favBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const isFav = btn.classList.contains('active');
      const title = btn.getAttribute('data-prop-title') || 'Estate';

      if (isFav) {
        btn.innerHTML = '♥';
        showToast(`Saved "${title}" to your Private Portfolio.`);
      } else {
        btn.innerHTML = '♡';
        showToast(`Removed "${title}" from favorites.`);
      }
    });
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <span style="color: var(--gold-light); font-size: 1.1rem;">✦</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

/* ==========================================================================
   9. SCROLL REVEAL & STATS COUNTER
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // Animated Numbers Counter
  const countElements = document.querySelectorAll('[data-counter-target]');
  let hasCounted = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          countElements.forEach((el) => {
            const target = parseFloat(el.getAttribute('data-counter-target'));
            const prefix = el.getAttribute('data-counter-prefix') || '';
            const suffix = el.getAttribute('data-counter-suffix') || '';
            const isDecimal = target % 1 !== 0;

            let current = 0;
            const duration = 2000;
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current)}${suffix}`;
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.hero-metrics-grid');
  if (statsSection) counterObserver.observe(statsSection);
}

/* ==========================================================================
   10. FORM SUBMISSION HANDLERS
   ========================================================================== */
function initFormHandlers() {
  const contactForm = document.getElementById('luxury-inquiry-form');
  const modalBookingForm = document.getElementById('modal-vip-form');
  const newsletterForm = document.querySelector('.newsletter-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Inquiry received. A Senior Partner will contact you discreetly within 2 hours.');
      contactForm.reset();
    });
  }

  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('VIP Private Viewing appointment booked. Concierge confirmation sent.');
      document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.remove('active'));
      modalBookingForm.reset();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Subscribed to MRpropertys Private Layout Updates.');
      newsletterForm.reset();
    });
  }
}

/* ==========================================================================
   12. MAXIMALIST THEME ENGINE & AURA SWITCHER
   ========================================================================== */
function initMaximalistThemeEngine() {
  const themeBtns = document.querySelectorAll('.theme-pill-btn');
  if (!themeBtns.length) return;

  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);

      themeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      playChimeSound(660);

      const themeNames = {
        gold: 'Baroque Obsidian Gold ⚜️',
        emerald: 'Royal Emerald Velvet 💚',
        violet: 'Amethyst Empire 🔮',
        ruby: 'Ruby Trophy Luxury 🌹'
      };
      showToast(`Aura switched to: ${themeNames[theme] || theme}`);
    });
  });
}

/* ==========================================================================
   13. SOUNDSCAPE AUDIO SYNTHESIZER (WEB AUDIO API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundscapeEngine() {
  const soundBtn = document.getElementById('soundscape-toggle-btn');
  const soundIcon = document.getElementById('soundscape-icon');
  const soundStatus = document.getElementById('soundscape-status');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundStatus) soundStatus.textContent = soundEnabled ? 'Audio ON' : 'Audio OFF';
      if (soundIcon) soundIcon.setAttribute('data-lucide', soundEnabled ? 'volume-2' : 'volume-x');
      if (typeof lucide !== 'undefined') lucide.createIcons();

      if (soundEnabled) playChimeSound(880);
      showToast(`Interactive Soundscape: ${soundEnabled ? 'ON' : 'OFF'}`);
    });
  }

  document.querySelectorAll('.btn, .property-card, .theme-pill-btn, .service-card').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playChimeSound(440, 0.03, 'sine');
    });
  });
}

function playChimeSound(freq = 520, duration = 0.1, type = 'sine') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Silent fallback
  }
}

/* ==========================================================================
   14. PROPERTY COMPARISON QUEUE & MATRIX ENGINE
   ========================================================================== */
let compareQueue = [];

function initPropertyComparisonEngine() {
  const compareBtns = document.querySelectorAll('.btn-compare-add');
  const compareDrawer = document.getElementById('compare-drawer');
  const compareContainer = document.getElementById('compare-items-container');
  const queueCountLabel = document.getElementById('compare-queue-count');
  const dockCountLabel = document.getElementById('dock-compare-count');
  const dockCompareBtn = document.getElementById('dock-compare-btn');
  const closeDrawerBtn = document.getElementById('close-compare-drawer-btn');
  const clearCompareBtn = document.getElementById('clear-compare-btn');
  const launchModalBtn = document.getElementById('launch-compare-modal-btn');
  const compareModal = document.getElementById('compare-modal');

  compareBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-prop-title');
      const price = btn.getAttribute('data-prop-price');
      const img = btn.getAttribute('data-prop-img');
      const beds = btn.getAttribute('data-prop-beds');
      const baths = btn.getAttribute('data-prop-baths');
      const sqft = btn.getAttribute('data-prop-sqft');
      const loc = btn.getAttribute('data-prop-loc');

      const existingIndex = compareQueue.findIndex((item) => item.title === title);

      if (existingIndex > -1) {
        compareQueue.splice(existingIndex, 1);
        btn.classList.remove('active');
        btn.innerHTML = `<i data-lucide="scale" style="width: 12px; height: 12px;"></i> Compare`;
        showToast(`Removed from comparison: ${title}`);
      } else {
        if (compareQueue.length >= 3) {
          showToast('Comparison limit reached (Maximum 3 properties).');
          return;
        }
        compareQueue.push({ title, price, img, beds, baths, sqft, loc });
        btn.classList.add('active');
        btn.innerHTML = `<i data-lucide="check" style="width: 12px; height: 12px;"></i> Added`;
        showToast(`Added to comparison: ${title}`);
      }

      if (typeof lucide !== 'undefined') lucide.createIcons();
      updateCompareUI();
      playChimeSound(750);
    });
  });

  function updateCompareUI() {
    const count = compareQueue.length;
    if (queueCountLabel) queueCountLabel.textContent = count;
    if (dockCountLabel) dockCountLabel.textContent = count;

    if (count > 0 && compareDrawer) {
      compareDrawer.classList.add('active');
    } else if (compareDrawer) {
      compareDrawer.classList.remove('active');
    }

    if (compareContainer) {
      compareContainer.innerHTML = compareQueue
        .map(
          (item, idx) => `
        <div class="compare-item-chip">
          <img src="${item.img}" alt="${item.title}" class="compare-item-thumb">
          <div class="compare-item-info">
            <div class="compare-item-title">${item.title}</div>
            <div class="compare-item-price">${item.price} • ${item.beds}</div>
          </div>
          <button class="compare-item-remove" onclick="removeCompareItem(${idx})">✕</button>
        </div>
      `
        )
        .join('');
    }
  }

  window.removeCompareItem = function (idx) {
    const item = compareQueue[idx];
    if (item) {
      compareQueue.splice(idx, 1);
      compareBtns.forEach((btn) => {
        if (btn.getAttribute('data-prop-title') === item.title) {
          btn.classList.remove('active');
          btn.innerHTML = `<i data-lucide="scale" style="width: 12px; height: 12px;"></i> Compare`;
        }
      });
      if (typeof lucide !== 'undefined') lucide.createIcons();
      updateCompareUI();
    }
  };

  if (closeDrawerBtn && compareDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      compareDrawer.classList.remove('active');
    });
  }

  if (dockCompareBtn && compareDrawer) {
    dockCompareBtn.addEventListener('click', () => {
      if (compareQueue.length === 0) {
        showToast('Please click "Compare" on property cards first.');
      } else {
        compareDrawer.classList.toggle('active');
      }
    });
  }

  if (clearCompareBtn) {
    clearCompareBtn.addEventListener('click', () => {
      compareQueue = [];
      compareBtns.forEach((btn) => {
        btn.classList.remove('active');
        btn.innerHTML = `<i data-lucide="scale" style="width: 12px; height: 12px;"></i> Compare`;
      });
      if (typeof lucide !== 'undefined') lucide.createIcons();
      updateCompareUI();
      showToast('Comparison queue cleared.');
    });
  }

  if (launchModalBtn && compareModal) {
    launchModalBtn.addEventListener('click', () => {
      if (compareQueue.length === 0) {
        showToast('Add at least 1 property to compare side-by-side.');
        return;
      }
      renderCompareTable();
      compareModal.classList.add('active');
    });
  }
}

function renderCompareTable() {
  const table = document.getElementById('compare-table-content');
  if (!table || !compareQueue.length) return;

  const headerRow = `<tr><th>Feature / Spec</th>${compareQueue.map((q) => `<th>${q.title}</th>`).join('')}</tr>`;
  const priceRow = `<tr><td><strong>Valuation</strong></td>${compareQueue.map((q) => `<td style="color: var(--gold-light); font-weight: 700;">${q.price}</td>`).join('')}</tr>`;
  const locRow = `<tr><td><strong>Location</strong></td>${compareQueue.map((q) => `<td>${q.loc}</td>`).join('')}</tr>`;
  const bedsRow = `<tr><td><strong>Bedrooms</strong></td>${compareQueue.map((q) => `<td>${q.beds}</td>`).join('')}</tr>`;
  const bathsRow = `<tr><td><strong>Bathrooms</strong></td>${compareQueue.map((q) => `<td>${q.baths}</td>`).join('')}</tr>`;
  const areaRow = `<tr><td><strong>Total Area</strong></td>${compareQueue.map((q) => `<td>${q.sqft}</td>`).join('')}</tr>`;
  const actionRow = `<tr><td><strong>Action</strong></td>${compareQueue
    .map(
      (q) => `<td><button class="btn btn-primary btn-sm open-booking-modal-btn" data-prop-name="${q.title}">Inquire</button></td>`
    )
    .join('')}</tr>`;

  table.innerHTML = headerRow + priceRow + locRow + bedsRow + bathsRow + areaRow + actionRow;
}

/* ==========================================================================
   15. INTERACTIVE WHATSAPP VIP CHATBOT ENGINE
   ========================================================================== */
function initWhatsAppChatbot() {
  const triggerBtn = document.getElementById('whatsapp-bot-toggle');
  const chatBox = document.getElementById('whatsapp-chat-box');
  const closeBtn = document.getElementById('whatsapp-chat-close');
  const badge = document.getElementById('whatsapp-badge');
  const chatBody = document.getElementById('whatsapp-chat-body');
  const chatForm = document.getElementById('whatsapp-chat-form');
  const chatInput = document.getElementById('whatsapp-chat-input');
  const chipBtns = document.querySelectorAll('.wa-chip-btn');

  if (!triggerBtn || !chatBox) return;

  // 1. Single Configurable Business WhatsApp Variable
  const BUSINESS_WHATSAPP = "+9177044 50500";

  // Conversational Lead State
  let currentStep = 0; // 0: Name, 1: Phone, 2: Requirement, 3: Location, 4: Budget, 5: Question/Ready
  const leadState = {
    name: '',
    phone: '',
    requirement: '',
    location: '',
    budget: '',
    question: ''
  };

  // Toggle Chat Box Window
  triggerBtn.addEventListener('click', () => {
    const isActive = chatBox.classList.contains('active');
    if (!isActive) {
      chatBox.classList.add('active');
      if (badge) badge.style.opacity = '0';
      if (chatInput) chatInput.focus();
    } else {
      chatBox.classList.remove('active');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatBox.classList.remove('active');
    });
  }

  // Handle Quick Action Chips
  chipBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const intent = btn.getAttribute('data-intent');
      if (intent) {
        leadState.requirement = intent;
        if (!leadState.question) leadState.question = intent;
        appendUserMsg(intent);

        if (!leadState.name) {
          currentStep = 0;
          setTimeout(() => {
            appendBotMsg(`Great choice! 📍 <strong>${escapeHtml(intent)}</strong> is a premier layout option.<br><br>May I know your <strong>Full Name</strong>?`);
          }, 300);
        } else if (!leadState.phone) {
          currentStep = 1;
          setTimeout(() => {
            appendBotMsg(`Thanks <strong>${escapeHtml(leadState.name)}</strong>! Please enter your <strong>10-digit Mobile Number</strong>:`);
          }, 300);
        } else {
          showEnquirySummaryCard();
        }
      }
    });
  });

  // Handle Input Form Submission
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;

      appendUserMsg(val);
      chatInput.value = '';

      processUserInput(val);
    });
  }

  function processUserInput(inputVal) {
    if (currentStep === 0) {
      // Step 0: Collect Name
      leadState.name = inputVal;
      currentStep = 1;
      setTimeout(() => {
        appendBotMsg(`Pleased to meet you, <strong>${escapeHtml(leadState.name)}</strong>! 🙏<br><br>Please enter your <strong>10-digit Phone Number</strong>:`);
      }, 300);

    } else if (currentStep === 1) {
      // Step 1: Validate & Collect Phone
      if (validatePhone(inputVal)) {
        leadState.phone = inputVal;
        currentStep = 2;
        setTimeout(() => {
          appendBotMsg(`Got it! 📱 <strong>${escapeHtml(leadState.phone)}</strong><br><br>What type of property layout are you interested in?`, [
            { text: "📍 Commercial NH Frontage", val: "Commercial NH Frontage Plots" },
            { text: "💎 Diamond East/North Facing", val: "Diamond East/North Facing Plots" },
            { text: "Platinum Dual Corner", val: "Platinum Dual Corner Plots" },
            { text: "Villa Land Compound", val: "Combined Villa Land Compound" }
          ]);
        }, 300);
      } else {
        // Invalid phone number - prompt gently without blocking
        setTimeout(() => {
          appendBotMsg(`⚠️ Please enter a valid 10-digit phone number (e.g. 98424 00000) so we can send the layout PDF via WhatsApp.`);
        }, 300);
      }

    } else if (currentStep === 2) {
      // Step 2: Collect Requirement
      leadState.requirement = inputVal;
      currentStep = 3;
      setTimeout(() => {
        appendBotMsg(`Selected: 🏠 <strong>${escapeHtml(leadState.requirement)}</strong><br><br>What is your preferred location / city?`, [
          { text: "Trichy / Manikandam", val: "Trichy / Manikandam" },
          { text: "Chennai", val: "Chennai" },
          { text: "NRI Location (Dubai/Singapore)", val: "NRI Location" }
        ]);
      }, 300);

    } else if (currentStep === 3) {
      // Step 3: Collect Location
      leadState.location = inputVal;
      currentStep = 4;
      setTimeout(() => {
        appendBotMsg(`Got it: 📍 <strong>${escapeHtml(leadState.location)}</strong><br><br>What is your estimated budget range?`, [
          { text: "₹15 Lakhs - ₹25 Lakhs", val: "₹15L - ₹25L" },
          { text: "₹25 Lakhs - ₹50 Lakhs", val: "₹25L - ₹50L" },
          { text: "₹50 Lakhs+", val: "₹50L+" }
        ]);
      }, 300);

    } else if (currentStep === 4) {
      // Step 4: Collect Budget
      leadState.budget = inputVal;
      currentStep = 5;
      setTimeout(() => {
        appendBotMsg(`Noted: 💰 Budget <strong>${escapeHtml(leadState.budget)}</strong><br><br>Do you have any specific question, plot direction preference, or site visit date?`);
      }, 300);

    } else {
      // Step 5+: Collect Question / Final details
      if (!leadState.question || leadState.question === 'Not provided') {
        leadState.question = inputVal;
      }
      showEnquirySummaryCard();
    }
  }

  // 12. Phone Number Validation (checks digits length >= 10)
  function validatePhone(phoneStr) {
    if (!phoneStr) return false;
    const cleanDigits = phoneStr.replace(/\D/g, '');
    return cleanDigits.length >= 10 && cleanDigits.length <= 15;
  }

  // 3 & 5 & 13. Generate Pre-filled Encoded WhatsApp URL
  function generateWhatsAppURL(data) {
    const name = (data.name && data.name.trim()) ? data.name.trim() : 'Not provided';
    const phone = (data.phone && data.phone.trim()) ? data.phone.trim() : 'Not provided';
    const requirement = (data.requirement && data.requirement.trim()) ? data.requirement.trim() : 'Not provided';
    const location = (data.location && data.location.trim()) ? data.location.trim() : 'Not provided';
    const budget = (data.budget && data.budget.trim()) ? data.budget.trim() : 'Not provided';
    const question = (data.question && data.question.trim()) ? data.question.trim() : 'Not provided';

    const message = `🔔 NEW WEBSITE ENQUIRY

👤 Name: ${name}
📱 Phone: ${phone}
🏠 Requirement: ${requirement}
📍 Location: ${location}
💰 Budget: ${budget}

💬 Customer Question:
${question}

🌐 Source: Real Estate Website`;

    const cleanNumber = BUSINESS_WHATSAPP.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }

  // Render Enquiry Summary Card with "Send Enquiry on WhatsApp" Button
  function showEnquirySummaryCard() {
    const whatsappURL = generateWhatsAppURL(leadState);

    const summaryHtml = `
      <div class="whatsapp-msg whatsapp-msg-bot">
        <div class="whatsapp-msg-bubble">
          <strong>Enquiry Ready to Send! 🚀</strong><br>
          Review your details below:
          
          <div class="wa-summary-card">
            <div class="wa-summary-line"><span class="wa-summary-label">👤 Name:</span> <span class="wa-summary-val">${escapeHtml(leadState.name || 'Not provided')}</span></div>
            <div class="wa-summary-line"><span class="wa-summary-label">📱 Phone:</span> <span class="wa-summary-val">${escapeHtml(leadState.phone || 'Not provided')}</span></div>
            <div class="wa-summary-line"><span class="wa-summary-label">🏠 Requirement:</span> <span class="wa-summary-val">${escapeHtml(leadState.requirement || 'Not provided')}</span></div>
            <div class="wa-summary-line"><span class="wa-summary-label">📍 Location:</span> <span class="wa-summary-val">${escapeHtml(leadState.location || 'Not provided')}</span></div>
            <div class="wa-summary-line"><span class="wa-summary-label">💰 Budget:</span> <span class="wa-summary-val">${escapeHtml(leadState.budget || 'Not provided')}</span></div>
            <div class="wa-summary-line"><span class="wa-summary-label">💬 Question:</span> <span class="wa-summary-val">${escapeHtml(leadState.question || 'Not provided')}</span></div>
          </div>

          <a href="${whatsappURL}" target="_blank" rel="noopener" class="wa-send-enquiry-btn">
            <svg viewBox="0 0 32 32" width="20" height="20" fill="none"><path fill="#FFFFFF" d="M16 2A13 13 0 0 0 4.68 20.88L3 27l6.29-1.65A13 13 0 1 0 16 2zm0 23.6a10.55 10.55 0 0 1-5.38-1.47l-.39-.23-4 1.05 1.07-3.9-.25-.4A10.59 10.59 0 1 1 16 25.6zm5.8-7.92c-.32-.16-1.89-.93-2.18-1.04s-.5-.16-.72.16-.84 1.04-1.03 1.26-.38.25-.7.09a8.84 8.84 0 0 1-2.6-1.6 9.77 9.77 0 0 1-1.8-2.24c-.19-.32-.02-.5.14-.66s.32-.38.48-.57a2.16 2.16 0 0 0 .32-.53.59.59 0 0 0-.03-.56c-.08-.16-.72-1.74-.99-2.38s-.53-.55-.72-.56h-.62a1.2 1.2 0 0 0-.87.4 3.65 3.65 0 0 0-1.14 2.71A6.36 6.36 0 0 0 10.4 17a14.54 14.54 0 0 0 5.56 4.92c.76.33 1.35.53 1.81.68a4.35 4.35 0 0 0 2 .12 3.28 3.28 0 0 0 2.15-1.52 2.68 2.68 0 0 0 .19-1.52c-.07-.12-.24-.2-.56-.36z"/></svg>
            Send Enquiry on WhatsApp
          </a>
        </div>
        <div class="whatsapp-msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;
    chatBody.insertAdjacentHTML('beforeend', summaryHtml);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendUserMsg(msgText) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userHtml = `
      <div class="whatsapp-msg whatsapp-msg-user">
        <div class="whatsapp-msg-bubble">${escapeHtml(msgText)}</div>
        <div class="whatsapp-msg-time">${timeStr}</div>
      </div>
    `;
    chatBody.insertAdjacentHTML('beforeend', userHtml);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendBotMsg(msgHtml, quickChips = null) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let chipsHtml = '';
    if (quickChips && quickChips.length) {
      chipsHtml = `
        <div class="whatsapp-quick-chips" style="margin-top: 0.5rem;">
          ${quickChips.map(c => `<button class="wa-chip-btn dynamic-chip" data-val="${escapeHtml(c.val)}">${escapeHtml(c.text)}</button>`).join('')}
        </div>
      `;
    }

    const currentWaUrl = generateWhatsAppURL(leadState);
    const directSendBtnHtml = `
      <a href="${currentWaUrl}" target="_blank" rel="noopener" class="wa-send-enquiry-btn" style="margin-top: 0.6rem; padding: 0.65rem 0.85rem; font-size: 0.82rem;">
        💬 Send Enquiry on WhatsApp
      </a>
    `;

    const botHtml = `
      <div class="whatsapp-msg whatsapp-msg-bot">
        <div class="whatsapp-msg-bubble">
          ${msgHtml}
          ${chipsHtml}
          ${directSendBtnHtml}
        </div>
        <div class="whatsapp-msg-time">${timeStr}</div>
      </div>
    `;
    chatBody.insertAdjacentHTML('beforeend', botHtml);

    // Attach click listeners to dynamic chips
    chatBody.querySelectorAll('.dynamic-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        const val = this.getAttribute('data-val');
        appendUserMsg(val);
        processUserInput(val);
      }, { once: true });
    });

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
}
