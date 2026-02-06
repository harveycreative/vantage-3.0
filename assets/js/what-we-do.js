/* ============================================
   WHAT WE DO SECTION JS
   Pillar card reveal animation on scroll
   ============================================ */

(function() {
    const pillarCards = document.querySelectorAll('.pillar-card');
    let pillarCardsTriggered = false;

    function updatePillarCards() {
        if (pillarCardsTriggered || pillarCards.length === 0) return;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const firstCard = pillarCards[0];
        const cardTop = firstCard.offsetTop;

        if (scrollY + windowHeight > cardTop + 100) {
            pillarCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 150);
            });
            pillarCardsTriggered = true;
        }
    }

    window.addEventListener('scroll', updatePillarCards, { passive: true });
    updatePillarCards();
})();
