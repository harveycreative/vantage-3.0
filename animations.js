/**
 * Vantage Method - Animation Script
 * Handles all GSAP and Lenis animations
 */

// Initialize Lenis smooth scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Custom easing (matching KOTA)
const ease = "cubic-bezier(0.75, 0, 0.25, 1)";

// Hero headline animation - staggered line reveals
gsap.to('.hero h1 .line', {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: ease,
    stagger: 0.15,
    delay: 0.3
});

// Hero subtext animation
gsap.to('.hero-subtext', {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: ease,
    delay: 0.9
});

// Value props cards - stagger animation
gsap.to('.prop-card', {
    scrollTrigger: {
        trigger: '.value-props',
        start: 'top 80%',
        end: 'bottom 20%',
    },
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: ease,
    stagger: 0.15
});

// Build cards - stagger animation with hover lift
gsap.to('.build-card', {
    scrollTrigger: {
        trigger: '.build-grid',
        start: 'top 80%',
    },
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: ease,
    stagger: 0.2
});

// Loop items - sequential reveal
gsap.to('.loop-items li', {
    scrollTrigger: {
        trigger: '.loop-section',
        start: 'top 80%',
    },
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: ease,
    stagger: 0.1
});

// Generic fade-in elements
gsap.utils.toArray('.fade-in').forEach((element) => {
    gsap.to(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: ease
    });
});

// Parallax effect on hero
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
    },
    y: 150,
    opacity: 0.3,
    ease: 'none'
});

// Smooth anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, {
                offset: -80,
                duration: 1.5
            });
        }
    });
});

// Header hide/show on scroll
let lastScroll = 0;
const header = document.querySelector('header');

lenis.on('scroll', ({ scroll }) => {
    if (scroll > 100) {
        if (scroll > lastScroll) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScroll = scroll;
});

// Add smooth transition to header
header.style.transition = 'transform 0.3s cubic-bezier(0.75, 0, 0.25, 1)';
