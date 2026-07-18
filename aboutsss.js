document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS for fade-up animations
    AOS.init({
        duration: 800,
        once: true
    });

    // Off-Canvas Menu Logic
    const menuToggle = document.getElementById('menu-toggle');
    const offCanvasMenu = document.getElementById('off-canvas-menu');
    const menuLinks = document.querySelectorAll('.menu-links a');
    const dimmer = document.getElementById('dimmer-overlay');
    const body = document.body;

    function openMenu() {
        offCanvasMenu.classList.add('open');
        menuToggle.classList.add('open');
        body.classList.add('menu-open');
    }

    function closeMenu() {
        offCanvasMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        body.classList.remove('menu-open');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            offCanvasMenu.classList.contains('open') ? closeMenu() : openMenu();
        });
    }

    menuLinks.forEach(link => link.addEventListener('click', closeMenu));
    if (dimmer) dimmer.addEventListener('click', closeMenu);

    // Header scroll hide logic
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll <= 0) {
            header.classList.remove('scroll-hide');
            lastScrollTop = 0;
            return;
        }

        if (body.classList.contains('menu-open')) return;

        if (currentScroll > lastScrollTop && currentScroll > 50) {
            header.classList.add('scroll-hide');
        } else {
            header.classList.remove('scroll-hide');
        }

        lastScrollTop = currentScroll;
    }, { passive: true });
});





// ==========================================================
    // 3. Off-Canvas Menu Logic (FINAL ISOLATED CLICK)
    // ==========================================================
    const menuToggle = document.getElementById('menu-toggle');
    const offCanvasMenu = document.getElementById('off-canvas-menu');
    const menuLinks = document.querySelectorAll('.menu-links a');
    const dimmer = document.getElementById('dimmer-overlay');
    const body = document.body;

    // Define toggle functions
    function openMenu() {
        if (offCanvasMenu && menuToggle && body) {
            offCanvasMenu.classList.add('open');
            menuToggle.classList.add('open');
            body.classList.add('menu-open');
        }
    }

    function closeMenu() {
        if (offCanvasMenu && menuToggle && body) {
            offCanvasMenu.classList.remove('open');
            menuToggle.classList.remove('open');
            body.classList.remove('menu-open');
        }
    }

    // 1. PRIMARY TOGGLE: The Single Click Handler (Highest Priority)
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            // CRITICAL: Stop all default actions and propagation IMMEDIATELY.
            e.preventDefault(); 
            e.stopPropagation();
            
            // Execute the state change immediately.
            if (offCanvasMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        }, true); // Use Capture phase (true) for ultimate priority
    }


    // 2. CONDITIONAL HOVER: Desktop-Only Behavior (769px+)
    const desktopMedia = window.matchMedia("(min-width: 769px)");

    function attachDesktopHoverListeners(mediaQuery) {
        if (!menuToggle || !offCanvasMenu) return;

        // Ensure listeners are always managed correctly (removed on mobile, added on desktop)
        menuToggle.removeEventListener('mouseenter', openMenu);
        offCanvasMenu.removeEventListener('mouseleave', closeMenu);

        if (mediaQuery.matches) {
            // Add hover events for large screens
            menuToggle.addEventListener('mouseenter', openMenu);
            offCanvasMenu.addEventListener('mouseleave', closeMenu);
        }
    }

    // Initial setup and listener for dynamic screen resizing
    attachDesktopHoverListeners(desktopMedia);
    desktopMedia.addListener(attachDesktopHoverListeners); 


    // 3. Close on Link Click or Dimmer Click
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    if (dimmer) {
        dimmer.addEventListener('click', closeMenu);
    }

    // ============================================================
    // LANGUAGE TOGGLE — GEO default, ENG on click (mirrors index.html)
    // ============================================================
    (function () {
        const toggle = document.getElementById('lang-toggle');
        if (!toggle || toggle.dataset.wired) return;
        toggle.dataset.wired = '1';

        const bracketL = toggle.querySelector('.lang-bracket-l');
        const bracketR = toggle.querySelector('.lang-bracket-r');
        const btns = toggle.querySelectorAll('.lang-btn');

        function moveBracket() {
            const active = toggle.querySelector('.lang-btn.active');
            if (!active || !bracketL || !bracketR) return;

            const toggleRect = toggle.getBoundingClientRect();
            const btnRect = active.getBoundingClientRect();

            const lLeft = btnRect.left - toggleRect.left - 2;
            bracketL.style.left = lLeft + 'px';
            bracketL.style.transform = 'translate(0, -50%)';

            const rLeft = btnRect.right - toggleRect.left - 10;
            bracketR.style.left = rLeft + 'px';
            bracketR.style.transform = 'translate(0, -50%)';
        }

        function applyLang(lang) {
            document.body.setAttribute('data-lang', lang);
            document.documentElement.lang = lang === 'ge' ? 'ka' : 'en';

            document.querySelectorAll('[data-ge]').forEach(el => {
                const val = el.getAttribute('data-' + lang);
                if (val !== null) el.textContent = val;
            });

            try { localStorage.setItem('km-lang', lang); } catch (e) {}
        }

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang === document.body.getAttribute('data-lang')) return;

                btns.forEach(b => b.classList.toggle('active', b === btn));
                applyLang(lang);
                requestAnimationFrame(moveBracket);
            });
        });

        let saved = 'ge';
        try { saved = localStorage.getItem('km-lang') || 'ge'; } catch (e) {}

        const initBtn = toggle.querySelector(`.lang-btn[data-lang="${saved}"]`);
        if (initBtn) {
            btns.forEach(b => b.classList.toggle('active', b === initBtn));
            applyLang(saved);
        }

        window.addEventListener('load', moveBracket);
        window.addEventListener('resize', moveBracket);
    }());
// ============================================================
// CINEMATIC REVEALS — manifesto statements assemble on scroll.
// Reveal-once (unobserve after firing) so statements don't
// re-animate when scrolling back up, which reads as jittery.
// ============================================================
(function () {
    const revealEls = document.querySelectorAll('.manifesto .mf-block, .manifesto .mf-services');
    if (!revealEls.length) return;

    // No IntersectionObserver (old browsers): show everything immediately
    // rather than leaving the copy stuck at opacity 0.
    if (!('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('in-view'));
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => io.observe(el));
}());

// ============================================================
// SMOOTH SCROLL (Lenis) + DOCK MAGNIFY
// Lenis normalizes wheel/touch input into one eased, longer-travel
// glide (same approach as lenis.dev) — it drives its own rAF loop
// and calls window.scrollTo under the hood, so getBoundingClientRect
// stays accurate for anything reading scroll position off it.
// The dock-magnify (whichever statement sits nearest the viewport
// center swells slightly, others relax) piggybacks on Lenis's own
// ticker instead of running a second independent rAF loop.
// ============================================================
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const magnifyEls = document.querySelectorAll('.manifesto .mf-block, .manifesto .mf-services');
    const MAX = 1.07;   // scale at dead center
    const MIN = 0.94;   // scale when far from center
    const state = [...magnifyEls].map(el => ({ el, cur: 1 }));

    function applyMagnify() {
        if (!state.length || document.hidden) return;
        const vh = window.innerHeight;
        const center = vh / 2;
        state.forEach(s => {
            const r = s.el.getBoundingClientRect();
            const c = r.top + r.height / 2;
            const d = Math.min(Math.abs(c - center) / (vh * 0.85), 1);
            const t = (Math.cos(d * Math.PI) + 1) / 2; // 1 at center → 0 far
            const target = reduceMotion ? 1 : MIN + (MAX - MIN) * t;
            s.cur += (target - s.cur) * 0.12;
            s.el.style.transform = 'scale(' + s.cur.toFixed(4) + ')';
        });
    }

    if (reduceMotion || typeof Lenis === 'undefined') {
        // No smooth-scroll library (or user prefers reduced motion):
        // fall back to native scrolling, magnify still tracks it.
        if (!reduceMotion) {
            function fallbackFrame() { applyMagnify(); requestAnimationFrame(fallbackFrame); }
            requestAnimationFrame(fallbackFrame);
        }
        return;
    }

    const lenis = new Lenis({
        duration: 0.85,          // quicker settle than before, still eased (not instant)
        easing: (t) => 1 - Math.pow(1 - t, 3),
        wheelMultiplier: 1.35,
        touchMultiplier: 1.5,    // mobile/touch gets the same glide, per the request
        smoothWheel: true,
        syncTouch: true,
    });

    lenis.on('scroll', applyMagnify);

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}());
