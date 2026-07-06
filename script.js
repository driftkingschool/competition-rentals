/* ==========================================================
   DRIFT KING SCHOOL — COMPETITION RENTALS
   Mobile menu, particles, scroll effects, language toggle
   ========================================================== */

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
}

function closeMobile() {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== HERO PARTICLES =====
const heroParticles = document.getElementById('heroParticles');
if (heroParticles) {
    const particleCount = 24;
    for (let i = 0; i < particleCount; i++) {
        const span = document.createElement('span');
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDuration = (5 + Math.random() * 6) + 's';
        span.style.animationDelay = (Math.random() * 8) + 's';
        const size = 2 + Math.random() * 3;
        span.style.width = size + 'px';
        span.style.height = size + 'px';
        heroParticles.appendChild(span);
    }
}

// ===== STAT COUNTER ANIMATION =====
const statNums = document.querySelectorAll('.stat-num[data-count]');
const animateCounter = (el, target) => {
    const duration = 1800;
    const startTime = performance.now();
    const startValue = 0;

    const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (target - startValue) * eased);
        el.textContent = current.toLocaleString('en-US');
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('en-US');
    };
    requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count, 10);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

statNums.forEach(el => counterObserver.observe(el));

// ===== REVEAL ON SCROLL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// ===== LANGUAGE SWITCHING (HE default, EN optional) =====
const SUPPORTED_LANGS = ['he', 'en'];
const RTL_LANGS = ['he'];
const STORAGE_KEY = 'dks-competition-lang';

function getStoredLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGS.includes(stored) ? stored : 'he';
}

function applyLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = 'he';

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('dir', RTL_LANGS.includes(lang) ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-' + lang + ']').forEach(el => {
        const value = el.getAttribute('data-' + lang);
        if (value !== null) {
            if (el.children.length === 0) {
                el.textContent = value;
            } else {
                el.innerHTML = value;
            }
        }
    });

    document.querySelectorAll('title[data-' + lang + ']').forEach(el => {
        el.textContent = el.getAttribute('data-' + lang);
    });

    localStorage.setItem(STORAGE_KEY, lang);
    updateLangButtons(lang);
}

function updateLangButtons(lang) {
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.textContent = lang === 'he' ? 'EN' : 'עברית';
    });
}

document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-lang') || 'he';
        applyLanguage(current === 'he' ? 'en' : 'he');
        closeMobile();
    });
});

const initialLang = getStoredLang();
applyLanguage(initialLang);

// Expose for debugging / manual toggle
window.applyLanguage = applyLanguage;
window.closeMobile = closeMobile;
