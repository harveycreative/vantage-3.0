/* ============================================
   MOUNTAIN SECTIONS JS
   Parallax scrolling, content block visibility,
   rotating text in blocks
   ============================================ */

(function() {
    // Helper: get element's top position relative to the page
    function getPageTop(el) {
        return el.getBoundingClientRect().top + window.scrollY;
    }

    // Block rotating text animation
    const rotatingPhrases = document.querySelectorAll('.rotating-phrase');
    let currentPhraseIndex = 0;

    function rotatePhrase() {
        rotatingPhrases[currentPhraseIndex].classList.remove('active');
        setTimeout(() => {
            currentPhraseIndex = (currentPhraseIndex + 1) % rotatingPhrases.length;
            rotatingPhrases[currentPhraseIndex].classList.add('active');
        }, 500);
    }

    if (rotatingPhrases.length > 0) {
        rotatingPhrases[0].classList.add('active');
        setInterval(rotatePhrase, 3500);
    }

    // Background side mountains scroll animation (Desktop only — hidden on mobile via CSS)
    const leftMountain = document.getElementById('leftMountain');
    const rightMountain = document.getElementById('rightMountain');
    const firstMountainSection = document.getElementById('outcome');

    function updateBackgroundMountains() {
        // Side mountains are hidden on mobile via CSS, but we still update for desktop
        if (window.innerWidth <= 768) return;
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        if (!firstMountainSection) return;
        
        const sectionTop = getPageTop(firstMountainSection);
        const sectionHeight = firstMountainSection.offsetHeight;
        
        const scrollProgress = Math.max(0, Math.min(1, (scrollY - sectionTop + windowHeight) / (sectionHeight + windowHeight)));
        
        const startPosition = -100;
        const endPosition = -600;
        const currentPosition = startPosition + (scrollProgress * (endPosition - startPosition));
        
        if (leftMountain) leftMountain.style.bottom = `${currentPosition}px`;
        if (rightMountain) rightMountain.style.bottom = `${currentPosition}px`;
    }

    window.addEventListener('scroll', updateBackgroundMountains, { passive: true });
    window.addEventListener('resize', updateBackgroundMountains);
    updateBackgroundMountains();

    // Middle mountain layer reveal animation
    const centerMountainMiddle = document.getElementById('centerMountainMiddle');
    const mountainSections = document.querySelectorAll('.mountain-section');

    function updateMiddleMountainReveal() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        if (mountainSections.length === 0) return;
        
        const firstSection = mountainSections[0];
        const lastSection = mountainSections[mountainSections.length - 1];
        
        const sectionTop = getPageTop(firstSection);
        const lastSectionTop = getPageTop(lastSection);
        const bottomSectionBottom = lastSectionTop + lastSection.offsetHeight;
        
        const triggerPoint = sectionTop - (windowHeight / 2);
        const endPoint = bottomSectionBottom - windowHeight;
        
        const totalRevealDistance = endPoint - triggerPoint;
        const scrollProgress = Math.max(0, Math.min(1, (scrollY - triggerPoint) / totalRevealDistance));
        
        const revealPercent = scrollProgress * 100;
        if (centerMountainMiddle) {
            centerMountainMiddle.style.setProperty('--reveal-progress', `${revealPercent}%`);
        }
    }

    window.addEventListener('scroll', updateMiddleMountainReveal, { passive: true });
    updateMiddleMountainReveal();

    // Content blocks visibility animation
    const contentBlocks = [
        { element: document.getElementById('outcomeBlock'), section: document.getElementById('outcome'), triggered: false },
        { element: document.getElementById('howBlock'), section: document.getElementById('how'), triggered: false },
        { element: document.getElementById('whereBlock'), section: document.getElementById('where'), triggered: false }
    ];

    function updateBlocksVisibility() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        contentBlocks.forEach(block => {
            if (!block.element || !block.section || block.triggered) return;

            const sectionTop = getPageTop(block.section);
            const sectionHeight = block.section.offsetHeight;
            const sectionCenter = sectionTop + (sectionHeight / 2);

            if (scrollY + (windowHeight / 2) > sectionCenter - 100) {
                block.element.classList.add('visible');
                block.triggered = true;
            }
        });
    }

    window.addEventListener('scroll', updateBlocksVisibility, { passive: true });
    updateBlocksVisibility();
})();
