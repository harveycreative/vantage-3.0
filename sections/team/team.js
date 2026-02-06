/* ============================================
   TEAM SECTION JS
   Click-to-expand bio panel, orbit interaction,
   glowing connection arc, scroll reveal
   ============================================ */

(function () {
    const stage   = document.getElementById('tmOrbitStage');
    const header  = document.querySelector('.tm-header');
    const ring    = document.getElementById('tmRing');
    const canvas  = document.getElementById('tmConnectionCanvas');
    const panel   = document.getElementById('tmPanel');
    const closeBtn = document.getElementById('tmPanelClose');
    if (!stage || !ring || !canvas || !panel) return;

    const ctx     = canvas.getContext('2d');
    const members = ring.querySelectorAll('.tm-member');

    /* ---- Canvas sizing ---- */
    function resize() {
        const r = stage.getBoundingClientRect();
        canvas.width  = r.width;
        canvas.height = r.height;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ---- Scroll reveal ---- */
    let headerRevealed = false;
    let stageRevealed  = false;

    function reveal() {
        const vh = window.innerHeight;
        if (header && !headerRevealed) {
            if (header.getBoundingClientRect().top < vh * 0.85) {
                header.classList.add('visible');
                headerRevealed = true;
            }
        }
        if (!stageRevealed) {
            if (stage.getBoundingClientRect().top < vh * 0.78) {
                stage.classList.add('visible');
                stageRevealed = true;
            }
        }
    }
    window.addEventListener('scroll', reveal, { passive: true });
    reveal();

    /* ---- Orbit radius helper (matches CSS) ---- */
    function orbitRadius() {
        const w = window.innerWidth;
        if (w <= 480) return 130;
        if (w <= 768) return 160;
        return 220;
    }

    /* ---- Connection line drawing ---- */
    let activeMember = null;
    let lineAlpha    = 0;

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width  / 2;
        const cy = canvas.height / 2;

        if (activeMember) {
            lineAlpha = Math.min(lineAlpha + 0.08, 1);
        } else {
            lineAlpha = Math.max(lineAlpha - 0.06, 0);
        }

        if (lineAlpha > 0 && activeMember) {
            const idx    = parseInt(activeMember.dataset.idx, 10);
            const cs     = window.getComputedStyle(ring);
            const tf     = cs.transform;
            let ringAngle = 0;
            if (tf && tf !== 'none') {
                const v = tf.split('(')[1].split(')')[0].split(',');
                ringAngle = Math.atan2(parseFloat(v[1]), parseFloat(v[0]));
            }
            const baseAngle = (idx * 45) * (Math.PI / 180) - Math.PI / 2;
            const angle     = baseAngle + ringAngle;
            const r         = orbitRadius();
            const mx = cx + Math.cos(angle) * r;
            const my = cy + Math.sin(angle) * r;

            const grad = ctx.createLinearGradient(cx, cy, mx, my);
            grad.addColorStop(0, 'rgba(0, 124, 135, 0)');
            grad.addColorStop(0.3, `rgba(0, 124, 135, ${0.5 * lineAlpha})`);
            grad.addColorStop(1, `rgba(0, 124, 135, ${0.7 * lineAlpha})`);

            ctx.save();
            ctx.strokeStyle = grad;
            ctx.lineWidth   = 2;
            ctx.shadowColor = 'rgba(0, 124, 135, 0.6)';
            ctx.shadowBlur  = 14 * lineAlpha;
                ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(mx, my);
                ctx.stroke();

            ctx.fillStyle = `rgba(0, 124, 135, ${lineAlpha})`;
            ctx.beginPath();
            ctx.arc(mx, my, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        requestAnimationFrame(drawFrame);
    }
    drawFrame();

    /* ---- Detect mobile (panel goes below) ---- */
    function isMobileLayout() {
        return window.innerWidth <= 1100;
    }

    /* ---- Open expanded panel ---- */
    function openPanel(member) {
        /* If clicking the same member, close */
        if (activeMember === member) {
            closePanel();
            return;
        }

        /* Clear previous */
        members.forEach(m => m.classList.remove('active'));

        activeMember = member;
        ring.classList.add('paused');
        member.classList.add('active');

        /* Populate panel */
        const img = member.dataset.img;
        document.getElementById('tmPanelPhoto').style.backgroundImage = "url('" + img + "')";
        document.getElementById('tmPanelName').textContent = member.dataset.name;
        document.getElementById('tmPanelRole').textContent = member.dataset.title;
        document.getElementById('tmPanelBio').textContent  = member.dataset.bio;

        /* Show panel */
        panel.classList.add('open');

        /* On mobile, scroll to panel */
        if (isMobileLayout()) {
            setTimeout(function () {
                panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }

    /* ---- Close expanded panel ---- */
    function closePanel() {
        members.forEach(m => m.classList.remove('active'));
        panel.classList.remove('open');
        ring.classList.remove('paused');

        /* On mobile, scroll back up to orbit */
        if (isMobileLayout()) {
            setTimeout(function () {
                stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }

        activeMember = null;
    }

    /* ---- Event listeners ---- */

    /* Click on member to open panel */
    members.forEach(function (member) {
        member.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openPanel(member);
        });
    });

    /* Close button */
    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closePanel();
        });
    }

    /* Click outside to close (optional convenience) */
    document.addEventListener('click', function (e) {
        if (activeMember && !e.target.closest('.tm-member') && !e.target.closest('.tm-panel')) {
            closePanel();
        }
    });
})();
