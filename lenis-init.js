// ============================================================
// SMOOTH SCROLL (Lenis) — shared init, same feel as the about page.
// Falls back to native scrolling if Lenis fails to load or the user
// prefers reduced motion.
// ============================================================
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
        duration: 0.85,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        wheelMultiplier: 1.35,
        touchMultiplier: 1.5,
        smoothWheel: true,
        syncTouch: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}());
