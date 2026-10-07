/**
 * aanvi.js — Aanvi 925 Silver Jewellery Brand & Digital Case Study Interactive Engine
 * Handles:
 * - Reading progress tracker
 * - Sticky navigation & active Page pill highlighting on scroll
 * - High-definition Lightbox with Pan, Zoom & Page navigation
 * - Interactive Live Typography Sandbox & specimens
 */
(function () {
  'use strict';

  // 8-Page Data Registry
  const pagesData = [
    {
      id: 'page-01',
      num: '01',
      tag: 'PROJECT OVERVIEW & SCOPE',
      title: 'UX19 × Aanvi 925 Silver Jewellery — Project Overview & Scope',
      desc: 'Brand identity, visual systems, UX/UI design, and Shopify e-commerce launch for modern 925 silver jewelry.',
      src: 'assets/images/projects/aanvi/page-01-overview-and-scope.jpg',
      isUpcoming: false
    },
    {
      id: 'page-02',
      num: '02',
      tag: 'BRAND FUNDAMENTALS',
      title: 'Positioning, Brand Essence & Tonal Guidelines',
      desc: 'Target audience definition, emotional benefits, core positioning thesis, and authentic voice boundaries.',
      src: 'assets/images/projects/aanvi/page-02-brand-fundamentals.png',
      isUpcoming: false
    },
    {
      id: 'page-03',
      num: '03',
      tag: 'VISUAL IDENTITY & PILLARS',
      title: 'Brand Pillars, Logo Architecture & Visual Motifs',
      desc: 'Kindness, Authenticity, Connection, fluid signature monogram, architectural arches, stars & reeded glass.',
      src: 'assets/images/projects/aanvi/page-03-visual-identity-and-pillars.png',
      isUpcoming: false
    },
    {
      id: 'page-04',
      num: '04',
      tag: 'TYPOGRAPHY & USAGE',
      title: 'Editorial Typography System — Lora Serif & Inter Sans',
      desc: 'Primary serif with calligraphic warmth paired with clean digital sans-serif across UI and print.',
      src: 'assets/images/projects/aanvi/page-04-typography-and-usage.png',
      isUpcoming: false
    },
    {
      id: 'page-05',
      num: '05',
      tag: 'USER PERSONAS & COLLATERAL',
      title: 'Target Personas, Unboxing & Stationery Collateral',
      desc: 'In-depth personas (Priya & Mayra), premium forest green packaging, embossed stationery & retail experience.',
      src: 'assets/images/projects/aanvi/page-05-user-personas.png',
      isUpcoming: false
    },
    {
      id: 'page-06',
      num: '06',
      tag: 'MOBILE STOREFRONT EXPERIENCE',
      title: 'App-Like Mobile Storefront & Multi-Device Perspective Mockup',
      desc: 'Mobile-first shopping experience with category arches (Earrings, Pendants, Toe Rings), skin-friendly & anti-tarnish assurances.',
      src: 'assets/images/projects/aanvi/page-06-mobile-storefront.jpg',
      isUpcoming: false
    },
    {
      id: 'page-07',
      num: '07',
      tag: 'WEBSITE DESIGN & DESKTOP STORE',
      title: 'Responsive Desktop Homepage, Collection Arches & Store Locator',
      desc: 'Full e-commerce interface featuring dynamic hero banners, architectural category arches, curated bestsellers, and heritage trust signals.',
      src: 'assets/images/projects/aanvi/page-07-website-design.png',
      isUpcoming: false
    },
    {
      id: 'page-08',
      num: '08',
      tag: 'PRODUCT ARCHITECTURE & SOCIAL GRID',
      title: 'PDP Above-the-Fold UX, Social Media Curation & Brand Conclusion',
      desc: 'Solitaire Light Pendant product specifications, hallmarked authenticity credentials, organic social feed curation, and final brand synthesis.',
      src: 'assets/images/projects/aanvi/page-08-pdp-social-brand.png',
      isUpcoming: false
    }
  ];

  /* ── 1. Unified Performant Scroll Engine ──────────────────── */
  const progressBar = document.getElementById('aanvi-progress-bar');
  const topnav = document.querySelector('.aanvi-topnav');
  const pillLinks = document.querySelectorAll('.aanvi-page-pill');
  const pageWrappers = document.querySelectorAll('.aanvi-page-wrapper');

  let ticking = false;

  function updateScrollState() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (progressBar && docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = progress + '%';
    }

    // Topnav elevation
    if (topnav) {
      if (scrollTop > 40) {
        topnav.classList.add('scrolled');
      } else {
        topnav.classList.remove('scrolled');
      }
    }

    // Active Pill Detection
    if (pageWrappers.length > 0 && pillLinks.length > 0) {
      const triggerPoint = window.innerHeight * 0.35;
      let activeIndex = -1;

      pageWrappers.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= triggerPoint) {
          activeIndex = index;
        }
      });

      if (activeIndex >= 0) {
        pillLinks.forEach((pill, idx) => {
          if (idx === activeIndex) {
            pill.classList.add('active');
            // ensure active pill is visible in scroll container
            const container = pill.parentElement;
            if (container) {
              const pillLeft = pill.offsetLeft;
              const pillWidth = pill.offsetWidth;
              const containerScroll = container.scrollLeft;
              const containerWidth = container.offsetWidth;
              if (pillLeft < containerScroll || pillLeft + pillWidth > containerScroll + containerWidth) {
                container.scrollTo({ left: pillLeft - 40, behavior: 'smooth' });
              }
            }
          } else {
            pill.classList.remove('active');
          }
        });
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateScrollState();

  /* ── 2. High-Definition Lightbox Modal ────────────────────── */
  const lightbox = document.getElementById('aanvi-lightbox');
  const lbImg = document.getElementById('aanvi-lb-img');
  const lbWrap = document.getElementById('aanvi-lb-wrap');
  const lbStage = document.getElementById('aanvi-lb-stage');
  const lbPage = document.getElementById('aanvi-lb-page');
  const lbTitle = document.getElementById('aanvi-lb-title');
  const btnZoomIn = document.getElementById('aanvi-lb-zoomin');
  const btnZoomOut = document.getElementById('aanvi-lb-zoomout');
  const btnReset = document.getElementById('aanvi-lb-reset');
  const btnClose = document.getElementById('aanvi-lb-close');
  const btnPrev = document.getElementById('aanvi-lb-prev');
  const btnNext = document.getElementById('aanvi-lb-next');

  let currentPageIndex = 0;
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function applyTransform() {
    if (lbWrap) {
      lbWrap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
    }
  }

  function resetZoom() {
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  function openLightbox(index) {
    if (!lightbox || !lbImg) return;
    const page = pagesData[index];
    if (!page || page.isUpcoming || !page.src) return;

    currentPageIndex = index;
    lbImg.src = page.src;
    lbImg.alt = page.title;

    if (lbPage) lbPage.textContent = `PAGE ${page.num} // ${page.tag}`;
    if (lbTitle) lbTitle.textContent = page.title;

    resetZoom();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    updateNavButtons();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
  }

  function updateNavButtons() {
    if (!btnPrev || !btnNext) return;
    // Find prev available page
    let prevIndex = currentPageIndex - 1;
    while (prevIndex >= 0 && (pagesData[prevIndex].isUpcoming || !pagesData[prevIndex].src)) {
      prevIndex--;
    }
    btnPrev.style.display = prevIndex >= 0 ? 'flex' : 'none';

    // Find next available page
    let nextIndex = currentPageIndex + 1;
    while (nextIndex < pagesData.length && (pagesData[nextIndex].isUpcoming || !pagesData[nextIndex].src)) {
      nextIndex++;
    }
    btnNext.style.display = nextIndex < pagesData.length ? 'flex' : 'none';
  }

  function prevPage() {
    let prevIndex = currentPageIndex - 1;
    while (prevIndex >= 0 && (pagesData[prevIndex].isUpcoming || !pagesData[prevIndex].src)) {
      prevIndex--;
    }
    if (prevIndex >= 0) {
      openLightbox(prevIndex);
    }
  }

  function nextPage() {
    let nextIndex = currentPageIndex + 1;
    while (nextIndex < pagesData.length && (pagesData[nextIndex].isUpcoming || !pagesData[nextIndex].src)) {
      nextIndex++;
    }
    if (nextIndex < pagesData.length) {
      openLightbox(nextIndex);
    }
  }

  // Attach zoom triggers
  document.querySelectorAll('.aanvi-zoom-btn, .aanvi-page-frame').forEach(el => {
    el.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-page-index'), 10);
      if (!isNaN(idx)) {
        openLightbox(idx);
      }
    });
  });

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnPrev) btnPrev.addEventListener('click', prevPage);
  if (btnNext) btnNext.addEventListener('click', nextPage);

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      zoomLevel = Math.min(3.5, zoomLevel + 0.35);
      applyTransform();
    });
  }

  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      zoomLevel = Math.max(0.6, zoomLevel - 0.35);
      applyTransform();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetZoom);
  }

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPage();
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === '+' || e.key === '=') {
      zoomLevel = Math.min(3.5, zoomLevel + 0.35);
      applyTransform();
    }
    if (e.key === '-' || e.key === '_') {
      zoomLevel = Math.max(0.6, zoomLevel - 0.35);
      applyTransform();
    }
  });

  // Mouse drag pan
  if (lbStage) {
    lbStage.addEventListener('mousedown', (e) => {
      if (e.target === btnClose || e.target.closest('.aanvi-lightbox-bar') || e.target.closest('.aanvi-lightbox-nav')) return;
      isDragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      lbStage.classList.add('dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      applyTransform();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        lbStage.classList.remove('dragging');
      }
    });

    // Mouse wheel zoom
    lbStage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      zoomLevel = Math.min(4, Math.max(0.5, zoomLevel + delta));
      applyTransform();
    }, { passive: false });
  }

  /* ── 3. Interactive Live Typography Sandbox ───────────────── */
  const customInput = document.getElementById('aanvi-type-input');
  const sandboxTitle = document.querySelector('.sandbox-title');
  const sandboxSubhead = document.querySelector('.sandbox-subhead');
  const sandboxPara = document.querySelector('.sandbox-para');
  const resetTypeBtn = document.getElementById('aanvi-type-reset');

  if (customInput && sandboxTitle) {
    const defaultTitle = sandboxTitle.textContent;
    const defaultSubhead = sandboxSubhead ? sandboxSubhead.textContent : '';
    const defaultPara = sandboxPara ? sandboxPara.textContent : '';

    customInput.addEventListener('input', function () {
      const val = this.value.trim();
      if (val) {
        sandboxTitle.textContent = val;
      } else {
        sandboxTitle.textContent = defaultTitle;
      }
    });

    if (resetTypeBtn) {
      resetTypeBtn.addEventListener('click', function () {
        customInput.value = '';
        sandboxTitle.textContent = defaultTitle;
        if (sandboxSubhead) sandboxSubhead.textContent = defaultSubhead;
        if (sandboxPara) sandboxPara.textContent = defaultPara;
      });
    }
  }

})();
