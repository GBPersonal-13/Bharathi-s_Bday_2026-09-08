/**
 * =====================================================================
 * COMPONENT: SAKURA PETAL ENGINE
 * Canvas-based falling sakura petal particle animation
 * Constant, controlled flow maintaining 10-12 visible petals on mobile
 * =====================================================================
 */
(function() {
  "use strict";

  // Configuration for controlled, constant petal flow
  var TOTAL_PETALS = 12;            // Maintains strictly 10 to 12 visible petals on screen
  var INITIAL_ONSCREEN_COUNT = 5;  // Exactly 5 petals visible falling randomly at the start

  function initPetalCanvas(canvas, reduceMotion) {
    if (!canvas || canvas.tagName !== 'CANVAS') return { boost: function() {} };
    var ctx = canvas.getContext('2d');
    if (reduceMotion) return { boost: function() {} };

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

    function createPetal(index) {
      var dpr = window.devicePixelRatio || 1;
      var yPos;
      if (index < INITIAL_ONSCREEN_COUNT) {
        // At starting: 5 petals fall randomly across the visible mobile viewport
        yPos = (0.08 + (index / INITIAL_ONSCREEN_COUNT) * 0.72 + (Math.random() - 0.5) * 0.08) * canvas.height;
      } else {
        // Remaining petals are spaced above the screen to enter one by one in a controlled stream
        yPos = -((index - INITIAL_ONSCREEN_COUNT + 1) * (canvas.height * 0.13) + (18 + Math.random() * 20) * dpr);
      }

      return {
        x: (0.06 + Math.random() * 0.88) * canvas.width,
        y: yPos,
        size: (22 + Math.random() * 14) * dpr,
        speedY: (0.72 + (Math.random() - 0.5) * 0.16) * dpr,
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

    for (var i = 0; i < TOTAL_PETALS; i++) {
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

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dpr = window.devicePixelRatio || 1;

      if (boostIntensity > 0) {
        boostIntensity -= 0.008;
        if (boostIntensity < 0) boostIntensity = 0;
      }

      petals.forEach(function(p) {
        var extraSpeed = boostIntensity * 0.25 * dpr;
        p.y += p.speedY + extraSpeed;
        p.x += p.speedX + Math.sin(p.y * 0.007 * p.swaySpeed + p.phase) * (0.12 + boostIntensity * 0.06) * dpr;
        p.rot += p.rotSpeed * (1 + boostIntensity * 0.4);
        p.flipAngle += p.flipSpeed * (1 + boostIntensity * 0.4);

        // Continuous, controlled wrap: respawns smoothly above the top edge
        // Ensuring 10 to 12 petals remain strictly visible in the mobile screen
        if (p.y > canvas.height + 25 * dpr) {
          p.y = -(15 + Math.random() * 25) * dpr;
          p.x = (0.05 + Math.random() * 0.9) * canvas.width;
          p.speedY = (0.72 + (Math.random() - 0.5) * 0.16) * dpr;
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
        // Festive shimmer effect on existing petals rather than dumping extra particles
        boostIntensity = 1;
      }
    };
  }

  window.initPetalCanvas = initPetalCanvas;
})();
