/* ============================================
   MOUNTAIN SECTIONS JS
   Smooth parallax scrolling, content block visibility,
   rotating text in blocks
   ============================================ */

(function() {
    // --- Rotating text ---
    var rotatingPhrases = document.querySelectorAll('.rotating-phrase');
    var currentPhraseIndex = 0;

    function rotatePhrase() {
        rotatingPhrases[currentPhraseIndex].classList.remove('active');
        setTimeout(function() {
            currentPhraseIndex = (currentPhraseIndex + 1) % rotatingPhrases.length;
            rotatingPhrases[currentPhraseIndex].classList.add('active');
        }, 500);
    }

    if (rotatingPhrases.length > 0) {
        rotatingPhrases[0].classList.add('active');
        setInterval(rotatePhrase, 3500);
    }

    // --- Cached layout values (recalculated on resize, not every scroll) ---
    var leftMountain = document.getElementById('leftMountain');
    var rightMountain = document.getElementById('rightMountain');
    var firstMountainSection = document.getElementById('outcome');
    var centerMountainMiddle = document.getElementById('centerMountainMiddle');
    var mountainSections = document.querySelectorAll('.mountain-section');

    var layout = {};

    function cacheLayout() {
        var scrollY = window.scrollY;

        if (firstMountainSection) {
            var rect = firstMountainSection.getBoundingClientRect();
            layout.sectionTop = rect.top + scrollY;
            layout.sectionHeight = firstMountainSection.offsetHeight;
        }

        if (mountainSections.length > 0) {
            var first = mountainSections[0];
            var last = mountainSections[mountainSections.length - 1];
            var firstRect = first.getBoundingClientRect();
            var lastRect = last.getBoundingClientRect();

            layout.firstTop = firstRect.top + scrollY;
            layout.lastBottom = lastRect.top + scrollY + last.offsetHeight;
        }

        layout.windowHeight = window.innerHeight;
        layout.isMobile = window.innerWidth <= 768;

        // Cache block positions
        contentBlocks.forEach(function(block) {
            if (block.section) {
                var r = block.section.getBoundingClientRect();
                block.sectionTop = r.top + scrollY;
                block.sectionHeight = block.section.offsetHeight;
            }
        });
    }

    // --- Side mountains parallax (GPU-composited via transform) ---
    var sideMountainY = 0;

    function updateSideMountains(scrollY) {
        if (layout.isMobile || !firstMountainSection) return;

        var progress = Math.max(0, Math.min(1,
            (scrollY - layout.sectionTop + layout.windowHeight) /
            (layout.sectionHeight + layout.windowHeight)
        ));

        // Use translateY instead of bottom for GPU compositing
        var offset = progress * -500;
        if (Math.abs(offset - sideMountainY) < 0.5) return; // skip if barely changed
        sideMountainY = offset;

        var val = 'translateY(' + offset + 'px)';
        if (leftMountain) leftMountain.style.transform = val;
        if (rightMountain) rightMountain.style.transform = val;
    }

    // --- Middle mountain reveal (CSS custom property, lightweight) ---
    var lastReveal = -1;

    function updateReveal(scrollY) {
        if (mountainSections.length === 0 || !centerMountainMiddle) return;

        var triggerPoint = layout.firstTop - (layout.windowHeight / 2);
        var endPoint = layout.lastBottom - layout.windowHeight;
        var totalDistance = endPoint - triggerPoint;

        if (totalDistance <= 0) return;

        var progress = Math.max(0, Math.min(1, (scrollY - triggerPoint) / totalDistance));
        var percent = Math.round(progress * 1000) / 10; // round to 0.1%

        if (percent === lastReveal) return; // skip if unchanged
        lastReveal = percent;

        centerMountainMiddle.style.setProperty('--reveal-progress', percent + '%');
    }

    // --- Content block visibility ---
    var contentBlocks = [
        { element: document.getElementById('outcomeBlock'), section: document.getElementById('outcome'), triggered: false },
        { element: document.getElementById('howBlock'), section: document.getElementById('how'), triggered: false },
        { element: document.getElementById('whereBlock'), section: document.getElementById('where'), triggered: false }
    ];

    function updateBlocks(scrollY) {
        contentBlocks.forEach(function(block) {
            if (!block.element || !block.section || block.triggered) return;

            var sectionCenter = block.sectionTop + (block.sectionHeight / 2);

            if (scrollY + (layout.windowHeight / 2) > sectionCenter - 100) {
                block.element.classList.add('visible');
                block.triggered = true;
            }
        });
    }

    // --- Single rAF-batched scroll handler ---
    var ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                var scrollY = window.scrollY;
                updateSideMountains(scrollY);
                updateReveal(scrollY);
                updateBlocks(scrollY);
                ticking = false;
            });
            ticking = true;
        }
    }

    // --- Init ---
    cacheLayout();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function() {
        cacheLayout();
        onScroll();
    });
})();
