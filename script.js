/* ═══════════════════════════════════════
   HASNAIN HAROON — PORTFOLIO SCRIPT
   ═══════════════════════════════════════ */

'use strict';

/* ─── CUSTOM CURSOR ─── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let fx = 0, fy = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth follower
  (function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  // Hover effects
  document.querySelectorAll('a, button, .project-card, .exp-card, .info-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '18px';
      cursor.style.height = '18px';
      follower.style.width  = '52px';
      follower.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '';
      cursor.style.height = '';
      follower.style.width  = '';
      follower.style.height = '';
    });
  });
})();

/* ─── NAVBAR SCROLL ─── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ─── MOBILE HAMBURGER ─── */
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

/* ─── ACTIVE NAV LINK ON SCROLL ─── */
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

/* ─── FADE-IN ON SCROLL ─── */
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.1) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();

/* ─── SKILL BAR ANIMATION ─── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width') || '0';
        // Small delay for visual delight
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ─── HERO PROFILE IMAGE FALLBACK ─── */
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
  // Trigger check if already errored
  if (!img.complete || img.naturalWidth === 0) {
    img.dispatchEvent(new Event('error'));
  }
})();

/* ─── CONTACT FORM ─── */
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

    // Mailto fallback (replace with Formspree/EmailJS for production)
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

/* ─── NOTIFICATION TOAST ─── */
function showNotification(msg, type = 'success') {
  // Remove existing
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${msg}</span>
  `;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    background: type === 'success' ? 'rgba(79,255,176,0.12)' : 'rgba(255,107,53,0.12)',
    border: `1px solid ${type === 'success' ? 'rgba(79,255,176,0.35)' : 'rgba(255,107,53,0.35)'}`,
    color: type === 'success' ? '#4fffb0' : '#ff6b35',
    padding: '0.85rem 1.25rem',
    borderRadius: '10px',
    fontSize: '0.88rem',
    fontWeight: '600',
    zIndex: '9999',
    backdropFilter: 'blur(12px)',
    animation: 'toastIn 0.4s ease forwards',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  });
  document.body.appendChild(toast);

  // Inject keyframes once
  if (!document.getElementById('toastKF')) {
    const style = document.createElement('style');
    style.id = 'toastKF';
    style.textContent = `
      @keyframes toastIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
      @keyframes toastOut { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(12px); } }
      .nav-link.active { color: var(--accent) !important; }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ─── SMOOTH SCROLL ENHANCEMENT ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── TILT EFFECT ON PROJECT CARDS ─── */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card, .exp-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      const rotX = (-y / rect.height * 8).toFixed(2);
      const rotY = ( x / rect.width  * 8).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── TYPED TAGLINE EFFECT (hero sub text) ─── */
(function initTyped() {
  const words = ['Structural Engineer', 'AI Researcher', 'Computer Vision Developer', 'Civil Engineer', 'Deep Learning Enthusiast'];
  const el    = document.querySelector('.hero-sub strong');
  if (!el) return;

  let wi = 0, ci = 0, deleting = false;
  const baseText = 'COMSATS University Islamabad';

  function type() {
    const word = words[wi];
    if (!deleting) {
      // not typing into hero-sub strong since it has static content
      // Instead do a subtle color cycle
    }
  }
  // Subtle accent color animation on stat numbers
  const statNums = document.querySelectorAll('.stat-num');
  let hue = 190;
  setInterval(() => {
    hue = (hue + 0.3) % 360;
    statNums.forEach(n => n.style.color = `hsl(${hue}, 100%, 65%)`);
  }, 50);
})();

/* ─── SCROLL PROGRESS BAR ─── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position: 'fixed', top: '0', left: '0', height: '3px',
    background: 'linear-gradient(90deg, #00c4ff, #4fffb0)',
    zIndex: '10000', width: '0%', transition: 'width 0.1s',
    pointerEvents: 'none',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ─── YEAR IN FOOTER ─── */
(function initYear() {
  const copyEl = document.querySelector('.footer-copy');
  if (copyEl) {
    copyEl.textContent = copyEl.textContent.replace('2026', new Date().getFullYear().toString() === '2025' ? '2025' : '2026');
  }
})();

/* ─── KEYBOARD NAVIGATION HINT ─── */
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

/* ─── CONSOLE EASTER EGG ─── */
console.log(
  '%c👋 Hey there, fellow developer!',
  'color:#00c4ff; font-family:monospace; font-size:16px; font-weight:bold;'
);
console.log(
  '%cHasnain Haroon | Civil Engineering × AI\nhasnianharoon456@gmail.com',
  'color:#4fffb0; font-family:monospace; font-size:12px;'
);
