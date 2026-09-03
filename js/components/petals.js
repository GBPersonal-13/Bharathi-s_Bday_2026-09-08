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
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
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
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        size: (7 + Math.random() * 7) * devicePixelRatio,
        speedY: (0.16 + Math.random() * 0.26) * devicePixelRatio,
        speedX: (Math.random() - 0.5) * 0.12 * devicePixelRatio,
        swayAmp: (10 + Math.random() * 16) * devicePixelRatio,
        swaySpeed: 0.6 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.7,
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
      ctx.lineWidth = Math.max(0.4, s * 0.035);
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
      petals.forEach(function(p) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01 * p.swaySpeed + p.phase) * 0.06 * devicePixelRatio;
        p.rot += p.rotSpeed;
        p.flipAngle += p.flipSpeed;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
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
