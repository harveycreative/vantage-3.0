/* ============================================
   TEAM SECTION JS
   Lightning connection lines, orbit interaction,
   bio card positioning, drag functionality
   ============================================ */

(function() {
    const teamCanvas = document.getElementById('teamConnectionLines');
    const teamMembersContainer = document.querySelector('.team-members');
    
    if (!teamCanvas || !teamMembersContainer) return;
    
    const ctx = teamCanvas.getContext('2d');
    const container = teamCanvas.closest('.team-orbit-container');
    
    // Set canvas size
    function resizeTeamCanvas() {
        const rect = container.getBoundingClientRect();
        teamCanvas.width = rect.width;
        teamCanvas.height = rect.height;
    }
    resizeTeamCanvas();
    window.addEventListener('resize', resizeTeamCanvas);
    
    // Lightning effect variables
    let animationTime = 0;
    
    function hashNoise(seed, t) {
        return Math.sin(seed * 999.91 + t * 0.13) * Math.cos(seed * 77.77 + t * 0.09);
    }
    
    function lightningPath(x1, y1, x2, y2, segs, seed, t) {
        const pts = [];
        pts.push({ x: x1, y: y1 });
        for (let i = 1; i < segs; i++) {
            const progress = i / segs;
            const x = x1 + (x2 - x1) * progress;
            const y = y1 + (y2 - y1) * progress;
            const jitterStrength = (1 - Math.abs(0.5 - progress) * 2);
            const n1 = hashNoise(seed + i * 7.1, t * 1000 + animationTime);
            const n2 = hashNoise(seed + i * 13.7, t * 1000 + animationTime * 1.3);
            pts.push({ x: x + n1 * 12 * jitterStrength, y: y + n2 * 12 * jitterStrength });
        }
        pts.push({ x: x2, y: y2 });
        return pts;
    }
    
    // Lightning bolt drawing loop
    function drawConnectionLines() {
        animationTime += 1;
        ctx.clearRect(0, 0, teamCanvas.width, teamCanvas.height);
        
        const centerX = teamCanvas.width / 2;
        const centerY = teamCanvas.height / 2;
        
        // Get current rotation
        const computedStyle = window.getComputedStyle(teamMembersContainer);
        const transform = computedStyle.transform;
        
        let currentRotation = 0;
        if (transform && transform !== 'none') {
            const values = transform.split('(')[1].split(')')[0].split(',');
            const a = parseFloat(values[0]);
            const b = parseFloat(values[1]);
            currentRotation = Math.atan2(b, a);
        }
        
        // Find closest member to top (12 o'clock)
        const teamMembers = document.querySelectorAll('.team-member');
        let closestMember = null;
        let closestDistance = Infinity;
        let closestAngle = 0;
        let closestIndex = -1;
        
        teamMembers.forEach((member, index) => {
            const baseAngle = (index * 45) * (Math.PI / 180);
            const totalAngle = baseAngle + currentRotation;
            
            let normalizedAngle = totalAngle % (2 * Math.PI);
            if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
            
            let distanceFromTop = Math.abs(normalizedAngle);
            if (distanceFromTop > Math.PI) {
                distanceFromTop = 2 * Math.PI - distanceFromTop;
            }
            
            if (distanceFromTop < closestDistance) {
                closestDistance = distanceFromTop;
                closestMember = member;
                closestAngle = totalAngle;
                closestIndex = index;
            }
        });
        
        // Only draw if member is within 60 degrees of top
        const maxDistanceRadians = (60 * Math.PI) / 180;
        
        if (closestMember && closestDistance <= maxDistanceRadians) {
            const isMobile = window.innerWidth < 768;
            const isSmallMobile = window.innerWidth < 480;
            const orbitRadius = isSmallMobile ? 140 : (isMobile ? 160 : 220);
            const memberCenterX = centerX + Math.sin(closestAngle) * orbitRadius;
            const memberCenterY = centerY - Math.cos(closestAngle) * orbitRadius;
            
            const memberCircleRadius = isSmallMobile ? 30 : (isMobile ? 35 : 50);
            const angleToCenter = Math.atan2(centerY - memberCenterY, centerX - memberCenterX);
            
            const memberEdgeX = memberCenterX + Math.cos(angleToCenter) * memberCircleRadius;
            const memberEdgeY = memberCenterY + Math.sin(angleToCenter) * memberCircleRadius;
            
            const textRadius = isSmallMobile ? 22 : (isMobile ? 25 : 30);
            const angleToMember = Math.atan2(memberCenterY - centerY, memberCenterX - centerX);
            
            const centerEdgeX = centerX + Math.cos(angleToMember) * textRadius;
            const centerEdgeY = centerY + Math.sin(angleToMember) * textRadius;
            
            const prevComp = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = 'lighter';
            
            for (let boltNum = 0; boltNum < 3; boltNum++) {
                const segments = 9;
                const seed = closestIndex + 1.23 + (boltNum * 3.7);
                const pts = lightningPath(centerEdgeX, centerEdgeY, memberEdgeX, memberEdgeY, segments, seed, 1);
                
                ctx.beginPath();
                pts.forEach((pt, i) => {
                    if (i === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                });
                
                const phaseShift = boltNum * 2.1;
                const intensity = 0.6 + 0.4 * Math.sin(animationTime * 0.18 + phaseShift);
                const alphaMultiplier = boltNum === 0 ? 1.0 : 0.6;
                const widthMultiplier = boltNum === 0 ? 1.0 : 0.75;
                
                // Rainbow gradient for Randy (index 3)
                if (closestIndex === 3) {
                    const gradient = ctx.createLinearGradient(centerEdgeX, centerEdgeY, memberEdgeX, memberEdgeY);
                    gradient.addColorStop(0, '#FF0000');
                    gradient.addColorStop(0.15, '#FF3300');
                    gradient.addColorStop(0.25, '#FF6600');
                    gradient.addColorStop(0.35, '#FFAA00');
                    gradient.addColorStop(0.5, '#FFFF00');
                    gradient.addColorStop(0.6, '#CCFF33');
                    gradient.addColorStop(0.7, '#66FF66');
                    gradient.addColorStop(0.8, '#00CCFF');
                    gradient.addColorStop(0.9, '#3366FF');
                    gradient.addColorStop(1, '#0000FF');
                    
                    ctx.strokeStyle = gradient;
                    const glowColors = ['#FF0000', '#FFFF00', '#0000FF'];
                    ctx.shadowColor = glowColors[boltNum % 3];
                } else {
                    ctx.strokeStyle = '#007c87';
                    ctx.shadowColor = '#007c87';
                }
                
                ctx.lineWidth = 2.5 * widthMultiplier;
                ctx.globalAlpha = (0.2 + 0.4 * intensity) * alphaMultiplier;
                ctx.shadowBlur = 15 * intensity * alphaMultiplier;
                ctx.stroke();
            }
            
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = prevComp;
        }
        
        requestAnimationFrame(drawConnectionLines);
    }
    
    drawConnectionLines();

    // Team Orbit Interaction (hover + bio card)
    const teamMembers = document.querySelectorAll('.team-member');
    const bioCard = document.getElementById('teamBioCard');
    let currentHoveredMember = null;

    teamMembers.forEach((member, index) => {
        member.addEventListener('mouseenter', function() {
            currentHoveredMember = member;
            
            if (teamMembersContainer) {
                teamMembersContainer.classList.add('paused');
            }

            this.classList.add('active');

            const name = this.getAttribute('data-name');
            const title = this.getAttribute('data-title');
            const bio = this.getAttribute('data-bio');

            bioCard.querySelector('.bio-name').textContent = name;
            bioCard.querySelector('.bio-title').textContent = title;
            bioCard.querySelector('.bio-description').textContent = bio;

            const memberRect = this.getBoundingClientRect();
            const containerRect = this.closest('.team-orbit-container').getBoundingClientRect();
            
            const memberCenterX = memberRect.left + memberRect.width / 2 - containerRect.left;
            const memberCenterY = memberRect.top + memberRect.height / 2 - containerRect.top;
            
            const containerCenterX = containerRect.width / 2;
            
            const expandedPhotoSize = 140;
            const bioCardWidth = 280;
            const gap = 20;
            const viewportPadding = 20;
            
            bioCard.classList.remove('position-left', 'position-right', 'position-top', 'position-bottom');
            
            bioCard.style.visibility = 'hidden';
            bioCard.style.opacity = '1';
            bioCard.classList.add('active');
            const bioCardHeight = bioCard.offsetHeight;
            bioCard.style.visibility = '';
            bioCard.style.opacity = '';
            
            let bioX, bioY, position;
            let finalTransform;
            
            const forcedPositions = [];
            if (memberCenterX < containerCenterX) {
                forcedPositions.push('right', 'left', 'bottom');
            } else {
                forcedPositions.push('left', 'right', 'bottom');
            }
            
            for (const pos of forcedPositions) {
                let testX, testY, testTransform;
                let cardLeft, cardRight, cardTop, cardBottom;
                
                if (pos === 'right') {
                    testX = memberCenterX + (expandedPhotoSize / 2) + gap;
                    testY = memberCenterY;
                    testTransform = 'translateY(-50%)';
                    
                    const absX = containerRect.left + testX;
                    const absY = containerRect.top + testY;
                    cardLeft = absX;
                    cardRight = absX + bioCardWidth;
                    cardTop = absY - (bioCardHeight / 2);
                    cardBottom = absY + (bioCardHeight / 2);
                }
                else if (pos === 'left') {
                    testX = memberCenterX - (expandedPhotoSize / 2) - gap;
                    testY = memberCenterY;
                    testTransform = 'translate(-100%, -50%)';
                    
                    const absX = containerRect.left + testX;
                    const absY = containerRect.top + testY;
                    cardLeft = absX - bioCardWidth;
                    cardRight = absX;
                    cardTop = absY - (bioCardHeight / 2);
                    cardBottom = absY + (bioCardHeight / 2);
                }
                else {
                    testX = memberCenterX;
                    testY = memberCenterY + (expandedPhotoSize / 2) + gap;
                    testTransform = 'translate(-50%, 0)';
                    
                    const absX = containerRect.left + testX;
                    const absY = containerRect.top + testY;
                    cardLeft = absX - (bioCardWidth / 2);
                    cardRight = absX + (bioCardWidth / 2);
                    cardTop = absY;
                    cardBottom = absY + bioCardHeight;
                }
                
                const fitsInViewport = 
                    cardLeft >= viewportPadding &&
                    cardRight <= window.innerWidth - viewportPadding &&
                    cardTop >= viewportPadding &&
                    cardBottom <= window.innerHeight - viewportPadding;
                
                if (fitsInViewport) {
                    bioX = testX;
                    bioY = testY;
                    position = pos;
                    finalTransform = testTransform;
                    break;
                }
            }
            
            if (!position) {
                position = 'bottom';
                bioX = memberCenterX;
                bioY = memberCenterY + (expandedPhotoSize / 2) + gap;
                finalTransform = 'translate(-50%, 0)';
                
                const absX = containerRect.left + bioX;
                const cardHalfWidth = bioCardWidth / 2;
                const minX = viewportPadding + cardHalfWidth;
                const maxX = window.innerWidth - viewportPadding - cardHalfWidth;
                
                if (absX - cardHalfWidth < viewportPadding) {
                    bioX = minX - containerRect.left;
                } else if (absX + cardHalfWidth > window.innerWidth - viewportPadding) {
                    bioX = maxX - containerRect.left;
                }
                
                const absY = containerRect.top + bioY;
                if (absY + bioCardHeight > window.innerHeight - viewportPadding) {
                    bioY = (window.innerHeight - viewportPadding - bioCardHeight) - containerRect.top;
                }
            }
            
            bioCard.style.left = bioX + 'px';
            bioCard.style.top = bioY + 'px';
            bioCard.style.transform = finalTransform;
            bioCard.classList.add('position-' + position);
            
            bioCard.classList.add('active');
        });

        member.addEventListener('mouseleave', function(e) {
            hideBioCard(this);
        });
    });

    function hideBioCard(member) {
        if (member) member.classList.remove('active');
        
        teamMembers.forEach(m => m.classList.remove('active'));
        
        currentHoveredMember = null;
        bioCard.classList.remove('active', 'left', 'right');
        
        if (teamMembersContainer) {
            teamMembersContainer.classList.remove('paused');
        }
    }
})();
