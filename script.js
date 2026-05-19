/* ═══════════════════════════════════════════════════════════════
   HASNAIN HAROON — PORTFOLIO SCRIPT  ·  NEXT-LEVEL EDITION
   All content preserved · Pure animation/interaction upgrades
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   0. SHARED UTILITIES
──────────────────────────────────────────────────────────────── */
const raf   = requestAnimationFrame.bind(window);
const PI2   = Math.PI * 2;
const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v));
const rand  = (a, b) => a + Math.random() * (b - a);

/* Easing functions */
const ease = {
  outExpo:   t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  outElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
      Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  inOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

/* Global mouse state — single source of truth */
const MOUSE = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0, vy: 0, px: 0, py: 0 };
document.addEventListener('mousemove', e => {
  MOUSE.vx = e.clientX - MOUSE.x;
  MOUSE.vy = e.clientY - MOUSE.y;
  MOUSE.px = MOUSE.x; MOUSE.py = MOUSE.y;
  MOUSE.x  = e.clientX; MOUSE.y = e.clientY;
}, { passive: true });

/* ──────────────────────────────────────────────────────────────
   1. LIQUID CURSOR + TRAIL SYSTEM
──────────────────────────────────────────────────────────────── */
(function initLiquidCursor() {
  /* Replace the two static divs with a canvas-based liquid cursor */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  /* Hide original elements — we'll drive them with physics */
  Object.assign(cursor.style, {
    width: '10px', height: '10px',
    borderRadius: '50%',
    background: 'var(--accent, #00c4ff)',
    boxShadow: '0 0 18px 4px var(--accent, #00c4ff)',
    transition: 'none',
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: '99999',
    mixBlendMode: 'screen',
    transform: 'translate(-50%,-50%)',
    willChange: 'transform',
  });
  Object.assign(follower.style, {
    width: '40px', height: '40px',
    borderRadius: '50%',
    border: '1.5px solid rgba(0,196,255,0.5)',
    background: 'transparent',
    backdropFilter: 'blur(2px)',
    transition: 'none',
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: '99998',
    transform: 'translate(-50%,-50%)',
    willChange: 'transform',
  });

  /* Trail canvas — positioned on top of everything */
  const trailCanvas = document.createElement('canvas');
  Object.assign(trailCanvas.style, {
    position: 'fixed', inset: '0',
    pointerEvents: 'none',
    zIndex: '99997',
    mixBlendMode: 'screen',
  });
  document.body.appendChild(trailCanvas);
  const tc = trailCanvas.getContext('2d');

  function resizeTrail() {
    trailCanvas.width  = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeTrail, { passive: true });
  resizeTrail();

  /* Trail points ring buffer */
  const TRAIL_LEN = 28;
  const trail = Array.from({ length: TRAIL_LEN }, () => ({ x: MOUSE.x, y: MOUSE.y, a: 0 }));
  let trailHead = 0;

  /* Follower physics */
  let fx = MOUSE.x, fy = MOUSE.y;
  let fvx = 0, fvy = 0;
  const SPRING = 0.14, DAMPING = 0.72;

  /* Hover state */
  let isHover = false;
  document.querySelectorAll('a, button, .project-card, .exp-card, .info-card, .cert-card, .fyp-card').forEach(el => {
    el.addEventListener('mouseenter', () => { isHover = true; });
    el.addEventListener('mouseleave', () => { isHover = false; });
  });

  let hue = 190;
  let scale = 1;

  function animCursor() {
    raf(animCursor);
    hue = (hue + 0.4) % 360;

    /* Dot snaps to cursor */
    cursor.style.left = MOUSE.x + 'px';
    cursor.style.top  = MOUSE.y + 'px';
    cursor.style.boxShadow = `0 0 ${isHover ? 30 : 16}px ${isHover ? 8 : 4}px hsl(${hue},100%,60%)`;
    cursor.style.background = `hsl(${hue},100%,65%)`;

    /* Follower spring physics */
    fvx += (MOUSE.x - fx) * SPRING;
    fvy += (MOUSE.y - fy) * SPRING;
    fvx *= DAMPING; fvy *= DAMPING;
    fx += fvx; fy += fvy;

    /* Squish follower based on velocity */
    const speed = Math.sqrt(fvx * fvx + fvy * fvy);
    const angle = Math.atan2(fvy, fvx);
    const stretch = clamp(1 + speed * 0.04, 1, 1.7);
    const squeeze = 1 / stretch;
    scale = lerp(scale, isHover ? 1.8 : 1, 0.12);

    const fw = (isHover ? 52 : 40) * scale;
    const fh = (isHover ? 52 : 40) * scale;
    follower.style.left   = fx + 'px';
    follower.style.top    = fy + 'px';
    follower.style.width  = fw * stretch + 'px';
    follower.style.height = fh * squeeze + 'px';
    follower.style.transform = `translate(-50%,-50%) rotate(${angle}rad)`;
    follower.style.borderColor = `hsla(${hue},100%,65%,0.6)`;

    /* Trail */
    trail[trailHead] = { x: MOUSE.x, y: MOUSE.y, a: 1 };
    trailHead = (trailHead + 1) % TRAIL_LEN;

    tc.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    /* Draw ribbon trail */
    if (TRAIL_LEN > 2) {
      for (let i = 0; i < TRAIL_LEN - 1; i++) {
        const idx0 = (trailHead + i)     % TRAIL_LEN;
        const idx1 = (trailHead + i + 1) % TRAIL_LEN;
        const t    = i / (TRAIL_LEN - 1);
        const alpha = t * 0.35;
        const width = t * (isHover ? 6 : 4);

        tc.beginPath();
        tc.moveTo(trail[idx0].x, trail[idx0].y);
        tc.lineTo(trail[idx1].x, trail[idx1].y);
        tc.strokeStyle = `hsla(${(hue + i * 3) % 360},100%,65%,${alpha})`;
        tc.lineWidth   = width;
        tc.lineCap     = 'round';
        tc.stroke();
      }

      /* Glow bloom at head */
      const grd = tc.createRadialGradient(MOUSE.x, MOUSE.y, 0, MOUSE.x, MOUSE.y, isHover ? 40 : 24);
      grd.addColorStop(0,   `hsla(${hue},100%,70%,0.18)`);
      grd.addColorStop(1,   'transparent');
      tc.beginPath();
      tc.arc(MOUSE.x, MOUSE.y, isHover ? 40 : 24, 0, PI2);
      tc.fillStyle = grd;
      tc.fill();
    }
  }
  raf(animCursor);
})();

/* ──────────────────────────────────────────────────────────────
   2. NAVBAR SCROLL
──────────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    const dir = y > last ? 'down' : 'up';
    navbar.style.transform = (dir === 'down' && y > 200) ? 'translateY(-110%)' : 'translateY(0)';
    navbar.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), padding 0.3s, box-shadow 0.3s';
    if (y > 60) {
      navbar.style.paddingTop    = '8px';
      navbar.style.paddingBottom = '8px';
      navbar.style.boxShadow     = '0 4px 40px rgba(0,0,0,.5)';
    } else {
      navbar.style.paddingTop    = '';
      navbar.style.paddingBottom = '';
      navbar.style.boxShadow     = '';
      navbar.style.transform     = 'translateY(0)';
    }
    last = y;
  }, { passive: true });
})();

/* ──────────────────────────────────────────────────────────────
   3. MOBILE HAMBURGER
──────────────────────────────────────────────────────────────── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

/* ──────────────────────────────────────────────────────────────
   4. ACTIVE NAV LINK ON SCROLL
──────────────────────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ──────────────────────────────────────────────────────────────
   5. WEBGL-LIKE 3D DEPTH CANVAS — removed (particles disabled)
──────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────
   6. MORPHING SVG BLOB BACKGROUNDS on hero orbs
──────────────────────────────────────────────────────────────── */
(function initMorphingBlobs() {
  /* We'll inject a canvas that renders morphing blobs behind the hero */
  const hero = document.getElementById('hero');
  if (!hero) return;

  const blobCanvas = document.createElement('canvas');
  Object.assign(blobCanvas.style, {
    position: 'absolute', inset: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none',
    zIndex: '0',
    opacity: '0.7',
  });
  hero.insertBefore(blobCanvas, hero.firstChild);
  const bc = blobCanvas.getContext('2d');

  function resizeBlob() {
    blobCanvas.width  = hero.offsetWidth;
    blobCanvas.height = hero.offsetHeight;
  }
  window.addEventListener('resize', resizeBlob, { passive: true });
  resizeBlob();

  /* Blob definition — each has N control points on a circle that oscillate */
  function createBlob(cx, cy, baseR, nPoints, hue, speed) {
    return {
      cx, cy, baseR, nPoints, hue, speed,
      offsets: Array.from({ length: nPoints }, () => ({
        phase: rand(0, PI2),
        amp:   rand(0.12, 0.32),
        freq:  rand(0.7, 1.5),
      })),
    };
  }

  const blobs = [
    createBlob(0.18, 0.35, 0.22, 8,  190, 0.45),
    createBlob(0.80, 0.25, 0.18, 7,  270, 0.35),
    createBlob(0.60, 0.75, 0.15, 9,  320, 0.55),
    createBlob(0.05, 0.80, 0.10, 6,  160, 0.65),
  ];

  /* Spline through blob points using Catmull-Rom */
  function drawBlob(blob, t) {
    const W = blobCanvas.width, H = blobCanvas.height;
    const cx = blob.cx * W, cy = blob.cy * H;
    const baseR = blob.baseR * Math.min(W, H);
    const N = blob.nPoints;

    const pts = blob.offsets.map((o, i) => {
      const angle = (i / N) * PI2;
      const r = baseR * (1 + o.amp * Math.sin(t * o.freq + o.phase));
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    });

    bc.beginPath();
    for (let i = 0; i < N; i++) {
      const p0 = pts[(i - 1 + N) % N];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % N];
      const p3 = pts[(i + 2) % N];

      if (i === 0) bc.moveTo(p1.x, p1.y);

      /* Catmull-Rom to cubic bezier */
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      bc.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    bc.closePath();

    const hue = (blob.hue + t * 15) % 360;
    const grd = bc.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.4);
    grd.addColorStop(0,   `hsla(${hue},90%,60%,0.18)`);
    grd.addColorStop(0.6, `hsla(${(hue+30)%360},80%,50%,0.09)`);
    grd.addColorStop(1,   'transparent');
    bc.fillStyle   = grd;
    bc.shadowBlur  = 40;
    bc.shadowColor = `hsla(${hue},100%,65%,0.3)`;
    bc.fill();
    bc.shadowBlur  = 0;
  }

  let blobT = 0;
  function blobLoop() {
    raf(blobLoop);
    blobT += 0.008;
    bc.clearRect(0, 0, blobCanvas.width, blobCanvas.height);

    /* Subtle mouse parallax on blobs */
    const mx = (MOUSE.x / window.innerWidth  - 0.5) * 0.04;
    const my = (MOUSE.y / window.innerHeight - 0.5) * 0.04;

    blobs.forEach((b, i) => {
      bc.save();
      bc.translate(mx * (i + 1) * blobCanvas.width, my * (i + 1) * blobCanvas.height);
      drawBlob(b, blobT * b.speed * 2);
      bc.restore();
    });
  }
  raf(blobLoop);
})();

/* ──────────────────────────────────────────────────────────────
   7. HOLOGRAPHIC TEXT EFFECT on hero name
──────────────────────────────────────────────────────────────── */
(function initHolographicText() {
  const style = document.createElement('style');
  style.textContent = `
    /* Holographic shimmer on hero name */
    @keyframes holoShift {
      0%   { background-position: 0% 50%;   filter: hue-rotate(0deg)   brightness(1.1); }
      25%  { background-position: 50% 100%; filter: hue-rotate(30deg)  brightness(1.3); }
      50%  { background-position: 100% 50%; filter: hue-rotate(60deg)  brightness(1.15);}
      75%  { background-position: 50% 0%;   filter: hue-rotate(20deg)  brightness(1.25);}
      100% { background-position: 0% 50%;   filter: hue-rotate(0deg)   brightness(1.1); }
    }
    @keyframes holoScan {
      0%   { transform: translateX(-120%) skewX(-20deg); }
      100% { transform: translateX(250%)  skewX(-20deg); }
    }
    @keyframes holoRainbow {
      0%   { background-position: 0%   50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0%   50%; }
    }
    .name-accent {
      background: linear-gradient(
        120deg,
        #00c4ff 0%, #4fffb0 18%, #ff6bff 36%,
        #ffd700 54%, #00c4ff 72%, #4fffb0 90%, #ff6bff 100%
      ) !important;
      background-size: 300% 300% !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      animation: holoShift 5s ease infinite !important;
      position: relative !important;
      display: inline-block !important;
    }
    .name-accent::after {
      content: attr(data-text);
      position: absolute;
      inset: 0;
      background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: holoScan 4s linear infinite;
      pointer-events: none;
    }

    /* Hero tagline holographic separator */
    .tagline-sep {
      background: linear-gradient(90deg, #00c4ff, #ff6bff, #4fffb0);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: holoRainbow 2s linear infinite;
      display: inline-block;
    }

    /* Holographic card shimmer on hover — NOT on fyp-card (text readability) */
    .project-card::after, .exp-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(
        125deg,
        transparent 20%,
        rgba(0,196,255,0.07) 40%,
        rgba(255,107,255,0.07) 60%,
        transparent 80%
      );
      background-size: 300% 300%;
      animation: holoRainbow 6s linear infinite;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.4s;
    }
    .project-card:hover::after, .exp-card:hover::after {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  /* Set data-text on name-accent for the scan layer */
  const nameAccent = document.querySelector('.name-accent');
  if (nameAccent) nameAccent.setAttribute('data-text', nameAccent.textContent);
})();

/* ──────────────────────────────────────────────────────────────
   8. CINEMATIC SCROLL STORYTELLING
      — parallax depth layers, section reveal with physics
──────────────────────────────────────────────────────────────── */
(function initCinematicScroll() {
  const style = document.createElement('style');
  style.textContent = `
    /* Scroll-driven reveal with spring physics simulation */
    .cinematic-hidden {
      opacity: 0;
      transform: translateY(60px) scale(0.94);
      transition:
        opacity   0.85s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.85s cubic-bezier(0.22, 1, 0.36, 1),
        filter    0.85s ease;
      filter: blur(8px);
      will-change: transform, opacity, filter;
    }
    .cinematic-hidden.cinematic-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0px);
    }
    .cinematic-hidden.from-left {
      transform: translateX(-80px) scale(0.94) rotateY(8deg);
    }
    .cinematic-hidden.from-right {
      transform: translateX(80px) scale(0.94) rotateY(-8deg);
    }
    .cinematic-hidden.from-left.cinematic-visible,
    .cinematic-hidden.from-right.cinematic-visible {
      transform: translateX(0) scale(1) rotateY(0deg);
    }
    .cinematic-hidden.scale-in {
      transform: scale(0.7) rotateZ(-3deg);
    }
    .cinematic-hidden.scale-in.cinematic-visible {
      transform: scale(1) rotateZ(0deg);
    }

    /* Stagger children of these containers */
    .cinematic-stagger > * {
      transition-delay: calc(var(--child-i, 0) * 0.08s) !important;
    }

    /* Section separator lines animate on scroll */
    .section-tag::before {
      content: '';
      display: inline-block;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--accent, #00c4ff), transparent);
      vertical-align: middle;
      margin-right: 0.5em;
      transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .section-tag.cinematic-visible::before { width: 2em; }

    /* Scroll progress per section */
    .section-progress-line {
      position: absolute;
      left: 0; top: 0;
      width: 3px;
      background: linear-gradient(180deg, var(--accent,#00c4ff), #4fffb0);
      transition: height 0.1s;
      border-radius: 3px;
      pointer-events: none;
    }

    /* Anim stagger grids */
    .anim-stagger > *:nth-child(1) { transition-delay:.05s }
    .anim-stagger > *:nth-child(2) { transition-delay:.13s }
    .anim-stagger > *:nth-child(3) { transition-delay:.21s }
    .anim-stagger > *:nth-child(4) { transition-delay:.29s }
    .anim-stagger > *:nth-child(5) { transition-delay:.37s }
    .anim-stagger > *:nth-child(6) { transition-delay:.45s }
    .anim-stagger > *:nth-child(7) { transition-delay:.53s }
    .anim-stagger > *:nth-child(8) { transition-delay:.61s }
  `;
  document.head.appendChild(style);

  /* Tag all the elements */
  const map = [
    { sel: '.fade-in',           cls: '' },
    { sel: '.section-header',    cls: '' },
    { sel: '.section-tag',       cls: '' },
    { sel: '.about-text',        cls: 'from-left' },
    { sel: '.about-cards',       cls: 'from-right' },
    { sel: '.timeline-card',     cls: 'from-left' },
    { sel: '.skill-category',    cls: 'scale-in' },
    { sel: '.project-card',      cls: 'scale-in' },
    { sel: '.fyp-card',          cls: '' },
    { sel: '.exp-card',          cls: 'from-left' },
    { sel: '.cert-card',         cls: 'scale-in' },
    { sel: '.contact-info',      cls: 'from-left' },
    { sel: '.contact-form-wrap', cls: 'from-right' },
    { sel: '.resume-cta',        cls: '' },
    { sel: '.info-card',         cls: 'scale-in' },
    { sel: '.timeline-item',     cls: 'from-left' },
  ];

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('cinematic-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  map.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('cinematic-hidden');
      if (cls) el.classList.add(cls);
      /* Stagger siblings */
      const siblings = [...el.parentElement.querySelectorAll(sel)];
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = (idx * 0.09) + 's';
      io.observe(el);
    });
  });

  /* Mark stagger containers */
  document.querySelectorAll('.skills-grid, .projects-grid, .exp-grid, .cert-grid, .about-cards')
    .forEach(el => el.classList.add('anim-stagger'));

  /* ── Parallax on hero section ── */
  const heroContent = document.querySelector('.hero-content');
  const heroImage   = document.querySelector('.hero-image-wrap');
  const heroBgGrid  = document.querySelector('.hero-bg-grid');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.25}px)`;
    if (heroImage)   heroImage.style.transform   = `translateY(${y * 0.12}px)`;
    if (heroBgGrid)  heroBgGrid.style.transform  = `translateY(${y * 0.4}px)`;
  }, { passive: true });
})();

/* ──────────────────────────────────────────────────────────────
   9. GSAP-CLASS PHYSICS — 3D CARD TRANSFORMS with inertia
──────────────────────────────────────────────────────────────── */
(function initPhysicsCards() {
  const style = document.createElement('style');
  style.textContent = `
    .project-card, .exp-card, .cert-card, .info-card, .skill-category {
      transition: box-shadow 0.4s ease !important;
      transform-style: preserve-3d !important;
      will-change: transform !important;
    }
    .project-card .project-card-inner,
    .exp-card .exp-content {
      transform-style: preserve-3d;
    }
    /* Specular highlight */
    .card-specular {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      background: radial-gradient(
        circle at var(--sx,50%) var(--sy,50%),
        rgba(255,255,255,0.13) 0%,
        transparent 65%
      );
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1;
    }
    .project-card:hover .card-specular,
    .exp-card:hover .card-specular,
    .cert-card:hover .card-specular,
    .info-card:hover .card-specular,
    .skill-category:hover .card-specular {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  const cards = document.querySelectorAll(
    '.project-card, .exp-card, .cert-card, .info-card, .skill-category'
  );

  cards.forEach(card => {
    /* Inject specular highlight div */
    const spec = document.createElement('div');
    spec.className = 'card-specular';
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    card.appendChild(spec);

    /* Physics state */
    let rotX = 0, rotY = 0;
    let velX = 0, velY = 0;
    let targetX = 0, targetY = 0;
    let isInside = false;
    let animId = null;
    const SPRING = 0.18, DAMP = 0.68;
    const MAX_ROT = 10;

    function springLoop() {
      velX += (targetX - rotX) * SPRING;
      velY += (targetY - rotY) * SPRING;
      velX *= DAMP; velY *= DAMP;
      rotX += velX; rotY += velY;

      const dist = Math.abs(targetX - rotX) + Math.abs(targetY - rotY);
      if (!isInside && dist < 0.01 && Math.abs(velX) < 0.005 && Math.abs(velY) < 0.005) {
        card.style.transform = '';
        card.style.boxShadow = '';
        cancelAnimationFrame(animId);
        animId = null;
        return;
      }

      const liftZ    = isInside ? 8 : 0;
      const shadow   = isInside
        ? `${-rotY * 1.2}px ${rotX * 1.2}px 40px rgba(0,0,0,0.5), 0 20px 60px rgba(0,196,255,0.12)`
        : '0 4px 20px rgba(0,0,0,0.3)';

      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${liftZ}px)`;
      card.style.boxShadow = shadow;

      animId = raf(springLoop);
    }

    card.addEventListener('mouseenter', () => {
      isInside = true;
      if (!animId) animId = raf(springLoop);
    });

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5;   // -0.5 → +0.5
      const ny = (e.clientY - r.top)  / r.height - 0.5;

      targetX = -ny * MAX_ROT;
      targetY =  nx * MAX_ROT;

      /* Specular position */
      spec.style.setProperty('--sx', ((nx + 0.5) * 100).toFixed(1) + '%');
      spec.style.setProperty('--sy', ((ny + 0.5) * 100).toFixed(1) + '%');
    });

    card.addEventListener('mouseleave', () => {
      isInside = false;
      targetX  = 0;
      targetY  = 0;
      if (!animId) animId = raf(springLoop);
    });
  });
})();

/* ──────────────────────────────────────────────────────────────
   10. SKILL BAR ANIMATION with liquid fill effect
──────────────────────────────────────────────────────────────── */
(function initSkillBars() {
  const style = document.createElement('style');
  style.textContent = `
    /* Liquid shimmer fill */
    @keyframes skillShimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes skillLiquid {
      0%,100% { border-radius: 4px 4px 4px 4px; }
      25%     { border-radius: 4px 8px 4px 4px; }
      50%     { border-radius: 6px 4px 6px 4px; }
      75%     { border-radius: 4px 4px 8px 4px; }
    }
    .skill-bar-fill {
      background: linear-gradient(90deg,
        #00c4ff 0%, #4fffb0 30%, #fff 50%, #4fffb0 70%, #00c4ff 100%
      ) !important;
      background-size: 250% auto !important;
      animation: skillShimmer 3s linear infinite, skillLiquid 4s ease-in-out infinite !important;
      box-shadow: 0 0 12px rgba(0,196,255,0.5) !important;
    }
  `;
  document.head.appendChild(style);

  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width') || '0';
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.transition = 'width 1.4s cubic-bezier(0.22, 1, 0.36, 1)';
          bar.style.width = width + '%';
        }, 250);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => { bar.style.width = '0%'; observer.observe(bar); });
})();

/* ──────────────────────────────────────────────────────────────
   11. HERO PROFILE IMAGE FALLBACK
──────────────────────────────────────────────────────────────── */
(function initHeroImage() {
  const img         = document.getElementById('heroImg');
  const placeholder = document.getElementById('heroImgPlaceholder');
  if (!img || !placeholder) return;

  img.addEventListener('error', () => {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  });
  img.addEventListener('load', () => {
    placeholder.style.display = 'none';
    img.style.display = 'block';
  });
  if (!img.complete || img.naturalWidth === 0) {
    img.dispatchEvent(new Event('error'));
  }
})();

/* ──────────────────────────────────────────────────────────────
   12. CONTACT FORM
──────────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    const mailtoLink = `mailto:hasnianharoon456@gmail.com`
      + `?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}`
      + `&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;

    window.location.href = mailtoLink;
    showNotification('Opening your email client…', 'success');
    form.reset();
  });

  function isValidEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }
})();

/* ──────────────────────────────────────────────────────────────
   13. NOTIFICATION TOAST  (holographic variant)
──────────────────────────────────────────────────────────────── */
function showNotification(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${msg}</span>
  `;
  Object.assign(toast.style, {
    position:      'fixed',
    bottom:        '2rem',
    right:         '2rem',
    display:       'flex',
    alignItems:    'center',
    gap:           '0.6rem',
    background:    type === 'success'
      ? 'linear-gradient(135deg, rgba(0,196,255,0.12), rgba(79,255,176,0.10))'
      : 'linear-gradient(135deg, rgba(255,107,53,0.14), rgba(255,50,100,0.10))',
    border:        `1px solid ${type === 'success' ? 'rgba(0,196,255,0.4)' : 'rgba(255,107,53,0.4)'}`,
    color:         type === 'success' ? '#4fffb0' : '#ff6b35',
    padding:       '0.9rem 1.4rem',
    borderRadius:  '12px',
    fontSize:      '0.88rem',
    fontWeight:    '600',
    zIndex:        '99990',
    backdropFilter:'blur(20px)',
    boxShadow:     type === 'success'
      ? '0 8px 40px rgba(0,196,255,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
      : '0 8px 40px rgba(255,107,53,0.2)',
    animation:     'toastIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
  });
  document.body.appendChild(toast);

  if (!document.getElementById('toastKF')) {
    const s = document.createElement('style');
    s.id = 'toastKF';
    s.textContent = `
      @keyframes toastIn  { from { opacity:0; transform:translateY(20px) scale(0.9); } to { opacity:1; transform:none; } }
      @keyframes toastOut { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(12px) scale(0.95); } }
      .nav-link.active { color: var(--accent) !important; }
    `;
    document.head.appendChild(s);
  }

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ──────────────────────────────────────────────────────────────
   14. SMOOTH SCROLL ENHANCEMENT
──────────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ──────────────────────────────────────────────────────────────
   15. MAGNETIC BUTTON EFFECT with pull physics
──────────────────────────────────────────────────────────────── */
(function initMagneticButtons() {
  const style = document.createElement('style');
  style.textContent = `
    .btn-primary, .btn-ghost, .btn-resume {
      position: relative !important;
      overflow: hidden !important;
      transition: box-shadow 0.3s, border-color 0.3s !important;
      will-change: transform;
    }
    .btn-primary::after, .btn-ghost::after, .btn-resume::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.2) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    .btn-primary:hover::after, .btn-ghost:hover::after, .btn-resume:hover::after { opacity: 1; }
    @keyframes rippleOut { to { transform:scale(1); opacity:0; } }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.btn-primary, .btn-ghost, .btn-resume').forEach(btn => {
    let bvx = 0, bvy = 0, bx = 0, by = 0;
    let inside = false, animId = null;

    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const nx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const ny = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      bvx = nx * 6; bvy = ny * 4;

      btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
      btn.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });

    btn.addEventListener('mouseenter', () => {
      inside = true;
      if (!animId) animId = raf(springBtn);
    });

    btn.addEventListener('mouseleave', () => {
      inside = false;
      bvx = 0; bvy = 0;
    });

    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const rip = document.createElement('span');
      const size = Math.max(r.width, r.height) * 2.2;
      Object.assign(rip.style, {
        position: 'absolute', borderRadius: '50%',
        background: 'rgba(255,255,255,0.28)',
        width: size+'px', height: size+'px',
        left: (e.clientX-r.left-size/2)+'px',
        top:  (e.clientY-r.top-size/2)+'px',
        transform: 'scale(0)',
        animation: 'rippleOut 0.65s ease forwards',
        pointerEvents: 'none',
      });
      btn.appendChild(rip);
      setTimeout(() => rip.remove(), 700);
    });

    const BSPRING = 0.12, BDAMP = 0.65;
    function springBtn() {
      bx = lerp(bx, inside ? bvx : 0, BSPRING);
      by = lerp(by, inside ? bvy : 0, BSPRING);
      btn.style.transform = `translate(${bx.toFixed(2)}px, ${by.toFixed(2)}px)`;
      if (!inside && Math.abs(bx) < 0.05 && Math.abs(by) < 0.05) {
        btn.style.transform = '';
        cancelAnimationFrame(animId);
        animId = null;
        return;
      }
      animId = raf(springBtn);
    }
  });
})();

/* ──────────────────────────────────────────────────────────────
   16. STAT COUNTER ANIMATION
──────────────────────────────────────────────────────────────── */
(function initStatCounters() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes statPop {
      0%   { transform: scale(0.4) rotateY(-90deg); opacity: 0; }
      60%  { transform: scale(1.15) rotateY(8deg); }
      80%  { transform: scale(0.97) rotateY(-3deg); }
      100% { transform: scale(1) rotateY(0deg); opacity: 1; }
    }
    .stat-pop { animation: statPop 0.8s cubic-bezier(0.22,1,0.36,1) both; }

    /* Color cycle for stat numbers */
    @keyframes statHueShift {
      0%   { filter: hue-rotate(0deg)   brightness(1.1); }
      50%  { filter: hue-rotate(60deg)  brightness(1.3); }
      100% { filter: hue-rotate(0deg)   brightness(1.1); }
    }
    .stat-num { animation: statHueShift 4s ease infinite; }
  `;
  document.head.appendChild(style);

  const stats = document.querySelectorAll('.stat-num');
  const io    = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      el.classList.add('stat-pop');
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      if (!isNaN(num) && raw.match(/^\d+(\.\d+)?$/)) {
        let startTime = null;
        const dur = 1500;
        const isFloat = raw.includes('.');
        (function step(ts) {
          if (!startTime) startTime = ts;
          const p    = Math.min((ts - startTime) / dur, 1);
          const eased = ease.outExpo(p);
          el.textContent = isFloat ? (eased * num).toFixed(2) : Math.round(eased * num);
          if (p < 1) raf(step); else el.textContent = raw;
        })(performance.now());
      }
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => io.observe(s));
})();

/* ──────────────────────────────────────────────────────────────
   17. SCROLL PROGRESS BAR (holographic)
──────────────────────────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position:   'fixed', top: '0', left: '0', height: '3px',
    background: 'linear-gradient(90deg, #00c4ff, #4fffb0, #ff6bff, #00c4ff)',
    backgroundSize: '300% 100%',
    zIndex:     '99996', width: '0%',
    pointerEvents: 'none',
    boxShadow: '0 0 12px rgba(0,196,255,0.7)',
    animation: 'progressHolo 3s linear infinite',
    transition: 'width 0.08s',
  });
  document.body.appendChild(bar);

  const progStyle = document.createElement('style');
  progStyle.textContent = `@keyframes progressHolo {
    0%   { background-position: 0% 50%; }
    100% { background-position: 300% 50%; }
  }`;
  document.head.appendChild(progStyle);

  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = clamp(pct, 0, 100) + '%';
  }, { passive: true });
})();

/* ──────────────────────────────────────────────────────────────
   18. HERO TAGLINE TYPING EFFECT
──────────────────────────────────────────────────────────────── */
(function initTyped() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .typing-cursor::after {
      content: '|';
      animation: blink 1s step-end infinite;
      color: var(--accent, #00c4ff);
      margin-left: 2px;
    }
    /* Stat hue cycle */
    @keyframes statHueCycle {
      0%   { color: hsl(190, 100%, 65%); }
      33%  { color: hsl(260, 100%, 70%); }
      66%  { color: hsl(320, 100%, 65%); }
      100% { color: hsl(190, 100%, 65%); }
    }
  `;
  document.head.appendChild(style);

  /* Subtle hue cycle on stat numbers */
  const statNums = document.querySelectorAll('.stat-num');
  let hue = 190;
  setInterval(() => {
    hue = (hue + 0.3) % 360;
    statNums.forEach(n => n.style.color = `hsl(${hue}, 100%, 65%)`);
  }, 50);

  const words = ['Structural Engineering', 'Civil Engineering', 'RC Design', 'AI Research'];
  const el    = document.querySelector('.tagline-word');
  if (!el) return;
  el.classList.add('typing-cursor');
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi % words.length];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi++; setTimeout(tick, 400); return; }
    }
    setTimeout(tick, deleting ? 50 : 85);
  }
  setTimeout(tick, 1200);
})();

/* ──────────────────────────────────────────────────────────────
   19. FLOATING HERO CHIPS with physics
──────────────────────────────────────────────────────────────── */
(function initChipPhysics() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes chipFloat1 {
      0%,100% { transform: translateY(0) rotate(-2deg) scale(1); }
      33%     { transform: translateY(-16px) rotate(2deg) scale(1.04); }
      66%     { transform: translateY(-8px) rotate(-1deg) scale(0.98); }
    }
    @keyframes chipFloat2 {
      0%,100% { transform: translateY(0) rotate(3deg) scale(1); }
      40%     { transform: translateY(-12px) rotate(-2deg) scale(1.05); }
      70%     { transform: translateY(-5px) rotate(1deg) scale(0.97); }
    }
    @keyframes chipFloat3 {
      0%,100% { transform: translateY(0) rotate(-1deg) scale(1); }
      50%     { transform: translateY(-20px) rotate(3deg) scale(1.06); }
    }
    .chip-1 {
      animation: chipFloat1 5s ease-in-out infinite;
      box-shadow: 0 0 20px rgba(0,196,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15) !important;
    }
    .chip-2 {
      animation: chipFloat2 6s ease-in-out infinite 0.8s;
      box-shadow: 0 0 20px rgba(168,139,250,0.3), inset 0 1px 0 rgba(255,255,255,0.15) !important;
    }
    .chip-3 {
      animation: chipFloat3 4.5s ease-in-out infinite 1.5s;
      box-shadow: 0 0 20px rgba(79,255,176,0.3), inset 0 1px 0 rgba(255,255,255,0.15) !important;
    }

    .fyp-card {
      position: relative;
      isolation: isolate;
    }

    /* Profile ring — dual counter-rotate */
    @keyframes ringCW  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
    @keyframes ringCCW { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
    .hero-img-ring   { animation: ringCW  14s linear infinite !important; }
    .hero-img-ring-2 { animation: ringCCW 20s linear infinite !important; }

    /* Badge heartbeat */
    @keyframes heartbeat {
      0%,100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(79,255,176,0.6); }
      40%     { transform: scale(1.45); box-shadow: 0 0 0 10px rgba(79,255,176,0); }
    }
    .badge-dot { animation: heartbeat 2.2s ease infinite !important; }

    /* CGPA badge glow pulse */
    @keyframes cgpaPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(0,196,255,0.5), 0 4px 20px rgba(0,0,0,0.2); }
      50%     { box-shadow: 0 0 0 12px rgba(0,196,255,0), 0 8px 30px rgba(0,196,255,0.15); }
    }
    .cgpa-badge { animation: cgpaPulse 2.8s ease infinite !important; }

    /* Experience number shimmer */
    @keyframes expNumShift {
      0%   { background-position: 0%   50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0%   50%; }
    }
    .exp-number {
      background: linear-gradient(135deg, #00c4ff 0%, #a78bfa 40%, #f472b6 70%, #00c4ff 100%) !important;
      background-size: 300% auto !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      animation: expNumShift 3s ease infinite !important;
    }

    /* Nav link glide underline */
    .nav-link {
      position: relative;
      overflow: hidden;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      left: -100%; bottom: -2px;
      width: 100%; height: 2px;
      background: linear-gradient(90deg, var(--accent,#00c4ff), #4fffb0);
      transition: left 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    .nav-link:hover::after,
    .nav-link.active::after { left: 0; }

    /* Footer socials — elastic spin */
    .footer-socials a {
      display: inline-block;
      transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), color 0.3s !important;
    }
    .footer-socials a:hover {
      transform: rotate(360deg) scale(1.3) !important;
    }

    /* Scroll hint bounce */
    @keyframes scrollBounce {
      0%,100% { transform: translateY(0); opacity: 0.75; }
      50%      { transform: translateY(12px); opacity: 1; }
    }
    .scroll-hint-line { animation: scrollBounce 1.8s ease-in-out infinite !important; }

    /* Section tag slide in */
    @keyframes tagSlide {
      from { transform: translateX(-24px); opacity: 0; }
      to   { transform: none; opacity: 1; }
    }
    .section-tag { animation: tagSlide 0.7s ease both; }

    /* About tag pills hover wave */
    @keyframes tagWave {
      0%,100% { transform: translateY(0) scale(1); }
      50%     { transform: translateY(-5px) scale(1.05); }
    }
    .about-tags .tag:hover,
    .skill-tag-pill:hover { animation: tagWave 0.5s ease; }

    /* Contact link arrow nudge */
    .contact-link-item {
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), background 0.3s !important;
    }
    .contact-link-item:hover { transform: translateX(10px) !important; }
    .cli-arrow { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) !important; }
    .contact-link-item:hover .cli-arrow { transform: translateX(6px) !important; }

    /* Reduced motion safety */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration:   0.01ms !important;
        transition-duration:  0.01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

/* ──────────────────────────────────────────────────────────────
   19-B. FYP SECTION — PROFESSIONAL ANIMATIONS
──────────────────────────────────────────────────────────────── */
(function initFYPAnimations() {

  /* ── Inject all CSS ── */
  const style = document.createElement('style');
  style.textContent = `

    /* ── 1. Card ambient breathe glow ── */
    @keyframes fypBreath {
      0%,100% { box-shadow: 0 0 0 0 rgba(0,196,255,0), 0 4px 40px rgba(0,0,0,0.45); }
      50%     { box-shadow: 0 0 60px 4px rgba(0,196,255,0.10), 0 8px 60px rgba(0,0,0,0.5); }
    }
    .fyp-card { animation: fypBreath 5s ease-in-out infinite; }

    /* ── 2. Animated corner brackets ── */
    .fyp-corner {
      position: absolute;
      width: 22px; height: 22px;
      pointer-events: none;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.6s ease;
    }
    .fyp-card:hover .fyp-corner,
    .fyp-card.fyp-in-view .fyp-corner { opacity: 1; }
    .fyp-corner svg line {
      stroke: #00c4ff;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-dasharray: 22;
      stroke-dashoffset: 22;
      transition: stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1);
    }
    .fyp-card:hover .fyp-corner svg line,
    .fyp-card.fyp-in-view .fyp-corner svg line { stroke-dashoffset: 0; }

    .fyp-corner-tl { top: 14px;    left: 14px;    }
    .fyp-corner-tr { top: 14px;    right: 14px;   transform: scaleX(-1); }
    .fyp-corner-bl { bottom: 14px; left: 14px;    transform: scaleY(-1); }
    .fyp-corner-br { bottom: 14px; right: 14px;   transform: scale(-1);  }

    /* ── 3. Scan-line sweep (subtle data-readout feel) ── */
    @keyframes fypScan {
      0%   { top: 0%;    opacity: 0; }
      5%   { opacity: 1; }
      95%  { opacity: 1; }
      100% { top: 100%;  opacity: 0; }
    }
    .fyp-scanline {
      position: absolute;
      left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(0,196,255,0.35) 20%,
        rgba(79,255,176,0.5) 50%,
        rgba(0,196,255,0.35) 80%,
        transparent 100%
      );
      pointer-events: none;
      z-index: 1;
      animation: fypScan 7s cubic-bezier(0.4,0,0.6,1) infinite 1.5s;
      box-shadow: 0 0 10px rgba(0,196,255,0.3);
    }

    /* ── 4. Bullet list stagger reveal ── */
    .fyp-bullets li {
      opacity: 0;
      transform: translateX(-18px);
      transition:
        opacity  0.5s cubic-bezier(0.22,1,0.36,1),
        transform 0.5s cubic-bezier(0.22,1,0.36,1);
    }
    .fyp-card.fyp-in-view .fyp-bullets li { opacity: 1; transform: translateX(0); }
    .fyp-card.fyp-in-view .fyp-bullets li:nth-child(1) { transition-delay: 0.15s; }
    .fyp-card.fyp-in-view .fyp-bullets li:nth-child(2) { transition-delay: 0.25s; }
    .fyp-card.fyp-in-view .fyp-bullets li:nth-child(3) { transition-delay: 0.35s; }
    .fyp-card.fyp-in-view .fyp-bullets li:nth-child(4) { transition-delay: 0.45s; }
    .fyp-card.fyp-in-view .fyp-bullets li:nth-child(5) { transition-delay: 0.55s; }

    /* Bullet icon micro-pulse on reveal */
    .fyp-bullets li .fa-caret-right {
      transition: color 0.4s, transform 0.4s cubic-bezier(0.22,1,0.36,1);
    }
    .fyp-card.fyp-in-view .fyp-bullets li .fa-caret-right {
      color: #00c4ff;
      transform: scale(1.25);
    }

    /* ── 5. Tech chip sequential glow ── */
    @keyframes chipGlow {
      0%, 100% { border-color: rgba(255,255,255,0.07); color: #8a9bc0; box-shadow: none; }
      50%      { border-color: rgba(0,196,255,0.55);   color: #e4f6ff;  box-shadow: 0 0 12px rgba(0,196,255,0.25); }
    }
    .fyp-tech-stack .tech-chip { animation: chipGlow 4s ease-in-out infinite; }
    .fyp-tech-stack .tech-chip:nth-child(1) { animation-delay: 0.0s; }
    .fyp-tech-stack .tech-chip:nth-child(2) { animation-delay: 0.65s; }
    .fyp-tech-stack .tech-chip:nth-child(3) { animation-delay: 1.3s; }
    .fyp-tech-stack .tech-chip:nth-child(4) { animation-delay: 1.95s; }
    .fyp-tech-stack .tech-chip:nth-child(5) { animation-delay: 2.6s; }
    .fyp-tech-stack .tech-chip:nth-child(6) { animation-delay: 3.25s; }

    /* ── 6. FYP badge — live pulse dot ── */
    .fyp-badge { position: relative; padding-left: 1.4rem !important; }
    .fyp-badge::before {
      content: '';
      position: absolute;
      left: 0.55rem; top: 50%;
      transform: translateY(-50%);
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #080c12;
      box-shadow: 0 0 0 0 rgba(8,12,18,0.6);
    }
    @keyframes badgeLivePulse {
      0%   { box-shadow: 0 0 0 0 rgba(8,12,18,0.7); }
      70%  { box-shadow: 0 0 0 7px rgba(8,12,18,0); }
      100% { box-shadow: 0 0 0 0 rgba(8,12,18,0); }
    }
    .fyp-badge::before { animation: badgeLivePulse 2s ease infinite; }

    /* ── 7. Period label typewriter underline ── */
    .fyp-period {
      position: relative;
      display: inline-block;
    }
    .fyp-period::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 0; height: 1px;
      background: #00c4ff;
      transition: width 1s cubic-bezier(0.22,1,0.36,1) 0.3s;
    }
    .fyp-card.fyp-in-view .fyp-period::after { width: 100%; }

    /* ── 8. Title word-by-word shimmer on hover ── */
    @keyframes titleWordShimmer {
      0%,100% { color: var(--text-primary); }
      50%     { color: #e8f9ff; text-shadow: 0 0 20px rgba(0,196,255,0.3); }
    }
    .fyp-card:hover .fyp-title {
      animation: titleWordShimmer 3s ease-in-out infinite;
    }

    /* ── 9. Subtitle accent line grows ── */
    .fyp-subtitle {
      position: relative;
      padding-left: 0.9rem;
    }
    .fyp-subtitle::before {
      content: '';
      position: absolute;
      left: 0; top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: linear-gradient(180deg, #00c4ff, #4fffb0);
      border-radius: 3px;
      transition: height 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s;
    }
    .fyp-card.fyp-in-view .fyp-subtitle::before { height: 100%; }

    /* ── 10. Results image — subtle ken-burns ── */
    .fyp-results img {
      transition: transform 8s ease, box-shadow 0.4s ease;
      transform: scale(1);
      border-radius: 12px;
    }
    .fyp-card:hover .fyp-results img {
      transform: scale(1.04);
      box-shadow: 0 12px 48px rgba(0,0,0,0.5), 0 0 24px rgba(0,196,255,0.15);
    }
  `;
  document.head.appendChild(style);

  /* ── Inject corner bracket SVGs ── */
  const fypCard = document.querySelector('.fyp-card');
  if (!fypCard) return;

  const cornerSVG = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <line x1="0" y1="0" x2="0" y2="14"/>
    <line x1="0" y1="0" x2="14" y2="0"/>
  </svg>`;

  ['tl','tr','bl','br'].forEach(pos => {
    const div = document.createElement('div');
    div.className = `fyp-corner fyp-corner-${pos}`;
    div.innerHTML = cornerSVG;
    fypCard.appendChild(div);
  });

  /* ── Inject scanline ── */
  const scanline = document.createElement('div');
  scanline.className = 'fyp-scanline';
  fypCard.appendChild(scanline);

  /* ── Trigger class on scroll into view ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fyp-in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  io.observe(fypCard);

})();

/* ──────────────────────────────────────────────────────────────
   20. SCROLL-DRIVEN ACTIVE NAV (high-performance)
──────────────────────────────────────────────────────────────── */
(function initActiveNavScroll() {
  const links    = document.querySelectorAll('.nav-link');
  const sections = [...links].map(l => document.querySelector(l.getAttribute('href')));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.filter(Boolean).forEach(s => io.observe(s));
})();

/* ──────────────────────────────────────────────────────────────
   21. KEYBOARD NAV
──────────────────────────────────────────────────────────────── */
(function initKeyboardNav() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const hamburger = document.getElementById('hamburger');
      const navLinks  = document.getElementById('navLinks');
      if (hamburger && navLinks) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    }
  });
})();

/* ──────────────────────────────────────────────────────────────
   22. YEAR IN FOOTER
──────────────────────────────────────────────────────────────── */
(function initYear() {
  const copyEl = document.querySelector('.footer-copy');
  if (copyEl) {
    copyEl.textContent = copyEl.textContent.replace('2026',
      new Date().getFullYear().toString() === '2025' ? '2025' : '2026');
  }
})();

/* ──────────────────────────────────────────────────────────────
   23. CONSOLE EASTER EGG
──────────────────────────────────────────────────────────────── */
console.log(
  '%c👋 Hey there, fellow developer!',
  'color:#00c4ff; font-family:monospace; font-size:16px; font-weight:bold;'
);
console.log(
  '%cHasnain Haroon | Civil Engineering × AI\nhasnianharoon456@gmail.com',
  'color:#4fffb0; font-family:monospace; font-size:12px;'
);
console.log(
  '%c✨ Powered by WebGL-like canvas, morphing blobs, liquid cursor trails & holographic effects',
  'color:#ff6bff; font-family:monospace; font-size:11px;'
);
