/* ============================================
   HOW WE WORK SECTION JS
   Approach block animations + interactive canvases
   ============================================ */

(function() {
    // Approach blocks scroll animation
    const approachBlocks = document.querySelectorAll('.approach-block');
    let approachBlocksTriggered = false;

    function updateApproachBlocks() {
        if (approachBlocksTriggered || approachBlocks.length === 0) return;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const firstBlock = approachBlocks[0];
        const blockTop = firstBlock.offsetTop;

        if (scrollY + windowHeight > blockTop + 100) {
            approachBlocks.forEach((block, index) => {
                setTimeout(() => {
                    block.classList.add('visible');
                }, index * 150);
            });
            approachBlocksTriggered = true;
        }
    }

    window.addEventListener('scroll', updateApproachBlocks, { passive: true });
    updateApproachBlocks();

    // Interactive canvas animation helper
    function initCanvasAnimation(canvasId, drawFunc) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        
        const state = {
            w: 0, h: 0, time: 0,
            hovering: false, mouseX: 0, mouseY: 0, raf: 0
        };
        
        function resize() {
            const rect = parent.getBoundingClientRect();
            state.w = rect.width;
            state.h = rect.height;
            canvas.width = state.w;
            canvas.height = state.h;
        }
        
        function updateMouse(e) {
            const rect = canvas.getBoundingClientRect();
            state.mouseX = e.clientX - rect.left;
            state.mouseY = e.clientY - rect.top;
        }
        
        canvas.addEventListener('pointerenter', (e) => { state.hovering = true; updateMouse(e); });
        canvas.addEventListener('pointermove', updateMouse);
        canvas.addEventListener('pointerleave', () => { state.hovering = false; });
        
        function animate() {
            state.time += 0.016;
            ctx.clearRect(0, 0, state.w, state.h);
            drawFunc(ctx, state);
            state.raf = requestAnimationFrame(animate);
        }
        
        resize();
        window.addEventListener('resize', resize);
        animate();
    }

    // Animation 1: Critical System Design - Flow particles navigating constraints
    initCanvasAnimation('systemCanvas', (ctx, state) => {
        if (!state.particles || state.particles.length === 0) {
            state.particles = [];
            state.constraints = [];
            
            const barrierCount = 4;
            for (let i = 0; i < barrierCount; i++) {
                const x = state.w * (0.2 + i * 0.2);
                const gapY = state.h * (0.3 + Math.sin(i) * 0.2);
                const gapSize = state.h * 0.3;
                state.constraints.push({ x, gapY, gapSize });
            }
            
            for (let i = 0; i < 30; i++) {
                state.particles.push({
                    x: -20, y: state.h / 2 + (Math.random() - 0.5) * state.h * 0.4,
                    vx: 1 + Math.random() * 0.5, vy: 0,
                    phase: Math.random() * Math.PI * 2, trail: []
                });
            }
        }
        
        state.constraints.forEach((c, i) => {
            c.gapY = state.h * (0.3 + Math.sin(state.time * 0.5 + i) * 0.15);
        });
        
        ctx.strokeStyle = '#007c87';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        
        state.constraints.forEach(barrier => {
            ctx.beginPath();
            ctx.moveTo(barrier.x, 0);
            ctx.lineTo(barrier.x, barrier.gapY - barrier.gapSize / 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(barrier.x, barrier.gapY + barrier.gapSize / 2);
            ctx.lineTo(barrier.x, state.h);
            ctx.stroke();
            
            ctx.globalAlpha = 0.5;
            const gapTop = barrier.gapY - barrier.gapSize / 2;
            const gapBottom = barrier.gapY + barrier.gapSize / 2;
            
            ctx.beginPath();
            ctx.moveTo(barrier.x - 6, gapTop - 8);
            ctx.lineTo(barrier.x, gapTop - 2);
            ctx.lineTo(barrier.x + 6, gapTop - 8);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(barrier.x - 6, gapBottom + 8);
            ctx.lineTo(barrier.x, gapBottom + 2);
            ctx.lineTo(barrier.x + 6, gapBottom + 8);
            ctx.stroke();
            
            ctx.globalAlpha = 0.3;
        });
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#007c87';
        
        state.particles.forEach(p => {
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 15) p.trail.shift();
            
            let targetY = p.y;
            const lookAhead = 50;
            
            for (let c of state.constraints) {
                if (p.x < c.x && p.x + lookAhead > c.x) {
                    targetY = c.gapY;
                    break;
                }
            }
            
            const dy = targetY - p.y;
            p.vy += dy * 0.01;
            p.vy *= 0.95;
            
            p.x += p.vx;
            p.y += p.vy;
            p.y += Math.sin(state.time * 2 + p.phase) * 0.3;
            
            if (p.x > state.w + 20) {
                p.x = -20;
                p.y = state.h / 2 + (Math.random() - 0.5) * state.h * 0.4;
                p.trail = [];
            }
            
            ctx.globalAlpha = 0.1;
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#007c87';
            if (p.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(p.trail[0].x, p.trail[0].y);
                for (let i = 1; i < p.trail.length; i++) {
                    ctx.lineTo(p.trail[i].x, p.trail[i].y);
                }
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
            let radius = 2.5;
            
            if (state.hovering) {
                const dist = Math.hypot(state.mouseX - p.x, state.mouseY - p.y);
                if (dist < 50) {
                    radius = 2.5 + (1 - dist / 50) * 3;
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = '#007c87';
                }
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        ctx.globalAlpha = 1;
    });

    // Animation 2: Business Model Deconstruction
    initCanvasAnimation('engineerCanvas', (ctx, state) => {
        const cycle = (Math.sin(state.time * 0.5) + 1) / 2;
        
        const centerX = state.w / 2;
        const centerY = state.h / 2;
        
        const blockConfig = [
            { x: 0, y: -1, w: 2, h: 0.8, label: 'Revenue' },
            { x: -1, y: 0, w: 0.9, h: 0.7, label: 'Product' },
            { x: 0.1, y: 0, w: 0.9, h: 0.7, label: 'Market' },
            { x: -0.5, y: 0.8, w: 0.8, h: 0.6, label: 'Ops' },
            { x: 0.5, y: 0.8, w: 0.8, h: 0.6, label: 'Tech' }
        ];
        
        const blockSize = Math.min(state.w, state.h) * 0.12;
        const separation = cycle * 60;
        
        ctx.strokeStyle = '#007c87';
        ctx.fillStyle = '#007c87';
        ctx.lineWidth = 2;
        
        if (cycle < 0.3) {
            ctx.globalAlpha = (0.3 - cycle) / 0.3 * 0.2;
            ctx.lineWidth = 1;
            for (let i = 0; i < blockConfig.length; i++) {
                for (let j = i + 1; j < blockConfig.length; j++) {
                    const b1 = blockConfig[i];
                    const b2 = blockConfig[j];
                    ctx.beginPath();
                    ctx.moveTo(centerX + b1.x * blockSize, centerY + b1.y * blockSize);
                    ctx.lineTo(centerX + b2.x * blockSize, centerY + b2.y * blockSize);
                    ctx.stroke();
                }
            }
        }
        
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        
        blockConfig.forEach((block, idx) => {
            const baseX = centerX + block.x * blockSize;
            const baseY = centerY + block.y * blockSize;
            
            const angle = Math.atan2(block.y, block.x);
            const offsetX = Math.cos(angle) * separation;
            const offsetY = Math.sin(angle) * separation;
            
            const x = baseX + offsetX;
            const y = baseY + offsetY;
            const w = block.w * blockSize;
            const h = block.h * blockSize;
            
            const rotation = cycle * 0.2;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            let isHovered = false;
            if (state.hovering) {
                const dist = Math.hypot(state.mouseX - x, state.mouseY - y);
                if (dist < Math.max(w, h)) {
                    isHovered = true;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#007c87';
                }
            }
            
            ctx.globalAlpha = isHovered ? 1 : 0.7;
            ctx.strokeRect(-w/2, -h/2, w, h);
            
            const cornerSize = 8;
            ctx.beginPath();
            ctx.moveTo(-w/2, -h/2 + cornerSize);
            ctx.lineTo(-w/2, -h/2);
            ctx.lineTo(-w/2 + cornerSize, -h/2);
            ctx.moveTo(w/2 - cornerSize, -h/2);
            ctx.lineTo(w/2, -h/2);
            ctx.lineTo(w/2, -h/2 + cornerSize);
            ctx.moveTo(w/2, h/2 - cornerSize);
            ctx.lineTo(w/2, h/2);
            ctx.lineTo(w/2 - cornerSize, h/2);
            ctx.moveTo(-w/2 + cornerSize, h/2);
            ctx.lineTo(-w/2, h/2);
            ctx.lineTo(-w/2, h/2 - cornerSize);
            ctx.stroke();
            
            ctx.fillStyle = '#007c87';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.restore();
        });
        
        ctx.globalAlpha = 1;
    });

    // Animation 3: AI - Rotating dots around logo
    initCanvasAnimation('aiCanvas', (ctx, state) => {
        const nodeCount = 16;
        const nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = Math.min(state.w, state.h) * 0.35;
            const x = state.w / 2 + Math.cos(angle + state.time * 0.4) * radius;
            const y = state.h / 2 + Math.sin(angle + state.time * 0.4) * radius;
            nodes.push({ x, y, angle: angle + state.time * 0.4 });
        }
        
        ctx.fillStyle = '#007c87';
        
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const sizeVariation = Math.sin(node.angle * 2) * 0.3 + 0.7;
            let radius = 4 * sizeVariation;
            let alpha = 0.6 + sizeVariation * 0.4;
            
            if (state.hovering) {
                const dx = state.mouseX - node.x;
                const dy = state.mouseY - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 60) {
                    radius = 4 + (1 - dist / 60) * 5;
                    alpha = 1;
                    ctx.shadowBlur = 18;
                    ctx.shadowColor = '#007c87';
                }
            }
            
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        ctx.globalAlpha = 1;
    });
})();
