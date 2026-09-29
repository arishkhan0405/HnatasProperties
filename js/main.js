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
