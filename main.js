/* =====================================================
   PRAKASAM SUPER SPECIALITY HOSPITAL — main.js
   Premium Interactive Experience
   © 2025 Prakasam Super Speciality Hospital, Ongole
   ===================================================== */

/* ── SCROLL PROGRESS ─────────────────────────────────── */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });

/* ── NAV SCROLL CLASS ────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── HAMBURGER MENU ──────────────────────────────────── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── REVEAL ON SCROLL ────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revObs.observe(el));

/* ── TYPEWRITER TAGLINE ──────────────────────────────── */
const taglineEl = document.getElementById('hero-tagline');
const taglines = [
  '"The <em>Pulse</em> of Healthcare in Ongole"',
  '"Where Compassion Meets <em>Precision</em>"',
  '"Your Health, Our <em>Mission</em>"',
  '"Advanced Care, <em>Human Touch</em>"',
];
let tlIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimer;

function typeWrite() {
  const raw = taglines[tlIndex];
  // Strip HTML for character count
  const plain = raw.replace(/<[^>]+>/g, '');
  const full  = plain;
  const displayed = isDeleting
    ? full.substring(0, charIndex - 1)
    : full.substring(0, charIndex + 1);
  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

  // Rebuild with em tags on "displayed" slice
  let html = '';
  const emMatch = raw.match(/<em>([^<]+)<\/em>/);
  if (emMatch) {
    const before = raw.indexOf('<em>');
    const emText = emMatch[1];
    const afterEM = before + 4 + emText.length + 5; // </em>
    const plainBefore = raw.substring(0, before);
    const plainAfter  = raw.substring(afterEM);
    const total = plainBefore + emText + plainAfter;
    if (charIndex <= plainBefore.length) {
      html = displayed;
    } else if (charIndex <= plainBefore.length + emText.length) {
      html = plainBefore + '<em>' + displayed.substring(plainBefore.length) + '</em>';
    } else {
      html = plainBefore + '<em>' + emText + '</em>' + displayed.substring(plainBefore.length + emText.length);
    }
  } else {
    html = displayed;
  }

  taglineEl.innerHTML = html + '<span class="cursor"></span>';

  let speed = isDeleting ? 40 : 65;
  if (!isDeleting && charIndex === full.length) {
    speed = 2800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    tlIndex = (tlIndex + 1) % taglines.length;
    speed = 500;
  }
  typeTimer = setTimeout(typeWrite, speed);
}
// Start after hero entrance
setTimeout(typeWrite, 900);

/* ── PARTICLE CANVAS ─────────────────────────────────── */
const canvas = document.getElementById('hero-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 1.8 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.alpha     = 0;
      this.targetAlpha = Math.random() * 0.55 + 0.08;
      this.fadeIn    = true;
      this.fadeSpeed = Math.random() * 0.004 + 0.002;
      this.isGold    = Math.random() < 0.25;
      this.twinkle   = Math.random() < 0.15;
      this.twinklePhase = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.twinklePhase += 0.04;
      if (this.fadeIn) {
        this.alpha += this.fadeSpeed;
        if (this.alpha >= this.targetAlpha) { this.alpha = this.targetAlpha; this.fadeIn = false; }
      } else {
        this.alpha -= this.fadeSpeed * 0.4;
        if (this.alpha <= 0) this.init();
      }
      if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10)
        this.init();
    }
    draw() {
      const a = this.twinkle
        ? this.alpha * (0.5 + 0.5 * Math.sin(this.twinklePhase))
        : this.alpha;
      ctx.save();
      ctx.globalAlpha = a;
      if (this.isGold) {
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2);
        grd.addColorStop(0, '#F5E6B8');
        grd.addColorStop(1, 'rgba(201,168,76,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Build particle pool
  const PARTICLE_COUNT = 140;
  const particles = [];
  resizeCanvas();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.alpha = Math.random() * p.targetAlpha; // start scattered
    particles.push(p);
  }

  let raf;
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(animateParticles);
  }

  // Pause when hero not visible (performance)
  const heroSection = document.getElementById('hero');
  const heroObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (!raf) animateParticles();
    } else {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }, { threshold: 0 });
  heroObs.observe(heroSection);
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
  }, { passive: true });
}

/* ── COUNTER ANIMATION ───────────────────────────────── */
function animateCount(el, target, suffix, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    const val = Math.floor(start);
    el.textContent = val + suffix;
    if (start >= target) {
      el.textContent = el.dataset.final || (target + suffix);
      clearInterval(timer);
    }
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
statNums.forEach(el => {
  if (!el.dataset.final) el.dataset.final = el.textContent.trim();
});

const statsSection = document.getElementById('stats');
let statsAnimated = false;
const statsObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statNums.forEach((el, i) => {
      setTimeout(() => {
        animateCount(el, +el.dataset.target, el.dataset.suffix || '');
      }, i * 120);
    });
  }
}, { threshold: 0.3 });
if (statsSection) statsObs.observe(statsSection);

/* ── BACK TO TOP ─────────────────────────────────────── */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── SMOOTH ANCHOR LINKS ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── FORM SUBMISSION ─────────────────────────────────── */
const form = document.getElementById('appointment-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.textContent = '✓ Appointment Request Sent!';
      btn.style.opacity = '1';
      btn.style.background = 'linear-gradient(135deg,#27ae60,#1e8449)';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        form.reset();
      }, 3500);
    }, 1200);
  });
}

/* ── DEPT CARD SPOTLIGHT RIPPLE ──────────────────────── */
document.querySelectorAll('.dept-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  });
});

/* ── NAV ACTIVE LINK HIGHLIGHT ───────────────────────── */
const sections = document.querySelectorAll('section[id], div[id="ticker"]');
const navLinks = document.querySelectorAll('.nav-links a');
const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + id
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => activeObs.observe(s));

/* ── GALLERY CARD PARALLAX MICRO ────────────────────── */
document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const xPct = (e.clientX - r.left) / r.width  - 0.5;
    const yPct = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-4px) perspective(600px) rotateX(${-yPct * 4}deg) rotateY(${xPct * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── ANIMATED STAT COUNTER ODOMETER EFFECT ───────────── */
// Numbers count up with a rolling-digit "slot machine" feel
const statItems = document.querySelectorAll('.stat-item');
statItems.forEach((item, i) => {
  item.style.animationDelay = i * 0.1 + 's';
});
