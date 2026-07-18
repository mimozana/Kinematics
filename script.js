// Shuffle-bag picker: shows every word once (in random order) before any
// word repeats, instead of naive random-exclude-previous — which, with a
// short list, visibly repeats far more often than it looks like it should.
function makeShuffleBag(list) {
    let queue = [];
    function reshuffle(avoidFirst) {
        queue = list.slice();
        for (let i = queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }
        if (avoidFirst !== undefined && queue.length > 1 && queue[0] === avoidFirst) {
            [queue[0], queue[1]] = [queue[1], queue[0]];
        }
    }
    let last;
    return function next() {
        if (queue.length === 0) reshuffle(last);
        last = queue.shift();
        return last;
    };
}

// Shrinks the "[word]" unit to fit within the viewport (minus breathing
// room) instead of letting a long word wrap the brackets onto their own
// lines or overflow off-screen. Resets to full size first so it can grow
// back when a shorter word comes around.
function fitDynamicTerm(wrapperEl) {
    if (!wrapperEl) return;
    wrapperEl.style.transform = 'none';
    const available = document.documentElement.clientWidth - 56; // wider safety margin
    const actual = wrapperEl.getBoundingClientRect().width;
    if (actual > available && actual > 0) {
        wrapperEl.style.transform = 'scale(' + (available / actual) + ')';
    }
}

// A word can get measured against a fallback font (fitDynamicTerm runs
// before the custom Georgian/English display font has finished loading),
// then the real font swaps in wider with nothing re-checking it — a real
// source of the "cropped word" reports. Re-fit every visible term once
// fonts are confirmed ready, and again whenever the font set changes.
function refitAllDynamicTerms() {
    document.querySelectorAll('.dynamic-text-wrapper').forEach(fitDynamicTerm);
}
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refitAllDynamicTerms);
    document.fonts.addEventListener('loadingdone', refitAllDynamicTerms);
}

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================================
    // 1. AOS
    // ==========================================================
    AOS.init({
        duration: 800,
        once: true
    });

    // ==========================================================
    // 2. HERO SCROLL STRETCH
    // ==========================================================
    const unskippableText = document.querySelector('.main-text');
    const BASE_MAX_STRETCH_FACTOR = 1.8;
    const MOBILE_MAX_STRETCH_FACTOR = 3.5;
    const MAX_SCROLL_DISTANCE = 600;
    let originalTextHeight = 0;

    function calculateOriginalTextHeight() {
        if (!unskippableText) return;
        const prev = unskippableText.style.transform;
        unskippableText.style.transform = 'scaleY(1)';
        originalTextHeight = unskippableText.offsetHeight;
        unskippableText.style.transform = prev;
    }

    function handleScrollAnimations() {
        if (!unskippableText || !originalTextHeight) return;

        const maxStretch =
            window.matchMedia('(max-width: 440px)').matches
                ? MOBILE_MAX_STRETCH_FACTOR
                : BASE_MAX_STRETCH_FACTOR;

        const progress = Math.min(window.scrollY / MAX_SCROLL_DISTANCE, 1);
        unskippableText.style.transform =
            `scaleY(${1 + progress * (maxStretch - 1)})`;
    }

    if (unskippableText) {
        window.addEventListener('load', calculateOriginalTextHeight);
        window.addEventListener('resize', calculateOriginalTextHeight);
        window.addEventListener('scroll', handleScrollAnimations, { passive: true });
    }

// ===============================
// OFF-CANVAS MENU (STABLE)
// ===============================
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

/* HOVER — any device that actually supports hover (ignores screen width) */
const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    // Hover-capable pointers: mouseenter already opened it just before this
    // click fires. Closing here would immediately undo the hover-open, so
    // a click only opens; mouseleave on the panel handles closing.
    if (hoverQuery.matches) {
        openMenu();
        return;
    }

    if (offCanvasMenu.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
}

/* CLICK — ALWAYS */
menuToggle.addEventListener('click', toggleMenu);

menuToggle.addEventListener('mouseenter', () => { if (hoverQuery.matches) openMenu(); });
offCanvasMenu.addEventListener('mouseleave', () => { if (hoverQuery.matches) closeMenu(); });

/* CLOSE CONDITIONS */
menuLinks.forEach(link => link.addEventListener('click', closeMenu));
dimmer.addEventListener('click', closeMenu);


    // ==========================================================
    // 4. HEADER SCROLL HIDE
    // ==========================================================
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', function () {
        const current = window.pageYOffset || document.documentElement.scrollTop;

        if (current <= 0) {
            header.classList.remove('scroll-hide');
            lastScrollTop = 0;
            return;
        }

        if (body.classList.contains('menu-open')) return;

        if (current > lastScrollTop && current > 50) {
            header.classList.add('scroll-hide');
        } else {
            header.classList.remove('scroll-hide');
        }

        lastScrollTop = current;
    }, { passive: true });

    // ==========================================================
    // 5. DYNAMIC CONTACT TEXT
    // ==========================================================
    // supportsTrueHover was referenced below but never declared, which
    // threw and silently killed everything after it in this callback.
    const supportsTrueHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const dynamicTerms = [
        "ONLYNESS",
        "DESIGN",
        "POSITIONING",
        "STORYTELLING",
        "CONSISTENCY",
        "IDENTITY",
        "EMOTIONAL\nMARKETING",
        "STRATEGY",
        "ALIGNMENT",
        "PROMISE",
        "TRUST",
        "CHARACTER",
        "AUTHENTICITY",
        "PURPOSE",
        "REPUTATION"
    ];

    const dynamicTermElement = document.getElementById('dynamic-term');
    const dynamicWrapper = document.querySelector('.dynamic-text-wrapper');
    const nextTerm = makeShuffleBag(dynamicTerms);

    function setWrapperWidth() {
        // Measuring a fixed width here is unreliable: whichever language
        // isn't currently active is display:none, so offsetWidth reads 0
        // and permanently locks the wrapper to 0px (clipped, invisible).
        // Auto width is simpler and safe regardless of which language
        // is hidden at measurement time.
        if (!dynamicWrapper) return;
        dynamicWrapper.style.width = 'auto';
    }

    function animateDynamicText() {
        dynamicTermElement.style.opacity = '0';
        setTimeout(() => {
            dynamicTermElement.textContent = '[ ' + nextTerm() + ' ]';
            dynamicTermElement.style.opacity = '1';
        }, 300);
    }

    // Guard: an older duplicate block further down wires up this same
    // element first (it runs immediately, before DOMContentLoaded fires).
    // Skip here if it already claimed it, so the two loops don't fight.
    if (dynamicTermElement && dynamicWrapper && !dynamicTermElement.dataset.wired) {
        setWrapperWidth();
        animateDynamicText();
        setInterval(animateDynamicText, 1500);
        window.addEventListener('resize', setWrapperWidth);
    }

    // ==========================================================
    // 5b. DYNAMIC CONTACT TEXT — Georgian variant (no "READY FOR" / "?")
    // ==========================================================
    const dynamicTermsGeo = [
        "ერთადერთობა",
        "დიზაინი",
        "პოზიციონირება",
        "თანმიმდევრულობა",
        "იდენტობა",
        "ემოციური\nმარკეტინგი",
        "სტრატეგია",
        "თანხვედრა",
        "პირობა",
        "ნდობა",
        "ხასიათი",
        "გულწრფელობა",
        "მიზანი",
        "რეპუტაცია"
    ];

    const dynamicTermGeoElement = document.getElementById('dynamic-term-geo');
    const dynamicWrapperGeo = document.querySelector('.geo-dynamic-wrapper');
    const nextTermGeo = makeShuffleBag(dynamicTermsGeo);

    function setWrapperWidthGeo() {
        // Same fixed-width-while-hidden trap as the English wrapper above.
        if (!dynamicWrapperGeo) return;
        dynamicWrapperGeo.style.width = 'auto';
    }

    function animateDynamicTextGeo() {
        dynamicTermGeoElement.style.opacity = '0';
        setTimeout(() => {
            dynamicTermGeoElement.textContent = '[ ' + nextTermGeo() + ' ]';
            fitDynamicTerm(dynamicWrapperGeo);
            dynamicTermGeoElement.style.opacity = '1';
        }, 300);
    }

    if (dynamicTermGeoElement && dynamicWrapperGeo) {
        setWrapperWidthGeo();
        animateDynamicTextGeo();
        setInterval(animateDynamicTextGeo, 1500);
        window.addEventListener('resize', () => {
            setWrapperWidthGeo();
            fitDynamicTerm(dynamicWrapperGeo);
        });
    }

});


 const dynamicTerms = [
        "ONLYNESS",
        "DESIGN",
        "POSITIONING",
        "STORYTELLING",
        "CONSISTENCY",
        "IDENTITY",
        "EMOTIONAL\nMARKETING",
        "STRATEGY",
        "ALIGNMENT",
        "PROMISE",
        "TRUST",
        "CHARACTER",
        "AUTHENTICITY",
        "PURPOSE",
        "REPUTATION"
    ];

    const dynamicTermElement = document.getElementById('dynamic-term');
    const dynamicWrapper = document.querySelector('.dynamic-text-wrapper');
    const nextTermTop = makeShuffleBag(dynamicTerms);

    // Set the initial width of the wrapper to the longest word to prevent reflow on every change
    function setInitialWrapperWidth() {
        // Fixed-width measurement is unreliable here: this element is
        // display:none whenever Georgian is the active language, so
        // offsetWidth reads 0 and permanently locks the wrapper at 0px
        // (invisible). Auto width avoids that trap entirely.
        if (!dynamicTermElement || !dynamicWrapper) return;
        dynamicWrapper.style.width = 'auto';
        dynamicTermElement.style.textAlign = 'center';
    }

    // Main animation function
    function animateDynamicText() {
        if (!dynamicTermElement || !dynamicWrapper) return;

        // 1. Fade out
        dynamicTermElement.style.opacity = '0';

        setTimeout(() => {
            // 2. Change the text to the next term from the shuffle bag —
            // every word is shown once before any repeat.
            dynamicTermElement.textContent = '[ ' + nextTermTop() + ' ]';
            fitDynamicTerm(dynamicWrapper);

            // 3. Fade back in
            dynamicTermElement.style.opacity = '1';

        }, 300); // Wait for fade out duration (0.3s defined in CSS transition)
    }

    // Initialize the fixed width and start the loop
    if (dynamicTermElement && dynamicWrapper) {
        dynamicTermElement.dataset.wired = '1'; // claim this element before the later duplicate block runs
        setInitialWrapperWidth();
        // Start the animation immediately and then every 1.5 seconds
        animateDynamicText();
        setInterval(animateDynamicText, 1500);

        // Ensure width is recalculated if the screen size crosses the mobile/desktop threshold
        window.addEventListener('resize', () => {
            setInitialWrapperWidth();
            fitDynamicTerm(dynamicWrapper);
        });
    }


// ============================================================
// LANGUAGE TOGGLE — GEO default, ENG on click
// Mirrors the quiz.html pattern but for the main site
// ============================================================
(function () {
    const toggle   = document.getElementById('lang-toggle');
    if (!toggle) return;

    const bracketL = toggle.querySelector('.lang-bracket-l');
    const bracketR = toggle.querySelector('.lang-bracket-r');
    const btns     = toggle.querySelectorAll('.lang-btn');
    const body     = document.body;

    // ── Position the animated bracket over the active button ──
    function moveBracket() {
        const active   = toggle.querySelector('.lang-btn.active');
        if (!active || !bracketL || !bracketR) return;

        const toggleRect = toggle.getBoundingClientRect();
        const btnRect    = active.getBoundingClientRect();

        // Left bracket: just before the active button text
        const lLeft = btnRect.left - toggleRect.left - 2;
        bracketL.style.left      = lLeft + 'px';
        bracketL.style.transform = 'translate(0, -50%)';

        // Right bracket: just after the active button text
        const rLeft = btnRect.right - toggleRect.left - 10;
        bracketR.style.left      = rLeft + 'px';
        bracketR.style.transform = 'translate(0, -50%)';
    }

    // ── Apply language to every [data-ge] / [data-en] element ──
    function applyLang(lang) {
        body.setAttribute('data-lang', lang);
        document.documentElement.lang = lang === 'ge' ? 'ka' : 'en';

        // Translate nav links and any other labelled elements
        document.querySelectorAll('[data-ge]').forEach(el => {
            const val = el.getAttribute('data-' + lang);
            if (val !== null) el.textContent = val;
        });

        // Persist across page loads
        try { localStorage.setItem('km-lang', lang); } catch(e) {}
    }

    // ── Wire up buttons ──
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang === body.getAttribute('data-lang')) return;

            btns.forEach(b => b.classList.toggle('active', b === btn));
            applyLang(lang);

            // Tiny delay lets the DOM paint before measuring bracket
            requestAnimationFrame(moveBracket);
        });
    });

    // ── Init: restore saved preference, default to GEO ──
    let saved = 'ge';
    try { saved = localStorage.getItem('km-lang') || 'ge'; } catch(e) {}

    const initBtn = toggle.querySelector(`.lang-btn[data-lang="${saved}"]`);
    if (initBtn) {
        btns.forEach(b => b.classList.toggle('active', b === initBtn));
        applyLang(saved);
    }

    // Position bracket after fonts/layout settle
    window.addEventListener('load', moveBracket);
    window.addEventListener('resize', moveBracket);
}());

// ============================================================
// AGAINST POLISHED ADS — bar tilt + click expand
// ============================================================
(function () {
    const bar     = document.getElementById('apa-bar');
    const panel   = document.getElementById('apa-panel');
    const section = document.getElementById('philosophy');
    if (!bar || !panel || !section) return;

    function panelIsAbsolute() {
        return window.getComputedStyle(panel).position === 'absolute';
    }

    function openPanel() {
        bar.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        // Desktop: panel floats over content, so push the section open
        if (panelIsAbsolute()) {
            section.style.paddingBottom = (panel.scrollHeight + 40) + 'px';
        }
    }

    function closePanel() {
        bar.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        panel.style.maxHeight = '0px';
        section.style.paddingBottom = '';
    }

    bar.addEventListener('click', function (e) {
        e.stopPropagation();
        if (bar.getAttribute('aria-expanded') === 'true') {
            closePanel();
        } else {
            openPanel();
        }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        const wrap = document.getElementById('apa-rect-wrap');
        if (wrap && !wrap.contains(e.target)) closePanel();
    });

    // Keep sizes correct if the window is resized while open
    window.addEventListener('resize', function () {
        if (bar.getAttribute('aria-expanded') === 'true') {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            if (panelIsAbsolute()) {
                section.style.paddingBottom = (panel.scrollHeight + 40) + 'px';
            } else {
                section.style.paddingBottom = '';
            }
        }
    });
}());

// ============================================================
// SERVICES DOSSIER — flag click pulls the paper out
// ============================================================
(function () {
    const stack = document.querySelector('.paper-demo-section .papers-stack');
    if (!stack) return;
    const papers = stack.querySelectorAll('.brand-paper');
    if (!papers.length) return;

    // freeze the element at its current mid-animation pose so the
    // fallback transition can tween smoothly from there (no snap)
    function freezePose(paper) {
        const cs = getComputedStyle(paper);
        const t = cs.transform, f = cs.filter;
        return function release() {
            paper.style.transform = t;
            paper.style.filter = f;
            void paper.offsetWidth; // commit the frozen pose
            paper.style.transform = '';
            paper.style.filter = '';
        };
    }

    function close(paper) {
        if (!paper.classList.contains('is-open')) return;

        if (paper.dataset.state === 'open') {
            // fully out — play the slip-back-in choreography
            paper.classList.remove('is-open');
            paper.classList.add('is-closing');
            paper.addEventListener('animationend', function onEnd(e) {
                if (e.animationName !== 'paper-push-in' && e.animationName !== 'paper-push-in-m') return;
                paper.classList.remove('is-closing');
                paper.removeEventListener('animationend', onEnd);
            });
        } else {
            // cancelled mid-pull — glide back from wherever it is
            const release = freezePose(paper);
            paper.classList.remove('is-open');
            release();
        }
        paper.dataset.state = 'closed';
        if (!stack.querySelector('.brand-paper.is-open')) {
            stack.classList.remove('has-open');
        }
    }

    function open(paper) {
        papers.forEach(p => { if (p !== paper) close(p); });

        const wasClosing = paper.classList.contains('is-closing');
        if (wasClosing) {
            // re-grabbed mid-return — skip keyframes, glide out from here
            const release = freezePose(paper);
            paper.classList.remove('is-closing');
            paper.classList.add('no-anim', 'is-open');
            release();
            paper.dataset.state = 'open';
        } else {
            paper.classList.remove('no-anim');
            paper.dataset.state = 'opening';
            paper.classList.add('is-open');
            paper.addEventListener('animationend', function onEnd(e) {
                if (e.animationName !== 'paper-pull-out' && e.animationName !== 'paper-pull-out-m') return;
                if (paper.classList.contains('is-open')) paper.dataset.state = 'open';
                paper.removeEventListener('animationend', onEnd);
            });
        }
        stack.classList.add('has-open');
    }

    papers.forEach(paper => {
        const flag = paper.querySelector('.brand-flag');
        if (!flag) return;

        flag.addEventListener('click', function (e) {
            e.stopPropagation();
            if (paper.classList.contains('is-open')) {
                close(paper);
            } else {
                open(paper);
            }
        });

        // clicking the pulled-out paper slides it back in
        paper.addEventListener('click', function () {
            close(paper);
        });
    });
}());

// ============================================================
// LENS / OPTICS — one-shot reveal on scroll (mobile/touch only;
// desktop uses the hover zone defined purely in CSS)
// ============================================================
(function () {
    const stack = document.querySelector('.lens-stack');
    if (!stack || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stack.classList.add('in-view');
                io.unobserve(stack);
            }
        });
    }, { threshold: 0.45 });

    io.observe(stack);
}());