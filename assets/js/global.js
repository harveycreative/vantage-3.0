/* ============================================
   GLOBAL JS
   Header scroll behavior & smooth scrolling
   ============================================ */

// Header hide/show on scroll
(function() {
    let lastScroll = 0;
    const header = document.querySelector('header');

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            if (scrollY > lastScroll) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
})();

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
