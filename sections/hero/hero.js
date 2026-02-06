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

// Vanta.js TRUNK initialization (Hero + Pricing)
// Requires: p5.js and vanta.trunk.min.js loaded before this script
(function() {
    let vantaHeroEffect;
    let vantaPricingEffect;
    
    function initVanta() {
        if (typeof VANTA === 'undefined') return;
        
        // Hero section Vanta effect — targets fixed background div
        if (!vantaHeroEffect) {
            vantaHeroEffect = VANTA.TRUNK({
                el: "#vantaBg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.50,
                scaleMobile: 1.50,
                color: 0x14b1ab,
                backgroundColor: 0xffffff,
                spacing: 5.00,
                chaos: 8.00,
                speed: 0.2
            });
            
            setTimeout(() => {
                if (vantaHeroEffect && vantaHeroEffect.camera) {
                    vantaHeroEffect.camera.position.y = 150;
                }
            }, 100);
        }
        
        // Pricing section Vanta effect
        if (!vantaPricingEffect) {
            vantaPricingEffect = VANTA.TRUNK({
                el: "#pricing",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.50,
                scaleMobile: 1.50,
                color: 0x14b1ab,
                backgroundColor: 0xffffff,
                spacing: 5.00,
                chaos: 8.00,
                speed: 0.2
            });
            
            setTimeout(() => {
                if (vantaPricingEffect && vantaPricingEffect.camera) {
                    vantaPricingEffect.camera.position.y = 150;
                }
            }, 100);
        }
    }
    
    initVanta();
})();
