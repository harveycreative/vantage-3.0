/* ============================================
   GLOBAL JS
   Header scroll behavior, mobile menu, smooth scrolling
   ============================================ */

// Header hide/show on scroll
(function() {
    var lastScroll = 0;
    var header = document.querySelector('header');

    function updateHeader() {
        var scrollY = window.scrollY;
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

// Mobile Menu Toggle
(function() {
    var toggle = document.getElementById('mobileMenuToggle');
    var nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    function openMenu() {
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        nav.classList.add('open');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
    }

    toggle.addEventListener('click', function() {
        if (nav.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when a nav link is clicked
    nav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
})();

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
