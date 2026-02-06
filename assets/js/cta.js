/* ============================================
   CTA SECTION JS
   Mountain parallax + question card animations
   ============================================ */

(function() {
    // CTA Mountains Scroll Animation
    const ctaLeftMountain = document.querySelector('.cta-left-mountain');
    const ctaRightMountain = document.querySelector('.cta-right-mountain');
    const ctaSection = document.getElementById('contact');

    function updateCtaMountains() {
        if (!ctaSection) return;
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const sectionTop = ctaSection.offsetTop;
        const sectionHeight = ctaSection.offsetHeight;
        
        // Add visible class for highlight animation
        const sectionRect = ctaSection.getBoundingClientRect();
        if (sectionRect.top < windowHeight * 0.8 && !ctaSection.classList.contains('visible')) {
            ctaSection.classList.add('visible');
        }
        
        if (window.innerWidth <= 768) return;
        
        const scrollProgress = Math.max(0, Math.min(1, (scrollY - sectionTop + windowHeight) / (sectionHeight + windowHeight)));
        
        const startPosition = -300;
        const endPosition = -400;
        const currentPosition = startPosition + (scrollProgress * (endPosition - startPosition));
        
        if (ctaLeftMountain) ctaLeftMountain.style.bottom = `${currentPosition}px`;
        if (ctaRightMountain) ctaRightMountain.style.bottom = `${currentPosition}px`;
    }

    window.addEventListener('scroll', updateCtaMountains, { passive: true });
    window.addEventListener('resize', updateCtaMountains);
    updateCtaMountains();

    // CTA Questions Slide-in Animation
    const ctaButton = document.getElementById('ctaButton');
    const ctaQuestionCards = document.querySelectorAll('.cta-question-card');
    const ctaQuestionsContainer = document.getElementById('ctaQuestions');
    let questionsTriggered = false;
    
    function updateCtaQuestions() {
        if (!ctaButton || ctaQuestionCards.length === 0) return;
        
        const buttonRect = ctaButton.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (!questionsTriggered && buttonRect.top < windowHeight && buttonRect.bottom > 0) {
            ctaQuestionCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 150);
            });
            questionsTriggered = true;
        }
        
        if (questionsTriggered && ctaQuestionsContainer && window.innerWidth > 768) {
            const containerRect = ctaQuestionsContainer.getBoundingClientRect();
            
            let progress = 0;
            if (containerRect.top < windowHeight) {
                progress = Math.min(1, Math.max(0, (windowHeight - containerRect.top) / (windowHeight * 0.5)));
            }
            
            const card1Margin = 0 + (progress * 15);
            ctaQuestionCards[0].style.marginLeft = `${card1Margin}%`;
            
            const card2Margin = 0 + (progress * 15);
            ctaQuestionCards[1].style.marginRight = `${card2Margin}%`;
            
            const card3Margin = 5 + (progress * 25);
            ctaQuestionCards[2].style.marginLeft = `${card3Margin}%`;
        }
    }
    
    window.addEventListener('scroll', updateCtaQuestions, { passive: true });
    updateCtaQuestions();
})();
