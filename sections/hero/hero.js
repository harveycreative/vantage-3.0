/* ============================================
   HERO SECTION JS
   Rotating text animation & Vanta.js trunk init
   ============================================ */

// Hero rotating text animation
(function() {
    const heroRotatingPhrases = document.querySelectorAll('.hero-rotating-phrase');
    let currentHeroPhraseIndex = 0;

    function rotateHeroPhrase() {
        heroRotatingPhrases[currentHeroPhraseIndex].classList.remove('active');
        setTimeout(() => {
            currentHeroPhraseIndex = (currentHeroPhraseIndex + 1) % heroRotatingPhrases.length;
            heroRotatingPhrases[currentHeroPhraseIndex].classList.add('active');
        }, 500);
    }

    if (heroRotatingPhrases.length > 0) {
        heroRotatingPhrases[0].classList.add('active');
        setInterval(rotateHeroPhrase, 3500);
    }
})();

// Vanta.js is now initialized inline in index.html for faster loading.
// The effect instance is available at window.__vantaEffect if needed.
