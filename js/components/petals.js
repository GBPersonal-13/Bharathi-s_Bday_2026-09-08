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
      { mid: '#F7DDE4', deep: '#EFC0CE' },
      { mid: '#EFB3C6', deep: '#DD87A2' }
    ];

    var petals = [];
    function make() {
      var dpr = window.devicePixelRatio || 1;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        size: (4.2 + Math.random() * 3.8) * dpr,
        speedY: (0.15 + Math.random() * 0.22) * dpr,
        speedX: (Math.random() - 0.5) * 0.08 * dpr,
        swayAmp: (6 + Math.random() * 9) * dpr,
        swaySpeed: 0.55 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.6,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.015 + Math.random() * 0.02,
        opacity: 0.55 + Math.random() * 0.35,
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

      ctx.strokeStyle = 'rgba(184, 92, 98, 0.28)';
      ctx.lineWidth = Math.max(0.35, s * 0.035);
      ctx.beginPath();
      ctx.moveTo(0, s * 0.75);
      ctx.lineTo(0, -s * 0.55);
      ctx.stroke();
    }

    function draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.scale(Math.cos(p.flipAngle) || 0.05, 1);
      ctx.globalAlpha = p.opacity;
      drawPetalShape(p.size, p.tone);
      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dpr = window.devicePixelRatio || 1;
      petals.forEach(function(p) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01 * p.swaySpeed + p.phase) * 0.05 * dpr;
        p.rot += p.rotSpeed;
        p.flipAngle += p.flipSpeed;
        if (p.y > canvas.height + 20 * dpr) {
          p.y = -20 * dpr;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) {
          p.x = canvas.width - 2 * dpr;
        } else if (p.x > canvas.width) {
          p.x = 2 * dpr;
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
