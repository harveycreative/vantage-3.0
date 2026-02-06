/* ============================================
   PRINCIPLES SECTION JS
   Card reveal animation on scroll
   ============================================ */

(function() {
    const principleCards = document.querySelectorAll('.principle-card');
    let principleCardsTriggered = false;

    function updatePrincipleCards() {
        if (principleCardsTriggered || principleCards.length === 0) return;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const principlesSection = document.getElementById('principles');
        
        if (principlesSection) {
            const sectionTop = principlesSection.offsetTop;
            const sectionHeight = principlesSection.offsetHeight;
            const sectionCenter = sectionTop + (sectionHeight / 2);

            if (scrollY + (windowHeight / 2) > sectionCenter - 100) {
                principleCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 200);
                });
                principleCardsTriggered = true;
            }
        }
    }

    window.addEventListener('scroll', updatePrincipleCards, { passive: true });
    updatePrincipleCards();
})();
