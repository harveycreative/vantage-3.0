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

// Vanta.js TRUNK initialization
// Requires: p5.js and vanta.trunk.min.js loaded before this script
(function() {
    if (typeof VANTA === 'undefined') return;

    var fx = VANTA.TRUNK({
        el: "#vantaBg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.5,
        scaleMobile: 1.5,
        color: 0x14b1ab,
        backgroundColor: 0xffffff,
        spacing: 5,
        chaos: 8,
        speed: 0.2
    });

    setTimeout(function() {
        if (fx && fx.camera) fx.camera.position.y = 150;
    }, 100);
})();
