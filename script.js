document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize Animate On Scroll (for sections below the hero)
    AOS.init({
        duration: 800,
        once: true 
    });

    // 2. Hero Scroll Animation Logic (UNSKIPPABLE stretching)
    const unskippableText = document.querySelector('.main-text');
    
    // Configuration for STRETCHING
    const MAX_STRETCH_FACTOR = 1.8; 
    const STRETCH_RANGE = MAX_STRETCH_FACTOR - 1.0; 
    const MAX_SCROLL_DISTANCE = 600; 
    let originalTextHeight = 0; 

    /**
     * Helper to calculate the unscaled height of the text element.
     */
    function calculateOriginalTextHeight() {
        if (!unskippableText) return 0;
        
        // Temporarily reset transform to get the true unscaled height.
        const currentTransform = unskippableText.style.transform;
        unskippableText.style.transform = 'scaleY(1)';
        const height = unskippableText.offsetHeight;
        unskippableText.style.transform = currentTransform; // Restore if needed
        
        originalTextHeight = height;
    }
    
    /**
     * Runs on scroll to apply the kinetic stretching effect (downward only).
     */
    function handleScrollAnimations() {
        if (!unskippableText || originalTextHeight === 0) return;

        const scrollY = window.scrollY;

        // Calculate animation progress: capped at 1.0
        let scrollProgress = Math.min(scrollY / MAX_SCROLL_DISTANCE, 1);
        
        // Calculate the vertical scale: Starts at 1.0 and increases to MAX_STRETCH_FACTOR (1.8)
        let scaleY = 1.0 + (scrollProgress * STRETCH_RANGE); 
        
        // Apply text transformation (Stretching DOWNWARD due to CSS transform-origin: top)
        unskippableText.style.transform = `scaleY(${scaleY})`;
    }

    // A. Initialize the original height and animation listeners
    if (unskippableText) {
        window.addEventListener('load', () => {
            calculateOriginalTextHeight();
            handleScrollAnimations(); // Apply initial state
        });
        window.addEventListener('resize', () => {
            calculateOriginalTextHeight(); // Recalculate if vw changes (as font size is in vw)
            handleScrollAnimations();
        });
        window.addEventListener('scroll', handleScrollAnimations, { passive: true });
        // Initial run in case the page loads scrolled
        calculateOriginalTextHeight();
        handleScrollAnimations();
    }
    
    
    // ==========================================================\
    // 3. Off-Canvas Menu Logic 
    // ==========================================================\
    const menuToggle = document.getElementById('menu-toggle');
    const offCanvasMenu = document.getElementById('off-canvas-menu');
    const menuLinks = document.querySelectorAll('.menu-links a');
    const dimmer = document.getElementById('dimmer-overlay');
    const body = document.body;

    // Helper functions to manage the menu state
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

    // A. Click Toggle (Primary for Mobile/Accessibility)
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (offCanvasMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }


    // B. Hover Toggle (User Request - Desktop Only)
    // Checking if the required elements exist before attaching listeners
    if (window.matchMedia("(min-width: 769px)").matches && menuToggle && offCanvasMenu) {
        
        // 1. OPEN menu when hovering over the icon
        menuToggle.addEventListener('mouseenter', openMenu);
        
        // 2. CLOSE menu when the cursor leaves the red menu area
        offCanvasMenu.addEventListener('mouseleave', closeMenu);
    }
    
    // C. Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // D. Close menu when the dimmed overlay is clicked
    if (dimmer) {
        dimmer.addEventListener('click', closeMenu);
    }
});