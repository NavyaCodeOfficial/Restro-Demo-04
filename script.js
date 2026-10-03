/* ══════════════════════════════════════════
   MOONLIGHT ROOFTOP CAFE — SCRIPT.JS
   Particles · Parallax · Cursor · Tilt · Reveal · Counter
══════════════════════════════════════════ */

'use strict';

/* ── Utility ── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ═══════════════════════════
   1. CUSTOM CURSOR
═══════════════════════════ */
(function initCursor() {
  const cursor    = $('cursor');
  const cursorDot = $('cursor-dot');
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth cursor ring follows with lag
  function animateCursor() {
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    cursor.style.left = dotX + 'px';
    cursor.style.top  = dotY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor expand on interactive elements
  const interactives = 'a, button, .glass-card, .gallery-item, .social-icon';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      cursor.style.width  = '60px';
      cursor.style.height = '60px';
      cursor.style.borderColor = 'rgba(232, 201, 122, 0.6)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      cursor.style.width  = '36px';
      cursor.style.height = '36px';
      cursor.style.borderColor = 'rgba(200, 214, 232, 0.5)';
    }
  });
})();

/* ═══════════════════════════
   2. PARTICLE CANVAS
═══════════════════════════ */
(function initParticles() {
  const canvas = $('particles-canvas');
  const ctx    = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 120;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.r    = Math.random() * 1.5 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.25;
      this.vy   = -(Math.random() * 0.5 + 0.15);
      this.life = 0;
      this.maxLife = 300 + Math.random() * 400;
      this.color = Math.random() > 0.7
        ? `rgba(232,201,122,`
        : `rgba(180,210,255,`;
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const alpha = Math.sin(progress * Math.PI) * 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
})();

/* ═══════════════════════════
   3. STAR FIELD
═══════════════════════════ */
(function initStars() {
  const container = $('starField');
  if (!container) return;

  for (let i = 0; i < 160; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2.5 + 0.5;
    Object.assign(star.style, {
      position: 'absolute',
      left: Math.random() * 100 + '%',
      top:  Math.random() * 100 + '%',
      width:  size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: Math.random() > 0.8 ? '#e8c97a' : '#c8d6e8',
      opacity: Math.random() * 0.7 + 0.15,
      animation: `twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`,
    });
    container.appendChild(star);
  }

  // Inject twinkle animation
  if (!document.getElementById('star-style')) {
    const style = document.createElement('style');
    style.id = 'star-style';
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: var(--base-op, 0.3); transform: scale(1); }
        50% { opacity: 1; transform: scale(1.6); }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ═══════════════════════════
   4. NAVBAR SCROLL EFFECT
═══════════════════════════ */
(function initNavbar() {
  const nav = $('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ═══════════════════════════
   5. MOBILE MENU
═══════════════════════════ */
function toggleMenu() {
  const links     = $('navLinks');
  const hamburger = $('hamburger');
  links.classList.toggle('open');
  hamburger.classList.toggle('active');
}
// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    $('navLinks').classList.remove('open');
    $('hamburger').classList.remove('active');
  });
});

/* ═══════════════════════════
   6. SCROLL REVEAL (Intersection Observer)
═══════════════════════════ */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
})();

/* ═══════════════════════════
   7. PARALLAX SCROLLING
═══════════════════════════ */
(function initParallax() {
  const heroContent = document.querySelector('[data-parallax]');
  const moonCircle  = document.querySelector('.moon-circle');
  const moonGlow    = document.querySelector('.moon-glow');

  function onScroll() {
    const scrollY = window.scrollY;

    if (heroContent) {
      const factor = parseFloat(heroContent.dataset.parallax) || 0.4;
      heroContent.style.transform = `translateY(${scrollY * factor}px)`;
      heroContent.style.opacity   = 1 - scrollY / 600;
    }
    if (moonCircle) {
      moonCircle.style.transform = `translateX(-50%) translateY(${scrollY * 0.25}px)`;
    }
    if (moonGlow) {
      moonGlow.style.transform = `translateX(-50%) translateY(${scrollY * 0.2}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ═══════════════════════════
   8. 3D CARD TILT EFFECT
═══════════════════════════ */
(function initTilt() {
  const MAX_TILT = 10; // degrees

  function handleMove(e, card) {
    const rect   = card.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rotateY =  ((clientX - centerX) / (rect.width  / 2)) * MAX_TILT;
    const rotateX = -((clientY - centerY) / (rect.height / 2)) * MAX_TILT;

    card.style.transform    = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    card.style.transition   = 'transform 0.1s ease-out';
  }

  function handleLeave(card) {
    card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }

  $$('.tilt-card').forEach(card => {
    card.addEventListener('mousemove',  e => handleMove(e, card));
    card.addEventListener('mouseleave', () => handleLeave(card));
  });
})();

/* ═══════════════════════════
   9. NUMBER COUNTER ANIMATION
═══════════════════════════ */
(function initCounters() {
  const counters = $$('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur    = 1800;
      const step   = 16;
      const steps  = dur / step;
      let current  = 0;

      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════
   10. SMOOTH SCROLL FOR ANCHORS
═══════════════════════════ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ═══════════════════════════
   11. MOON GLOW MOUSE PARALLAX
═══════════════════════════ */
(function initMouseGlow() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  hero.addEventListener('mousemove', e => {
    const rect    = hero.getBoundingClientRect();
    const relX    = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const relY    = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    const moonGlow = hero.querySelector('.moon-glow');
    if (moonGlow) {
      moonGlow.style.transform = `translateX(calc(-50% + ${relX * 18}px)) translateY(${relY * 12}px)`;
      moonGlow.style.transition = 'transform 0.5s ease-out';
    }
  });
})();

/* ═══════════════════════════
   12. GALLERY ITEM STAGGER
═══════════════════════════ */
(function initGalleryStagger() {
  const items = $$('.gallery-item.reveal');
  items.forEach((item, i) => {
    item.style.transitionDelay = (i * 0.08) + 's';
  });
})();

/* ═══════════════════════════
   13. SECTION ENTRANCE COLOR SHIFT
═══════════════════════════ */
(function initSectionColor() {
  const sections = $$('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.body.dataset.section = entry.target.id;
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
})();

/* ═══════════════════════════
   14. MENU CARD SEQUENTIAL REVEAL
═══════════════════════════ */
(function menuReveal() {
  const menuCards = $$('.menu-card.reveal');
  menuCards.forEach((card, i) => {
    card.style.transitionDelay = (i * 0.12) + 's';
  });
})();

/* ═══════════════════════════
   15. EXPERIENCE CARD STAGGER
═══════════════════════════ */
(function expReveal() {
  const expCards = $$('.exp-card.reveal');
  expCards.forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
  });
})();

/* ═══════════════════════════
   16. REVIEW CARD STAGGER
═══════════════════════════ */
(function reviewReveal() {
  const cards = $$('.review-card.reveal');
  cards.forEach((card, i) => {
    card.style.transitionDelay = (i * 0.12) + 's';
  });
})();

/* ═══════════════════════════
   17. SCROLL PROGRESS BAR
═══════════════════════════ */
(function initProgressBar() {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0', left: '0',
    height: '2px',
    width: '0%',
    background: 'linear-gradient(90deg, #e8c97a, #c8d6e8)',
    zIndex: '10000',
    transition: 'width 0.1s linear',
    boxShadow: '0 0 8px rgba(232,201,122,0.6)',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = progress + '%';
  }, { passive: true });
})();

/* ═══════════════════════════
   18. BUTTON RIPPLE EFFECT
═══════════════════════════ */
(function initRipple() {
  $$('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      Object.assign(ripple.style, {
        position: 'absolute',
        width:  size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)',
        left: (e.clientX - rect.left - size / 2) + 'px',
        top:  (e.clientY - rect.top  - size / 2) + 'px',
        transform: 'scale(0)',
        animation: 'rippleAnim 0.6s ease-out forwards',
        pointerEvents: 'none',
      });
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `@keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }`;
    document.head.appendChild(style);
  }
})();

/* ═══════════════════════════
   19. ABOUT SECTION FLOATING DECO
═══════════════════════════ */
(function initFloatingDeco() {
  const about = document.getElementById('about');
  if (!about) return;

  const decos = ['✦', '✧', '○', '·'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('span');
    el.textContent = decos[i % decos.length];
    Object.assign(el.style, {
      position: 'absolute',
      left: (10 + Math.random() * 80) + '%',
      top:  (5  + Math.random() * 90) + '%',
      color: Math.random() > 0.5 ? 'rgba(232,201,122,0.12)' : 'rgba(200,214,232,0.1)',
      fontSize: (0.8 + Math.random() * 1.5) + 'rem',
      pointerEvents: 'none',
      animation: `decoFloat ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite alternate`,
    });
    about.style.position = 'relative';
    about.appendChild(el);
  }

  if (!document.getElementById('deco-style')) {
    const style = document.createElement('style');
    style.id = 'deco-style';
    style.textContent = `
      @keyframes decoFloat {
        from { transform: translateY(0) rotate(0deg); opacity: 0.5; }
        to   { transform: translateY(-20px) rotate(15deg); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ═══════════════════════════
   20. INIT LOG
═══════════════════════════ */
console.log('%c☽ Moonlight Rooftop Cafe ', 'color:#e8c97a;font-size:16px;font-weight:bold;');
console.log('%cWebsite loaded. Dine under the moonlight.', 'color:#8a9bb8;font-size:12px;');
