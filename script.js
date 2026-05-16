/* ═══════════════════════════════════════════════
   HASNAIN HAROON — PORTFOLIO SCRIPT
════════════════════════════════════════════════ */

// ── NAV: scroll class + hamburger ──────────────
const navbar   = document.getElementById('navbar');
const hamburger= document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav when link clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── REVEAL ON SCROLL ───────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings in the same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── SKILL BARS ─────────────────────────────────
const bars = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const w = target.getAttribute('data-w');
      setTimeout(() => {
        target.style.width = w + '%';
      }, 200);
      barObserver.unobserve(target);
    }
  });
}, { threshold: 0.3 });

bars.forEach(bar => barObserver.observe(bar));

// ── ACTIVE NAV LINK ON SCROLL ─────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── CURSOR GLOW (desktop only) ─────────────────
if (window.matchMedia('(min-width: 1024px)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    pointer-events:none;
    position:fixed;
    width:320px;height:320px;
    border-radius:50%;
    background:radial-gradient(circle,rgba(240,165,0,0.05) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.6s ease,top 0.6s ease;
    z-index:9998;
    left:-999px;top:-999px;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ── TYPED TAGLINE (hero-pre) ────────────────────
const typedEl = document.querySelector('.hero-pre');
if (typedEl) {
  const phrases = [
    'Civil Engineer · Structural Analyst · AI Researcher',
    'YOLOv11 · Crack Detection · Structural Health',
    'COMSATS University · CGPA 3.75 · Class of 2026',
  ];
  let pi = 0, ci = 0, deleting = false;
  const type = () => {
    const phrase = phrases[pi];
    typedEl.textContent = deleting
      ? phrase.slice(0, ci--)
      : phrase.slice(0, ci++);
    if (!deleting && ci > phrase.length)      { deleting = true; setTimeout(type, 2000); return; }
    if (deleting && ci < 0)                   { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
    setTimeout(type, deleting ? 28 : 55);
  };
  // Only type after initial reveal
  setTimeout(type, 1200);
}

// ── SMOOTH SCROLL for anchor links ─────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── ACTIVE NAV CSS ─────────────────────────────
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--accent) !important; }`;
document.head.appendChild(style);

// ── COUNT-UP for stat cards ─────────────────────
function animateValue(el, start, end, duration, suffix = '') {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (start + Math.floor(eased * (end - start))) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const txt = num.textContent.trim();
        // Only animate pure numbers
        if (!isNaN(parseFloat(txt)) && !txt.includes('v')) {
          const val = parseFloat(txt);
          if (txt.includes('.')) {
            let s = 0, frames = 0;
            const iv = setInterval(() => {
              frames++;
              s = Math.min(val, +(frames * (val / 40)).toFixed(2));
              num.textContent = s.toFixed(2);
              if (s >= val) clearInterval(iv);
            }, 40);
          } else {
            animateValue(num, 0, val, 1200);
          }
        }
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(el => statObserver.observe(el));

console.log('%cHasnain Haroon Portfolio', 'color:#f0a500;font-size:1.2rem;font-weight:bold;');
console.log('%cCivil Engineer · Structural Analyst · AI Researcher', 'color:#7d8799;font-size:0.85rem;');
