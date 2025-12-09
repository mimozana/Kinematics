// 4. Hero Background Scale/Collapse on Scroll Logic
    const heroImage = document.querySelector('.hero-background-image');
    
    if (heroImage) {
        window.addEventListener('scroll', function() {
            // Get the scroll position (0 at the top)
            const scrollPos = window.scrollY;
            
            // Calculate scale: starts at 1 (100%), increases as scrollPos increases
            // We divide by a large number (e.g., 500) to control the speed of the effect.
            // 1.05 is the minimum scale to prevent the image from showing edges.
            const scaleValue = 1.05 + (scrollPos * 0.0003); 
            
            // Apply the scale transformation
            heroImage.style.transform = `scale(${scaleValue})`;
        });

        // Initialize the scale on page load to the starting value
        heroImage.style.transform = `scale(1.05)`;
    }
}); // End of DOMContentLoaded