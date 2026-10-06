/**
 * luma.js — LUMA Design System Case Study Interactive Engine
 * Handles:
 * - Reading progress tracker
 * - Sticky navigation & active Act pill highlighting on scroll
 * - High-definition Lightbox with Pan & Zoom + Act navigation
 */
(function () {
  'use strict';

  // Act Data Registry
  const actsData = [
    {
      id: 'act-01',
      num: '01',
      tag: 'PREMISE & OPERATING SYSTEM',
      title: 'LUMA — A Design System built as a product, not a UI kit',
      desc: 'The operating problem, the product thesis, and an explicit scope boundary.',
      src: 'assets/images/projects/luma/act-01-premise.png',
      width: 2400,
      height: 3626
    },
    {
      id: 'act-02',
      num: '02',
      tag: 'LANGUAGE & ARCHITECTURE',
      title: 'Semantic taxonomy and three-tier token hierarchy',
      desc: 'Primitive, semantic, and component token structures with strict alias binding.',
      src: 'assets/images/projects/luma/act-02-language-and-architecture.png',
      width: 2400,
      height: 4920
    },
    {
      id: 'act-03',
      num: '03',
      tag: 'FOUNDATIONS & TOKENS',
      title: 'Foundational scales, constraints & accessibility boundaries',
      desc: 'Color ramps, typography hierarchies, layout grids, elevation, and motion curves.',
      src: 'assets/images/projects/luma/act-03-foundations-and-tokens.png',
      width: 2400,
      height: 4893
    },
    {
      id: 'act-04',
      num: '04',
      tag: 'COMPONENT ECOSYSTEM',
      title: 'A component is a contract, not a rectangle',
      desc: 'Anatomies, state matrices, property decision frameworks, and failure state hierarchies.',
      src: 'assets/images/projects/luma/act-04-component-ecosystem.png',
      width: 2400,
      height: 5492
    },
    {
      id: 'act-05',
      num: '05',
      tag: 'ENABLEMENT & PROOF',
      title: 'One system across products, themes, and widths',
      desc: 'Interactive documentation, playground, and multi-surface stress tests.',
      src: 'assets/images/projects/luma/act-05-enablement-and-proof.png',
      width: 2400,
      height: 5504
    },
    {
      id: 'act-06',
      num: '06',
      tag: 'OPERATIONS & RELEASE',
      title: 'A system needs an operating model to remain a system',
      desc: 'Semantic versioning, changelog structures, proposal lifecycles, and decision records.',
      src: 'assets/images/projects/luma/act-06-operations.png',
      width: 2400,
      height: 4059
    },
    {
      id: 'act-07',
      num: '07',
      tag: 'GOVERNANCE & EVIDENCE',
      title: 'Stewardship is designed before it is claimed',
      desc: 'Contribution workflows, inspectable evidence, adoption metrics, and SLAs.',
      src: 'assets/images/projects/luma/act-07-governance-and-evidence.png',
      width: 2400,
      height: 5428
    },
    {
      id: 'act-08',
      num: '08',
      tag: 'LEARNING & CLOSE',
      title: 'The artifact is the system. The learning is the loop',
      desc: 'Continuous product feedback, retrospective learnings, and system close.',
      src: 'assets/images/projects/luma/act-08-learning-and-close.png',
      width: 2400,
      height: 4629
    }
  ];

  /* ── 1. Reading Progress Bar ──────────────────────────────── */
  const progressBar = document.getElementById('luma-progress-bar');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal <= 0) return;
    const progress = Math.min(100, Math.max(0, (window.scrollY / scrollTotal) * 100));
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ── 2. Topnav Scrolled State ────────────────────────────── */
  const topnav = document.querySelector('.luma-topnav');
  if (topnav) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 20) {
          topnav.classList.add('scrolled');
        } else {
          topnav.classList.remove('scrolled');
        }
      },
      { passive: true }
    );
  }

  /* ── 3. Smooth Scroll For Act Pills ──────────────────────── */
  const pillLinks = document.querySelectorAll('.luma-act-pill');
  pillLinks.forEach(pill => {
    pill.addEventListener('click', e => {
      const targetId = pill.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = 76;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = targetEl.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* ── 4. Bulletproof Active Act Tracker (Scroll Geometry) ─── */
  const actWrappers = document.querySelectorAll('.luma-act-wrapper');
  function updateActiveAct() {
    if (actWrappers.length === 0) return;
    const scrollY = window.scrollY;
    const viewOffset = scrollY + 220; // Trigger line 220px below top
    let currentId = 'act-01';

    for (let i = 0; i < actWrappers.length; i++) {
      const el = actWrappers[i];
      if (el.offsetTop <= viewOffset) {
        currentId = el.id;
      } else {
        break;
      }
    }

    pillLinks.forEach(pill => {
      if (pill.getAttribute('href') === '#' + currentId) {
        if (!pill.classList.contains('active')) {
          pill.classList.add('active');
          pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      } else {
        pill.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveAct, { passive: true });
  // Initialize once on load
  updateActiveAct();

  /* ── 5. Lightbox Modal Engine ────────────────────────────── */
  const lightbox = document.getElementById('luma-lightbox');
  const lbImg = document.getElementById('luma-lb-img');
  const lbImgWrap = document.getElementById('luma-lb-wrap');
  const lbActTag = document.getElementById('luma-lb-act');
  const lbTitle = document.getElementById('luma-lb-title');
  const lbCloseBtn = document.getElementById('luma-lb-close');
  const lbZoomIn = document.getElementById('luma-lb-zoomin');
  const lbZoomOut = document.getElementById('luma-lb-zoomout');
  const lbZoomReset = document.getElementById('luma-lb-reset');
  const lbPrevBtn = document.getElementById('luma-lb-prev');
  const lbNextBtn = document.getElementById('luma-lb-next');
  const lbStage = document.getElementById('luma-lb-stage');

  let currentActIndex = 0;
  let currentZoom = 1;
  const zoomStep = 0.35;
  const minZoom = 0.5;
  const maxZoom = 3.5;

  function openLightbox(index) {
    if (!lightbox || !lbImg) return;
    currentActIndex = index;
    currentZoom = 1;
    applyZoom();

    const data = actsData[currentActIndex];
    if (data) {
      lbImg.src = data.src;
      lbImg.alt = data.title;
      if (lbActTag) lbActTag.textContent = 'ACT ' + data.num + ' // ' + data.tag;
      if (lbTitle) lbTitle.textContent = data.title;
    }

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (lbStage) {
      lbStage.scrollTop = 0;
      lbStage.scrollLeft = 0;
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function applyZoom() {
    if (!lbImgWrap) return;
    lbImgWrap.style.transform = `scale(${currentZoom})`;
  }

  function zoomIn() {
    if (currentZoom < maxZoom) {
      currentZoom = Math.min(maxZoom, currentZoom + zoomStep);
      applyZoom();
    }
  }

  function zoomOut() {
    if (currentZoom > minZoom) {
      currentZoom = Math.max(minZoom, currentZoom - zoomStep);
      applyZoom();
    }
  }

  function zoomReset() {
    currentZoom = 1;
    applyZoom();
    if (lbStage) {
      lbStage.scrollTop = 0;
      lbStage.scrollLeft = 0;
    }
  }

  function showNextAct() {
    if (currentActIndex < actsData.length - 1) {
      openLightbox(currentActIndex + 1);
    } else {
      openLightbox(0);
    }
  }

  function showPrevAct() {
    if (currentActIndex > 0) {
      openLightbox(currentActIndex - 1);
    } else {
      openLightbox(actsData.length - 1);
    }
  }

  // Trigger buttons on cards & frames
  document.querySelectorAll('[data-act-index]').forEach(el => {
    el.addEventListener('click', e => {
      // Don't trigger if clicked on an anchor link
      if (e.target.closest('a')) return;
      const idx = parseInt(el.getAttribute('data-act-index'), 10);
      if (!isNaN(idx)) {
        openLightbox(idx);
      }
    });
  });

  // Lightbox controls
  if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);
  if (lbZoomIn) lbZoomIn.addEventListener('click', zoomIn);
  if (lbZoomOut) lbZoomOut.addEventListener('click', zoomOut);
  if (lbZoomReset) lbZoomReset.addEventListener('click', zoomReset);
  if (lbNextBtn) lbNextBtn.addEventListener('click', showNextAct);
  if (lbPrevBtn) lbPrevBtn.addEventListener('click', showPrevAct);

  // Click outside image to close
  if (lbStage) {
    lbStage.addEventListener('click', e => {
      if (e.target === lbStage || e.target === lbImgWrap) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextAct();
    } else if (e.key === 'ArrowLeft') {
      showPrevAct();
    } else if (e.key === '+' || e.key === '=') {
      zoomIn();
    } else if (e.key === '-' || e.key === '_') {
      zoomOut();
    } else if (e.key === '0') {
      zoomReset();
    }
  });

  // Mouse drag pan support when zoomed
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let scrollLeft = 0;
  let scrollTop = 0;

  if (lbStage) {
    lbStage.addEventListener('mousedown', e => {
      if (currentZoom > 1) {
        isDragging = true;
        startX = e.pageX - lbStage.offsetLeft;
        startY = e.pageY - lbStage.offsetTop;
        scrollLeft = lbStage.scrollLeft;
        scrollTop = lbStage.scrollTop;
      }
    });

    window.addEventListener('mousemove', e => {
      if (!isDragging || !lbStage) return;
      e.preventDefault();
      const x = e.pageX - lbStage.offsetLeft;
      const y = e.pageY - lbStage.offsetTop;
      lbStage.scrollLeft = scrollLeft - (x - startX) * 1.4;
      lbStage.scrollTop = scrollTop - (y - startY) * 1.4;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

})();
