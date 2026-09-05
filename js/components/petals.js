/**
 * =====================================================================
 * COMPONENT: SAKURA PETAL ENGINE
 * Canvas-based falling sakura petal particle animation
 * =====================================================================
 */
(function() {
  "use strict";

  function initPetalCanvas(canvas, reduceMotion) {
    if (!canvas || canvas.tagName !== 'CANVAS') return { boost: function() {} };
    var ctx = canvas.getContext('2d');
    var density = canvas.getAttribute('data-density') || 'sparse';
    var count = density === 'normal' ? 16 : 9;
    if (reduceMotion) count = 0;

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
    function make() {
      var dpr = window.devicePixelRatio || 1;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        size: (20 + Math.random() * 16) * dpr,
        speedY: (0.55 + Math.random() * 0.6) * dpr,
        speedX: (Math.random() - 0.5) * 0.22 * dpr,
        swayAmp: (16 + Math.random() * 22) * dpr,
        swaySpeed: 0.75 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.1,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.022 + Math.random() * 0.028,
        opacity: 0.75 + Math.random() * 0.24,
        tone: petalTones[Math.floor(Math.random() * petalTones.length)]
      };
    }
    for (var i = 0; i < count; i++) {
      petals.push(make());
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

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dpr = window.devicePixelRatio || 1;
      petals.forEach(function(p) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.008 * p.swaySpeed + p.phase) * 0.12 * dpr;
        p.rot += p.rotSpeed;
        p.flipAngle += p.flipSpeed;
        if (p.y > canvas.height + 50 * dpr) {
          p.y = -50 * dpr;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -15 * dpr) {
          p.x = canvas.width + 10 * dpr;
        } else if (p.x > canvas.width + 15 * dpr) {
          p.x = -10 * dpr;
        }
        draw(p);
      });
      requestAnimationFrame(loop);
    }
    if (count > 0) {
      loop();
    }

    return {
      boost: function(extra) {
        for (var i = 0; i < extra; i++) {
          petals.push(make());
        }
      }
    };
  }

  window.initPetalCanvas = initPetalCanvas;
})();
