/**
 * =====================================================================
 * COMPONENT: FIREWORKS ENGINE
 * Night sky celebratory bursts for Page 4
 * =====================================================================
 */
(function() {
  "use strict";

  function initFireworks(canvas, reduceMotion) {
    if (!canvas) return { fire: function() {} };
    var ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener('resize', resize);
    if (reduceMotion) {
      return { fire: function() {} };
    }

    var colors = ['#F3C6D3', '#F7DDE4', '#F3D1B8', '#D8CBE8', '#FBF3E1'];
    var particles = [];
    var looping = false;

    function burst(x, y) {
      var color = colors[Math.floor(Math.random() * colors.length)];
      var count = 20 + Math.floor(Math.random() * 10);
      for (var i = 0; i < count; i++) {
        var angle = (Math.PI * 2 * i) / count + Math.random() * 0.25;
        var speed = (1 + Math.random() * 1.7) * devicePixelRatio;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.014 + Math.random() * 0.01,
          size: (1.3 + Math.random() * 1.2) * devicePixelRatio,
          color: color
        });
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function(p) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.018 * devicePixelRatio;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      particles = particles.filter(function(p) { return p.life > 0; });
      if (particles.length > 0) {
        requestAnimationFrame(loop);
      } else {
        looping = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return {
      fire: function() {
        var w = canvas.width, h = canvas.height;
        var i = 0, total = 4;
        (function next() {
          burst(w * (0.22 + Math.random() * 0.56), h * (0.14 + Math.random() * 0.3));
          if (!looping) {
            looping = true;
            loop();
          }
          i++;
          if (i < total) {
            setTimeout(next, 320 + Math.random() * 260);
          }
        })();
      }
    };
  }

  window.initFireworks = initFireworks;
})();
