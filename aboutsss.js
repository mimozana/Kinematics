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