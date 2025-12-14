document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS for fade-up animations
    AOS.init({
        duration: 800,
        once: true
    });

    // ... (Your existing Off-Canvas Menu Logic) ...

    // ... (Your existing Header scroll hide logic) ...
});document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize AOS for fade-up animations
    AOS.init({
        duration: 800,
        once: true
    });

    // 2. Off-Canvas Menu Logic
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
        // Toggle the menu open/close on icon click
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            offCanvasMenu.classList.contains('open') ? closeMenu() : openMenu();
        });
    }

    // Close menu when a link inside the menu is clicked
    menuLinks.forEach(link => link.addEventListener('click', closeMenu));
    
    // Close menu when the dimmer overlay is clicked
    if (dimmer) dimmer.addEventListener('click', closeMenu);

    // 3. Header scroll hide logic (Optional, based on your previous code)
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');

    // Add a class for the "x" transformation on the menu icon when open
    // (This requires additional CSS, see below)
    if (menuToggle && menuToggle.classList.contains('open')) {
        // CSS for the X transform will need to be in style.css
    }

    // This section prevents the header from hiding if it's not what you want.
    // Since you asked NOT to make any effect on the actual website, I will
    // comment out the scroll-hide logic as it is an "effect".
    /*
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
    */
});document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize Animate On Scroll
    AOS.init({
        duration: 800,
        once: true 
    });

    // 2. Hero Scroll Animation Logic (UNSKIPPABLE stretching)
    const unskippableText = document.querySelector('.main-text');
    // UPDATED: Use a base maximum stretch factor
    const BASE_MAX_STRETCH_FACTOR = 1.8; 
    const MOBILE_MAX_STRETCH_FACTOR = 3.5; // The dramatic stretch value for phones
    const MAX_SCROLL_DISTANCE = 600; 
    let originalTextHeight = 0; 

    function calculateOriginalTextHeight() {
        if (!unskippableText) return 0;
        const currentTransform = unskippableText.style.transform;
        unskippableText.style.transform = 'scaleY(1)';
        const height = unskippableText.offsetHeight;
        unskippableText.style.transform = currentTransform; 
        originalTextHeight = height;
    }
    
    function handleScrollAnimations() {
        if (!unskippableText || originalTextHeight === 0) return;
        
        // BREAKPOINT CHANGE: Now using 440px as the threshold for the more dramatic stretch (3.5)
        const currentMaxStretch = window.innerWidth <= 440 ? MOBILE_MAX_STRETCH_FACTOR : BASE_MAX_STRETCH_FACTOR;
        const STRETCH_RANGE = currentMaxStretch - 1.0; 

        const scrollY = window.scrollY;
        let scrollProgress = Math.min(scrollY / MAX_SCROLL_DISTANCE, 1);
        let scaleY = 1.0 + (scrollProgress * STRETCH_RANGE); 
        unskippableText.style.transform = `scaleY(${scaleY})`;
    }

    if (unskippableText) {
        window.addEventListener('load', () => {
            calculateOriginalTextHeight();
            handleScrollAnimations(); 
        });
        window.addEventListener('resize', () => {
            calculateOriginalTextHeight(); 
            handleScrollAnimations();
        });
        window.addEventListener('scroll', handleScrollAnimations, { passive: true });
        calculateOriginalTextHeight();
        handleScrollAnimations();
    }
    
    
    // ==========================================================
    // 3. Off-Canvas Menu Logic 
    // ==========================================================
    const menuToggle = document.getElementById('menu-toggle');
    const offCanvasMenu = document.getElementById('off-canvas-menu');
    const menuLinks = document.querySelectorAll('.menu-links a');
    const dimmer = document.getElementById('dimmer-overlay');
    const body = document.body;

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

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (offCanvasMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (window.matchMedia("(min-width: 769px)").matches && menuToggle && offCanvasMenu) {
        menuToggle.addEventListener('mouseenter', openMenu);
        offCanvasMenu.addEventListener('mouseleave', closeMenu);
    }
    
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    if (dimmer) {
        dimmer.addEventListener('click', closeMenu);
    }


    // ==========================================================
    // 4. Header Scroll Hiding Logic 
    // ==========================================================
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
    
    // ==========================================================
    // 5. Dynamic Contact Headline Animation 
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

});







    // ==========================================================
    // 3. Off-Canvas Menu Logic 
    // ==========================================================
    const menuToggle = document.getElementById('menu-toggle');
    const offCanvasMenu = document.getElementById('off-canvas-menu');
    const menuLinks = document.querySelectorAll('.menu-links a');
    const dimmer = document.getElementById('dimmer-overlay');
    const body = document.body;

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

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (offCanvasMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (window.matchMedia("(min-width: 769px)").matches && menuToggle && offCanvasMenu) {
        menuToggle.addEventListener('mouseenter', openMenu);
        offCanvasMenu.addEventListener('mouseleave', closeMenu);
    }
    
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    if (dimmer) {
        dimmer.addEventListener('click', closeMenu);
    }


