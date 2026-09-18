/**
 * main.js — Arkadeb Mondal Portfolio
 * Handles: scroll-based reveal animations, active nav tab, smooth scroll
 */

(function () {
  'use strict';

  /* ─── 1. INTERSECTION OBSERVER — Card Fade In & Fade Out ── */
  const revealEls = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Smoothly fade in when entering viewport
            entry.target.classList.add('is-inview');
          } else {
            // Smoothly fade out when leaving viewport (bi-directional)
            entry.target.classList.remove('is-inview');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach((el) => {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => {
      el.classList.add('is-inview');
    });
  }

  /* ─── 2. ACTIVE NAV STATE — based on scroll position ── */
  const sections = ['projects', 'vibe-coded', 'experiments', 'about'];
  const navLinks = {
    projects: document.getElementById('nav-projects'),
    'vibe-coded': document.getElementById('nav-vibe-coded'),
    experiments: document.getElementById('nav-experiments'),
    about: document.getElementById('nav-about'),
  };

  function setActiveNav(id) {
    Object.values(navLinks).forEach((link) => {
      if (!link) return;
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });
    if (navLinks[id]) {
      navLinks[id].classList.add('active');
      navLinks[id].setAttribute('aria-current', 'page');
    }
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ─── 3. ENHANCED SMOOTH SCROLL with header compensation ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set active nav link immediately for immediate visual responsiveness
        setActiveNav(targetId);

        // Accessibility focus
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener(
          'blur',
          () => target.removeAttribute('tabindex'),
          { once: true }
        );
      }
    });
  });

  /* ─── 4. HEADER: transparent → frosted glass on scroll ── */
  const header = document.querySelector('.site-header');

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 12) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    },
    { passive: true }
  );

  /* ─── 5. DYNAMIC AURORA PARALLAX ────────────────────── */
  const aurora = document.querySelector('.aurora-bg');
  if (aurora && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener(
      'mousemove',
      (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 45;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 45;
      },
      { passive: true }
    );

    function animateAurora() {
      currentX += (mouseX - currentX) * 0.04;
      currentY += (mouseY - currentY) * 0.04;
      aurora.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      requestAnimationFrame(animateAurora);
    }
    requestAnimationFrame(animateAurora);
  }

  /* ─── 6. BLINKING SQUARES BACKGROUND (WHITE GLOW) ────── */
  const heroCanvas = document.getElementById('blinking-squares-canvas');
  const heroSection = document.querySelector('.hero');

  if (heroCanvas && heroSection) {
    const ctx = heroCanvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const squareSize = 26;
    const gap = 6;
    const cellSize = squareSize + gap;

    let cols = 0;
    let rows = 0;
    let squares = [];
    let isVisible = true;
    let animFrameId = null;
    let mouse = { x: -9999, y: -9999 };

    function initGrid() {
      const rect = heroSection.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const width = rect.width;
      const height = rect.height;

      heroCanvas.width = width * dpr;
      heroCanvas.height = height * dpr;
      heroCanvas.style.width = `${width}px`;
      heroCanvas.style.height = `${height}px`;

      if (ctx.resetTransform) {
        ctx.resetTransform();
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / cellSize) + 1;
      rows = Math.ceil(height / cellSize) + 1;

      squares = [];
      const now = performance.now();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          squares.push({
            x: c * cellSize,
            y: r * cellSize,
            blinking: false,
            blinkStart: 0,
            blinkDuration: 1400 + Math.random() * 2000,
            delay: now + Math.random() * 5000,
            baseAlpha: 0.035,
            peakAlpha: 0.55 + Math.random() * 0.4,
          });
        }
      }
    }

    function render(timestamp) {
      if (!isVisible) return;

      const width = parseFloat(heroCanvas.style.width) || (heroCanvas.width / (window.devicePixelRatio || 1));
      const height = parseFloat(heroCanvas.style.height) || (heroCanvas.height / (window.devicePixelRatio || 1));

      ctx.clearRect(0, 0, width, height);

      const now = timestamp || performance.now();

      for (let i = 0; i < squares.length; i++) {
        const sq = squares[i];

        if (!prefersReducedMotion) {
          if (!sq.blinking && now > sq.delay) {
            sq.blinking = true;
            sq.blinkStart = now;
          }
        }

        let alpha = sq.baseAlpha;
        let isGlow = false;

        if (sq.blinking) {
          const elapsed = now - sq.blinkStart;
          if (elapsed >= sq.blinkDuration) {
            sq.blinking = false;
            sq.delay = now + Math.random() * 7000;
            sq.blinkDuration = 1400 + Math.random() * 2000;
          } else {
            const progress = elapsed / sq.blinkDuration;
            const twinkleFactor = Math.sin(progress * Math.PI);
            alpha = sq.baseAlpha + (sq.peakAlpha - sq.baseAlpha) * twinkleFactor;
            if (alpha > 0.22) {
              isGlow = true;
            }
          }
        }

        // Mouse proximity glow
        if (mouse.x > -9000) {
          const centerX = sq.x + squareSize / 2;
          const centerY = sq.y + squareSize / 2;
          const dist = Math.hypot(centerX - mouse.x, centerY - mouse.y);
          const maxDist = 130;
          if (dist < maxDist) {
            const mouseBoost = (1 - dist / maxDist) * 0.6;
            alpha = Math.max(alpha, mouseBoost);
            if (mouseBoost > 0.18) isGlow = true;
          }
        }

        ctx.save();
        if (isGlow) {
          // Pure white glow bloom (no purple)
          ctx.shadowColor = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.1)})`;
          ctx.shadowBlur = 10 + alpha * 12;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 0.95)})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }

        const r = 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(sq.x, sq.y, squareSize, squareSize, r);
        } else {
          ctx.rect(sq.x, sq.y, squareSize, squareSize);
        }
        ctx.fill();

        // Subtle grid outline
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.25, alpha * 0.35 + 0.035)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    }

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              animFrameId = requestAnimationFrame(render);
            }
          } else {
            isVisible = false;
            if (animFrameId) {
              cancelAnimationFrame(animFrameId);
              animFrameId = null;
            }
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(heroSection);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initGrid();
      }, 150);
    }, { passive: true });

    initGrid();
    animFrameId = requestAnimationFrame(render);
  }

})();
