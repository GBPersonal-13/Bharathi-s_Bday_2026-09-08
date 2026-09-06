/**
 * =====================================================================
 * COMPONENT: SAKURA PETAL ENGINE
 * Canvas-based falling sakura petal particle animation
 * Constant, controlled flow maintaining 10-12 visible petals on mobile
 * With an opening blow / breeze of petals on the landing page
 * =====================================================================
 */
(function() {
  "use strict";

  // Configuration for controlled, constant petal flow
  var TOTAL_PETALS = 12; // Strictly maintains 10 to 12 visible petals on screen

  function initPetalCanvas(canvas, reduceMotion) {
    if (!canvas || canvas.tagName !== 'CANVAS') return { boost: function() {}, breeze: function() {} };
    var ctx = canvas.getContext('2d');
    if (reduceMotion) return { boost: function() {}, breeze: function() {} };

    var isLandingPage = !!canvas.closest('#page-opening');
    // On the landing page, strictly maintain 5 petals; on other pages maintain 12 petals
    var totalPetals = isLandingPage ? 5 : 12;
    var initialOnScreen = isLandingPage ? 5 : 7;

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;

      // Ensure canvas strictly respects mobile container dimensions
      var appEl = canvas.closest('.app');
      if (appEl) {
        var appRect = appEl.getBoundingClientRect();
        if (appRect.width > 0) {
          w = Math.min(w || appRect.width, appRect.width);
        }
        if (appRect.height > 0) {
          h = Math.min(h || appRect.height, appRect.height);
        }
      }

      if (!w || w <= 0) w = Math.min(window.innerWidth || 430, 430);
      if (!h || h <= 0) h = window.innerHeight || 700;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    var petalTones = [
      { mid: '#F3C6D3', deep: '#E39CB4' },
      { mid: '#F7DDE4', deep: '#EAA9BC' },
      { mid: '#EFA6BD', deep: '#D77292' }
    ];

    var petals = [];
    var startTime = Date.now();

    // Map precisely to the 5 blossom positions on the top-left branch
    // Branch SVG is 190px wide at (-10px, -6px) with viewBox 0 0 200 120
    var branchBlossoms = [
      { cx: 45,  cy: 18, delay: 0.50, sizeMult: 1.05 },
      { cx: 75,  cy: 30, delay: 0.38, sizeMult: 1.15 },
      { cx: 110, cy: 45, delay: 0.25, sizeMult: 1.00 },
      { cx: 145, cy: 58, delay: 0.12, sizeMult: 1.20 },
      { cx: 175, cy: 68, delay: 0.00, sizeMult: 1.10 } // Tip of branch blows first!
    ];

    function createPetal(index) {
      var dpr = window.devicePixelRatio || 1;
      var yPos;
      var xPos;

      if (isLandingPage) {
        // Exactly 5 petals start on the 5 cherry blossom branch points and blow down
        var blossom = branchBlossoms[index % 5];
        var branchW = Math.min(canvas.width / dpr, 430) * (190 / 430);
        var scaleX = branchW / 200;
        var startX = (-10 + blossom.cx * scaleX) * dpr;
        var startY = (-6 + blossom.cy * scaleX) * dpr;

        return {
          x: startX,
          y: startY,
          originX: startX,
          originY: startY,
          released: false,
          releaseDelay: blossom.delay,
          size: (22 * blossom.sizeMult + Math.random() * 6) * dpr,
          speedY: (1.25 + (Math.random() - 0.5) * 0.2) * dpr,
          speedX: (0.18 + (Math.random() - 0.5) * 0.15) * dpr,
          swayAmp: (14 + Math.random() * 8) * dpr,
          swaySpeed: 0.85 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          rot: Math.random() * 360,
          rotSpeed: (1.0 + Math.random() * 0.6) * (Math.random() < 0.5 ? 1 : -1),
          flipAngle: Math.random() * Math.PI * 2,
          flipSpeed: 0.022 + Math.random() * 0.02,
          opacity: 0.85 + Math.random() * 0.12,
          tone: petalTones[index % petalTones.length]
        };
      }

      if (index < initialOnScreen) {
        // Distributed across the visible mobile viewport right at start for story/quiz/etc
        yPos = (0.06 + (index / initialOnScreen) * 0.78 + (Math.random() - 0.5) * 0.08) * canvas.height;
        xPos = (0.05 + Math.random() * 0.90) * canvas.width;
      } else {
        // Remaining petals queued above the screen to enter steadily
        yPos = -((index - initialOnScreen + 1) * (canvas.height * 0.14) + (15 + Math.random() * 20) * dpr);
        xPos = (0.05 + Math.random() * 0.90) * canvas.width;
      }

      return {
        x: xPos,
        y: yPos,
        released: true,
        releaseDelay: 0,
        size: (22 + Math.random() * 14) * dpr,
        speedY: (0.85 + (Math.random() - 0.5) * 0.2) * dpr,
        speedX: (Math.random() - 0.5) * 0.2 * dpr,
        swayAmp: (14 + Math.random() * 12) * dpr,
        swaySpeed: 0.8 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.75,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.018 + Math.random() * 0.02,
        opacity: 0.76 + Math.random() * 0.22,
        tone: petalTones[Math.floor(Math.random() * petalTones.length)]
      };
    }

    for (var i = 0; i < totalPetals; i++) {
      petals.push(createPetal(i));
    }

    function drawPetalShape(s, tone) {
      ctx.beginPath();
      ctx.moveTo(0, s);
      ctx.bezierCurveTo(s * 0.9, s * 0.4, s * 0.75, -s * 0.5, s * 0.15, -s * 0.92);
      ctx.quadraticCurveTo(s * 0.05, -s * 1.05, 0, -s * 0.82);
      ctx.quadraticCurveTo(-s * 0.05, -s * 1.05, -s * 0.15, -s * 0.92);
      ctx.bezierCurveTo(-s * 0.75, -s * 0.5, -s * 0.9, s * 0.4, 0, s);
      ctx.closePath();

      var grad = ctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.4, tone.mid);
      grad.addColorStop(1, tone.deep);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(184, 92, 98, 0.35)';
      ctx.lineWidth = Math.max(0.75, s * 0.04);
      ctx.beginPath();
      ctx.moveTo(0, s * 0.75);
      ctx.lineTo(0, -s * 0.55);
      ctx.stroke();
    }

    function draw(p) {
      var dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.scale(Math.cos(p.flipAngle) || 0.05, 1);
      ctx.globalAlpha = p.opacity;
      ctx.shadowColor = 'rgba(184, 92, 98, 0.2)';
      ctx.shadowBlur = 4 * dpr;
      drawPetalShape(p.size, p.tone);
      ctx.restore();
    }

    var boostIntensity = 0;
    // Initial dynamic blow / breeze of petals on the landing page (sweeps gracefully downwards over ~4s)
    var windBreeze = isLandingPage ? 1.4 : 0;

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dpr = window.devicePixelRatio || 1;
      var elapsed = (Date.now() - startTime) / 1000;

      if (boostIntensity > 0) {
        boostIntensity -= 0.008;
        if (boostIntensity < 0) boostIntensity = 0;
      }

      if (windBreeze > 0) {
        windBreeze -= 0.0042; // Gracefully settles over ~4.5 seconds
        if (windBreeze < 0) windBreeze = 0;
      }

      petals.forEach(function(p) {
        if (!p.released) {
          if (elapsed >= p.releaseDelay) {
            p.released = true;
          } else {
            // Sway gently on the branch before detaching
            p.x = p.originX + Math.sin(elapsed * 6 + p.phase) * 1.5 * dpr;
            p.y = p.originY + Math.cos(elapsed * 5 + p.phase) * 1.0 * dpr;
            draw(p);
            return;
          }
        }

        // Wind breeze and boost velocity: predominantly downwards (down 2.2x, across 0.75x)
        var extraSpeedY = (boostIntensity * 0.35 + windBreeze * 2.2) * dpr;
        var extraSpeedX = (boostIntensity * 0.10 + windBreeze * 0.75) * dpr;

        p.y += p.speedY + extraSpeedY;
        p.x += p.speedX + extraSpeedX + Math.sin(p.y * 0.007 * p.swaySpeed + p.phase) * (0.12 + boostIntensity * 0.06 + windBreeze * 0.15) * dpr;
        p.rot += p.rotSpeed * (1 + boostIntensity * 0.5 + windBreeze * 1.8);
        p.flipAngle += p.flipSpeed * (1 + boostIntensity * 0.5 + windBreeze * 1.6);

        // Continuous, controlled wrap: respawns smoothly above the top edge
        // Ensuring petals remain falling in a continuous flow
        if (p.y > canvas.height + 25 * dpr) {
          p.y = -(15 + Math.random() * 25) * dpr;
          p.x = (0.05 + Math.random() * 0.9) * canvas.width;
          p.speedY = (isLandingPage ? (1.18 + Math.random() * 0.25) : (0.85 + Math.random() * 0.2)) * dpr;
          p.speedX = (isLandingPage ? (0.15 + (Math.random() - 0.5) * 0.2) : ((Math.random() - 0.5) * 0.2)) * dpr;
          p.phase = Math.random() * Math.PI * 2;
          p.rot = Math.random() * 360;
        }

        if (p.x < -20 * dpr) {
          p.x = canvas.width + 10 * dpr;
        } else if (p.x > canvas.width + 20 * dpr) {
          p.x = -10 * dpr;
        }

        draw(p);
      });

      requestAnimationFrame(loop);
    }

    loop();

    return {
      boost: function() {
        boostIntensity = 1;
      },
      breeze: function() {
        windBreeze = 1.35;
      }
    };
  }

  window.initPetalCanvas = initPetalCanvas;
})();
