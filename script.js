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

function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    if (offCanvasMenu.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
}

/* CLICK — ALWAYS */
menuToggle.addEventListener('click', toggleMenu);

/* HOVER — DESKTOP ONLY */
function handleHover() {
    if (window.innerWidth >= 1024) {
        menuToggle.addEventListener('mouseenter', openMenu);
        offCanvasMenu.addEventListener('mouseleave', closeMenu);
    } else {
        menuToggle.removeEventListener('mouseenter', openMenu);
        offCanvasMenu.removeEventListener('mouseleave', closeMenu);
    }
}

handleHover();
window.addEventListener('resize', handleHover);

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
    const dynamicTerms = [
        "MOTION",
        "HUMAN DRIVEN NARRATIVE",
        "NOT BORING",
        "EMOTIONAL DEPTH",
        "REAL STORYTELLING",
        "CINEMATIC IDENTITY",
        "PERFORMANCE",
        "PURPOSE REFLECTED IN ACTION"
    ];

    const dynamicTermElement = document.getElementById('dynamic-term');
    const dynamicWrapper = document.querySelector('.dynamic-text-wrapper');
    let index = 0;

    function setWrapperWidth() {
        if (!dynamicWrapper || !dynamicTermElement) return;

        if (supportsTrueHover) {
            let max = 0;
            const original = dynamicTermElement.textContent;

            dynamicTerms.forEach(term => {
                dynamicTermElement.textContent = term;
                max = Math.max(max, dynamicTermElement.offsetWidth);
            });

            dynamicTermElement.textContent = original;
            dynamicWrapper.style.width = max + 'px';
        } else {
            dynamicWrapper.style.width = 'auto';
        }
    }

    function animateDynamicText() {
        dynamicTermElement.style.opacity = '0';
        setTimeout(() => {
            dynamicTermElement.textContent = dynamicTerms[index];
            index = (index + 1) % dynamicTerms.length;
            dynamicTermElement.style.opacity = '1';
        }, 300);
    }

    if (dynamicTermElement && dynamicWrapper) {
        setWrapperWidth();
        animateDynamicText();
        setInterval(animateDynamicText, 1500);
        window.addEventListener('resize', setWrapperWidth);
    }

});


 const dynamicTerms = [
        "MOTION",
        "HUMAN DRIVEN NARRATIVE",
        "NOT BORING",
        "EMOTIONAL DEPTH",
        "REAL STORYTELLING",
        "CINEMATIC IDENTITY",
        "PERFORMANCE",
        "PURPOSE REFLECTED IN ACTION"
    ];

    const dynamicTermElement = document.getElementById('dynamic-term');
    const dynamicWrapper = document.querySelector('.dynamic-text-wrapper');
    let currentIndex = 0;
    
    // Helper to measure the width of the longest word
    function getLongestWidth(terms, termElement) {
        let maxWidth = 0;
        const originalText = termElement.textContent;
        const originalWidth = termElement.offsetWidth;
        
        // Temporarily apply each term and measure its width
        terms.forEach(term => {
            termElement.textContent = term;
            maxWidth = Math.max(maxWidth, Math.ceil(termElement.offsetWidth));
        });

        // Restore the original or current text content
        termElement.textContent = originalText;
        return Math.max(maxWidth, originalWidth);
    }

    // Set the initial width of the wrapper to the longest word to prevent reflow on every change
    function setInitialWrapperWidth() {
        if (!dynamicTermElement || !dynamicWrapper) return;
        const longestWidth = getLongestWidth(dynamicTerms, dynamicTermElement);
        // Only fix width on desktop (where display: flex is active)
        if (window.matchMedia("(min-width: 769px)").matches) {
             dynamicWrapper.style.width = `${longestWidth}px`;
        } else {
             dynamicWrapper.style.width = `auto`; // Allow natural flow on mobile
        }
        
        dynamicTermElement.style.textAlign = 'center';
    }

    // Main animation function
    function animateDynamicText() {
        if (!dynamicTermElement || !dynamicWrapper) return;

        // 1. Fade out 
        dynamicTermElement.style.opacity = '0';

        setTimeout(() => {
            // 2. Change the text to the next term
            const newTerm = dynamicTerms[currentIndex];
            dynamicTermElement.textContent = newTerm;
            
            currentIndex = (currentIndex + 1) % dynamicTerms.length;

            // 3. Fade back in
            dynamicTermElement.style.opacity = '1';

        }, 300); // Wait for fade out duration (0.3s defined in CSS transition)
    }

    // Initialize the fixed width and start the loop
    if (dynamicTermElement && dynamicWrapper) {
        setInitialWrapperWidth();
        // Start the animation immediately and then every 1.5 seconds 
        animateDynamicText(); 
        setInterval(animateDynamicText, 1500); 
        
        // Ensure width is recalculated if the screen size crosses the mobile/desktop threshold
        window.addEventListener('resize', setInitialWrapperWidth);
    }

