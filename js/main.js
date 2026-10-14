/* ==========================================================================
   HANTASPROPERTIES - MASTER CLIENT INTERACTIVITY & UI CONTROLLER
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

  // 16. About Project Interactive Multi-Project Slideshow Engine
  initAboutProjectSlideshow();
});

/* ==========================================================================
   0. HERO ESTATE BACKGROUND SWITCHER & DYNAMIC PROJECT CONTENT
   ========================================================================== */
const HERO_PROJECTS_DATA = {
  'hantasproperties': {
    bg: 'Images/Hero page.png',
    badge: 'PREMIER REAL ESTATE DEVELOPER • TRICHY',
    title: `<span class="gold-gradient-text">HANTASPROPERTIES</span>`,
    subtitle: `<span style="display: block; font-size: 1.35rem; font-weight: 800; color: #926207; margin-bottom: 0.6rem; font-family: var(--font-heading-cinzel); letter-spacing: 0.02em;">Your Future Begins with the Right Property.</span>Discover four exclusive property projects in Trichy — Grand Empire, Akshayam, Kings Avenue &amp; Crystal.`,
    offer: '',
    propName: 'HantasProperties General Inquiry',
    metrics: []
  },
  'mrproperties': {
    bg: 'Images/Hero page.png',
    badge: 'PREMIER REAL ESTATE DEVELOPER • TRICHY',
    title: `<span class="gold-gradient-text">HANTASPROPERTIES</span>`,
    subtitle: `<span style="display: block; font-size: 1.35rem; font-weight: 800; color: #926207; margin-bottom: 0.6rem; font-family: var(--font-heading-cinzel); letter-spacing: 0.02em;">Your Future Begins with the Right Property.</span>Discover four exclusive property projects in Trichy — Grand Empire, Akshayam, Kings Avenue &amp; Crystal.`,
    offer: '',
    propName: 'HantasProperties General Inquiry',
    metrics: []
  },
  'grand-empire': {
    bg: 'Images/grand-empire-2.jpg',
    badge: 'DTCP APPROVED NO: 109/2026 • RERA APPROVED • TRICHY - MADURAI NH',
    title: `HantasProperties' <br><span class="gold-gradient-text">GRAND EMPIRE</span>`,
    subtitle: `Royal Land for Royal People! Premier 21-Acre Gated Lifestyle Layout with 395 Approved Plots @ Manikandam, Trichy. Adjacent to Panjapur Integrated New Bus Terminal with 16 Live Night-Vision CCTV App, Magizh Mutram &amp; 100% Bank Loan Facility.`,
    offer: `<i data-lucide="award" style="width: 15px; height: 15px; color: var(--gold-primary);"></i> <span>Grand Empire: <strong>395 Approved Plots</strong> • <strong>21-Acre Gated Township</strong></span>`,
    propName: 'Grand Empire Site Visit Request',
    metrics: [
      { number: '21 Acres', label: 'Total Gated Township' },
      { number: '395 Plots', label: 'DTCP &amp; RERA Approved' },
      { number: '16 CCTVs', label: '24x7 Live Stream App' },
      { number: '100%', label: 'Bank Loan Facility' }
    ]
  },
  'akshayam': {
    bg: 'Images/akshayam.jpg',
    badge: 'பஞ்சப்பூர் அருகே • DTCP APPROVED 131/2026 • RERA APPROVED',
    title: `HantasProperties' <br><span class="gold-gradient-text">AKSHAYAM</span>`,
    subtitle: `அக்ஷயம் செழிப்பாக்கும்! Premier Villa Plots @ Manikandam, Trichy. DTCP Approved (No: 131/2026) &amp; RERA Approved layout with top luxury amenities, ready for immediate construction &amp; massive value appreciation.`,
    offer: `<i data-lucide="star" style="width: 15px; height: 15px; color: var(--gold-primary);"></i> <span>Akshayam: <strong>DTCP Appr. 131/2026</strong> • <strong>Premium Villa Plots</strong></span>`,
    propName: 'Akshayam Site Visit Request',
    metrics: [
      { number: '131/2026', label: 'DTCP Approval No' },
      { number: 'Premium', label: 'Villa Plots Township' },
      { number: '100%', label: 'Clear Title & Approved' },
      { number: 'High ROI', label: 'High Growth Zone' }
    ]
  },
  'kings-avenue': {
    bg: 'Images/kings-avenue.jpg',
    badge: 'DTCP &amp; RERA APPROVED • 33FT THAR ROADS • TRICHY',
    title: `HantasProperties' <br><span class="gold-gradient-text">KINGS AVENUE</span>`,
    subtitle: `Exclusive residential community with 33ft wide blacktop thar roads, grand entrance arch, secure compound walls, clear titles, and supreme connectivity on Trichy - Madurai Highway.`,
    offer: `<i data-lucide="crown" style="width: 15px; height: 15px; color: var(--gold-primary);"></i> <span>Kings Avenue: <strong>33ft Wide Blacktop Roads</strong> • <strong>Gated Layout</strong></span>`,
    propName: 'Kings Avenue Site Visit Request',
    metrics: [
      { number: '33 Feet', label: 'Blacktop Thar Roads' },
      { number: '100%', label: 'Bank Loan Approved' },
      { number: 'Gated', label: 'Compound Wall Secured' },
      { number: 'Prime', label: 'Trichy Highway Access' }
    ]
  },
  'crystal': {
    bg: 'Images/crystal.jpg',
    badge: 'பஞ்சப்பூர் அருகே • DTCP &amp; RERA APPROVED PLOTS • NAGAMANGALAM, TRICHY',
    title: `HantasProperties' <br><span class="gold-gradient-text">CRYSTAL</span>`,
    subtitle: `பஞ்சப்பூர் அருகே DTCP &amp; RERA Approved Plots @ Nagamangalam, Trichy. Just 9.5 KM from Panjapur New Bus Terminal &amp; 3.5 KM from Trichy - Madurai NH. Nearby SFS Matriculation, Chellammal &amp; State Board Schools, Harshamithra Hospital.`,
    offer: `<i data-lucide="sparkles" style="width: 15px; height: 15px; color: var(--gold-primary);"></i> <span>Special Offer: <strong>₹850/- Per Sq.Ft</strong> • <strong>Registration + Patta FREE!</strong></span>`,
    propName: 'Crystal Site Visit Request',
    metrics: [
      { number: '₹850/-', label: 'Per Sq.Ft Special Offer' },
      { number: '9.5 KM', label: 'From Panjapur Bus Stand' },
      { number: '3.5 KM', label: 'From Trichy - Madurai NH' },
      { number: 'FREE', label: 'Registration + Patta Free', highlight: '#10b981' }
    ]
  }
};

function initHeroEstateSwitcher() {
  const switcherBtns = document.querySelectorAll('.hero-switcher-btn');
  const heroBgImg = document.getElementById('hero-bg-image');
  const heroBadge = document.getElementById('hero-badge');
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const heroOffer = document.getElementById('hero-offer');
  const heroMetrics = document.getElementById('hero-metrics');
  const heroBookBtn = document.getElementById('hero-book-btn');

  if (!switcherBtns.length || !heroBgImg) return;

  switcherBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      switcherBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const projectKey = btn.getAttribute('data-project');
      const projectData = HERO_PROJECTS_DATA[projectKey];

      const newBg = projectData ? projectData.bg : btn.getAttribute('data-bg');
      const title = btn.getAttribute('data-title') || (projectData ? projectData.title : '');

      if (newBg) {
        heroBgImg.style.opacity = '0.2';
        heroBgImg.style.transform = 'scale(1.15)';
        setTimeout(() => {
          heroBgImg.src = newBg;
          heroBgImg.style.opacity = '1';
          heroBgImg.style.transform = 'scale(1.05)';
        }, 220);
      }

      if (projectData) {
        if (heroBadge) {
          heroBadge.innerHTML = `<span class="pill-dot"></span><span>${projectData.badge}</span>`;
        }
        if (heroTitle) {
          heroTitle.innerHTML = projectData.title;
        }
        if (heroSubtitle) {
          heroSubtitle.innerHTML = projectData.subtitle;
        }
        if (heroOffer) {
          if (projectData.offer) {
            heroOffer.innerHTML = projectData.offer;
            heroOffer.style.display = 'inline-flex';
          } else {
            heroOffer.innerHTML = '';
            heroOffer.style.display = 'none';
          }
        }
        if (heroBookBtn) {
          heroBookBtn.setAttribute('data-prop-name', projectData.propName);
        }
        if (heroMetrics) {
          if (projectData.metrics && projectData.metrics.length > 0) {
            heroMetrics.style.display = 'grid';
            heroMetrics.innerHTML = projectData.metrics.map(m => `
              <div class="metric-card">
                <div class="metric-number" ${m.highlight ? `style="color: ${m.highlight};"` : ''}>${m.number}</div>
                <div class="metric-label">${m.label}</div>
              </div>
            `).join('');
          } else {
            heroMetrics.innerHTML = '';
            heroMetrics.style.display = 'none';
          }
        }
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }

      if (title) {
        showToast(`Featured Project: ${title.replace(/<[^>]*>?/gm, '')}`);
      }

      // Synchronize About Project Slideshow with selected Hero project
      if (typeof window.switchAboutProject === 'function') {
        window.switchAboutProject(projectKey);
      }
    });
  });
}

/* ==========================================================================
   0.5. ABOUT PROJECT MULTI-PROJECT INTERACTIVE SLIDESHOW ENGINE
   ========================================================================== */
function initAboutProjectSlideshow() {
  const slides = document.querySelectorAll('.about-slide');
  const tabs = document.querySelectorAll('.about-tab-btn');
  const dots = document.querySelectorAll('.about-dot');
  const prevBtn = document.getElementById('about-prev-btn');
  const nextBtn = document.getElementById('about-next-btn');
  const counterEl = document.getElementById('about-current-slide');

  if (!slides.length) return;

  let currentIndex = 0;
  const projectIndexMap = {
    'grand-empire': 0,
    'akshayam': 1,
    'kings-avenue': 2,
    'crystal': 3
  };

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    tabs.forEach((tab, i) => {
      if (i === currentIndex) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (counterEl) {
      counterEl.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Tabs click handler
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const slideIdx = parseInt(tab.getAttribute('data-slide'), 10);
      if (!isNaN(slideIdx)) {
        showSlide(slideIdx);
      }
    });
  });

  // Dots click handler
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(slideIdx)) {
        showSlide(slideIdx);
      }
    });
  });

  // Next / Prev button handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
    });
  }

  // Global bridge function callable by Hero Switcher
  window.switchAboutProject = function(projectKey) {
    if (projectKey in projectIndexMap) {
      showSlide(projectIndexMap[projectKey]);
    }
  };
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
   6. INTERACTIVE 4-PROJECT MASTER LAYOUT EXPLORER
   ========================================================================== */
const PROJECT_LAYOUTS_DATA = {
  'grand-empire': {
    name: 'Grand Empire 21-Acre Layout Plan',
    loc: 'Manikandam, Trichy-Madurai NH — Adjacent to Panjapur Integrated New Bus Terminal',
    badge: 'DTCP NO: 109/2026 • 21 ACRES • 395 PLOTS',
    blueprintImg: 'Images/WhatsApp Image 2026-09-27 at 8.09.23 AM (2).jpeg',
    groundImg: 'Images/grand-empire-amenities.jpg',
    propName: 'Grand Empire Master Layout Consultation',
    tags: ['Cholan Salai: 33ft Main Avenue', 'Pandiyan Salai: Commercial Link', 'Cheran Salai: Residential Boulevard', 'Magizh Mutram & Sparta Park Zone'],
    hotspots: [
      { top: '40%', left: '30%', title: 'Magizh Mutram World', desc: '2-Acre entertainment zone featuring "The Baiae" gaming lounge, Gully Cricket pitch & Badminton court.' },
      { top: '55%', left: '65%', title: 'Sparta Exercise Park', desc: 'Open gym with 10+ workout equipments, 8-shaped walking track, Bamboo oxygen forest & Mooligai Kaadu.' },
      { top: '35%', left: '80%', title: 'Spiritual Sanctum', desc: 'Sri Selva Vinayagar Temple, Interfaith Prayer Hall, Tulasi Vanam & Nilavu Medai Amphitheatre.' },
      { top: '25%', left: '50%', title: '16 Night-Vision CCTVs', desc: '24x7 Live Stream mobile app connectivity for round-the-clock gated township security.' }
    ]
  },
  'akshayam': {
    name: 'Akshayam 63-Plot Master Layout Plan',
    loc: 'Manikandam, Trichy — DTCP 131/2026 Approved Villa Community near Panjapur',
    badge: 'DTCP NO: 131/2026 APPROVED • 63 APPROVED PLOTS • 33FT ROADS',
    blueprintImg: 'Images/akshayam-layout.jpg',
    groundImg: 'Images/akshayam-amenities.jpg',
    propName: 'Akshayam 63 Plots Layout Consultation',
    tags: ['DTCP 131/2026 Approved', '63 Approved Plots', '33ft & 30ft Roads', 'Commercial & Gold Corner Plots', 'Dedicated Park Zone'],
    hotspots: [
      { top: '22%', left: '35%', title: 'Commercial Frontage Plots', desc: 'Plots 3 to 6 along prime 30ft road with broad frontage, ideal for commercial or mixed-use development.' },
      { top: '48%', left: '58%', title: '33ft Main Wide Road', desc: 'Spacious 33ft broad blacktop thar road running along the layout with street lights and avenue trees.' },
      { top: '75%', left: '26%', title: 'Community Park Area', desc: 'Dedicated layout park for children recreation, greenery, and healthy open-air living.' },
      { top: '56%', left: '52%', title: 'Gold Corner Plots', desc: 'Prime corner plots (Plots 7, 20, 21, 36, 47) with dual road access and premium Vastu orientation.' }
    ]
  },
  'kings-avenue': {
    name: 'Kings Avenue-II 28-Plot Master Layout',
    loc: 'Trichy - Madurai Highway Frontage — DTCP 124/2025 Approved Gated Layout',
    badge: 'DTCP NO: 124/2025 • RERA APPROVED • 28 PLOTS • 33FT THAR ROADS',
    blueprintImg: 'Images/kings-avenue-layout.jpg',
    groundImg: 'Images/kings-avenue.jpg',
    propName: 'Kings Avenue-II 28 Plots Layout Consultation',
    tags: ['DTCP 124/2025 Approved', '28 Premium Plots', '33ft Direct NH Road', 'Dedicated Park Zone', 'Premium Corner Plots'],
    hotspots: [
      { top: '40%', left: '88%', title: 'Direct Trichy-Madurai NH Road', desc: 'Direct 33ft wide roadway link directly connecting to Trichy - Madurai National Highway.' },
      { top: '45%', left: '48%', title: '33ft Wide Central Avenue', desc: 'Central heavy-duty 33ft wide blacktop thar road with concrete curb stones and avenue lighting.' },
      { top: '40%', left: '18%', title: 'Dedicated Community Park', desc: 'Lush green landscaped park zone dedicated for community recreation and children play area.' },
      { top: '32%', left: '60%', title: 'Premium Corner Plots', desc: 'Plots 1, 2, 5, 6, 12, 19, 28 with dual-road corner access and 100% Vastu compliance.' }
    ]
  },
  'crystal': {
    name: 'Green Valley’s Crystal 147-Plot Master Layout',
    loc: 'Nagamangalam, Trichy — DTCP 42/2026 Approved Community (Near Panjapur Bus Terminal)',
    badge: 'DTCP NO: 42/2026 • RERA APPROVED • 147 PLOTS • ₹850/SQ.FT',
    blueprintImg: 'Images/crystal-layout.jpg',
    groundImg: 'Images/crystal-entrance.jpg',
    propName: 'Crystal 147 Plots Layout Consultation & ₹850 Offer Booking',
    tags: ['DTCP 42/2026 Approved', '147 Approved Plots', 'Special Offer ₹850/Sq.Ft', '33ft & 30ft Thar Roads', '7ft Compound Wall', 'Dedicated Park & EB Lights'],
    hotspots: [
      { top: '20%', left: '25%', title: '30ft Thar Road & Plots 1-42', desc: 'Spacious residential plots with 30ft wide heavy-duty blacktop thar roads and clear boundary demarcations.' },
      { top: '48%', left: '38%', title: 'DTCP 42/2026 & RERA Approved', desc: 'Legally vetted 147 plots with DTCP Approved 42/2026, 7ft gated perimeter compound wall, and instant bank loan facility.' },
      { top: '85%', left: '18%', title: 'Landscaped Community Park', desc: 'Dedicated layout park for family recreation, children play area, and lush green open space.' },
      { top: '72%', left: '32%', title: '33ft Main Avenue & EB Lights', desc: 'Broad 33ft wide blacktop avenue with EB power lines, avenue trees, and modern street lights.' }
    ]
  }
};

let currentLayoutKey = 'grand-empire';
let currentLayoutMode = 'blueprint';

function init360Showcase() {
  const layoutImg = document.getElementById('layout-viewer-img');
  const container = document.querySelector('.showcase-viewer-container');
  const hotspotsContainer = document.getElementById('layout-hotspots-container');
  const badgeEl = document.getElementById('layout-viewer-badge');
  const titleEl = document.getElementById('layout-viewer-title');
  const descEl = document.getElementById('layout-viewer-desc');
  const inquiryBtn = document.getElementById('layout-inquiry-btn');
  const tabBtns = document.querySelectorAll('.layout-tab-btn');
  const cardSwitchBtns = document.querySelectorAll('.switch-layout-card-btn');
  const modeBlueprintBtn = document.getElementById('layout-mode-blueprint-btn');
  const modeGroundBtn = document.getElementById('layout-mode-ground-btn');
  const modalTriggerBtn = document.getElementById('layout-modal-trigger-btn');

  function renderLayout(key) {
    currentLayoutKey = key;
    const data = PROJECT_LAYOUTS_DATA[key];
    if (!data) return;

    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-layout') === key);
    });

    if (layoutImg) {
      layoutImg.style.opacity = '0.3';
      setTimeout(() => {
        layoutImg.src = currentLayoutMode === 'blueprint' ? data.blueprintImg : data.groundImg;
        if (currentLayoutMode === 'blueprint') {
          layoutImg.style.objectFit = 'contain';
          layoutImg.style.backgroundColor = '#0b0f19';
        } else {
          layoutImg.style.objectFit = 'cover';
          layoutImg.style.backgroundColor = 'transparent';
        }
        layoutImg.style.opacity = '1';
      }, 180);
    }

    if (badgeEl) {
      badgeEl.innerHTML = `<i data-lucide="orbit" style="width: 12px; height: 12px;"></i><span>${data.badge}</span>`;
    }
    if (titleEl) titleEl.textContent = data.name;
    if (descEl) descEl.textContent = data.loc;
    if (inquiryBtn) inquiryBtn.setAttribute('data-prop-name', data.propName);

    if (hotspotsContainer) {
      hotspotsContainer.innerHTML = data.hotspots.map(spot => `
        <div class="hotspot-pin" style="top: ${spot.top}; left: ${spot.left};" data-room-name="${spot.title}">
          <div class="hotspot-core"><i data-lucide="plus" style="width: 14px; height: 14px;"></i></div>
          <div class="hotspot-card-tooltip">
            <strong style="color: var(--gold-light); display: block; margin-bottom: 4px;">${spot.title}</strong>
            <p style="font-size: 0.8rem; color: #cbd5e1; margin: 0;">${spot.desc}</p>
          </div>
        </div>
      `).join('');

      hotspotsContainer.querySelectorAll('.hotspot-pin').forEach(spot => {
        spot.addEventListener('click', () => {
          const room = spot.getAttribute('data-room-name') || 'Hotspot';
          showToast(`Inspecting: ${room}`);
        });
      });
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-layout');
      renderLayout(key);
    });
  });

  cardSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-layout');
      renderLayout(key);
      const viewer = document.getElementById('layout-showcase-viewer');
      if (viewer) viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  if (modeBlueprintBtn && modeGroundBtn) {
    modeBlueprintBtn.addEventListener('click', () => {
      currentLayoutMode = 'blueprint';
      modeBlueprintBtn.classList.add('active');
      modeGroundBtn.classList.remove('active');
      const data = PROJECT_LAYOUTS_DATA[currentLayoutKey];
      if (data && layoutImg) {
        layoutImg.src = data.blueprintImg;
        layoutImg.style.objectFit = 'contain';
        layoutImg.style.backgroundColor = '#0b0f19';
      }
    });

    modeGroundBtn.addEventListener('click', () => {
      currentLayoutMode = 'ground';
      modeGroundBtn.classList.add('active');
      modeBlueprintBtn.classList.remove('active');
      const data = PROJECT_LAYOUTS_DATA[currentLayoutKey];
      if (data && layoutImg) {
        layoutImg.src = data.groundImg;
        layoutImg.style.objectFit = 'cover';
        layoutImg.style.backgroundColor = 'transparent';
      }
    });
  }

  if (modalTriggerBtn) {
    modalTriggerBtn.addEventListener('click', () => {
      openLayoutModal(currentLayoutKey);
    });
  }

  document.querySelectorAll('.open-layout-modal-direct').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-layout') || 'grand-empire';
      openLayoutModal(key);
    });
  });

  if (container && layoutImg) {
    let isDown = false;
    let startX;
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
      layoutImg.style.objectPosition = `${currentPos}% center`;
      startX = x;
    });
  }

  renderLayout('grand-empire');
}

function openLayoutModal(key) {
  const tourModal = document.getElementById('virtual-tour-modal');
  if (!tourModal) return;
  updateModalLayout(key);
  tourModal.classList.add('active');
}

function updateModalLayout(key) {
  const data = PROJECT_LAYOUTS_DATA[key];
  if (!data) return;

  const modalImg = document.getElementById('modal-layout-img');
  const modalBadge = document.getElementById('modal-layout-badge');
  const modalTitle = document.getElementById('tour-modal-title');
  const modalSubtitle = document.getElementById('modal-layout-subtitle');
  const modalTagsRow = document.getElementById('modal-layout-tags-row');
  const modalBookBtn = document.getElementById('modal-layout-book-btn');
  const modalTabs = document.querySelectorAll('.modal-layout-tab-btn');

  modalTabs.forEach(t => {
    const isAct = t.getAttribute('data-layout') === key;
    t.classList.toggle('active', isAct);
    t.style.background = isAct ? 'var(--gold-gradient)' : 'transparent';
    t.style.color = isAct ? '#080b11' : '#cbd5e1';
    t.style.fontWeight = isAct ? '700' : '600';
  });

  if (modalImg) modalImg.src = data.blueprintImg;
  if (modalBadge) modalBadge.textContent = data.badge;
  if (modalTitle) modalTitle.innerHTML = `${data.name.replace('Layout Plan', '')} <span class="gold-gradient-text">Layout Blueprint</span>`;
  if (modalSubtitle) modalSubtitle.textContent = `● ${data.loc}`;
  if (modalBookBtn) modalBookBtn.setAttribute('data-prop-name', `${data.name} Inquiries`);

  if (modalTagsRow && data.tags) {
    modalTagsRow.innerHTML = data.tags.map(tag => `
      <button class="btn btn-secondary btn-sm" onclick="showToast('${tag}')">${tag}</button>
    `).join('');
  }
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

  // Trigger 360 Tour / Layout Blueprint Modal
  document.querySelectorAll('.property-tour-360-btn, .hero-explore-tour-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const layoutKey = btn.getAttribute('data-layout') || currentLayoutKey || 'grand-empire';
      openLayoutModal(layoutKey);
    });
  });

  // Modal Layout Tab Switcher Listeners
  document.querySelectorAll('.modal-layout-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-layout');
      updateModalLayout(key);
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
      showToast('Subscribed to HantasProperties Private Layout Updates.');
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
